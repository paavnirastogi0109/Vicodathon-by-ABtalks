import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ rightSlot = null }) {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <circle cx="7" cy="16" r="2.4" fill="#F2A94E" />
              <circle cx="17" cy="8" r="2.4" fill="#F2A94E" />
              <circle cx="17" cy="24" r="2.4" fill="#4B5563" />
              <circle cx="26" cy="8" r="2.1" fill="#4FD1C5" />
              <path d="M9 15L15 9M9 17L15 23" stroke="#4B5563" strokeWidth="1.6" fill="none" />
              <path d="M9 15L15 9" stroke="#F2A94E" strokeWidth="1.6" />
              <path d="M19 8H24" stroke="#4FD1C5" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="navbar__name">
            Adaptive Interview <strong>Intelligence</strong>
          </span>
        </Link>
        {rightSlot && <div className="navbar__right">{rightSlot}</div>}
      </div>
    </header>
  )
}
