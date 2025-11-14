from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
  full_name: str = Field(min_length=2, max_length=80)
  email: EmailStr
  password: str = Field(min_length=8)


class UserLogin(BaseModel):
  email: EmailStr
  password: str


class UserPublic(BaseModel):
  id: str
  full_name: str
  email: EmailStr
  created_at: datetime

