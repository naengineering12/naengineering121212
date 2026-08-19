"""Compatibility no-op for the existing Vercel build command.

The Vercel project currently runs `python3 fix_build.py && craco build`.
Source-mutating repair logic was removed; this file intentionally does not
modify the frontend source and simply allows the normal build to continue.
"""

if __name__ == "__main__":
    print("Frontend source is left unchanged; continuing with craco build.")
