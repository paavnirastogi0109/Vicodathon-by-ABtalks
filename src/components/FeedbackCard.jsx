import './FeedbackCard.css'

const ICONS = {
  strength: '✓',
  improvement: '△',
  next: '→',
}

export default function FeedbackCard({ title, items, tone = 'strength' }) {
  return (
    <div className={`feedback-card feedback-card--${tone}`}>
      <h3 className="feedback-card__title">{title}</h3>
      <ul className="feedback-card__list">
        {items.map((item, i) => (
          <li key={i}>
            <span className="feedback-card__icon" aria-hidden="true">
              {ICONS[tone]}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
