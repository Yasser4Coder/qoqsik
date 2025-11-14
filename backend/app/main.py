from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .controllers import (
  auth_controller,
  employee_controller,
  document_controller,
  subscription_controller,
  data_source_controller,
  chat_controller,
  integration_controller,
  rag_controller,
)

settings = get_settings()

app = FastAPI(title="SBA Backend", version="1.0.0")

origins = [origin.strip() for origin in settings.allowed_origins.split(",")]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(auth_controller.router)
app.include_router(employee_controller.router)
app.include_router(document_controller.router)
app.include_router(subscription_controller.router)
app.include_router(data_source_controller.router)
app.include_router(chat_controller.router)
app.include_router(integration_controller.router)
app.include_router(rag_controller.router)


@app.get("/health")
async def health():
  return {"status": "ok"}

