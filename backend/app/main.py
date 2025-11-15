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

# Configure CORS
# Note: Cannot use allow_origins=["*"] with allow_credentials=True
# So we default to the frontend_url if "*" is specified
if settings.allowed_origins == "*":
  # Use frontend_url explicitly when credentials are enabled
  origins = [
    settings.frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",  # Vite HMR alternate port
  ]
else:
  origins = [origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()]
  # Also add common localhost variants if not already present
  if "http://localhost:5173" not in origins:
    origins.append("http://localhost:5173")
  if "http://127.0.0.1:5173" not in origins:
    origins.append("http://127.0.0.1:5173")

# Add CORS middleware BEFORE routers
# The middleware order matters - CORS must be added first
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  expose_headers=["*"],
  max_age=3600,  # Cache preflight requests for 1 hour
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

