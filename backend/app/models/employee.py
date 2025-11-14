from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
  full_name: str = Field(min_length=2, max_length=80)
  email: EmailStr
  phone: str = Field(min_length=8, max_length=20)
  temporary_password: str = Field(min_length=8, max_length=64)
  role: str


class EmployeePublic(BaseModel):
  id: str
  full_name: str
  email: EmailStr
  phone: str
  role: str
  created_at: datetime

