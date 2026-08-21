"""Optional safety-image patch hook.

The production build command expects this hook to exist. The current source
already contains the required Safety & Security imagery, so this hook is
intentionally a no-op and keeps the build deterministic.
"""

print("Safety image patch: no changes required.")
