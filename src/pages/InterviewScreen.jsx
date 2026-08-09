import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import Button from '../components/Button.jsx'
import { fetchCandidateById } from '../data/candidatesApi.js'
import { getInitials, formatYearsExperience } from '../data/candidateFormat.js'
import { mockQuestions } from '../data/interviewMock.js'
import './InterviewScreen.css'

export default function InterviewScreen() {
  const { candidateId } = useParams()
  const navigate = useNavigate()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')

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

  const totalQuestions = mockQuestions.length
  const currentQuestion = mockQuestions[questionIndex]
  const isLastQuestion = questionIndex === totalQuestions - 1

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLastQuestion) {
      navigate('/feedback')
      return
    }
    setQuestionIndex((prev) => prev + 1)
    setAnswer('')
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

        <div className="interview__progress-row">
          <ProgressBar current={questionIndex + 1} total={totalQuestions} />
        </div>

        <QuestionCard question={currentQuestion} questionNumber={questionIndex + 1} />

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
          />

          <div className="interview__answer-footer">
            <div className="interview__status">
              <span className="interview__status-dot" aria-hidden="true" />
              <div>
                <p className="interview__status-title">Adaptive Interview Intelligence</p>
                <p className="interview__status-subtitle">Analyzing your response…</p>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md">
              {isLastQuestion ? 'Submit & Finish' : 'Submit Answer'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
