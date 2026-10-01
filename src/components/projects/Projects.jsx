import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/portfolio'
import { GazeDemo, CipherDemo, EdaDemo, CrawlerDemo } from './ProjectDemos'

gsap.registerPlugin(ScrollTrigger)

const DEMOS = {
  iris: GazeDemo,
  'cipher-cli': CipherDemo,
  eda: EdaDemo,
  crawler: CrawlerDemo,
}

function ProjectPanel({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const Demo = DEMOS[project.id]

  return (
    <article
      className={`project-panel ${hovered ? 'project-panel--hovered' : ''}`}
      style={{ '--accent': project.accent, '--accent-dim': project.accentDim }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="project"
      aria-label={`${project.name} — ${project.type}`}
    >
      {/* Panel header — spans full width */}
      <div className="project-panel__head">
        <div className="project-panel__meta">
          <span className="project-panel__index">{project.index}</span>
          <span className="project-panel__type">{project.type}</span>
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="project-panel__github"
          aria-label={`${project.name} on GitHub`}
          data-cursor="link"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>

      {/* Left: Live demo visual */}
      <div className="project-panel__visual">
        <div className="project-panel__visual-bg" />
        {Demo && <Demo />}
        <div className="project-panel__signal-tag">{project.signal}</div>
      </div>

      {/* Right: Copy */}
      <div className="project-panel__copy">
        <h3 className="project-panel__name">{project.name}</h3>
        <p className="project-panel__desc">{project.description}</p>

        {/* Stack */}
        <div className="project-panel__stack" aria-label="Tech stack">
          {project.stack.map((tech) => (
            <span key={tech} className="project-panel__tech">{tech}</span>
          ))}
        </div>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="project-panel__open"
          aria-label={`Open ${project.name} repository on GitHub`}
          data-cursor="link"
        >
          Open repository
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>
      </div>
    </article>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 851px)', () => {
      const section = sectionRef.current
      const track = trackRef.current
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.85}`,
          scrub: 1.2,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      return () => tween.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <section
      className="projects"
      id="work"
      data-section="work"
      ref={sectionRef}
      aria-label="Selected projects"
    >
      {/* Section header */}
      <div className="projects__head">
        <div className="projects__head-left">
          <span className="projects__section-num">03 / SELECTED BUILDS</span>
          <h2 className="projects__title">
            Work that<br />
            <em>moves.</em>
          </h2>
        </div>
        <p className="projects__sub">
          Scroll sideways through the lab.<br />
          Each panel is a live representation.
        </p>
      </div>

      {/* Horizontal scroll track */}
      <div className="projects__track" ref={trackRef}>
        {projects.map((project, i) => (
          <ProjectPanel key={project.id} project={project} index={i} />
        ))}
        {/* End card */}
        <div className="projects__end-card">
          <span className="projects__end-label">04 / 04</span>
          <p>More on GitHub →</p>
          <a
            href="https://github.com/Suyash-24"
            target="_blank"
            rel="noreferrer"
            className="projects__github-link"
            data-cursor="link"
          >
            github.com/Suyash-24
          </a>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="projects__footer" aria-hidden="true">
        <span>DRAG / SCROLL</span>
        <div className="projects__rail">
          <div className="projects__rail-fill" />
        </div>
        <span>04 BUILDS</span>
      </div>
    </section>
  )
}
