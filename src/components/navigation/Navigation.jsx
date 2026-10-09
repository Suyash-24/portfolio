import { useState, useEffect } from 'react'
import { profile } from '../../data/portfolio'

const sections = [
  { id: 'about',   label: 'ABOUT' },
  { id: 'work',    label: 'WORK' },
  { id: 'journey', label: 'JOURNEY' },
  { id: 'contact', label: 'CONTACT' },
]

export default function Navigation() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = document.querySelectorAll('[data-section]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { 
          if (e.isIntersecting) setActive(e.target.dataset.section) 
        })
      },
      { 
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0 
      }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] sm:w-[90%]">
      <header 
        className="flex items-center justify-between w-full h-[60px] rounded-full transition-all duration-300"
        style={{
          paddingLeft: 'min(5%, 80px)',
          paddingRight: 'min(5%, 80px)',
          background: 'rgba(255, 255, 255, 0.15)', // True highly transparent glass
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07), inset 0 1px 2px rgba(255,255,255,0.4)'
        }}
      >
      {/* Brutalist Brand */}
      <a href="#top" className="font-mono font-bold text-base tracking-widest text-black uppercase hover:opacity-70 transition-opacity">
        suyash<span className="text-blue-600">/n</span>
      </a>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8" role="navigation">
        {sections.map((s, i) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(s.id) }}
              className="relative group font-mono text-xs font-bold tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors"
            >
              <span className={`transition-opacity ${isActive ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100'}`}>[ </span>
              <span className={isActive ? 'text-black' : ''}>{s.label}</span>
              <span className={`transition-opacity ${isActive ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100'}`}> ]</span>
            </a>
          )
        })}
      </nav>

      {/* Aesthetic Résumé Button */}
      <a
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center font-mono text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-sm hover:scale-[1.02] transition-all"
        style={{
          color: '#000',
          background: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '8px 24px',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)'
        }}
      >
        RÉSUMÉ
      </a>
      </header>
    </div>
  )
}
