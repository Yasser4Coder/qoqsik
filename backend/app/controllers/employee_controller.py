from fastapi import APIRouter

from ..models.employee import EmployeeCreate, EmployeePublic
from ..services import employee_service

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", response_model=EmployeePublic)
async def create_employee(payload: EmployeeCreate):
  return await employee_service.add_employee(payload)

