from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

from ..config import get_settings
from ..services import integration_service

router = APIRouter(prefix="/integrations", tags=["integrations"])
settings = get_settings()


@router.get("/{provider}/authorize")
async def authorize(provider: str):
  url = integration_service.build_authorize_url(provider)
  return RedirectResponse(url)


@router.get("/{provider}/callback")
async def callback(provider: str, code: str):
  await integration_service.exchange_code_for_tokens(
    provider,
    code,
    settings.default_user_id,
  )
  redirect_to = f"{settings.frontend_url}/dashboard/data-sources?connected={provider}"
  return RedirectResponse(redirect_to)


@router.delete("/{provider}")
async def disconnect(provider: str):
  await integration_service.disconnect(provider, settings.default_user_id)
  return {"ok": True}

