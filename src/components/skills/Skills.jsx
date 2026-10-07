import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import anime from 'animejs'
import './modal.css'

const skillCategories = [
  {
    category: "Languages & Core",
    skills: [
      { name: 'Python', level: 'Proficient' },
      { name: 'SQL (MySQL)', level: 'Proficient' },
      { name: 'JavaScript', level: 'Intermediate' },
      { name: 'HTML / CSS', level: 'Proficient' },
    ]
  },
  {
    category: "Data Analytics & ML",
    skills: [
      { name: 'Pandas & NumPy', level: 'Proficient' },
      { name: 'scikit-learn', level: 'Proficient' },
      { name: 'Power BI & Tableau', level: 'Proficient' },
      { name: 'Matplotlib & Seaborn', level: 'Proficient' },
    ]
  },
  {
    category: "Tools & Ecosystems",
    skills: [
      { name: 'Git & GitHub', level: 'Proficient' },
      { name: 'Linux / Bash', level: 'Intermediate' },
      { name: 'VS Code & Jupyter', level: 'Proficient' },
      { name: 'Bootstrap & jQuery', level: 'Intermediate' },
    ]
  }
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [activeSkill, setActiveSkill] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        anime({
          targets: '.anim-skill-word',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(30, { start: 100 }),
          easing: 'easeOutCubic',
          duration: 700
        })
        anime({
          targets: '.skill-box',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(80, { start: 400 }),
          easing: 'easeOutExpo',
          duration: 900
        })
      } else {
        anime({
          targets: '.anim-skill-word',
          translateY: [0, 40],
          opacity: [1, 0],
          easing: 'easeInCubic',
          duration: 300,
          delay: 0
        })
        anime({
          targets: '.skill-box',
          translateY: [0, 40],
          opacity: [1, 0],
          easing: 'easeInExpo',
          duration: 300,
          delay: 0
        })
      }
    }, { threshold: 0.15 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="section section-alt" data-section="skills" ref={sectionRef}>
      
      {/* Section header */}
      <div className="section-head reveal">
        <span className="section-label">skill stack_</span>
        <span className="section-meta">Capabilities / 02</span>
      </div>

      <p className="about-hero-line" style={{ maxWidth: '30ch', marginBottom: '2rem' }}>
        {"The tools and systems I use to build reproducible pipelines and data-driven solutions.".split(' ').map((word, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingRight: '0.25em', paddingBottom: '0.1em' }}>
            <span className="anim-skill-word" style={{ display: 'inline-block', transform: 'translateY(40px)', opacity: 0 }}>
              {word}
            </span>
          </span>
        ))}
      </p>

      {/* Grid Layout for Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {skillCategories.map((group, groupIdx) => (
          <div key={group.category}>
            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.65rem', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: 'var(--text-ghost)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              paddingBottom: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              // {group.category}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {group.skills.map((skill, i) => (
                <div key={skill.name} className="skill-box skill-card" onClick={() => setActiveSkill(skill)} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  opacity: 0,
                  transform: 'translateY(40px)',
                  cursor: 'pointer'
                }}>
                  <span style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontWeight: 500, 
                    fontSize: '0.9rem', 
                    color: 'var(--text-primary)' 
                  }}>
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Creative Terminal Modal */}
      {activeSkill && createPortal(
        <div className="skill-modal-overlay" onClick={() => setActiveSkill(null)}>
          <div className="skill-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="skill-modal-header">
              <div className="terminal-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="skill-modal-close" onClick={() => setActiveSkill(null)}>CLOSE</span>
            </div>
            
            <div className="skill-modal-body">
              <h3 className="modal-glitch-title">{activeSkill.name}</h3>
              <div className="modal-meta-row">
                <span className="modal-badge">{activeSkill.level}</span>
                <span className="modal-badge-ghost">v2026.1</span>
              </div>
              
              <div className="terminal-box">
                <div className="term-line"><span className="prompt">suyash@portfolio:~$</span> analyze --skill "{activeSkill.name}"</div>
                <div className="term-line output">
                  {activeSkill.name.includes('Python') || activeSkill.name.includes('Pandas') ? 
                    "> Processing 1,000+ records, engineering features, and training Random Forest models (R²=0.46) for Coffee Shop Analytics." :
                   activeSkill.name.includes('Power BI') || activeSkill.name.includes('Tableau') ?
                    "> Surfacing $2.3M in tracked sales and $286K in profit across 4 regions with interactive BI dashboards." :
                   activeSkill.name.includes('HTML') || activeSkill.name.includes('JavaScript') ?
                    "> Designed and developed responsive web application interfaces during Anvistar ITS internship." :
                    "> Integrating and optimizing systems to deliver actionable insights through data-driven pipelines."
                  }
                </div>
                <div className="term-line"><span className="prompt">suyash@portfolio:~$</span> <span className="cursor-blink">_</span></div>
              </div>

              <div className="modal-footer-links">
                <a href="https://github.com/Suyash-24" target="_blank" rel="noreferrer" className="modal-link">GitHub Repository ↗</a>
                <a href="https://linkedin.com/in/suyashnarawade" target="_blank" rel="noreferrer" className="modal-link">LinkedIn Network ↗</a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
