import type { ReactNode } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { DotField } from './DotField'
import { SiteHeader } from './SiteHeader'
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

function waveTileDataUri(
  path: string,
  crest: string,
  stops: [string, string],
  strokeColor: string,
  strokeWidth: number,
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" preserveAspectRatio="none">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="${stops[0]}"/>
<stop offset="100%" stop-color="${stops[1]}"/>
</linearGradient></defs>
<path d="${path}" fill="url(#g)"/>
<path d="${crest}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" vector-effect="non-scaling-stroke"/>
</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const WAVE_BACK_URI = waveTileDataUri(
  'M0,48 C180,95 380,5 600,48 L600,120 L0,120 Z',
  'M0,48 C180,95 380,5 600,48',
  ['#4a94c9', '#173f61'],
  'rgba(255,255,255,0.55)',
  1.6,
)

const WAVE_FRONT_URI = waveTileDataUri(
  'M0,62 C140,15 360,110 600,62 L600,120 L0,120 Z',
  'M0,62 C140,15 360,110 600,62',
  ['#c8e9f8', '#5fa8d3'],
  'rgba(255,255,255,0.75)',
  1.4,
)

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

function WaveLayer({ className, dataUri }: { className: string; dataUri: string }) {
  return <div className={`wave-layer ${className}`} style={{ backgroundImage: dataUri }} aria-hidden="true" />
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
        <WaveLayer className="wave-back" dataUri={WAVE_BACK_URI} />
        <WaveLayer className="wave-front" dataUri={WAVE_FRONT_URI} />
      </div>

      <SiteHeader />

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
