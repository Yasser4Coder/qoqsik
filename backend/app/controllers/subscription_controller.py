from typing import List
from fastapi import APIRouter

from ..models.subscription import SubscriptionPlan
from ..services import subscription_service

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("", response_model=List[SubscriptionPlan])
async def get_plans():
  return subscription_service.get_subscription_plans()

