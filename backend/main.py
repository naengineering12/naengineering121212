"""Vercel entrypoint.

The full API (including the resilient MongoDB-primary quote endpoint with
best-effort email notification) lives in server.py. This module simply re-exports
the FastAPI app so Vercel can serve it via `main:app`.
"""
from server import app, handler

__all__ = ["app", "handler"]
