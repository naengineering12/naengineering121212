"""Final production security layer for the FastAPI/Vercel backend."""
import os

import jwt
from fastapi import Request
from fastapi.responses import JSONResponse


ALLOWED_ORIGINS = {
    "https://www.naengineeringsolutions.com",
    "https://naengineeringsolutions.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}
ALLOWED_METHODS = {"GET", "POST", "PATCH", "OPTIONS"}
ALLOWED_HEADERS = {"accept", "content-type", "authorization"}
MAX_BODY_BYTES = 12 * 1024 * 1024


def _strip_header(headers, name):
    try:
        headers.pop(name)
    except KeyError:
        pass


def _apply_cors(response, origin):
    for name in (
        "access-control-allow-origin",
        "access-control-allow-credentials",
        "access-control-allow-methods",
        "access-control-allow-headers",
        "access-control-max-age",
    ):
        _strip_header(response.headers, name)
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Vary"] = "Origin"


def _security_headers(response, path):
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
    if path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Robots-Tag"] = "noindex, nofollow"


def _validate_admin_token(authorization: str) -> bool:
    if not authorization.startswith("Bearer "):
        return False
    token = authorization[7:].strip()
    secret = (os.environ.get("JWT_SECRET") or "").strip()
    if not secret or not token or len(token) > 4096:
        return False
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return False
    return (
        payload.get("type") == "admin"
        and payload.get("sub") == "admin"
        and isinstance(payload.get("email"), str)
        and bool(payload.get("email"))
    )


def apply_security_hardening(app):
    """Apply strict CORS, API headers, body limits and defense-in-depth auth."""
    # The template status endpoints are not used by the current frontend.
    # Removing them reduces public write/read surface area.
    for route in list(app.routes):
        if getattr(route, "path", None) in {"/api/status", "/api/status/"}:
            app.routes.remove(route)

    @app.middleware("http")
    async def final_security_layer(request: Request, call_next):
        origin = request.headers.get("origin", "").rstrip("/")
        if origin and origin not in ALLOWED_ORIGINS:
            return JSONResponse(status_code=403, content={"detail": "Origin not allowed"})

        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_BODY_BYTES:
                    return JSONResponse(status_code=413, content={"detail": "Request is too large"})
            except ValueError:
                return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length"})

        authorization = request.headers.get("authorization", "")
        if len(authorization) > 8192:
            return JSONResponse(status_code=400, content={"detail": "Authorization header is too large"})

        path = request.url.path
        if path.startswith("/api/admin/") and path != "/api/admin/login":
            if not _validate_admin_token(authorization):
                return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

        if request.method == "OPTIONS" and origin:
            requested_method = request.headers.get("access-control-request-method", "GET").upper()
            requested_headers = {
                h.strip().lower()
                for h in request.headers.get("access-control-request-headers", "").split(",")
                if h.strip()
            }
            if requested_method not in ALLOWED_METHODS:
                return JSONResponse(status_code=400, content={"detail": "CORS method not allowed"})
            if not requested_headers.issubset(ALLOWED_HEADERS):
                return JSONResponse(status_code=400, content={"detail": "CORS header not allowed"})
            response = JSONResponse(content=None, status_code=204)
            _apply_cors(response, origin)
            response.headers["Access-Control-Allow-Methods"] = ", ".join(sorted(ALLOWED_METHODS))
            response.headers["Access-Control-Allow-Headers"] = ", ".join(sorted(ALLOWED_HEADERS))
            response.headers["Access-Control-Max-Age"] = "600"
            _security_headers(response, path)
            return response

        response = await call_next(request)
        _apply_cors(response, origin)
        _security_headers(response, path)
        return response

    return app
