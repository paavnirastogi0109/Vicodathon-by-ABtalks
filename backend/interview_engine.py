"""
Deterministic, rule-based adaptive interview engine.

This module contains no external AI/LLM calls on purpose (per the demo
requirements). Every function here is pure Python logic operating on:
  - the real candidate object supplied by the frontend (member, missions, signals)
  - curriculum.json (source of truth for topics/objectives)

The public functions (`start_session`, `submit_answer`) are the only things
main.py needs to call. The internal helpers are intentionally small and
named so this file is easy to swap for an LLM-backed implementation later
(e.g. replace `evaluate_answer` and `build_question_prompt` with model calls
while keeping the session/state-machine shape the same).
"""

from __future__ import annotations

from collections import deque
from typing import Any, Optional

import curriculum

MAX_QUESTIONS = 5

DIFFICULTY_LEVELS = ["easy", "medium", "hard"]  # index 0..2

REASONING_MARKERS = [
    "because", "trade-off", "tradeoff", "however", "for example",
    "e.g.", "alternative", "instead", "so that", "which means",
]


# ---------------------------------------------------------------------------
# Candidate + curriculum -> topic pool
# ---------------------------------------------------------------------------

def _classify_mission(mission: dict) -> str:
    """Classify a candidate's past mission as 'strong' / 'moderate' / 'weak'."""
    if mission.get("skipped"):
        return "weak"
    passed = mission.get("passed")
    attempts = mission.get("attempts", 1)
    if passed is False:
        return "weak"
    if passed is True and attempts == 1:
        return "strong"
    if passed is True and attempts and attempts >= 2:
        return "moderate"
    return "moderate"


def _build_topic_pool(candidate: dict) -> list[dict]:
    """
    Turn the candidate's mission history into a list of interview "topics",
    each backed by a real curriculum.json day (title, tools, objectives),
    tagged with how strong the candidate's track record is on that topic.
    """
    days_lookup = curriculum.days_by_number()
    pool: list[dict] = []

    for mission in candidate.get("missions", []):
        day_num = mission.get("day")
        day_info = days_lookup.get(day_num)
        if not day_info:
            # Mission references a day not present in curriculum.json — skip,
            # since curriculum.json is the source of truth for topics.
            continue

        pool.append({
            "day": day_num,
            "title": day_info.get("title", f"Day {day_num}"),
            "type": day_info.get("type"),
            "tools": day_info.get("tools", []) or [],
            "objectives": day_info.get("objectives", []) or [day_info.get("title", "")],
            "strength": _classify_mission(mission),
            "attempts": mission.get("attempts"),
            "passed": mission.get("passed"),
            "skipped": bool(mission.get("skipped", False)),
        })

    pool.sort(key=lambda t: t["day"])

    if not pool:
        # Fallback so the interview can still run even if a candidate has an
        # empty/unexpected missions list: pull generic topics from curriculum.
        for day_info in curriculum.load_curriculum().get("days", [])[:5]:
            pool.append({
                "day": day_info["day"],
                "title": day_info.get("title", ""),
                "type": day_info.get("type"),
                "tools": day_info.get("tools", []) or [],
                "objectives": day_info.get("objectives", []) or [day_info.get("title", "")],
                "strength": "moderate",
                "attempts": None,
                "passed": None,
                "skipped": False,
            })

    return pool


# ---------------------------------------------------------------------------
# Session lifecycle
# ---------------------------------------------------------------------------

def start_session(candidate: dict) -> dict:
    """Build a brand-new in-memory interview session for a candidate."""
    topic_pool = _build_topic_pool(candidate)

    queues = {
        "strong": deque(t for t in topic_pool if t["strength"] == "strong"),
        "moderate": deque(t for t in topic_pool if t["strength"] == "moderate"),
        "weak": deque(t for t in topic_pool if t["strength"] == "weak"),
    }

    session = {
        "candidate": candidate,
        "topic_pool": topic_pool,
        "queues": queues,
        "reuse_index": 0,
        "difficulty_level": 0,  # start easy, index into DIFFICULTY_LEVELS
        "question_count": 0,
        "asked": [],         # list of {day, title, difficulty, objective, prompt}
        "evaluations": [],   # list of {day, title, difficulty, objective, classification, score, answer_word_count}
        "current_question": None,
        "done": False,
        "feedback": None,
    }

    first_question = _generate_next_question(session, last_classification=None)
    session["current_question"] = first_question
    return session


def _pick_next_topic(session: dict, last_classification: Optional[str]) -> tuple[dict, str]:
    """
    Choose the next curriculum topic to ask about.

    Adaptive rule: after a STRONG answer we lean into the candidate's other
    strong topics (dig deeper); after a WEAK answer we lean into topics the
    candidate historically struggled with (probe the gap); otherwise we work
    through the moderate topics first. This ties topic selection directly to
    both the candidate's real mission signals AND their live answers.
    """
    if last_classification == "strong":
        order = ["strong", "moderate", "weak"]
    elif last_classification == "weak":
        order = ["weak", "moderate", "strong"]
    else:
        order = ["moderate", "strong", "weak"]

    for key in order:
        q = session["queues"][key]
        if q:
            topic = q.popleft()
            return topic, key

    # All topic queues exhausted (candidate had very few missions) — reuse
    # topics cyclically, varying the objective asked about each time.
    pool = session["topic_pool"]
    topic = pool[session["reuse_index"] % len(pool)]
    session["reuse_index"] += 1
    return topic, topic["strength"]


def _adjust_difficulty(session: dict, last_classification: Optional[str]) -> None:
    if last_classification == "strong":
        session["difficulty_level"] = min(session["difficulty_level"] + 1, 2)
    elif last_classification == "weak":
        session["difficulty_level"] = max(session["difficulty_level"] - 1, 0)
    # "medium" classification -> keep the same difficulty


def _objective_for(topic: dict, question_number: int) -> str:
    objectives = topic["objectives"] or [topic["title"]]
    return objectives[(question_number - 1) % len(objectives)]


def _objective_as_prompt_phrase(objective: str) -> str:
    if not objective:
        return "this part of the module"
    return objective[0].lower() + objective[1:]


def _build_question_prompt(topic: dict, difficulty: str, objective: str) -> str:
    tools = topic["tools"][:3]
    tools_str = ", ".join(tools) if tools else "the tools covered in this module"
    phrase = _objective_as_prompt_phrase(objective)

    if difficulty == "easy":
        return (
            f'Let\'s start with "{topic["title"]}" (Day {topic["day"]} of the curriculum). '
            f"In your own words, can you explain how you would {phrase}, and why that step matters?"
        )
    if difficulty == "medium":
        return (
            f'Building on "{topic["title"]}": walk me through how you would {phrase} '
            f"in a real project. Where would tools like {tools_str} fit in, and what would you watch out for?"
        )
    # hard
    return (
        f'Here\'s a harder, production-style scenario for "{topic["title"]}". '
        f"Imagine the part of your system responsible for helping you {phrase} starts failing under load. "
        f"How would you diagnose the root cause, and what trade-offs would you weigh in your fix "
        f"(consider {tools_str})?"
    )


def _generate_next_question(session: dict, last_classification: Optional[str]) -> dict:
    if last_classification is not None:
        _adjust_difficulty(session, last_classification)

    topic, source_bucket = _pick_next_topic(session, last_classification)
    difficulty = DIFFICULTY_LEVELS[session["difficulty_level"]]
    question_number = session["question_count"] + 1
    objective = _objective_for(topic, question_number)
    prompt = _build_question_prompt(topic, difficulty, objective)

    question = {
        "question_number": question_number,
        "day": topic["day"],
        "title": topic["title"],
        "difficulty": difficulty,
        "objective": objective,
        "prompt": prompt,
        "topic_source": source_bucket,
    }
    return question


# ---------------------------------------------------------------------------
# Answer evaluation (deterministic / rule-based — no external AI API)
# ---------------------------------------------------------------------------

def evaluate_answer(message: str, topic_title: str, tools: list[str], objective: str) -> dict:
    text = (message or "").strip()
    words = text.split()
    word_count = len(words)
    lower = text.lower()

    keywords = set()
    for tool in tools:
        keywords.add(tool.lower())
    for word in objective.split():
        cleaned = word.strip(".,()").lower()
        if len(cleaned) > 3:
            keywords.add(cleaned)

    keyword_hits = sum(1 for kw in keywords if kw and kw in lower)
    reasoning_hits = sum(1 for marker in REASONING_MARKERS if marker in lower)

    score = 0.0
    if word_count >= 60:
        score += 0.4
    elif word_count >= 25:
        score += 0.25
    elif word_count >= 8:
        score += 0.10

    score += min(0.35, keyword_hits * 0.12)
    score += min(0.25, reasoning_hits * 0.12)
    score = max(0.0, min(1.0, score))

    if word_count == 0:
        classification = "weak"
        score = 0.0
    elif score >= 0.65:
        classification = "strong"
    elif score >= 0.35:
        classification = "medium"
    else:
        classification = "weak"

    return {
        "score": round(score, 2),
        "classification": classification,
        "word_count": word_count,
        "keyword_hits": keyword_hits,
        "reasoning_hits": reasoning_hits,
    }


# ---------------------------------------------------------------------------
# Turn handling
# ---------------------------------------------------------------------------

def submit_answer(session: dict, message: str) -> dict:
    """
    Record the answer to the current pending question, evaluate it, and
    either produce the next question or (after MAX_QUESTIONS) final feedback.

    Returns a dict: either
      {"done": False, "reply": "<next question prompt>"}
    or
      {"done": True, "reply": "Interview completed.", "feedback": {...}}
    """
    current = session["current_question"]

    topic = {
        "title": current["title"],
        "day": current["day"],
    }
    matching_topic = next(
        (t for t in session["topic_pool"] if t["day"] == current["day"]), None
    )
    tools = matching_topic["tools"] if matching_topic else []

    evaluation = evaluate_answer(message, current["title"], tools, current["objective"])

    session["asked"].append(current)
    session["evaluations"].append({
        "question_number": current["question_number"],
        "day": current["day"],
        "title": current["title"],
        "difficulty": current["difficulty"],
        "objective": current["objective"],
        **evaluation,
    })
    session["question_count"] += 1

    if session["question_count"] >= MAX_QUESTIONS:
        feedback = _build_feedback(session)
        session["done"] = True
        session["feedback"] = feedback
        session["current_question"] = None
        return {"done": True, "reply": "Interview completed.", "feedback": feedback}

    next_question = _generate_next_question(session, evaluation["classification"])
    session["current_question"] = next_question
    return {"done": False, "reply": next_question["prompt"]}


def format_start_reply(candidate: dict, first_question: dict) -> str:
    name = candidate.get("member", {}).get("name", "there")
    first_name = name.split(" ")[0] if name else "there"
    return (
        f"Welcome, {first_name}! Let's begin your interview. "
        f"We'll go through {MAX_QUESTIONS} questions drawn from your curriculum track.\n\n"
        f"{first_question['prompt']}"
    )


# ---------------------------------------------------------------------------
# Final feedback
# ---------------------------------------------------------------------------

def _build_feedback(session: dict) -> dict:
    candidate = session["candidate"]
    name = candidate.get("member", {}).get("name", "The candidate")
    evaluations = session["evaluations"]

    scores = [e["score"] for e in evaluations]
    avg_score = sum(scores) / len(scores) if scores else 0.0

    strong = [e for e in evaluations if e["classification"] == "strong"]
    weak = [e for e in evaluations if e["classification"] == "weak"]
    medium = [e for e in evaluations if e["classification"] == "medium"]

    strengths = [
        f'Answered confidently on "{e["title"]}" (Day {e["day"]}, {e["difficulty"]} difficulty) '
        f'covering "{e["objective"]}".'
        for e in strong
    ]
    if not strengths:
        # Fall back to the best-scoring answers so strengths is never empty.
        best = sorted(evaluations, key=lambda e: e["score"], reverse=True)[:2]
        strengths = [
            f'Showed the most engagement on "{e["title"]}" (Day {e["day"]}), '
            f'relative to other answers in this interview.'
            for e in best
        ]

    gaps = [
        f'Struggled with "{e["title"]}" (Day {e["day"]}) — the answer on '
        f'"{e["objective"]}" lacked depth or detail.'
        for e in weak
    ]
    if not gaps and medium:
        gaps = [
            f'"{e["title"]}" (Day {e["day"]}) was answered adequately but could go deeper '
            f'on "{e["objective"]}".'
            for e in medium[:2]
        ]
    if not gaps:
        gaps = ["No major gaps identified in this short interview — consider a longer follow-up for more coverage."]

    next_steps = []
    seen_days = set()
    for e in weak + medium:
        if e["day"] in seen_days:
            continue
        seen_days.add(e["day"])
        next_steps.append(f'Revisit curriculum Day {e["day"]} ("{e["title"]}") to reinforce fundamentals.')
    if not next_steps:
        next_steps.append("Move on to more advanced curriculum modules — this candidate is ready to progress.")
    next_steps.append("Schedule a follow-up interview at a higher difficulty to confirm consistency.")

    if avg_score >= 0.65:
        overall = "performed strongly overall"
    elif avg_score >= 0.35:
        overall = "showed a mixed but generally solid performance"
    else:
        overall = "struggled with several questions in this interview"

    summary = (
        f"{name} completed a {len(evaluations)}-question adaptive interview and {overall}, "
        f"with an average performance score of {round(avg_score * 100)}%. "
        f"The interview adapted question difficulty and topic selection in real time based on "
        f"each answer and the candidate's prior mission history."
    )

    return {
        "summary": summary,
        "strengths": strengths,
        "gaps": gaps,
        "next": next_steps,
    }
