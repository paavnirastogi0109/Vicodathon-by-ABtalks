import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Button from '../components/Button.jsx'
import FeedbackCard from '../components/FeedbackCard.jsx'
import { mockFeedback } from '../data/interviewMock.js'
import './FeedbackScreen.css'

export default function FeedbackScreen() {
  const navigate = useNavigate()
  const { overallSummary, score, strengths, improvements, nextSteps } = mockFeedback

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
          <div className="feedback__score">
            <span className="feedback__score-value">{score}</span>
            <span className="feedback__score-label">/ 100</span>
          </div>
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
