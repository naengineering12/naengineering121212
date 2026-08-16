from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import json
from pathlib import Path as FilePath
from datetime import datetime, timezone
from fastapi.responses import StreamingResponse
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class QuoteRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    company_name: str = ""
    email: str
    phone: str = ""
    service_required: str
    message: str
    attachment_name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "NA Engineering Solutions API"}

@api_router.post("/quote", response_model=QuoteRequest)
async def submit_quote(
    full_name: str = Form(...), company_name: str = Form(""), email: str = Form(...),
    phone: str = Form(""), service_required: str = Form(...), message: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
):
    if attachment and attachment.size and attachment.size > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Attachment must be smaller than 8 MB")
    allowed_extensions = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".jpg", ".jpeg", ".png"}
    allowed_types = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                     "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                     "text/csv", "image/jpeg", "image/png"}
    if attachment:
        extension = FilePath(attachment.filename or "").suffix.lower()
        if extension not in allowed_extensions or (attachment.content_type and attachment.content_type not in allowed_types):
            raise HTTPException(status_code=415, detail="Unsupported attachment type")
    attachment_name = attachment.filename if attachment else None
    record = QuoteRequest(full_name=full_name, company_name=company_name, email=email,
                          phone=phone, service_required=service_required, message=message,
                          attachment_name=attachment_name)
    doc = record.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.quote_requests.insert_one(doc)
    return record

CHAT_SYSTEM = (
    "You are the friendly AI assistant on the NA Engineering Solutions website. "
    "NA Engineering Solutions is an engineering, construction, industrial solutions and general order supply company based at 593, A-Block LDA, Avenue-1, Raiwind Road, Lahore, Pakistan. "
    "Services: Civil Engineering, HVAC (installation, GI ducting, ventilation, maintenance), Mechanical Engineering (pumps, motors, conveyors, fabrication, welding, spare parts), PEB Works (pre-engineered buildings, structural steel), Electrical Works (industrial installation, lighting, cables), Fire Fighting (extinguishers, refilling, inspection), Safety & Security Systems (PPE and facility safety). "
    "General Order Supplies & Services: mechanical, electrical, hardware & tools, safety & PPE, facility maintenance, office supplies and industrial/project materials sourced to customer specification. "
    "Contact: na.engineeringsolutions2023@gmail.com, +92 300 9596393, +92 302 6880298. "
    "Answer questions about services, supplies and quotes. Keep answers concise (2-4 sentences), professional and helpful. For pricing or detailed requirements, invite the visitor to use the Request a Quote form. Never invent completed projects or clients."
)

class ChatInput(BaseModel):
    session_id: str
    message: str

@api_router.post("/chat")
async def chat_with_ai(input: ChatInput):
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    history = await db.chat_messages.find({"session_id": input.session_id}, {"_id": 0}).sort("created_at", 1).to_list(20)
    context = ""
    if history:
        context = "Conversation so far:\n" + "\n".join(f"{m['role']}: {m['text']}" for m in history[-12:]) + "\n\nVisitor: "
    await db.chat_messages.insert_one({"session_id": input.session_id, "role": "visitor", "text": message, "created_at": datetime.now(timezone.utc).isoformat()})
    chat = LlmChat(api_key=os.environ["EMERGENT_LLM_KEY"], session_id=f"na-{input.session_id}", system_message=CHAT_SYSTEM).with_model("openai", "gpt-5.4")
    async def event_generator():
        parts = []
        async for event in chat.stream_message(UserMessage(text=context + message)):
            if isinstance(event, TextDelta):
                parts.append(event.content)
                yield f"data: {json.dumps({'delta': event.content})}\n\n"
            elif isinstance(event, StreamDone):
                break
        await db.chat_messages.insert_one({"session_id": input.session_id, "role": "assistant", "text": "".join(parts), "created_at": datetime.now(timezone.utc).isoformat()})
        yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()