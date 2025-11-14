from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import get_settings
from qdrant_client import QdrantClient

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_uri)
database: AsyncIOMotorDatabase = client[settings.mongodb_db]


def get_collection(name: str):
  return database[name]


def connect_qdrant():
  return QdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)

def create_collection(collection_name: str):
  client = connect_qdrant()
  client.create_collection(collection_name="sba", vectors_config=VectorParams(size=1536, distance=Distance.COSINE))