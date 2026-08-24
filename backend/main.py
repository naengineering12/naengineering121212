"""Vercel entrypoint for the FastAPI backend.

The chat endpoint is intentionally resilient and optimized for low latency:
OpenAI streams directly when needed, while simple website FAQs are answered
locally without an external model round-trip.
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
    """Fast deterministic answers for common website questions."""
    text = message.lower().strip()
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


def _instant_reply(message: str):
    """Return an instant response only for simple, predictable FAQ messages."""
    text = message.lower().strip()
    compact = " ".join(text.split())
    greetings = {
        "hi", "hello", "hey", "hy", "aoa", "salam", "assalamualaikum",
        "assalam o alaikum", "good morning", "good afternoon", "good evening",
    }
    if compact in greetings:
        return "Wa Alaikum Assalam! 👋 How can I help you with NA Engineering Solutions today?"
    if compact in {"thanks", "thank you", "thx", "ok thanks"}:
        return "You're welcome! Please let me know what you need."
    return None


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
                "Accept": "text/event-stream",
            },
            json={
                "model": model,
                "messages": messages,
                "stream": True,
                "max_completion_tokens": 160,
            },
            timeout=(2, 20),
        )

        if response.status_code == 401:
            loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", "OpenAI authentication failed (401)"))
            return
        if response.status_code >= 400:
            detail = response.text[:300].replace("\n", " ")
            loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", f"OpenAI HTTP {response.status_code}: {detail}"))
            return

        for raw_line in response.iter_lines(decode_unicode=True, chunk_size=1):
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
            timeout=1.0,
        )
    except Exception:
        pass


@app.post("/api/chat")
async def resilient_chat(input: ChatInput):
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    # Common greetings should never wait for MongoDB or an AI provider.
    instant = _instant_reply(message)
    if instant:
        async def instant_generator():
            asyncio.create_task(_save_chat(input.session_id, "visitor", message))
            asyncio.create_task(_save_chat(input.session_id, "assistant", instant))
            yield f"data: {json.dumps({'delta': instant})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(
            instant_generator(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no", "Connection": "keep-alive"},
        )

    # Keep history short and fail fast. It must never hold up the AI request.
    history = []
    if db is not None:
        try:
            history = await asyncio.wait_for(
                db.chat_messages.find({"session_id": input.session_id}, {"_id": 0})
                .sort("created_at", -1).limit(4).to_list(4),
                timeout=0.35,
            )
            history.reverse()
        except Exception:
            history = []

    context = ""
    if history:
        context = "Conversation so far:\n" + "\n".join(
            f"{m.get('role', 'visitor')}: {m.get('text', '')}" for m in history
        ) + "\n\nVisitor: "

    prompt = context + message
    messages = [
        {"role": "system", "content": CHAT_SYSTEM},
        {"role": "user", "content": prompt},
    ]

    asyncio.create_task(_save_chat(input.session_id, "visitor", message))

    async def event_generator():
        parts = []
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
        # Smaller model + short output keeps first-token latency and total response time low.
        model = os.environ.get("OPENAI_FAST_MODEL", "gpt-5.4-mini").strip() or "gpt-5.4-mini"
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
