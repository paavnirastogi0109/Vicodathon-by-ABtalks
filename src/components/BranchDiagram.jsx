import './BranchDiagram.css'

// The recurring visual thesis of the product: every interview is a
// decision tree. One path lights up amber (the path this candidate is on);
// the rest stay dormant graphite. Nodes pulse faintly to suggest a live,
// ongoing evaluation rather than a fixed script.
export default function BranchDiagram() {
  return (
    <svg
      className="branch-diagram"
      viewBox="0 0 420 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram of an adaptive interview question path branching based on candidate answers"
    >
      {/* dormant branches */}
      <path d="M40 180 L150 90 L260 60 L360 40" className="bd-line bd-line--dim" />
      <path d="M150 90 L260 130" className="bd-line bd-line--dim" />
      <path d="M260 130 L360 110" className="bd-line bd-line--dim" />
      <path d="M40 180 L150 270 L260 300 L360 320" className="bd-line bd-line--dim" />
      <path d="M150 270 L260 240" className="bd-line bd-line--dim" />

      {/* live path */}
      <path d="M40 180 L150 180 L260 195 L360 210" className="bd-line bd-line--live" />

      {/* dormant nodes */}
      <circle cx="150" cy="90" r="6" className="bd-node bd-node--dim" />
      <circle cx="260" cy="60" r="5" className="bd-node bd-node--dim" />
      <circle cx="360" cy="40" r="5" className="bd-node bd-node--dim" />
      <circle cx="260" cy="130" r="5" className="bd-node bd-node--dim" />
      <circle cx="360" cy="110" r="5" className="bd-node bd-node--dim" />
      <circle cx="150" cy="270" r="6" className="bd-node bd-node--dim" />
      <circle cx="260" cy="300" r="5" className="bd-node bd-node--dim" />
      <circle cx="360" cy="320" r="5" className="bd-node bd-node--dim" />
      <circle cx="260" cy="240" r="5" className="bd-node bd-node--dim" />

      {/* live path nodes */}
      <circle cx="40" cy="180" r="8" className="bd-node bd-node--start" />
      <circle cx="150" cy="180" r="7" className="bd-node bd-node--live" />
      <circle cx="260" cy="195" r="7" className="bd-node bd-node--live" />
      <circle cx="360" cy="210" r="8" className="bd-node bd-node--live bd-node--pulse" />
    </svg>
  )
}
