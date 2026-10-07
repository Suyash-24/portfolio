import { useState, useEffect } from 'react'
import { profile } from '../../data/portfolio'

const sections = [
  { id: 'about',   label: 'about' },
  { id: 'work',    label: 'work' },
  { id: 'journey', label: 'journey' },
  { id: 'contact', label: 'contact' },
]

export default function Navigation({ onCommandOpen }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = document.querySelectorAll('[data-section]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.section) })
      },
      { threshold: 0.3 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="nav" role="banner">
      {/* Brand — Gertix: lowercase wordmark with slash */}
      <a className="nav-brand" href="#top" aria-label="Back to top">
        suyash/n
      </a>

      {/* Desktop links — Gertix: numbered pills, active gets highlight */}
      <ul className="nav-links" role="navigation" aria-label="Main navigation">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={active === s.id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollTo(s.id) }}
            >
              {String(i + 1).padStart(2, '0')} {s.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Résumé CTA */}
      <a
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-cta"
      >
        RÉSUMÉ
      </a>
    </header>
  )
}
