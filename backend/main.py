"""Vercel entrypoint for the FastAPI backend.

The chat endpoint is intentionally resilient: it does not depend on MongoDB or
object storage, and it prefers a direct OpenAI API call when OPENAI_API_KEY is
configured. Emergent remains a fallback for environments that still use it.
"""
import json
import os
from datetime import datetime, timezone

import requests
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

from server import app, handler, db, CHAT_SYSTEM, ChatInput

# Object storage is optional. Do not initialize it on every cold start.
for startup_handler in list(app.router.on_startup):
    if getattr(startup_handler, "__name__", "") == "startup_storage":
        app.router.on_startup.remove(startup_handler)

# Remove the original /api/chat route from server.py.
for route in list(app.routes):
    if getattr(route, "path", None) == "/api/chat" and "POST" in (getattr(route, "methods", set()) or set()):
        app.routes.remove(route)


def _openai_answer(messages):
    """Call OpenAI directly and return plain text.

    Using the HTTP API here avoids provider-wrapper initialization failures that
    were producing HTTP 500 responses in the Vercel function.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": os.environ.get("OPENAI_MODEL", "gpt-5.4"),
            "messages": messages,
            "temperature": 0.2,
        },
        timeout=45,
    )
    response.raise_for_status()
    data = response.json()
    return ((data.get("choices") or [{}])[0].get("message") or {}).get("content") or None


async def _emergent_answer(session_id, text):
    """Best-effort Emergent fallback. Never lets a provider error become 500."""
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        return None
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=CHAT_SYSTEM,
        ).with_model("openai", "gpt-5.4")
        parts = []
        async for event in chat.stream_message(UserMessage(text=text)):
            if isinstance(event, TextDelta):
                parts.append(event.content)
            elif isinstance(event, StreamDone):
                break
        return "".join(parts) or None
    except Exception:
        return None


@app.post("/api/chat")
async def resilient_chat(input: ChatInput):
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    history = []
    if db is not None:
        try:
            history = await db.chat_messages.find(
                {"session_id": input.session_id}, {"_id": 0}
            ).sort("created_at", 1).to_list(20)
        except Exception:
            history = []

    context = ""
    if history:
        context = "Conversation so far:\n" + "\n".join(
            f"{m.get('role', 'visitor')}: {m.get('text', '')}" for m in history[-12:]
        ) + "\n\nVisitor: "

    if db is not None:
        try:
            await db.chat_messages.insert_one({
                "session_id": input.session_id,
                "role": "visitor",
                "text": message,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        except Exception:
            pass

    prompt = context + message
    messages = [
        {"role": "system", "content": CHAT_SYSTEM},
        {"role": "user", "content": prompt},
    ]

    # Try direct OpenAI first. This is independent of Emergent object storage.
    answer = None
    try:
        answer = await __import__("asyncio").to_thread(_openai_answer, messages)
    except Exception:
        answer = None

    # Keep compatibility with the existing Emergent integration if OpenAI is not configured.
    if not answer:
        answer = await _emergent_answer(input.session_id, prompt)

    if not answer:
        answer = (
            "I’m temporarily unable to reach the AI service. "
            "Please try again in a moment or use the Request a Quote form."
        )

    if db is not None:
        try:
            await db.chat_messages.insert_one({
                "session_id": input.session_id,
                "role": "assistant",
                "text": answer,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        except Exception:
            pass

    async def event_generator():
        # Preserve the frontend's existing SSE contract.
        yield f"data: {json.dumps({'delta': answer})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


__all__ = ["app", "handler"]
