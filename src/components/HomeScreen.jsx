import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModeSelector from './ModeSelector'
import { useHighScores } from '../hooks/useHighScores'
import LeaderboardModal from './LeaderboardModal'

export default function HomeScreen() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(30)
  const [showScores, setShowScores] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const { getScores } = useHighScores()
  const scores = getScores()

  return (
    <div
      className="flex flex-col px-7 pt-safe pb-safe"
      style={{ minHeight: '100dvh', backgroundColor: '#0e0e0f' }}
    >
      {/* Top spacer */}
      <div className="flex-1" />

      {/* Title block — left aligned */}
      <div className="mb-10">
        <h1
          className="text-[52px] font-bold leading-none tracking-tight"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e2b714' }}
        >
          thumb speed
        </h1>
        <p className="mt-3 text-base" style={{ color: '#4a4a5a' }}>
          how fast do u actually text
        </p>
      </div>

      {/* Mode selector */}
      <div className="mb-8">
        <ModeSelector mode={mode} onChange={setMode} />
      </div>

      {/* Start button */}
      <button
        onClick={() => navigate('/test', { state: { mode } })}
        className="mb-6 w-full font-bold text-base rounded-lg transition-all duration-150 active:scale-[0.98]"
        style={{
          minHeight: '52px',
          backgroundColor: '#e2b714',
          color: '#0e0e0f',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        start
      </button>

      {/* Links row */}
      <div className="flex gap-6 mb-2">
        <button
          onClick={() => setShowLeaderboard(true)}
          className="text-sm transition-colors"
          style={{ color: '#3a3a4a', minHeight: '44px' }}
        >
          leaderboard
        </button>
        <button
          onClick={() => setShowScores(true)}
          className="text-sm transition-colors"
          style={{ color: '#3a3a4a', minHeight: '44px' }}
        >
          best scores
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="flex-1" />

      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}

      {/* High scores modal */}
      {showScores && (
        <div
          className="fixed inset-0 flex items-end justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          onClick={() => setShowScores(false)}
        >
          <div
            className="w-full max-w-md p-6 pb-safe rounded-t-2xl"
            style={{ backgroundColor: '#161618' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg" style={{ color: '#e2b714', fontFamily: 'JetBrains Mono, monospace' }}>
                best scores
              </h2>
              <button
                onClick={() => setShowScores(false)}
                className="text-2xl leading-none flex items-center justify-center"
                style={{ color: '#3a3a4a', minHeight: '44px', minWidth: '44px' }}
              >
                ×
              </button>
            </div>

            <div className="space-y-1">
              {[15, 30, 60].map(m => (
                <div
                  key={m}
                  className="flex justify-between items-center py-3"
                  style={{ borderBottom: '1px solid #1e1e22' }}
                >
                  <span className="text-sm" style={{ color: '#4a4a5a', fontFamily: 'JetBrains Mono, monospace' }}>
                    {m}s
                  </span>
                  <span className="font-bold tabular-nums" style={{ color: scores[m] !== null ? '#e2b714' : '#2a2a35', fontFamily: 'JetBrains Mono, monospace' }}>
                    {scores[m] !== null ? `${scores[m]} wpm` : '—'}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs mt-5" style={{ color: '#2a2a35' }}>
              saved on this device
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
