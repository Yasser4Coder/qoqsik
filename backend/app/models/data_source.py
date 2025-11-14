from typing import List
from pydantic import BaseModel


class DataSourceConnector(BaseModel):
  id: str
  title: str
  description: str
  icon: str
  optional: bool = False
  connected: bool = False
  last_synced_at: str | None = None


class DataSourceResponse(BaseModel):
  connectors: List[DataSourceConnector]

