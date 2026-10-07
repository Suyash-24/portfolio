import { useState } from 'react'
import { skills, projects } from '../../data/portfolio'

const CAPABILITY_PILLARS = [
  {
    index: '01',
    category: 'MACHINE LEARNING',
    title: 'Applied Classification & Model Evaluation',
    tagline: 'Supervised Learning · Cross-Validation · Metrics',
    description: 'Constructing robust classification workflows from classical and multi-dimensional datasets. Systematic benchmarking of algorithms, hyperparameter adjustments, and confusion matrix diagnostics to ensure high precision.',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter', 'NumPy'],
    metric: '99.2% Test Accuracy Benchmark',
    linkedProject: 'iris',
    projectName: 'IRIS Classification Engine',
    projectUrl: 'https://github.com/Suyash-24/IRIS',
  },
  {
    index: '02',
    category: 'SYSTEMS & CRYPTOGRAPHY',
    title: 'Algorithmic CLI Architectures',
    tagline: 'Modular Logic · Strict I/O Contracts · Automation',
    description: 'Engineering command-line interfaces for algorithmic transformations. Implementing classical cipher engines (Caesar, Vigenère, Atbash) with modular Python abstractions and deterministic terminal feedback.',
    stack: ['Python', 'CLI Tooling', 'Cryptography', 'Automation'],
    metric: 'Zero-Dependency Unix Tooling',
    linkedProject: 'cipher-cli',
    projectName: 'Cipher CLI Tool',
    projectUrl: 'https://github.com/Suyash-24/Cipher-Cli',
  },
  {
    index: '03',
    category: 'QUANTITATIVE ANALYTICS',
    title: 'Exploratory Data Analysis & Storytelling',
    tagline: 'Variance Analysis · Correlation · Visual Inference',
    description: 'Transforming messy multi-feature survey and demographic datasets into unambiguous visual evidence. Isolating high-correlation variables, outlier distributions, and actionable academic performance indicators.',
    stack: ['Pandas', 'Matplotlib', 'Seaborn', 'Statistics', 'EDA'],
    metric: 'Multi-Feature Correlation Analysis',
    linkedProject: 'eda',
    projectName: 'Student Performance EDA',
    projectUrl: 'https://github.com/Suyash-24/student-performance-eda',
  },
  {
    index: '04',
    category: 'GRAPH AUTOMATION',
    title: 'Web Graph Traversal & Parsing',
    tagline: 'Directed Graphs · BFS Crawling · Schema Extraction',
    description: 'Designing crawler engines that model the web as a directed graph. Implementing breadth-first search traversals, strict domain boundaries, and parsing raw HTML into structured relational records.',
    stack: ['Python', 'Requests', 'BeautifulSoup', 'Graph Algorithms'],
    metric: '50,000+ Discovered Graph Nodes',
    linkedProject: 'crawler',
    projectName: 'WebCrawler Graph Engine',
    projectUrl: 'https://github.com/Suyash-24/WebCrawler',
  },
]

export default function Signal() {
  const [activePillar, setActivePillar] = useState(null)

  return (
    <section
      className="signal scene bg-[#08090d] text-[#f7f5f0]"
      id="signal"
      data-section="signal"
      aria-label="Capabilities and Engineering Signal"
    >
      {/* Scene Header */}
      <div className="scene__label border-t border-white/10 pt-4 mb-16 flex justify-between items-center text-xs font-mono uppercase tracking-[0.18em] text-[#9ca3af]">
        <span>II — CAPABILITIES & SYSTEM ARCHITECTURE</span>
        <span className="font-sans normal-case text-white/50">High-contrast engineering matrix</span>
      </div>

      {/* Section Head: Bold Editorial Typography (Gertix & Bermawy Inspired) */}
      <div className="max-w-4xl mb-16">
        <div className="flex items-center gap-3 mb-4 text-xs font-mono uppercase tracking-[0.24em] text-[#5eead4]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] shadow-[0_0_10px_#5eead4]" />
          <span>TECHNICAL FOUNDATIONS</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white leading-[1.02] tracking-tight mb-6">
          Deterministic systems,{' '}
          <span className="italic font-light text-[#fde68a]">engineered with rigor.</span>
        </h2>
        <p className="font-sans text-base sm:text-lg text-[#9ca3af] leading-relaxed max-w-2xl">
          A structured matrix across applied machine learning, automation pipelines, and analytical data engineering. Every module isolates decisive signal from noise.
        </p>
      </div>

      {/* Structured 4-Card Architectural Grid (Gertix Hairline Grid with Crosshair Indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10 divide-y md:divide-y-0 divide-white/10 bg-[#08090d]">
        {CAPABILITY_PILLARS.map((pillar, i) => {
          const isRight = i % 2 === 1
          const isBottom = i >= 2
          return (
            <article
              key={pillar.index}
              onMouseEnter={() => setActivePillar(pillar.index)}
              onMouseLeave={() => setActivePillar(null)}
              className={`group relative p-8 sm:p-12 transition-all duration-300 hover:bg-white/[0.03] flex flex-col justify-between ${
                isRight ? 'md:border-l md:border-white/10' : ''
              } ${isBottom ? 'md:border-t md:border-white/10' : ''}`}
            >
              {/* Corner Crosshair Accent (+) */}
              <span className="absolute top-4 right-4 font-mono text-xs text-white/20 group-hover:text-[#5eead4] transition-colors select-none">
                +
              </span>

              {/* Top Meta: Index & Category */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-widest text-[#5eead4]">
                    {pillar.index} // {pillar.category}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                    SYSTEM SPEC
                  </span>
                </div>

                <h3 className="font-sans text-2xl sm:text-3xl font-normal text-white leading-snug mb-3 group-hover:text-[#fde68a] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs font-mono tracking-wider text-[#9ca3af] uppercase mb-6">
                  {pillar.tagline}
                </p>

                <p className="font-sans text-sm sm:text-base text-[#9ca3af] leading-relaxed mb-8">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom Meta: Stack Pills & Live Repository Link */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {pillar.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-full border border-white/15 text-white/80 whitespace-nowrap bg-white/[0.02]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#5eead4] tracking-wider">
                    {pillar.metric}
                  </span>
                  <a
                    href={pillar.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white group-hover:text-[#fde68a] transition-colors"
                  >
                    <span>View Repository</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Architectural Capabilities Footer / Summary Strip */}
      <div className="mt-12 p-6 border border-white/10 rounded-sm bg-white/[0.015] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#5eead4] animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-white">
            COMPUTATIONAL WORKSPACE · ACTIVE CODE REPOSITORIES
          </span>
        </div>
        <a
          href="https://github.com/Suyash-24"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono uppercase tracking-widest text-[#fde68a] hover:underline"
        >
          Explore all open-source repositories on GitHub →
        </a>
      </div>
    </section>
  )
}
