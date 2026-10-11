import { useState, useEffect } from 'react'

// Asset URLs to preload in background to ensure zero lag
const ASSET_IMAGES = [
  'assets/hero_poster.jpg',
  'assets/project_cipher.jpg',
  'assets/project_crawler.jpg',
  'assets/project_eda.jpg',
  'assets/project_iris.jpg',
  'assets/ice_texture.jpg',
]

// 7x5 Dot Matrix Digit Bitmaps (Spasoje.dev exact styling)
const DIGIT_MAP = {
  '0': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  '2': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  '3': [
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '4': [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  '5': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '6': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '7': [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  '8': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '9': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '%': [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1],
  ],
}

// 5x5 Dot Matrix Right Arrow (Spasoje.dev exact)
const ARROW_MAP = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
]

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)

  // 1. Asset preloading engine (zero-lag guarantee)
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

      // 3. WebGL warm-up microtask
      const warmPromise = new Promise((resolve) => {
        setTimeout(resolve, 150)
      })

      try {
        await Promise.all([fontPromise, ...imagePromises, warmPromise])
      } catch (e) {
        console.warn('Preload warning:', e)
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

  // 2. Spasoje-style realistic counter progression (approx 1.8s - 2.0s)
  useEffect(() => {
    const startTime = Date.now()
    const TARGET_DURATION = 1900

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(1, elapsed / TARGET_DURATION)
      
      // Authentic easing curve with quick jumps like spasoje.dev
      const easedProgress = Math.floor(Math.pow(progressRatio, 1.25) * 100)

      setPercent((prev) => {
        const maxCap = assetsReady ? 100 : 94
        const target = Math.min(maxCap, easedProgress)

        if (target > prev) {
          return target
        }

        if (prev >= 100) {
          clearInterval(timer)
          // Hold briefly at 100% then slide up smoothly like spasoje.dev
          setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => {
              if (onComplete) onComplete()
            }, 850)
          }, 300)
          return 100
        }

        return prev
      })
    }, 25)

    return () => clearInterval(timer)
  }, [assetsReady, onComplete])

  // Formatted string (3 digits + %) e.g. "000%", "047%", "100%"
  const percentStr = percent.toString().padStart(3, '0')
  const chars = [...percentStr.split(''), '%']

  return (
    <div
      id="spasoje-preloader"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-8 sm:p-14 lg:p-20 transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        background: '#EAEAEA',
        color: '#1E1E1E',
      }}
    >
      {/* Top spacer */}
      <div className="w-full flex justify-between items-center select-none" />

      {/* Main Center Area: Split Layout on Desktop, Centered on Mobile */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 my-auto select-none">
        
        {/* Left Side: FAKE LOADING... in Spasoje bright neon orange */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <span 
            className="font-mono text-xs sm:text-sm font-bold tracking-[0.28em] uppercase"
            style={{ color: '#FF5500' }}
          >
            INITIALIZING...
          </span>
        </div>

        {/* Right Side: Giant Spasoje Dot Matrix Numbers + SN●DEV */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
          <div className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px]">
            {/* Unified 7x5 Dot Matrix Display with padding to prevent any edge clipping */}
            <svg 
              viewBox="0 0 330 106" 
              className="w-full h-auto overflow-visible drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            >
              {chars.map((ch, idx) => {
                const matrix = DIGIT_MAP[ch] || DIGIT_MAP['0']
                const charOffsetX = 10 + idx * 80
                return matrix.map((row, r) =>
                  row.map((val, c) => {
                    if (!val) return null
                    return (
                      <circle
                        key={`${idx}-${r}-${c}`}
                        cx={charOffsetX + c * 14}
                        cy={11 + r * 14}
                        r={5.5}
                        fill="#1E1E1E"
                      />
                    )
                  })
                )
              })}
            </svg>
          </div>

          {/* SN●DEV label directly aligned below numbers */}
          <div className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] mt-3 flex justify-start">
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#1E1E1E] uppercase">
              SN●DEV
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Area: Dot Matrix Arrow on bottom-left */}
      <div className="w-full flex items-end justify-between select-none">
        <svg viewBox="0 0 76 76" className="w-9 h-9 sm:w-11 sm:h-11 overflow-visible">
          {ARROW_MAP.map((row, r) =>
            row.map((val, c) => {
              if (!val) return null
              return (
                <circle
                  key={`arrow-${r}-${c}`}
                  cx={10 + c * 14}
                  cy={10 + r * 14}
                  r={5}
                  fill="#1E1E1E"
                />
              )
            })
          )}
        </svg>
      </div>
    </div>
  )
}
