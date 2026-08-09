# Backend — Adaptive Interview Intelligence

FastAPI backend implementing the single endpoint required by
`../technical-spec.md`:

```
POST /api/interview
```

No authentication. No database — interview state lives in memory, keyed by
`sessionId`, and is lost on server restart. Question generation and answer
evaluation are deterministic/rule-based (see `interview_engine.py`) so this
runs with no external AI API key. `curriculum.json` (project root) is the
source of truth for topics; `candidates.json` (project root) is the source
of truth for candidate data — neither file is modified by the backend.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Health check: `GET http://localhost:8000/api/health`

## CORS

The local Vite dev server (`http://localhost:5173`) is already allowed to
call this API directly from the browser. The frontend is **not** wired up
to this backend yet — that integration is a separate step.

## Manual test (start an interview)

```bash
curl -X POST http://localhost:8000/api/interview \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-1",
    "candidate": { "member": {...}, "missions": [...], "signals": {...} }
  }'
```

Then continue the same session by sending only `sessionId` + `message`:

```bash
curl -X POST http://localhost:8000/api/interview \
  -H "Content-Type: application/json" \
  -d '{ "sessionId": "test-1", "message": "My answer..." }'
```

Repeat until the response contains `"done": true` and a `feedback` object.
