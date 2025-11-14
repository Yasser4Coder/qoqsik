from datetime import datetime, timedelta
from typing import Dict, Any
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection

from ..config import get_settings
from ..database import get_collection
from ..models.data_source import DataSourceConnector
from ..utils.crypto import encrypt

settings = get_settings()
tokens_collection: AsyncIOMotorCollection = get_collection("integration_tokens")


OAUTH_PROVIDERS: Dict[str, Dict[str, Any]] = {}

if (
  settings.google_client_id
  and settings.google_client_secret
  and settings.google_redirect_uri
):
  OAUTH_PROVIDERS["google"] = {
    "title": "Gmail / Google Workspace",
    "description": "Sync emails, Drive files, and contacts.",
    "icon": "gmail",
    "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
    "token_url": "https://oauth2.googleapis.com/token",
    "scope": "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.metadata.readonly",
    "client_id": settings.google_client_id,
    "client_secret": settings.google_client_secret,
    "redirect_uri": settings.google_redirect_uri,
    "optional": False,
  }


def get_connector_statuses() -> list[DataSourceConnector]:
  connectors: list[DataSourceConnector] = []
  for provider, meta in OAUTH_PROVIDERS.items():
    connectors.append(
      DataSourceConnector(
        id=provider,
        title=meta["title"],
        description=meta["description"],
        icon=meta["icon"],
        optional=meta.get("optional", False),
        connected=False,
        last_synced_at=None,
      )
    )
  return connectors


async def list_connectors(user_id: str) -> list[DataSourceConnector]:
  connectors = get_connector_statuses()
  cursor = tokens_collection.find({"user_id": user_id})
  stored_tokens = {doc["provider"]: doc async for doc in cursor}
  for connector in connectors:
    doc = stored_tokens.get(connector.id)
    if doc:
      connector.connected = True
      connector.last_synced_at = doc.get("updated_at", datetime.utcnow()).isoformat()
  return connectors


def build_authorize_url(provider: str) -> str:
  if provider not in OAUTH_PROVIDERS:
    raise HTTPException(status_code=404, detail="Provider not supported.")
  meta = OAUTH_PROVIDERS[provider]
  params = {
    "client_id": meta["client_id"],
    "redirect_uri": meta["redirect_uri"],
    "response_type": "code",
    "scope": meta["scope"],
    "access_type": "offline",
    "prompt": "consent",
    "state": provider,
  }
  return f'{meta["auth_url"]}?{urlencode(params)}'


async def exchange_code_for_tokens(provider: str, code: str, user_id: str):
  if provider not in OAUTH_PROVIDERS:
    raise HTTPException(status_code=404, detail="Provider not supported.")
  meta = OAUTH_PROVIDERS[provider]
  payload = {
    "client_id": meta["client_id"],
    "client_secret": meta["client_secret"],
    "redirect_uri": meta["redirect_uri"],
    "code": code,
    "grant_type": "authorization_code",
  }
  async with httpx.AsyncClient() as client:
    response = await client.post(meta["token_url"], data=payload)
  if response.status_code >= 400:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail=f"Failed to exchange code for {provider}.",
    )
  data = response.json()
  expires_in = data.get("expires_in", 3600)
  document = {
    "user_id": user_id,
    "provider": provider,
    "access_token": encrypt(data["access_token"]),
    "refresh_token": encrypt(data.get("refresh_token", "") or "placeholder"),
    "scope": data.get("scope"),
    "expires_at": datetime.utcnow() + timedelta(seconds=expires_in),
    "updated_at": datetime.utcnow(),
  }
  await tokens_collection.update_one(
    {"user_id": user_id, "provider": provider},
    {"$set": document},
    upsert=True,
  )


async def disconnect(provider: str, user_id: str):
  result = await tokens_collection.delete_one({"user_id": user_id, "provider": provider})
  if not result.deleted_count:
    raise HTTPException(status_code=404, detail="Integration not found.")

