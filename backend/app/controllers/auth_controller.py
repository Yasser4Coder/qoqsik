from fastapi import APIRouter

from ..models.user import UserCreate, UserLogin, UserPublic
from ..services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserPublic)
async def signup(payload: UserCreate):
  return await user_service.create_user(payload)


@router.post("/login", response_model=UserPublic)
async def login(payload: UserLogin):
  return await user_service.authenticate_user(payload)


@router.post("/logout")
async def logout():
  return {"message": "Logged out successfully"}


@router.get("/debug/users")
async def debug_users():
  """Debug endpoint to check users in database (remove in production)"""
  from ..database import get_collection
  users_collection = get_collection("users")
  users = await users_collection.find({}).to_list(length=100)
  return {
    "count": len(users),
    "users": [
      {
        "id": str(u["_id"]),
        "email": u.get("email"),
        "full_name": u.get("full_name"),
        "has_password": "password" in u and bool(u["password"]),
        "password_length": len(u.get("password", "")) if u.get("password") else 0,
      }
      for u in users
    ],
  }

