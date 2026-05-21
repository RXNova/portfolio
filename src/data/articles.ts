export interface ArticleSection {
  heading?: string
  body: string
}

export interface Article {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  coverImage?: string
  sections: ArticleSection[]
  tech: string[]
  links: { label: string; href: string }[]
}

export const articles: Article[] = [
  {
    slug: "building-retro14",
    title: "Building Retro14 — real-time retro boards from scratch",
    date: "Apr 2026",
    readTime: "8 min",
    excerpt:
      "Sprint retrospectives are supposed to surface honest feedback. Most tools get in the way. I built Retro14 to fix that — real-time, no account required, private until you're ready.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/retro14/main/public/readme.png",
    sections: [
      {
        heading: "Why I built it",
        body: "Every retro tool I used had the same problem: cards were visible as you typed them. People self-censored. Whoever wrote the most cards first set the tone for everyone else. I wanted a tool where cards are drafted privately and only published when you decide — so the room shapes the retro, not the loudest person.",
      },
      {
        heading: "The stack",
        body: "React 18 on the frontend with Vite and React Router v7. Supabase as the backend — Postgres for the data model, Auth for sessions, and the Realtime engine for live updates. Cloudflare Pages for hosting. The whole thing runs on free tiers in production.",
      },
      {
        heading: "Real-time without a custom server",
        body: "Supabase Realtime subscribes to Postgres changes over WebSockets. Every card publish, vote, and group action triggers a database row change, which Supabase broadcasts to all connected clients. No custom WebSocket server, no polling — the database is the source of truth and the event bus at the same time.",
      },
      {
        heading: "The private drafting model",
        body: "Cards have a `published` boolean in the database. RLS policies ensure you can only read your own unpublished cards — even if someone queries Supabase directly they only see their own drafts. When you hit publish, the flag flips, RLS lets others read it, and Realtime fires the update to everyone in the room. This one policy decision solved the self-censorship problem completely.",
      },
      {
        heading: "Shipping it",
        body: "The first version was running at Building Minds within two weeks. We've used it for every sprint retro since. The structured voting and card grouping replaced the sticky-note shuffle we used to do in Miro. PDF export meant action items actually made it into Jira.",
      },
    ],
    tech: ["React 18", "TypeScript", "Vite", "Supabase", "Cloudflare Pages"],
    links: [
      { label: "Live", href: "https://retro14.com" },
      { label: "GitHub", href: "https://github.com/RXNova/retro14" },
    ],
  },

  {
    slug: "retro14-free-infra",
    title: "Running Retro14 on zero-cost infra",
    date: "Apr 2026",
    readTime: "5 min",
    excerpt:
      "The entire production stack for Retro14 — frontend, database, auth, realtime, and email — runs for $0/month. Here's how.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/retro14/main/public/readme.png",
    sections: [
      {
        heading: "The stack",
        body: "Cloudflare Pages for the frontend, Supabase for everything backend (Postgres, Auth, Realtime), GitHub Actions for CI, and Brevo as an SMTP relay for transactional email. Four services, four free tiers, one monthly bill: nothing.",
      },
      {
        heading: "Cloudflare Pages",
        body: "Connect the repo and Cloudflare handles the rest — build on every push to main, global CDN distribution, unlimited bandwidth. The only config is a wrangler.jsonc that points to the dist folder and sets SPA fallback so board routes don't 404. No wrangler deploy, no manual steps.",
      },
      {
        heading: "Supabase",
        body: "The free tier gives you 500 MB Postgres, 50k monthly active users, 2 GB egress, and the full Realtime engine. RLS policies handle access control at the database level — the anon key is safe to ship in the frontend because it can't read anything it shouldn't. Run the five schema files in order, set two env vars in the Cloudflare dashboard, done.",
      },
      {
        heading: "Brevo for email",
        body: "Supabase handles auth triggers (sign-up confirmation, password reset) and hands off to Brevo via SMTP. Brevo's free tier sends 300 emails a day — more than enough for a team tool. Verify your sender domain, generate an SMTP key, wire it into the Supabase SMTP settings. That's the entire email setup.",
      },
      {
        heading: "Free tier limits in practice",
        body: "For a team retro tool the limits are meaningless. A 10-person engineering team running weekly retros will use a few hundred kilobytes of database storage and maybe 50 auth emails a month. The only reason to upgrade would be running this at org scale across hundreds of teams.",
      },
    ],
    tech: ["Cloudflare Pages", "Supabase", "GitHub Actions", "Brevo"],
    links: [
      { label: "Live", href: "https://retro14.com" },
      { label: "GitHub", href: "https://github.com/RXNova/retro14" },
      {
        label: "Deployment docs",
        href: "https://github.com/RXNova/retro14/blob/main/docs/DEPLOYMENT.md",
      },
    ],
  },

  {
    slug: "corelasso",
    title: "CoreLasso — wrapping Apple's container CLI in SwiftUI",
    date: "Mar 2026",
    readTime: "6 min",
    excerpt:
      "Apple quietly shipped a native container runtime for macOS. It's fast, arm64-native, and has no GUI. I built one.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/CoreLasso/main/docs/app.png",
    sections: [
      {
        heading: "The problem",
        body: "Apple's container CLI is genuinely good — lightweight Linux containers running natively on Apple Silicon via the Virtualization framework, no Docker Desktop required. But it's terminal-only. If you want to see what's running, inspect ports, pull an image, or manage volumes, you're stringing together commands. I wanted a proper macOS app for it.",
      },
      {
        heading: "Building the GUI",
        body: "CoreLasso is a SwiftUI app that shells out to the container CLI and parses the output into a live dashboard. Container lifecycle (create, start, stop, kill, delete, export), image management with pull progress, volume and network management — all accessible from a single sidebar layout. The Virtualization framework does the heavy lifting; CoreLasso just wraps it in a UI that doesn't require a terminal.",
      },
      {
        heading: "The lasso CLI companion",
        body: "The GUI solves single-container workflows. For multi-container setups, I built lasso — a CLI that reads docker-compose.yml files and translates each service into a native Apple container. `lasso up` reads your existing compose file, `lasso down` tears it all down. Standard Docker Compose fields (image, ports, volumes, environment, networks) all work. Dockerfiles build with `lasso build`.",
      },
      {
        heading: "Architecture",
        body: "The code is split into four Swift packages: LassoCore (models and protocols, no framework dependencies), LassoData (the actual container engine and OCI registry client), LassoUI (all the SwiftUI views and view models), and LassoCLI (the command-line entry point). The separation means the CLI and GUI share all the core logic — adding a new container operation only needs to be done once.",
      },
      {
        heading: "OCI compatibility",
        body: "Because Apple's container runtime uses the OCI image format, images from Docker Hub, GHCR, ECR, and any other OCI registry work without modification. linux/arm64 images run natively on Apple Silicon — no emulation, no Rosetta layer.",
      },
    ],
    tech: ["Swift 6", "SwiftUI", "Virtualization.framework", "OCI", "macOS 15"],
    links: [
      {
        label: "Download",
        href: "https://github.com/RXNova/CoreLasso/releases/latest/download/CoreLasso-0.1.1.pkg",
      },
      { label: "GitHub", href: "https://github.com/RXNova/CoreLasso" },
    ],
  },

  {
    slug: "gitid",
    title: "gitid — auto-switching git identities like nvm",
    date: "Feb 2026",
    readTime: "4 min",
    excerpt:
      "I work on open source, client projects, and work repos from the same machine. Committing as the wrong identity is annoying. gitid fixes it by switching automatically when you cd into a directory.",
    sections: [
      {
        heading: "The problem",
        body: "Most developers have at least two git identities — work and personal. Some have more. The standard advice is to use local git config per repo, but that means remembering to set it up every time you clone. Once is fine. The tenth time is not. And if you forget, you've pushed commits under the wrong name and email and now you're rebasing.",
      },
      {
        heading: "How it works",
        body: "gitid is a shell function (zsh/bash) that hooks into your prompt via PROMPT_COMMAND / precmd. Every time you cd into a directory, it checks your directory rules for the longest matching path prefix and switches to the associated profile. Each profile stores user.name, user.email, core.sshCommand (SSH key), and optionally a signing key. The switch takes a few milliseconds and prints a single line confirmation.",
      },
      {
        heading: "Directory rules",
        body: "Rules are just path-to-profile mappings stored in ~/.config/gitid/rules. `gitid rule add ~/work work` means any directory under ~/work uses the work profile. Rules match on longest prefix, so ~/work/freelance can override ~/work if you need a different identity for that subtree. A default_profile fallback covers anything not matched by a rule.",
      },
      {
        heading: "Installation",
        body: "Install via Homebrew: `brew tap RXNova/gitid && brew install gitid`. Shell config is set up automatically on first run. Import your existing git config as a profile with `gitid import work`, add a second one with `gitid add personal`, then set directory rules and forget about it.",
      },
    ],
    tech: ["Shell", "Bash", "Zsh", "Homebrew"],
    links: [
      { label: "GitHub", href: "https://github.com/RXNova/homebrew-gitid" },
    ],
  },

  {
    slug: "toggleflow",
    title: "ToggleFlow — building a low-latency feature-flag system",
    date: "Jan 2026",
    readTime: "7 min",
    excerpt:
      "Feature flags sound simple until you need them at scale. I built ToggleFlow to explore what a low-latency, reliable flag system actually needs under the hood.",
    sections: [
      {
        heading: "Why feature flags are harder than they look",
        body: "A feature flag at its simplest is an if statement reading a boolean from a config. In production, you need that boolean to be consistent across thousands of requests per second, evaluate in under a millisecond, survive a backend outage, and update without a redeploy. The requirements compound quickly.",
      },
      {
        heading: "The architecture",
        body: "ToggleFlow is split into a NestJS backend and a React frontend. The backend uses Prisma against Postgres for the flag store and exposes a typed API. The evaluation path is intentionally separate from the management plane — flags are cached in-process so evaluation never blocks on a database read. Updates propagate via server-sent events, keeping clients fresh without polling.",
      },
      {
        heading: "Flag evaluation",
        body: "Flags support simple on/off toggles plus percentage rollouts and user-segment targeting. The evaluation engine resolves targeting rules in priority order and falls back to the default variant. All evaluation is deterministic — same input always produces same output, which matters for debugging and reproducibility.",
      },
      {
        heading: "The stack",
        body: "Frontend: React, TypeScript, Vite. Backend: NestJS, TypeScript, Prisma, Postgres. Docker Compose for local dev. The whole thing is containerised — frontend, backend, and database start with a single docker compose up.",
      },
    ],
    tech: ["NestJS", "React", "TypeScript", "Prisma", "Postgres", "Docker"],
    links: [
      { label: "Live", href: "https://toggleflow.io" },
      { label: "GitHub", href: "https://github.com/RXNova/ToggleFlow" },
    ],
  },

  {
    slug: "sneaky-little-button",
    title: "Sneaky Little Button — on-device AI for Gmail unsubscribes",
    date: "Dec 2025",
    readTime: "5 min",
    excerpt:
      "Chrome ships with Gemini Nano built in. I used it to build a Gmail extension that finds unsubscribe links using on-device AI — no API key, no server, no data leaving your machine.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/sneaky-little-button/main/assets/plugin-screenshot.png",
    sections: [
      {
        heading: "Chrome's Prompt API",
        body: "Chrome 127 shipped with Gemini Nano embedded in the browser and exposed a JavaScript Prompt API behind a flag. You can prompt the model directly from a content script or extension popup — it runs locally on-device, no network request, no API key. The model is small and fast enough for short classification tasks.",
      },
      {
        heading: "The idea",
        body: "Unsubscribe links are buried in email footers, often disguised as plain text or hidden behind legal boilerplate. Finding them manually in a dense email is annoying. The extension collects all links from an open Gmail thread, sends them to Gemini Nano with a prompt asking it to identify the unsubscribe link, and injects a prominent button wherever it lands.",
      },
      {
        heading: "How it works",
        body: "A content script monitors Gmail for opened emails. When it detects one, it extracts all anchor hrefs from the email body and passes the list to aiBridge.ts, which calls window.ai.languageModel to run the classification. The model returns the most likely unsubscribe URL, and the content script injects a button next to the email header. Auto mode runs on every email open; manual mode waits for you to click Scan.",
      },
      {
        heading: "Privacy and the local model",
        body: "Because everything runs in the browser with the local model, no email content leaves your device. There's no backend, no analytics, no telemetry. The custom prompt setting in the popup lets you tune the detection — useful if the default prompt misses links in a particular format.",
      },
      {
        heading: "The extension structure",
        body: "Built with React and Tailwind for the popup UI, Shadcn for components, and Vite to bundle the extension. The content script is plain TypeScript. The manifest is minimal — content_scripts permission for mail.google.com and the AI origin trial token to unlock the Prompt API.",
      },
    ],
    tech: ["TypeScript", "React", "Tailwind", "Gemini Nano", "Chrome Extension", "Vite"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/RXNova/sneaky-little-button",
      },
    ],
  },
]
