import { useEffect, useState } from 'react'

interface UseTypewriterOptions {
  typingSpeed?: number
  deletingSpeed?: number
  pauseAtEnd?: number
  pauseAtStart?: number
}

export function useTypewriter(lines: string[], options: UseTypewriterOptions = {}) {
  const { typingSpeed = 75, deletingSpeed = 32, pauseAtEnd = 2600, pauseAtStart = 600 } = options

  const [lineIndex, setLineIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing')

  const text = lines[lineIndex] ?? ''

  useEffect(() => {
    let timeoutId: number

    if (phase === 'typing') {
      if (display.length < text.length) {
        timeoutId = window.setTimeout(() => {
          setDisplay(text.slice(0, display.length + 1))
        }, typingSpeed)
      } else {
        timeoutId = window.setTimeout(() => setPhase('deleting'), pauseAtEnd)
      }
    } else {
      if (display.length > 0) {
        timeoutId = window.setTimeout(() => {
          setDisplay(text.slice(0, display.length - 1))
        }, deletingSpeed)
      } else {
        timeoutId = window.setTimeout(() => {
          setLineIndex((i) => (i + 1) % lines.length)
          setPhase('typing')
        }, pauseAtStart)
      }
    }

    return () => window.clearTimeout(timeoutId)
  }, [display, phase, text, lines.length, typingSpeed, deletingSpeed, pauseAtEnd, pauseAtStart])

  return { display, lineIndex }
}
