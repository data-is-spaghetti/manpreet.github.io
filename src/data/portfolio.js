// ════════════════════════════════════════════════════════════════
//  PORTFOLIO DATA — "The Geometry of Spacetime"
//
//  To add a new project: just append to the `projects` array.
//  The 3D layout is computed automatically (Fibonacci sphere) so
//  no manual coordinate tuning is needed as the list grows.
// ════════════════════════════════════════════════════════════════

export const profile = {
  name: "Manpreet Kaur",
  role: "Software Engineer",
  // Humble, technical, has the blinking cursor effect.
  // Reads like a git log entry or a status line, not a self-mythologizing one-liner.
  coreVector: "// shipping, learning, repeat.",
  location: "Bengaluru, IN",
  origin: "12.9716°N, 77.5946°E",
  resumePath: "Manpreet_Kaur_Resume.pdf",
};

export const socials = [
  { label: "GITHUB",   handle: "thefireflysparkle",  url: "https://github.com/thefireflysparkle" },
  { label: "LINKEDIN", handle: "kaurmanpreet013",    url: "https://www.linkedin.com/in/kaurmanpreet013/" },
  { label: "EMAIL",    handle: "kaur.exe@gmail.com", url: "mailto:kaur.exe@gmail.com" },
  { label: "SUBSTACK", handle: "thefireflysparkle",  url: "https://substack.com/@thefireflysparkle" },
];

// ── Section 0x00: MAIN ENGINE (Hero) ──
export const engine = {
  statement:
    "I design and ship full-stack systems: APIs, distributed services, and the interfaces on top of them.",
  // Smaller, factual readouts. Less "boastful spec sheet", more "git status".
  // The big chunky numbers are dialed down; the notes carry the real info.
    specs: [
    { key: "EXP",    value: "4y",        note: "production" },
    { key: "STACK",  value: "js · ts",   note: "+ py, c#, sql" },
    { key: "FOCUS",  value: "full-stack", note: "APIs · microservices" },
    { key: "STATUS", value: "shipping",  note: "open to roles" },
  ],
};

// ── Section 0x01: PROOFS & IMPLEMENTATIONS (Projects) ──
// To add a project: append a new object. Position is computed automatically.
// `id` is auto-generated from index in ProjectNodes.jsx (0x01.A, 0x01.B, ...).
export const projects = [
  {
    title: "WalletX",
    org: "Independent",
    subtitle: "Wealth-Partitioning OS",
    year: "2025",
    summary:
      "A non-custodial financial OS that lets users architect every rupee across purpose-built partitions.",
    architecture:
      "Cash, equity, crypto, and hard assets under one unified ledger. Built on a PERN + TypeScript stack chosen for ACID correctness (Postgres NUMERIC, Decimal.js) rather than convenience. Day-0 architecture covers cash partitions, transfers, and a per-partition encryption-key security model.",
    metrics: [
      { label: "PARTITIONS", value: "dynamic" },
      { label: "MONEY",      value: "decimal-safe" },
      { label: "ACID",       value: "strict" },
    ],
    stack: ["TypeScript", "React", "Fastify", "PostgreSQL", "Prisma", "Redis", "Zod"],
    links: [{ label: "GITHUB", url: "https://github.com/thefireflysparkle" }],
  },
  {
    title: "Caffèhop",
    org: "Independent",
    subtitle: "Coffee discovery & identity",
    year: "2025",
    summary:
      "A coffee-first discovery and identity platform — sign up, verify, and build a profile around the cafés you visit.",
    architecture:
      "Next.js 14 App Router frontend, Express + MongoDB backend, email and phone OTP with refresh-token rotation. Hashed OTP storage with 10-minute TTL, httpOnly cookie sessions, JWT access tokens.",
    metrics: [
      { label: "OTP",    value: "6-digit · 10min" },
      { label: "TOKENS", value: "rotated" },
      { label: "AUTH",   value: "email + phone" },
    ],
    stack: ["Next.js 14", "React", "TypeScript", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS"],
    links: [{ label: "GITHUB", url: "https://github.com/thefireflysparkle" }],
  },
  {
    title: "CodeLens",
    org: "Independent",
    subtitle: "Multi-agent code review CLI",
    year: "2025",
    summary:
      "A developer tool that runs code reviews through LLMs, with a pluggable provider backend.",
    architecture:
      "Provider abstraction over Ollama, Gemini, Mistral. RAG pipeline over codebase context, token-by-token SSE streaming, multi-agent orchestration (context agent + review agent). One-line install with a pre-push git hook. Published to npm.",
    metrics: [
      { label: "PROVIDERS", value: "3+" },
      { label: "STREAM",    value: "SSE" },
      { label: "AGENTS",    value: "multi" },
    ],
    stack: ["TypeScript", "Node.js", "LLM APIs", "RAG", "Vector Search", "SSE"],
    links: [
      { label: "GITHUB", url: "https://github.com/thefireflysparkle" },
      { label: "NPM", url: "https://www.npmjs.com/package/@thefireflysparkle/codelens-cli" },
    ],
  },
  {
    title: "Stellarcast",
    org: "Independent",
    subtitle: "Real-time astronomy overlay",
    year: "2025",
    summary:
      "A Chrome MV3 extension overlaying live astronomical data onto the browser.",
    architecture:
      "Service-worker pipeline syncing open APIs every 60s. 8K+ data points rendered via instanced Three.js meshes at 60fps, with spatial hashing for sub-millisecond lookups.",
    metrics: [
      { label: "POINTS", value: "8K+" },
      { label: "RENDER", value: "60fps" },
      { label: "LOOKUP", value: "<1ms" },
    ],
    stack: ["TypeScript", "Three.js", "Service Workers", "Chrome MV3"],
    links: [{ label: "GITHUB", url: "https://github.com/thefireflysparkle" }],
  },
  {
    title: "Algorithmic Trading Platform",
    org: "Independent",
    subtitle: "Automated trading system",
    year: "2025",
    summary:
      "An automated trading system: market-data ingestion, strategy backtesting, and live order execution.",
    architecture:
      "Event-driven pipeline ingesting real-time market feeds. Strategy engine with a pluggable signal abstraction, vectorized backtesting over historical data, and a risk layer enforcing position limits before execution. Hot path kept allocation-free.",
    metrics: [
      { label: "BACKTEST", value: "vectorized" },
      { label: "HOT PATH", value: "0-alloc" },
      { label: "SIGNALS",  value: "pluggable" },
    ],
    stack: ["Python", "Pandas", "NumPy", "WebSockets", "asyncio"],
    links: [{ label: "GITHUB", url: "https://github.com/thefireflysparkle" }],
  },
  {
    title: "Real-Time Audio Analyzer",
    org: "Independent",
    subtitle: "FFT spectral visualization",
    year: "2025",
    summary:
      "A browser-based audio analysis tool: live FFT spectral visualization, beat detection, and frequency-domain feature extraction.",
    architecture:
      "Web Audio API graph feeding an AnalyserNode. FFT bins mapped to a logarithmic frequency scale, smoothed with an exponential moving average. Beat detection via spectral-flux onset detection. Render loop decoupled from the audio thread, drawn on Canvas at 60fps.",
    metrics: [
      { label: "FFT",    value: "real-time" },
      { label: "RENDER", value: "60fps" },
      { label: "ONSET",  value: "spectral-flux" },
    ],
    stack: ["TypeScript", "Web Audio API", "Canvas", "DSP", "FFT"],
    links: [{ label: "GITHUB", url: "https://github.com/thefireflysparkle" }],
  },
];

// ── Section 0x02: TEMPORAL LATTICE (Experience worldline) ──
// Deloitte lives HERE, not in projects.
export const worldline = [
  {
    t: 0,
    role: "Integration Developer Intern",
    org: "Deloitte U.S.I.",
    period: "JAN 2022 — JUN 2022",
    event:
      "Built 20+ HL7/XML integration interfaces for healthcare message flows across distributed systems — structured logging, retry handling, exception-safe parsing. Automated MOVEit file-transfer pipelines, improving data accuracy 30%.",
    branch: null,
  },
  {
    t: 1,
    role: "Software Engineer",
    org: "Deloitte U.S.I.",
    period: "JUL 2022 — PRESENT",
    event:
      "Built and scaled backend services and REST APIs across 12+ production applications serving 1M+ users, sustaining 99.9% uptime and sub-200ms p95 via query optimization on PostgreSQL, MongoDB, and SQL Server. Built GitHub Actions CI/CD pipelines with Docker, cutting production defects 60% and raising team velocity 40%; mentored 8 engineers through code and design reviews. Shipped 3 production React/TypeScript front-ends in 6 months, plus modular Node.js/Express microservices integrating 12+ third-party APIs.",
    branch: null,
  },
  {
    t: 2,
    role: "Independent Engineering",
    org: "WalletX · Caffèhop · CodeLens · Stellarcast",
    period: "2025 — PRESENT",
    event:
      "Concurrent worldline of independent projects: a wealth-partitioning OS, a coffee-discovery platform, a multi-agent code review CLI, and a real-time astronomy overlay. Systems built to learn the domains and ship something real.",
    branch: "concurrent",
  },
];

// Awards — discrete events on the lattice
export const events = [
  { year: "2024",       label: "Deloitte Applause Award",     note: "sustained engineering impact" },
  { year: "2023 · 2026", label: "Deloitte Spot Award ×2",      note: "sustained engineering impact" },
  { year: "—",          label: "Deloitte Hackathon Finalist",  note: "AI-powered contract-review tool · top 5 of 300+ teams" },
];

// ── Skills (rendered in 0x00 Main Engine) ──
export const skillBasis = {
  LANGUAGES:            ["JavaScript", "TypeScript", "Python", "C#", "SQL"],
  "BACKEND & DATA":      ["Node.js", "Express", "REST APIs", "Microservices", "PostgreSQL", "MongoDB", "SQL Server", "Redis"],
  FRONTEND:             ["React", "Next.js", "Angular", "Tailwind CSS"],
  "CLOUD, AI & PRACTICES": ["AWS", "Docker", "CI/CD", "Vercel", "LLM APIs", "RAG", "System Design", "Testing", "Agile", "Code Review", "Git"],
};

// Section registry — the coordinate map
export const sections = [
  { addr: "0x00", label: "ABOUT",      atmos: "main engine" },
  { addr: "0x01", label: "PROJECTS",   atmos: "proofs" },
  { addr: "0x02", label: "EXPERIENCE", atmos: "temporal lattice" },
  { addr: "0x03", label: "CONTACT",    atmos: "signal broadcast" },
];
