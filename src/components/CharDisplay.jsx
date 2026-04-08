import { useRef, useEffect } from 'react'

const LINE_HEIGHT = 18 * 1.8 // 32.4px per line
const VISIBLE_LINES = 3

// Group flat chars array into word tokens so we can wrap each word in
// an inline-block span — prevents mid-word line breaks between char spans
function tokenize(chars) {
  const tokens = []
  let word = []

  const flush = () => {
    if (word.length) { tokens.push({ type: 'word', chars: word }); word = [] }
  }

  chars.forEach((ch, i) => {
    if (ch.char === ' ') {
      flush()
      tokens.push({ type: 'space', ch, i })
    } else {
      word.push({ ch, i })
    }
  })
  flush()
  return tokens
}

export default function CharDisplay({ chars, currentIndex }) {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const cursor = cursorRef.current
    if (!container || !cursor) return

    // Compute absolute position of cursor within the scrollable content
    // without resetting scroll (avoids flash)
    const containerRect = container.getBoundingClientRect()
    const cursorRect = cursor.getBoundingClientRect()
    const absoluteTop = container.scrollTop + (cursorRect.top - containerRect.top)
    const target = Math.max(0, absoluteTop - LINE_HEIGHT * 0.1)

    container.scrollTo({ top: target, behavior: 'smooth' })
  }, [currentIndex])

  const tokens = tokenize(chars)

  return (
    <div
      ref={containerRef}
      style={{ height: `${LINE_HEIGHT * VISIBLE_LINES}px`, overflowY: 'hidden' }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '18px',
          lineHeight: '1.8',
          wordBreak: 'normal',
          overflowWrap: 'normal',
        }}
      >
        {tokens.map((token, ti) => {
          if (token.type === 'space') {
            const isCursor = token.i === currentIndex
            const stateClass = token.ch.state === 'correct' ? 'char-correct'
              : token.ch.state === 'error' ? 'char-error' : 'char-untouched'
            return (
              <span
                key={ti}
                ref={isCursor ? cursorRef : null}
                className={`${stateClass}${isCursor ? ' char-cursor' : ''}`}
              >
                {'\u00A0'}
              </span>
            )
          }

          // Word token — inline-block prevents mid-word breaks
          return (
            <span key={ti} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {token.chars.map(({ ch, i }) => {
                const isCursor = i === currentIndex
                const stateClass = ch.state === 'correct' ? 'char-correct'
                  : ch.state === 'error' ? 'char-error' : 'char-untouched'
                return (
                  <span
                    key={i}
                    ref={isCursor ? cursorRef : null}
                    className={`${stateClass}${isCursor ? ' char-cursor' : ''}`}
                  >
                    {ch.char}
                  </span>
                )
              })}
            </span>
          )
        })}

        {/* Cursor sitting after the last character */}
        {currentIndex >= chars.length && (
          <span ref={cursorRef} className="char-cursor">&nbsp;</span>
        )}
      </div>
    </div>
  )
}
