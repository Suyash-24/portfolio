export const profile = {
  name: 'Suyash Narawade',
  shortName: 'SUYASH / 24',
  title: 'Computer Engineering Student | Data Science & Machine Learning | Mathematics & Statistics | Python | Analytics',
  location: 'Pune District, Maharashtra, India',
  email: 'iamnarawadesuyash@gmail.com',
  github: 'https://github.com/Suyash-24',
  linkedin: 'https://www.linkedin.com/in/suyashnarawade/',
  resume: '/Suyash_resumee.pdf',
}

export const bio = [
  'Computer Engineering student with a strong interest in Data Science and Machine Learning.',
  'Currently learning Python, data analysis, and foundational ML concepts. Hands-on experience with programming, backend logic, and automation through personal projects.',
  'Interested in applying data-driven approaches to solve real-world problems. Actively seeking internships and entry-level opportunities in Data Science, Analytics, or related roles.',
]

export const projects = [
  {
    id: 'iris',
    index: '01',
    name: 'IRIS',
    type: 'Applied ML / exploration',
    description: 'A focused machine-learning study that turns a classic dataset into a clear, testable classification workflow.',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Jupyter'],
    accent: '#e1ff4f',
    github: 'https://github.com/Suyash-24/IRIS',
    signal: 'learn / classify / explain',
  },
  {
    id: 'cipher-cli',
    index: '02',
    name: 'Cipher CLI',
    type: 'Python / systems thinking',
    description: 'A command-line cryptography playground for understanding transformations, inputs, and predictable automation.',
    stack: ['Python', 'CLI', 'Automation'],
    accent: '#ff765c',
    github: 'https://github.com/Suyash-24/Cipher-Cli',
    signal: 'encode / decode / repeat',
  },
  {
    id: 'eda',
    index: '03',
    name: 'Student Performance EDA',
    type: 'Analytics / storytelling',
    description: 'An exploratory data analysis project that looks for patterns in student performance and makes the evidence readable.',
    stack: ['Python', 'EDA', 'Statistics', 'Visualization'],
    accent: '#92b7ff',
    github: 'https://github.com/Suyash-24/student-performance-eda',
    signal: 'observe / compare / learn',
  },
  {
    id: 'crawler',
    index: '04',
    name: 'WebCrawler',
    type: 'Backend / automation',
    description: 'A practical crawler that explores the web as a graph: fetching, filtering, and turning raw pages into useful structure.',
    stack: ['Python', 'Requests', 'Parsing', 'Automation'],
    accent: '#bf9cff',
    github: 'https://github.com/Suyash-24/WebCrawler',
    signal: 'fetch / map / extract',
  },
]

export const skills = [
  { id: 'python', label: 'Python', category: 'language', level: 'building', x: 18, y: 28, links: ['iris', 'cipher-cli', 'crawler'] },
  { id: 'data', label: 'Data analysis', category: 'practice', level: 'building', x: 43, y: 18, links: ['iris', 'eda'] },
  { id: 'ml', label: 'Machine learning', category: 'practice', level: 'learning', x: 69, y: 27, links: ['iris', 'eda'] },
  { id: 'stats', label: 'Mathematics & statistics', category: 'foundation', level: 'learning', x: 82, y: 53, links: ['iris', 'eda'] },
  { id: 'automation', label: 'Automation', category: 'systems', level: 'building', x: 62, y: 76, links: ['crawler', 'cipher-cli'] },
  { id: 'backend', label: 'Backend logic', category: 'systems', level: 'building', x: 28, y: 73, links: ['crawler', 'cipher-cli'] },
]

export const journey = [
  { year: '2022', label: 'Computer Engineering', detail: 'Building the base: programming, systems, mathematics, and a sharper instinct for useful data.' },
  { year: '2024', label: 'Programming / Python', detail: 'Small tools became a way to learn backend logic, automation, and repeatable workflows.' },
  { year: '2025', label: 'Data Analytics', detail: 'Exploratory analysis turned raw data into patterns, questions, and decisions someone can act on.' },
  { year: '2026', label: 'Machine Learning / Projects', detail: 'Turning foundational ML concepts into focused, testable personal projects.' },
  { year: 'NOW', label: "Building what's next", detail: 'Looking for an internship or entry-level opportunity in Data Science, Analytics, or related roles.' },
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

export const marqueeItems = ['DATA', 'MACHINE LEARNING', 'PYTHON', 'ANALYTICS', 'MATHEMATICS', 'SYSTEMS']
