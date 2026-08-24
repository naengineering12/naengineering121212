from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os

router = APIRouter()

class ChatInput(BaseModel):
    session_id: str
    message: str
    model: str = "gpt"

SYSTEM = {
    "services": "NA Engineering Solutions provides Civil Engineering, HVAC, Mechanical Engineering, PEB Works, Electrical Works, Fire Fighting, Safety & Security Systems, industrial maintenance, and General Order Supplies & Services.",
    "contact": "For a quotation or detailed requirement, please use the Request a Quote form or contact na.engineeringsolutions2023@gmail.com.",
}

def instant_reply(message: str) -> str | None:
    m = message.lower().strip()
    if m in {"hi", "hello", "hey", "hy", "salam", "assalam o alaikum", "aoa"}:
        return "Hello! Welcome to NA Engineering Solutions. How can I help you with our engineering services or general order supplies?"
    if "service" in m or "what do you do" in m or "provide" in m:
        return SYSTEM["services"] + " If you tell me what you need, I can guide you to the relevant service or quotation request."
    if "contact" in m or "email" in m or "phone" in m or "quotation" in m or "quote" in m:
        return SYSTEM["contact"]
    if "general order" in m or "suppl" in m:
        return "We supply mechanical and electrical items, hardware and tools, safety/PPE, facility-maintenance products, office supplies, and industrial/project materials according to customer requirements."
    return None

@router.post("/api/chat")
async def fast_chat(input: ChatInput):
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    reply = instant_reply(message)
    if reply:
        return {"reply": reply, "model": "instant"}
    return JSONResponse(status_code=503, content={"detail": "AI service is temporarily unavailable. Please try again or use Request a Quote."})
