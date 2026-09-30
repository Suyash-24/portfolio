import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, BriefcaseBusiness, Check, Command, Download, Mail, Search, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const EMAIL = 'iamnarawadesuyash@gmail.com';
const projects = [
  { number: '01', title: 'IRIS', type: 'AI / HCI', description: 'A multimodal interaction system combining eye tracking, hand gestures, voice commands, authentication, and an AI decision layer.', stack: ['Python', 'PyQt6', 'MediaPipe', 'OpenCV'], href: 'https://github.com/Suyash-24/IRIS', tone: 'cyan', visual: 'iris' },
  { number: '02', title: 'Cipher CLI', type: 'SECURITY TOOL', description: 'A command-line experiment for understanding encryption, text transformation, and secure workflows through a hands-on interface.', stack: ['Python', 'CLI', 'Cryptography'], href: 'https://github.com/Suyash-24/Cipher-Cli', tone: 'violet', visual: 'cipher' },
  { number: '03', title: 'Student Performance EDA', type: 'DATA INVESTIGATION', description: 'Exploring student outcomes through cleaning, visualization, and statistical curiosity — turning observations into a readable story.', stack: ['Pandas', 'Matplotlib', 'Statistics'], href: 'https://github.com/Suyash-24/student-performance-eda', tone: 'lime', visual: 'chart' },
  { number: '04', title: 'WebCrawler', type: 'AUTOMATION', description: 'An automation experiment that follows links, collects pages, and turns the open web into a structured trail of information.', stack: ['Python', 'Requests', 'Automation'], href: 'https://github.com/Suyash-24/WebCrawler', tone: 'orange', visual: 'crawler' },
];

const skills = ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Statistics', 'Data Visualization', 'Git / GitHub', 'Backend Logic', 'Automation'];

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } });
      });
      gsap.to('.hero-orbit', { yPercent: 10, rotation: 14, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: true, start: 'top top', end: 'bottom top' } });
      gsap.to('.hero-word', { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: true, start: 'top top', end: 'bottom top' } });
      gsap.to('.marquee-track', { xPercent: -20, ease: 'none', scrollTrigger: { trigger: '.marquee', scrub: 1 } });
      gsap.utils.toArray('.project-card').forEach((card, index) => gsap.fromTo(card, { rotate: index % 2 ? 2 : -2 }, { rotate: 0, scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 55%', scrub: true } }));
    }, appRef);

    const keydown = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPaletteOpen(true); } if (event.key === 'Escape') setPaletteOpen(false); };
    window.addEventListener('keydown', keydown);
    return () => { window.removeEventListener('keydown', keydown); ctx.revert(); gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);

  const copyEmail = async () => { await navigator.clipboard?.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  const commands = useMemo(() => [
    { label: 'Selected work', hint: 'Explore projects and systems', href: '#work' },
    { label: 'About Suyash', hint: 'Read the short version', href: '#about' },
    { label: 'Skills lab', hint: 'See the working toolkit', href: '#skills' },
    { label: 'Download resume', hint: 'Open the latest PDF', href: './Suyash_resumee.pdf', download: true },
    { label: 'Say hello', hint: EMAIL, href: `mailto:${EMAIL}` },
  ].filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return <div ref={appRef} className="site-shell">
    <div className="grain" aria-hidden="true" />
    <Cursor />
    <div className="scroll-progress" />
    <Header onCommand={() => setPaletteOpen(true)} />
    <CommandPalette open={paletteOpen} query={query} setQuery={setQuery} commands={commands} onClose={() => { setPaletteOpen(false); setQuery(''); }} />
    <main>
      <Hero />
      <KineticMarquee />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Contact copied={copied} onCopy={copyEmail} />
    </main>
    <footer className="footer mono"><span>SUYASH NARAWADE / COMPUTER ENGINEERING</span><span>BUILT WITH INTENT <Sparkles size={12} /></span></footer>
  </div>;
}

function Header({ onCommand }) { return <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">SN</span><span>SUYASH / 24</span></a><nav><a href="#about">About</a><a href="#skills">Skills</a><a href="#work">Work</a><a href="#contact">Contact</a></nav><div className="header-actions"><button className="command-trigger" onClick={onCommand}><Command size={13} /><span>COMMAND</span><kbd>K</kbd></button><a className="availability" href="#contact"><span /> Open to opportunities</a></div></header>; }

function Cursor() { useEffect(() => { const node = document.querySelector('.cursor'); const move = (event) => { node?.style.setProperty('--x', `${event.clientX}px`); node?.style.setProperty('--y', `${event.clientY}px`); }; window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move); }, []); return <div className="cursor" aria-hidden="true"><span /></div>; }

function CommandPalette({ open, query, setQuery, commands, onClose }) { return <div className={`command-layer ${open ? 'is-open' : ''}`} aria-hidden={!open}><div className="command-backdrop" onClick={onClose} /><section className="command-panel" role="dialog" aria-modal="true" aria-label="Command palette"><div className="command-head"><span className="mono">NAVIGATE / DO SOMETHING</span><button onClick={onClose}>ESC</button></div><label className="command-input"><Search size={17} /><input autoFocus={open} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the portfolio..." /></label><div className="command-list">{commands.map((command) => <a key={command.label} href={command.href} download={command.download} onClick={onClose}><span className="command-number mono">{command.label.slice(0, 2).toUpperCase()}</span><span><b>{command.label}</b><small>{command.hint}</small></span><ArrowUpRight size={15} /></a>)}{!commands.length && <p className="empty-command">No match. Try “work”, “skills”, or “resume”.</p>}</div><div className="command-foot mono">TIP / PRESS <b>CTRL K</b> ANYTIME <span>ESC TO CLOSE</span></div></section></div>; }

function Hero() { return <section className="hero section" id="top"><div className="hero-grid" /><div className="hero-top mono"><span>COMPUTER ENGINEERING STUDENT</span><span>PUNE, INDIA / 2026</span></div><div className="hero-content"><p className="eyebrow mono"><i /> DATA SCIENCE / MACHINE LEARNING / PYTHON</p><h1><span className="hero-word">Find</span><span className="serif">the</span><span className="stroke hero-word">signal.</span></h1><p className="hero-deck">I am Suyash Narawade — learning to turn complex questions into clear, useful systems.</p><div className="hero-actions"><a className="primary-button magnetic" href="#work">Explore work <ArrowUpRight size={16} /></a><a className="secondary-button magnetic" href="./Suyash_resumee.pdf" download><Download size={15} /> Resume</a></div></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core">SN</div><span className="orbit-tag tag-one mono">BUILD / 01</span><span className="orbit-tag tag-two mono">LEARN / 02</span><span className="orbit-tag tag-three mono">SHARE / 03</span></div><div className="hero-bottom mono"><span>SCROLL TO EXPLORE</span><span className="scroll-arrow">&#8595;</span><span>001 / 006</span></div></section>; }

function KineticMarquee() { return <div className="marquee" aria-hidden="true"><div className="marquee-track">PYTHON <i>/</i> DATA SCIENCE <i>/</i> MACHINE LEARNING <i>/</i> MATHEMATICS <i>/</i> STATISTICS <i>/</i> ANALYTICS <i>/</i> PYTHON <i>/</i> DATA SCIENCE <i>/</i> MACHINE LEARNING <i>/</i> STATISTICS <i>/</i></div></div>; }

function About() { return <section className="about section" id="about"><SectionLabel number="01" text="PROFILE" note="A little context before the work." /><div className="about-grid reveal"><div className="about-title"><span>Curious</span><span className="serif">by</span><span>default.</span></div><div className="about-copy"><p className="lead">Computer Engineering student with a strong interest in Data Science and Machine Learning.</p><p>Currently learning Python, data analysis, and foundational ML concepts. I have hands-on experience with programming, backend logic, and automation through personal projects.</p><p>Interested in applying data-driven approaches to solve real-world problems. Actively seeking internships and entry-level opportunities in Data Science, Analytics, or related roles.</p><a className="text-link" href="./Suyash_resumee.pdf" download>Download resume <ArrowUpRight size={17} /></a></div></div><div className="identity-strip reveal"><Identity label="ROLE" value="Student / Builder" /><Identity label="FOCUS" value="Data + ML + Systems" /><Identity label="STACK" value="Python / SQL / Git" /><Identity label="OPEN TO" value="Internships / Entry-level" /></div></section>; }
function Identity({ label, value }) { return <div><span className="mono">{label}</span><strong><i />{value}</strong></div>; }
function SectionLabel({ number, text, note }) { return <div className="section-label"><span className="mono label-number">{number} / {text}</span><span className="section-rule" /><span>{note}</span></div>; }

function Skills() { const [active, setActive] = useState(null); return <section className="skills section" id="skills"><SectionLabel number="02" text="SKILLS LAB" note="The tools behind the thinking." /><div className="skills-head"><div><p className="eyebrow mono">SELECT AN AREA</p><h2>Learned<br /><span className="serif">in layers.</span></h2></div><p>Hover a skill to see how it fits into the larger system. The strongest tool is still curiosity.</p></div><div className="skill-grid">{skills.map((skill, index) => <button className={`skill-card ${active === index ? 'active' : ''}`} key={skill} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}><span className="skill-index mono">0{index + 1}</span><span className="skill-name">{skill}</span><span className="skill-dot" /></button>)}</div><div className="skill-detail" aria-live="polite"><span className="mono">CURRENTLY EXPLORING</span><strong>{active === null ? 'Data-driven systems with a human edge.' : skills[active]}</strong><span className="mono">{active === null ? 'HOVER THE CARDS' : 'ACTIVE TOOL / PERSONAL LAB'}</span></div></section>; }

function Projects() { return <section className="projects section" id="work"><SectionLabel number="03" text="PROJECT SHOWCASE" note="Ideas made tangible." /><div className="projects-heading"><h2>Built, tested,<br /><span className="serif">learned from.</span></h2><p>Projects across automation, data analysis, intelligent interfaces, and the strange space where code meets curiosity.</p></div><div className="project-list">{projects.map((project) => <ProjectCard project={project} key={project.title} />)}</div></section>; }
function ProjectCard({ project }) { return <article className={`project-card ${project.tone} reveal`}><div className="project-visual"><div className="visual-meta mono"><span>{project.number} / {project.type}</span><span>{project.stack[0]} / LAB</span></div><ProjectVisual type={project.visual} /><a href={project.href} target="_blank" rel="noreferrer" className="project-open magnetic">Open project <ArrowUpRight size={15} /></a></div><div className="project-copy"><span className="mono project-number">{project.number}</span><h3>{project.title}</h3><p>{project.description}</p><div className="chips">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div></article>; }
function ProjectVisual({ type }) { if (type === 'iris') return <div className="iris-visual"><div className="iris-scanner" /><strong>IRIS</strong><span className="visual-stat stat-a mono">VOICE / 36</span><span className="visual-stat stat-b mono">GAZE / 01</span><span className="visual-stat stat-c mono">GESTURE / 08</span></div>; if (type === 'cipher') return <div className="cipher-visual"><span className="cipher-mark">&#9670;</span><div className="cipher-lines mono"><span>INPUT // hello world</span><span>KEY // 0xS24</span><span>OUTPUT // 8f4c...d91</span></div></div>; if (type === 'chart') return <div className="chart-visual"><span className="mono chart-title">STUDENT PERFORMANCE / SIGNALS</span><div className="bars">{[35,61,46,84,55,76,93].map((height) => <i key={height} style={{ height: `${height}%` }} />)}</div><span className="chart-line" /></div>; return <div className="crawler-visual"><div className="crawler-nodes"><i /><i /><i /><i /><i /></div><strong>CRAWL<span>.</span></strong><span className="mono">PAGES INDEXED / 042</span></div>; }

function Journey() { return <section className="journey section"><SectionLabel number="04" text="JOURNEY" note="The next chapter is still being written." /><div className="journey-grid"><div className="journey-intro"><h2>Keep going<br /><span className="serif">forward.</span></h2><p>Every project is a small proof that learning compounds when it is made visible.</p></div><div className="timeline"><TimelineItem year="NOW" title="Computer Engineering" detail="Building a foundation across Python, analytics, machine learning, mathematics, and statistics." /><TimelineItem year="LAB" title="Personal projects" detail="IRIS, Cipher CLI, WebCrawler, Student Performance EDA, Ares, and more experiments in progress." /><TimelineItem year="NEXT" title="Internship / entry-level" detail="Looking for a team where thoughtful questions, useful systems, and steady learning matter." /></div></div></section>; }
function TimelineItem({ year, title, detail }) { return <article className="timeline-item reveal"><span className="mono">{year}</span><div><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight size={18} /></article>; }

function Contact({ copied, onCopy }) { return <section className="contact section" id="contact"><div className="contact-grid" /><SectionLabel number="05" text="CONTACT" note="Start a conversation." /><div className="contact-content"><p className="eyebrow mono">DATA / ML / ANALYTICS / OPPORTUNITIES</p><h2>Let’s build<br /><span className="serif">the next thing.</span></h2><div className="contact-actions"><a className="email-link magnetic" href={`mailto:${EMAIL}`}><Mail size={18} />{EMAIL}<ArrowUpRight size={19} /></a><button className="copy-button magnetic" onClick={onCopy}>{copied ? <Check size={16} /> : <span>Copy email</span>}{copied && 'Copied'}</button></div><div className="contact-meta mono"><span>PUNE, INDIA / HE-HIM</span><a href="https://github.com/Suyash-24" target="_blank" rel="noreferrer"><BriefcaseBusiness size={13} /> GitHub</a><a href="https://www.linkedin.com/in/suyashnarawade/" target="_blank" rel="noreferrer"><BriefcaseBusiness size={13} /> LinkedIn</a></div></div></section>; }

createRoot(document.getElementById('root')).render(<App />);
