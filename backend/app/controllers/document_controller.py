from typing import List
from fastapi import APIRouter

from ..models.document import DocumentCreate, DocumentPublic
from ..services import document_service

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("", response_model=DocumentPublic)
async def create_document(payload: DocumentCreate):
  return await document_service.add_document(payload)


@router.get("", response_model=List[DocumentPublic])
async def list_documents():
  return await document_service.list_recent_documents()

