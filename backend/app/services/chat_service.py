from datetime import datetime
from typing import List
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.chat import ChatMessageCreate, ChatMessagePublic
from .Qdrant import insert_vector

chat_collection: AsyncIOMotorCollection = get_collection("chat_messages")


async def create_message(payload: ChatMessageCreate) -> ChatMessagePublic:
  doc = {
    "content": payload.content,
    "created_at": datetime.utcnow(),
  }
  result = await chat_collection.insert_one(doc)
  doc_id = str(result.inserted_id)
  
  # Insert vector into Qdrant for semantic search/RAG (non-blocking, fails silently if Qdrant not configured)
  await insert_vector("chat_messages", doc_id, payload.content)
  
  return ChatMessagePublic(id=doc_id, **doc)


async def list_messages(limit: int = 10) -> List[ChatMessagePublic]:
  cursor = chat_collection.find().sort("created_at", -1).limit(limit)
  messages: List[ChatMessagePublic] = []
  async for doc in cursor:
    messages.append(
      ChatMessagePublic(
        id=str(doc["_id"]),
        content=doc["content"],
        created_at=doc["created_at"],
      )
    )
  return list(reversed(messages))

