from typing import List
from fastapi import APIRouter

from ..models.chat import ChatMessageCreate, ChatMessagePublic
from ..services import chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/messages", response_model=ChatMessagePublic)
async def send_message(payload: ChatMessageCreate):
  return await chat_service.create_message(payload)


@router.get("/messages", response_model=List[ChatMessagePublic])
async def get_messages():
  return await chat_service.list_messages()

