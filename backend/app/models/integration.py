from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class IntegrationToken(BaseModel):
  id: str
  provider: str
  connected: bool
  last_synced_at: Optional[datetime] = None


class IntegrationStatus(BaseModel):
  provider: str
  connected: bool
  last_synced_at: Optional[datetime] = None

