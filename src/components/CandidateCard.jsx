import Button from './Button.jsx'
import './CandidateCard.css'

export default function CandidateCard({ candidate, onStart }) {
  const { name, role, experience, education, focus, initials } = candidate

  return (
    <article className="candidate-card">
      <div className="candidate-card__top">
        <div className="candidate-card__avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h3 className="candidate-card__name">{name}</h3>
          <p className="candidate-card__role">{role}</p>
        </div>
      </div>

      <dl className="candidate-card__meta">
        <div>
          <dt>Experience</dt>
          <dd>{experience}</dd>
        </div>
        <div>
          <dt>Education</dt>
          <dd>{education}</dd>
        </div>
        <div>
          <dt>Focus areas</dt>
          <dd>{focus}</dd>
        </div>
      </dl>

      <Button variant="primary" size="sm" className="candidate-card__cta" onClick={onStart}>
        Start Interview
      </Button>
    </article>
  )
}
