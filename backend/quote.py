from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
import asyncio
import base64
import html
import os
import uuid
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

app = FastAPI()
handler = app
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".jpg", ".jpeg", ".png"}

class QuoteResponse(BaseModel):
    id: str
    full_name: str
    company_name: str = ""
    email: str
    phone: str = ""
    service_required: str
    message: str
    attachment_name: Optional[str] = None
    handled: bool = False
    created_at: datetime


def email_row(label: str, value: str) -> str:
    return (
        "<tr>"
        f"<td style='padding:8px 12px;border:1px solid #ddd;color:#555;font-size:13px'>{html.escape(label)}</td>"
        f"<td style='padding:8px 12px;border:1px solid #ddd;font-size:13px'>{html.escape(value or '-')}</td>"
        "</tr>"
    )


async def send_quote_email(
    *,
    full_name: str,
    company_name: str,
    email: str,
    phone: str,
    service_required: str,
    message: str,
    attachment_name: Optional[str],
    attachment_bytes: Optional[bytes],
    attachment_content_type: Optional[str],
) -> None:
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Quote email service is not configured")

    recipient = "na.engineeringsolutions2023@gmail.com"
    sender = os.environ.get("SENDER_EMAIL") or os.environ.get("RESEND_FROM_EMAIL") or "onboarding@resend.dev"
    resend.api_key = api_key

    rows = "".join([
        email_row("Name", full_name),
        email_row("Company", company_name),
        email_row("Email", email),
        email_row("Phone", phone),
        email_row("Service", service_required),
        email_row("Message", message),
        email_row("Attachment", attachment_name or "None"),
    ])

    params = {
        "from": sender,
        "to": [recipient],
        "reply_to": [email],
        "subject": f"New Quote Request - {service_required}",
        "html": (
            "<div style='font-family:Arial,sans-serif;max-width:620px'>"
            "<h2 style='color:#0A1128;margin-bottom:18px'>New Quote Request</h2>"
            f"<table style='border-collapse:collapse;width:100%'>{rows}</table>"
            "<p style='color:#888;font-size:11px;margin-top:16px'>"
            "Submitted via the NA Engineering Solutions website. Reply directly to this email to contact the requester."
            "</p></div>"
        ),
    }

    if attachment_bytes and attachment_name:
        params["attachments"] = [{
            "filename": attachment_name,
            "content": base64.b64encode(attachment_bytes).decode("ascii"),
            "content_type": attachment_content_type or "application/octet-stream",
        }]

    try:
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not send quote email: {exc}")


@app.post("/api/quote", response_model=QuoteResponse)
async def submit_quote(
    full_name: str = Form(...),
    company_name: str = Form(""),
    email: str = Form(...),
    phone: str = Form(""),
    service_required: str = Form(...),
    message: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
):
    attachment_name = None
    attachment_bytes = None
    attachment_content_type = None

    if attachment and attachment.filename:
        attachment_name = attachment.filename
        attachment_content_type = attachment.content_type
        attachment_bytes = await attachment.read()
        if len(attachment_bytes) > MAX_ATTACHMENT_BYTES:
            raise HTTPException(status_code=413, detail="Attachment must be smaller than 8 MB")
        extension = Path(attachment_name).suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=415, detail="Unsupported attachment type")

    # Email is intentionally the primary delivery path. A database outage cannot
    # prevent a customer quote from reaching the company inbox.
    await send_quote_email(
        full_name=full_name.strip(),
        company_name=company_name.strip(),
        email=email.strip(),
        phone=phone.strip(),
        service_required=service_required.strip(),
        message=message.strip(),
        attachment_name=attachment_name,
        attachment_bytes=attachment_bytes,
        attachment_content_type=attachment_content_type,
    )

    return QuoteResponse(
        id=str(uuid.uuid4()),
        full_name=full_name,
        company_name=company_name,
        email=email,
        phone=phone,
        service_required=service_required,
        message=message,
        attachment_name=attachment_name,
        created_at=datetime.now(timezone.utc),
    )
