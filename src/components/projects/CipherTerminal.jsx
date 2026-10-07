import React, { useState, useEffect } from 'react'
import anime from 'animejs'

const SEQUENCES = [
  {
    cmd: "Analyze main.py for security vulnerabilities",
    lines: [
      { text: "Reading main.py...", class: "text-blue", time: 600 },
      { text: "Scanning AST for known CVE patterns...", class: "text-blue", time: 1400 },
      { text: "Found 2 issues:", class: "", time: 2400 },
      { text: "  - Line 42: Hardcoded API key detected", class: "text-red", time: 2700 },
      { text: "  - Line 112: Use of eval() is unsafe", class: "text-red", time: 3000 },
      { text: "Would you like me to fix these? (y/n)", class: "text-dim", time: 3800 }
    ],
    duration: 6500
  },
  {
    cmd: "Generate a unit test for calculate_fibonacci",
    lines: [
      { text: "Drafting test_fibonacci.py...", class: "text-blue", time: 600 },
      { text: "def test_fibonacci_base_cases():", class: "text-green", time: 1600 },
      { text: "    assert calculate_fibonacci(0) == 0", class: "text-green", time: 1900 },
      { text: "    assert calculate_fibonacci(1) == 1", class: "text-green", time: 2200 },
      { text: "Test file created successfully.", class: "", time: 3200 }
    ],
    duration: 5500
  },
  {
    cmd: "Commit these changes with a message",
    lines: [
      { text: "Staging 2 files...", class: "text-blue", time: 600 },
      { text: "Analyzing diff to generate commit message...", class: "text-blue", time: 1400 },
      { text: "Commit: \"fix: secure API keys and eval usage\"", class: "", time: 2600 },
      { text: "Executing git commit...", class: "text-dim", time: 3400 },
      { text: "Changes committed successfully. [main 3a8b2c]", class: "text-green", time: 4200 }
    ],
    duration: 6500
  }
]

export default function CipherTerminal() {
  const [seqIndex, setSeqIndex] = useState(0)
  const [visibleLines, setVisibleLines] = useState([])
  const [typedCmd, setTypedCmd] = useState("")
  
  useEffect(() => {
    let isMounted = true
    const sequence = SEQUENCES[seqIndex]
    
    // Reset state for new sequence
    setVisibleLines([])
    setTypedCmd("")
    
    // Type out the command
    let charIdx = 0
    const typeInterval = setInterval(() => {
      if (charIdx <= sequence.cmd.length) {
        if (isMounted) setTypedCmd(sequence.cmd.slice(0, charIdx))
        charIdx++
      } else {
        clearInterval(typeInterval)
      }
    }, 40) // fast typing
    
    // Schedule response lines
    const timeouts = sequence.lines.map((line, idx) => {
      return setTimeout(() => {
        if (isMounted) {
          setVisibleLines(prev => [...prev, line])
        }
      }, line.time + (sequence.cmd.length * 40)) // start after typing finishes
    })
    
    // Schedule next sequence
    const nextTimeout = setTimeout(() => {
      if (isMounted) {
        setSeqIndex((prev) => (prev + 1) % SEQUENCES.length)
      }
    }, sequence.duration + (sequence.cmd.length * 40))
    
    return () => {
      isMounted = false
      clearInterval(typeInterval)
      timeouts.forEach(clearTimeout)
      clearTimeout(nextTimeout)
    }
  }, [seqIndex])

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <span className="terminal-title">cipher_cli.py</span>
      </div>
      <div className="terminal-body">
        <div className="term-line prompt">
          <span className="term-user">Cipher&gt; </span>
          <span className="term-cmd-typed">{typedCmd}</span>
          {visibleLines.length === 0 && <span className="term-cursor">_</span>}
        </div>
        
        <div className="ai-response">
          {visibleLines.map((line, i) => (
            <div key={i} className={`ai-res-line-visible ${line.class}`}>
              {line.text}
            </div>
          ))}
          {visibleLines.length > 0 && <span className="term-cursor mt-2">_</span>}
        </div>
      </div>
    </div>
  )
}
