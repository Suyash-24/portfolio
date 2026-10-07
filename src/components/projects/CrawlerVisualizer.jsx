import React, { useState, useEffect } from 'react'
import anime from 'animejs'

const CRAWL_EXAMPLES = [
  {
    url: 'https://news.org/latest',
    dom: [
      { t: '<article>', indent: 0 },
      { t: '  <h1>Breaking News</h1>', indent: 1 },
      { t: '  <div class="author">By John Doe</div>', indent: 1 },
      { t: '  <p>Full story content here...</p>', indent: 1 },
      { t: '</article>', indent: 0 },
    ],
    json: `{\n  "url": "news.org/latest",\n  "type": "article",\n  "headline": "Breaking News",\n  "author": "John Doe"\n}`
  },
  {
    url: 'https://shop.net/item/123',
    dom: [
      { t: '<div class="product">', indent: 0 },
      { t: '  <h2 class="title">Wireless Headphones</h2>', indent: 1 },
      { t: '  <span class="price">$99.99</span>', indent: 1 },
      { t: '  <button>Add to Cart</button>', indent: 1 },
      { t: '</div>', indent: 0 },
    ],
    json: `{\n  "url": "shop.net/item/123",\n  "product": "Wireless Headphones",\n  "price": 99.99,\n  "in_stock": true\n}`
  },
  {
    url: 'https://example.com/about',
    dom: [
      { t: '<main>', indent: 0 },
      { t: '  <h1>About Us</h1>', indent: 1 },
      { t: '  <p>We are a tech company...</p>', indent: 1 },
      { t: '  <a href="/contact">Contact</a>', indent: 1 },
      { t: '</main>', indent: 0 },
    ],
    json: `{\n  "url": "example.com/about",\n  "heading": "About Us",\n  "links": ["/contact"]\n}`
  }
]

export default function CrawlerVisualizer() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let anim

    const playSequence = async () => {
      anim = anime.timeline({
        complete: () => {
          setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % CRAWL_EXAMPLES.length)
          }, 800)
        }
      })

      // 1. Initial State: URL appears
      anim.add({
        targets: '.crawler-url-box',
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 400,
        easing: 'easeOutQuad'
      })

      // 2. Fetching / Loading pulse
      .add({
        targets: '.crawler-pulse-line',
        scaleX: [0, 1],
        opacity: [0, 1, 0],
        duration: 600,
        easing: 'easeInOutSine'
      })

      // 3. HTML DOM structure appears
      .add({
        targets: '.crawler-dom-node-anim',
        opacity: [0, 1],
        translateX: [-15, 0],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutExpo'
      }, '-=200')
      
      // 3b. Arrow appears
      .add({
        targets: '.crawler-arrow',
        opacity: [0, 0.8],
        duration: 400,
        easing: 'easeOutQuad'
      }, '-=400')

      // 4. Scanner line sweeps down
      .add({
        targets: '.crawler-scanner-beam',
        top: ['-20%', '110%'],
        opacity: [0, 1, 1, 0],
        duration: 1500,
        easing: 'linear'
      }, '-=200')

      // 4b. Highlight code as scanner passes
      .add({
        targets: '.crawler-dom-node-anim span',
        color: ['#4ec9b0', '#fff', '#4ec9b0'],
        textShadow: ['none', '0 0 8px rgba(255,255,255,0.8)', 'none'],
        duration: 400,
        delay: anime.stagger(150),
        easing: 'easeInOutSine'
      }, '-=1400')

      // 5. Data transforms into JSON box
      .add({
        targets: '.crawler-json-box',
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 600,
        easing: 'easeOutBack'
      }, '-=400')

      // 6. Fade out for next cycle
      .add({
        targets: '.crawler-url-box, .crawler-dom-tree, .crawler-arrow, .crawler-json-box',
        opacity: [1, 0],
        duration: 400,
        delay: 1500,
        easing: 'easeInOutQuad'
      })
    }

    playSequence()

    return () => {
      if (anim) anim.pause()
    }
  }, [currentIndex])

  const currentExample = CRAWL_EXAMPLES[currentIndex]

  return (
    <div className="crawler-viz-wrapper">
      <div className="crawler-scene">
        
        {/* Left Side: URL & HTML */}
        <div className="crawler-input-side">
          <div className="crawler-url-box">
            <span className="url-method">GET</span>
            <span className="url-text">{currentExample.url}</span>
          </div>

          <div className="crawler-pulse-line"></div>

          <div className="crawler-dom-tree" style={{ opacity: 0 }}>
            <div className="crawler-scanner-beam"></div>
            {currentExample.dom.map((line, i) => (
              <div key={i} className="crawler-dom-node-anim" style={{ paddingLeft: `${line.indent * 12}px` }}>
                <span>{line.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="crawler-arrow">
          ➜
        </div>

        {/* Right Side: JSON Output */}
        <div className="crawler-output-side">
          <div className="crawler-json-box">
            <div className="json-header">report.json</div>
            <pre className="json-content">
{currentExample.json}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}
