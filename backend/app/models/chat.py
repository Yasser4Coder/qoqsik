from datetime import datetime
from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
  content: str = Field(min_length=1, max_length=1000)


class ChatMessagePublic(BaseModel):
  id: str
  content: str
  created_at: datetime

