import { useEffect, useRef } from 'react'

// Custom cursor — ink blue dot + ring (matches new design system)
export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  let mouseX = 0, mouseY = 0
  let ringX = 0,  ringY = 0

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
    }
    window.addEventListener('mousemove', onMove)

    // Lag ring behind dot
    let animId
    const loop = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    // Ring expand on hover
    const handleEnter = (e) => {
      const el = e.target
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button')) {
        ring.style.width  = '44px'
        ring.style.height = '44px'
        ring.style.borderColor = 'rgba(29,78,216,0.7)'
      }
    }
    const handleLeave = () => {
      ring.style.width  = '26px'
      ring.style.height = '26px'
      ring.style.borderColor = 'rgba(29,78,216,0.45)'
    }
    document.addEventListener('mouseover', handleEnter)
    document.addEventListener('mouseout',  handleLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', handleEnter)
      document.removeEventListener('mouseout',  handleLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
