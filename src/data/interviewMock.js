// Static placeholder content for the interview + feedback screens.
// No adaptive logic lives here yet — this is UI scaffolding only.

export const mockQuestions = [
  {
    id: 1,
    topic: 'Data Structures',
    difficulty: 'Easy',
    prompt:
      'Walk me through how you would detect a cycle in a singly linked list. What is the time and space complexity of your approach?',
  },
  {
    id: 2,
    topic: 'System Design',
    difficulty: 'Medium',
    prompt:
      'Design a rate limiter for a public API that serves millions of requests per day. What data structure would you use, and how would it behave under bursty traffic?',
  },
  {
    id: 3,
    topic: 'React & Frontend',
    difficulty: 'Medium',
    prompt:
      'Explain how React reconciles the virtual DOM. What would you change in a component to avoid unnecessary re-renders in a large list?',
  },
  {
    id: 4,
    topic: 'Databases',
    difficulty: 'Hard',
    prompt:
      'A query that joins three large tables has become slow in production. Describe your process for diagnosing the bottleneck and the indexing strategy you would consider.',
  },
  {
    id: 5,
    topic: 'Behavioral',
    difficulty: 'Easy',
    prompt:
      'Tell me about a time you disagreed with a technical decision on your team. How did you handle it, and what was the outcome?',
  },
]

export const mockFeedback = {
  overallSummary:
    'The candidate demonstrated solid fundamentals in data structures and communicated their reasoning clearly under time pressure. Responses on system design showed room to go deeper on trade-offs, particularly around scalability and failure handling.',
  score: 78,
  strengths: [
    'Clear, structured explanations with correct time/space complexity analysis',
    'Strong grasp of React rendering behavior and practical optimization techniques',
    'Communicated trade-offs honestly instead of overselling a single approach',
  ],
  improvements: [
    'Go deeper on distributed systems failure modes (retries, backpressure, idempotency)',
    'Practice quantifying database query bottlenecks with concrete diagnostic steps',
    'Structure behavioral answers with a clearer situation → action → outcome arc',
  ],
  nextSteps: [
    'Review rate limiting algorithms: token bucket vs. sliding window log',
    'Pair on a query-optimization exercise using EXPLAIN ANALYZE',
    'Schedule a follow-up interview focused on system design at Medium–Hard difficulty',
  ],
}
