from typing import List
from pydantic import BaseModel


class SubscriptionPlan(BaseModel):
  name: str
  price: str
  period: str
  description: str
  features: List[str]
  highlight: bool = False

