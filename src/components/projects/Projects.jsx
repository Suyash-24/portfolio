import { projects } from '../../data/portfolio'
import ProjectVisual from './ProjectVisual'

// ──────────────────────────────────────────────────────────────────────────────
// PROJECTS — Gertix.studio dossier card layout:
//  • Alternating section background (section-alt)
//  • Each project: 2-column grid [left: index + title + tags + desc + CTA]
//                                 [right: dashed-border image frame]
//  • Numbered "01 / 02 / 03 / 04" index labels (Gertix exact)
//  • Pill tags (rounded oval, Gertix)
//  • Split [GITHUB][→] CTA buttons
//  • Dashed image border frame
//  • Metrics table inside card
// ──────────────────────────────────────────────────────────────────────────────
export default function Projects() {
  return (
    <section id="work" className="section section-alt" data-section="work">

      {/* Section header */}
      <div className="section-head reveal">
        <span className="section-label">in the works_</span>
        <span className="section-meta">Selected Projects / 02</span>
      </div>

      {/* Project list */}
      <div>
        {projects.map((p) => (
          <article key={p.id} className="project-card reveal">

            {/* LEFT: Info */}
            <div className="project-card-left">
              <div className="project-index">— {p.index}</div>
              <h2 className="project-title">{p.name}</h2>

              {/* Pill tags */}
              <div className="project-tags">
                <div className="tag-group">
                  {p.stack.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              <p className="project-desc">{p.description}</p>

              {/* Metrics — Bermawy table ledger style */}
              <div className="project-metrics">
                {p.metrics.map((m) => (
                  <div key={m.label} className="project-metric-row">
                    <span className="project-metric-key">{m.label}</span>
                    <span className="project-metric-val">{m.val}</span>
                  </div>
                ))}
              </div>

              {/* Split CTA — Gertix [GITHUB][→] */}
              <div className="hero-cta-group">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-label"
                  style={{ display: 'inline-block' }}
                >
                  VIEW ON GITHUB
                </a>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-arrow"
                  aria-label={`Open ${p.name} on GitHub`}
                >
                  ↗
                </a>
              </div>
            </div>

            {/* RIGHT: Dashed image frame — Gertix exact */}
            <div>
              <div className="project-img-frame" style={{ position: 'relative', overflow: 'hidden' }}>
                <ProjectVisual id={p.id} />
                
                {/* Overlay UI elements on top of the visual */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  pointerEvents: 'none',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-ghost)',
                    background: 'rgba(235, 235, 235, 0.8)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {p.signal}
                  </span>

                  <div className="tag-group" style={{ justifyContent: 'center' }}>
                    {p.stack.slice(0, 3).map((t) => (
                      <span key={t} className="tag" style={{ background: 'rgba(235,235,235,0.8)', backdropFilter: 'blur(4px)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project tagline below frame */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--text-ghost)',
                letterSpacing: '0.08em',
                marginTop: '1rem',
                fontStyle: 'italic',
              }}>
                {p.tagline}
              </div>
            </div>

          </article>
        ))}
      </div>

    </section>
  )
}
