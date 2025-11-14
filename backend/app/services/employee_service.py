from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.employee import EmployeeCreate, EmployeePublic
from .Qdrant import insert_vector

employees_collection: AsyncIOMotorCollection = get_collection("employees")


async def add_employee(payload: EmployeeCreate) -> EmployeePublic:
  doc = {
    "full_name": payload.full_name,
    "email": payload.email,
    "phone": payload.phone,
    "temporary_password": payload.temporary_password,
    "role": payload.role,
    "created_at": datetime.utcnow(),
  }
  result = await employees_collection.insert_one(doc)
  doc_id = str(result.inserted_id)
  
  # Extract searchable text for vector embedding
  # Combine name, email, role for semantic search (not indexing password for security)
  searchable_text = f"{payload.full_name} {payload.email} {payload.role} {payload.phone}"
  
  # Insert vector into Qdrant for semantic search (non-blocking, fails silently if Qdrant not configured)
  await insert_vector("employees", doc_id, searchable_text)
  
  return EmployeePublic(
    id=doc_id,
    full_name=doc["full_name"],
    email=doc["email"],
    phone=doc["phone"],
    role=doc["role"],
    created_at=doc["created_at"],
  )

