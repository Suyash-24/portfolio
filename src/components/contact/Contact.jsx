import { useState } from 'react'
import { motion } from 'motion/react'
import { profile } from '../../data/portfolio'

// ──────────────────────────────────────────────────────────────────────────────
// CONTACT — Gertix dark footer style:
//  • Dark (#0c0d10) background
//  • Green matrix ASCII art background
//  • Large email display
//  • Copy-to-clipboard button
//  • 4-column footer grid (Bermawy)
//  • Bottom copyright bar
// ──────────────────────────────────────────────────────────────────────────────

// ASCII matrix art — Gertix footer style
const MATRIX = `010101010001010010110101001010010101001010010101001001010010101001010
101010010101001011010100101001010100101001010100100101001010100101010
001010100101010010110101001010010101001010010101001001010010101001010
010100101010010110101001010010101001010010101001001010010101001010100`

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <section id="contact" className="contact-section" data-section="contact">

      {/* Matrix background — Gertix footer */}
      <div className="contact-matrix" aria-hidden="true">{MATRIX}</div>

      {/* Section header */}
      <div className="contact-head reveal">
        <span className="section-label">get in touch_</span>
        <span className="section-meta">Contact / 04</span>
      </div>

      {/* Lead */}
      <div className="reveal">
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: '1.8',
          color: 'rgba(235,235,235,0.55)',
          maxWidth: '52ch',
          marginBottom: '0',
        }}>
          I'm actively looking for internships and entry-level opportunities
          in Data Science, Analytics, and ML. If you have a role or project
          that fits — I'd love to hear from you.
        </p>

        <div className="contact-email-display">{profile.email}</div>

        <motion.button
          className="contact-copy-btn"
          onClick={handleCopy}
          aria-label="Copy email address"
          whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {copied ? '✓ COPIED' : '[ COPY EMAIL ]'}
        </motion.button>
      </div>

      {/* Direct links — split CTAs */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }} className="reveal reveal-delay-1">
        <motion.div 
          className="hero-cta-group"
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <a
            href={`mailto:${profile.email}`}
            className="btn-label dark"
            style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
          >
            SEND EMAIL
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="btn-arrow dark"
            aria-label="Send email"
          >
            →
          </a>
        </motion.div>

        <motion.div 
          className="hero-cta-group"
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-label dark"
            style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
          >
            LINKEDIN
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-arrow dark"
            aria-label="LinkedIn"
          >
            ↗
          </a>
        </motion.div>

        <motion.div 
          className="hero-cta-group"
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-label dark"
            style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
          >
            GITHUB
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-arrow dark"
            aria-label="GitHub"
          >
            ↗
          </a>
        </motion.div>
      </div>

      {/* 4-column footer grid — Bermawy */}
      <div className="footer-grid reveal reveal-delay-2">
        <div>
          <div className="footer-col-title">Navigation</div>
          <ul className="footer-col-links">
            {['about', 'work', 'journey', 'contact'].map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Connect</div>
          <ul className="footer-col-links">
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href={`mailto:${profile.email}`}>Email</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Projects</div>
          <ul className="footer-col-links">
            <li><a href="https://github.com/Suyash-24/IRIS" target="_blank" rel="noopener noreferrer">IRIS Classifier</a></li>
            <li><a href="https://github.com/Suyash-24/Cipher-Cli" target="_blank" rel="noopener noreferrer">Cipher CLI</a></li>
            <li><a href="https://github.com/Suyash-24/student-performance-eda" target="_blank" rel="noopener noreferrer">Student EDA</a></li>
            <li><a href="https://github.com/Suyash-24/WebCrawler" target="_blank" rel="noopener noreferrer">WebCrawler</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Location</div>
          <ul className="footer-col-links">
            <li><a href="#">Pune, Maharashtra</a></li>
            <li><a href="#">India · 18°31′N</a></li>
            <li style={{ marginTop: '1rem' }}>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                Download Résumé ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="footer-copy reveal">
        <span className="footer-copy-text">
          © {new Date().getFullYear()} Suyash Narawade. All rights reserved.
        </span>
        <span className="footer-copy-brand">
          SUYASH NARAWADE · PORTFOLIO
        </span>
      </div>

    </section>
  )
}
