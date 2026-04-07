import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTypingTest } from '../hooks/useTypingTest'
import CharDisplay from './CharDisplay'
import Timer from './Timer'

export default function TestScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode = location.state?.mode ?? 30
  const initialPrompt = location.state?.prompt ?? null
  const textareaRef = useRef(null)
  const handledByKeydownRef = useRef(false)

  const {
    chars,
    currentIndex,
    timeLeft,
    isFinished,
    wpm,
    accuracy,
    promptText,
    finalStats,
    handleKeyInput,
  } = useTypingTest(mode, initialPrompt)

  useEffect(() => {
    const timeout = setTimeout(() => {
      textareaRef.current?.focus()
    }, 150)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (isFinished) {
      navigate('/results', {
        state: { stats: finalStats, mode, initialPrompt },
        replace: true,
      })
    }
  }, [isFinished]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e) {
    handledByKeydownRef.current = false
    if (e.key === 'Backspace') {
      e.preventDefault()
      handledByKeydownRef.current = true
      handleKeyInput('Backspace')
    }
  }

  function handleInput(e) {
    const ta = e.currentTarget
    if (
      e.nativeEvent.inputType === 'deleteContentBackward' ||
      e.nativeEvent.inputType === 'deleteWordBackward'
    ) {
      ta.value = ''
      if (!handledByKeydownRef.current) handleKeyInput('Backspace')
      handledByKeydownRef.current = false
      return
    }
    const data = e.nativeEvent.data
    if (data && data.length === 1) {
      handleKeyInput(data)
    } else if (ta.value.length > 0) {
      handleKeyInput(ta.value[ta.value.length - 1])
    }
    ta.value = ''
    handledByKeydownRef.current = false
  }

  return (
    <div
      className="flex flex-col pt-safe pb-safe"
      style={{ minHeight: '100dvh', backgroundColor: '#0e0e0f' }}
    >
      {/* Stats row */}
      <div className="flex items-center justify-between px-7 pt-5 pb-4">
        {/* WPM left */}
        <div>
          <span
            className="text-xl font-bold tabular-nums"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#cdd6f4' }}
          >
            {wpm}
          </span>
          <span className="text-xs ml-1.5" style={{ color: '#3a3a4a' }}>wpm</span>
        </div>

        {/* Timer center */}
        <Timer timeLeft={timeLeft} />

        {/* Accuracy right */}
        <div>
          <span
            className="text-xl font-bold tabular-nums"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#cdd6f4' }}
          >
            {accuracy}%
          </span>
          <span className="text-xs ml-1.5" style={{ color: '#3a3a4a' }}>acc</span>
        </div>
      </div>

      {/* Typing area — push toward top, not vertically centered */}
      <div
        className="flex-1 flex flex-col justify-start px-7 pt-8"
        onClick={() => textareaRef.current?.focus()}
        style={{ touchAction: 'manipulation', cursor: 'text' }}
      >
        <div className="relative">
          <CharDisplay chars={chars} currentIndex={currentIndex} />
          <textarea
            ref={textareaRef}
            className="input-overlay"
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onPaste={e => e.preventDefault()}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="next"
            aria-label="Type here"
            tabIndex={0}
            rows={1}
          />
        </div>
      </div>

      {/* Back */}
      <div className="px-7 pb-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm"
          style={{ color: '#2a2a35', minHeight: '44px' }}
        >
          ← back
        </button>
      </div>
    </div>
  )
}
