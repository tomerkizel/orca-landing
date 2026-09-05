import { useState } from 'react'
import orcaLogo from '../assets/orca.svg'
import './SiteHeader.css'

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '#/use-cases', label: 'Use cases' },
  { href: '#/developers', label: 'Developers' },
  { href: '#/blog', label: 'Blog' },
  { href: '#/about-us', label: 'About us' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <a href="#/" className="brand" onClick={closeMenu}>
        <img src={orcaLogo} alt="Orca logo" className="brand-mark" />
        <span className="brand-name">Orca One</span>
      </a>

      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MenuIcon open={menuOpen} />
      </button>

      <nav className={`nav-links${menuOpen ? ' is-open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="nav-link" onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a href="#" className="btn btn-primary nav-cta" onClick={closeMenu}>
          Contact us
        </a>
      </nav>
    </header>
  )
}
