"""
Curriculum loader.

Reads the official `curriculum.json` (source of truth, project root) and
exposes small helpers for looking up a curriculum "day" (a topic) by its
day number. This module NEVER writes to curriculum.json — it is read-only.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

# curriculum.json lives at the project root, one directory above backend/
CURRICULUM_PATH = Path(__file__).resolve().parent.parent / "curriculum.json"

_curriculum_cache: Optional[dict] = None


def load_curriculum() -> dict:
    """Load curriculum.json once and cache it in memory (read-only)."""
    global _curriculum_cache
    if _curriculum_cache is None:
        with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
            _curriculum_cache = json.load(f)
    return _curriculum_cache


def days_by_number() -> dict:
    """Return {day_number: day_dict} for every day defined in curriculum.json."""
    curriculum = load_curriculum()
    return {day["day"]: day for day in curriculum.get("days", [])}


def get_day(day_number: int) -> Optional[dict]:
    """Look up a single curriculum day (topic) by its day number."""
    return days_by_number().get(day_number)


def cohort_name() -> str:
    return load_curriculum().get("cohort", "Curriculum")
