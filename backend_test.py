# Regression coverage for public status and quote submission APIs.
import os
import io
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

def test_api_root():
    response = requests.get(f"{BASE_URL}/api/", timeout=20)
    assert response.status_code == 200
    assert response.json()["message"] == "NA Engineering Solutions API"

def test_quote_submission_with_attachment():
    payload = {"full_name": "TEST QA Reviewer", "company_name": "TEST Engineering", "email": "qa@example.com", "phone": "+92 300 0000000", "service_required": "HVAC", "message": "TEST quote request"}
    response = requests.post(f"{BASE_URL}/api/quote", data=payload, files={"attachment": ("requirement.csv", io.BytesIO(b"item,qty\npipe,2"), "text/csv")}, timeout=30)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == payload["full_name"]
    assert data["attachment_name"] == "requirement.csv"
    assert isinstance(data["id"], str)

def test_quote_rejects_oversized_attachment():
    payload = {"full_name": "TEST Oversize", "email": "qa@example.com", "service_required": "HVAC", "message": "TEST"}
    response = requests.post(f"{BASE_URL}/api/quote", data=payload, files={"attachment": ("large.bin", io.BytesIO(b"x" * (8 * 1024 * 1024 + 1)), "application/octet-stream")}, timeout=40)
    assert response.status_code == 413