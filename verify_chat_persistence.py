import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def check_chat_persistence():
    mongo_url = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(mongo_url)
    db = client["na_engineering"]
    
    # Get all chat messages
    messages = await db.chat_messages.find({}, {"_id": 0}).sort("created_at", 1).to_list(100)
    
    print(f"\n{'='*70}")
    print(f"Chat Messages in MongoDB: {len(messages)} total")
    print(f"{'='*70}\n")
    
    if messages:
        # Group by session_id
        sessions = {}
        for msg in messages:
            sid = msg.get("session_id", "unknown")
            if sid not in sessions:
                sessions[sid] = []
            sessions[sid].append(msg)
        
        print(f"Found {len(sessions)} unique session(s)\n")
        
        for sid, msgs in sessions.items():
            print(f"Session: {sid}")
            print(f"  Messages: {len(msgs)}")
            for msg in msgs:
                role = msg.get("role", "unknown")
                text = msg.get("text", "")
                preview = text[:80] + "..." if len(text) > 80 else text
                print(f"    [{role}] {preview}")
            print()
        
        # Check if we have both visitor and assistant messages
        has_visitor = any(m.get("role") == "visitor" for m in messages)
        has_assistant = any(m.get("role") == "assistant" for m in messages)
        
        if has_visitor and has_assistant:
            print("✅ Chat persistence verified: Both visitor and assistant messages found")
        else:
            print(f"⚠️  Incomplete persistence: visitor={has_visitor}, assistant={has_assistant}")
    else:
        print("❌ No chat messages found in database")
    
    client.close()

asyncio.run(check_chat_persistence())
