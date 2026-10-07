import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'

import Cursor from './components/ui/Cursor'
import CommandPalette from './components/ui/CommandPalette'
import Navigation from './components/navigation/Navigation'
import Hero from './components/hero/Hero'
import About from './components/about/About'
import Projects from './components/projects/Projects'
import Skills from './components/skills/Skills'
import Journey from './components/journey/Journey'
import Contact from './components/contact/Contact'

import './tailwind.css'
import './styles.css'

// ── App Shell ─────────────────────────────────────────────────────────────────
function App() {
  const [commandOpen, setCommandOpen] = useState(false)

  // Smooth scroll with Lenis + global reveal animations
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // 1. Reveal Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        } else {
          entry.target.classList.remove('in-view')
        }
      })
    }, { threshold: 0.15 })

    const observeElements = () => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }
    // Need a tiny delay for React to mount the DOM
    setTimeout(observeElements, 100)

    // 2. Lenis smooth scroll
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    })

    let raf
    const tick = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // Reveal observer — adds .is-visible on section entry
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    const observe = () => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }
    const timer = setTimeout(observe, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app">
      <Cursor />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <Navigation onCommandOpen={() => setCommandOpen(true)} />
      <main>
        <Hero />
        <About />
        <Skills />
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
  <App />
)
