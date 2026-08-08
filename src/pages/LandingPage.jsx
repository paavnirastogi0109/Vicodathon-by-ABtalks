import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Button from '../components/Button.jsx'
import BranchDiagram from '../components/BranchDiagram.jsx'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="page landing">
      <Navbar
        rightSlot={
          <Button variant="secondary" size="sm" onClick={() => navigate('/candidates')}>
            View Candidates
          </Button>
        }
      />

      <main className="container landing__hero">
        <div className="landing__copy">
          <span className="eyebrow">Adaptive technical interviews</span>
          <h1 className="landing__title">
            An AI interviewer that
            <br />
            adapts to every candidate.
          </h1>
          <p className="landing__description">
            Adaptive Interview Intelligence runs personalized technical interviews that respond to each
            candidate&apos;s experience and learning history in real time — reshaping the question path
            after every answer instead of following a fixed script.
          </p>
          <div className="landing__actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/candidates')}>
              Start Interview
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/feedback')}>
              View sample results →
            </Button>
          </div>

          <div className="landing__stats">
            <div>
              <span className="landing__stat-value">5</span>
              <span className="landing__stat-label">adaptive questions per session</span>
            </div>
            <div>
              <span className="landing__stat-value">3</span>
              <span className="landing__stat-label">difficulty tiers, adjusted live</span>
            </div>
            <div>
              <span className="landing__stat-value">1</span>
              <span className="landing__stat-label">path, unique to each candidate</span>
            </div>
          </div>
        </div>

        <div className="landing__visual">
          <BranchDiagram />
          <p className="landing__visual-caption">
            Every interview branches on the candidate&apos;s last answer — this is the live path, not a
            fixed script.
          </p>
        </div>
      </main>

      <footer className="landing__footer">
        <div className="container landing__footer-inner">
          <span>Adaptive Interview Intelligence</span>
          <span>Hackathon build · UI scaffold only</span>
        </div>
      </footer>
    </div>
  )
}
