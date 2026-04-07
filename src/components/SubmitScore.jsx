import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'

export default function SubmitScore({ wpm, accuracy, mode }) {
  const { submitScore, getSavedUsername } = useLeaderboard()
  const [username, setUsername] = useState(getSavedUsername)
  const [status, setStatus] = useState('idle') // idle | submitting | done | error

  if (wpm === 0) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || status === 'submitting' || status === 'done') return
    setStatus('submitting')
    try {
      await submitScore({ username, wpm, accuracy, mode })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="text-sm text-center py-2" style={{ color: '#e2b714', fontFamily: 'JetBrains Mono, monospace' }}>
        submitted ✓
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="your name"
        maxLength={20}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="flex-1 rounded-lg px-4 text-sm outline-none"
        style={{
          minHeight: '48px',
          backgroundColor: '#161618',
          color: '#cdd6f4',
          border: '1px solid #2a2a35',
          fontFamily: 'JetBrains Mono, monospace',
        }}
        onFocus={e => e.target.style.borderColor = '#e2b714'}
        onBlur={e => e.target.style.borderColor = '#2a2a35'}
      />
      <button
        type="submit"
        disabled={!username.trim() || status === 'submitting'}
        className="rounded-lg px-5 text-sm font-semibold transition-all active:scale-95"
        style={{
          minHeight: '48px',
          backgroundColor: username.trim() ? '#e2b714' : '#1e1e22',
          color: username.trim() ? '#0e0e0f' : '#3a3a4a',
          fontFamily: 'Inter, sans-serif',
          transition: 'background-color 0.15s, color 0.15s',
        }}
      >
        {status === 'submitting' ? '...' : 'submit'}
      </button>
      {status === 'error' && (
        <p className="text-xs mt-1 w-full" style={{ color: '#ca4754' }}>
          something went wrong, try again
        </p>
      )}
    </form>
  )
}
