import Button from './Button.jsx'
import { getInitials, formatYearsExperience } from '../data/candidateFormat.js'
import './CandidateCard.css'

export default function CandidateCard({ candidate, onStart }) {
  const { name, jobRole, yearsExperience, education, status } = candidate.member
  const initials = getInitials(name)

  return (
    <article className="candidate-card">
      <div className="candidate-card__top">
        <div className="candidate-card__avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h3 className="candidate-card__name">{name}</h3>
          <p className="candidate-card__role">{jobRole}</p>
        </div>
      </div>

      <dl className="candidate-card__meta">
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

      <Button variant="primary" size="sm" className="candidate-card__cta" onClick={onStart}>
        Start Interview
      </Button>
    </article>
  )
}
