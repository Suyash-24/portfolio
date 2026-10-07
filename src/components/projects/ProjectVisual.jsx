import React, { useEffect, useRef } from 'react'
import anime from 'animejs'
import ThreeParticleSphere from './ThreeParticleSphere'
import CipherTerminal from './CipherTerminal'
import EdaDashboard from './EdaDashboard'
import CrawlerVisualizer from './CrawlerVisualizer'

export default function ProjectVisual({ id }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let anim

    if (id === 'eyecon') {
      // Handled by ThreeParticleSphere
    } 
    else if (id === 'cipher-cli') {
      // Handled by CipherTerminal React state
    }
    else if (id === 'eda') {
      // Handled by EdaDashboard component
    }
    else if (id === 'crawler') {
      // Handled by CrawlerVisualizer
    }

    return () => {
      if (anim) anim.pause()
    }
  }, [id])

  // RENDERS
  if (id === 'eyecon') {
    return (
      <div ref={containerRef} className="project-visual-wrapper">
        <ThreeParticleSphere />
      </div>
    )
  }

  if (id === 'cipher-cli') {
    return (
      <div ref={containerRef} className="project-visual-wrapper cipher-visual">
        <CipherTerminal />
      </div>
    )
  }

  if (id === 'eda') {
    return (
      <div ref={containerRef} className="project-visual-wrapper eda-visual">
        <EdaDashboard />
      </div>
    )
  }

  if (id === 'crawler') {
    return (
      <div ref={containerRef} className="project-visual-wrapper crawler-visual">
        <CrawlerVisualizer />
      </div>
    )
  }

  return null
}
