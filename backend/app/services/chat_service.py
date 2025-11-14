from datetime import datetime
from typing import List
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.chat import ChatMessageCreate, ChatMessagePublic

chat_collection: AsyncIOMotorCollection = get_collection("chat_messages")


async def create_message(payload: ChatMessageCreate) -> ChatMessagePublic:
  doc = {
    "content": payload.content,
    "created_at": datetime.utcnow(),
  }
  result = await chat_collection.insert_one(doc)
  return ChatMessagePublic(id=str(result.inserted_id), **doc)


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

