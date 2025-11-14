from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import get_settings

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_uri)
database: AsyncIOMotorDatabase = client[settings.mongodb_db]


def get_collection(name: str):
  return database[name]

