from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl, Field


class DocumentCreate(BaseModel):
  title: str = Field(min_length=2, max_length=120)
  category: str = Field(min_length=2, max_length=60)
  filename: str = Field(min_length=2, max_length=120)
  cloud_link: Optional[HttpUrl] = None


class DocumentPublic(BaseModel):
  id: str
  title: str
  category: str
  filename: str
  cloud_link: Optional[str] = None
  created_at: datetime

