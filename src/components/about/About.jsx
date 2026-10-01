import { useState } from 'react'
import { bio, profile } from '../../data/portfolio'

const CONCEPT_DATA = {
  Python: {
    visual: 'code',
    content: 'def build():\n  return signal',
    color: 'var(--acid)',
  },
  Data: {
    visual: 'bars',
    content: [46, 72, 58, 86, 65],
    color: 'var(--acid)',
  },
  'Machine Learning': {
    visual: 'flow',
    content: 'input → model → insight',
    color: 'var(--coral)',
  },
  Automation: {
    visual: 'flow',
    content: 'fetch → parse → repeat',
    color: 'var(--acid)',
  },
  Building: {
    visual: 'blocks',
    content: null,
    color: 'var(--coral)',
  },
}

function ConceptArtifact({ concept }) {
  const data = CONCEPT_DATA[concept]
  if (!data) return null
  return (
    <span className="about__artifact" style={{ '--artifact-color': data.color }}>
      {data.visual === 'code' && <code className="about__artifact-code">{data.content}</code>}
      {data.visual === 'bars' && (
        <span className="about__artifact-bars" aria-hidden="true">
          {data.content.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </span>
      )}
      {data.visual === 'flow' && <span className="about__artifact-flow">{data.content}</span>}
      {data.visual === 'blocks' && (
        <span className="about__artifact-blocks" aria-hidden="true">
          <i /><i /><i />
        </span>
      )}
    </span>
  )
}

function Concept({ label }) {
  const [active, setActive] = useState(false)
  return (
    <button
      className={`about__concept ${active ? 'about__concept--active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      aria-label={`Explore ${label}`}
    >
      <span>{label}</span>
      {active && <ConceptArtifact concept={label} />}
    </button>
  )
}

export default function About() {
  return (
    <section className="about scene" id="about" data-section="about" aria-label="About Suyash">
      <div className="scene__label">
        <span>01 / PROFILE</span>
        <span>A little context before the work.</span>
      </div>

      <div className="about__layout">
        {/* Left column — heading */}
        <div className="about__heading">
          <p className="eyebrow">THE HUMAN VARIABLE</p>
          <h2 className="about__h2">
            Curious<br />
            <em>by default.</em>
          </h2>
          <div className="about__index" aria-hidden="true">[ 01—05 ]</div>
        </div>

        {/* Right column — copy */}
        <div className="about__copy">
          <p className="about__lead">{bio.lead}</p>
          {bio.paragraphs.map((p, i) => <p key={i}>{p}</p>)}

          <p className="about__concepts-line">
            Currently orbiting{' '}
            {bio.concepts.map((c, i) => (
              <span key={c}>
                <Concept label={c} />
                {i < bio.concepts.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>

          <a className="about__resume" href={profile.resume} download aria-label="Download resume PDF">
            Download resume
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Identity row */}
      <div className="about__identity" role="list">
        {[
          { label: 'ROLE', value: 'Student / Builder' },
          { label: 'FOCUS', value: 'Data + ML + Systems' },
          { label: 'STACK', value: 'Python / Git / SQL' },
          { label: 'OPEN TO', value: 'Internships · Entry-level' },
        ].map(({ label, value }) => (
          <div key={label} className="about__identity-item" role="listitem">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
