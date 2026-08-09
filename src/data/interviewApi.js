// Client for the FastAPI adaptive interview backend.
// Talks to the single endpoint defined in technical-spec.md: POST /api/interview

const INTERVIEW_API_URL = 'http://127.0.0.1:8000/api/interview'

async function postInterview(payload) {
  let response

  try {
    response = await fetch(INTERVIEW_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    // Network-level failure — most commonly the backend isn't running.
    throw new Error(
      'Could not reach the interview backend at http://127.0.0.1:8000. ' +
        'Make sure the FastAPI server is running (uvicorn main:app --reload).'
    )
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      if (body && body.detail) {
        detail = `: ${body.detail}`
      }
    } catch {
      // Response wasn't JSON — ignore and use the generic message below.
    }
    throw new Error(`Interview backend error (${response.status})${detail}`)
  }

  return response.json()
}

/**
 * Start a new interview session for the given candidate.
 * Returns { reply, done } — the backend's first question.
 */
export function startInterview(sessionId, candidate) {
  return postInterview({ sessionId, candidate })
}

/**
 * Submit the candidate's answer for the current question.
 * Returns either { reply, done: false } for the next question, or
 * { reply, done: true, feedback } when the interview is complete.
 */
export function sendAnswer(sessionId, message) {
  return postInterview({ sessionId, message })
}
