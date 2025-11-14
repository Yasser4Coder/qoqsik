from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import get_settings
from qdrant_client import QdrantClient

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_uri)
database: AsyncIOMotorDatabase = client[settings.mongodb_db]


def get_collection(name: str):
  return database[name]


def connect_qdrant():
  return QdrantClient(url=settings.qdrant_url)