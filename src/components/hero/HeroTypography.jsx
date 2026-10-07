import { useEffect, useRef } from "react"
import gsap from "gsap"

const SKILLS = [
  "PYTHON",
  "DATA SCIENCE",
  "MACHINE LEARNING",
  "SQL",
  "STATISTICS"
]

export default function HeroTypography() {
  const containerRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    // Disable on touch devices to preserve static elegance
    if (window.matchMedia('(pointer: coarse)').matches) return

    const container = containerRef.current
    if (!container) return

    // Setup quickTo for each item for ultra-smooth performance
    const animations = itemsRef.current.map(el => {
      return {
        el,
        xTo: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        yTo: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        scaleXTo: gsap.quickTo(el, "scaleX", { duration: 0.8, ease: "power3.out" }),
        scaleYTo: gsap.quickTo(el, "scaleY", { duration: 0.8, ease: "power3.out" }),
        opacityTo: gsap.quickTo(el, "opacity", { duration: 0.8, ease: "power3.out" }),
      }
    })

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      
      let closestIdx = -1
      let minDistance = Infinity

      animations.forEach((anim, i) => {
        const rect = anim.el.getBoundingClientRect()
        // Center of the word
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const dx = clientX - centerX
        const dy = clientY - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < minDistance) {
          minDistance = dist
          closestIdx = i
        }

        // Max influence distance
        const maxDist = 400
        const influence = Math.max(0, 1 - dist / maxDist) // 0 to 1

        // Subtle displacement away from cursor and scale up
        const moveX = (dx / dist) * -15 * influence
        const moveY = (dy / dist) * -15 * influence
        const scale = 1 + (0.1 * influence)
        const opacity = 0.35 + (0.65 * Math.pow(influence, 1.5))
        
        anim.xTo(moveX || 0)
        anim.yTo(moveY || 0)
        anim.scaleXTo(scale)
        anim.scaleYTo(scale)
        anim.opacityTo(opacity)
      })

      // Add coral accent to the absolute closest item if within range
      animations.forEach((anim, i) => {
        if (i === closestIdx && minDistance < 150) {
          anim.el.classList.add('hero-typo--active')
        } else {
          anim.el.classList.remove('hero-typo--active')
        }
      })
    }

    const handleMouseLeave = () => {
      animations.forEach(anim => {
        anim.xTo(0)
        anim.yTo(0)
        anim.scaleXTo(1)
        anim.scaleYTo(1)
        anim.opacityTo(0.35)
        anim.el.classList.remove('hero-typo--active')
      })
    }

    // Attach to window so the entire screen acts as the field
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    // Set initial static state
    handleMouseLeave()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="hero__typography-list" ref={containerRef} aria-hidden="true">
      {SKILLS.map((skill, i) => (
        <div 
          key={skill} 
          className="hero__typography-item"
          ref={el => itemsRef.current[i] = el}
        >
          {skill}
          <span className="hero__typography-dot" />
        </div>
      ))}
    </div>
  )
}
