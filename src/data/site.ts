/**
 * Editable site content. Pages read from here so copy changes never touch
 * component code.
 *
 * Wrap a phrase in double asterisks — "built **analytics dashboards**" — and
 * it renders in medium weight (see components/RichText.tsx).
 *
 * Work content is technical only: the employer and its products are named,
 * but no clients, colleagues, ticket numbers or security findings are.
 * Numbers come from git history and PR lists (Oct 2026); "~" marks an
 * approximate one.
 */

export const profile = {
  name: "Gaurav Bangade",
  role: "Software Engineer",
  focus: "Platform architecture & full-stack",
  location: "Pune, India",
  company: "ecoSAIL Infotech",
  /** ISO year-month the current role started. */
  since: "2024-11",
  intro:
    "I founded **CVMS**, an offline-first ship–shore platform, and **Ensign**, the company’s design system — and shipped **~1,180 PRs** across 15+ repos, from emissions compliance to real-time helpdesks.",
};

export const contact = {
  email: "bangadegaurav@gmail.com",
  /**
   * FormSubmit AJAX endpoint, using the alias FormSubmit issued for the
   * address above (activated for gaurav-fun.vercel.app) so the address
   * itself isn't in the request URL.
   */
  formEndpoint: "https://formsubmit.co/ajax/b644f029ba3806cd379836408070db72",
  github: "https://github.com/gauravBangade",
  linkedin: "https://www.linkedin.com/in/gaurav-bangade-9a2430222/",
};

/** Pages in the header nav. Home is the name on the left. */
export const pages = [
  { to: "/work", label: "Work" },
  { to: "/resume", label: "Resume" },
  { to: "/party", label: "Party" },
  { to: "/contact", label: "Contact" },
];

/** The résumé page's opening lines. */
export const resume = {
  /** One-page, ATS-friendly copy in public/. Regenerate it when the content below changes. */
  pdf: "/Gaurav-Bangade-Resume.pdf",
  headline: "Software Engineer — Platform Architecture, Full-Stack & Offline-First Systems",
  summary:
    "Software engineer at a maritime SaaS company since November 2024, with ~1,300 commits and ~1,180 pull requests across 15+ repositories. Founded and architected CVMS, a plugin-based, offline-first ship–shore platform with a transactional-outbox sync foundation and a network-fault simulation arena, and created Ensign, the design system it is built on. One of the main frontend authors of Ecosailer, the production emissions-compliance product: built the Voyage Estimator, rebuilt role-based access control, moved auth to httpOnly cookies, cut polling 10×, removed every “any” type and closed 30 release-blocking defects for 2.4.0. Built the UI and helpdesk of Ecosail Global, the shore hub, from scratch.",
};

/** The skills carousel on the home page: most relevant first, one area label each. */
export const featuredSkills: { name: string; area: string }[] = [
  { name: "React", area: "Frontend" },
  { name: "TypeScript", area: "Language" },
  { name: "TanStack Start", area: "Full-stack" },
  { name: "NestJS", area: "Backend" },
  { name: "PostgreSQL", area: "Database" },
  { name: "TanStack Query", area: "Data fetching" },
  { name: "Node.js", area: "Backend" },
  { name: "Python", area: "Language" },
  { name: "Redux", area: "State" },
  { name: "ECharts", area: "Charts" },
  { name: "Tailwind CSS", area: "Styling" },
  { name: "Vite", area: "Tooling" },
  { name: "Vitest", area: "Testing" },
  { name: "LangChain", area: "AI / LLM" },
  { name: "Git", area: "Tooling" },
];

/** One line of an experience entry: a short label, then a sentence. Text supports **keyword** markers. */
export type Highlight = { label: string; text: string; status?: string };

/** A number worth showing, e.g. { value: "10×", label: "fewer polling requests" }. */
export type Metric = { value: string; label: string };

export type Experience = {
  company: string;
  role: string;
  location: string;
  /** ISO year-month. */
  start: string;
  /** ISO year-month, or null while current. */
  end: string | null;
  summary: string;
  /** Short, verifiable numbers shown under the summary. */
  metrics: Metric[];
  highlights: Highlight[];
};

export const experience: Experience[] = [
  {
    company: "ecoSAIL Infotech",
    role: "Software Engineer",
    location: "Pune",
    start: "2024-11",
    end: null,
    summary:
      "Joined to build a production emissions-compliance product. Since then I have founded two codebases, created the company’s design system and set the architecture its next platform is built on.",
    metrics: [
      { value: "~1,180", label: "pull requests across 15+ repos" },
      { value: "4", label: "products shipped or founded" },
      { value: "30", label: "release-blocking defects closed for 2.4.0" },
      { value: "10×", label: "fewer polling requests" },
    ],
    highlights: [
      {
        label: "CVMS",
        status: "In development",
        text: "Founded and architected a **plugin-based, offline-first** ship–shore platform: lint-enforced module boundaries, a **transactional outbox** with a hybrid logical clock, and a simulation arena that tests sync under **10 satellite-link profiles** and clock skew.",
      },
      {
        label: "Ensign design system",
        text: "Created a **26-section, token-driven** design system with light and dark themes — now the only styling system allowed in CVMS and the channel-partner portal.",
      },
      {
        label: "Ecosailer",
        text: "One of the main frontend authors of the production product (**960+ merged PRs** on its UI): built the **Voyage Estimator**, reporting wizards, analytics dashboards and the trial-period feature across **9 release lines**.",
      },
      {
        label: "Access control & security",
        text: "Rebuilt **RBAC** with a privilege ceiling and a deny-by-default route manifest, moved auth to **httpOnly cookies**, added XSS sanitisation and ran a security audit across all **4 company repos**.",
      },
      {
        label: "Ecosail Global",
        text: "Built the shore hub’s **UI from scratch** and designed its **helpdesk**: ticket lifecycles, webhooks, machine-to-machine API keys and real-time WebSocket notifications.",
      },
      {
        label: "Code quality",
        text: "Removed **every “any” type** from the UI in a 6-phase, lint-locked migration that surfaced real bugs, cut polling **10×** and closed **12 critical and 18 high-priority** defects to ship 2.4.0.",
      },
    ],
  },
];

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  {
    label: "Frontend",
    items: ["React 18/19", "TanStack Router, Query, Table & Form", "Redux", "Zustand", "Formik", "Zod", "ECharts", "Recharts", "Tailwind CSS", "Vite"],
  },
  { label: "Backend", items: ["NestJS", "Fastify", "Prisma", "Django REST Framework", "Django Channels", "pg-boss", "Node.js", "Express"] },
  { label: "Data", items: ["PostgreSQL", "MySQL", "Redis", "MongoDB"] },
  { label: "Distributed systems", items: ["Offline-first sync", "Transactional outbox", "Hybrid logical clocks", "WebSockets", "Fault simulation"] },
  { label: "Security", items: ["RBAC & privilege ceilings", "httpOnly cookie auth", "Argon2id", "XSS sanitisation", "Security audits"] },
  { label: "Quality", items: ["Vitest", "Playwright", "Testing Library", "MSW", "ESLint ratchets"] },
  { label: "Design", items: ["Design systems", "Design tokens", "Accessible data palettes", "Responsive UI"] },
  { label: "Maritime domain", items: ["IMO CII", "EU MRV / ETS", "FuelEU", "IMO DCS", "Bunkering & ROB"] },
  { label: "AI / LLM", items: ["LangChain", "RAG", "FAISS", "MCP", "Agent skills"] },
];

export type Project = {
  id: string;
  title: string;
  /** Shown in place of the period while a project isn't finished, e.g. "In development". */
  status?: string;
  /** Left out where the dates aren't on record. */
  period?: string;
  /** What I did on it. */
  role: string;
  /** One sentence for lists. */
  blurb: string;
  /** The opening paragraph on the project page. Supports **keyword** markers. */
  summary: string;
  /** Why it was needed, on the project page. Supports **keyword** markers. */
  problem?: string;
  /** "What I built" bullets on the project page. Supports **keyword** markers. */
  details: string[];
  /** What changed because of it. Supports **keyword** markers. */
  impact?: string[];
  /** The project's own numbers, shown in its facts card. */
  metrics?: Metric[];
  stack: string[];
};

/** Work projects, each with its own page at /work/:id. The first three appear on the home page. */
export const projects: Project[] = [
  {
    id: "cvms",
    title: "CVMS",
    status: "In development",
    period: "Aug 2026 – now",
    role: "Founder, architect and main author",
    blurb: "A plugin-based, offline-first ship–shore platform — sync tested row by row under simulated satellite outages.",
    summary:
      "**CVMS** is the next-generation platform for every Ecosail product: one NestJS API and one React app, each **assembled at startup from module manifests**, with every vessel running its own node that syncs with a central shore node.",
    problem:
      "The company’s products were separate Django apps with no shared platform, and vessels need software that works **offline at sea** — over satellite links that are slow, expensive and often down — yet stays consistent with the shore office. Nothing enforced boundaries; new features meant copying patterns between apps.",
    details: [
      "Designed a four-layer **modular monolith** with **lint-enforced boundaries**: modules import only the kernel and talk only through kernel events and public contracts — checked on every commit, not in review.",
      "**Manifest-driven everything**: routes, sidebar, breadcrumbs, permissions, jobs, ship/shore roles and sync rules come from one manifest per module. Adding a module is 4 explicit steps.",
      "A **composed Prisma schema** — each module owns a fragment, and CI fails on drift or on a sync model missing a required column.",
      "The offline-first sync foundation, as small reviewed PRs: UUIDv7 keys, a **transactional outbox** installed as a database trigger, gap-free per-node sequence numbers, a **hybrid logical clock** tolerant of ship clocks hours off, and at-least-once domain events.",
      "A **sync simulation arena**: shore and ship nodes on one machine, the link shaped into **10 profiles** (Starlink, VSAT, cut, blackhole…), clocks skewed while running, and **5 scored scenarios** that compare every synced table row by row.",
      "Platform modules — auth with a rotating httpOnly refresh cookie, Argon2id and a **privilege ceiling**; a **content-addressed file store**; 10 reference masters; vessels — and a kernel UI kit of **~55 typed components** so modules write zero media queries.",
      "Profiled the animated sign-in page from ~10 fps to a steady **60 fps**.",
    ],
    impact: [
      "One platform on which every future Ecosail product — ship, shore and partner portal — is built as modules, with architecture rules enforced by tooling.",
      "Offline sync made **measurable**: convergence is checked under simulated outages and clock skew instead of discovered at sea.",
      "Turned sync into a fair contest: three engineers each build an engine against the same **sync status contract**, scored by the same arena.",
      "Brought a Django team onto the stack with ~8,000 lines of docs, including a 1,100-line Prisma guide written for Django developers.",
    ],
    metrics: [
      { value: "~35", label: "merged PRs" },
      { value: "~55", label: "typed UI components" },
      { value: "34 + 7", label: "test files + e2e suites" },
      { value: "~8,000", label: "lines of architecture & API docs" },
    ],
    stack: ["NestJS", "Fastify", "Prisma", "PostgreSQL", "pg-boss", "React", "TanStack Router", "Playwright"],
  },
  {
    id: "ensign",
    title: "Ensign Design System",
    period: "Aug 2026",
    role: "Sole author",
    blurb: "The company’s design language: 26 sections, light and dark themes, all driven by tokens.",
    summary:
      "**Ensign** is the design system I created for Ecosail — a 26-section React showcase where light and dark themes are driven entirely by **design tokens**.",
    problem:
      "Every Ecosail app looked different — Tailwind and shadcn in one, hand-written CSS in another — with **no shared tokens and no dark mode**.",
    details: [
      "Palette, typography (Archivo + IBM Plex Mono), buttons, inputs, navigation, cards, tables, forms, modals, calendars, spacing and motion.",
      "Charts with a **colour-vision-safe data palette**, status indicators and alerts.",
      "A full **fleet dashboard** composed only from the system’s parts, proving they fit together.",
    ],
    impact: [
      "The **only** styling system permitted in CVMS — lint and review rules forbid any other.",
      "Ported to the channel-partner portal, mirrored as the company design kit and used as the reference for the shore hub’s sidebar restyle.",
    ],
    metrics: [
      { value: "26", label: "sections" },
      { value: "2", label: "themes from one token set" },
      { value: "2", label: "products built on it" },
    ],
    stack: ["React", "Vite", "CSS custom properties", "Design tokens"],
  },
  {
    id: "voyage-estimator",
    title: "Voyage Estimator",
    period: "Jul 2026",
    role: "UI and API, end to end",
    blurb: "Estimate a voyage’s CO₂, CII grade and EU ETS cost before it sails — regulation changes need data, not deploys.",
    summary:
      "A two-step wizard that lets sales and operators estimate a voyage’s **CO₂, CII rating (A–E) and EU ETS allowances** before the ship sails.",
    problem:
      "Operators needed these numbers before committing to a voyage, but the only formula chain lived in **hard-coded tables** in a public calculator.",
    details: [
      "Build a voyage timeline — ports, sea legs, port-stay operations, per-segment daily fuel burn, optional **bio-blend fuels** and years 2024–2030 — then see attained vs required CII and EUAs.",
      "Moved **every regulatory constant** into database masters with a seed command: carbon factors, capacity rules, reference lines, reduction factors, rating boundaries, EUA phase-in and ice-class credit.",
      "Blended carbon factors for bio-fuel mixes, and saved scenarios that can be reloaded.",
      "**55 tests**, an implementation plan and a developer guide.",
    ],
    impact: [
      "When regulation changes, the estimator is updated with **data, not a deploy**.",
    ],
    metrics: [
      { value: "55", label: "tests" },
      { value: "2024–30", label: "years modelled" },
    ],
    stack: ["React", "TypeScript", "Django REST Framework", "MySQL"],
  },
  {
    id: "access-control",
    title: "Access control & security",
    period: "Feb – Oct 2026",
    role: "Design, UI and API",
    blurb: "Rebuilt RBAC around a privilege ceiling, moved auth to httpOnly cookies and audited all four company repos.",
    summary:
      "The permission and security layer of a **multi-tenant, white-labelled** product — designed, then rebuilt on the CVMS model so no one can grant more access than they hold.",
    problem:
      "Access rules were scattered and tokens lived in **JavaScript-readable storage**, where any injected script could read them.",
    details: [
      "v1: a permission master with categories and groups, per-ship permissions and live-evaluated route guards; built-in groups seeded as **immutable system groups**.",
      "The Sep 2026 rewrite: roles-only permissions, multi-role users, a **privilege ceiling**, an enforced backend guard and a **deny-by-default route manifest** with a 403 page.",
      "Release 2.5.0: every API endpoint mapped to catalog keys and built-in roles re-synced on each deploy, **eliminating role drift** between installations.",
      "Moved JWTs into **httpOnly cookies** with new auth middleware, added **DOMPurify** sanitisation against stored XSS and removed client-side key material from the bundle.",
      "A release-diff analysis between versions that surfaced critical configuration and migration issues, and a **security audit across all four company repos** with a published roadmap.",
    ],
    impact: [
      "Tokens can no longer be stolen by injected script.",
      "Every installation runs the same role definitions, and every route is denied unless explicitly allowed.",
    ],
    metrics: [
      { value: "71", label: "permission keys in the master set" },
      { value: "4", label: "repos audited" },
    ],
    stack: ["React", "TypeScript", "Django REST Framework", "JWT", "DOMPurify"],
  },
  {
    id: "ecosail-global",
    title: "Ecosail Global & Helpdesk",
    period: "Apr – Sep 2026",
    role: "Main author of the UI and helpdesk",
    blurb: "Built the shore hub’s UI from scratch and the real-time helpdesk every vessel’s tickets flow into.",
    summary:
      "**Ecosail Global** is the central shore app that owns master data for every client installation and runs the **helpdesk** that tickets from vessels flow into. I built its UI from scratch and designed the helpdesk end to end.",
    details: [
      "A new UI on **React 19, Vite 7, TanStack Query/Table, Zustand and Tailwind 4** — routing, auth, RBAC, lazy loading, dashboard and form patterns.",
      "The **ticketing system** (API + UI): status and priority lifecycles, categories and labels, rich-text comments, attachments with preview, mentions, ticket links and merge rules, saved filters and auto-assign.",
      "**Webhooks** with delivery records, **idempotent** ticket creation from client apps, and machine-to-machine **API keys** with audit logging.",
      "**Real-time notifications** over Channels, Daphne and Redis WebSockets — and the bridge that lets Ecosailer create and track tickets in Global, with vessel sync and cross-app notifications.",
      "Reliability fixes: no more unexpected logouts, recovery from stale JS chunks after a deploy, and an unreachable webhook no longer crashes a ticket update.",
    ],
    impact: [
      "Vessels and shore teams work from one helpdesk, updated live.",
    ],
    metrics: [
      { value: "72", label: "merged PRs across UI & API" },
      { value: "8", label: "technical documents" },
    ],
    stack: ["React 19", "TypeScript", "TanStack Query", "Zustand", "Django", "Channels", "Redis"],
  },
  {
    id: "ecosailer",
    title: "Ecosailer reporting & analytics",
    period: "Nov 2024 – now",
    role: "One of the main frontend authors",
    blurb: "The production product crews report in and offices run compliance on — 960+ merged PRs across 9 release lines.",
    summary:
      "**Ecosailer** is a multi-tenant, white-labelled maritime emissions product: crews file deck and engine reports, and the office gets **CII, EU MRV/ETS, UK MRV, IMO DCS and FuelEU** compliance, fuel and lube-oil analytics, hull performance, alerts and a helpdesk.",
    details: [
      "**User management**, my first module: create, edit and block users, forced resets, temporary passwords, import and vessel assignment.",
      "**Reporting wizards** for deck officers and engineers, remaining-on-board screens for fuel, fresh water and lube oil, bunkering flows and compliance exports — made **responsive** so crews can report from phones and tablets.",
      "**Analytics dashboards**: lube-oil trends and assessment, a fuel-oil assessment with a fitted speed–power curve, and hull performance.",
      "A **trial-period** feature on a **server-owned clock** that can’t be bypassed by changing the device clock, with lockout, grace periods and admin preview.",
      "Introduced the **WebSocket stack** to the API, the basis for live tickets and notifications.",
      "Pagination across 7+ heavy lists, three white-label client builds and an anomaly-detection overview of ~2,500 lines.",
    ],
    metrics: [
      { value: "960+", label: "merged PRs on the UI" },
      { value: "9", label: "release lines" },
      { value: "40+", label: "API features and fixes" },
    ],
    stack: ["React 18", "TypeScript", "Redux", "Formik", "ECharts", "Django", "Celery"],
  },
  {
    id: "code-quality",
    title: "Code quality & releases",
    period: "Nov 2024 – Oct 2026",
    role: "Led the migrations and release stabilisation",
    blurb: "Zero “any” types, 10× less polling and 30 release-blocking defects closed to ship 2.4.0.",
    summary:
      "The engineering work that keeps a production product shippable: **type safety, performance and clean releases**.",
    details: [
      "Removed **every “any” type** from the UI in a 6-phase migration — API layer, store, every component folder — each phase locked by an **ESLint ratchet**. The sweep surfaced real bugs, fixed and verified against the API.",
      "Cut polling traffic **10×**.",
      "Stabilised release 2.4.0 by closing **12 critical and 18 high-priority defects** across reporting, auth and configuration, and hid unfinished features behind a flag so releases ship clean.",
      "On joining: cleared **52 useEffect and 3 useQuery warnings**, optimised the build and added Husky, CI logs and a new lint rule set.",
      "Docker and offline environments, a client-logo build script, a one-command launcher, cutover guides and user manuals.",
    ],
    metrics: [
      { value: "0", label: "“any” types left" },
      { value: "10×", label: "fewer polling requests" },
      { value: "30", label: "release blockers closed" },
    ],
    stack: ["TypeScript", "ESLint", "Husky", "Vite", "Docker"],
  },
  {
    id: "partner-portal",
    title: "Channel-partner portal",
    period: "Sep 2026",
    role: "Founded the backend and frontend",
    blurb: "A second product built on CVMS patterns — proof the platform travels.",
    summary:
      "A portal for the company’s **channel partners**, founded on the same stack and patterns as CVMS.",
    details: [
      "A new **NestJS + Fastify + Prisma + PostgreSQL** backend with a root task runner.",
      "Cookie-based JWT login with **Argon2id**, sessions, guards and RBAC; channel partners and their users.",
      "The frontend wired to the API with the **Ensign** kit and the CVMS shell; live Partners, Users and Roles admin.",
    ],
    impact: ["Proved the CVMS platform and Ensign are portable to a second product."],
    stack: ["NestJS", "Fastify", "Prisma", "PostgreSQL", "React"],
  },
];

export type PersonalProject = {
  title: string;
  description: string;
  stack: string[];
  /** In-site route, if it lives here. */
  to?: string;
};

export const personalProjects: PersonalProject[] = [
  {
    title: "InquireAI",
    description: "Ask questions of your PDFs in plain language: a RAG pipeline over a FAISS vector store returns answers grounded in the documents.",
    stack: ["Python", "LangChain", "FAISS", "Streamlit", "MongoDB"],
  },
  {
    title: "Artisan Studio",
    description: "A full-stack marketplace for artisans — profiles, product uploads, reviews and buyer messaging.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Cloudinary"],
  },
  {
    title: "JSON Toolkit",
    description: "Format, validate and explore JSON as an interactive graph — built for this site, and you can use it now.",
    stack: ["React", "TypeScript", "React Flow"],
    to: "/json-toolkit",
  },
];

export type Education = { degree: string; school: string; detail: string; year: string };

export const education: Education[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    school: "MES’ Institute of Management & Career Courses, Savitribai Phule Pune University",
    detail: "SGPA 8.0",
    year: "2024",
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "Kamla Nehru Mahavidyalaya, Nagpur",
    detail: "84%",
    year: "2022",
  },
];

export const spokenLanguages = ["English", "Hindi", "Marathi"];
