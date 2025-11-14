from datetime import datetime
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.user import UserCreate, UserLogin, UserPublic
from ..utils.security import hash_password, verify_password

users_collection: AsyncIOMotorCollection = get_collection("users")


async def create_user(data: UserCreate) -> UserPublic:
  existing = await users_collection.find_one({"email": data.email})
  if existing:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Email already registered.",
    )
  doc = {
    "full_name": data.full_name,
    "email": data.email,
    "password": hash_password(data.password),
    "created_at": datetime.utcnow(),
  }
  result = await users_collection.insert_one(doc)
  return UserPublic(
    id=str(result.inserted_id),
    full_name=doc["full_name"],
    email=doc["email"],
    created_at=doc["created_at"],
  )


async def authenticate_user(credentials: UserLogin) -> UserPublic:
  user = await users_collection.find_one({"email": credentials.email})
  if not user or not verify_password(credentials.password, user["password"]):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password.",
    )
  return UserPublic(
    id=str(user["_id"]),
    full_name=user["full_name"],
    email=user["email"],
    created_at=user["created_at"],
  )

