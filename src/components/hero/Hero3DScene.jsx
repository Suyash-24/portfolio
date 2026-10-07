import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3DScene({ scrollProgressRef }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0e1420, 3.5)
    scene.add(ambientLight)

    const cyanLight = new THREE.PointLight(0x5eead4, 80, 25)
    cyanLight.position.set(4, 3, 4)
    scene.add(cyanLight)

    const goldLight = new THREE.PointLight(0xfde68a, 60, 25)
    goldLight.position.set(-4, -2, 3)
    scene.add(goldLight)

    const mouseLight = new THREE.PointLight(0x67e8f9, 40, 15)
    mouseLight.position.set(0, 0, 5)
    scene.add(mouseLight)

    // 1. Central Core: Inner Morphing Torus Knot / Refractive Geometry
    const coreGroup = new THREE.Group()
    scene.add(coreGroup)

    const innerGeo = new THREE.TorusKnotGeometry(1.2, 0.38, 120, 24, 2, 3)
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x121722,
      emissive: 0x07111e,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: false,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    coreGroup.add(innerMesh)

    // 2. Wireframe Lattice (Icosahedron Geodesic Cage)
    const cageGeo = new THREE.IcosahedronGeometry(2.35, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
    const cageMesh = new THREE.Mesh(cageGeo, wireMat)
    coreGroup.add(cageMesh)

    // 3. Glowing Neural Nodes at Cage Vertices
    const cagePositions = cageGeo.attributes.position.array
    const nodeCount = cagePositions.length / 3
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cagePositions), 3))
    
    // Create soft circular sprite texture for particles
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(94, 234, 212, 0.8)')
    gradient.addColorStop(0.7, 'rgba(94, 234, 212, 0.2)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const particleTexture = new THREE.CanvasTexture(canvas)

    const nodeMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xd1fae5,
    })
    const nodes = new THREE.Points(nodeGeo, nodeMat)
    coreGroup.add(nodes)

    // 4. Orbital Gyroscope Rings
    const ringGroup = new THREE.Group()
    coreGroup.add(ringGroup)

    const ringMat1 = new THREE.LineBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.45,
    })
    const ringGeo1 = new THREE.BufferGeometry()
    const pts1 = []
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2
      pts1.push(new THREE.Vector3(Math.cos(theta) * 3.1, Math.sin(theta) * 3.1, 0))
    }
    ringGeo1.setFromPoints(pts1)
    const ring1 = new THREE.Line(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI * 0.35
    ringGroup.add(ring1)

    const ringMat2 = new THREE.LineBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.35,
    })
    const ringGeo2 = new THREE.BufferGeometry()
    const pts2 = []
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2
      pts2.push(new THREE.Vector3(Math.cos(theta) * 3.6, 0, Math.sin(theta) * 3.6))
    }
    ringGeo2.setFromPoints(pts2)
    const ring2 = new THREE.Line(ringGeo2, ringMat2)
    ring2.rotation.z = Math.PI * 0.25
    ringGroup.add(ring2)

    // 5. Surrounding Deep Starfield / Data Dust
    const particleCount = 450
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(particleCount * 3)
    const starColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      starPos[i3] = (Math.random() - 0.5) * 26
      starPos[i3 + 1] = (Math.random() - 0.5) * 18
      starPos[i3 + 2] = (Math.random() - 0.5) * 20

      // Blend between cyan (0.37, 0.92, 0.83) and warm champagne (0.99, 0.9, 0.54)
      const mix = Math.random()
      starColors[i3] = 0.37 + mix * 0.62
      starColors[i3 + 1] = 0.92 - mix * 0.02
      starColors[i3 + 2] = 0.83 - mix * 0.29
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMat = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    })
    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)

    // Mouse Tracking
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      targetMouseX = nx * 0.6
      targetMouseY = ny * 0.6
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Resize Handler
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize)

    // Animation Loop
    let animId
    const startTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = (performance.now() - startTime) * 0.001
      const p = scrollProgressRef?.current ?? 0

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06

      mouseLight.position.x = mouseX * 5
      mouseLight.position.y = mouseY * 5

      // Base idle rotation + scroll-driven rotation
      coreGroup.rotation.y = elapsed * 0.18 + p * Math.PI * 3.5
      coreGroup.rotation.x = elapsed * 0.12 + Math.sin(p * Math.PI * 2) * 0.5 + mouseY * 0.4
      coreGroup.rotation.z = mouseX * 0.4

      innerMesh.rotation.y = -elapsed * 0.3
      cageMesh.rotation.y = elapsed * 0.15
      ringGroup.rotation.z = elapsed * 0.25

      // Subtle starfield drift
      starField.rotation.y = elapsed * 0.03 + p * 0.8

      // Camera Choreography across the 3 Phases:
      // Phase 0 (p: 0 -> 0.28): Centered hero, majestic distance
      // Phase 1 (p: 0.28 -> 0.65): Sweeps to the LEFT (x = -2.2) to reveal narrative on the right
      // Phase 2 (p: 0.65 -> 0.98): Sweeps to the RIGHT (x = 2.2) to reveal concluding phase on the left
      let targetCamX = 0
      let targetCamY = 0
      let targetCamZ = 7.8
      let targetScale = 1.0

      if (p < 0.28) {
        // Phase 0
        const factor = p / 0.28
        targetCamX = 0 - factor * 0.4
        targetCamY = 0
        targetCamZ = 7.8 - factor * 0.8
        targetScale = 1.0 + factor * 0.08
      } else if (p < 0.65) {
        // Phase 1: Core positions to the left
        const factor = (p - 0.28) / 0.37
        targetCamX = -2.2 - (1 - factor) * 0.5
        targetCamY = 0.3 * Math.sin(factor * Math.PI)
        targetCamZ = 6.4 + factor * 0.4
        targetScale = 1.08 + Math.sin(factor * Math.PI) * 0.12
      } else {
        // Phase 2: Core positions to the right
        const factor = Math.min(1.0, (p - 0.65) / 0.33)
        targetCamX = 2.2 * factor - 2.2 * (1 - factor)
        targetCamY = -0.2 * factor
        targetCamZ = 6.8 + factor * 0.8
        targetScale = 1.15 - factor * 0.15
      }

      // Smooth camera position update
      camera.position.x += (targetCamX + mouseX * 0.6 - camera.position.x) * 0.08
      camera.position.y += (targetCamY + mouseY * 0.4 - camera.position.y) * 0.08
      camera.position.z += (targetCamZ - camera.position.z) * 0.08
      camera.lookAt(coreGroup.position.x * 0.3, coreGroup.position.y * 0.3, 0)

      coreGroup.scale.setScalar(targetScale)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      cageGeo.dispose()
      innerGeo.dispose()
      nodeGeo.dispose()
      ringGeo1.dispose()
      ringGeo2.dispose()
      starGeo.dispose()
      innerMat.dispose()
      wireMat.dispose()
      nodeMat.dispose()
      ringMat1.dispose()
      ringMat2.dispose()
      starMat.dispose()
      particleTexture.dispose()
    }
  }, [scrollProgressRef])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}
