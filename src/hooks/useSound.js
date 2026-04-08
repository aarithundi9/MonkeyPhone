import { useRef, useCallback } from 'react'

// Generate a short click sound using the Web Audio API
// No audio files needed — synthesized in browser
function createClickBuffer(ctx) {
  const duration = 0.04
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    // White noise decaying exponentially — gives a soft mechanical click feel
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8)
  }
  return buffer
}

function createErrorBuffer(ctx) {
  const duration = 0.06
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    // Slightly lower pitched noise for errors
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 5) * 0.6
  }
  return buffer
}

export function useSound(enabled = true) {
  const ctxRef = useRef(null)
  const clickBufferRef = useRef(null)
  const errorBufferRef = useRef(null)

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      clickBufferRef.current = createClickBuffer(ctxRef.current)
      errorBufferRef.current = createErrorBuffer(ctxRef.current)
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  const playClick = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      source.buffer = clickBufferRef.current
      gain.gain.value = 0.18
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start()
    } catch {}
  }, [enabled])

  const playError = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      source.buffer = errorBufferRef.current
      gain.gain.value = 0.12
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start()
    } catch {}
  }, [enabled])

  return { playClick, playError }
}
