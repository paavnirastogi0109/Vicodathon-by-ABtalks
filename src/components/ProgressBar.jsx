import './ProgressBar.css'

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="progress" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className="progress__label">
        <span>
          Question <strong>{current}</strong> of {total}
        </span>
        <span className="progress__pct">{pct}%</span>
      </div>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
