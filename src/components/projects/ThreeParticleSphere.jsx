import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const pointsRef = useRef()
  const particlesCount = 2000
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const radius = 1.4 // Decreased from 2.2 to fit nicely
    
    for (let i = 0; i < particlesCount; i++) {
      const y = 1 - (i / (particlesCount - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      pos[i * 3] = Math.cos(theta) * r * radius
      pos[i * 3 + 1] = y * radius
      pos[i * 3 + 2] = Math.sin(theta) * r * radius
    }
    return pos
  }, [particlesCount])

  // Refs for smooth animation
  const targetRotation = useRef({ x: 0, y: 0 })
  const baseRotation = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    // Base auto-rotation (Slowed down significantly)
    baseRotation.current.y += delta * 0.04 
    baseRotation.current.x += delta * 0.02

    // Mouse influence (state.pointer is normalized -1 to +1)
    const mouseTargetX = state.pointer.y * 0.3 // Reduced mouse influence slightly
    const mouseTargetY = state.pointer.x * 0.3

    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseTargetX, 0.05)
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseTargetY, 0.05)

    // Combine base rotation with mouse interaction
    pointsRef.current.rotation.x = baseRotation.current.x + targetRotation.current.x
    pointsRef.current.rotation.y = baseRotation.current.y + targetRotation.current.y
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3B82F6"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function ThreeParticleSphere() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: 'var(--bg-section-alt)' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        dpr={[1, 2]}
        fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-ghost)', fontStyle: 'italic', fontSize: '0.8rem' }}>[ Hardware Acceleration Disabled ]</div>}
      >
        <ambientLight intensity={1} />
        <Particles />
      </Canvas>
    </div>
  )
}
