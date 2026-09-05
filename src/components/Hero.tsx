import type { ReactNode } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { DotField } from './DotField'
import orcaLogo from '../assets/orca.svg'
import './Hero.css'

interface Segment {
  text: string
  highlight?: boolean
}

const BREAK: Segment = { text: '\n' }

const LINES: Segment[][] = [
  [
    { text: 'One ' },
    { text: 'company', highlight: true },
    { text: '.' },
    BREAK,
    { text: 'One ' },
    { text: 'intelligence', highlight: true },
    { text: '.' },
  ],
  [
    { text: 'One ' },
    { text: 'intent', highlight: true },
    { text: '.' },
    BREAK,
    { text: 'Everything', highlight: true },
    { text: ' moves.' },
  ],
  [
    { text: 'One ' },
    { text: 'workspace', highlight: true },
    { text: '.' },
    BREAK,
    { text: 'Everyone', highlight: true },
    { text: ' involved.' },
  ],
]

const LINE_TEXTS = LINES.map((segments) => segments.map((segment) => segment.text).join(''))

const WAVE_BACK_PATH = 'M0,45 C200,90 400,0 600,45 C800,90 1000,0 1200,45 L1200,120 L0,120 Z'
const WAVE_FRONT_PATH = 'M0,60 C150,20 350,100 600,60 C850,20 1050,100 1200,60 L1200,120 L0,120 Z'

function renderLines(segments: Segment[], revealedLength: number): ReactNode[][] {
  let remaining = revealedLength
  const lines: ReactNode[][] = [[]]

  segments.forEach((segment, i) => {
    if (segment.text === '\n') {
      if (remaining > 0) {
        lines.push([])
        remaining -= 1
      }
      return
    }
    if (remaining <= 0) return
    const chunk = segment.text.slice(0, remaining)
    lines[lines.length - 1].push(
      <span key={i} className={segment.highlight ? 'highlight' : undefined}>
        {chunk}
      </span>,
    )
    remaining -= chunk.length
  })

  return lines
}

function WaveLayer({ className, path }: { className: string; path: string }) {
  return (
    <div className={`wave-layer ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d={path} />
      </svg>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d={path} />
      </svg>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Hero() {
  const { display, lineIndex } = useTypewriter(LINE_TEXTS)
  const lines = renderLines(LINES[lineIndex], display.length)

  return (
    <div className="hero">
      <DotField />

      <div className="hero-waves">
        <WaveLayer className="wave-back" path={WAVE_BACK_PATH} />
        <WaveLayer className="wave-front" path={WAVE_FRONT_PATH} />
      </div>

      <header className="site-header">
        <div className="brand">
          <img src={orcaLogo} alt="Orca logo" className="brand-mark" />
          <span className="brand-name">Orca</span>
        </div>

        <nav className="nav-links">
          <a href="#" className="nav-link">
            Use case
          </a>
          <a href="#" className="nav-link">
            Developers
          </a>
          <a href="#" className="nav-link">
            Pricing
          </a>
          <a href="#" className="nav-link">
            Blog
          </a>
          <a href="#" className="nav-link">
            About us
          </a>
          <a href="#" className="btn btn-primary nav-cta">
            Contact us
          </a>
        </nav>
      </header>

      <main className="hero-main">
        <div className="hero-panel">
          <p className="hero-text">
            {lines.map((lineNodes, i) => (
              <span key={i} className="hero-line">
                {lineNodes}
                {i === lines.length - 1 && <span className="cursor" aria-hidden="true" />}
              </span>
            ))}
          </p>

          <div className="hero-divider" aria-hidden="true">
            <span className="hero-divider-line" />
            <span className="hero-divider-dot" />
            <span className="hero-divider-line" />
          </div>

          <div className="hero-actions">
            <button type="button" className="btn btn-primary">
              Join the waitlist
            </button>
            <button type="button" className="btn btn-secondary">
              Read more
              <ArrowIcon />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
