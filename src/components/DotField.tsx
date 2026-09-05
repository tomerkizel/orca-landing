import { useEffect, useRef } from 'react'

interface Particle {
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

const AREA_PER_PARTICLE = 1900
const REPEL_RADIUS = 120
const REPEL_STRENGTH = 900
const SPRING = 0.04
const DAMPING = 0.82
const FADE_START_FROM_BOTTOM = 420
const FADE_END_FROM_BOTTOM = 200
const STAR_SEED = 87295163

function mulberry32(seed: number) {
  let state = seed
  return function random() {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    const containerEl = canvasEl?.parentElement
    if (!canvasEl || !containerEl) return
    const context = canvasEl.getContext('2d')
    if (!context) return

    const canvas = canvasEl
    const container = containerEl
    const ctx = context

    let particles: Particle[] = []
    let width = 0
    let height = 0
    const mouse = { x: -9999, y: -9999 }

    function buildParticles() {
      const random = mulberry32(STAR_SEED)
      const count = Math.max(40, Math.floor((width * height) / AREA_PER_PARTICLE))
      particles = []
      for (let i = 0; i < count; i++) {
        const x = random() * width
        const y = random() * height
        particles.push({
          baseX: x,
          baseY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 0.6 + random() * 1.6,
          alpha: 0.25 + random() * 0.65,
        })
      }
    }

    function resize() {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildParticles()
    }

    function handleMove(event: MouseEvent) {
      const rect = container.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }

    function handleLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    let frameId = 0

    function tick() {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001

        if (dist < REPEL_RADIUS) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH
          p.vx += (dx / dist) * force * 0.0016
          p.vy += (dy / dist) * force * 0.0016
        }

        p.vx += (p.baseX - p.x) * SPRING
        p.vy += (p.baseY - p.y) * SPRING
        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx
        p.y += p.vy

        const distFromBottom = height - p.baseY
        let fade = 1
        if (distFromBottom < FADE_END_FROM_BOTTOM) {
          fade = 0
        } else if (distFromBottom < FADE_START_FROM_BOTTOM) {
          fade = (distFromBottom - FADE_END_FROM_BOTTOM) / (FADE_START_FROM_BOTTOM - FADE_END_FROM_BOTTOM)
        }

        if (fade <= 0) continue

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * fade).toFixed(3)})`
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      frameId = requestAnimationFrame(tick)
    }

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    resize()
    window.addEventListener('resize', resize)
    if (supportsHover) {
      window.addEventListener('mousemove', handleMove)
      document.documentElement.addEventListener('mouseleave', handleLeave)
    }
    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      if (supportsHover) {
        window.removeEventListener('mousemove', handleMove)
        document.documentElement.removeEventListener('mouseleave', handleLeave)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="dot-field-canvas" aria-hidden="true" />
}
