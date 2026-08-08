import TopicBadge from './TopicBadge.jsx'
import DifficultyBadge from './DifficultyBadge.jsx'
import './QuestionCard.css'

export default function QuestionCard({ question, questionNumber }) {
  return (
    <div className="question-card">
      <div className="question-card__badges">
        <TopicBadge topic={question.topic} />
        <DifficultyBadge difficulty={question.difficulty} />
      </div>
      <p className="question-card__eyebrow">Interviewer · Question {questionNumber}</p>
      <h2 className="question-card__prompt">{question.prompt}</h2>
    </div>
  )
}
