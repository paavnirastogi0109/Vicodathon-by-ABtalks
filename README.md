# Adaptive Interview Intelligence — Frontend Scaffold

Frontend-only UI scaffold for a hackathon demo. **No backend, AI, database, or
auth is included** — all data is static/placeholder, per the project brief.

## Tech stack

- React 18 + Vite
- Plain CSS (design tokens in `src/index.css`, no UI framework)
- `react-router-dom` for page navigation between the 4 screens

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## Screens

| Route                     | Screen                 |
| -------------------------- | ----------------------- |
| `/`                         | Landing / home           |
| `/candidates`               | Candidate selection       |
| `/interview/:candidateId`   | Interview screen          |
| `/feedback`                 | Final feedback / results  |

Navigation between screens is wired with React Router so you can click through
the whole flow: **Landing → Candidates → Interview (5 static questions) →
Feedback**. The "Analyzing your response…" status and question progression
are static UI states, not real AI logic.

## Folder structure

```
src/
  components/       Reusable UI pieces (see below)
  pages/            One file + one CSS file per screen
  data/             Placeholder candidate + interview content
  index.css         Design tokens (color, type, radius) + global reset
  App.jsx           Route definitions
  main.jsx          App entry point
```

### Components

- `Navbar` — sticky header with product wordmark, optional right-side slot
- `Button` — shared button with `primary` / `secondary` / `ghost` variants
- `CandidateCard` — candidate summary card with a "Start Interview" CTA
- `ProgressBar` — "Question X of Y" indicator with a fill bar
- `QuestionCard` — the large interviewer question panel
- `DifficultyBadge` — Easy / Medium / Hard pill with a bar-height indicator
- `TopicBadge` — current topic pill (e.g. "System Design")
- `FeedbackCard` — a titled list used for strengths / improvements / next steps
- `BranchDiagram` — signature SVG visual: a branching question-path diagram
  used on the landing hero to represent "adaptive" interviewing

## Design notes

- Palette: near-black ink background (`#0d1117`), warm amber accent
  (`#f2a94e`) for the "live" state, teal (`#4fd1c5`) as a secondary accent.
- Type: **Space Grotesk** for display headings, **IBM Plex Sans** for body
  copy, **IBM Plex Mono** for labels/badges/progress counters — loaded via
  Google Fonts in `index.html`.
- Signature visual: a branching node/path diagram (`BranchDiagram`) is the
  one recurring motif tying the brand to the product's core idea — each
  interview is a decision tree that reroutes after every answer.

## Swapping in real data later

Replace the contents of `src/data/candidates.js` and
`src/data/interviewMock.js` with real API responses once the backend exists —
component props are already shaped to match, so no component changes should
be needed for the initial integration.
