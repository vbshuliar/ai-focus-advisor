"""
Backwards compatibility wrapper.
Imports the app from the refactored structure.

To run: uvicorn main:app --reload --port 8000
"""
from app.main import app

__all__ = ["app"]
