import { useState, useEffect } from 'react'
import { profile, navItems, projects } from '../../data/portfolio'

const commands = [
  ...navItems.map((n) => ({ label: n.label, type: 'nav', target: n.id })),
  { label: 'GitHub Profile', type: 'external', href: profile.github },
  { label: 'Send Email', type: 'email', href: `mailto:${profile.email}` },
  { label: 'Download Resume', type: 'external', href: profile.resume },
  ...projects.map((p) => ({ label: `${p.name} — GitHub`, type: 'external', href: p.github })),
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => { if (!open) setQuery('') }, [open])

  if (!open) return null

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  const execute = (cmd) => {
    onClose()
    if (cmd.type === 'nav') {
      const el = document.getElementById(cmd.target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.open(cmd.href, cmd.type === 'email' ? '_self' : '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className="cmd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      <div className="cmd" onClick={(e) => e.stopPropagation()}>
        <div className="cmd__input-wrap">
          <svg className="cmd__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            className="cmd__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            aria-label="Search commands"
          />
          <kbd className="cmd__esc">ESC</kbd>
        </div>
        <div className="cmd__list" role="listbox">
          {filtered.length === 0 ? (
            <div className="cmd__empty">No results</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.label}
                className="cmd__item"
                onClick={() => execute(cmd)}
                role="option"
              >
                <span className="cmd__item-type">{cmd.type}</span>
                <span className="cmd__item-label">{cmd.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
              </button>
            ))
          )}
        </div>
        <div className="cmd__footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
