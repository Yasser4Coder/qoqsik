from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorCollection

from ..database import get_collection
from ..models.employee import EmployeeCreate, EmployeePublic

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
  return EmployeePublic(
    id=str(result.inserted_id),
    full_name=doc["full_name"],
    email=doc["email"],
    phone=doc["phone"],
    role=doc["role"],
    created_at=doc["created_at"],
  )

