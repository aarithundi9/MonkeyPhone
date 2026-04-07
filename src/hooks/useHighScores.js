const STORAGE_KEY = 'thumbspeed_highscores'

export function useHighScores() {
  function getScores() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : { 15: null, 30: null, 60: null }
    } catch {
      return { 15: null, 30: null, 60: null }
    }
  }

  function saveScore(mode, wpm) {
    const scores = getScores()
    const current = scores[mode]
    if (current === null || wpm > current) {
      scores[mode] = wpm
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
      return true // new high score
    }
    return false
  }

  function getBestForMode(mode) {
    return getScores()[mode]
  }

  return { getScores, saveScore, getBestForMode }
}
