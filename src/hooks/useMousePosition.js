import { useState, useEffect } from 'react'

export function useMousePosition(elementRef) {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const el = elementRef ? elementRef.current : window

    const handler = (e) => {
      if (elementRef && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        setPosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      } else {
        setPosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        })
      }
    }

    const target = elementRef ? elementRef.current : window
    if (target) target.addEventListener('mousemove', handler)
    return () => { if (target) target.removeEventListener('mousemove', handler) }
  }, [elementRef])

  return position
}
