import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// IRIS: Gaze tracking demo — cursor acts as gaze point
export function GazeDemo() {
  const [gaze, setGaze] = useState({ x: 50, y: 45 })
  const demoRef = useRef(null)

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const rect = demoRef.current?.getBoundingClientRect()
    if (!rect) return
    setGaze({
      x: Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(10, Math.min(88, ((e.clientY - rect.top) / rect.height) * 100)),
    })
  }

  return (
    <div
      ref={demoRef}
      className="demo demo--iris"
      style={{ '--gx': `${gaze.x}%`, '--gy': `${gaze.y}%` }}
      onPointerMove={onMove}
      onPointerLeave={() => setGaze({ x: 50, y: 45 })}
      data-cursor="explore"
      aria-label="Interactive gaze tracking demo — move mouse to control gaze point"
    >
      {/* Camera frame */}
      <div className="demo__camera-frame">
        <span className="demo__cam-label">CAMERA / INPUT</span>
        {/* Face outline */}
        <div className="demo__face" />
        {/* Eye tracking reticle follows gaze */}
        <div className="demo__reticle" />
        <div className="demo__gaze-dot" />
        {/* Crosshair lines */}
        <div className="demo__crosshair-h" />
        <div className="demo__crosshair-v" />
      </div>
      {/* UI representation */}
      <div className="demo__ui-panels">
        <div className="demo__ui-panel" />
        <div className="demo__ui-panel demo__ui-panel--active" />
        <div className="demo__ui-panel" />
      </div>
      <div className="demo__hint">MOVE TO TRACE GAZE</div>
      {/* Scan line effect */}
      <div className="demo__scan" aria-hidden="true" />
    </div>
  )
}

// CIPHER CLI: Terminal animation
export function CipherDemo() {
  const reduced = useReducedMotion()
  const lines = [
    { text: '$ cipher --mode inspect', type: 'cmd' },
    { text: '> loading engine...', type: 'log' },
    { text: '> transformation: CAESAR', type: 'info' },
    { text: '> OUTPUT: encrypted ✓', type: 'success' },
  ]
  const [visible, setVisible] = useState(1)

  useEffect(() => {
    if (reduced) { setVisible(lines.length); return }
    const interval = setInterval(() => {
      setVisible((v) => (v >= lines.length ? 1 : v + 1))
    }, 1200)
    return () => clearInterval(interval)
  }, [reduced, lines.length])

  return (
    <div className="demo demo--cipher" aria-label="Cipher CLI terminal demo">
      <div className="demo__term-bar">
        <span className="demo__term-title">cipher_cli v1.0</span>
        <span className="demo__term-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
      </div>
      <div className="demo__term-body">
        {lines.slice(0, visible).map((line, i) => (
          <div
            key={line.text}
            className={`demo__term-line demo__term-line--${line.type} ${i === visible - 1 ? 'demo__term-line--typing' : ''}`}
          >
            {line.text}
          </div>
        ))}
        <span className="demo__term-caret" aria-hidden="true">_</span>
      </div>
      <div className="demo__scan" aria-hidden="true" />
    </div>
  )
}

// EDA: Data visualization demo
export function EdaDemo() {
  const bars = [
    { h: 46, label: 'Math' },
    { h: 72, label: 'Science' },
    { h: 58, label: 'English' },
    { h: 86, label: 'Reading' },
    { h: 65, label: 'Writing' },
    { h: 78, label: 'Overall' },
  ]
  const [focused, setFocused] = useState(-1)

  const track = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const idx = Math.max(0, Math.min(bars.length - 1, Math.floor(((e.clientX - rect.left) / rect.width) * bars.length)))
    setFocused(idx)
  }

  return (
    <div
      className="demo demo--eda"
      onPointerMove={track}
      onPointerLeave={() => setFocused(-1)}
      data-cursor="explore"
      aria-label="Interactive bar chart demo — student performance distribution"
    >
      <div className="demo__eda-labels" aria-hidden="true">
        <span>distribution</span>
        <span>n=6 subjects</span>
      </div>
      <div className="demo__eda-chart">
        {bars.map((bar, i) => (
          <div key={bar.label} className="demo__eda-col">
            <div
              className={`demo__eda-bar ${focused === i ? 'demo__eda-bar--active' : ''}`}
              style={{ height: `${bar.h}%` }}
              role="img"
              aria-label={`${bar.label}: ${bar.h}`}
            />
            <span className="demo__eda-sublabel">{focused === i ? bar.h : bar.label}</span>
          </div>
        ))}
      </div>
      <div className="demo__eda-axis" aria-hidden="true">
        <div className="demo__eda-baseline" />
        <div className="demo__eda-vline" />
      </div>
      <div className="demo__hint">{focused < 0 ? 'HOVER TO EXPLORE' : `SUBJECT / 0${focused + 1}`}</div>
    </div>
  )
}

// WEBCRAWLER: Graph exploration demo
export function CrawlerDemo() {
  const reduced = useReducedMotion()
  const nodes = [
    { x: 50, y: 46, label: 'root', root: true },
    { x: 22, y: 20, label: '/about' },
    { x: 78, y: 22, label: '/data' },
    { x: 18, y: 74, label: '/work' },
    { x: 80, y: 75, label: '/next' },
  ]
  const [found, setFound] = useState(1)

  useEffect(() => {
    if (reduced) { setFound(nodes.length); return }
    const t = setInterval(() => setFound((v) => (v >= nodes.length ? 1 : v + 1)), 1100)
    return () => clearInterval(t)
  }, [reduced, nodes.length])

  return (
    <div className="demo demo--crawler" aria-label="Web crawler graph demo showing discovered pages">
      <svg className="demo__crawler-svg" viewBox="0 0 100 100" aria-hidden="true">
        {nodes.slice(1).map((node) => (
          <line
            key={node.label}
            x1={nodes[0].x} y1={nodes[0].y}
            x2={node.x} y2={node.y}
            className="demo__crawler-edge"
          />
        ))}
      </svg>
      {nodes.map((node, i) => (
        <div
          key={node.label}
          className={`demo__crawler-node ${i < found ? 'demo__crawler-node--found' : ''} ${node.root ? 'demo__crawler-node--root' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          aria-label={node.label}
        >
          <i />
          <span>{node.label}</span>
        </div>
      ))}
      <div className="demo__crawler-status">DISCOVERED / 0{found}</div>
    </div>
  )
}
