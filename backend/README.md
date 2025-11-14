# SBA Backend (FastAPI + MongoDB Atlas)

## Prerequisites

- Python 3.11+
- MongoDB Atlas cluster and connection string

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # on Windows
source .venv/bin/activate  # on macOS/Linux
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and update the MongoDB credentials plus allowed CORS origins (default front-end dev server is `http://localhost:5173`).

```bash
cp .env.example .env
```

## Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API exposes:

- `POST /auth/signup`, `POST /auth/login`
- `POST /employees`
- `POST /documents`, `GET /documents`
- `GET /subscriptions`
- `GET /data-sources`
- `POST /chat/messages`, `GET /chat/messages`

Use `GET /health` for a quick readiness probe.

