import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import { skills, skillConnections, projects } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Signal() {
  const [active, setActive] = useState(null)
  const [locked, setLocked] = useState(null)
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()
  const selectedId = locked || active

  const selectedSkill = skills.find((s) => s.id === selectedId)

  const connectedIds = useMemo(() => {
    if (!selectedId) return new Set(skills.map((s) => s.id))
    const connected = skillConnections
      .filter(([f, t]) => f === selectedId || t === selectedId)
      .flat()
    return new Set([selectedId, ...connected])
  }, [selectedId])

  const relatedProjects = selectedSkill
    ? new Set(selectedSkill.links)
    : new Set(projects.map((p) => p.id))

  // Entrance animation
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.signal__title-word', {
        yPercent: 100,
        opacity: 0,
        stagger: 0.07,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
      gsap.from('.signal__map', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.signal__map', start: 'top 80%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      className="signal scene"
      id="signal"
      data-section="signal"
      ref={sectionRef}
      aria-label="Skills and signal map"
    >
      <div className="scene__label">
        <span>02 / SIGNAL MAP</span>
        <span>Trace ideas back to builds.</span>
      </div>

      <div className="signal__layout">
        {/* Left: intro */}
        <div className="signal__intro">
          <p className="eyebrow signal__eyebrow">AN ARSENAL IN MOTION</p>
          <h2 className="signal__title">
            <span className="signal__title-line">
              <span className="signal__title-word">Learning</span>
            </span>
            <span className="signal__title-line">
              <em className="signal__title-word">in layers.</em>
            </span>
          </h2>
          <p className="signal__note">
            Hover a node to trace connections. Click to hold the chain in place.
          </p>

          {/* Live readout */}
          <div className="signal__readout" aria-live="polite">
            {selectedSkill ? (
              <>
                <span className="signal__readout-tag">{locked ? 'LOCKED' : 'ACTIVE'}</span>
                <strong className="signal__readout-name">{selectedSkill.label}</strong>
                <div className="signal__readout-meta">
                  <span>{selectedSkill.level}</span>
                  <span>·</span>
                  <span>{selectedSkill.category}</span>
                  <span>·</span>
                  <span>{selectedSkill.links.length} projects</span>
                </div>
              </>
            ) : (
              <>
                <span className="signal__readout-tag">FIELD</span>
                <strong className="signal__readout-name">THE WHOLE MAP</strong>
                <div className="signal__readout-meta">
                  <span>{skills.length} nodes</span>
                  <span>·</span>
                  <span>{skillConnections.length} connections</span>
                </div>
              </>
            )}
          </div>

          {/* Related projects list */}
          <div className="signal__projects">
            <span className="signal__projects-label">LINKED BUILDS</span>
            {projects.map((p) => (
              <a
                key={p.id}
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className={`signal__project-link ${relatedProjects.has(p.id) ? 'signal__project-link--active' : 'signal__project-link--dim'}`}
                aria-label={`${p.name} on GitHub`}
              >
                <span className="signal__project-dot" style={{ background: relatedProjects.has(p.id) ? p.accent : 'var(--muted)' }} />
                <span>{p.name}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Right: SVG graph map */}
        <div
          className={`signal__map ${selectedId ? 'signal__map--has-selection' : ''}`}
          data-cursor="explore"
          role="group"
          aria-label="Interactive skill graph"
        >
          {/* Background grid */}
          <div className="signal__map-grid" aria-hidden="true" />

          {/* SVG connection lines */}
          <svg className="signal__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {skillConnections.map(([from, to]) => {
              const fromSkill = skills.find((s) => s.id === from)
              const toSkill = skills.find((s) => s.id === to)
              if (!fromSkill || !toSkill) return null
              const isActive = selectedId && (from === selectedId || to === selectedId)
              const isRelated = selectedId
                ? connectedIds.has(from) && connectedIds.has(to)
                : true
              return (
                <line
                  key={`${from}-${to}`}
                  x1={fromSkill.x} y1={fromSkill.y}
                  x2={toSkill.x} y2={toSkill.y}
                  className={`signal__line ${
                    isActive ? 'signal__line--active' :
                    isRelated && selectedId ? 'signal__line--related' :
                    selectedId ? 'signal__line--dim' : ''
                  }`}
                />
              )
            })}
          </svg>

          {/* Center core */}
          <div className={`signal__core ${selectedId ? 'signal__core--active' : ''}`} aria-hidden="true">
            <span>SN</span>
          </div>

          {/* Skill nodes */}
          {skills.map((skill) => {
            const isPrimary = selectedId === skill.id
            const isConnected = connectedIds.has(skill.id)
            const isDim = selectedId && !isConnected
            return (
              <button
                key={skill.id}
                className={`signal__node ${isPrimary ? 'signal__node--active' : ''} ${selectedId && isConnected && !isPrimary ? 'signal__node--connected' : ''} ${isDim ? 'signal__node--dim' : ''}`}
                style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
                aria-pressed={locked === skill.id}
                aria-label={`${skill.label} — ${skill.category}`}
                onMouseEnter={() => setActive(skill.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(skill.id)}
                onBlur={() => setActive(null)}
                onClick={() => setLocked(locked === skill.id ? null : skill.id)}
              >
                <span className="signal__node-pip" aria-hidden="true" />
                <strong className="signal__node-label">{skill.label}</strong>
                <small className="signal__node-cat">{skill.category}</small>
              </button>
            )
          })}

          {/* Instructions overlay */}
          <div className="signal__hint" aria-hidden="true">
            HOVER · CLICK · TRACE
          </div>
        </div>
      </div>
    </section>
  )
}
