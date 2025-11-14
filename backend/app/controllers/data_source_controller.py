from fastapi import APIRouter

from ..config import get_settings
from ..models.data_source import DataSourceResponse
from ..services import data_source_service

router = APIRouter(prefix="/data-sources", tags=["data-sources"])
settings = get_settings()


@router.get("", response_model=DataSourceResponse)
async def list_connectors():
  connectors = await data_source_service.get_connectors(settings.default_user_id)
  return DataSourceResponse(connectors=connectors)

