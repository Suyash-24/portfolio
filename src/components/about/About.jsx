import React, { useEffect, useRef } from 'react'
import anime from 'animejs'
import { profile, bio } from '../../data/portfolio'

// ──────────────────────────────────────────────────────────────────────────────
// ABOUT — Based on bermawy.com aesthetic:
//  • Light gray (#EBEBEB) background with graph-paper grid
//  • Lowercase "hi there_" style section header with blue underline
//  • 2-column layout: bio text left, dossier card right
//  • Stats row with Gertix '+' crosshair dashed grid
//  • Skill pill tags (rounded oval capsules)
// ──────────────────────────────────────────────────────────────────────────────
const stats = [
  { val: '4+',    label: 'Projects Built' },
  { val: '2022',  label: 'Started Coding' },
  { val: 'B.E.',  label: 'Degree Completed' },
  { val: 'Open',  label: 'For Roles' },
]

const dossierRows = [
  { key: 'Location',   val: 'Pune, Maharashtra, India' },
  { key: 'Coords',     val: '18°31′N / 73°51′E' },
  { key: 'Degree',     val: 'B.E. Computer Engineering' },
  { key: 'Focus',      val: 'Data Science · ML · Python' },
  { key: 'Status',     val: 'Open to opportunities' },
  { key: 'Email',      val: 'iamnarawadesuyash@gmail.com' },
]

const skillRows = [
  { skill: 'Python',          cat: 'Language',   level: 'Proficient' },
  { skill: 'Data Analysis',   cat: 'Practice',   level: 'Proficient' },
  { skill: 'Machine Learning',cat: 'Practice',   level: 'Learning' },
  { skill: 'Math & Stats',    cat: 'Foundation', level: 'Learning' },
  { skill: 'Automation',      cat: 'Systems',    level: 'Proficient' },
  { skill: 'Backend Logic',   cat: 'Systems',    level: 'Proficient' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Words sliding up
        anime({
          targets: '.anim-word',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(30, { start: 100 }),
          easing: 'easeOutCubic',
          duration: 700
        })

        // Stats staggering in
        // Stats staggering in
        anime({
          targets: '.stat-cell',
          translateY: [30, 0],
          opacity: [0, 1],
          delay: anime.stagger(100, { start: 400 }),
          easing: 'easeOutExpo',
          duration: 900
        })

        // Lower section staggering in
        anime({
          targets: '.about-lower-anim',
          translateY: [30, 0],
          opacity: [0, 1],
          delay: anime.stagger(100, { start: 600 }),
          easing: 'easeOutExpo',
          duration: 900
        })
      } else {
        // Out animations
        anime({
          targets: '.anim-word',
          translateY: [0, 40],
          opacity: [1, 0],
          easing: 'easeInCubic',
          duration: 300,
          delay: 0
        })
        anime({
          targets: '.stat-cell',
          translateY: [0, 30],
          opacity: [1, 0],
          easing: 'easeInExpo',
          duration: 300,
          delay: 0
        })
        anime({
          targets: '.about-lower-anim',
          translateY: [0, 30],
          opacity: [1, 0],
          easing: 'easeInExpo',
          duration: 300,
          delay: 0
        })
      }
    }, { threshold: 0.25 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const leadText = "Computer Engineering graduate turning raw data into decisions, and curiosity into code."

  return (
    <section id="about" className="section" data-section="about" ref={sectionRef}>

      {/* Section header — Bermawy: lowercase label + blue rule */}
      <div className="section-head reveal">
        <span className="section-label">hi there_</span>
        <span className="section-meta">Profile / 01</span>
      </div>

      {/* Lead statement - Animated word by word */}
      <p className="about-hero-line">
        {leadText.split(' ').map((word, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingRight: '0.25em', paddingBottom: '0.1em' }}>
            <span className="anim-word" style={{ display: 'inline-block', transform: 'translateY(40px)', opacity: 0 }}>
              {word}
            </span>
          </span>
        ))}
      </p>

      {/* Stats row — Gertix 4-col dashed grid with + crosshairs */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-cell" style={{ opacity: 0, transform: 'translateY(30px)' }}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 2-column grid */}
      <div className="about-grid">

        {/* Left — bio paragraphs + pill tags */}
        <div className="about-bio">
          {bio.paragraphs.map((p, i) => (
            <p key={i} className="about-lower-anim" style={{ opacity: 0 }}>{p}</p>
          ))}

          <div className="tag-group about-lower-anim" style={{ marginTop: '2rem', opacity: 0 }}>
            {bio.concepts.map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>

          {/* Actions — split CTA */}
          <div className="about-actions about-lower-anim" style={{ opacity: 0 }}>
            <div className="hero-cta-group">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-label"
                style={{ display: 'inline-block' }}
              >
                GITHUB
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arrow"
                aria-label="GitHub"
              >
                ↗
              </a>
            </div>
            <div className="hero-cta-group">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-label"
                style={{ display: 'inline-block' }}
              >
                LINKEDIN
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arrow"
                aria-label="LinkedIn"
              >
                ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right — dossier + skill table */}
        <div>

          {/* Dossier spec card */}
          <div className="dossier-card about-lower-anim" style={{ opacity: 0 }}>
            {dossierRows.map((row) => (
              <div key={row.key} className="dossier-row">
                <span className="dossier-key">{row.key}</span>
                <span className="dossier-val">{row.val}</span>
              </div>
            ))}
          </div>


        </div>
      </div>

    </section>
  )
}
