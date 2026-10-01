import { useState, useEffect, useRef } from 'react'
import { profile, navItems } from '../../data/portfolio'

export default function Navigation({ onCommandOpen }) {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    // Track scroll for header style + progress bar
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 60)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Track active section via IntersectionObserver
    const sections = document.querySelectorAll('[data-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.section)
        })
      },
      { threshold: 0.35 }
    )
    sections.forEach((s) => observer.observe(s))

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onCommandOpen()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCommandOpen])

  const handleNav = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menuOpen ? 'nav--open' : ''}`}
        role="banner"
      >
        {/* Scroll progress bar */}
        <div
          className="nav__progress"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
          aria-hidden="true"
        />

        <a className="nav__brand" href="#top" aria-label="Back to top">
          <span className="nav__mark">{profile.initials}</span>
          <span className="nav__name">SUYASH NARAWADE</span>
        </a>

        {/* Desktop nav */}
        <nav className="nav__links" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="nav__link-index">{item.index}</span>
              <span className="nav__link-label">{item.label}</span>
              {activeSection === item.id && <span className="nav__link-pip" aria-hidden="true" />}
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          <a
            className="nav__status"
            href={`mailto:${profile.email}`}
            aria-label="Send email — open to opportunities"
          >
            <span className="nav__status-dot" aria-hidden="true" />
            OPEN
          </a>
          <button
            className="nav__command"
            onClick={onCommandOpen}
            aria-label="Open command palette (Ctrl+K)"
          >
            <span>⌘</span>
            <kbd>K</kbd>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile menu */}
      <div className={`nav__mobile ${menuOpen ? 'nav__mobile--open' : ''}`} aria-hidden={!menuOpen}>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className="nav__mobile-link"
              onClick={() => handleNav(item.id)}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="nav__mobile-index">{item.index}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="nav__mobile-foot">
          <a href={`mailto:${profile.email}`} className="nav__mobile-email" tabIndex={menuOpen ? 0 : -1}>
            {profile.email}
          </a>
        </div>
      </div>
    </>
  )
}
