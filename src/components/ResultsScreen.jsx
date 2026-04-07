import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useHighScores } from '../hooks/useHighScores'

function getReaction(wpm) {
  if (wpm < 20) return { emoji: '🐢', text: 'ur getting there' }
  if (wpm < 35) return { emoji: '👍', text: 'not bad' }
  if (wpm < 50) return { emoji: '🔥', text: 'nice' }
  if (wpm < 65) return { emoji: '⚡', text: 'fast texter' }
  return { emoji: '🤯', text: 'insane' }
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target === 0) return
    const start = performance.now()
    function step(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return value
}

export default function ResultsScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const stats = location.state?.stats
  const mode = location.state?.mode ?? 30
  const initialPrompt = location.state?.initialPrompt ?? null
  const { saveScore } = useHighScores()
  const [isNewBest, setIsNewBest] = useState(false)

  const wpm = stats?.wpm ?? 0
  const accuracy = stats?.accuracy ?? 0
  const rawCpm = stats?.rawCpm ?? 0
  const animatedWpm = useCountUp(wpm)
  const reaction = getReaction(wpm)

  useEffect(() => {
    if (!stats) return
    setIsNewBest(saveScore(mode, wpm))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleShare() {
    const text = `i just typed ${wpm} wpm on thumb speed 👀 thumbspeed.vercel.app`
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text)
    }
  }

  if (!stats) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div
      className="flex flex-col px-7 pt-safe pb-safe"
      style={{ minHeight: '100dvh', backgroundColor: '#0e0e0f' }}
    >
      <div className="flex-1" />

      {/* New best */}
      {isNewBest && (
        <div
          className="mb-6 text-sm font-semibold"
          style={{ color: '#e2b714', fontFamily: 'JetBrains Mono, monospace' }}
        >
          new best 🏆
        </div>
      )}

      {/* WPM — big, left-aligned */}
      <div className="mb-1 wpm-animate">
        <span
          className="tabular-nums font-bold leading-none"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '96px',
            color: '#e2b714',
            lineHeight: 1,
          }}
        >
          {animatedWpm}
        </span>
      </div>
      <div className="mb-8">
        <span className="text-sm" style={{ color: '#3a3a4a', fontFamily: 'JetBrains Mono, monospace' }}>
          wpm (words per minute)
        </span>
      </div>

      {/* Reaction */}
      <div className="mb-10 flex items-center gap-2">
        <span style={{ fontSize: '22px' }}>{reaction.emoji}</span>
        <span className="text-base" style={{ color: '#4a4a5a' }}>{reaction.text}</span>
      </div>

      {/* Stats — plain rows, no cards */}
      <div className="mb-10 space-y-3">
        {[
          { label: 'accuracy', value: `${accuracy}%` },
          { label: 'time', value: `${mode}s` },
          { label: 'raw cpm (chars per minute)', value: rawCpm },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-baseline py-2"
            style={{ borderBottom: '1px solid #1a1a1e' }}
          >
            <span
              className="text-sm"
              style={{ color: '#3a3a4a', fontFamily: 'JetBrains Mono, monospace' }}
            >
              {label}
            </span>
            <span
              className="font-bold tabular-nums"
              style={{ color: '#cdd6f4', fontFamily: 'JetBrains Mono, monospace' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => navigate('/test', { state: { mode, prompt: initialPrompt } })}
          className="flex-1 font-bold rounded-lg transition-all active:scale-[0.98]"
          style={{ minHeight: '52px', backgroundColor: '#e2b714', color: '#0e0e0f', fontFamily: 'Inter, sans-serif' }}
        >
          try again
        </button>
        <button
          onClick={() => navigate('/test', { state: { mode } })}
          className="flex-1 font-semibold rounded-lg transition-all active:scale-[0.98]"
          style={{ minHeight: '52px', backgroundColor: '#161618', color: '#6a6a7a', fontFamily: 'Inter, sans-serif' }}
        >
          new prompt
        </button>
      </div>

      <button
        onClick={handleShare}
        className="w-full text-sm transition-all active:scale-[0.98]"
        style={{ minHeight: '44px', color: '#3a3a4a' }}
      >
        share result ↗
      </button>

      <div className="flex-1" />

      <button
        onClick={() => navigate('/')}
        className="text-sm mb-2"
        style={{ color: '#2a2a35', minHeight: '44px' }}
      >
        ← home
      </button>
    </div>
  )
}
