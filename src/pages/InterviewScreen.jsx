import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import Button from '../components/Button.jsx'
import { fetchCandidateById } from '../data/candidatesApi.js'
import { getInitials, formatYearsExperience } from '../data/candidateFormat.js'
import { startInterview, sendAnswer } from '../data/interviewApi.js'
import './InterviewScreen.css'

// Matches MAX_QUESTIONS in backend/interview_engine.py
const TOTAL_QUESTIONS = 5

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function InterviewScreen() {
  const { candidateId } = useParams()
  const navigate = useNavigate()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState(null)

  // Backend-driven interview state
  const [sessionId, setSessionId] = useState(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [questionText, setQuestionText] = useState('')
  const [answer, setAnswer] = useState('')

  const [interviewStarting, setInterviewStarting] = useState(false)
  const [interviewError, setInterviewError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [startAttempt, setStartAttempt] = useState(0)

  const startedForCandidateRef = useRef(null)

  // Load the candidate record (unchanged from candidate-selection flow).
  useEffect(() => {
    let cancelled = false

    async function loadCandidate() {
      setLoading(true)
      setNotFound(false)
      setLoadError(null)
      setCandidate(null)

      try {
        const record = await fetchCandidateById(candidateId)
        if (cancelled) return

        if (!record) {
          setNotFound(true)
        } else {
          setCandidate(record)
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load candidate')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCandidate()

    return () => {
      cancelled = true
    }
  }, [candidateId])

  // Once the candidate is loaded, start a new backend interview session and
  // fetch the first backend-generated question. Guarded so React StrictMode's
  // double-invoke (and candidate re-fetches) don't start two sessions.
  useEffect(() => {
    if (!candidate) return
    if (startedForCandidateRef.current === candidate.member.id && startAttempt === 0) return

    startedForCandidateRef.current = candidate.member.id
    let cancelled = false
    const newSessionId = createSessionId()

    async function begin() {
      setInterviewStarting(true)
      setInterviewError(null)
      setQuestionText('')
      try {
        const result = await startInterview(newSessionId, candidate)
        if (cancelled) return
        setSessionId(newSessionId)
        setQuestionText(result.reply)
        setQuestionNumber(1)
        setAnswer('')
      } catch (err) {
        if (!cancelled) {
          setInterviewError(err instanceof Error ? err.message : 'Failed to start interview')
        }
      } finally {
        if (!cancelled) {
          setInterviewStarting(false)
        }
      }
    }

    begin()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate, startAttempt])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sessionId || submitting || interviewStarting) return

    setSubmitting(true)
    setInterviewError(null)

    try {
      const result = await sendAnswer(sessionId, answer)

      if (result.done) {
        navigate('/feedback', {
          state: {
            feedback: result.feedback,
            candidateName: candidate?.member?.name,
          },
        })
        return
      }

      setQuestionText(result.reply)
      setQuestionNumber((prev) => Math.min(prev + 1, TOTAL_QUESTIONS))
      setAnswer('')
    } catch (err) {
      setInterviewError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetryStart = () => {
    setStartAttempt((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <main className="container interview">
          <p className="interview__status-message">Loading candidate…</p>
        </main>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="page">
        <Navbar />
        <main className="container interview">
          <div className="interview__error">
            <p className="interview__error-message" role="alert">
              {loadError}
            </p>
            <Button variant="primary" size="md" onClick={() => navigate('/candidates')}>
              Back to candidates
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page">
        <Navbar />
        <main className="container interview">
          <div className="interview__error">
            <p className="interview__error-message" role="alert">
              Candidate not found. The ID &ldquo;{candidateId}&rdquo; does not match any record.
            </p>
            <Button variant="primary" size="md" onClick={() => navigate('/candidates')}>
              Back to candidates
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const { name, jobRole, yearsExperience, education, status } = candidate.member
  const initials = getInitials(name)

  const question = {
    topic: 'Adaptive Interview',
    difficulty: 'Medium',
    prompt: questionText,
  }

  return (
    <div className="page">
      <Navbar
        rightSlot={
          <div className="interview__candidate-pill">
            <span className="interview__candidate-avatar">{initials}</span>
            <div>
              <p className="interview__candidate-name">{name}</p>
              <p className="interview__candidate-role">{jobRole}</p>
            </div>
          </div>
        }
      />

      <main className="container interview">
        <dl className="interview__candidate-meta">
          <div>
            <dt>Experience</dt>
            <dd>{formatYearsExperience(yearsExperience)}</dd>
          </div>
          <div>
            <dt>Education</dt>
            <dd>{education}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
        </dl>

        {interviewStarting && (
          <p className="interview__status-message">Starting your adaptive interview…</p>
        )}

        {interviewError && (
          <div className="interview__error">
            <p className="interview__error-message" role="alert">
              {interviewError}
            </p>
            <Button variant="primary" size="md" onClick={handleRetryStart}>
              Retry
            </Button>
          </div>
        )}

        {!interviewStarting && !interviewError && questionText && (
          <>
            <div className="interview__progress-row">
              <ProgressBar current={questionNumber} total={TOTAL_QUESTIONS} />
            </div>

            <QuestionCard question={question} questionNumber={questionNumber} />

            <form className="interview__answer" onSubmit={handleSubmit}>
              <label className="interview__answer-label" htmlFor="answer">
                Your response
              </label>
              <textarea
                id="answer"
                className="interview__textarea"
                placeholder="Type your answer here. Explain your reasoning as you would out loud to an interviewer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                disabled={submitting}
              />

              <div className="interview__answer-footer">
                <div className="interview__status">
                  <span className="interview__status-dot" aria-hidden="true" />
                  <div>
                    <p className="interview__status-title">Adaptive Interview Intelligence</p>
                    <p className="interview__status-subtitle">
                      {submitting ? 'Analyzing your response…' : 'Ready for your answer'}
                    </p>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="md" disabled={submitting}>
                  {submitting
                    ? 'Submitting…'
                    : questionNumber >= TOTAL_QUESTIONS
                      ? 'Submit & Finish'
                      : 'Submit Answer'}
                </Button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
