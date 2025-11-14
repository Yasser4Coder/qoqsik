from datetime import datetime
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.user import UserCreate, UserLogin, UserPublic
from ..utils.security import hash_password, verify_password

users_collection: AsyncIOMotorCollection = get_collection("users")


async def create_user(data: UserCreate) -> UserPublic:
  # Normalize email to lowercase for consistency
  email = data.email.lower().strip()
  existing = await users_collection.find_one({"email": email})
  if existing:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Email already registered.",
    )
  doc = {
    "full_name": data.full_name,
    "email": email,
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
  # Normalize email to lowercase for comparison
  email = credentials.email.lower().strip()
  
  # Try exact match first, then case-insensitive regex match for existing users
  user = await users_collection.find_one({"email": email})
  if not user:
    # Fallback to case-insensitive search for existing users with different casing
    user = await users_collection.find_one({"email": {"$regex": f"^{email}$", "$options": "i"}})
  
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password.",
    )
  
  # Normalize stored email to lowercase for consistency
  if user.get("email") and user["email"].lower() != email:
    # Update the email in the database to lowercase
    await users_collection.update_one(
      {"_id": user["_id"]},
      {"$set": {"email": email}}
    )
    user["email"] = email
  
  # Check if password field exists
  if "password" not in user or not user["password"]:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password.",
    )
  
  # Verify password
  password_valid = verify_password(credentials.password, user["password"])
  if not password_valid:
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

