import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Radial data points orbiting the identity core
const DATA_POINTS = [
  { angle: -60, radius: 38, label: 'PYTHON', sub: '/ language', color: 'var(--acid)' },
  { angle: 30,  radius: 42, label: 'DATA',   sub: '/ analysis', color: 'var(--acid)' },
  { angle: 130, radius: 36, label: 'ML',     sub: '/ models',   color: 'var(--coral)' },
]

function polarToXY(angleDeg, radiusPct) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: 50 + radiusPct * Math.cos(rad),
    y: 50 + radiusPct * Math.sin(rad),
  }
}

export default function Hero() {
  const heroRef = useRef(null)
  const glyphRef = useRef(null)
  const copyRef = useRef(null)
  const reduced = useReducedMotion()

  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 })
  const [activePoint, setActivePoint] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Initial reveal animation
  useEffect(() => {
    if (reduced) { setLoaded(true); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) })
      // Horizontal lines appear
      tl.from('.hero__grid-line--h', {
        scaleX: 0,
        transformOrigin: 'left center',
        stagger: { amount: 0.5, from: 'random' },
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0)
      // Vertical lines appear
      tl.from('.hero__grid-line--v', {
        scaleY: 0,
        transformOrigin: 'center top',
        stagger: { amount: 0.5, from: 'random' },
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0.1)
      // Identity mark builds in
      tl.from('.hero__identity', { scale: 0.7, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.2)
      // Title words reveal
      tl.from('.hero__title-word', {
        yPercent: 105,
        opacity: 0,
        stagger: 0.09,
        duration: 1.0,
        ease: 'power4.out',
      }, 0.45)
      // Data points appear
      tl.from('.hero__dp', {
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'back.out(1.5)',
      }, 0.7)
      // Sub-copy
      tl.from('.hero__blurb', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.85)
      // Scroll cue
      tl.from('.hero__scroll', { opacity: 0, y: 10, duration: 0.7 }, 1.4)
    }, heroRef)
    return () => ctx.revert()
  }, [reduced])

  // Mouse parallax
  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const hero = heroRef.current
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      setMouseNorm({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    const onLeave = () => setMouseNorm({ x: 0.5, y: 0.5 })
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  const dx = (mouseNorm.x - 0.5) * 2
  const dy = (mouseNorm.y - 0.5) * 2

  return (
    <section className="hero" id="top" data-section="top" ref={heroRef} aria-label="Introduction">
      {/* Background grid */}
      <HeroGrid />

      {/* Metadata line */}
      <div className="hero__meta" aria-hidden="true">
        <span>B.E. COMPUTER ENGINEERING</span>
        <span className="hero__meta-sep">◆</span>
        <span>{profile.coords}</span>
        <span className="hero__meta-sep">◆</span>
        <span>CLASS OF 2026</span>
      </div>

      {/* Main layout: title + identity */}
      <div className="hero__body">
        {/* Left: Title */}
        <div className="hero__copy" ref={copyRef} style={{
          transform: `translate(${dx * -8}px, ${dy * -6}px)`,
          transition: reduced ? 'none' : 'transform 0.8s cubic-bezier(0.2,0.8,0.2,1)',
        }}>
          <p className="hero__eyebrow">
            <span className="hero__status-dot" aria-hidden="true" />
            DATA SCIENCE · MACHINE LEARNING
          </p>
          <h1 className="hero__title" aria-label="Find the signal">
            <span className="hero__title-line">
              <span className="hero__title-word hero__title-word--outline">Find</span>
              <span className="hero__title-word">&nbsp;the</span>
            </span>
            <span className="hero__title-line">
              <span className="hero__title-word hero__title-word--serif">signal</span>
              <span className="hero__title-word hero__title-word--period" aria-hidden="true">.</span>
            </span>
          </h1>
          <p className="hero__blurb">
            I'm Suyash — a computer engineering student turning curiosity
            into tools, clear analysis, and systems that work.
          </p>

          <div className="hero__cta-row">
            <button
              className="hero__cta hero__cta--primary"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              data-cursor="link"
            >
              View work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </button>
            <a
              className="hero__cta hero__cta--ghost"
              href={`mailto:${profile.email}`}
              data-cursor="email"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Right: Identity instrument */}
        <div
          className="hero__instrument"
          ref={glyphRef}
          style={{
            transform: `translate(${dx * 12}px, ${dy * 9}px)`,
            transition: reduced ? 'none' : 'transform 0.95s cubic-bezier(0.2,0.8,0.2,1)',
          }}
          data-cursor="explore"
          aria-hidden="true"
        >
          {/* SVG orbital system */}
          <svg className="hero__svg" viewBox="0 0 100 100" fill="none">
            {/* Orbit rings */}
            <circle cx="50" cy="50" r="33" stroke="rgba(200,255,64,0.15)" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="22" stroke="rgba(200,255,64,0.22)" strokeWidth="0.4" />

            {/* Connection lines to data points */}
            {DATA_POINTS.map((dp) => {
              const pos = polarToXY(dp.angle, dp.radius)
              return (
                <line
                  key={dp.label}
                  x1="50" y1="50"
                  x2={pos.x} y2={pos.y}
                  stroke={activePoint === dp.label ? dp.color : 'rgba(200,255,64,0.3)'}
                  strokeWidth={activePoint === dp.label ? '0.6' : '0.35'}
                  strokeDasharray="1.5 1.5"
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                />
              )
            })}

            {/* Outer scanner line */}
            <line x1="50" y1="50" x2="83" y2="50" stroke="rgba(200,255,64,0.4)" strokeWidth="0.4" />
            <circle cx="50" cy="50" r="33" stroke="rgba(200,255,64,0.35)" strokeWidth="0.35" className="hero__scan-ring" />
          </svg>

          {/* Core identity */}
          <div className="hero__identity">
            <span className="hero__identity-mark">SN</span>
            <span className="hero__identity-sub">24</span>
          </div>

          {/* Data point nodes */}
          {DATA_POINTS.map((dp) => {
            const pos = polarToXY(dp.angle, dp.radius)
            return (
              <button
                key={dp.label}
                className={`hero__dp ${activePoint === dp.label ? 'hero__dp--active' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                onMouseEnter={() => setActivePoint(dp.label)}
                onMouseLeave={() => setActivePoint(null)}
                aria-label={`Signal: ${dp.label}`}
              >
                <span className="hero__dp-pip" />
                <span className="hero__dp-label">{dp.label}</span>
                <span className="hero__dp-sub">{dp.sub}</span>
              </button>
            )
          })}

          {/* Metadata readout */}
          <div className="hero__readout" aria-hidden="true">
            <div className="hero__readout-row">
              <span>STATUS</span>
              <strong>{activePoint ? `SIGNAL / ${activePoint}` : 'SCANNING'}</strong>
            </div>
            <div className="hero__readout-row">
              <span>FIELD</span>
              <strong>DATA + ML</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a className="hero__scroll" href="#about" aria-label="Scroll to next section">
        <span>SCROLL</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>

      {/* Bottom index */}
      <div className="hero__index" aria-hidden="true">[ 001 ] IDENTITY</div>
    </section>
  )
}

function HeroGrid() {
  const lines = Array.from({ length: 8 })
  const cols = Array.from({ length: 6 })
  return (
    <div className="hero__grid" aria-hidden="true">
      {lines.map((_, i) => (
        <div key={i} className="hero__grid-line hero__grid-line--h" style={{ top: `${(i + 1) * 11.5}%` }} />
      ))}
      {cols.map((_, i) => (
        <div key={i} className="hero__grid-line hero__grid-line--v" style={{ left: `${(i + 1) * 14.5}%` }} />
      ))}
    </div>
  )
}
