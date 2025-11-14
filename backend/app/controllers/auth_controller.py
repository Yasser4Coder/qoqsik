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

