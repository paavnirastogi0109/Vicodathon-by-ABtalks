import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Button from '../components/Button.jsx'
import FeedbackCard from '../components/FeedbackCard.jsx'
import { mockFeedback } from '../data/interviewMock.js'
import './FeedbackScreen.css'

// Pull a "NN%" style score out of the backend's summary text, e.g.
// "...with an average performance score of 82%." -> 82
function extractScoreFromSummary(summary) {
  if (!summary) return null
  const match = summary.match(/(\d{1,3})\s*%/)
  if (!match) return null
  const value = Number(match[1])
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null
}

export default function FeedbackScreen() {
  const navigate = useNavigate()
  const location = useLocation()

  // Feedback produced by the backend for this interview session, passed via
  // navigate('/feedback', { state: { feedback } }) when the interview
  // finishes. Falls back to the static mock only if someone lands on this
  // route directly without having completed a backend-driven interview.
  const backendFeedback = location.state?.feedback

  const overallSummary = backendFeedback?.summary ?? mockFeedback.overallSummary
  const strengths = backendFeedback?.strengths ?? mockFeedback.strengths
  const improvements = backendFeedback?.gaps ?? mockFeedback.improvements
  const nextSteps = backendFeedback?.next ?? mockFeedback.nextSteps

  const score = backendFeedback
    ? extractScoreFromSummary(backendFeedback.summary)
    : mockFeedback.score

  return (
    <div className="page">
      <Navbar />

      <main className="container feedback">
        <div className="feedback__complete">
          <span className="feedback__complete-dot" aria-hidden="true" />
          Interview complete
        </div>

        <div className="feedback__header">
          <div>
            <span className="eyebrow">Results</span>
            <h1 className="feedback__title">Interview Summary</h1>
          </div>
          {score !== null && (
            <div className="feedback__score">
              <span className="feedback__score-value">{score}</span>
              <span className="feedback__score-label">/ 100</span>
            </div>
          )}
        </div>

        <p className="feedback__summary">{overallSummary}</p>

        <div className="feedback__grid">
          <FeedbackCard title="Strengths" items={strengths} tone="strength" />
          <FeedbackCard title="Areas for improvement" items={improvements} tone="improvement" />
          <FeedbackCard title="Recommended next steps" items={nextSteps} tone="next" />
        </div>

        <div className="feedback__actions">
          <Button variant="secondary" onClick={() => navigate('/candidates')}>
            Back to candidates
          </Button>
          <Button variant="primary" onClick={() => navigate('/')}>
            Return home
          </Button>
        </div>
      </main>
    </div>
  )
}
