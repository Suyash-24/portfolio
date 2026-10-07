const fs = require('fs');
const css = `
/* PROJECT VISUALS - ABSTRACT DATA ANIMATIONS */
.project-visual-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-section-alt);
}

/* IRIS: Scatter Plot */
.iris-visual .abstract-grid {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: center;
  justify-content: center;
}
.iris-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  opacity: 0;
  mix-blend-mode: multiply;
}

/* CIPHER CLI: Shifting Text */
.cipher-visual .cipher-text-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: #111;
  font-weight: 700;
}
.cipher-line {
  background: rgba(0,0,0,0.04);
  padding: 4px 8px;
  border-left: 2px solid var(--ink-blue);
  opacity: 0.2;
}

/* EDA: Equalizer Bars */
.eda-visual .eda-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}
.eda-bar {
  width: 24px;
  background: var(--ink-blue);
  opacity: 0.8;
  border-radius: 4px 4px 0 0;
}

/* CRAWLER: Node Network Pulse */
.crawler-visual .crawler-nodes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  position: relative;
}
.crawler-nodes::before {
  content: '';
  position: absolute;
  top: 50%; left: 15px; right: 15px;
  height: 1px;
  background: var(--border);
  z-index: 0;
}
.crawl-node {
  width: 18px;
  height: 18px;
  background: var(--text-primary);
  border-radius: 50%;
  position: relative;
  z-index: 1;
}
`;

fs.appendFileSync('src/styles.css', css);
console.log('Appended CSS successfully!');
