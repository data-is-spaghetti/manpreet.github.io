// ════════════════════════════════════════════════════════════════
//  PORTFOLIO DATA — "The Geometry of Spacetime"
//  Each section is hex-addressed. Each project is a coordinate.
// ════════════════════════════════════════════════════════════════

export const profile = {
  name: "Manpreet Kaur",
  role: "Software Engineer",
  // The "core vector definition" shown in the Main Engine readout.
  coreVector: "const Developer = CoreEngine.optimize(System);",
  location: "Bengaluru, IN",
  origin: "12.9716°N, 77.5946°E",
  resumePath: "Manpreet_Kaur_Resume.pdf",
};

export const socials = [
  { label: "GITHUB",   handle: "data-is-spaghetti",  url: "https://github.com/data-is-spaghetti" },
  { label: "LINKEDIN", handle: "kaurmanpreet013",    url: "https://www.linkedin.com/in/kaurmanpreet013/" },
  { label: "EMAIL",    handle: "kaur.exe@gmail.com", url: "mailto:kaur.exe@gmail.com" },
  { label: "SUBSTACK", handle: "thefireflysparkle",  url: "https://substack.com/@thefireflysparkle" },
];

// ── Section 0x00: MAIN ENGINE (Hero) ──
export const engine = {
  statement:
    "I design and ship full-stack systems — APIs, distributed services, and the interfaces on top of them.",
  // readout stats — some are live (computed), some static
  specs: [
    { key: "RUNTIME", value: "4.0 yrs", note: "production" },
    { key: "STACK", value: "POLYGLOT", note: "java · ts · c# · py" },
    { key: "SCALE", value: "1e6+", note: "users served" },
    { key: "UPTIME", value: "99.9%", note: "sustained" },
  ],
};

// ── Section 0x01: PROOFS & IMPLEMENTATIONS (Projects) ──
// Each project is a node in the hypercube. `coord` places it in 3D space.
export const projects = [
  {
    id: "0x01.A",
    title: "Enterprise Government Platforms",
    org: "Deloitte U.S.I.",
    year: "2022—NOW",
    coord: [-3.2, 1.4, -1.0],
    summary:
      "Full-stack features across 12+ distributed enterprise applications serving 1M+ users on US state government platforms.",
    architecture:
      "GraphQL + REST APIs on Spring Boot. Microservices with circuit-breaker patterns, Redis caching, event-driven integration across 15+ external services. React/Angular frontends. CI/CD on AWS.",
    metrics: [
      { label: "RESPONSE", value: "<200ms" },
      { label: "UPTIME", value: "99.9%" },
      { label: "SERVICES", value: "15+" },
    ],
    stack: ["Java", "Spring Boot", "React", "Angular", "AWS", "Redis", "GraphQL"],
    links: [],
  },
  {
    id: "0x01.B",
    title: "Algorithmic Trading Platform",
    org: "Independent",
    year: "2025",
    coord: [2.8, 2.0, 0.6],
    summary:
      "An automated trading system: market-data ingestion, strategy backtesting, and live order execution against broker APIs.",
    architecture:
      "Event-driven pipeline ingesting real-time market feeds. Strategy engine with a pluggable signal abstraction, vectorized backtesting over historical data, and a risk layer enforcing position limits before execution. Latency-sensitive hot path kept allocation-free.",
    metrics: [
      { label: "BACKTEST", value: "vectorized" },
      { label: "HOT PATH", value: "0-alloc" },
      { label: "SIGNALS", value: "pluggable" },
    ],
    stack: ["Python", "Pandas", "NumPy", "WebSockets", "Broker APIs", "asyncio"],
    links: [{ label: "GITHUB", url: "https://github.com/data-is-spaghetti" }],
  },
  {
    id: "0x01.C",
    title: "Real-Time Audio Analyzer",
    org: "Independent",
    year: "2025",
    coord: [-1.6, -2.2, 1.4],
    summary:
      "A browser-based audio analysis tool: live FFT spectral visualization, beat detection, and frequency-domain feature extraction.",
    architecture:
      "Web Audio API graph feeding an AnalyserNode. FFT bins mapped to a logarithmic frequency scale, smoothed with an exponential moving average. Beat detection via spectral-flux onset detection. Render loop decoupled from the audio thread, drawn on Canvas at 60fps.",
    metrics: [
      { label: "FFT", value: "real-time" },
      { label: "RENDER", value: "60fps" },
      { label: "ONSET", value: "spectral-flux" },
    ],
    stack: ["TypeScript", "Web Audio API", "Canvas", "DSP", "FFT"],
    links: [{ label: "GITHUB", url: "https://github.com/data-is-spaghetti" }],
  },
  {
    id: "0x01.D",
    title: "CodeLens",
    org: "Independent",
    year: "2025",
    coord: [3.4, -1.2, -1.8],
    summary:
      "A multi-agent CLI that runs code reviews through LLMs, with a pluggable provider backend.",
    architecture:
      "Provider abstraction over Ollama, Gemini, Mistral. RAG pipeline over codebase context. Token-by-token SSE streaming, multi-agent orchestration (context agent + review agent). One-line install with a pre-push git hook. Published to npm.",
    metrics: [
      { label: "PROVIDERS", value: "3+" },
      { label: "STREAM", value: "SSE" },
      { label: "AGENTS", value: "multi" },
    ],
    stack: ["TypeScript", "Node.js", "RAG", "LLM APIs", "npm"],
    links: [{ label: "GITHUB", url: "https://github.com/data-is-spaghetti" }],
  },
  {
    id: "0x01.E",
    title: "Stellarcast",
    org: "Independent",
    year: "2025",
    coord: [-2.4, 0.2, 2.6],
    summary:
      "A Chrome extension overlaying live astronomical data onto the browser.",
    architecture:
      "Service-worker pipeline syncing open APIs every 60s. 8K+ data points rendered via instanced Three.js meshes at 60fps, spatial hashing for sub-millisecond lookups. MV3 architecture.",
    metrics: [
      { label: "POINTS", value: "8K+" },
      { label: "RENDER", value: "60fps" },
      { label: "LOOKUP", value: "<1ms" },
    ],
    stack: ["TypeScript", "Three.js", "Service Workers", "Chrome MV3"],
    links: [{ label: "GITHUB", url: "https://github.com/data-is-spaghetti" }],
  },
];

// ── Section 0x02: TEMPORAL LATTICE (Experience worldline) ──
// Ordered along the causal worldline. t = position parameter.
export const worldline = [
  {
    t: 0,
    role: "Integration Developer Intern",
    org: "Deloitte U.S.I.",
    period: "JAN 2022 — JUN 2022",
    event:
      "Built 20+ production Java HL7/XML healthcare data integration interfaces on InterSystems HealthConnect.",
    branch: null,
  },
  {
    t: 1,
    role: "Software Engineer",
    org: "Deloitte U.S.I.",
    period: "JUL 2022 — PRESENT",
    event:
      "Full-stack delivery across enterprise government platforms. API architecture, CI/CD ownership, technical lead and code reviewer for a team of junior engineers.",
    branch: null,
  },
  {
    t: 2,
    role: "Independent Engineering",
    org: "Open Source / Side Systems",
    period: "2025 — PRESENT",
    event:
      "Concurrent worldline: algorithmic trading platform, real-time audio analyzer, CodeLens, Stellarcast. Systems built to learn the domains.",
    branch: "concurrent",
  },
];

// awards — rendered as discrete events on the lattice
export const events = [
  { year: "2024", label: "Deloitte Applause Award", note: "highest peer recognition · $2M+ engagement" },
  { year: "2023 · 2026", label: "Deloitte Spot Award ×2", note: "delivery quality · cross-team mentorship" },
  { year: "2023", label: "National Hackathon Finalist", note: "top 5 of 300+ teams" },
];

// ── Skills — mapped to a coordinate basis ──
export const skillBasis = {
  LANGUAGES: ["Java", "TypeScript", "JavaScript", "Python", "C#", "SQL", "Go"],
  BACKEND: ["Spring Boot", "Node.js", ".NET", "REST", "GraphQL", "Microservices", "Event-Driven", "System Design", "Distributed Systems"],
  FRONTEND: ["React", "Next.js", "Angular", "Three.js / R3F", "WebGL", "Framer Motion"],
  INFRA: ["PostgreSQL", "MongoDB", "Redis", "ElasticSearch", "AWS", "Docker", "Kubernetes", "CI/CD"],
  PRACTICE: ["TDD", "API Design", "Code Review", "RAG Pipelines", "LLM Agents", "Observability"],
};

// section registry — the coordinate map
export const sections = [
  { addr: "0x00", name: "MAIN ENGINE", sub: "core readout" },
  { addr: "0x01", name: "PROOFS", sub: "implementations" },
  { addr: "0x02", name: "TEMPORAL LATTICE", sub: "worldline" },
  { addr: "0x03", name: "SIGNAL BROADCAST", sub: "contact" },
];
