"""Vercel entrypoint.

The full API lives in server.py. This module re-exports the FastAPI app and
replaces the chat route with a resilient version that does not require MongoDB
just to generate an AI response.
"""
import json
import os
from datetime import datetime, timezone

from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

from server import app, handler, db, CHAT_SYSTEM, ChatInput

# Remove the old /api/chat route. The old implementation returned 503 whenever
# MongoDB was not configured, which made the public chat widget fail even when
# the AI provider itself was available.
for route in list(app.routes):
    if getattr(route, "path", None) == "/api/chat" and "POST" in (getattr(route, "methods", set()) or set()):
        app.routes.remove(route)


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

    api_key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI API key is not configured")

    # Keep the currently working GPT-5.4 provider/model. The frontend model
    # selector is preserved, while this route guarantees the default GPT chat
    # works without a MongoDB dependency.
    chat = LlmChat(
        api_key=api_key,
        session_id=input.session_id,
        system_message=CHAT_SYSTEM,
    ).with_model("openai", "gpt-5.4")

    async def event_generator():
        parts = []
        try:
            async for event in chat.stream_message(UserMessage(text=context + message)):
                if isinstance(event, TextDelta):
                    parts.append(event.content)
                    yield f"data: {json.dumps({'delta': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    break
        except Exception as exc:
            # Return a useful chat message instead of leaving the frontend with
            # an empty stream/failure state.
            fallback = "I’m temporarily unable to reach the AI service. Please try again in a moment or use the Request a Quote form."
            yield f"data: {json.dumps({'delta': fallback})}\n\n"

        if db is not None and parts:
            try:
                await db.chat_messages.insert_one({
                    "session_id": input.session_id,
                    "role": "assistant",
                    "text": "".join(parts),
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })
            except Exception:
                pass

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


__all__ = ["app", "handler"]
