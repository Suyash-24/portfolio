import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, Command, Download, GitBranch, Menu, MousePointer2, RotateCcw, X } from 'lucide-react'
import { bio, journey, marqueeItems, profile, projects, skills } from './data/portfolio'
import { createSmoothScroll, gsap, ScrollTrigger, splitReveal } from './animations/siteMotion'
import './styles.css'

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
    const handler = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); onClose(true) } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  if (!open) return null
  const commands = [
    ['Jump to work', '#work'], ['Read the profile', '#about'], ['Open GitHub', profile.github], ['Send an email', `mailto:${profile.email}`],
  ].filter(([label]) => label.toLowerCase().includes(query.toLowerCase()))
  return <div className="command-overlay" role="dialog" aria-modal="true" onClick={() => onClose(false)}>
    <div className="command-box" onClick={(event) => event.stopPropagation()}>
      <div className="command-input"><Command size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a signal..." /><kbd>ESC</kbd></div>
      <div className="command-list">{commands.map(([label, href]) => <a key={label} href={href} onClick={() => onClose(false)}><span>{label}</span><ArrowUpRight size={16} /></a>)}</div>
      <div className="command-foot"><span>Navigate the portfolio</span><span><kbd>↵</kbd> select <kbd>ESC</kbd> close</span></div>
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
    const enter = () => document.body.classList.add('cursor-hover')
    const leave = () => document.body.classList.remove('cursor-hover')
    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [data-cursor]').forEach((element) => { element.addEventListener('mouseenter', enter); element.addEventListener('mouseleave', leave) })
    return () => { window.removeEventListener('mousemove', move); document.querySelectorAll('a, button, [data-cursor]').forEach((element) => { element.removeEventListener('mouseenter', enter); element.removeEventListener('mouseleave', leave) }) }
  }, [])
  return <><div className="cursor-dot" ref={dotRef} /><div className="cursor-ring" ref={ringRef}><MousePointer2 size={13} /></div></>
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-grid" />
    <div className="hero-topline"><span>COMPUTER ENGINEERING / STUDENT</span><span>18° 31' N / 73° 51' E</span></div>
    <div className="hero-copy">
      <p className="eyebrow"><span className="pulse" />DATA SCIENCE / MACHINE LEARNING / PYTHON</p>
      <h1><span className="hero-word hero-word--outline">Find</span><span className="hero-word hero-word--solid">the</span><span className="hero-word hero-word--italic">signal<span className="period">.</span></span></h1>
      <p className="hero-blurb">I’m Suyash — a computer engineering student turning curiosity into small tools, clear analysis, and useful systems.</p>
    </div>
    <div className="hero-console" data-cursor>
      <div className="console-head"><span>LIVE / IDENTITY SCAN</span><span>SN_24</span></div>
      <div className="console-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><span>SN</span></div><i className="orbit-node node-a" /><i className="orbit-node node-b" /><i className="orbit-node node-c" /></div>
      <div className="console-readout"><span>FIELD</span><strong>DATA + ML</strong><span>STATUS</span><strong>OPEN / CURIOUS</strong></div>
    </div>
    <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17} /></a>
    <div className="hero-code">[ 001 ] / [ 010 ] / [ 100 ]</div>
  </section>
}

function Marquee() {
  const content = [...marqueeItems, ...marqueeItems]
  return <div className="marquee" aria-label="Areas of interest"><div className="marquee-track">{content.map((item, index) => <span key={`${item}-${index}`}>{item}<i>✳</i></span>)}</div></div>
}

function About() {
  return <section className="about scene" id="about">
    <div className="scene-label"><span>01 / PROFILE</span><span>A little context before the work.</span></div>
    <div className="about-layout">
      <div className="about-heading"><p className="eyebrow">THE HUMAN VARIABLE</p><h2 data-reveal>Curious<br /><em>by default.</em></h2><div className="about-index">[ 01—04 ]</div></div>
      <div className="about-copy" data-reveal><p className="about-lead">{bio[0]}</p><p>{bio[1]}</p><p>{bio[2]}</p><a className="text-link" href={profile.resume} download>Download resume <Download size={15} /></a></div>
    </div>
    <div className="identity-row" data-reveal><div><span>ROLE</span><strong>Student / Builder</strong></div><div><span>FOCUS</span><strong>Data + ML + Systems</strong></div><div><span>STACK</span><strong>Python / Git / SQL</strong></div><div><span>OPEN TO</span><strong>Internships / Entry-level</strong></div></div>
  </section>
}

function SkillMap() {
  const [active, setActive] = useState(null)
  const activeSkill = skills.find((skill) => skill.id === active)
  const activeProjects = activeSkill ? projects.filter((project) => activeSkill.links.includes(project.id)) : projects
  return <section className="skills-scene scene" id="skills">
    <div className="scene-label"><span>02 / SIGNAL MAP</span><span>Trace the ideas back to the builds.</span></div>
    <div className="skills-intro"><p className="eyebrow">AN ARSENAL IN MOTION</p><h2 data-reveal>Learning<br /><em>in layers.</em></h2><p className="skills-note">Every node is a current direction. Tap a signal to see the projects it touches.</p><div className="selected-readout">{activeSkill ? <><span className="readout-label">SELECTED SIGNAL</span><strong>{activeSkill.label}</strong><small>{activeSkill.level} / {activeSkill.category}</small></> : <><span className="readout-label">SELECTED SIGNAL</span><strong>THE WHOLE FIELD</strong><small>6 connected directions</small></>}</div></div>
    <div className="signal-map" data-cursor>
      <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M18 28 C30 16 31 25 43 18 S58 18 69 27 S76 43 82 53 M18 28 C28 43 23 62 28 73 M28 73 C41 84 53 79 62 76 S74 68 82 53 M43 18 C52 35 58 44 62 76 M69 27 C66 43 67 57 62 76" /></svg>
      <div className="map-core"><span>SN</span><small>DATA<br />FIELD</small></div>
      {skills.map((skill) => <button key={skill.id} className={`skill-node ${active === skill.id ? 'is-active' : ''}`} style={{ left: `${skill.x}%`, top: `${skill.y}%` }} onClick={() => setActive(active === skill.id ? null : skill.id)}><span className="node-pip" /><strong>{skill.label}</strong><small>{skill.category}</small></button>)}
      <div className="map-projects">{activeProjects.map((project) => <a key={project.id} href={project.github} target="_blank" rel="noreferrer"><span style={{ background: project.accent }} />{project.name}<ArrowUpRight size={13} /></a>)}</div>
    </div>
  </section>
}

function ProjectVisual({ project }) {
  return <div className="project-visual" style={{ '--project-accent': project.accent }}><div className="visual-grid" /><div className="visual-frame"><span className="visual-kicker">{project.signal}</span>{project.id === 'iris' && <div className="iris-visual"><b>0.96</b><span>confidence</span><div className="iris-bars"><i /><i /><i /><i /><i /></div></div>}{project.id === 'cipher-cli' && <div className="terminal-visual"><span>$ cipher --inspect</span><b>message → encoded</b><span className="terminal-caret">_</span></div>}{project.id === 'eda' && <div className="chart-visual"><div className="chart-line" /><span>performance / pattern</span></div>}{project.id === 'crawler' && <div className="crawler-visual"><div className="crawler-center">WEB</div><i /><i /><i /><i /></div>}</div><div className="visual-stamp">{project.index} / BUILD</div></div>
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
      const tween = gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.9}`, scrub: 1, pin: true, invalidateOnRefresh: true } })
      return () => tween.kill()
    })
    return () => mm.revert()
  }, [])
  return <section className="projects-scene" id="work" ref={sectionRef}><div className="projects-head"><div><span>03 / SELECTED BUILDS</span><h2>Work that<br /><em>moves.</em></h2></div><p>Scroll sideways through the lab.<br />Hover a panel. Open the source.</p></div><div className="project-track" ref={trackRef}>{projects.map((project) => <article className="project-panel" key={project.id}><div className="project-panel-top"><span>{project.index} / {project.type}</span><a href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}><GitBranch size={17} /></a></div><ProjectVisual project={project} /><div className="project-panel-copy"><h3>{project.name}</h3><p>{project.description}</p><div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><a href={project.github} target="_blank" rel="noreferrer" className="project-open">Open repository <ArrowUpRight size={15} /></a></div></article>)}</div><div className="projects-footer"><span>DRAG / SCROLL</span><div className="rail"><i /></div><span>04 / 04</span></div></section>
}

function Journey() {
  const [active, setActive] = useState(0)
  return <section className="journey scene" id="journey"><div className="scene-label"><span>04 / TRAJECTORY</span><span>The work is still becoming.</span></div><div className="journey-layout"><div className="journey-title"><p className="eyebrow">A MOVING TARGET</p><h2 data-reveal>Next<br /><em>chapter.</em></h2><p>Curiosity is a direction, not a finished label. Here’s the path I’m on.</p></div><div className="journey-list">{journey.map((item, index) => <button className={active === index ? 'journey-item is-active' : 'journey-item'} key={item.year} onClick={() => setActive(index)}><span className="journey-year">{item.year}</span><span className="journey-name">{item.label}</span><ArrowUpRight size={16} /><span className="journey-detail">{item.detail}</span></button>)}</div></div></section>
}

function Contact() {
  return <section className="contact-scene" id="contact"><div className="contact-grid" /><div className="contact-top"><span>05 / CONTACT</span><span>LET’S FIND THE NEXT SIGNAL</span></div><div className="contact-main"><p className="eyebrow"><span className="pulse" />OPEN TO OPPORTUNITIES</p><h2>Have a<br /><em>question?</em></h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={22} /></a><p className="contact-note">For internships, entry-level roles, collaborations, or an interesting problem worth unpacking.</p></div><div className="contact-bottom"><div className="socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div><a className="back-top" href="#top">Return to top <RotateCcw size={14} /></a><span>© 2026 / SUYASH NARAWADE</span></div></section>
}

function App() {
  const rootRef = useRef(null)
  const [commandOpen, setCommandOpen] = useState(false)
  useEffect(() => { const cleanup = createSmoothScroll(); return cleanup }, [])
  useLayoutEffect(() => { const context = gsap.context(() => { splitReveal(rootRef.current); gsap.from('.hero-word', { yPercent: 120, opacity: 0, rotate: 3, stagger: 0.08, duration: 1.2, ease: 'power4.out', delay: 0.1 }); gsap.from('.hero-console', { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.35 }); gsap.to('.hero-console', { y: -80, rotate: -3, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }); gsap.to('.hero-copy', { y: 90, opacity: 0.25, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }); gsap.to('.marquee-track', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } }); }, rootRef); return () => context.revert() }, [])
  return <div className="app-shell" ref={rootRef}><Cursor /><Header onCommand={() => setCommandOpen(true)} /><CommandPalette open={commandOpen} onClose={setCommandOpen} /><main><Hero /><Marquee /><About /><SkillMap /><Projects /><Journey /><Contact /></main></div>
}

const root = globalThis.__suyashPortfolioRoot ?? (globalThis.__suyashPortfolioRoot = createRoot(document.getElementById('root')))
root.render(<React.StrictMode><App /></React.StrictMode>)
