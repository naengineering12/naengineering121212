"""Vercel entrypoint with a resilient quote endpoint.

The original API stores quotes in MongoDB before sending the notification email.
For quote submissions, email delivery must not be blocked just because the
optional database is unavailable, so this entrypoint replaces only that route.
"""
from typing import Optional
import asyncio
import uuid
from pathlib import Path as FilePath

from fastapi import File, Form, HTTPException, UploadFile

from server import (
    app,
    handler,
    QuoteRequest,
    db,
    put_object,
    send_quote_email,
    logger,
)

# Remove the original POST /api/quote route and replace it with the resilient one.
for route in list(app.router.routes):
    if getattr(route, "path", None) == "/api/quote" and "POST" in getattr(route, "methods", set()):
        app.router.routes.remove(route)


@app.post("/api/quote", response_model=QuoteRequest)
async def submit_quote(
    full_name: str = Form(...),
    company_name: str = Form(""),
    email: str = Form(...),
    phone: str = Form(""),
    service_required: str = Form(...),
    message: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
):
    if attachment and not attachment.filename:
        attachment = None

    if attachment and attachment.size and attachment.size > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Attachment must be smaller than 8 MB")

    allowed_extensions = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".jpg", ".jpeg", ".png"}
    allowed_types = {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "image/jpeg",
        "image/png",
    }

    if attachment:
        extension = FilePath(attachment.filename or "").suffix.lower()
        if extension not in allowed_extensions or (
            attachment.content_type and attachment.content_type not in allowed_types
        ):
            raise HTTPException(status_code=415, detail="Unsupported attachment type")

    attachment_name = attachment.filename if attachment else None
    attachment_path = None
    attachment_content_type = None

    if attachment:
        file_data = await attachment.read()
        ext = FilePath(attachment.filename or "file").suffix.lower().lstrip(".") or "bin"
        attachment_path = f"na-engineering/uploads/{uuid.uuid4()}.{ext}"
        attachment_content_type = attachment.content_type
        try:
            await asyncio.to_thread(
                put_object,
                attachment_path,
                file_data,
                attachment.content_type or "application/octet-stream",
            )
        except Exception as exc:
            logger.error(f"Attachment upload failed: {exc}")
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

    # Database is optional for the public quote form; notification email is primary.
    if db is not None:
        try:
            doc = record.model_dump()
            doc["created_at"] = doc["created_at"].isoformat()
            await db.quote_requests.insert_one(doc)
        except Exception as exc:
            logger.error(f"Quote database save failed; continuing with email delivery: {exc}")

    await send_quote_email(record)
    return record


__all__ = ["app", "handler"]
