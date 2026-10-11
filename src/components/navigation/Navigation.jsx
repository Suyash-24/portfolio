import { useState, useEffect, useRef } from 'react'
import { profile } from '../../data/portfolio'

const sections = [
  { id: 'about',   label: 'ABOUT',   num: '01' },
  { id: 'skills',  label: 'SKILLS',  num: '02' },
  { id: 'work',    label: 'WORK',    num: '03' },
  { id: 'journey', label: 'JOURNEY', num: '04' },
  { id: 'contact', label: 'CONTACT', num: '05' },
]

export default function Navigation() {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  // 1. Observe active section
  useEffect(() => {
    const els = document.querySelectorAll('[data-section]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { 
          if (e.isIntersecting) setActive(e.target.dataset.section) 
        })
      },
      { 
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0 
      }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // 2. Smart auto-hide on scroll down (prevents obstructing reading on phones)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Always show near top
      if (currentScrollY < 60) {
        setNavVisible(true)
      } else if (currentScrollY > lastScrollY.current + 8 && !menuOpen) {
        // Scrolling down -> hide
        setNavVisible(false)
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> show
        setNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])

  const scrollTo = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div 
      className={`fixed top-3 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] sm:w-[90%] transition-transform duration-300 ease-out ${
        navVisible || menuOpen ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <header 
        className="flex items-center justify-between w-full h-[50px] sm:h-[60px] rounded-full transition-all duration-300 relative"
        style={{
          paddingLeft: 'max(1rem, min(4%, 48px))',
          paddingRight: 'max(1rem, min(4%, 48px))',
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
        }}
      >
        {/* Brutalist Brand */}
        <a 
          href="#top" 
          onClick={(e) => { e.preventDefault(); scrollTo('hero') }}
          className="font-mono font-bold text-sm sm:text-base tracking-widest text-black uppercase hover:opacity-70 transition-opacity"
        >
          suyash<span className="text-blue-600">/n</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" role="navigation">
          {sections.map((s) => {
            const isActive = active === s.id
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(s.id) }}
                className="relative group font-mono text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors"
              >
                <span className={`transition-opacity ${isActive ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100'}`}>[ </span>
                <span className={isActive ? 'text-black' : ''}>{s.label}</span>
                <span className={`transition-opacity ${isActive ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100'}`}> ]</span>
              </a>
            )
          })}
        </nav>

        {/* Right Action Group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Aesthetic Résumé Button */}
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              color: '#000',
              background: 'rgba(255, 255, 255, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              padding: '6px 14px sm:px-6 sm:py-2',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.06)'
            }}
          >
            RÉSUMÉ
          </a>

          {/* Mobile Hamburger Toggle Button (Mobile viewports only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden flex-col items-center justify-center w-8 h-8 rounded-full border border-black/10 bg-white/40 active:scale-95 transition-transform"
            aria-label="Toggle Navigation Menu"
          >
            <div className={`w-4 h-[1.5px] bg-black transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : '-translate-y-[2px]'}`} />
            <div className={`w-4 h-[1.5px] bg-black transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-[1px]' : 'translate-y-[2px]'}`} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div 
            className="md:hidden mt-3 w-full rounded-2xl p-5 transition-all duration-300 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(36px)',
              WebkitBackdropFilter: 'blur(36px)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 24px 50px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.9)'
            }}
          >
            {/* Section Jump Links */}
            <div className="flex flex-col gap-1.5 pb-4 border-b border-black/10">
              {sections.map((s) => {
                const isActive = active === s.id
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => { e.preventDefault(); scrollTo(s.id) }}
                    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-black/80 hover:bg-black/5 active:bg-black/10'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-black/40'}`}>{s.num} //</span>
                      {s.label}
                    </span>
                    <span className="text-[10px] opacity-70">→</span>
                  </a>
                )
              })}
            </div>

            {/* Quick Actions & Contact footer */}
            <div className="pt-3.5 flex items-center justify-between font-mono text-[10px] tracking-wider text-black/70">
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-blue-600 uppercase font-semibold"
              >
                [ GITHUB ↗ ]
              </a>
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-blue-600 uppercase font-semibold"
              >
                [ LINKEDIN ↗ ]
              </a>
              <span className="text-emerald-600 font-bold">● OPEN</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
