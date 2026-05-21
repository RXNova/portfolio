export const personal = {
  name: "Pradeep Kancharla",
  initials: "PK",
  title: "Senior Software Engineer",
  role: "Frontend Lead",
  tagline: "9+ years across enterprise, startup, and open source — frontend architecture, design systems, and the backend where it matters.",
  bio: "Frontend lead at Building Minds in Berlin, owning the design system, developer tooling, and the parts of the stack that cross team boundaries. Open to senior and lead roles.",
  location: "Berlin, Germany",
  email: "pradeepkancharla93@gmail.com",
  github: "https://github.com/RXNova",
  linkedin: "https://linkedin.com/in/pradeepkancharla",
}

export const experience = [
  {
    role: "Senior Fullstack Engineer",
    company: "Building Minds",
    period: "2022 — Present",
    location: "Berlin",
    summary: "ESG and business intelligence platform — owning fullstack architecture, design system, and AI developer tooling.",
    description: [
      "Design system · AI dev tooling (Claude agents, slash commands, guardrail reviews)",
      "Core component design · React migration · CI",
    ],
    tech: ["Angular", "React", "TypeScript", "NestJS", "Snowflake", "Nx", "Kubernetes", "OpenTelemetry", "Playwright", "Zod", "GitHub Actions", "Claude"],
  },
  {
    role: "Fullstack Developer",
    company: "3DQR",
    period: "2021 — 2022",
    location: "Magdeburg",
    summary: "AR and 3D experiences platform — modernized the CMS and built the real-time sensor data layer.",
    description: [
      "Angular CMS rewrite with i18n, localization & analytics",
      "Real-time sensor streaming microservice over elastic I/O",
    ],
    tech: ["Angular", "React", "TypeScript", "Node.js", "Go", "gRPC", "Redis", "PostgreSQL", "WebSockets", "Docker"],
  },
  {
    role: "Work Student",
    company: "3DQR",
    period: "2019 — 2021",
    location: "Magdeburg",
    summary: "Same AR platform, earlier stage — built the asset pipeline and the first white-label product.",
    description: [
      "Asset pipeline for 3D models, textures & media across client devices",
      "White-label B2B app for branded AR experiences",
    ],
    tech: ["Angular", "TypeScript", "WebGL", "Three.js", "Docker", "Jest"],
  },
  {
    role: "Senior Systems Engineer",
    company: "Infosys · British Petroleum",
    period: "2016 — 2018",
    location: "Chennai",
    summary: "Analytics and reporting for BP's reservoir engineering teams — ported scientific computing from MATLAB and built leadership dashboards.",
    description: [
      "MATLAB → Python well-yield calculations",
      "React + Django + Tableau dashboards on Hive & Azure",
    ],
    tech: ["React", "Python", "Django", "Pandas", "NumPy", "PostgreSQL", "Tableau", "Hive", "Azure", "S3"],
  },
  {
    role: "Systems Engineer",
    company: "Infosys · AT&T",
    period: "2015 — 2016",
    location: "Chennai",
    summary: "Internal tooling and infrastructure for AT&T — payment gateways and VMware provisioning automation at scale.",
    description: [
      "Python/AngularJS payment gateways at high transaction volume",
      "Puppet & shell automation — saved ~9 engineer-hours/day",
    ],
    tech: ["Python", "AngularJS", "SQL", "Linux", "Puppet", "Shell"],
  },
]


export const personalProjects = [
  {
    name: "Interactive Folder Diff",
    description: "Native macOS app for comparing and syncing folders with visual diff, SHA-256 verification, and multiple view modes.",
    tech: ["Swift 6", "SwiftUI", "macOS"],
    github: "https://github.com/RXNova/interactive-folder-diff-swift",
  },
  {
    name: "Swift Cull",
    description: "Keyboard-first photo culling app for macOS. Review, rate, and organize shoots without touching the mouse.",
    tech: ["Swift 6", "SwiftUI", "macOS"],
    github: "https://github.com/RXNova/swift-cull-mac",
  },
  {
    name: "CoreLasso",
    description: "Native macOS container manager — SwiftUI GUI for Apple's container CLI with a companion lasso CLI for Docker Compose-style orchestration.",
    tech: ["Swift 6", "SwiftUI", "Virtualization.framework", "macOS"],
    github: "https://github.com/RXNova/CoreLasso",
  },
  {
    name: "Sneaky Little Button",
    description: "Chrome extension using on-device Gemini Nano to detect and surface unsubscribe links buried deep in Gmail threads.",
    tech: ["TypeScript", "React", "Tailwind", "Gemini Nano"],
    github: "https://github.com/RXNova/sneaky-little-button",
  },
  {
    name: "Retro14",
    description: "Real-time retro board with private drafting, structured voting, card grouping, and PDF export. No account needed to join.",
    tech: ["React", "TypeScript", "Supabase", "Vite", "Cloudflare Pages"],
    github: "https://github.com/RXNova/retro14",
    live: "https://retro14.com",
  },
  {
    name: "ToggleFlow",
    description: "Feature-flag system aimed at higher-scale rollouts, focused on latency, reliability, and easy drop-in integration.",
    tech: ["TypeScript"],
    github: "https://github.com/RXNova/ToggleFlow",
    live: "https://toggleflow.io",
  },
  {
    name: "gitid",
    description: "Switch git identities and SSH keys between profiles automatically when you cd into a directory — like nvm, but for git.",
    tech: ["Shell", "Homebrew"],
    github: "https://github.com/RXNova/homebrew-gitid",
  },
  {
    name: "Berlin Commute",
    description: "Always-on BVG departure dashboard with live delays, smart walk-time indicators, and auto-refresh. Built for smarthome displays.",
    tech: ["Angular", "Signals", "RxJS", "Tailwind"],
    github: "https://github.com/RXNova/berlin-commute-dashboard",
  },
  {
    name: "Keep Disk Alive",
    description: "Menu bar app that prevents external drives from sleeping via periodic writes or pmset — handy for editors and photographers.",
    tech: ["SwiftUI", "macOS", "IOKit"],
    github: "https://github.com/RXNova/keep-disk-alive-mac",
  },
  {
    name: "EZ-Mac",
    description: "Suite of macOS utilities starting with EZDisplay — brightness and resolution control for external monitors via DDC/CI.",
    tech: ["SwiftUI", "macOS", "IOKit", "DDC/CI"],
    github: "https://github.com/RXNova/ez-mac",
  },
]

export const skills: Record<string, string[]> = {
  Frontend: ["Angular", "React", "TypeScript", "RxJS", "SCSS", "Tailwind"],
  Backend: ["Node.js", "NestJS", "Python", "FastAPI", "Supabase", "REST APIs", "Microservices"],
  Architecture: ["Design Systems", "Nx Monorepos", "BFF", "RBAC", "Multi-tenant DBs", "Vite"],
  "AI & Infra": ["Claude", "GitHub Copilot", "MCP", "Azure", "Cloudflare", "Snowflake", "GitHub Actions"],
}

export const blog = [
  {
    title: "Building Retro14 — real-time retro boards from scratch",
    date: "Apr 2026",
    readTime: "8 min",
    href: "#",
  },
  {
    title: "Running Retro14 on zero-cost infra",
    date: "Apr 2026",
    readTime: "5 min",
    href: "#",
  },
  {
    title: "CoreLasso — wrapping Apple's container CLI in SwiftUI",
    date: "Mar 2026",
    readTime: "6 min",
    href: "#",
  },
  {
    title: "gitid — auto-switching git identities like nvm",
    date: "Feb 2026",
    readTime: "4 min",
    href: "#",
  },
  {
    title: "ToggleFlow — building a low-latency feature-flag system",
    date: "Jan 2026",
    readTime: "7 min",
    href: "#",
  },
  {
    title: "Sneaky Little Button — on-device AI for Gmail unsubscribes",
    date: "Dec 2025",
    readTime: "5 min",
    href: "#",
  },
]
