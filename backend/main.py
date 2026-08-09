"""
Adaptive Interview Intelligence — backend foundation.

Implements exactly the HTTP contract defined in technical-spec.md:

    POST /api/interview

No authentication. Session state is kept in memory, keyed by `sessionId`.
Question generation and answer evaluation are deterministic / rule-based
(see interview_engine.py) so this runs with no external AI API key.
"""

from __future__ import annotations

from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import interview_engine

app = FastAPI(title="Adaptive Interview Intelligence — Backend")

# Allow the local Vite dev server (and common localhost variants) to call
# this API directly from the browser during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://adaptive-interview-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store: { sessionId: session_dict }
SESSIONS: dict[str, dict] = {}


class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[dict[str, Any]] = None
    message: Optional[str] = None


@app.get("/api/health")
def health() -> dict:
    """Small convenience endpoint for confirming the server is up."""
    return {"status": "ok"}


@app.post("/api/interview")
def interview(payload: InterviewRequest) -> dict:
    session_id = payload.sessionId
    if not session_id:
        raise HTTPException(status_code=400, detail="sessionId is required")

    session = SESSIONS.get(session_id)

    # --- New session: must be started with a candidate object ---
    if session is None:
        if not payload.candidate:
            raise HTTPException(
                status_code=400,
                detail="candidate is required to start a new interview session",
            )

        session = interview_engine.start_session(payload.candidate)
        SESSIONS[session_id] = session

        reply = interview_engine.format_start_reply(
            payload.candidate, session["current_question"]
        )
        return {"reply": reply, "done": False}

    # --- Existing session, already finished: return the stored result ---
    if session["done"]:
        return {
            "reply": "Interview completed.",
            "done": True,
            "feedback": session["feedback"],
        }

    # --- Existing session, in progress: this request is the candidate's answer ---
    if payload.message is None:
        raise HTTPException(
            status_code=400,
            detail="message is required to continue an in-progress interview",
        )

    result = interview_engine.submit_answer(session, payload.message)

    if result["done"]:
        return {
            "reply": result["reply"],
            "done": True,
            "feedback": result["feedback"],
        }

    return {"reply": result["reply"], "done": False}
