from ..models.data_source import DataSourceConnector
from . import integration_service


async def get_connectors(user_id: str) -> list[DataSourceConnector]:
  return await integration_service.list_connectors(user_id)

