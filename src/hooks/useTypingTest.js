import { useState, useEffect, useRef, useCallback } from 'react'
import { getRandomPrompt } from '../data/prompts'

function buildChars(text) {
  return text.split('').map(ch => ({ char: ch, state: 'untouched' }))
}

const _initText = (initialPrompt) => initialPrompt || getRandomPrompt()

export function useTypingTest(mode, initialPrompt = null) {
  // Use a ref so both useState calls share the same initial text
  const initTextRef = useRef(null)
  if (initTextRef.current === null) {
    initTextRef.current = _initText(initialPrompt)
  }
  const [promptText, setPromptText] = useState(initTextRef.current)
  const [chars, setChars] = useState(() => buildChars(initTextRef.current))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(mode)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)

  // Use refs for mutable counters to avoid stale closures
  const correctCharsRef = useRef(0)
  const incorrectCharsRef = useRef(0)
  const totalTypedRef = useRef(0)
  const currentIndexRef = useRef(0)
  const charsRef = useRef(chars)
  const timerRef = useRef(null)
  const elapsedRef = useRef(0)
  const isRunningRef = useRef(false)
  const isFinishedRef = useRef(false)
  const promptTextRef = useRef(initTextRef.current)

  // Keep refs in sync
  useEffect(() => { charsRef.current = chars }, [chars])

  function startTimer() {
    isRunningRef.current = true
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1
      setTimeLeft(prev => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timerRef.current)
          isFinishedRef.current = true
          setIsFinished(true)
          return 0
        }
        return next
      })
      // Recalculate WPM and accuracy
      const elapsedMin = elapsedRef.current / 60
      const cc = correctCharsRef.current
      const tt = totalTypedRef.current
      const newWpm = elapsedMin > 0 ? Math.round((cc / 5) / elapsedMin) : 0
      const newAcc = tt > 0 ? Math.round((cc / tt) * 100) : 100
      setWpm(newWpm)
      setAccuracy(newAcc)
    }, 1000)
  }

  const handleKeyInput = useCallback((key) => {
    if (isFinishedRef.current) return

    if (key === 'Backspace') {
      const ci = currentIndexRef.current
      if (ci === 0) return null

      const c = charsRef.current
      // Find start of current word (can't go back past it)
      let wordStart = ci - 1
      while (wordStart > 0 && c[wordStart - 1].char !== ' ') {
        wordStart--
      }
      if (ci - 1 < wordStart) return

      const prevState = c[ci - 1].state
      if (prevState === 'correct') {
        correctCharsRef.current = Math.max(0, correctCharsRef.current - 1)
        totalTypedRef.current = Math.max(0, totalTypedRef.current - 1)
      } else if (prevState === 'error') {
        incorrectCharsRef.current = Math.max(0, incorrectCharsRef.current - 1)
        totalTypedRef.current = Math.max(0, totalTypedRef.current - 1)
      }

      setChars(prev => {
        const updated = [...prev]
        updated[ci - 1] = { ...updated[ci - 1], state: 'untouched' }
        return updated
      })
      currentIndexRef.current = ci - 1
      setCurrentIndex(ci - 1)
      return null
    }

    if (key.length !== 1) return null

    if (!isRunningRef.current) {
      startTimer()
    }

    const ci = currentIndexRef.current
    const c = charsRef.current

    if (ci >= c.length) return

    const expected = c[ci].char
    const isCorrect = key === expected

    if (isCorrect) {
      correctCharsRef.current += 1
    } else {
      incorrectCharsRef.current += 1
    }
    totalTypedRef.current += 1

    // Build updated chars and auto-skip apostrophes the user would never type
    const updated = [...c]
    updated[ci] = { ...updated[ci], state: isCorrect ? 'correct' : 'error' }

    let nextIndex = ci + 1
    while (nextIndex < updated.length && updated[nextIndex].char === "'") {
      updated[nextIndex] = { ...updated[nextIndex], state: 'correct' }
      correctCharsRef.current += 1
      totalTypedRef.current += 1
      nextIndex++
    }

    charsRef.current = updated
    setChars(updated)

    if (nextIndex >= updated.length) {
      // Seamlessly load new prompt
      const newText = getRandomPrompt()
      const newChars = buildChars(newText)
      promptTextRef.current = newText
      setPromptText(newText)
      charsRef.current = newChars
      setChars(newChars)
      currentIndexRef.current = 0
      setCurrentIndex(0)
    } else {
      currentIndexRef.current = nextIndex
      setCurrentIndex(nextIndex)
    }

    return isCorrect
  }, [])

  const resetWithText = useCallback((text) => {
    clearInterval(timerRef.current)
    correctCharsRef.current = 0
    incorrectCharsRef.current = 0
    totalTypedRef.current = 0
    currentIndexRef.current = 0
    elapsedRef.current = 0
    isRunningRef.current = false
    isFinishedRef.current = false
    const newChars = buildChars(text)
    charsRef.current = newChars
    promptTextRef.current = text
    setPromptText(text)
    setChars(newChars)
    setCurrentIndex(0)
    setTimeLeft(mode)
    setIsRunning(false)
    setIsFinished(false)
    setWpm(0)
    setAccuracy(100)
  }, [mode])

  const reset = useCallback(() => {
    resetWithText(promptTextRef.current)
  }, [resetWithText])

  const resetNew = useCallback(() => {
    resetWithText(getRandomPrompt())
  }, [resetWithText])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const elapsedMin = elapsedRef.current / 60
  const rawCpm = elapsedMin > 0
    ? Math.round(totalTypedRef.current / elapsedMin)
    : 0

  const finalStats = {
    wpm,
    accuracy,
    time: mode,
    rawCpm,
    correctChars: correctCharsRef.current,
    incorrectChars: incorrectCharsRef.current,
    totalTyped: totalTypedRef.current,
  }

  return {
    chars,
    currentIndex,
    timeLeft,
    isRunning,
    isFinished,
    wpm,
    accuracy,
    promptText,
    finalStats,
    handleKeyInput,
    reset,
    resetNew,
  }
}
