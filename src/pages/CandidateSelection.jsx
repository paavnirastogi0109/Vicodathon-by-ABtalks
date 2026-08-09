import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import CandidateCard from '../components/CandidateCard.jsx'
import { fetchCandidates } from '../data/candidatesApi.js'
import './CandidateSelection.css'

export default function CandidateSelection() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadCandidates() {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchCandidates()
        if (!cancelled) {
          setCandidates(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load candidates')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCandidates()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page">
      <Navbar />

      <main className="container candidates">
        <div className="candidates__header">
          <span className="eyebrow">Step 1 of 2</span>
          <h1 className="candidates__title">Select a candidate</h1>
          <p className="candidates__subtitle">
            Choose who you&apos;d like to interview. The question path adapts to each candidate&apos;s
            experience level from the very first question.
          </p>
        </div>

        {loading && <p className="candidates__status">Loading candidates…</p>}

        {error && (
          <p className="candidates__status candidates__status--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && candidates.length === 0 && (
          <p className="candidates__status">No candidates available.</p>
        )}

        {!loading && !error && candidates.length > 0 && (
          <div className="candidates__grid">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.member.id}
                candidate={candidate}
                onStart={() => navigate(`/interview/${candidate.member.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
