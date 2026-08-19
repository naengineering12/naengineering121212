from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Depends, Header
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
from datetime import datetime, timezone, timedelta
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
import asyncio
import html as html_lib
import jwt
import resend
import requests
from fastapi import Response

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[os.environ.get('DB_NAME', 'na_engineering')] if client else None

app = FastAPI()
handler = app
api_router = APIRouter(prefix="/api")

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
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
    attachment_path: Optional[str] = None
    attachment_content_type: Optional[str] = None
    handled: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.get("/")
async def root():
    return {"message": "NA Engineering Solutions API"}

@api_router.post("/quote", response_model=QuoteRequest)
async def submit_quote(
    full_name: str = Form(...), company_name: str = Form(""), email: str = Form(...),
    phone: str = Form(""), service_required: str = Form(...), message: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
):
    if attachment and not attachment.filename:
        attachment = None
    if attachment and attachment.size and attachment.size > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Attachment must be smaller than 8 MB")
    allowed_extensions = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".jpg", ".jpeg", ".png"}
    allowed_types = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "image/jpeg", "image/png"}
    if attachment:
        extension = FilePath(attachment.filename or "").suffix.lower()
        if extension not in allowed_extensions or (attachment.content_type and attachment.content_type not in allowed_types):
            raise HTTPException(status_code=415, detail="Unsupported attachment type")

    attachment_name = attachment.filename if attachment else None
    attachment_path = None
    attachment_content_type = attachment.content_type if attachment else None
    attachment_data = None
    if attachment:
        attachment_data = await attachment.read()
        ext = FilePath(attachment.filename or "file").suffix.lower().lstrip(".") or "bin"
        attachment_path = f"na-engineering/uploads/{uuid.uuid4()}.{ext}"
        if db is not None:
            try:
                await asyncio.to_thread(put_object, attachment_path, attachment_data, attachment.content_type or "application/octet-stream")
            except Exception as e:
                logger.error(f"Attachment upload failed: {e}")
                attachment_path = None
                attachment_content_type = None

    record = QuoteRequest(full_name=full_name, company_name=company_name, email=email, phone=phone, service_required=service_required, message=message, attachment_name=attachment_name, attachment_path=attachment_path, attachment_content_type=attachment_content_type)

    # Email is the primary delivery mechanism. MongoDB is optional storage only.
    if db is not None:
        try:
            doc = record.model_dump()
            doc["created_at"] = doc["created_at"].isoformat()
            await db.quote_requests.insert_one(doc)
        except Exception as e:
            logger.error(f"Quote database save failed: {e}")

    try:
        await send_quote_email(record, attachment_data)
    except Exception as e:
        logger.error(f"Quote email failed: {e}")
        raise HTTPException(status_code=503, detail="Quote email service is unavailable. Please email na.engineeringsolutions2023@gmail.com directly.")

    return record

async def send_quote_email(record: QuoteRequest, attachment_data: Optional[bytes] = None):
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        raise RuntimeError("RESEND_API_KEY is not configured")
    resend.api_key = api_key
    fields = [("Name", record.full_name), ("Company", record.company_name or "-"), ("Email", record.email), ("Phone", record.phone or "-"), ("Service", record.service_required), ("Message", record.message), ("Attachment", record.attachment_name or "None")]
    rows = "".join(f"<tr><td style='padding:8px 12px;border:1px solid #ddd;color:#555;font-size:13px'>{k}</td><td style='padding:8px 12px;border:1px solid #ddd;font-size:13px'>{html_lib.escape(str(v))}</td></tr>" for k, v in fields)
    params = {"from": os.environ.get("SENDER_EMAIL", "onboarding@resend.dev"), "to": [os.environ.get("NOTIFY_EMAIL", "na.engineeringsolutions2023@gmail.com")], "reply_to": [record.email], "subject": f"New Quote Request - {record.service_required}", "html": f"<div style='font-family:Arial,sans-serif;max-width:560px'><h2 style='color:#0A1128'>New Quote Request</h2><table style='border-collapse:collapse;width:100%'>{rows}</table><p style='color:#888;font-size:11px'>Submitted via the NA Engineering Solutions website.</p></div>"}
    if attachment_data and record.attachment_name:
        import base64
        params["attachments"] = [{"filename": record.attachment_name, "content": base64.b64encode(attachment_data).decode("ascii")}]
    await asyncio.to_thread(resend.Emails.send, params)

JWT_ALGORITHM = "HS256"

class AdminLogin(BaseModel):
    email: str
    password: str

async def require_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    secret = os.environ.get("JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=503, detail="Admin authentication is not configured")
    try:
        payload = jwt.decode(authorization[7:], secret, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    jwt_secret = os.environ.get("JWT_SECRET")
    if not admin_email or not admin_password or not jwt_secret:
        raise HTTPException(status_code=503, detail="Admin authentication is not configured")
    if input.email.lower() != admin_email.lower() or input.password != admin_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    payload = {"sub": "admin", "email": input.email.lower(), "type": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return {"token": jwt.encode(payload, jwt_secret, algorithm=JWT_ALGORITHM), "email": input.email.lower()}

@api_router.get("/admin/quotes")
async def list_quotes(admin=Depends(require_admin)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    return await db.quote_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api_router.get("/admin/chats")
async def list_chats(admin=Depends(require_admin)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    return await db.chat_messages.find({}, {"_id": 0}).sort("created_at", 1).to_list(2000)

CHAT_SYSTEM = (
    "You are the friendly AI assistant on the NA Engineering Solutions website. "
    "NA Engineering Solutions is an engineering, construction, industrial solutions and general order supply company based at 593, A-Block LDA, Avenue-1, Raiwind Road, Lahore, Pakistan. "
    "Services: Civil Engineering, HVAC (installation, GI ducting, ventilation, maintenance), Mechanical Engineering (pumps, motors, conveyors, fabrication, welding, spare parts), PEB Works (pre-engineered buildings, structural steel), Electrical Works (industrial installation, lighting, cables), Fire Fighting (extinguishers, refilling, inspection), Safety & Security Systems (PPE and facility safety). "
    "General Order Supplies & Services: mechanical, electrical, hardware & tools, safety & PPE, facility maintenance, office supplies and industrial/project materials sourced to customer specification. "
    "Contact: na.engineeringsolutions2023@gmail.com, +92 300 8596393, +92 302 6880398. "
    "Answer questions about services, supplies and quotes. Keep answers concise (2-4 sentences), professional and helpful. For pricing or detailed requirements, invite the visitor to use the Request a Quote form. Never invent completed projects or clients."
)

class ChatInput(BaseModel):
    session_id: str
    message: str
    model: str = "gpt"

@api_router.post("/chat")
async def chat_with_ai(input: ChatInput):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    message = input.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    history = await db.chat_messages.find({"session_id": input.session_id}, {"_id": 0}).sort("created_at", 1).to_list(20)
    context = ""
    if history:
        context = "Conversation so far:\n" + "\n".join(f"{m['role']}: {m['text']}" for m in history[-12:]) + "\n\nVisitor: "
    await db.chat_messages.insert_one({"session_id": input.session_id, "role": "visitor", "text": message, "created_at": datetime.now(timezone.utc).isoformat()})
    api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI API key is not configured")
    ai_client = AsyncOpenAI(api_key=api_key)

    async def event_generator():
        parts = []
        response = await ai_client.chat.completions.create(
            model="gpt-5.4",
            messages=[{"role": "system", "content": CHAT_SYSTEM}, {"role": "user", "content": context + message}],
            stream=True,
        )
        async for chunk in response:
            delta = chunk.choices[0].delta.content if chunk.choices else None
            if delta:
                parts.append(delta)
                yield f"data: {json.dumps({'delta': delta})}\n\n"
        await db.chat_messages.insert_one({"session_id": input.session_id, "role": "assistant", "text": "".join(parts), "created_at": datetime.now(timezone.utc).isoformat()})
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

class HandledUpdate(BaseModel):
    handled: bool

@api_router.patch("/admin/quotes/{quote_id}/handled")
async def set_handled(quote_id: str, update: HandledUpdate, admin=Depends(require_admin)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    result = await db.quote_requests.update_one({"id": quote_id}, {"$set": {"handled": update.handled}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"id": quote_id, "handled": update.handled}

@api_router.get("/admin/files/{quote_id}")
async def download_attachment(quote_id: str, admin=Depends(require_admin)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    quote = await db.quote_requests.find_one({"id": quote_id}, {"_id": 0})
    if not quote or not quote.get("attachment_path"):
        raise HTTPException(status_code=404, detail="Attachment not found")
    try:
        data, content_type = await asyncio.to_thread(get_object, quote["attachment_path"])
    except Exception:
        raise HTTPException(status_code=404, detail="File missing from storage")
    filename = quote.get("attachment_name") or "attachment"
    return Response(content=data, media_type=quote.get("attachment_content_type") or content_type, headers={"Content-Disposition": f'attachment; filename="{filename}"'})

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured on Vercel")
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','), allow_methods=["*"], allow_headers=["*"])

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
storage_key = None

def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": content_type}, data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

@app.on_event("startup")
async def startup_storage():
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()
