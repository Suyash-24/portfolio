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
      {/* Main Background Shader (Pixel Art Scene) */}
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
      let mesh
      let material
      let textures = []

      const fragmentShader = `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D textureImage;
        uniform sampler2D textureDepth;
        uniform vec2 mousePosition;
        uniform float hoverState;
        
        // CONFIGURABLE PARAMETERS
        const float BASE_PARALLAX = 0.035;
        const float HOVER_PARALLAX_BOOST = 0.015;
        
        void main () {
          vec4 texDepth = texture2D(textureDepth, vUv);
          
          // Normalized depth [-0.5, 0.5]
          float depthVal = texDepth.r - 0.5;
          
          // Displacement based on mouse, depth, and hover state
          float parallax = BASE_PARALLAX + (HOVER_PARALLAX_BOOST * hoverState);
          vec2 displacedUv = vUv + (mousePosition * depthVal * parallax);
          
          vec4 texImage = texture2D(textureImage, displacedUv);
          
          // No edge fade in GLSL—handled smoothly by CSS mask on the parent shell
          // This allows the scene to seamlessly merge with the hero section
          gl_FragColor = vec4(texImage.rgb, 1.0);
        }
      `

      const vertexShader = `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat3 normalMatrix;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `

      const loader = new THREE.TextureLoader()
      const basePath = import.meta.env.BASE_URL || '/'
      const urls = [
        basePath + 'hero-shader/pixel-desk.png',
        basePath + 'hero-shader/pixel-desk-depth.jpg'
      ]
      let loaded = 0
      const loadedTextures = []
      const start = () => {
        if (cancelled || loaded < urls.length) return
        textures = loadedTextures
        textures[0].minFilter = THREE.LinearFilter
        textures[1].magFilter = textures[1].minFilter = THREE.LinearFilter

        material = new THREE.RawShaderMaterial({
          transparent: true,
          vertexShader,
          fragmentShader,
          uniforms: {
            textureImage: { value: textures[0] },
            textureDepth: { value: textures[1] },
            mousePosition: { value: new THREE.Vector2(0.0, 0.0) },
            hoverState: { value: 0.0 }
          },
        })
        // The image is 16:9 aspect ratio (pixel art scene)
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(320, 180, 128, 128), material)
        scene.add(mesh)
        resize()
        render()
      }
      urls.forEach((url, index) => loader.load(url, (texture) => {
        loadedTextures[index] = texture
        loaded += 1
        start()
      }))

      const resize = () => {
        const rect = shell.getBoundingClientRect()
        renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false)
        camera.aspect = rect.width / Math.max(rect.height, 1)
        camera.updateProjectionMatrix()
        
        if (mesh) {
          const dist = camera.position.z
          const vFov = (camera.fov * Math.PI) / 180
          const planeHeightAtDistance = 2 * Math.tan(vFov / 2) * dist
          const planeWidthAtDistance = planeHeightAtDistance * camera.aspect
          // Since we want the artwork to act like 'cover' inside the container, we scale it
          const scale = Math.max(planeWidthAtDistance / 320, planeHeightAtDistance / 180)
          mesh.scale.set(scale, scale, 1)
        }
      }
      // Current logical pointer position for smooth lerp
      const currentPointer = { x: 0, y: 0 }
      let targetHover = 0.0
      let currentHover = 0.0

      const move = (event) => {
        const rect = shell.getBoundingClientRect()
        // Map mouse coordinates to [-1, 1] relative to the shell center
        target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        targetHover = 1.0
      }
      const leave = () => { 
        target.x = 0
        target.y = 0 
        targetHover = 0.0
      }
      const render = (time = 0) => {
        if (!mesh || !material) return
        pointer.x += (target.x - pointer.x) * 0.07
        pointer.y += (target.y - pointer.y) * 0.07
        currentHover += (targetHover - currentHover) * 0.05
        material.uniforms.mousePosition.value.set(pointer.x, pointer.y)
        material.uniforms.hoverState.value = currentHover
        renderer.render(scene, camera)
        if (!reduced) frame = requestAnimationFrame(render)
      }

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
