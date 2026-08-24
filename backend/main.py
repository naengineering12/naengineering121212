"""Fast, resilient Vercel entrypoint for the FastAPI backend."""
import asyncio
import json
import os
from datetime import datetime, timezone

import requests
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

from server import app, handler, db, CHAT_SYSTEM, ChatInput

# Object storage is optional. Never initialize it on every cold start.
for startup_handler in list(app.router.on_startup):
    if getattr(startup_handler, "__name__", "") == "startup_storage":
        app.router.on_startup.remove(startup_handler)

# Replace server.py's old chat route with this resilient implementation.
for route in list(app.routes):
    if getattr(route, "path", None) == "/api/chat" and "POST" in (getattr(route, "methods", set()) or set()):
        app.routes.remove(route)


def _openai_stream_worker(messages, model, loop, queue):
    """Run the blocking OpenAI HTTP stream in a worker thread."""
    try:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            loop.call_soon_threadsafe(queue.put_nowait, ("missing", None))
            return

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
            timeout=(10, 45),
        )
        response.raise_for_status()

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
            except (ValueError, TypeError):
                continue
        loop.call_soon_threadsafe(queue.put_nowait, ("done", None))
    except Exception as exc:
        loop.call_soon_threadsafe(queue.put_nowait, ("error", str(exc)))


async def _emergent_stream(session_id, text):
    """Fallback provider stream."""
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        return
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=CHAT_SYSTEM,
        ).with_model("openai", "gpt-5.4")
        async for event in chat.stream_message(UserMessage(text=text)):
            if isinstance(event, TextDelta):
                yield event.content
            elif isinstance(event, StreamDone):
                break
    except Exception:
        return


@app.post("/api/chat")
async def resilient_chat(input: ChatInput):
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    # Conversation history is optional; a failed/slow database must never block AI.
    history = []
    if db is not None:
        try:
            history = await asyncio.wait_for(
                db.chat_messages.find(
                    {"session_id": input.session_id}, {"_id": 0}
                ).sort("created_at", 1).to_list(8),
                timeout=1.5,
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

    # Save the visitor message without making the visitor wait for MongoDB.
    if db is not None:
        asyncio.create_task(db.chat_messages.insert_one({
            "session_id": input.session_id,
            "role": "visitor",
            "text": message,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }))

    async def event_generator():
        parts = []
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
        model = os.environ.get("OPENAI_FAST_MODEL", "gpt-5-mini")
        worker = asyncio.create_task(asyncio.to_thread(_openai_stream_worker, messages, model, loop, queue))

        openai_failed = False
        while True:
            kind, value = await queue.get()
            if kind == "delta":
                parts.append(value)
                yield f"data: {json.dumps({'delta': value})}\n\n"
            elif kind == "done":
                break
            elif kind in ("missing", "error"):
                openai_failed = True
                break

        if openai_failed:
            # Fall back to the existing Emergent streaming integration.
            parts = []
            async for chunk in _emergent_stream(input.session_id, prompt):
                parts.append(chunk)
                yield f"data: {json.dumps({'delta': chunk})}\n\n"

        answer = "".join(parts).strip()
        if not answer:
            answer = "I’m temporarily unable to reach the AI service. Please try again in a moment or use the Request a Quote form."
            yield f"data: {json.dumps({'delta': answer})}\n\n"

        if db is not None and answer:
            try:
                await asyncio.wait_for(
                    db.chat_messages.insert_one({
                        "session_id": input.session_id,
                        "role": "assistant",
                        "text": answer,
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    }),
                    timeout=1.5,
                )
            except Exception:
                pass

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
