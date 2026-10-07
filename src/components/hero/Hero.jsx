import { useEffect, useRef } from 'react'
import { profile, marqueeItems } from '../../data/portfolio'
import IceCubeCanvas from './IceCube'
import anime from 'animejs'

// ──────────────────────────────────────────────────────────────────────────────
// HERO — Oneshot Hero Landing Page (SKILL.md compliant)
// Dark video scrub: 380vh sticky container, RAF scrub engine
// ──────────────────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroSectionRef = useRef(null)
  const cubeRef        = useRef(null)
  const phase0Ref      = useRef(null)
  const phase1Ref      = useRef(null)
  const phase2Ref      = useRef(null)
  const progressRef    = useRef(null)

  useEffect(() => {
    // ── 1. Anime.js Initial Load Animation (Premium & Subtle) ─────────────────
    anime({
      targets: '.ml-anim',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 1600,
      easing: 'easeOutCubic',
      delay: anime.stagger(150, { start: 100 })
    });

    const heroSection = heroSectionRef.current
    const phase0      = phase0Ref.current
    const phase1      = phase1Ref.current
    const phase2      = phase2Ref.current
    const progressBar = progressRef.current

    if (!heroSection) return

    // ── 2. Scroll progress ────────────────────────────────────────────────────
    let targetProgress  = 0
    let currentProgress = 0
    let isRunning       = true

    function updateScroll() {
      const rect = heroSection.getBoundingClientRect()
      const max  = rect.height - window.innerHeight
      if (max > 0) targetProgress = Math.max(0, Math.min(1, -rect.top / max))
    }
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    updateScroll()

    // ── 3. Progress-Locked Opacity (SKILL.md §Progress-Locked Hero Text) ──────
    function calcPhase0Opacity(p) {
      if (p <= 0.20) return 1.0
      if (p >  0.30) return 0
      return Math.max(0, 1 - (p - 0.20) / 0.10)
    }
    function calcPhaseOpacity(p, enterStart, enterEnd, exitStart, exitEnd) {
      if (p < enterStart || p > exitEnd) return 0
      if (p < enterEnd)  return (p - enterStart) / (enterEnd - enterStart)
      if (p > exitStart) return Math.max(0, 1 - (p - exitStart) / (exitEnd - exitStart))
      return 1.0
    }

    // ── 4. Animation Loop ─────────────────────────────────────────────────────
    let animId
    function scrubLoop() {
      if (!isRunning) return

      currentProgress += (targetProgress - currentProgress) * 0.15

      const op0 = calcPhase0Opacity(targetProgress)
      const op1 = calcPhaseOpacity(targetProgress, 0.28, 0.38, 0.58, 0.66)
      const op2 = calcPhaseOpacity(targetProgress, 0.66, 0.76, 0.92, 0.99)

      if (phase0) {
        phase0.style.opacity   = op0.toFixed(3)
        phase0.style.transform = `translateY(calc(-50% + ${-targetProgress * 55}px))`
      }
      if (phase1) {
        phase1.style.opacity   = op1.toFixed(3)
        phase1.style.transform = `translateY(calc(-50% + ${(0.48 - targetProgress) * 45}px))`
        
        const title1 = phase1.querySelector('h2')
        if (title1) {
          const text = "I BUILD WITH DATA.\nAND TURN IDEAS INTO\nWORKING SYSTEMS."
          let p = (targetProgress - 0.28) / (0.42 - 0.28)
          p = Math.max(0, Math.min(1, p))
          const chars = Math.floor(p * text.length)
          title1.innerHTML = text.slice(0, chars).replace(/\n/g, '<br />') + (p < 1 ? '<span style="opacity:0.5">_</span>' : '')
        }
      }
      if (phase2) {
        phase2.style.opacity   = op2.toFixed(3)
        phase2.style.transform = `translateY(calc(-50% + ${(0.82 - targetProgress) * 45}px))`

        const title2 = phase2.querySelector('h2')
        if (title2) {
          const text = "ENGINEERED TO REPRODUCE.\nBUILT TO LAST."
          let p = (targetProgress - 0.66) / (0.78 - 0.66)
          p = Math.max(0, Math.min(1, p))
          const chars = Math.floor(p * text.length)
          title2.innerHTML = text.slice(0, chars).replace(/\n/g, '<br />') + (p < 1 ? '<span style="opacity:0.5">_</span>' : '')
        }
      }
      if (progressBar) {
        progressBar.style.width = `${targetProgress * 100}%`
      }

      animId = requestAnimationFrame(scrubLoop)
    }
    animId = requestAnimationFrame(scrubLoop)

    return () => {
      isRunning = false
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const base      = import.meta.env.BASE_URL || '/'
  const posterUrl = `${base.replace(/\/$/, '')}/assets/hero_poster.jpg`

  // Ticker items × 2 for seamless loop
  const tickers = [...marqueeItems, ...marqueeItems]

  return (
    /* 380vh sticky scroll container — SKILL.md §4 */
    <div id="hero" ref={heroSectionRef} className="hero-track" data-section="hero">
      <div className="hero-sticky">

        {/* ── True Interactive WebGL Ice Cube ── */}
        <IceCubeCanvas />

        {/* ── Phase 0: Name + intro (visible on load, fades by 30%) ─────────── */}
        <div ref={phase0Ref} className="hero-phase active" id="phase-0" style={{ transformOrigin: 'left center' }}>
          <div className="hero-eyebrow ml-anim" style={{ marginBottom: '1.5rem', color: '#1a1c23', fontWeight: 600 }}>
            PORTFOLIO // 2026
          </div>
          
          <h1 className="hero-glowing-title ml-anim" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div>SUYASH</div>
            <div>NARAWADE</div>
          </h1>

          <div className="ml-anim" style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1.25rem', marginBottom: '3rem' }}>
            <p className="hero-bio" style={{ marginBottom: '0.25rem', color: '#1a1c23', fontWeight: 600 }}>
              {profile.focus}
            </p>
            <p className="hero-bio" style={{ marginBottom: 0, fontSize: '0.75rem', maxWidth: '50ch' }}>
              Building reproducible systems that transform raw data into verifiable decisions.
            </p>
          </div>

          {/* Split CTA — Gertix exact pattern */}
          <div className="hero-cta-group ml-anim" style={{ pointerEvents: 'auto' }}>
            <button className="btn-label" onClick={() => scrollTo('work')}>
              SELECTED WORK
            </button>
            <button className="btn-arrow" onClick={() => scrollTo('work')} aria-label="Go to work">
              →
            </button>
          </div>
        </div>

        {/* ── Phase 1: Manifesto (30%–66% scroll) ──────────────────────────── */}
        <div ref={phase1Ref} className="hero-phase" id="phase-1" style={{ transformOrigin: 'left center' }}>
          <div className="hero-eyebrow" style={{ marginBottom: '1.5rem', color: '#1a1c23', fontWeight: 600 }}>
            // THESIS
          </div>
          <h2 className="hero-glowing-title" style={{ minHeight: '3.3em' }}>
            I BUILD WITH DATA.<br />
            AND TURN IDEAS INTO<br />
            WORKING SYSTEMS.
          </h2>
          <div style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1.25rem', marginTop: '2rem' }}>
            <p className="hero-bio" style={{ marginBottom: 0, fontSize: '0.8rem', maxWidth: '45ch' }}>
              Multi-model ML benchmarks, graph traversal crawlers,
              and cryptographic tooling — built with strict contracts
              and reproducible pipelines.
            </p>
          </div>
        </div>

        {/* ── Phase 2: Final statement (66%–99% scroll) ────────────────────── */}
        <div ref={phase2Ref} className="hero-phase" id="phase-2" style={{ transformOrigin: 'left center' }}>
          <div className="hero-eyebrow" style={{ marginBottom: '1.5rem', color: '#1a1c23', fontWeight: 600 }}>
            // CODEBASES
          </div>
          <h2 className="hero-glowing-title" style={{ minHeight: '2.2em' }}>
            ENGINEERED TO REPRODUCE.<br />
            BUILT TO LAST.
          </h2>
          <div style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1.25rem', marginTop: '2rem', marginBottom: '2.5rem' }}>
            <p className="hero-bio" style={{ marginBottom: 0, fontSize: '0.8rem', maxWidth: '45ch' }}>
              Every repository is open, documented, and designed to
              transform complex questions into verifiable, readable systems.
            </p>
          </div>
          <div className="hero-cta-group" style={{ pointerEvents: 'auto' }}>
            <button className="btn-label" onClick={() => scrollTo('about')}>
              ABOUT ME
            </button>
            <button className="btn-arrow" onClick={() => scrollTo('about')} aria-label="About">
              →
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div ref={progressRef} className="hero-progress" aria-hidden="true" />

        {/* Bottom ticker — Gertix marquee with dashed top border */}
        <div className="hero-ticker" aria-hidden="true">
          <div className="hero-ticker-track">
            {tickers.map((item, i) => (
              <span key={i} className="hero-ticker-item">
                {item}
                <span className="hero-ticker-sep"> → </span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
