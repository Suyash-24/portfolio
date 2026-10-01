import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Cursor from './components/ui/Cursor'
import CommandPalette from './components/ui/CommandPalette'
import Navigation from './components/navigation/Navigation'
import Hero from './components/hero/Hero'
import About from './components/about/About'
import Signal from './components/signal/Signal'
import Projects from './components/projects/Projects'
import Journey from './components/journey/Journey'
import Contact from './components/contact/Contact'
import { marqueeItems } from './data/portfolio'

import './styles.css'

gsap.registerPlugin(ScrollTrigger)

// ── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const content = [...marqueeItems, ...marqueeItems]
  return (
    <div className="marquee" aria-label="Areas of interest" aria-hidden="true">
      <div className="marquee__track">
        {content.map((item, i) => (
          <span key={`${item}-${i}`}>
            {item}
            <i aria-hidden="true">✦</i>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const rootRef = useRef(null)

  // Smooth scroll with Lenis
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
    })

    let raf
    const tick = (time) => {
      lenis.raf(time * 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // Page-level scroll choreography
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      // Hero scroll-out
      gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
        .to('.hero__copy', { y: 80, opacity: 0.1, ease: 'none' }, 0)
        .to('.hero__instrument', { y: -120, scale: 0.5, opacity: 0.15, rotate: -12, ease: 'none' }, 0)
        .to('.hero__grid', { opacity: 0.05, ease: 'none' }, 0)

      // Marquee parallax
      gsap.to('.marquee__track', {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.marquee',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // About reveals
      gsap.from('.about__heading', {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__layout', start: 'top 80%', once: true },
      })
      gsap.from('.about__copy', {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__layout', start: 'top 75%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="app" ref={rootRef}>
      <Cursor />
      <Navigation onCommandOpen={() => setCommandOpen(true)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Signal />
        <Projects />
        <Journey />
        <Contact />
      </main>
    </div>
  )
}

// Bootstrap
const root =
  globalThis.__suyashRoot ??
  (globalThis.__suyashRoot = createRoot(document.getElementById('root')))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
