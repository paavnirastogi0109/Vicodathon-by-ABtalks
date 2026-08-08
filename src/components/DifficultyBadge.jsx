import './DifficultyBadge.css'

const LEVELS = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
}

export default function DifficultyBadge({ difficulty }) {
  const level = LEVELS[difficulty] ?? 1

  return (
    <span className={`difficulty-badge difficulty-badge--${difficulty?.toLowerCase()}`}>
      <span className="difficulty-badge__bars" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={bar <= level ? 'is-filled' : ''} />
        ))}
      </span>
      {difficulty}
    </span>
  )
}
