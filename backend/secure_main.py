"""Production entrypoint: load the existing app, then apply final hardening."""
from main import app, handler
from security_hardening import apply_security_hardening

apply_security_hardening(app)

__all__ = ["app", "handler"]
