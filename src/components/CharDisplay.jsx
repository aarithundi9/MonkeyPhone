import { useRef, useEffect } from 'react'

const LINE_HEIGHT = 18 * 1.8 // 32.4px per line
const VISIBLE_LINES = 3

export default function CharDisplay({ chars, currentIndex }) {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const cursor = cursorRef.current
    if (!container || !cursor) return

    container.scrollTop = 0
    const containerRect = container.getBoundingClientRect()
    const cursorRect = cursor.getBoundingClientRect()
    const naturalTop = cursorRect.top - containerRect.top

    container.scrollTop = Math.max(0, naturalTop - LINE_HEIGHT * 0.1)
  }, [currentIndex])

  return (
    <div
      ref={containerRef}
      style={{
        height: `${LINE_HEIGHT * VISIBLE_LINES}px`,
        overflowY: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '18px',
          lineHeight: '1.8',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {chars.map((ch, i) => {
          const isCursor = i === currentIndex
          const stateClass =
            ch.state === 'correct' ? 'char-correct' :
            ch.state === 'error'   ? 'char-error'   :
                                     'char-untouched'
          return (
            <span
              key={i}
              ref={isCursor ? cursorRef : null}
              className={`${stateClass}${isCursor ? ' char-cursor' : ''}`}
            >
              {ch.char === ' ' ? '\u00A0' : ch.char}
            </span>
          )
        })}
        {/* Cursor at end of prompt */}
        {currentIndex >= chars.length && (
          <span ref={cursorRef} className="char-cursor">&nbsp;</span>
        )}
      </div>
    </div>
  )
}
