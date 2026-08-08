import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import Button from '../components/Button.jsx'
import { candidates } from '../data/candidates.js'
import { mockQuestions } from '../data/interviewMock.js'
import './InterviewScreen.css'

export default function InterviewScreen() {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const candidate = candidates.find((c) => c.id === candidateId) ?? candidates[0]

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')

  const totalQuestions = mockQuestions.length
  const currentQuestion = mockQuestions[questionIndex]
  const isLastQuestion = questionIndex === totalQuestions - 1

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLastQuestion) {
      navigate('/feedback')
      return
    }
    setQuestionIndex((prev) => prev + 1)
    setAnswer('')
  }

  return (
    <div className="page">
      <Navbar
        rightSlot={
          <div className="interview__candidate-pill">
            <span className="interview__candidate-avatar">{candidate.initials}</span>
            <div>
              <p className="interview__candidate-name">{candidate.name}</p>
              <p className="interview__candidate-role">{candidate.role}</p>
            </div>
          </div>
        }
      />

      <main className="container interview">
        <div className="interview__progress-row">
          <ProgressBar current={questionIndex + 1} total={totalQuestions} />
        </div>

        <QuestionCard question={currentQuestion} questionNumber={questionIndex + 1} />

        <form className="interview__answer" onSubmit={handleSubmit}>
          <label className="interview__answer-label" htmlFor="answer">
            Your response
          </label>
          <textarea
            id="answer"
            className="interview__textarea"
            placeholder="Type your answer here. Explain your reasoning as you would out loud to an interviewer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
          />

          <div className="interview__answer-footer">
            <div className="interview__status">
              <span className="interview__status-dot" aria-hidden="true" />
              <div>
                <p className="interview__status-title">Adaptive Interview Intelligence</p>
                <p className="interview__status-subtitle">Analyzing your response…</p>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md">
              {isLastQuestion ? 'Submit & Finish' : 'Submit Answer'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
