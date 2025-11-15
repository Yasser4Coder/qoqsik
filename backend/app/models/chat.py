from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
  content: str = Field(min_length=1, max_length=1000)
  user_id: Optional[str] = None  # User ID for multi-user support
  conversation_id: Optional[str] = None  # Optional conversation/session ID


class ChatMessagePublic(BaseModel):
  id: str
  content: str
  role: str = Field(default="user", description="Role: 'user' or 'assistant'")
  user_id: Optional[str] = None
  conversation_id: Optional[str] = None
  created_at: datetime

