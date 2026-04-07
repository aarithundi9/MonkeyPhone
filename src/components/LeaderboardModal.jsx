import { useState, useEffect } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'

export default function LeaderboardModal({ onClose }) {
  const [mode, setMode] = useState(30)
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { fetchTopScores } = useLeaderboard()

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchTopScores(mode)
      .then(data => {
        setScores(data)
        setLoading(false)
      })
      .catch(() => {
        setError('couldn\'t load scores')
        setLoading(false)
      })
  }, [mode])

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl pb-safe"
        style={{ backgroundColor: '#161618', maxHeight: '85dvh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2
            className="font-bold text-lg"
            style={{ color: '#e2b714', fontFamily: 'JetBrains Mono, monospace' }}
          >
            leaderboard
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none flex items-center justify-center"
            style={{ color: '#3a3a4a', minHeight: '44px', minWidth: '44px' }}
          >
            ×
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-5 px-6 mb-5">
          {[15, 30, 60].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative transition-all"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '15px',
                fontWeight: mode === m ? '600' : '400',
                color: mode === m ? '#e2b714' : '#3a3a4a',
                background: 'none',
                border: 'none',
                padding: '0 0 6px 0',
                minHeight: '44px',
              }}
            >
              {m}s
              {mode === m && (
                <span
                  className="absolute left-0 right-0"
                  style={{ bottom: 0, height: '2px', backgroundColor: '#e2b714', borderRadius: '1px' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Score list */}
        <div className="px-6 pb-6">
          {loading && (
            <div className="py-8 text-center text-sm" style={{ color: '#3a3a4a' }}>
              loading...
            </div>
          )}

          {error && (
            <div className="py-8 text-center text-sm" style={{ color: '#ca4754' }}>
              {error}
            </div>
          )}

          {!loading && !error && scores.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: '#3a3a4a' }}>
              no scores yet — be the first
            </div>
          )}

          {!loading && !error && scores.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: '1px solid #1e1e22' }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="tabular-nums w-5 text-right"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                    color: i === 0 ? '#e2b714' : '#3a3a4a',
                    fontWeight: i === 0 ? '700' : '400',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: i === 0 ? '#cdd6f4' : '#6a6a7a' }}
                >
                  {s.username}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-bold tabular-nums"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    color: i === 0 ? '#e2b714' : '#cdd6f4',
                  }}
                >
                  {s.wpm}
                  <span className="text-xs font-normal ml-1" style={{ color: '#3a3a4a' }}>wpm</span>
                </span>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: '#3a3a4a', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {s.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
