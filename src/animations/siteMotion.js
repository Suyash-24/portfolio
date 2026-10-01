import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function splitReveal(container) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const items = container.querySelectorAll('[data-reveal]')
  items.forEach((item, index) => {
    gsap.fromTo(item,
      { y: 40, opacity: 0, rotate: 1.5 },
      { y: 0, opacity: 1, rotate: 0, duration: 0.9, delay: index * 0.04, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%', once: true } },
    )
  })
}

export function createSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false })
  let raf
  const tick = (time) => {
    lenis.raf(time * 1000)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  lenis.on('scroll', ScrollTrigger.update)

  return () => {
    if (raf) cancelAnimationFrame(raf)
    lenis.destroy()
  }
}

export { gsap, ScrollTrigger }
