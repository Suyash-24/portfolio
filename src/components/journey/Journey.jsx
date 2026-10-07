import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { journey } from '../../data/portfolio'



export default function Journey() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Scale the height of the glowing line based on scroll
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section id="journey" className="section" data-section="journey">

      {/* Section header */}
      <div className="section-head reveal">
        <span className="section-label">trajectory_</span>
        <span className="section-meta">Timeline / 03</span>
      </div>

      {/* Literal Treasure Map Container */}
      <div ref={containerRef} className="treasure-map-board relative w-full mt-16" style={{ height: '1400px' }}>
        
        {/* SVG Winding Dotted Path */}
        <svg className="absolute inset-0 w-full h-full block" preserveAspectRatio="none" viewBox="0 0 1000 1400">
          <path
            d="M 200 140 C 600 140, 800 240, 800 420 C 800 600, 300 500, 200 700 C 100 900, 100 800, 300 980 C 500 1100, 500 1200, 500 1330"
            fill="none"
            stroke="var(--ink-blue)"
            strokeWidth="4"
            strokeDasharray="8 8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Scroll Reveal Curtain for the Line */}
        <motion.div 
          className="absolute inset-0 w-full bg-[var(--bg-section)] origin-bottom z-0"
          style={{ 
            height: useTransform(scrollYProgress, [0, 1], ["100%", "0%"]),
            top: 'auto',
            bottom: 0
          }}
        />

        {journey.map((j, index) => {
          // Exact coordinates for 1400px tall map
          const points = [
            { y: 140, x: 20, align: 'right',   scrollTrigger: 0.10 },
            { y: 420, x: 80, align: 'left',    scrollTrigger: 0.30 },
            { y: 700, x: 20, align: 'right',   scrollTrigger: 0.50 },
            { y: 980, x: 30, align: 'right',   scrollTrigger: 0.70 },
            { y: 1330, x: 50, align: 'center', scrollTrigger: 0.95 },
          ]
          const pos = points[index]
          const isFinal = index === journey.length - 1

          // Drive card appearance strictly mathematically off scrollYProgress
          const opacity = useTransform(scrollYProgress, [pos.scrollTrigger - 0.05, pos.scrollTrigger], [0, 1])
          const scale = useTransform(scrollYProgress, [pos.scrollTrigger - 0.05, pos.scrollTrigger], [0.5, 1])

          return (
            <div key={j.chapter}>
              {/* The EXACT Point on the Line */}
              <motion.div 
                className="absolute z-10"
                style={{ 
                  top: pos.y, 
                  left: `${pos.x}%`, 
                  transform: 'translate(-50%, -50%)',
                  opacity,
                  scale
                }}
              >
                <div className="map-marker relative flex justify-center items-center">
                  {isFinal ? (
                    <span className="text-red-500 font-bold text-4xl pirate-x" style={{ textShadow: '0 0 15px rgba(239,68,68,0.6)' }}>✖</span>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-[4px] border-[var(--bg-section)] shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                  )}
                </div>
              </motion.div>

              {/* The Map Legend / Card positioned relative to the point */}
              <motion.div
                className={`absolute w-[280px] md:w-[320px] z-20 ${
                  pos.align === 'left' ? 'pr-8 -translate-x-full' : 
                  pos.align === 'right' ? 'pl-8' : 
                  '-translate-x-1/2 pt-10'
                }`}
                style={{ 
                  top: pos.y, 
                  left: `${pos.x}%`,
                  marginTop: pos.align !== 'center' ? '-40px' : '0',
                  opacity,
                  scale
                }}
              >
                <div className={`map-card p-4 bg-[var(--bg-section)]/95 backdrop-blur-md border-2 ${isFinal ? 'border-red-500/30' : 'border-[var(--ink-blue)]/20'} rounded-lg shadow-2xl transition-transform hover:-translate-y-1`}>
                  <div className={`${isFinal ? 'text-red-500' : 'text-[var(--ink-blue)]'} font-bold font-mono text-sm tracking-widest mb-1`}>
                    {j.year}
                  </div>
                  <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight mb-2 uppercase tracking-tighter">
                    {j.label}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {j.detail}
                  </p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

    </section>
  )
}
