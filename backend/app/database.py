from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import get_settings
from qdrant_client import QdrantClient

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_uri)
database: AsyncIOMotorDatabase = client[settings.mongodb_db]


def get_collection(name: str):
  return database[name]


def connect_qdrant():
  if not settings.qdrant_url:
    raise ValueError("QDRANT_URL is not configured. Please set QDRANT_URL in your .env file to use RAG functionality.")
  # print("QDRANT URL:", settings.qdrant_url)
  # print("QDRANT KEY:", settings.qdrant_api_key[:5] + "...")

  return QdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)