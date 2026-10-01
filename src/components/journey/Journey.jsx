import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Vertical fill line
      gsap.fromTo(
        '.journey__line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      )

      // Each step slides in
      gsap.utils.toArray('.journey__step').forEach((step, i) => {
        gsap.fromTo(
          step,
          { x: 44, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 82%',
              end: 'top 58%',
              scrub: false,
              once: true,
            },
          }
        )
      })

      // Chapter numbers count in
      gsap.utils.toArray('.journey__chapter').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      className="journey scene"
      id="journey"
      data-section="journey"
      ref={sectionRef}
      aria-label="Career trajectory"
    >
      <div className="scene__label">
        <span>04 / TRAJECTORY</span>
        <span>The work is still becoming.</span>
      </div>

      <div className="journey__layout">
        {/* Left column: title */}
        <div className="journey__title-col">
          <p className="eyebrow">A MOVING TARGET</p>
          <h2 className="journey__h2">
            Next<br />
            <em>chapter.</em>
          </h2>
          <p className="journey__sub">
            Curiosity is a direction, not a finished label.
            Here's the path I'm on.
          </p>

          {/* Current phase indicator */}
          <div className="journey__now-badge">
            <span className="journey__now-dot" aria-hidden="true" />
            <span>ACTIVELY BUILDING</span>
          </div>
        </div>

        {/* Right column: timeline */}
        <div className="journey__timeline">
          {/* Vertical line */}
          <div className="journey__line-track" aria-hidden="true">
            <div className="journey__line-fill" />
          </div>

          {/* Steps */}
          <div className="journey__steps">
            {journey.map((item, i) => (
              <article key={item.year} className="journey__step" aria-label={`${item.year}: ${item.label}`}>
                {/* Dot */}
                <div className={`journey__dot ${item.year === 'NOW' ? 'journey__dot--now' : ''}`} aria-hidden="true">
                  <span className="journey__chapter">{item.chapter}</span>
                </div>

                <div className="journey__step-body">
                  <div className="journey__step-head">
                    <time className="journey__year" dateTime={item.year === 'NOW' ? '2026' : item.year}>
                      {item.year}
                    </time>
                    <span className="journey__phase">{item.phase}</span>
                  </div>
                  <h3 className="journey__label">{item.label}</h3>
                  <p className="journey__detail">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
