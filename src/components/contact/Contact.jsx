import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../../data/portfolio'

export default function Contact() {
  const sectionRef = useRef(null)
  const fieldRef = useRef(null)
  const emailRef = useRef(null)
  const nearRef = useRef(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const field = fieldRef.current
    if (!section || !field || window.matchMedia('(pointer: coarse)').matches) return

    const moveX = gsap.quickTo(field, 'x', { duration: 0.7, ease: 'power3.out' })
    const moveY = gsap.quickTo(field, 'y', { duration: 0.7, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      moveX(e.clientX - rect.left - rect.width / 2)
      moveY(e.clientY - rect.top - rect.height / 2)

      const emailEl = emailRef.current?.getBoundingClientRect()
      if (emailEl) {
        const dist = Math.hypot(
          e.clientX - (emailEl.left + emailEl.width / 2),
          e.clientY - (emailEl.top + emailEl.height / 2)
        )
        const isNear = dist < 280
        if (nearRef.current !== isNear) {
          nearRef.current = isNear
          setNear(isNear)
        }
      }
    }

    const onLeave = () => {
      nearRef.current = false
      setNear(false)
      moveX(0)
      moveY(0)
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section
      className={`contact ${near ? 'contact--near' : ''}`}
      id="contact"
      data-section="contact"
      ref={sectionRef}
      aria-label="Contact"
    >
      {/* Background grid */}
      <div className="contact__grid" aria-hidden="true" />
      {/* Cursor field glow */}
      <div className="contact__field" ref={fieldRef} aria-hidden="true" />

      <div className="contact__top">
        <span>05 / CONTACT</span>
        <span>LET'S FIND THE NEXT SIGNAL</span>
      </div>

      <div className="contact__main">
        <p className="eyebrow contact__eyebrow">
          <span className="contact__dot" aria-hidden="true" />
          OPEN TO OPPORTUNITIES
        </p>

        <h2 className="contact__h2">
          Have a<br />
          <em>question?</em>
        </h2>

        <a
          className="contact__email"
          href={`mailto:${profile.email}`}
          ref={emailRef}
          data-cursor="email"
          aria-label={`Send email to ${profile.email}`}
          onMouseEnter={() => setNear(true)}
          onMouseLeave={() => setNear(false)}
          onFocus={() => setNear(true)}
          onBlur={() => setNear(false)}
        >
          <span className="contact__email-text">{profile.email}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>

        <p className="contact__note">
          For internships, entry-level roles, collaborations,
          or an interesting problem worth unpacking.
        </p>
      </div>

      <div className="contact__footer">
        <div className="contact__socials">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            aria-label="GitHub profile"
          >
            GitHub
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            aria-label="LinkedIn profile"
          >
            LinkedIn
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>
        <a
          href="#top"
          className="contact__back"
          data-cursor="link"
          aria-label="Return to top of page"
        >
          Return to top
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
          </svg>
        </a>
        <span className="contact__copy">© 2026 / SUYASH NARAWADE</span>
      </div>
    </section>
  )
}
