"""Vercel entrypoint for the FastAPI backend.

The chat endpoint is intentionally resilient: OpenAI is used when configured,
but an authentication/provider failure never turns into a 500 or a long wait.
"""
import asyncio
import json
import os
from datetime import datetime, timezone

import requests
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from server import app, handler, db, CHAT_SYSTEM, ChatInput


# Remove the original /api/chat route from server.py so there is exactly one
# production chat implementation.
for route in list(app.routes):
    if getattr(route, "path", None) == "/api/chat" and "POST" in (getattr(route, "methods", set()) or set()):
        app.routes.remove(route)


def _local_fallback(message: str) -> str:
    """Fast, deterministic fallback when an AI provider is unavailable."""
    text = message.lower()
    if any(word in text for word in ("service", "services", "what do you do", "provide")):
        return (
            "NA Engineering Solutions provides Civil Engineering, HVAC, Mechanical Engineering, "
            "PEB, Electrical, Fire Fighting, Safety & Security Systems, IT supplies and General Order Supplies & Services. "
            "For a detailed requirement or quotation, please use the Request a Quote form."
        )
    if any(word in text for word in ("quote", "quotation", "price", "cost", "rate")):
        return (
            "We can prepare a quotation according to your required specification and quantity. "
            "Please submit the Request a Quote form with the item/service details, or contact "
            "na.engineeringsolutions2023@gmail.com."
        )
    if any(word in text for word in ("contact", "email", "phone", "number")):
        return (
            "You can contact NA Engineering Solutions at na.engineeringsolutions2023@gmail.com, "
            "+92 300 8596393 or +92 302 6880398."
        )
    if any(word in text for word in ("location", "address", "lahore")):
        return "Our office is at 593-A Block LDA Avenue-1, Raiwind Road, Lahore, Pakistan."
    return (
        "Thanks for contacting NA Engineering Solutions. I can help with our engineering services, "
        "IT equipment, General Order Supplies & Services, or quotation requirements. Please tell me what you need."
    )


def _openai_stream_worker(messages, model, loop, queue):
    """Run the OpenAI streaming request off the event loop."""
    api_key = (os.environ.get("OPENAI_API_KEY") or "").strip()
    if not api_key:
        loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", "OPENAI_API_KEY is not configured"))
        return

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "stream": True,
            },
            timeout=(5, 35),
        )

        if response.status_code == 401:
            loop.call_soon_threadsafe(
                queue.put_nowait,
                ("provider_error", "OpenAI authentication failed (401)"),
            )
            return
        if response.status_code >= 400:
            detail = response.text[:300].replace("\n", " ")
            loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", f"OpenAI HTTP {response.status_code}: {detail}"))
            return

        for raw_line in response.iter_lines(decode_unicode=True):
            if not raw_line:
                continue
            line = raw_line.strip()
            if line == "data: [DONE]":
                break
            if not line.startswith("data: "):
                continue
            try:
                data = json.loads(line[6:])
                delta = ((data.get("choices") or [{}])[0].get("delta") or {}).get("content")
                if delta:
                    loop.call_soon_threadsafe(queue.put_nowait, ("delta", delta))
            except (ValueError, TypeError, IndexError):
                continue

        loop.call_soon_threadsafe(queue.put_nowait, ("done", None))
    except requests.RequestException as exc:
        loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", str(exc)[:300]))
    except Exception as exc:
        loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", str(exc)[:300]))


async def _save_chat(session_id: str, role: str, text: str):
    if db is None or not text:
        return
    try:
        await asyncio.wait_for(
            db.chat_messages.insert_one({
                "session_id": session_id,
                "role": role,
                "text": text,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }),
            timeout=1.5,
        )
    except Exception:
        # Database problems must never break the visitor's chat response.
        pass


@app.post("/api/chat")
async def resilient_chat(input: ChatInput):
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    history = []
    if db is not None:
        try:
            history = await asyncio.wait_for(
                db.chat_messages.find(
                    {"session_id": input.session_id}, {"_id": 0}
                ).sort("created_at", 1).to_list(8),
                timeout=1.0,
            )
        except Exception:
            history = []

    context = ""
    if history:
        context = "Conversation so far:\n" + "\n".join(
            f"{m.get('role', 'visitor')}: {m.get('text', '')}" for m in history[-6:]
        ) + "\n\nVisitor: "

    prompt = context + message
    messages = [
        {"role": "system", "content": CHAT_SYSTEM},
        {"role": "user", "content": prompt},
    ]

    # Fire-and-forget: MongoDB latency cannot delay the first AI token.
    asyncio.create_task(_save_chat(input.session_id, "visitor", message))

    async def event_generator():
        parts = []
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
        model = os.environ.get("OPENAI_FAST_MODEL", "gpt-5-mini").strip() or "gpt-5-mini"
        asyncio.create_task(asyncio.to_thread(_openai_stream_worker, messages, model, loop, queue))

        provider_failed = False
        while True:
            kind, value = await queue.get()
            if kind == "delta":
                parts.append(value)
                yield f"data: {json.dumps({'delta': value})}\n\n"
            elif kind == "done":
                break
            elif kind == "provider_error":
                provider_failed = True
                break

        # Never retry a broken provider through a second slow integration.
        # Use an instant local response so the website remains functional.
        if provider_failed:
            answer = _local_fallback(message)
            parts = [answer]
            yield f"data: {json.dumps({'delta': answer})}\n\n"

        answer = "".join(parts).strip()
        if not answer:
            answer = _local_fallback(message)
            yield f"data: {json.dumps({'delta': answer})}\n\n"

        await _save_chat(input.session_id, "assistant", answer)
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


__all__ = ["app", "handler"]
