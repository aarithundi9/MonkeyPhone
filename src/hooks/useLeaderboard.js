import { supabase } from '../lib/supabase'

const USERNAME_KEY = 'thumbspeed_username'

export function useLeaderboard() {
  function getSavedUsername() {
    return localStorage.getItem(USERNAME_KEY) || ''
  }

  function saveUsername(name) {
    localStorage.setItem(USERNAME_KEY, name.trim())
  }

  async function fetchTopScores(mode, limit = 10) {
    const { data, error } = await supabase
      .from('scores')
      .select('username, wpm, accuracy, created_at')
      .eq('mode', mode)
      .order('wpm', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  async function submitScore({ username, wpm, accuracy, mode }) {
    const clean = username.trim().slice(0, 20)
    if (!clean) throw new Error('Name required')
    saveUsername(clean)

    const { error } = await supabase
      .from('scores')
      .insert({ username: clean, wpm, accuracy, mode })

    if (error) throw error
  }

  return { fetchTopScores, submitScore, getSavedUsername }
}
