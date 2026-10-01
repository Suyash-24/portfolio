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
    id: 'iris',
    index: '01',
    name: 'IRIS',
    type: 'Applied ML / Classification',
    tagline: 'learn · classify · explain',
    description: 'A focused machine-learning study that turns a classic dataset into a clear, testable classification workflow.',
    detail: 'Trained and evaluated multiple classifiers on the Iris dataset. Compared accuracy, built a clean analysis pipeline, and documented every step for reproducibility.',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Jupyter'],
    accent: '#c8ff40',
    accentDim: 'rgba(200,255,64,0.12)',
    github: 'https://github.com/Suyash-24/IRIS',
    signal: 'ML / CLASSIFICATION',
    category: 'machine-learning',
  },
  {
    id: 'cipher-cli',
    index: '02',
    name: 'Cipher CLI',
    type: 'Python / Systems',
    tagline: 'encode · decode · repeat',
    description: 'A command-line cryptography playground for understanding transformations, inputs, and predictable automation.',
    detail: 'Implements classical cipher algorithms (Caesar, Vigenère, Atbash) through a clean CLI interface. Emphasis on clear input/output contracts and repeatable workflows.',
    stack: ['Python', 'CLI', 'Cryptography', 'Automation'],
    accent: '#ff7a5c',
    accentDim: 'rgba(255,122,92,0.12)',
    github: 'https://github.com/Suyash-24/Cipher-Cli',
    signal: 'CRYPTO / SYSTEMS',
    category: 'systems',
  },
  {
    id: 'eda',
    index: '03',
    name: 'Student Performance EDA',
    type: 'Analytics / Storytelling',
    tagline: 'observe · compare · learn',
    description: 'An exploratory data analysis project that looks for patterns in student performance data and makes the evidence readable.',
    detail: 'Cleaned and analyzed a real-world education dataset. Used Pandas and Matplotlib to surface correlations, distributions, and actionable insights.',
    stack: ['Python', 'Pandas', 'Matplotlib', 'Statistics'],
    accent: '#88b4ff',
    accentDim: 'rgba(136,180,255,0.12)',
    github: 'https://github.com/Suyash-24/student-performance-eda',
    signal: 'DATA / EDA',
    category: 'analytics',
  },
  {
    id: 'crawler',
    index: '04',
    name: 'WebCrawler',
    type: 'Backend / Automation',
    tagline: 'fetch · parse · map',
    description: 'A practical crawler that explores the web as a graph — fetching, filtering, and turning raw pages into useful structure.',
    detail: 'Breadth-first crawl with configurable depth limits and domain filtering. Outputs a structured map of discovered pages and their relationships.',
    stack: ['Python', 'Requests', 'BeautifulSoup', 'Automation'],
    accent: '#c099ff',
    accentDim: 'rgba(192,153,255,0.12)',
    github: 'https://github.com/Suyash-24/WebCrawler',
    signal: 'BACKEND / GRAPH',
    category: 'systems',
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

// ─── NAV ───────────────────────────────────────────────────────────────────
export const navItems = [
  { id: 'about',    label: 'Profile',    index: '01' },
  { id: 'signal',   label: 'Signal',     index: '02' },
  { id: 'work',     label: 'Work',       index: '03' },
  { id: 'journey',  label: 'Trajectory', index: '04' },
  { id: 'contact',  label: 'Contact',    index: '05' },
]
