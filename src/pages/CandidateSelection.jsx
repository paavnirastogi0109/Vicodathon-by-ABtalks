import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import CandidateCard from '../components/CandidateCard.jsx'
import { candidates } from '../data/candidates.js'
import './CandidateSelection.css'

export default function CandidateSelection() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <Navbar />

      <main className="container candidates">
        <div className="candidates__header">
          <span className="eyebrow">Step 1 of 2</span>
          <h1 className="candidates__title">Select a candidate</h1>
          <p className="candidates__subtitle">
            Choose who you&apos;d like to interview. The question path adapts to each candidate&apos;s
            experience level from the very first question. This is placeholder candidate data for the demo.
          </p>
        </div>

        <div className="candidates__grid">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onStart={() => navigate(`/interview/${candidate.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
