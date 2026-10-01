import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [state, setState] = useState('default') // default | link | project | explore | email

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current

    // Initial visibility
    gsap.set([dot, ring], { opacity: 0 })

    let isVisible = false

    const enter = () => {
      if (!isVisible) {
        isVisible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 })
      }
    }

    const move = (e) => {
      enter()
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.55, ease: 'power3.out' })
    }

    const over = (e) => {
      const target = e.target.closest('a, button, [data-cursor], input, textarea')
      if (!target) { setState('default'); return }
      const type = target.dataset.cursor
      if (type === 'project') setState('project')
      else if (type === 'email') setState('email')
      else if (type === 'explore') setState('explore')
      else setState('link')
    }

    const out = (e) => {
      const from = e.target.closest('a, button, [data-cursor], input, textarea')
      if (!from || from.contains(e.relatedTarget)) return
      setState('default')
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])

  return (
    <>
      <div className={`c-cursor-dot c-cursor-dot--${state}`} ref={dotRef} />
      <div className={`c-cursor-ring c-cursor-ring--${state}`} ref={ringRef} />
    </>
  )
}
