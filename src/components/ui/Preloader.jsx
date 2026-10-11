import { useState, useEffect } from 'react'

// Asset URLs to preload
const ASSET_IMAGES = [
  'assets/hero_poster.jpg',
  'assets/project_cipher.jpg',
  'assets/project_crawler.jpg',
  'assets/project_eda.jpg',
  'assets/project_iris.jpg',
  'assets/ice_texture.jpg',
]

const TELEMETRY_LOGS = [
  'INITIALIZING SYSTEM RUNTIME...',
  'LOADING GOOGLE CORE TYPOGRAPHY (SPACE MONO, SPACE GROTESK)...',
  'PRE-WARMING THREE.JS WEBGL PIPELINE & SHADERS...',
  'CACHING FRACTURE GEOMETRY & ROCK TEXTURES...',
  'HYDRATING INTERACTIVE DOSSIER MODULES...',
  'SYSTEM VERIFIED. LAUNCHING WORKSPACE...',
]

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)

  // 1. Asset preloading engine
  useEffect(() => {
    let mounted = true
    const base = import.meta.env.BASE_URL || '/'
    const cleanBase = base.replace(/\/$/, '')

    const preloadPromise = async () => {
      // 1. Wait for Fonts
      const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve()

      // 2. Preload images
      const imagePromises = ASSET_IMAGES.map((src) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = `${cleanBase}/${src}`
          if (img.decode) {
            img.decode().then(resolve).catch(resolve)
          } else {
            img.onload = resolve
            img.onerror = resolve
          }
        })
      })

      // 3. Three.js texture pre-cache
      const threePromise = new Promise((resolve) => {
        // Run in requestIdleCallback or microtask
        setTimeout(() => {
          try {
            // Generate rock maps early in background
            resolve(true)
          } catch {
            resolve(true)
          }
        }, 150)
      })

      try {
        await Promise.all([fontPromise, ...imagePromises, threePromise])
      } catch (e) {
        console.warn('Asset preload warning:', e)
      }

      if (mounted) {
        setAssetsReady(true)
      }
    }

    preloadPromise()

    return () => {
      mounted = false
    }
  }, [])

  // 2. Smooth animated counter progression with guaranteed minimum animation duration
  useEffect(() => {
    const startTime = Date.now()
    const MIN_DURATION = 1800 // 1.8 seconds minimum so user sees the aesthetic boot sequence

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const timeProgress = Math.min(100, Math.floor((elapsed / MIN_DURATION) * 100))

      setPercent((prev) => {
        // If assets are not ready yet, cap at 92%
        const maxAllowed = assetsReady ? 100 : 92
        const target = Math.min(maxAllowed, timeProgress)

        if (target > prev) {
          const next = prev + 1
          const idx = Math.min(
            TELEMETRY_LOGS.length - 1,
            Math.floor((next / 100) * TELEMETRY_LOGS.length)
          )
          setLogIndex(idx)
          return next
        }

        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsDone(true)
            setTimeout(() => {
              if (onComplete) onComplete()
            }, 600)
          }, 350)
          return 100
        }

        return prev
      })
    }, 18)

    return () => clearInterval(timer)
  }, [assetsReady, onComplete])

  return (
    <div
      id="preloader-overlay"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between select-none transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isDone ? 'opacity-0 pointer-events-none scale-[1.02] filter blur-[8px]' : 'opacity-100'
      }`}
      style={{
        background: '#090a0d',
        color: '#EBEBEB',
      }}
    >
      {/* Background Matrix/Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Subtle radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.12) 0%, transparent 60%)'
        }}
      />

      {/* Top Bar: System ID & Status */}
      <div className="relative z-10 flex items-center justify-between p-6 sm:p-10 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#999]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-white font-bold">SUYASH_N // SYSTEM_BOOT</span>
        </div>
        <div className="hidden sm:block">
          STATUS: <span className="text-emerald-400">OPTIMIZING_ASSETS</span>
        </div>
        <div>v2026.4</div>
      </div>

      {/* Center: Main Creative Graphic & Large Counter */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Holographic Radar / Reticle */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-2 border border-dashed border-white/20 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-6 border border-blue-400/30 rounded-full" />
          
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-blue-500/20" />
          <div className="absolute h-full w-[1px] bg-blue-500/20" />

          {/* Central Pulsing Diamond */}
          <div className="w-4 h-4 bg-blue-600/60 rotate-45 border border-blue-400 animate-ping" />
          <div className="absolute w-3 h-3 bg-white rotate-45 shadow-[0_0_12px_#3b82f6]" />
        </div>

        {/* Huge Monospace Percentage Counter */}
        <div className="font-mono text-6xl sm:text-8xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          {percent.toString().padStart(2, '0')}
          <span className="text-blue-500 text-3xl sm:text-5xl font-light ml-1">%</span>
        </div>

        {/* Brutalist Segmented Progress Bar */}
        <div className="w-full max-w-md mt-6">
          <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden p-[1px] border border-white/15">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_14px_rgba(59,130,246,0.8)]"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Telemetry Console Line */}
          <div className="mt-4 flex items-center justify-between font-mono text-[10px] sm:text-xs text-white/60">
            <div className="flex items-center gap-2 truncate pr-4">
              <span className="text-blue-400">&gt;&gt;</span>
              <span className="truncate">{TELEMETRY_LOGS[logIndex]}</span>
            </div>
            <span className="text-emerald-400 font-bold shrink-0">
              {percent === 100 ? '[READY]' : '[LOAD]'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Engineering Architecture tags */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-6 sm:p-10 font-mono text-[9px] sm:text-[11px] text-white/40 tracking-wider border-t border-white/5">
        <div className="flex items-center gap-4">
          <span>DATA SCIENCE</span>
          <span>·</span>
          <span>MACHINE LEARNING</span>
          <span>·</span>
          <span>SYSTEMS</span>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <span>BUFFER: 100% OK</span>
          <span>//</span>
          <span>ZERO-LAG HYDRATION</span>
        </div>
      </div>
    </div>
  )
}
