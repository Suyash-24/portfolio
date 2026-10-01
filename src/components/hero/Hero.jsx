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
      // Identity mark builds in
      tl.from('.hero__identity', { scale: 0.7, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.2)
      // Title words reveal
      tl.from('.hero__title-word', {
        yPercent: 105,
        opacity: 0,
        stagger: 0.09,
        duration: 1.0,
        ease: 'power4.out',
      }, 0.45)
      // Data points appear
      tl.from('.hero__dp', {
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'back.out(1.5)',
      }, 0.7)
      // Sub-copy
      tl.from('.hero__blurb', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.85)
      // Scroll cue
      tl.from('.hero__scroll', { opacity: 0, y: 10, duration: 0.7 }, 1.4)
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
    <section className="hero" id="top" data-section="top" ref={heroRef} aria-label="Introduction">
      {/* 2.5D Parallax Background */}
      <SignalParallax reduced={reduced} />

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
        uniform sampler2D textureNormal;
        uniform sampler2D textureNoise;
        uniform vec2 mousePosition;
        uniform float time;
        float PI = 3.141592;

        void main () {
          vec4 texDepth = texture2D(textureDepth, vUv);
          vec4 texNoise = texture2D(textureNoise, vUv + time*.05);
          vec4 texNoise2 = texture2D(textureNoise, vUv*.1 + time*.1);
          float depthVal = texDepth.r - .7;
          float noiseVal = texNoise.r - .5;
          float noiseVal2 = texNoise2.r - .5;
          float distToCenter = pow(distance(vUv, vec2(.5,.5)), 4.0);
          float distToMouse = 1.0 - smoothstep(0.0, 0.25, distance(mousePosition + vec2(.5, .5), vUv));
          vec2 dispDepth = vUv + mousePosition * depthVal * .1;
          vec2 dispWaves = vec2(noiseVal * distToCenter);
          vec2 dispMouse = vec2(noiseVal2 * .10 * distToMouse);
          vec4 texImage = texture2D(textureImage, dispDepth + dispWaves + dispMouse);
          vec4 texNormal = texture2D(textureNormal, dispDepth + dispWaves + dispMouse);
          vec4 particles = texture2D(textureNoise, dispWaves + vec2(vUv.x - sin(time * .5), vUv.y - sin(time)));
          float thr1 = .05 + sin(time*4.0)*.05;
          texImage.rgb *= smoothstep(thr1,thr1+.03,particles.r);
          vec4 displacedDepth = texture2D(textureDepth, dispDepth + dispWaves + dispMouse);
          vec4 smokeNoise1 = texture2D(textureNoise, dispDepth - vec2(time * .3));
          texImage.r *= 1. + (displacedDepth.b * (40. + smokeNoise1.r) * pow(1. - vUv.y, 6.) * (1. + sin(time)) *.1);
          vec4 smokeNoise2 = texture2D(textureNoise, dispDepth - vec2(time * .1, time * .5));
          texImage.b *= 1. + (displacedDepth.g * (6. + sin(time * 5.)) * (.5 + smokeNoise2.r * (1. + sin(time) * .5)) * vUv.y);
          float lighteningValue = texture2D(textureNoise, vec2(time*.1)).r;
          lighteningValue = 1. - smoothstep(.6,.65,lighteningValue) * .3;
          texImage.rg *= lighteningValue;
          vec3 lightDirection = normalize(vec3(mousePosition.x, mousePosition.y, .3));
          vec3 pixDirection = normalize(vec3(texNormal.r * 2. - 1., texNormal.b * 2. - 1., -texNormal.g * 2. + 1.));
          float lightVal = dot(pixDirection, lightDirection);
          texImage.rgb *= .9 + (distToMouse * lightVal * (1. - displacedDepth.g)) * (2. + sin(time)*.5);
          gl_FragColor = vec4(texImage);
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
      loader.crossOrigin = 'anonymous'
      const urls = [
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/halloween.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/halloween-depth.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/halloween-normal.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/noiseTexture.jpg',
      ]
      let loaded = 0
      const loadedTextures = []
      const start = () => {
        if (cancelled || loaded < urls.length) return
        textures = loadedTextures
        textures[0].minFilter = THREE.LinearFilter
        textures[1].magFilter = textures[1].minFilter = THREE.LinearFilter
        textures[2].magFilter = textures[2].minFilter = THREE.LinearFilter
        textures[3].magFilter = textures[3].minFilter = THREE.LinearFilter
        textures[3].wrapT = textures[3].wrapS = THREE.RepeatWrapping

        material = new THREE.RawShaderMaterial({
          transparent: true,
          vertexShader,
          fragmentShader,
          uniforms: {
            time: { value: 5 },
            textureImage: { value: textures[0] },
            textureDepth: { value: textures[1] },
            textureNormal: { value: textures[2] },
            textureNoise: { value: textures[3] },
            mousePosition: { value: new THREE.Vector2(0.5, 0.5) },
          },
        })
        // The image is 2:3 aspect ratio (portrait)
        // Match the mesh proportions so it's not squashed
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 300, 128, 128), material)
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
        const width = window.innerWidth
        const height = window.innerHeight
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        
        if (mesh) {
          const dist = camera.position.z
          const vFov = (camera.fov * Math.PI) / 180
          const planeHeightAtDistance = 2 * Math.tan(vFov / 2) * dist
          const planeWidthAtDistance = planeHeightAtDistance * camera.aspect
          // Using 200x300 as the base mesh size
          const scale = Math.max(planeWidthAtDistance / 200, planeHeightAtDistance / 300) * 1.1
          mesh.scale.set(scale, scale, 1)
        }
      }
      const move = (event) => {
        target.x = (event.clientX / window.innerWidth) * 2 - 1
        target.y = -(event.clientY / window.innerHeight) * 2 - 1
      }
      const leave = () => { target.x = 0; target.y = 0 }
      const render = (time = 0) => {
        if (!mesh || !material) return
        pointer.x += (target.x - pointer.x) * 0.07
        pointer.y += (target.y - pointer.y) * 0.07
        material.uniforms.mousePosition.value.set(pointer.x, pointer.y)
        material.uniforms.time.value = time * 0.001
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

  return <div className="hero__shader-shell" ref={shellRef} aria-label="Interactive Halloween 2.5D parallax shader" />
}
