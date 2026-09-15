"""Vercel entrypoint for the FastAPI backend.

The chat endpoint is intentionally resilient and optimized for low latency:
OpenAI streams directly when needed, while simple website FAQs are answered
locally without an external model round-trip.
"""
import asyncio
import json
import os
import re
import secrets
import time
from collections import defaultdict, deque
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
import jwt
from fastapi import HTTPException, Request, Form, UploadFile, File, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field, ConfigDict

from server import app, handler, db, CHAT_SYSTEM, ChatInput as ServerChatInput, QuoteRequest, send_quote_email, AdminLogin as ServerAdminLogin, require_admin, get_object


# ---------------------------------------------------------------------------
# Production API protection
# ---------------------------------------------------------------------------
_RATE_LIMITS = {
    "/api/admin/login": (10, 300),   # 10 attempts / 5 minutes / IP
    "/api/quote": (20, 600),         # 20 submissions / 10 minutes / IP
    "/api/chat": (30, 300),          # 30 messages / 5 minutes / IP
    "/api/status": (20, 600),        # legacy/template endpoint protection
}
_rate_buckets = defaultdict(deque)

_MAX_CHAT_MESSAGE = 2000
_MAX_SESSION_ID = 128
_MAX_NAME = 120
_MAX_COMPANY = 160
_MAX_EMAIL = 254
_MAX_PHONE = 40
_MAX_SERVICE = 160
_MAX_QUOTE_MESSAGE = 5000
_MAX_UPLOAD_BYTES = 8 * 1024 * 1024


def _allowed_origins():
    configured = [x.strip().rstrip("/") for x in os.environ.get("CORS_ORIGINS", "").split(",") if x.strip()]
    if configured and "*" not in configured:
        return set(configured)
    return {
        "https://www.naengineeringsolutions.com",
        "https://naengineeringsolutions.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    }


def _clean_text(value: str, max_len: int, field_name: str, required: bool = False) -> str:
    value = (value or "").strip()
    if required and not value:
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    if len(value) > max_len:
        raise HTTPException(status_code=400, detail=f"{field_name} is too long")
    return value


def _safe_filename(filename: str) -> str:
    name = Path(filename or "attachment").name
    name = re.sub(r"[^A-Za-z0-9._ -]", "_", name).strip(" .")
    if not name:
        name = "attachment"
    return name[:180]


def _validate_email(email: str) -> str:
    email = _clean_text(email, _MAX_EMAIL, "Email", required=True).lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(status_code=400, detail="Please provide a valid email address")
    return email


@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """Reject untrusted browser origins, cap large quote requests and rate-limit APIs."""
    origin = request.headers.get("origin", "").rstrip("/")
    allowed_origins = _allowed_origins()

    if origin and origin not in allowed_origins:
        return JSONResponse(status_code=403, content={"detail": "Origin not allowed"})

    # Stop oversized multipart requests before FastAPI parses the upload.
    if request.method == "POST" and request.url.path == "/api/quote":
        content_length = request.headers.get("content-length")
        try:
            if content_length and int(content_length) > _MAX_UPLOAD_BYTES + 512 * 1024:
                return JSONResponse(status_code=413, content={"detail": "Request is too large"})
        except ValueError:
            return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length"})

    path = request.url.path
    limit_config = _RATE_LIMITS.get(path) if request.method != "OPTIONS" else None
    if limit_config:
        limit, window = limit_config
        client_ip = request.client.host if request.client else "unknown"
        bucket_key = f"{path}:{client_ip}"
        now = time.monotonic()
        bucket = _rate_buckets[bucket_key]
        cutoff = now - window
        while bucket and bucket[0] <= cutoff:
            bucket.popleft()
        if len(bucket) >= limit:
            retry_after = max(1, int(window - (now - bucket[0])))
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={"Retry-After": str(retry_after)},
            )
        bucket.append(now)

    if len(_rate_buckets) > 2000:
        stale_before = time.monotonic() - 900
        stale_keys = [key for key, bucket in _rate_buckets.items() if not bucket or bucket[-1] < stale_before]
        for key in stale_keys[:1000]:
            _rate_buckets.pop(key, None)

    return await call_next(request)


# Remove the original routes that are redefined below with stronger validation.
for route in list(app.routes):
    route_path = getattr(route, "path", None)
    methods = getattr(route, "methods", set()) or set()
    if route_path in {"/api/chat", "/api/quote", "/api/admin/login"} and "POST" in methods:
        app.routes.remove(route)


class ChatInput(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str = Field(min_length=1, max_length=_MAX_SESSION_ID)
    message: str = Field(min_length=1, max_length=_MAX_CHAT_MESSAGE)
    model: str = Field(default="gpt", max_length=32)


class AdminLogin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str = Field(min_length=3, max_length=_MAX_EMAIL)
    password: str = Field(min_length=1, max_length=256)


SESSION_RE = re.compile(r"^[A-Za-z0-9._:-]{1,128}$")


@app.post("/api/admin/login")
async def hardened_admin_login(input: AdminLogin):
    email = _validate_email(input.email)
    password = input.password
    admin_email = (os.environ.get("ADMIN_EMAIL") or "").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD") or ""
    jwt_secret = os.environ.get("JWT_SECRET") or ""
    if not admin_email or not admin_password or not jwt_secret:
        raise HTTPException(status_code=503, detail="Admin authentication is not configured")

    # Constant-time comparisons reduce timing differences during credential checks.
    email_ok = secrets.compare_digest(email, admin_email)
    password_ok = secrets.compare_digest(password, admin_password)
    if not email_ok or not password_ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    payload = {
        "sub": "admin",
        "email": admin_email,
        "type": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return {"token": jwt.encode(payload, jwt_secret, algorithm="HS256"), "email": admin_email}


@app.post("/api/quote", response_model=QuoteRequest)
async def hardened_quote(
    full_name: str = Form(...),
    company_name: str = Form(""),
    email: str = Form(...),
    phone: str = Form(""),
    service_required: str = Form(...),
    message: str = Form(...),
    attachment: UploadFile | None = File(None),
):
    full_name = _clean_text(full_name, _MAX_NAME, "Name", required=True)
    company_name = _clean_text(company_name, _MAX_COMPANY, "Company")
    email = _validate_email(email)
    phone = _clean_text(phone, _MAX_PHONE, "Phone")
    service_required = _clean_text(service_required, _MAX_SERVICE, "Service", required=True)
    message = _clean_text(message, _MAX_QUOTE_MESSAGE, "Message", required=True)

    if attachment and not attachment.filename:
        attachment = None

    attachment_data = None
    if attachment:
        safe_name = _safe_filename(attachment.filename or "attachment")
        extension = Path(safe_name).suffix.lower()
        allowed_extensions = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".jpg", ".jpeg", ".png"}
        allowed_types = {
            "application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv", "image/jpeg", "image/png",
        }
        if extension not in allowed_extensions or (attachment.content_type and attachment.content_type not in allowed_types):
            raise HTTPException(status_code=415, detail="Unsupported attachment type")

        # FastAPI/Starlette normally exposes UploadFile.size. Read in bounded chunks
        # as a second line of defense when size metadata is unavailable.
        if attachment.size and attachment.size > _MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Attachment must be smaller than 8 MB")
        attachment.filename = safe_name
        attachment_data = await attachment.read(_MAX_UPLOAD_BYTES + 1)
        if len(attachment_data) > _MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Attachment must be smaller than 8 MB")

        # Basic signature checks for common image/PDF uploads. Office/CSV files
        # are validated by extension + MIME type because their containers vary.
        signatures = {
            ".pdf": lambda b: b.startswith(b"%PDF-"),
            ".jpg": lambda b: b.startswith(b"\xff\xd8\xff"),
            ".jpeg": lambda b: b.startswith(b"\xff\xd8\xff"),
            ".png": lambda b: b.startswith(b"\x89PNG\r\n\x1a\n"),
        }
        checker = signatures.get(extension)
        if checker and not checker(attachment_data[:16]):
            raise HTTPException(status_code=415, detail="Attachment content does not match its file type")

    attachment_name = attachment.filename if attachment else None
    attachment_path = None
    attachment_content_type = attachment.content_type if attachment else None
    if attachment_data is not None:
        ext = Path(attachment_name or "file").suffix.lower().lstrip(".") or "bin"
        attachment_path = f"na-engineering/uploads/{__import__('uuid').uuid4()}.{ext}"
        if db is not None:
            try:
                # Import lazily so the existing storage implementation remains unchanged.
                from server import put_object
                await asyncio.to_thread(put_object, attachment_path, attachment_data, attachment.content_type or "application/octet-stream")
            except Exception as e:
                # Do not expose storage/provider details to the visitor.
                import logging
                logging.getLogger(__name__).error("Attachment upload failed: %s", e)
                attachment_path = None
                attachment_content_type = None

    record = QuoteRequest(
        full_name=full_name,
        company_name=company_name,
        email=email,
        phone=phone,
        service_required=service_required,
        message=message,
        attachment_name=attachment_name,
        attachment_path=attachment_path,
        attachment_content_type=attachment_content_type,
    )

    db_saved = False
    if db is not None:
        try:
            doc = record.model_dump()
            doc["created_at"] = doc["created_at"].isoformat()
            await db.quote_requests.insert_one(doc)
            db_saved = True
        except Exception as e:
            import logging
            logging.getLogger(__name__).error("Quote database save failed: %s", e)

    email_sent = False
    try:
        await send_quote_email(record, attachment_data)
        email_sent = True
    except Exception as e:
        import logging
        logging.getLogger(__name__).error("Quote email skipped/failed: %s", e)

    if not db_saved and not email_sent:
        raise HTTPException(status_code=503, detail="We could not record your request right now. Please email na.engineeringsolutions2023@gmail.com directly.")
    return record


def _local_fallback(message: str) -> str:
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
    api_key = (os.environ.get("OPENAI_API_KEY") or "").strip()
    if not api_key:
        loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", "AI provider unavailable"))
        return
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "Accept": "text/event-stream"},
            json={"model": model, "messages": messages, "stream": True, "max_completion_tokens": 160},
            timeout=(2, 20),
        )
        if response.status_code >= 400:
            loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", "AI provider request failed"))
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
    except requests.RequestException:
        loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", "AI provider request failed"))
    except Exception:
        loop.call_soon_threadsafe(queue.put_nowait, ("provider_error", "AI provider request failed"))


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
    session_id = input.session_id.strip()
    message = input.message.strip()
    if not SESSION_RE.fullmatch(session_id):
        raise HTTPException(status_code=400, detail="Invalid session id")
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    if len(message) > _MAX_CHAT_MESSAGE:
        raise HTTPException(status_code=400, detail="Message is too long")

    instant = _instant_reply(message)
    if instant:
        async def instant_generator():
            asyncio.create_task(_save_chat(session_id, "visitor", message))
            asyncio.create_task(_save_chat(session_id, "assistant", instant))
            yield f"data: {json.dumps({'delta': instant})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(instant_generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no", "Connection": "keep-alive"})

    history = []
    if db is not None:
        try:
            history = await asyncio.wait_for(
                db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", -1).limit(4).to_list(4),
                timeout=0.35,
            )
            history.reverse()
        except Exception:
            history = []

    context = ""
    if history:
        context = "Conversation so far:\n" + "\n".join(
            f"{m.get('role', 'visitor')}: {str(m.get('text', ''))[:_MAX_CHAT_MESSAGE]}" for m in history
        ) + "\n\nVisitor: "

    prompt = context + message
    messages = [{"role": "system", "content": CHAT_SYSTEM}, {"role": "user", "content": prompt}]
    asyncio.create_task(_save_chat(session_id, "visitor", message))

    async def event_generator():
        parts = []
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
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
        await _save_chat(session_id, "assistant", answer)
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no", "Connection": "keep-alive"})


__all__ = ["app", "handler"]
