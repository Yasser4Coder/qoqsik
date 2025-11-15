from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from fastapi import HTTPException, status

from ..database import get_collection
from ..models.chat import ChatMessageCreate, ChatMessagePublic
from .Qdrant import insert_vector
from . import rag

chat_collection: AsyncIOMotorCollection = get_collection("chat_messages")


async def create_message(payload: ChatMessageCreate, user_id: Optional[str] = None) -> ChatMessagePublic:
  """
  Create a user message and generate an assistant response using RAG.
  
  Returns the assistant's response message.
  """
  # Determine user_id (from payload or parameter)
  effective_user_id = payload.user_id or user_id or "default"
  
  # 1. Save user message
  user_doc = {
    "content": payload.content,
    "role": "user",
    "user_id": effective_user_id,
    "conversation_id": payload.conversation_id,
    "created_at": datetime.utcnow(),
  }
  user_result = await chat_collection.insert_one(user_doc)
  user_doc_id = str(user_result.inserted_id)
  
  # Insert user message vector into Qdrant for semantic search (non-blocking)
  await insert_vector("chat_messages", user_doc_id, payload.content)
  
  # 2. Get conversation history for context (last 10 messages)
  history = await get_conversation_history(
    user_id=effective_user_id,
    conversation_id=payload.conversation_id,
    limit=10
  )
  
  # 3. Search for relevant context across multiple collections
  try:
    relevant_docs = await rag.search_multiple_collections(
      query=payload.content,
      top_k_per_collection=2
    )
  except Exception as e:
    print(f"Error searching collections: {e}")
    relevant_docs = []
  
  # 4. Build prompt with context and history
  conversation_history = [
    {"role": msg.role, "content": msg.content}
    for msg in history
  ]
  prompt = rag.build_prompt(
    query=payload.content,
    docs=relevant_docs,
    conversation_history=conversation_history
  )
  
  # 5. Generate assistant response using RAG
  try:
    assistant_content = await rag.call_llm(prompt)
  except ValueError as e:
    # If LLM is not configured or fails, provide a fallback response
    assistant_content = (
      "I apologize, but I'm unable to generate a response right now. "
      "Please ensure the Qwen API is configured correctly. "
      f"Error: {str(e)}"
    )
  except Exception as e:
    assistant_content = (
      "I apologize, but I encountered an error while generating a response. "
      f"Error: {str(e)}"
    )
  
  # 6. Save assistant response
  assistant_doc = {
    "content": assistant_content,
    "role": "assistant",
    "user_id": effective_user_id,
    "conversation_id": payload.conversation_id,
    "created_at": datetime.utcnow(),
  }
  assistant_result = await chat_collection.insert_one(assistant_doc)
  assistant_doc_id = str(assistant_result.inserted_id)
  
  # Insert assistant response vector into Qdrant (non-blocking)
  await insert_vector("chat_messages", assistant_doc_id, assistant_content)
  
  # 7. Return assistant response
  return ChatMessagePublic(
    id=assistant_doc_id,
    content=assistant_content,
    role="assistant",
    user_id=effective_user_id,
    conversation_id=payload.conversation_id,
    created_at=assistant_doc["created_at"],
  )


async def get_conversation_history(
  user_id: Optional[str] = None,
  conversation_id: Optional[str] = None,
  limit: int = 20
) -> List[ChatMessagePublic]:
  """Get conversation history for a user or conversation."""
  query = {}
  if user_id:
    query["user_id"] = user_id
  if conversation_id:
    query["conversation_id"] = conversation_id
  
  cursor = chat_collection.find(query).sort("created_at", -1).limit(limit)
  messages: List[ChatMessagePublic] = []
  async for doc in cursor:
    messages.append(
      ChatMessagePublic(
        id=str(doc["_id"]),
        content=doc["content"],
        role=doc.get("role", "user"),
        user_id=doc.get("user_id"),
        conversation_id=doc.get("conversation_id"),
        created_at=doc["created_at"],
      )
    )
  return list(reversed(messages))  # Return in chronological order


async def list_messages(
  user_id: Optional[str] = None,
  conversation_id: Optional[str] = None,
  limit: int = 50
) -> List[ChatMessagePublic]:
  """List messages, optionally filtered by user_id or conversation_id."""
  query = {}
  if user_id:
    query["user_id"] = user_id
  if conversation_id:
    query["conversation_id"] = conversation_id
  
  cursor = chat_collection.find(query).sort("created_at", -1).limit(limit)
  messages: List[ChatMessagePublic] = []
  async for doc in cursor:
    messages.append(
      ChatMessagePublic(
        id=str(doc["_id"]),
        content=doc["content"],
        role=doc.get("role", "user"),
        user_id=doc.get("user_id"),
        conversation_id=doc.get("conversation_id"),
        created_at=doc["created_at"],
      )
    )
  return list(reversed(messages))  # Return in chronological order

