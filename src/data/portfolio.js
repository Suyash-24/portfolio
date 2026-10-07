// ─── PROFILE ───────────────────────────────────────────────────────────────
export const profile = {
  name: 'Suyash Narawade',
  shortName: 'SN',
  initials: 'SN',
  title: 'Computer Engineering Student',
  focus: 'Data Science · Machine Learning · Python',
  location: 'Pune, Maharashtra, India',
  coords: '18°31′N / 73°51′E',
  email: 'iamnarawadesuyash@gmail.com',
  github: 'https://github.com/Suyash-24',
  linkedin: 'https://www.linkedin.com/in/suyashnarawade/',
  resume: '/portfolio/Suyash_resumee.pdf',
  status: 'Open to opportunities',
}

// ─── BIO ───────────────────────────────────────────────────────────────────
export const bio = {
  lead: 'Computer Engineering student turning raw data into decisions, and curiosity into code.',
  paragraphs: [
    'Hands-on experience building Python tools, automation scripts, and data analysis pipelines through personal projects. Comfortable with backend logic, data wrangling, and translating messy datasets into something readable.',
    'Interested in data-driven approaches to real-world problems. Actively seeking internships and entry-level opportunities in Data Science, Analytics, or related roles.',
  ],
  concepts: ['Python', 'Data', 'Machine Learning', 'Automation', 'Building'],
}

// ─── PROJECTS ──────────────────────────────────────────────────────────────
export const projects = [
  {
    id: 'eyecon',
    index: '01',
    name: 'IRIS',
    type: 'Multimodal AI / Computer Vision',
    tagline: 'eye tracking · hand gestures · voice commands',
    description: 'An AI-powered multimodal interaction system to control your computer using gaze, hand gestures, and voice commands through a unified decision layer.',
    detail: 'Built a PyQt6 desktop app integrating MediaPipe for 8 hand gestures, 36 voice commands, and eye-tracking. Features a unified AI decision engine for priority-based multimodal arbitration (Voice > Gesture > Eye).',
    stack: ['Python', 'PyQt6', 'MediaPipe', 'OpenCV', 'SQLite'],
    image: 'assets/project_eyecon.jpg',
    accent: '#5eead4',
    accentDim: 'rgba(94, 234, 212, 0.12)',
    github: 'https://github.com/Suyash-24/IRIS',
    signal: 'VISION / SYSTEM',
    category: 'ai-computer-vision',
    metrics: [
      { label: 'HAND GESTURES', val: '8 Tracked Motions' },
      { label: 'VOICE COMMANDS', val: '36 System Directives' },
      { label: 'ARCHITECTURE', val: 'AI Decision Engine & PyQt6 GUI' },
    ],
  },
  {
    id: 'cipher-cli',
    index: '02',
    name: 'Cipher Code',
    type: 'AI Coding Assistant',
    tagline: 'agentic ai · terminal ui · tool calling',
    description: 'An AI-powered coding assistant that provides a Claude Code-like interface for interacting with AI models to help with programming tasks, file operations, and code execution.',
    detail: 'Built with Python and the OpenRouter API. Features a beautiful rich terminal UI, transparent tool calling, file operations, direct Python execution, and graceful error management.',
    stack: ['Python', 'OpenAI API', 'Rich', 'Agentic AI', 'CLI'],
    image: 'assets/project_cipher.jpg',
    accent: '#818cf8',
    accentDim: 'rgba(129, 140, 248, 0.12)',
    github: 'https://github.com/Suyash-24/Cipher-Cli',
    signal: 'AI / CLI',
    category: 'ai-tools',
    metrics: [
      { label: 'MODELS', val: 'OpenRouter API Integration' },
      { label: 'INTERFACE', val: 'Interactive Rich Terminal UI' },
      { label: 'CAPABILITIES', val: 'File Operations & Code Execution' },
    ],
  },
  {
    id: 'eda',
    index: '03',
    name: 'Student Performance Analysis',
    type: 'Exploratory Data Analysis',
    tagline: 'pandas · matplotlib · seaborn · data visualization',
    description: 'An Exploratory Data Analysis (EDA) project analyzing how demographic and educational factors influence student exam scores.',
    detail: 'A comprehensive Python analysis featuring data cleaning, feature engineering, and statistical visualizations. It extracts actionable insights regarding test preparation, parental education, and demographics, alongside a Power BI dashboard.',
    stack: ['Python', 'Pandas', 'Seaborn', 'Jupyter', 'Power BI'],
    image: 'assets/project_eda.jpg',
    accent: '#a5c4ff',
    accentDim: 'rgba(165, 196, 255, 0.12)',
    github: 'https://github.com/Suyash-24/student-performance-eda',
    signal: 'DATA / EDA',
    category: 'analytics',
    metrics: [
      { label: 'DATASET', val: 'Kaggle (1000 student records)' },
      { label: 'INSIGHTS', val: 'Demographics & Test Prep' },
      { label: 'DELIVERABLES', val: 'EDA Notebook & Dashboard' },
    ],
  },
  {
    id: 'crawler',
    index: '04',
    name: 'Asynchronous Web Crawler',
    type: 'Backend Systems / Web Scraping',
    tagline: 'asyncio · aiohttp · beautifulsoup',
    description: 'A high-performance asynchronous web crawler that extracts structured data and topologies from websites using concurrent HTTP requests.',
    detail: 'Engineered with Python, asyncio, and aiohttp for rapid concurrent crawling. It implements breadth-first domain traversal, HTML DOM parsing with BeautifulSoup, configurable concurrency limits, and strict structural data extraction (headings, links, imagery) outputted to JSON reports.',
    stack: ['Python', 'asyncio', 'aiohttp', 'BeautifulSoup'],
    image: 'assets/project_crawler.jpg',
    accent: '#8be9fd',
    accentDim: 'rgba(139, 233, 253, 0.12)',
    github: 'https://github.com/Suyash-24/WebCrawler',
    signal: 'BACKEND / SCRAPER',
    category: 'systems',
    metrics: [
      { label: 'CONCURRENCY', val: 'Asyncio & aiohttp' },
      { label: 'EXTRACTION', val: 'BeautifulSoup4 DOM Parsing' },
      { label: 'DATA OUTPUT', val: 'Structured JSON Reports' },
    ],
  },
]

// ─── SKILLS ────────────────────────────────────────────────────────────────
export const skills = [
  { id: 'python',     label: 'Python',                category: 'Language',   level: 'Proficient', x: 18, y: 28, links: ['iris', 'cipher-cli', 'crawler', 'eda'] },
  { id: 'data',       label: 'Data Analysis',         category: 'Practice',   level: 'Proficient', x: 43, y: 18, links: ['iris', 'eda'] },
  { id: 'ml',         label: 'Machine Learning',      category: 'Practice',   level: 'Learning',   x: 69, y: 27, links: ['iris'] },
  { id: 'stats',      label: 'Math & Statistics',     category: 'Foundation', level: 'Learning',   x: 82, y: 53, links: ['iris', 'eda'] },
  { id: 'automation', label: 'Automation',            category: 'Systems',    level: 'Proficient', x: 62, y: 76, links: ['crawler', 'cipher-cli'] },
  { id: 'backend',    label: 'Backend Logic',         category: 'Systems',    level: 'Proficient', x: 28, y: 73, links: ['crawler', 'cipher-cli'] },
]

export const skillConnections = [
  ['python', 'data'],
  ['python', 'backend'],
  ['data', 'ml'],
  ['data', 'stats'],
  ['ml', 'stats'],
  ['ml', 'automation'],
  ['automation', 'backend'],
]

// ─── JOURNEY ───────────────────────────────────────────────────────────────
export const journey = [
  {
    year: '2022',
    chapter: '01',
    label: 'Engineering Foundations',
    phase: 'ENTRY',
    detail: 'Building the base: programming fundamentals, systems thinking, mathematics, and a sharpening instinct for what makes data useful.',
  },
  {
    year: '2024',
    chapter: '02',
    label: 'Python & Automation',
    phase: 'BUILD',
    detail: 'Small tools became a way to learn backend logic, automation patterns, and repeatable workflows that scale.',
  },
  {
    year: '2025',
    chapter: '03',
    label: 'Data Analytics',
    phase: 'EXPLORE',
    detail: 'Exploratory analysis turned raw data into patterns, questions, and decisions someone can act on.',
  },
  {
    year: '2026',
    chapter: '04',
    label: 'Machine Learning & Projects',
    phase: 'APPLY',
    detail: 'Turning foundational ML concepts into focused, testable personal projects with real-world datasets.',
  },
  {
    year: 'NOW',
    chapter: '05',
    label: "Building What's Next",
    phase: 'OPEN',
    detail: 'Looking for an internship or entry-level opportunity in Data Science, Analytics, or related roles.',
  },
]

// ─── MARQUEE ───────────────────────────────────────────────────────────────
export const marqueeItems = ['DATA SCIENCE', 'MACHINE LEARNING', 'PYTHON', 'ANALYTICS', 'STATISTICS', 'AUTOMATION', 'SYSTEMS THINKING', 'EDA']

export const navItems = [
  { id: 'profile',    label: 'Profile' },
  { id: 'systems',    label: 'Systems' },
  { id: 'trajectory', label: 'Trajectory' },
]

