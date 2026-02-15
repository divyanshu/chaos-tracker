import type { Task } from '../domain'

export interface SearchResult {
  task: Task
  score: number
  titleHighlights: [number, number][] // [start, end] bold ranges
}

/**
 * Fuzzy search tasks by query. Returns top `maxResults` results sorted by score.
 * Empty query returns tasks sorted by last_touched descending.
 */
export function searchTasks(
  tasks: Task[],
  query: string,
  maxResults = 8,
): SearchResult[] {
  const q = query.trim().toLowerCase()

  if (!q) {
    return tasks
      .slice()
      .sort((a, b) => new Date(b.last_touched).getTime() - new Date(a.last_touched).getTime())
      .slice(0, maxResults)
      .map((task) => ({ task, score: 0, titleHighlights: [] }))
  }

  const results: SearchResult[] = []

  for (const task of tasks) {
    const titleLower = task.title.toLowerCase()
    const descLower = (task.description ?? '').toLowerCase()
    let score = 0
    let titleHighlights: [number, number][] = []

    // 1. Exact substring in title
    const exactIdx = titleLower.indexOf(q)
    if (exactIdx !== -1) {
      score = 1.0
      titleHighlights = [[exactIdx, exactIdx + q.length]]
    }

    // 2. All query words prefix-match title words
    if (score < 0.8) {
      const queryWords = q.split(/\s+/)
      const titleWords = titleLower.split(/\s+/)
      const highlights: [number, number][] = []
      const allMatch = queryWords.every((qw) =>
        titleWords.some((tw) => {
          if (tw.startsWith(qw)) {
            const wordStart = titleLower.indexOf(tw)
            highlights.push([wordStart, wordStart + qw.length])
            return true
          }
          return false
        }),
      )
      if (allMatch && queryWords.length > 0) {
        score = Math.max(score, 0.8)
        if (score === 0.8) titleHighlights = highlights
      }
    }

    // 3. Exact substring in description
    if (score < 0.4 && descLower.includes(q)) {
      score = Math.max(score, 0.4)
    }

    // 4. Subsequence match in title
    if (score < 0.3) {
      const subResult = subsequenceMatch(titleLower, q)
      if (subResult) {
        const clusterBonus = clusterScore(subResult.indices, titleLower.length)
        score = Math.max(score, 0.3 + clusterBonus)
        if (titleHighlights.length === 0) {
          titleHighlights = indicesToRanges(subResult.indices)
        }
      }
    }

    // 5. Subsequence match in description
    if (score < 0.15) {
      const subResult = subsequenceMatch(descLower, q)
      if (subResult) {
        score = Math.max(score, 0.15)
      }
    }

    if (score > 0) {
      // Recency tiebreaker
      const daysSince = (Date.now() - new Date(task.last_touched).getTime()) / (1000 * 60 * 60 * 24)
      score += Math.max(0, 0.1 - daysSince * 0.01)
      results.push({ task, score, titleHighlights })
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults)
}

function subsequenceMatch(
  text: string,
  query: string,
): { indices: number[] } | null {
  const indices: number[] = []
  let qi = 0
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) {
      indices.push(i)
      qi++
    }
  }
  return qi === query.length ? { indices } : null
}

function clusterScore(indices: number[], textLength: number): number {
  if (indices.length <= 1 || textLength === 0) return 0
  const spread = indices[indices.length - 1] - indices[0]
  const maxSpread = textLength
  return Math.max(0, 0.15 * (1 - spread / maxSpread))
}

function indicesToRanges(indices: number[]): [number, number][] {
  if (indices.length === 0) return []
  const ranges: [number, number][] = []
  let start = indices[0]
  let end = indices[0] + 1
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === end) {
      end++
    } else {
      ranges.push([start, end])
      start = indices[i]
      end = indices[i] + 1
    }
  }
  ranges.push([start, end])
  return ranges
}
