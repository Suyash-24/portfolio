import { useMemo, useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// ── Deterministic noise (no dependencies) ────────────────────────────────────
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function valueNoise3(x, y, z) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = x - xi
  const yf = y - yi
  const zf = z - zi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const w = zf * zf * (3 - 2 * zf)
  let sum = 0
  for (let k = 0; k < 2; k++) {
    const wz = k ? w : 1 - w
    for (let j = 0; j < 2; j++) {
      const wy = j ? v : 1 - v
      for (let i = 0; i < 2; i++) {
        sum += hash3(xi + i, yi + j, zi + k) * (i ? u : 1 - u) * wy * wz
      }
    }
  }
  return sum
}

function fbm3(x, y, z, octaves = 3) {
  let sum = 0
  let amp = 0.5
  let norm = 0
  let f = 1
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise3(x * f, y * f, z * f) * amp
    norm += amp
    amp *= 0.5
    f *= 2.03
  }
  return sum / norm
}

function ridged3(x, y, z, octaves = 3) {
  return 1 - Math.abs(fbm3(x, y, z, octaves) * 2 - 1)
}

function tileNoise2D(grid, seed) {
  const rand = mulberry32(seed)
  const g = new Float32Array(grid * grid)
  for (let i = 0; i < g.length; i++) g[i] = rand()
  return (u, v) => {
    const fx = u * grid
    const fy = v * grid
    const x0 = Math.floor(fx)
    const y0 = Math.floor(fy)
    const tx = fx - x0
    const ty = fy - y0
    const sx = tx * tx * (3 - 2 * tx)
    const sy = ty * ty * (3 - 2 * ty)
    const xa = ((x0 % grid) + grid) % grid
    const ya = ((y0 % grid) + grid) % grid
    const xb = (xa + 1) % grid
    const yb = (ya + 1) % grid
    const v00 = g[ya * grid + xa]
    const v10 = g[ya * grid + xb]
    const v01 = g[yb * grid + xa]
    const v11 = g[yb * grid + xb]
    return (v00 + (v10 - v00) * sx) * (1 - sy) + (v01 + (v11 - v01) * sx) * sy
  }
}

function fbm2D(baseGrid, seed, octaves) {
  const layers = []
  let total = 0
  for (let o = 0; o < octaves; o++) {
    const amp = 1 / (1 << o)
    layers.push({ n: tileNoise2D(baseGrid << o, seed + o * 7919), amp })
    total += amp
  }
  return (u, v) => {
    let sum = 0
    for (let i = 0; i < layers.length; i++) sum += layers[i].n(u, v) * layers[i].amp
    return sum / total
  }
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// ── Tuning knobs ────────────────────────────────────────────────────────────
const CUBE_SIZE = 4.2
const CUBE_COLOR = '#7B828E'
// Corner that gets sheared off, and how far from the centre the cut plane sits.
// The true corner is at ~3.64 along this direction; lower BREAK_T = bigger break.
const BREAK_DIR = new THREE.Vector3(1, -1, 1).normalize()
const BREAK_T = 2.7
// Resting pose (radians). Front (+z) face dominant, thin top sliver, right face visible.
const BASE = { x: 0.3, y: -0.5 }
// Static roll in the screen plane. Negative = clockwise, matching the reference.
const ROLL = -0.35

// ── Surface maps: fine pitting, with enough roughness variance for glints ──
// Low-res + NEAREST magnification so highlights break into blocky, dithered texels.
const MAP_SIZE = 384
let rockMaps = null

function getRockMaps() {
  if (rockMaps) return rockMaps

  const grime = fbm2D(6, 3301, 3)
  const coarse = fbm2D(26, 5150, 2)
  const fine = fbm2D(64, 7777, 1)
  const dither = mulberry32(31337)

  const height = new Float32Array(MAP_SIZE * MAP_SIZE)
  const roughData = new Uint8ClampedArray(MAP_SIZE * MAP_SIZE * 4)
  const normData = new Uint8ClampedArray(MAP_SIZE * MAP_SIZE * 4)

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const u = x / MAP_SIZE
      const v = y / MAP_SIZE
      height[y * MAP_SIZE + x] = coarse(u, v) * 0.58 + fine(u, v) * 0.42
    }
  }

  const at = (x, y) =>
    height[(((y % MAP_SIZE) + MAP_SIZE) % MAP_SIZE) * MAP_SIZE + (((x % MAP_SIZE) + MAP_SIZE) % MAP_SIZE)]

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const u = x / MAP_SIZE
      const v = y / MAP_SIZE
      const o = (y * MAP_SIZE + x) * 4

      // 0.66–0.98: mostly matte, with shinier texels that catch small lights
      const roughV = Math.min(1, 0.66 + grime(u, v) * 0.2 + dither() * 0.12)

      const dx = (at(x + 1, y) - at(x - 1, y)) * 3.6
      const dy = (at(x, y + 1) - at(x, y - 1)) * 3.6
      const len = Math.hypot(dx, dy, 1)

      roughData[o] = roughData[o + 1] = roughData[o + 2] = roughV * 255
      roughData[o + 3] = 255
      normData[o] = ((-dx / len) * 0.5 + 0.5) * 255
      normData[o + 1] = ((dy / len) * 0.5 + 0.5) * 255
      normData[o + 2] = (1 / len) * 0.5 * 255 + 127.5
      normData[o + 3] = 255
    }
  }

  const toTexture = (data) => {
    const tex = new THREE.DataTexture(data, MAP_SIZE, MAP_SIZE, THREE.RGBAFormat)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.magFilter = THREE.NearestFilter
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.generateMipmaps = true
    tex.anisotropy = 8
    tex.colorSpace = THREE.NoColorSpace
    tex.needsUpdate = true
    return tex
  }

  rockMaps = { roughnessMap: toTexture(roughData), normalMap: toTexture(normData) }
  return rockMaps
}

// ── Geometry: sharp box, pitted, Y-notch over the top-front edge, sheared corner ──
function makeRockGeometry(size = CUBE_SIZE, segments = 128) {
  const geo = new THREE.BoxGeometry(size, size, size, segments, segments, segments)
  geo.clearGroups()

  const pos = geo.attributes.position
  const count = pos.count
  const gloss = new Float32Array(count)
  const half = size / 2
  const rand = mulberry32(4711)

  // small surface pits only — no lumps
  const pits = []
  for (let i = 0; i < 56; i++) {
    const r = 0.04 + rand() * 0.08
    pits.push({
      x: (rand() * 2 - 1) * half,
      y: (rand() * 2 - 1) * half,
      z: (rand() * 2 - 1) * half,
      r2: r * r,
      d: 0.006 + rand() * 0.016,
    })
  }

  const bx = BREAK_DIR.x
  const by = BREAK_DIR.y
  const bz = BREAK_DIR.z

  // Y notch: junction on the front face near the top edge. The up arm runs over
  // the top-front edge and back along the top face; two arms run down the front.
  const notchW = size * 0.11
  const notchDepth = size * 0.2
  const toV = ([x, y, z]) => new THREE.Vector3(x * half, y * half, z * half)
  const J = [0, 0.45, 1]
  const EDGE = [0, 1, 1]
  const ARMS = [
    [J, EDGE],
    [EDGE, [0, 1, 0.3]],
    [J, [-0.62, -0.35, 1]],
    [J, [0.62, -0.35, 1]],
  ]
  const segs = ARMS.map(([a, b]) => {
    const A = toV(a)
    const B = toV(b)
    const abx = B.x - A.x
    const aby = B.y - A.y
    const abz = B.z - A.z
    return { ax: A.x, ay: A.y, az: A.z, abx, aby, abz, ab2: abx * abx + aby * aby + abz * abz }
  })

  const amp = size * 0.0096
  const n = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    const px = pos.getX(i)
    const py = pos.getY(i)
    const pz = pos.getZ(i)
    n.set(px, py, pz).normalize()

    const ax = Math.abs(px) / half
    const ay = Math.abs(py) / half
    const az = Math.abs(pz) / half
    const l1 = ax + ay + az
    const edgeBoost = 1 + (l1 - 1) * 0.6

    let carve = 0
    for (let s = 0; s < segs.length; s++) {
      const sg = segs[s]
      let u = ((px - sg.ax) * sg.abx + (py - sg.ay) * sg.aby + (pz - sg.az) * sg.abz) / sg.ab2
      u = u < 0 ? 0 : u > 1 ? 1 : u
      const dx = px - (sg.ax + sg.abx * u)
      const dy = py - (sg.ay + sg.aby * u)
      const dz = pz - (sg.az + sg.abz * u)
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < notchW) {
        // steep walls, flat floor
        const prof = smoothstep(0, 0.28, 1 - d / notchW)
        if (prof > carve) carve = prof
      }
    }

    // keep the carved walls clean: kill surface noise inside the notch
    const smoothMask = 1 - carve * 0.92
    let disp =
      ((fbm3(px * 4.2 + 3.7, py * 4.2 + 8.2, pz * 4.2 + 1.4, 3) - 0.5) * 2 +
        (ridged3(px * 11 + 21, py * 11 + 5, pz * 11 + 13, 3) - 0.45) * 1.1) *
      amp *
      edgeBoost *
      smoothMask

    for (let d = 0; d < pits.length; d++) {
      const p = pits[d]
      const dx = px - p.x
      const dy = py - p.y
      const dz = pz - p.z
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 < p.r2) {
        const t = 1 - d2 / p.r2
        disp -= p.d * t * t * smoothMask
      }
    }

    // Carve direction: the face normal, blended toward a diagonal right at the
    // edge so the notch wraps over the top-front edge without cracking
    // (duplicated box vertices share the same position, so they move together).
    let cx = Math.sign(px) * smoothstep(0.93, 0.995, ax)
    let cy = Math.sign(py) * smoothstep(0.93, 0.995, ay)
    let cz = Math.sign(pz) * smoothstep(0.93, 0.995, az)
    const cl = Math.hypot(cx, cy, cz) || 1
    const cd = carve * notchDepth
    cx = (cx / cl) * cd
    cy = (cy / cl) * cd
    cz = (cz / cl) * cd

    let x = px + n.x * disp - cx
    let y = py + n.y * disp - cy
    let z = pz + n.z * disp - cz

    // Broken corner: shear everything past an irregular plane back onto it,
    // then roughen the cut face so it reads as a flat, jagged fracture.
    const bdist = x * bx + y * by + z * bz
    const T = BREAK_T + (fbm3(x * 1.3 + 9, y * 1.3 + 2, z * 1.3 + 5, 2) - 0.5) * 0.7
    if (bdist > T) {
      const over = bdist - T
      const jag =
        (fbm3(x * 7 + 1, y * 7 + 3, z * 7 + 8, 3) - 0.5) * 0.5 +
        (ridged3(x * 14 + 4, y * 14 + 6, z * 14 + 2, 2) - 0.5) * 0.2
      const target = T + jag * smoothstep(0, 0.5, over)
      const k = bdist - target
      x -= bx * k
      y -= by * k
      z -= bz * k
    }

    pos.setXYZ(i, x, y, z)
    gloss[i] = smoothstep(0.1, 0.5, carve)
  }

  pos.needsUpdate = true
  geo.setAttribute('aGloss', new THREE.BufferAttribute(gloss, 1))
  geo.computeVertexNormals()
  return geo
}

function makeChunkGeometry(seed) {
  const geo = new THREE.IcosahedronGeometry(1, 2)
  const pos = geo.attributes.position
  const rand = mulberry32(seed)
  const sx = 0.5 + rand() * 0.75
  const sy = 0.45 + rand() * 0.6
  const sz = 0.5 + rand() * 0.75
  const v = new THREE.Vector3()
  const dir = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    v.set(v.x * sx, v.y * sy, v.z * sz)
    dir.copy(v).normalize()
    const d =
      (fbm3(v.x * 2.6 + seed, v.y * 2.6 + seed * 0.7, v.z * 2.6 + seed * 1.3, 3) - 0.5) * 1.0 +
      (ridged3(v.x * 6.4 + seed * 1.7, v.y * 6.4, v.z * 6.4, 2) - 0.45) * 0.7
    pos.setXYZ(i, v.x + dir.x * d, v.y + dir.y * d, v.z + dir.z * d)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

// ── Notch walls: lighter, shinier, slightly metallic, no normal-map pitting ──
const ROCK_SHADER_PATCH = (shader) => {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nattribute float aGloss;\nvarying float vGloss;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGloss = aGloss;')
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying float vGloss;')
    .replace(
      '#include <color_fragment>',
      '#include <color_fragment>\ndiffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 0.92 + vec3( 0.04 ), vGloss );'
    )
    .replace(
      '#include <roughnessmap_fragment>',
      '#include <roughnessmap_fragment>\nroughnessFactor = mix( roughnessFactor, 0.25, vGloss );'
    )
    .replace(
      '#include <metalnessmap_fragment>',
      '#include <metalnessmap_fragment>\nmetalnessFactor = mix( metalnessFactor, 0.4, vGloss );'
    )
    .replace(
      '#include <normal_fragment_maps>',
      '#include <normal_fragment_maps>\nnormal = normalize( mix( nonPerturbedNormal, normal, 1.0 - vGloss ) );'
    )
}

// ── Sprites ─────────────────────────────────────────────────────────────────
let nodeSprite = null
function getNodeSprite() {
  if (nodeSprite) return nodeSprite
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  ctx.beginPath()
  ctx.arc(32, 32, 19, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.lineWidth = 10
  ctx.strokeStyle = 'rgba(16,18,24,0.85)'
  ctx.stroke()
  nodeSprite = new THREE.CanvasTexture(c)
  nodeSprite.colorSpace = THREE.SRGBColorSpace
  return nodeSprite
}

let dustSprite = null
function getDustSprite() {
  if (dustSprite) return dustSprite
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, 'rgba(84,82,98,0.7)')
  g.addColorStop(0.5, 'rgba(84,82,98,0.26)')
  g.addColorStop(1, 'rgba(84,82,98,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 32, 32)
  dustSprite = new THREE.CanvasTexture(c)
  dustSprite.colorSpace = THREE.SRGBColorSpace
  return dustSprite
}

// ── Three small corner triangles (the broken corner is excluded) ───────────
function CornerTriangles({ radius }) {
  const { linePositions, nodePositions, nodeCount } = useMemo(() => {
    const corners = [
      [-1, 1, 1],
      [1, 1, 1],
      [-1, -1, 1],
    ]
    const pts = []
    for (const [sx, sy, sz] of corners) {
      const c = [sx * radius * 1.05, sy * radius * 1.05, sz * radius * 1.05]
      const vx = [(c[0] - sx * 0.5 * radius) * 1.03, c[1] * 1.03, c[2] * 1.03]
      const vy = [c[0] * 1.03, (c[1] - sy * 0.5 * radius) * 1.03, c[2] * 1.03]
      pts.push(c, vx, vy)
    }

    const linePositions = new Float32Array(pts.length * 6)
    let o = 0
    for (let i = 0; i < pts.length; i += 3) {
      for (const [p, q] of [[0, 1], [1, 2], [2, 0]]) {
        linePositions[o++] = pts[i + p][0]
        linePositions[o++] = pts[i + p][1]
        linePositions[o++] = pts[i + p][2]
        linePositions[o++] = pts[i + q][0]
        linePositions[o++] = pts[i + q][1]
        linePositions[o++] = pts[i + q][2]
      }
    }

    const nodePositions = new Float32Array(pts.length * 3)
    pts.forEach((p, i) => {
      nodePositions[i * 3] = p[0]
      nodePositions[i * 3 + 1] = p[1]
      nodePositions[i * 3 + 2] = p[2]
    })

    return { linePositions, nodePositions, nodeCount: pts.length }
  }, [radius])

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePositions} count={linePositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.55} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodePositions} count={nodeCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.09} map={getNodeSprite()} transparent opacity={0.55} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  )
}

// ── Rubble clumped against the fracture face ────────────────────────────────
// Biggest chunks sit on the break; smaller ones scatter outward and sag.
function Debris({ maps, count = 14 }) {
  const chunks = useMemo(() => {
    const rand = mulberry32(606060)
    const geos = [0, 1, 2, 3, 4].map((i) => makeChunkGeometry(1200 + i * 37))

    const t1 = new THREE.Vector3().crossVectors(BREAK_DIR, new THREE.Vector3(0, 1, 0)).normalize()
    const t2 = new THREE.Vector3().crossVectors(BREAK_DIR, t1).normalize()
    const c0 = BREAK_DIR.clone().multiplyScalar(BREAK_T)

    return Array.from({ length: count }, (_, i) => {
      const f = i / count
      const spread = 0.5 + f * 1.4
      const p = c0
        .clone()
        .addScaledVector(BREAK_DIR, 0.12 + rand() * 0.5 + f * 0.5)
        .addScaledVector(t1, (rand() - 0.5) * 2 * spread)
        .addScaledVector(t2, (rand() - 0.5) * 2 * spread)
      p.y -= f * rand() * 0.9
      return {
        geometry: geos[i % geos.length],
        position: [p.x, p.y, p.z],
        rotation: [rand() * 6.28, rand() * 6.28, rand() * 6.28],
        scale: i < 4 ? 0.5 + rand() * 0.28 : 0.17 + rand() * 0.28,
      }
    })
  }, [count])

  return (
    <group>
      {chunks.map((c, i) => (
        <mesh key={i} geometry={c.geometry} position={c.position} rotation={c.rotation} scale={c.scale}>
          <meshStandardMaterial
            color="#757C88"
            roughness={1}
            metalness={0.04}
            roughnessMap={maps.roughnessMap}
            normalMap={maps.normalMap}
            normalScale={[1.4, 1.4]}
            envMapIntensity={0.55}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

function DustMotes({ count = 60 }) {
  const positions = useMemo(() => {
    const rand = mulberry32(24680)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() * 2 - 1) * 5.2
      arr[i * 3 + 1] = (rand() * 2 - 1) * 4.2
      arr[i * 3 + 2] = -1 + rand() * 5
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.042} map={getDustSprite()} transparent opacity={0.34} depthWrite={false} sizeAttenuation />
    </points>
  )
}

// ── The rock-ice block ──────────────────────────────────────────────────────
// Local-space points on the front face that the HUD leader lines lock onto.
const ANCHOR_TL = [-0.72, 0.78, 1.01]
const ANCHOR_TR = [0.8, 0.58, 1.01]
const ANCHOR_BR = [0.6, -0.65, 1.01]

function RockIceBlock({ hud, containerRef }) {
  const groupRef = useRef(null)
  const anchorTL = useRef(null)
  const anchorTR = useRef(null)
  const maps = useMemo(() => getRockMaps(), [])
  const geometry = useMemo(() => makeRockGeometry(CUBE_SIZE), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const half = CUBE_SIZE / 2

  useFrame((state) => {
    const g = groupRef.current
    if (!g) return

    const heroEl = document.getElementById('hero')
    let scrollP = 0
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect()
      const max = rect.height - window.innerHeight
      if (max > 0) scrollP = Math.max(0, Math.min(1, -rect.top / max))
    }

    // Smooth, aesthetic rotation based on scroll (middle ground speed)
    const targetX = BASE.x + (state.pointer.y * Math.PI) / 14 + scrollP * Math.PI * 0.8
    const targetY = BASE.y + (state.pointer.x * Math.PI) / 14 - scrollP * Math.PI * 1.2
    g.rotation.x += (targetX - g.rotation.x) * 0.04
    g.rotation.y += (targetY - g.rotation.y) * 0.04

    // ── Lock HUD leader lines onto points on the cube surface ──
    const h = hud.current
    if (!h) return

    g.updateWorldMatrix(true, true)
    const { width, height } = state.size

    const project = (anchor) => {
      anchor.getWorldPosition(tmp)
      tmp.project(state.camera)
      return [(tmp.x * 0.5 + 0.5) * width, (-tmp.y * 0.5 + 0.5) * height]
    }

    // Top-left floating tag
    if (anchorTL.current && h.containerTL) {
      const [x, y] = project(anchorTL.current)
      h.containerTL.style.transform = `translate(${x}px, ${y}px)`
      h.dot1.style.transform = `translate(${x}px, ${y}px)`
    }

    // Right floating tag
    if (anchorTR.current && h.containerR) {
      const [x, y] = project(anchorTR.current)
      h.containerR.style.transform = `translate(${x}px, ${y}px)`
      h.dot2.style.transform = `translate(${x}px, ${y}px)`
    }

    // Dynamic HUD Texts on Scroll
    if (h.labelTL && h.labelR) {
      let t1, t2;
      if (scrollP < 0.3) {
        t1 = 'SUYASH_N // 2026<br />DATA SCIENCE & ML'
        t2 = 'STATUS: OPEN<br />PUNE, IND'
      } else if (scrollP < 0.6) {
        t1 = 'PHASE 1 // EXPLORE<br />DATA PIPELINES'
        t2 = 'CORRELATION MATRICES<br />VARIANCE'
      } else {
        t1 = 'PHASE 2 // EXECUTE<br />REPRODUCIBLE CODE'
        t2 = 'SYSTEMS THINKING<br />AUTOMATION'
      }
      
      if (h.labelTL.innerHTML !== t1) h.labelTL.innerHTML = t1;
      if (h.labelR.innerHTML !== t2) h.labelR.innerHTML = t2;
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group rotation={[0, 0, ROLL]} position={[0, 0.15, 0]}>
        <group ref={groupRef}>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color={CUBE_COLOR}
              roughness={1}
              metalness={0.04}
              roughnessMap={maps.roughnessMap}
              normalMap={maps.normalMap}
              normalScale={[1.6, 1.6]}
              envMapIntensity={0.55}
              onBeforeCompile={ROCK_SHADER_PATCH}
              customProgramCacheKey={() => 'rock-ice-v4'}
            />
          </mesh>

          <Debris maps={maps} />
          <CornerTriangles radius={half} />

          <group ref={anchorTL} position={[ANCHOR_TL[0] * half, ANCHOR_TL[1] * half, ANCHOR_TL[2] * half]} />
          <group ref={anchorTR} position={[ANCHOR_TR[0] * half, ANCHOR_TR[1] * half, ANCHOR_TR[2] * half]} />
        </group>
      </group>
    </Float>
  )
}

const dotStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 5,
  height: 5,
  marginLeft: -2.5,
  marginTop: -2.5,
  borderRadius: '50%',
  background: '#1a1c23',
  boxShadow: '0 0 0 1.5px rgba(26,28,35,0.2)',
  pointerEvents: 'none',
  willChange: 'transform',
}

export default function IceCubeCanvas() {
  const containerRef = useRef(null)
  const hud = useRef({})
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // The hero track is 380vh, so we only hide the cube when we've scrolled past it entirely
      setVisible(window.scrollY < window.innerHeight * 3.8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        right: '-2vw',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '54vw',
        height: '78vh',
        zIndex: 10,
        overflow: 'hidden',
        pointerEvents: 'auto',
        visibility: visible ? 'visible' : 'hidden'
      }}
    >
      <Canvas camera={{ position: [0, 0, 16], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <fog attach="fog" args={['#c3c6d2', 12, 34]} />

        <ambientLight intensity={0.4} color="#dfe0ea" />
        <directionalLight position={[-7, 8, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[8, 1, 4]} intensity={0.6} color="#a6bcd6" />
        {/* low front-left key so the notch walls catch a bright highlight */}
        <directionalLight position={[-3, -1.5, 9]} intensity={1.0} color="#ffffff" />

        <Suspense fallback={null}>
          <DustMotes />
          <RockIceBlock hud={hud} containerRef={containerRef} />
        </Suspense>

        <Environment resolution={512} frames={1}>
          <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[-4, 7, 3]} rotation={[-Math.PI / 2.4, 0, 0]} scale={[12, 12, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#cfe0f2" position={[8, 1, 2]} rotation={[0, -Math.PI / 2.2, 0]} scale={[6, 9, 1]} />
          <Lightformer form="rect" intensity={1.1} color="#f2f2f8" position={[-7, 1, 3]} rotation={[0, Math.PI / 2.2, 0]} scale={[5, 9, 1]} />
          <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[0, 0, -7]} rotation={[0, Math.PI, 0]} scale={[10, 10, 1]} />
          <Lightformer form="rect" intensity={0.7} color="#a9a6bb" position={[0, -6, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} />
          <Lightformer form="circle" intensity={1.5} color="#ffffff" position={[-2.8, 3.2, 4]} scale={1.4} />
          <Lightformer form="circle" intensity={0.9} color="#d8e4f2" position={[3.2, -2.2, 3.6]} scale={1.1} />
          {/* tiny, very bright sources: these produce the sharp glints on the pitted surface */}
          <Lightformer form="circle" intensity={6} color="#ffffff" position={[-2, 2.5, 5]} scale={0.4} />
          <Lightformer form="circle" intensity={5} color="#ffffff" position={[2.4, -0.5, 5]} scale={0.35} />
          <Lightformer form="circle" intensity={5} color="#ffffff" position={[0, 4, 3]} scale={0.35} />
        </Environment>
      </Canvas>

      {/* We removed the SVG connecting lines completely! */}
      <div ref={(el) => (hud.current.dot1 = el)} style={dotStyle} aria-hidden="true" />
      <div ref={(el) => (hud.current.dot2 = el)} style={dotStyle} aria-hidden="true" />

      {/* Floating HUD Tags (they track the dots directly) */}
      <div className="hud-floating" ref={(el) => (hud.current.containerTL = el)} aria-hidden="true">
        <div className="hud-offset tl" ref={(el) => (hud.current.labelTL = el)}>
          SUYASH_N // 2026<br />
          DATA SCIENCE & ML
        </div>
      </div>

      <div className="hud-floating" ref={(el) => (hud.current.containerR = el)} aria-hidden="true">
        <div className="hud-offset tr" ref={(el) => (hud.current.labelR = el)}>
          STATUS: OPEN<br />
          PUNE, IND
        </div>
      </div>
    </div>
  )
}