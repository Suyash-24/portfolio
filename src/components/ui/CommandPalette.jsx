import { useState, useEffect } from 'react'
import { profile, projects } from '../../data/portfolio'

const commands = [
  { label: 'about → Profile',        type: 'nav',      target: 'about' },
  { label: 'work → Projects',        type: 'nav',      target: 'work' },
  { label: 'journey → Trajectory',   type: 'nav',      target: 'journey' },
  { label: 'contact → Get in Touch', type: 'nav',      target: 'contact' },
  { label: 'GitHub Profile',         type: 'external', href: profile.github },
  { label: 'LinkedIn',               type: 'external', href: profile.linkedin },
  { label: 'Send Email',             type: 'email',    href: `mailto:${profile.email}` },
  { label: 'Download Résumé',        type: 'external', href: profile.resume },
  ...projects.map((p) => ({ label: `${p.name} on GitHub`, type: 'external', href: p.github })),
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  useEffect(() => { if (!open) setQuery('') }, [open])

  if (!open) return null

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  const execute = (cmd) => {
    onClose()
    if (cmd.type === 'nav') {
      document.getElementById(cmd.target)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.open(cmd.href, cmd.type === 'email' ? '_self' : '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className="cmd-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      <div className="cmd-box" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 1.25rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-ghost)" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            autoFocus
            className="cmd-input"
            style={{ flex: 1, paddingLeft: '0.75rem' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search portfolio_"
            aria-label="Search commands"
          />
          <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-ghost)', letterSpacing: '0.1em' }}>ESC</kbd>
        </div>

        {/* Results */}
        <div className="cmd-list" role="listbox">
          {filtered.length === 0 ? (
            <div className="cmd-item" style={{ color: 'var(--text-ghost)', justifyContent: 'center' }}>
              no results found
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.label}
                className="cmd-item"
                onClick={() => execute(cmd)}
                role="option"
              >
                <span className="cmd-item-key">{cmd.type}</span>
                <span style={{ flex: 1 }}>{cmd.label}</span>
                <span style={{ color: 'var(--text-ghost)', fontSize: '0.8rem' }}>→</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0.6rem 1.25rem',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--text-ghost)',
          letterSpacing: '0.06em',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  )
}
