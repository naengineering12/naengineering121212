#!/usr/bin/env python3
"""
Focused retest of POST /api/quote endpoint after MongoDB-primary fix.
Verifies that quote submission works WITHOUT RESEND_API_KEY configured.
"""
import os
import io
import requests
import json
from pymongo import MongoClient

# Load environment
BASE_URL = "https://64c24aac-5d6f-4068-8d54-b98f875359fa.preview.emergentagent.com"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "na_engineering"

# MongoDB client
mongo_client = MongoClient(MONGO_URL)
db = mongo_client[DB_NAME]

def verify_mongo_record(quote_id):
    """Verify a quote record exists in MongoDB"""
    record = db.quote_requests.find_one({"id": quote_id}, {"_id": 0})
    return record

def test_1_valid_submission_basic():
    """Test 1: Valid submission with required fields only"""
    print("\n" + "="*70)
    print("TEST 1: Valid submission with required fields")
    print("="*70)
    
    payload = {
        "full_name": "Usman Malik",
        "email": "usman.malik@techcorp.pk",
        "service_required": "Mechanical Engineering",
        "message": "We need maintenance services for industrial pumps and motors at our facility in Faisalabad."
    }
    
    print(f"Sending POST {BASE_URL}/api/quote")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(f"{BASE_URL}/api/quote", data=payload, timeout=30)
    
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response Body: {response.text[:500]}")
    
    if response.status_code != 200:
        print(f"❌ FAILED: Expected 200, got {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    data = response.json()
    quote_id = data.get("id")
    
    if not quote_id or not isinstance(quote_id, str):
        print(f"❌ FAILED: Response missing valid UUID 'id' field")
        return False
    
    print(f"✅ Response contains UUID: {quote_id}")
    
    # Verify MongoDB persistence
    print(f"\nVerifying MongoDB persistence...")
    record = verify_mongo_record(quote_id)
    
    if not record:
        print(f"❌ FAILED: Record not found in MongoDB quote_requests collection")
        return False
    
    print(f"✅ Record found in MongoDB:")
    print(f"   - full_name: {record.get('full_name')}")
    print(f"   - email: {record.get('email')}")
    print(f"   - service_required: {record.get('service_required')}")
    print(f"   - message: {record.get('message')[:50]}...")
    
    if record.get("full_name") != payload["full_name"]:
        print(f"❌ FAILED: full_name mismatch")
        return False
    
    if record.get("email") != payload["email"]:
        print(f"❌ FAILED: email mismatch")
        return False
    
    print(f"\n✅ TEST 1 PASSED: Valid submission returns 200 and persists to MongoDB")
    return True

def test_2_valid_submission_with_attachment():
    """Test 2: Valid submission with attachment file"""
    print("\n" + "="*70)
    print("TEST 2: Valid submission with attachment")
    print("="*70)
    
    payload = {
        "full_name": "Sara Ahmed",
        "company_name": "Ahmed Construction Ltd",
        "email": "sara@ahmedconstruction.pk",
        "phone": "+92 321 9876543",
        "service_required": "PEB Works",
        "message": "Require pre-engineered building for warehouse. Specifications attached."
    }
    
    # Create a small PDF-like file
    pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n%%EOF"
    
    print(f"Sending POST {BASE_URL}/api/quote with attachment")
    print(f"Attachment: warehouse_specs.pdf ({len(pdf_content)} bytes)")
    
    response = requests.post(
        f"{BASE_URL}/api/quote",
        data=payload,
        files={"attachment": ("warehouse_specs.pdf", io.BytesIO(pdf_content), "application/pdf")},
        timeout=30
    )
    
    print(f"\nResponse Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ FAILED: Expected 200, got {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    data = response.json()
    quote_id = data.get("id")
    
    print(f"✅ Response contains UUID: {quote_id}")
    
    # Verify MongoDB persistence
    print(f"\nVerifying MongoDB persistence...")
    record = verify_mongo_record(quote_id)
    
    if not record:
        print(f"❌ FAILED: Record not found in MongoDB")
        return False
    
    print(f"✅ Record found in MongoDB:")
    print(f"   - attachment_name: {record.get('attachment_name')}")
    print(f"   - attachment_path: {record.get('attachment_path')}")
    
    if record.get("attachment_name") != "warehouse_specs.pdf":
        print(f"❌ FAILED: attachment_name mismatch")
        return False
    
    print(f"\n✅ TEST 2 PASSED: Valid submission with attachment returns 200 and persists")
    return True

def test_3_missing_required_field():
    """Test 3: Missing required field (email) should return 4xx"""
    print("\n" + "="*70)
    print("TEST 3: Missing required field (email)")
    print("="*70)
    
    payload = {
        "full_name": "Test User",
        "service_required": "Fire Fighting",
        "message": "Need fire extinguisher refilling service"
        # Missing email (required field)
    }
    
    print(f"Sending POST {BASE_URL}/api/quote (missing email)")
    
    response = requests.post(f"{BASE_URL}/api/quote", data=payload, timeout=30)
    
    print(f"\nResponse Status: {response.status_code}")
    
    if response.status_code == 500:
        print(f"❌ FAILED: Got 500 (server error) instead of 4xx validation error")
        print(f"   Response: {response.text}")
        return False
    
    if not (400 <= response.status_code < 500):
        print(f"❌ FAILED: Expected 4xx validation error, got {response.status_code}")
        return False
    
    print(f"✅ Correctly returned {response.status_code} (4xx validation error)")
    print(f"\n✅ TEST 3 PASSED: Missing required field returns 4xx, not 500")
    return True

def test_4_invalid_attachment():
    """Test 4: Invalid attachment extension and oversized file"""
    print("\n" + "="*70)
    print("TEST 4a: Invalid attachment extension (.exe)")
    print("="*70)
    
    payload = {
        "full_name": "Test User",
        "email": "test@example.com",
        "service_required": "Electrical Works",
        "message": "Testing invalid file type"
    }
    
    print(f"Sending POST {BASE_URL}/api/quote with .exe file")
    
    response = requests.post(
        f"{BASE_URL}/api/quote",
        data=payload,
        files={"attachment": ("malicious.exe", io.BytesIO(b"fake exe content"), "application/x-msdownload")},
        timeout=30
    )
    
    print(f"\nResponse Status: {response.status_code}")
    
    if response.status_code == 500:
        print(f"❌ FAILED: Got 500 (server error) instead of 4xx rejection")
        print(f"   Response: {response.text}")
        return False
    
    if not (400 <= response.status_code < 500):
        print(f"❌ FAILED: Expected 4xx rejection, got {response.status_code}")
        return False
    
    print(f"✅ Correctly rejected with {response.status_code} (4xx)")
    
    # Test 4b: Oversized file
    print("\n" + "="*70)
    print("TEST 4b: Oversized attachment (>8MB)")
    print("="*70)
    
    print(f"Sending POST {BASE_URL}/api/quote with 8MB+ file")
    
    large_file = io.BytesIO(b"x" * (8 * 1024 * 1024 + 1))
    
    response = requests.post(
        f"{BASE_URL}/api/quote",
        data=payload,
        files={"attachment": ("large.pdf", large_file, "application/pdf")},
        timeout=40
    )
    
    print(f"\nResponse Status: {response.status_code}")
    
    if response.status_code == 500:
        print(f"❌ FAILED: Got 500 (server error) instead of 4xx rejection")
        print(f"   Response: {response.text}")
        return False
    
    if not (400 <= response.status_code < 500):
        print(f"❌ FAILED: Expected 4xx rejection, got {response.status_code}")
        return False
    
    print(f"✅ Correctly rejected with {response.status_code} (4xx)")
    
    print(f"\n✅ TEST 4 PASSED: Invalid/oversized attachments return 4xx, not 500")
    return True

if __name__ == "__main__":
    print("\n" + "="*70)
    print("QUOTE ENDPOINT RETEST - MongoDB Primary Storage Fix")
    print("="*70)
    print(f"Base URL: {BASE_URL}")
    print(f"Endpoint: POST /api/quote")
    print(f"Context: Testing after fix - MongoDB is now primary storage,")
    print(f"         email is best-effort. Should work WITHOUT RESEND_API_KEY.")
    print("="*70)
    
    results = []
    
    try:
        results.append(("Test 1: Valid submission (basic)", test_1_valid_submission_basic()))
        results.append(("Test 2: Valid submission (with attachment)", test_2_valid_submission_with_attachment()))
        results.append(("Test 3: Missing required field", test_3_missing_required_field()))
        results.append(("Test 4: Invalid/oversized attachment", test_4_invalid_attachment()))
        
        print("\n" + "="*70)
        print("SUMMARY")
        print("="*70)
        
        all_passed = True
        for test_name, passed in results:
            status = "✅ PASSED" if passed else "❌ FAILED"
            print(f"{status}: {test_name}")
            if not passed:
                all_passed = False
        
        print("="*70)
        
        if all_passed:
            print("✅ ALL TESTS PASSED - Quote endpoint working correctly!")
            print("   - Returns 200 even without RESEND_API_KEY")
            print("   - Persists to MongoDB successfully")
            print("   - Handles attachments correctly")
            print("   - Validates input properly (4xx errors, not 500)")
        else:
            print("❌ SOME TESTS FAILED - See details above")
        
        print("="*70)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        mongo_client.close()
