from datetime import datetime
from typing import List
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.document import DocumentCreate, DocumentPublic

documents_collection: AsyncIOMotorCollection = get_collection("documents")


async def add_document(payload: DocumentCreate) -> DocumentPublic:
  doc = {
    "title": payload.title,
    "category": payload.category,
    "filename": payload.filename,
    "cloud_link": payload.cloud_link,
    "created_at": datetime.utcnow(),
  }
  result = await documents_collection.insert_one(doc)
  return DocumentPublic(id=str(result.inserted_id), **doc)


async def list_recent_documents(limit: int = 5) -> List[DocumentPublic]:
  cursor = (
    documents_collection.find().sort("created_at", -1).limit(limit)
  )
  documents = []
  async for doc in cursor:
    documents.append(
      DocumentPublic(
        id=str(doc["_id"]),
        title=doc["title"],
        category=doc["category"],
        filename=doc["filename"],
        cloud_link=doc.get("cloud_link"),
        created_at=doc["created_at"],
      )
    )
  return documents

