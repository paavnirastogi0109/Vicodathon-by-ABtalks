const CANDIDATES_URL = '/candidates.json'

export async function fetchCandidates() {
  const response = await fetch(CANDIDATES_URL)

  if (!response.ok) {
    throw new Error(`Failed to load candidates (${response.status})`)
  }

  const data = await response.json()

  if (!Array.isArray(data.candidates)) {
    throw new Error('Invalid candidates data: expected a candidates array')
  }

  return data.candidates
}

export async function fetchCandidateById(id) {
  const candidates = await fetchCandidates()
  return candidates.find((candidate) => candidate.member.id === id) ?? null
}
