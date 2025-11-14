from functools import lru_cache
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  mongodb_uri: str = Field(alias="MONGODB_URI")
  mongodb_db: str = Field(alias="MONGODB_DB", default="sba")
  api_host: str = Field(alias="API_HOST", default="0.0.0.0")
  api_port: int = Field(alias="API_PORT", default=8000)
  allowed_origins: str = Field(alias="ALLOWED_ORIGINS", default="*")
  frontend_url: str = Field(alias="FRONTEND_URL", default="http://localhost:5173")
  qdrant_url: str | None = Field(alias="QDRANT_URL", default=None)

  encryption_key: str | None = Field(alias="ENCRYPTION_KEY", default=None)
  google_client_id: str | None = Field(alias="GOOGLE_CLIENT_ID", default=None)
  google_client_secret: str | None = Field(alias="GOOGLE_CLIENT_SECRET", default=None)
  google_redirect_uri: str | None = Field(alias="GOOGLE_REDIRECT_URI", default=None)
  default_user_id: str = Field(alias="DEFAULT_USER_ID", default="demo-user")
  ocr_api_key: str | None = Field(alias="OCR_API_KEY", default=None)

  class Config:
    env_file = ".env"
    env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
  return Settings()

