import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, Command, Download, GitBranch, Menu, MousePointer2, RotateCcw, X } from 'lucide-react'
import { bio, journey, marqueeItems, profile, projects, skillConnections, skills } from './data/portfolio'
import { createSmoothScroll, gsap, ScrollTrigger } from './animations/siteMotion'
import './styles.css'

const heroSignals = [
  { id: 'python', label: 'PYTHON', detail: 'Tools / automation' },
  { id: 'data', label: 'DATA', detail: 'Patterns / analysis' },
  { id: 'ml', label: 'MACHINE LEARNING', detail: 'Models / experiments' },
]

const graphPaths = [
  { from: 'python', to: 'data', d: 'M18 28 C28 15 34 24 43 18' },
  { from: 'python', to: 'backend', d: 'M18 28 C28 42 22 60 28 73' },
  { from: 'data', to: 'ml', d: 'M43 18 C53 14 61 19 69 27' },
  { from: 'data', to: 'stats', d: 'M43 18 C58 30 76 38 82 53' },
  { from: 'ml', to: 'stats', d: 'M69 27 C76 36 77 43 82 53' },
  { from: 'ml', to: 'automation', d: 'M69 27 C66 45 67 60 62 76' },
  { from: 'automation', to: 'backend', d: 'M62 76 C48 84 38 81 28 73' },
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function Header({ onCommand }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = ['about', 'skills', 'work', 'contact']
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Back to top"><span className="brand-mark">SN</span><span>{profile.shortName}</span></a>
    <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>{nav.map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav>
    <div className="header-actions">
      <button className="command-trigger" onClick={onCommand} aria-label="Open command menu"><Command size={14} /><span>COMMAND</span><kbd>K</kbd></button>
      <a className="status-pill" href={`mailto:${profile.email}`}><span className="status-dot" />OPEN TO OPPORTUNITIES</a>
    </div>
    <button className="menu-trigger" aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
  </header>
}

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); onClose(true) }
      if (event.key === 'Escape') onClose(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  useEffect(() => { if (!open) setQuery('') }, [open])
  if (!open) return null
  const commands = [
    ['Jump to work', '#work'], ['Read the profile', '#about'], ['Explore the signal map', '#skills'], ['Open GitHub', profile.github], ['Send an email', `mailto:${profile.email}`],
  ].filter(([label]) => label.toLowerCase().includes(query.toLowerCase()))
  return <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Portfolio command menu" onClick={() => onClose(false)}>
    <div className="command-box" onClick={(event) => event.stopPropagation()}>
      <div className="command-input"><Command size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a signal..." /><kbd>ESC</kbd></div>
      <div className="command-list">{commands.map(([label, href]) => <a key={label} href={href} onClick={() => onClose(false)}><span>{label}</span><ArrowUpRight size={16} /></a>)}</div>
      <div className="command-foot"><span>Navigate the portfolio</span><span><kbd>ENTER</kbd> select <kbd>ESC</kbd> close</span></div>
    </div>
  </div>
}

function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined
    const move = (event) => {
      gsap.to(dotRef.current, { x: event.clientX, y: event.clientY, duration: 0.1, ease: 'power2.out' })
      gsap.to(ringRef.current, { x: event.clientX, y: event.clientY, duration: 0.45, ease: 'power3.out' })
    }
    const over = (event) => {
      const target = event.target.closest('a, button, [data-cursor]')
      if (!target) return
      document.body.classList.add('cursor-hover')
      document.body.classList.toggle('cursor-email', target.dataset.cursor === 'email')
      document.body.classList.toggle('cursor-signal', target.dataset.cursor === 'signal')
    }
    const out = (event) => {
      const from = event.target.closest('a, button, [data-cursor]')
      if (!from || from.contains(event.relatedTarget)) return
      document.body.classList.remove('cursor-hover', 'cursor-email', 'cursor-signal')
    }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out); document.body.classList.remove('cursor-hover', 'cursor-email', 'cursor-signal') }
  }, [])
  return <><div className="cursor-dot" ref={dotRef} /><div className="cursor-ring" ref={ringRef}><MousePointer2 size={13} /></div></>
}

function Hero() {
  const heroRef = useRef(null)
  const [hoveredSignal, setHoveredSignal] = useState(null)
  const [coreActive, setCoreActive] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || reduced || window.matchMedia('(pointer: coarse)').matches) return undefined
    const rings = hero.querySelectorAll('.orbit')
    const nodes = hero.querySelectorAll('.orbit-node')
    const copy = hero.querySelector('.hero-copy')
    const onMove = (event) => {
      const rect = hero.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      gsap.to(rings[0], { x: x * 15, y: y * 11, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(rings[1], { x: x * -23, y: y * -16, duration: 1.15, ease: 'power3.out', overwrite: 'auto' })
      nodes.forEach((node, index) => gsap.to(node, { x: x * (11 + index * 4), y: y * (9 + index * 3), duration: 0.55, ease: 'power3.out', overwrite: 'auto' }))
      gsap.to(copy, { x: x * -7, y: y * -5, duration: 0.75, ease: 'power3.out', overwrite: 'auto' })
    }
    const onLeave = () => {
      gsap.to([...rings, ...nodes, copy], { x: 0, y: 0, duration: 0.85, ease: 'elastic.out(1, .55)', overwrite: 'auto' })
    }
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => { hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave) }
  }, [reduced])
  const signal = heroSignals.find((item) => item.id === hoveredSignal)
  return <section className={`hero ${coreActive ? 'is-inspecting' : ''}`} id="top" ref={heroRef}>
    <div className="hero-grid" />
    <div className="hero-topline"><span>COMPUTER ENGINEERING / STUDENT</span><span>18° 31' N / 73° 51' E</span></div>
    <div className="hero-copy">
      <p className="eyebrow"><span className="pulse" />DATA SCIENCE / MACHINE LEARNING / PYTHON</p>
      <h1><span className="hero-word hero-word--outline">Find</span><span className="hero-word hero-word--solid">the</span><span className="hero-word hero-word--italic">signal<span className="period">.</span></span></h1>
      <p className="hero-blurb">I’m Suyash — a computer engineering student turning curiosity into small tools, clear analysis, and useful systems.</p>
    </div>
    <div className="hero-console" data-cursor="signal">
      <div className="console-head"><span>LIVE / IDENTITY SCAN</span><span>SN_24</span></div>
      <div className="console-orbit">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <button className="orbit-core" data-cursor="signal" aria-label="Inspect Suyash's data field" onMouseEnter={() => setCoreActive(true)} onMouseLeave={() => setCoreActive(false)} onFocus={() => setCoreActive(true)} onBlur={() => setCoreActive(false)}><span>SN</span></button>
        {heroSignals.map((item, index) => <button key={item.id} className={`orbit-node node-${index + 1} ${hoveredSignal === item.id ? 'is-hovered' : ''}`} data-cursor="signal" aria-label={`Explore ${item.label}`} onMouseEnter={() => setHoveredSignal(item.id)} onMouseLeave={() => setHoveredSignal(null)} onFocus={() => setHoveredSignal(item.id)} onBlur={() => setHoveredSignal(null)}><span /></button>)}
        <div className={`orbit-insight ${signal ? 'is-visible' : ''}`}>{signal ? <><small>SIGNAL / {signal.label}</small><strong>{signal.detail}</strong></> : <><small>{coreActive ? 'SYSTEM / ACTIVE' : 'ORBIT / IDLE'}</small><strong>{coreActive ? 'Trace the field' : 'Hover a signal'}</strong></>}</div>
      </div>
      <div className="console-readout"><span>FIELD</span><strong>{coreActive ? 'CONNECTED' : 'DATA + ML'}</strong><span>STATUS</span><strong>{hoveredSignal ? signal?.label : 'OPEN / CURIOUS'}</strong></div>
    </div>
    <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17} /></a>
    <div className="hero-code">[ 001 ] / [ 010 ] / [ 100 ]</div>
  </section>
}

function Marquee() {
  const content = [...marqueeItems, ...marqueeItems]
  return <div className="marquee" aria-label="Areas of interest"><div className="marquee-track">{content.map((item, index) => <span key={`${item}-${index}`}>{item}<i>✳</i></span>)}</div></div>
}

const conceptArtifacts = {
  Python: <code>def build():<br />&nbsp;&nbsp;return signal</code>,
  Data: <span className="artifact-bars"><i /><i /><i /><i /></span>,
  'Machine Learning': <code>input → model → insight</code>,
  Automation: <span className="artifact-flow">fetch → parse → repeat</span>,
  Building: <span className="artifact-blocks"><i /><i /><i /></span>,
}

function Concept({ label }) {
  const [active, setActive] = useState(false)
  return <button className={`concept-word ${active ? 'is-active' : ''}`} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} onFocus={() => setActive(true)} onBlur={() => setActive(false)}><span>{label}</span><span className="concept-artifact">{conceptArtifacts[label]}</span></button>
}

function About() {
  return <section className="about scene" id="about">
    <div className="scene-label"><span>01 / PROFILE</span><span>A little context before the work.</span></div>
    <div className="about-layout">
      <div className="about-heading"><p className="eyebrow">THE HUMAN VARIABLE</p><h2>Curious<br /><em>by default.</em></h2><div className="about-index">[ 01—04 ]</div></div>
      <div className="about-copy"><p className="about-lead">{bio[0]}</p><p>{bio[1]}</p><p>{bio[2]}</p><p className="concept-copy">Currently orbiting <Concept label="Python" />, <Concept label="Data" />, <Concept label="Machine Learning" />, <Concept label="Automation" />, and <Concept label="Building" />.</p><a className="text-link" href={profile.resume} download>Download resume <Download size={15} /></a></div>
    </div>
    <div className="identity-row"><div><span>ROLE</span><strong>Student / Builder</strong></div><div><span>FOCUS</span><strong>Data + ML + Systems</strong></div><div><span>STACK</span><strong>Python / Git / SQL</strong></div><div><span>OPEN TO</span><strong>Internships / Entry-level</strong></div></div>
  </section>
}

function SkillMap() {
  const [lockedSkill, setLockedSkill] = useState(null)
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const selectedId = lockedSkill || hoveredSkill
  const selectedSkill = skills.find((skill) => skill.id === selectedId)
  const connectedIds = useMemo(() => {
    if (!selectedId) return new Set(skills.map((skill) => skill.id))
    return new Set([selectedId, ...skillConnections.filter(([from, to]) => from === selectedId || to === selectedId).flat()])
  }, [selectedId])
  const relatedProjects = selectedSkill ? new Set(selectedSkill.links) : new Set(projects.map((project) => project.id))
  return <section className="skills-scene scene" id="skills">
    <div className="scene-label"><span>02 / SIGNAL MAP</span><span>Trace the ideas back to the builds.</span></div>
    <div className="skills-intro"><p className="eyebrow">AN ARSENAL IN MOTION</p><h2>Learning<br /><em>in layers.</em></h2><p className="skills-note">Hover a signal to trace the relevant nodes and projects. Click to hold the chain in place.</p><div className="selected-readout">{selectedSkill ? <><span className="readout-label">{lockedSkill ? 'LOCKED SIGNAL' : 'LIVE SIGNAL'}</span><strong>{selectedSkill.label}</strong><small>{selectedSkill.level} / {selectedSkill.category} / {selectedSkill.links.length} projects</small></> : <><span className="readout-label">SELECTED SIGNAL</span><strong>THE WHOLE FIELD</strong><small>6 connected directions</small></>}</div></div>
    <div className={`signal-map ${selectedId ? 'has-selection' : ''}`} data-cursor="signal">
      <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{graphPaths.map((path) => <path key={`${path.from}-${path.to}`} d={path.d} className={selectedId ? (path.from === selectedId || path.to === selectedId ? 'is-active' : connectedIds.has(path.from) && connectedIds.has(path.to) ? 'is-related' : 'is-dim') : ''} />)}</svg>
      <div className={`map-core ${selectedId ? 'is-active' : ''}`}><span>SN</span><small>DATA<br />FIELD</small></div>
      {skills.map((skill) => {
        const primary = selectedId === skill.id
        const related = connectedIds.has(skill.id)
        return <button key={skill.id} className={`skill-node ${primary ? 'is-active' : ''} ${selectedId && related && !primary ? 'is-connected' : ''} ${selectedId && !related ? 'is-dim' : ''}`} style={{ left: `${skill.x}%`, top: `${skill.y}%` }} aria-pressed={lockedSkill === skill.id} onMouseEnter={() => setHoveredSkill(skill.id)} onMouseLeave={() => setHoveredSkill(null)} onFocus={() => setHoveredSkill(skill.id)} onBlur={() => setHoveredSkill(null)} onClick={() => setLockedSkill(lockedSkill === skill.id ? null : skill.id)}><span className="node-pip" /><strong>{skill.label}</strong><small>{skill.category}</small></button>
      })}
      <div className={`map-context ${selectedSkill ? 'is-visible' : ''}`}>{selectedSkill ? <><span>CHAIN</span><strong>{selectedSkill.label}</strong><small>{projects.filter((project) => relatedProjects.has(project.id)).map((project) => project.name).join(' / ')}</small></> : <><span>HOVER / CLICK</span><strong>Trace a signal</strong><small>Relationships appear here.</small></>}</div>
      <div className="map-projects">{projects.map((project) => <a className={relatedProjects.has(project.id) ? 'is-linked' : 'is-dim'} key={project.id} href={project.github} target="_blank" rel="noreferrer"><span style={{ background: project.accent }} />{project.name}<ArrowUpRight size={13} /></a>)}</div>
    </div>
  </section>
}

function GazeDemo() {
  const [point, setPoint] = useState({ x: 53, y: 43 })
  const update = (event) => {
    if (event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    setPoint({ x: Math.max(9, Math.min(91, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.max(12, Math.min(86, ((event.clientY - rect.top) / rect.height) * 100)) })
  }
  return <div className="iris-demo project-demo" data-cursor="signal" onPointerMove={update} onPointerLeave={() => setPoint({ x: 53, y: 43 })} style={{ '--gaze-x': `${point.x}%`, '--gaze-y': `${point.y}%` }}><div className="gaze-camera"><span>CAMERA / INPUT</span><i className="face-frame" /><i className="gaze-reticle" /><i className="gaze-point" /></div><div className="gaze-ui"><i /><i /><i /></div><span className="demo-hint">MOVE TO TRACE GAZE</span></div>
}

function CipherDemo() {
  const lines = ['$ cipher --mode inspect', '> parsing input...', '> transformation ready', '> output: encoded']
  const [line, setLine] = useState(1)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return undefined
    const timer = window.setInterval(() => setLine((value) => value >= lines.length ? 1 : value + 1), 1150)
    return () => window.clearInterval(timer)
  }, [reduced, lines.length])
  return <div className="cipher-demo project-demo"><div className="terminal-head"><span>cipher_cli</span><i /><i /><i /></div><div className="terminal-output">{lines.slice(0, line).map((item, index) => <span key={item} className={index === line - 1 ? 'is-typing' : ''}>{item}</span>)}<b className="terminal-caret">_</b></div><div className="terminal-scan" /></div>
}

function EdaDemo() {
  const [focus, setFocus] = useState(-1)
  const heights = [46, 72, 58, 86, 65, 78]
  const track = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setFocus(Math.max(0, Math.min(heights.length - 1, Math.floor(((event.clientX - rect.left) / rect.width) * heights.length))))
  }
  return <div className="eda-demo project-demo" data-cursor="signal" onPointerMove={track} onPointerLeave={() => setFocus(-1)}><div className="eda-axis"><span>distribution</span><span>patterns</span></div><div className="eda-bars">{heights.map((height, index) => <button key={height} aria-label={`Explore data column ${index + 1}`} className={focus === index ? 'is-active' : ''} style={{ height: `${height}%` }} onFocus={() => setFocus(index)} onBlur={() => setFocus(-1)}><i /></button>)}</div><div className="eda-trace"><i style={{ left: `${focus < 0 ? 56 : focus * 18 + 6}%` }} /></div><span className="demo-hint">{focus < 0 ? 'HOVER TO COMPARE' : `COLUMN / 0${focus + 1}`}</span></div>
}

function CrawlerDemo() {
  const nodes = [{ x: 50, y: 46, label: 'root' }, { x: 22, y: 20, label: '/about' }, { x: 78, y: 23, label: '/data' }, { x: 19, y: 76, label: '/work' }, { x: 78, y: 74, label: '/next' }]
  const [found, setFound] = useState(1)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return undefined
    const timer = window.setInterval(() => setFound((value) => value === nodes.length ? 1 : value + 1), 1050)
    return () => window.clearInterval(timer)
  }, [nodes.length, reduced])
  return <div className="crawler-demo project-demo"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 46 L22 20 M50 46 L78 23 M50 46 L19 76 M50 46 L78 74" /></svg>{nodes.map((node, index) => <span key={node.label} className={index < found ? 'is-found' : ''} style={{ left: `${node.x}%`, top: `${node.y}%` }}><i />{node.label}</span>)}<div className="crawler-status">DISCOVERED / 0{found}</div></div>
}

function ProjectVisual({ project }) {
  return <div className="project-visual" style={{ '--project-accent': project.accent }}><div className="visual-grid" /><div className="visual-frame"><span className="visual-kicker">{project.signal}</span>{project.id === 'iris' && <GazeDemo />}{project.id === 'cipher-cli' && <CipherDemo />}{project.id === 'eda' && <EdaDemo />}{project.id === 'crawler' && <CrawlerDemo />}</div><div className="visual-stamp">{project.index} / BUILD</div></div>
}

function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const mm = gsap.matchMedia()
    mm.add('(min-width: 851px)', () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96)
      const tween = gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance() + window.innerHeight * .9}`, scrub: 1, pin: true, invalidateOnRefresh: true } })
      return () => tween.kill()
    })
    return () => mm.revert()
  }, [])
  return <section className="projects-scene" id="work" ref={sectionRef}><div className="projects-head"><div><span>03 / SELECTED BUILDS</span><h2>Work that<br /><em>moves.</em></h2></div><p>Scroll sideways through the lab.<br />Each panel is a small live representation.</p></div><div className="project-track" ref={trackRef}>{projects.map((project) => <article className="project-panel" key={project.id}><div className="project-panel-top"><span>{project.index} / {project.type}</span><a href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}><GitBranch size={17} /></a></div><ProjectVisual project={project} /><div className="project-panel-copy"><h3>{project.name}</h3><p>{project.description}</p><div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><a href={project.github} target="_blank" rel="noreferrer" className="project-open">Open repository <ArrowUpRight size={15} /></a></div></article>)}</div><div className="projects-footer"><span>DRAG / SCROLL</span><div className="rail"><i /></div><span>04 / 04</span></div></section>
}

function Journey() {
  const sceneRef = useRef(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    if (reduced) return undefined
    const context = gsap.context(() => {
      gsap.fromTo('.trajectory-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: sceneRef.current, start: 'top 78%', end: 'bottom 55%', scrub: true } })
      gsap.utils.toArray('.trajectory-step').forEach((step) => {
        gsap.fromTo(step, { x: 34, opacity: .32 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 82%', end: 'top 54%', scrub: true } })
      })
    }, sceneRef)
    return () => context.revert()
  }, [reduced])
  return <section className="journey scene" id="journey" ref={sceneRef}><div className="scene-label"><span>04 / TRAJECTORY</span><span>The work is still becoming.</span></div><div className="journey-layout"><div className="journey-title"><p className="eyebrow">A MOVING TARGET</p><h2>Next<br /><em>chapter.</em></h2><p>Curiosity is a direction, not a finished label. Here’s the path I’m on.</p></div><div className="trajectory"><div className="trajectory-track"><i className="trajectory-fill" /></div><div className="trajectory-steps">{journey.map((item, index) => <article className="trajectory-step" key={item.year}><span className="trajectory-dot">0{index + 1}</span><div><time>{item.year}</time><h3>{item.label}</h3><p>{item.detail}</p></div><ArrowUpRight size={16} /></article>)}</div></div></div></section>
}

function Contact() {
  const sectionRef = useRef(null)
  const fieldRef = useRef(null)
  const emailRef = useRef(null)
  const nearRef = useRef(false)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const section = sectionRef.current
    const field = fieldRef.current
    if (!section || !field || window.matchMedia('(pointer: coarse)').matches) return undefined
    const moveX = gsap.quickTo(field, 'x', { duration: .65, ease: 'power3.out' })
    const moveY = gsap.quickTo(field, 'y', { duration: .65, ease: 'power3.out' })
    const move = (event) => {
      const rect = section.getBoundingClientRect()
      moveX(event.clientX - rect.left - rect.width / 2)
      moveY(event.clientY - rect.top - rect.height / 2)
      const email = emailRef.current.getBoundingClientRect()
      const distance = Math.hypot(event.clientX - (email.left + email.width / 2), event.clientY - (email.top + email.height / 2))
      const isNear = distance < 250
      if (nearRef.current !== isNear) { nearRef.current = isNear; setNear(isNear) }
    }
    const leave = () => { nearRef.current = false; setNear(false); moveX(0); moveY(0) }
    section.addEventListener('pointermove', move)
    section.addEventListener('pointerleave', leave)
    return () => { section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', leave) }
  }, [])
  return <section className={`contact-scene ${near ? 'is-near-email' : ''}`} id="contact" ref={sectionRef}><div className="contact-grid" /><div className="contact-field" ref={fieldRef} /><div className="contact-top"><span>05 / CONTACT</span><span>LET’S FIND THE NEXT SIGNAL</span></div><div className="contact-main"><p className="eyebrow"><span className="pulse" />OPEN TO OPPORTUNITIES</p><h2>Have a<br /><em>question?</em></h2><a className="contact-email" data-cursor="email" ref={emailRef} href={`mailto:${profile.email}`} onMouseEnter={() => setNear(true)} onMouseLeave={() => setNear(false)} onFocus={() => setNear(true)} onBlur={() => setNear(false)}>{profile.email}<ArrowUpRight size={22} /></a><p className="contact-note">For internships, entry-level roles, collaborations, or an interesting problem worth unpacking.</p></div><div className="contact-bottom"><div className="socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div><a className="back-top" href="#top">Return to top <RotateCcw size={14} /></a><span>© 2026 / SUYASH NARAWADE</span></div></section>
}

function App() {
  const rootRef = useRef(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => { const cleanup = createSmoothScroll(); return cleanup }, [])
  useLayoutEffect(() => {
    if (reduced) return undefined
    const context = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 120, opacity: 0, rotate: 3, stagger: .08, duration: 1.2, ease: 'power4.out', delay: .1 })
      gsap.from('.hero-console', { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: .35 })
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } }).to('.hero-copy', { y: 90, opacity: .16, ease: 'none' }, 0).to('.hero-console', { y: -150, scale: .56, rotate: -8, opacity: .24, ease: 'none' }, 0).to('.hero-grid', { scale: 1.18, opacity: .1, ease: 'none' }, 0)
      gsap.fromTo('.skills-scene .map-core', { scale: .48, opacity: .25 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.skills-scene', start: 'top 88%', end: 'top 38%', scrub: 1 } })
      gsap.to('.marquee-track', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } })
    }, rootRef)
    return () => context.revert()
  }, [reduced])
  return <div className="app-shell" ref={rootRef}><Cursor /><Header onCommand={() => setCommandOpen(true)} /><CommandPalette open={commandOpen} onClose={setCommandOpen} /><main><Hero /><Marquee /><About /><SkillMap /><Projects /><Journey /><Contact /></main></div>
}

const root = globalThis.__suyashPortfolioRoot ?? (globalThis.__suyashPortfolioRoot = createRoot(document.getElementById('root')))
root.render(<React.StrictMode><App /></React.StrictMode>)
