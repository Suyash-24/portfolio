import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../../data/portfolio'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Hero() {
  const heroRef = useRef(null)
  const glyphRef = useRef(null)
  const copyRef = useRef(null)
  const reduced = useReducedMotion()

  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 })
  const [loaded, setLoaded] = useState(false)

  // Initial reveal animation
  useEffect(() => {
    if (reduced) { setLoaded(true); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) })
      // Horizontal lines appear
      tl.from('.hero__grid-line--h', {
        scaleX: 0,
        transformOrigin: 'left center',
        stagger: { amount: 0.5, from: 'random' },
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0)
      // Vertical lines appear
      tl.from('.hero__grid-line--v', {
        scaleY: 0,
        transformOrigin: 'center top',
        stagger: { amount: 0.5, from: 'random' },
        duration: 0.7,
        ease: 'power3.inOut',
      }, 0.1)
      // Title words reveal
      tl.from('.hero__title-word', {
        yPercent: 105,
        opacity: 0,
        stagger: 0.09,
        duration: 1.0,
        ease: 'power4.out',
      }, 0.45)
      // Sub-copy
      tl.from('.hero__blurb', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.85)
      // Scroll cue
      tl.from('.hero__scroll', { opacity: 0, y: 10, duration: 0.7 }, 1.4)
      
      // Parallax scroll transition: visual gets absorbed into the background
      if (glyphRef.current) {
        gsap.to(glyphRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
          scale: 1.05,
          y: 40,
          opacity: 0,
        })
      }
    }, heroRef)
    return () => ctx.revert()
  }, [reduced])

  // Mouse parallax
  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const hero = heroRef.current
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      setMouseNorm({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    const onLeave = () => setMouseNorm({ x: 0.5, y: 0.5 })
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  const dx = (mouseNorm.x - 0.5) * 2
  const dy = (mouseNorm.y - 0.5) * 2

  return (
    <section 
      className="hero" 
      id="top" 
      data-section="top" 
      ref={heroRef} 
      aria-label="Introduction"
      style={{
        '--mouse-x': mouseNorm.x,
        '--mouse-y': mouseNorm.y
      }}
    >
      {/* Background grid */}
      <HeroGrid />

      {/* Metadata line */}
      <div className="hero__meta" aria-hidden="true">
        <span>B.E. COMPUTER ENGINEERING</span>
        <span className="hero__meta-sep">◆</span>
        <span>{profile.coords}</span>
        <span className="hero__meta-sep">◆</span>
        <span>CLASS OF 2026</span>
      </div>

      {/* Main layout: title + identity */}
      <div className="hero__body">
        {/* Left: Title */}
        <div className="hero__copy" ref={copyRef} style={{
          transform: `translate(${dx * -8}px, ${dy * -6}px)`,
          transition: reduced ? 'none' : 'transform 0.8s cubic-bezier(0.2,0.8,0.2,1)',
        }}>
          <p className="hero__eyebrow">
            <span className="hero__status-dot" aria-hidden="true" />
            DATA SCIENCE · MACHINE LEARNING
          </p>
          <h1 className="hero__title" aria-label="Suyash Narawade">
            <span className="hero__title-line">
              <span className="hero__title-word hero__title-word--outline">Suyash</span>
            </span>
            <span className="hero__title-line">
              <span className="hero__title-word">Narawade</span>
              <span className="hero__title-word hero__title-word--period" aria-hidden="true">.</span>
            </span>
          </h1>
          <p className="hero__blurb">
            Computer Engineering student exploring Data Science, Machine Learning,
            Python, and Analytics — turning curiosity into tools, clear analysis,
            and systems that work.
          </p>

          <div className="hero__cta-row">
            <button
              className="hero__cta hero__cta--primary"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              data-cursor="link"
            >
              View work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </button>
            <a
              className="hero__cta hero__cta--ghost"
              href={`mailto:${profile.email}`}
              data-cursor="email"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Right: interactive shader artwork */}
        <div
          className="hero__instrument"
          ref={glyphRef}
          style={{
            transform: `translate(${dx * 6}px, ${dy * 4}px)`,
            transition: reduced ? 'none' : 'transform 0.95s cubic-bezier(0.2,0.8,0.2,1)',
          }}
          data-cursor="explore"
        >
          <SignalParallax reduced={reduced} />
        </div>
      </div>

      {/* Scroll indicator */}
      <a className="hero__scroll" href="#about" aria-label="Scroll to next section">
        <span>SCROLL</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>

      {/* Bottom index */}
      <div className="hero__index" aria-hidden="true">[ 001 ] IDENTITY</div>
    </section>
  )
}

function HeroGrid() {
  const lines = Array.from({ length: 8 })
  const cols = Array.from({ length: 6 })
  return (
    <div className="hero__grid" aria-hidden="true">
      {lines.map((_, i) => (
        <div key={i} className="hero__grid-line hero__grid-line--h" style={{ top: `${(i + 1) * 11.5}%` }} />
      ))}
      {cols.map((_, i) => (
        <div key={i} className="hero__grid-line hero__grid-line--v" style={{ left: `${(i + 1) * 14.5}%` }} />
      ))}
    </div>
  )
}

function SignalParallax({ reduced }) {
  const shellRef = useRef(null)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined

    let cancelled = false
    let dispose = () => {}

    import('three').then((THREE) => {
      if (cancelled) return

      const canvas = document.createElement('canvas')
      canvas.className = 'hero__shader-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      shell.appendChild(canvas)

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
      } catch {
        canvas.remove()
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20000)
      camera.position.z = 260
      const pointer = { x: 0, y: 0 }
      const target = { x: 0, y: 0 }
      let frame = 0
      let mesh = new THREE.Group()

      // Create an abstract, organic twisting data structure (Torus Knot)
      const geometry = new THREE.TorusKnotGeometry(75, 20, 200, 32)
      
      // Node particles (Data points)
      const pointMaterial = new THREE.PointsMaterial({
        color: 0xd2ff00, // Lime accent
        size: 1.5,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      })
      
      // Connections (Neural/Network links)
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xd2ff00,
        transparent: true,
        opacity: 0.12
      })

      const points = new THREE.Points(geometry, pointMaterial)
      const lines = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial)
      
      mesh.add(points)
      mesh.add(lines)
      
      // Shift the 3D model to the right side of the screen to balance the typography
      mesh.position.x = 90
      
      scene.add(mesh)

      const resize = () => {
        const rect = shell.getBoundingClientRect()
        renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false)
        camera.aspect = rect.width / Math.max(rect.height, 1)
        camera.updateProjectionMatrix()
      }
      resize()

      // Current logical pointer position for smooth lerp
      const currentPointer = { x: 0, y: 0 }

      const move = (event) => {
        const rect = shell.getBoundingClientRect()
        // Map mouse coordinates to [-1, 1] relative to the shell center
        target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      }
      const leave = () => { 
        target.x = 0
        target.y = 0 
      }
      const render = (time = 0) => {
        if (!mesh) return
        pointer.x += (target.x - pointer.x) * 0.05
        pointer.y += (target.y - pointer.y) * 0.05
        
        // Organic continuous rotation
        mesh.rotation.y = time * 0.0003
        mesh.rotation.x = time * 0.00015
        
        // Interactive tilt based on mouse position
        mesh.rotation.y += pointer.x * 0.6
        mesh.rotation.x += pointer.y * 0.6
        
        // Slight scale bounce based on mouse movement
        const dist = Math.sqrt(pointer.x*pointer.x + pointer.y*pointer.y)
        const scale = 1.0 + (dist * 0.05)
        mesh.scale.set(scale, scale, scale)

        renderer.render(scene, camera)
        if (!reduced) frame = requestAnimationFrame(render)
      }
      
      // Kickstart the render loop
      render()

      window.addEventListener('resize', resize)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerleave', leave)
      dispose = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerleave', leave)
        mesh?.geometry.dispose()
        material?.dispose()
        textures.forEach((texture) => texture.dispose())
        renderer.dispose()
        canvas.remove()
      }
    }).catch(() => {})

    return () => {
      cancelled = true
      dispose()
    }
  }, [reduced])

  return <div className="hero__shader-shell" ref={shellRef} aria-label="Interactive 2.5D Technical Portrait Shader" />
}
