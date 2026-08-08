import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import CandidateSelection from './pages/CandidateSelection.jsx'
import InterviewScreen from './pages/InterviewScreen.jsx'
import FeedbackScreen from './pages/FeedbackScreen.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/candidates" element={<CandidateSelection />} />
      <Route path="/interview/:candidateId" element={<InterviewScreen />} />
      <Route path="/feedback" element={<FeedbackScreen />} />
    </Routes>
  )
}
