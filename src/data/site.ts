/**
 * Editable site content. Pages read from here so copy changes never touch
 * component code.
 *
 * Wrap a phrase in double asterisks — "built **analytics dashboards**" — and
 * it renders in medium weight (see components/RichText.tsx).
 *
 * Work content is technical only: the employer is named, but no clients or
 * confidential details are. Numbers are only ones the work record supports.
 */

export const profile = {
  name: "Gaurav Bangade",
  role: "Software Engineer",
  focus: "Full-stack product engineering",
  location: "Pune, India",
  company: "ecoSAIL Infotech",
  /** ISO year-month the current role started. */
  since: "2024-10",
  intro:
    "**1,100+ merged PRs** on a maritime SaaS product since 2024. I own **six modules** end to end, designed the **access control** the whole product runs on and cut help-desk polling **10×** — with React, TypeScript and Django.",
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
  headline: "Full-Stack Software Engineer — React, TypeScript & Django",
  summary:
    "Full-stack engineer on the early engineering team of a maritime SaaS product since October 2024, with 1,100+ merged pull requests. I own features from requirements to release — six product modules so far, from help desk and reports to analytics dashboards — and designed the role-based access control the whole product runs on. Cut help-desk polling 10×, fixed 30 critical and high-priority bugs and migrated the frontend to Vite. Now architecting CVMS, a modular, offline-first vessel platform.",
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
    start: "2024-10",
    end: null,
    summary:
      "One of the first engineers on the product. I take features from requirements and research through design, build, testing and release — and own six of its modules end to end.",
    metrics: [
      { value: "1,100+", label: "merged pull requests" },
      { value: "6", label: "product modules owned end to end" },
      { value: "10×", label: "fewer help-desk polling requests" },
      { value: "30", label: "critical & high-priority bugs fixed" },
    ],
    highlights: [
      {
        label: "Product modules",
        text: "Own **six modules** — Help Desk, Alerts, Reports, User Management, Vessel & Voyage Management and the analytics dashboards — each taken from requirements to release and maintained since.",
      },
      {
        label: "Access control",
        text: "Designed and shipped the **RBAC** layer every screen now runs on — roles, permission groups, deny-by-default route guards and **httpOnly-cookie** auth — from requirements and research to rollout.",
      },
      {
        label: "Voyage Simulator & Estimator",
        text: "Built tools that predict a voyage’s **CII ratio and grade** — the simulator before a voyage runs, the estimator before it’s even planned — so operators can check emissions ratings ahead of time.",
      },
      {
        label: "Create React App → Vite",
        text: "Led the frontend’s move from Create React App to **Vite** on my own initiative, for faster builds and near-instant dev-server startup.",
      },
      {
        label: "Performance",
        text: "Cut help-desk polling requests **10×**, removed redundant API calls and dead code, cleared **52** React effect warnings and fixed **30** critical and high-priority bugs.",
      },
      {
        label: "CVMS",
        status: "In development",
        text: "Architecting a **modular, offline-first** platform: each vessel runs its own node that syncs with shore, and each client deploys only the modules it buys.",
      },
    ],
  },
];

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { label: "Frontend", items: ["React", "Vite", "TanStack Query", "Redux", "Zustand", "ECharts", "Tailwind CSS", "Formik", "Zod"] },
  { label: "Backend", items: ["Django REST Framework", "NestJS", "Node.js", "Express", "Prisma"] },
  { label: "Data", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { label: "Security", items: ["RBAC", "JWT & refresh flows", "httpOnly cookies", "Audit logs"] },
  { label: "Testing & tooling", items: ["Vitest", "Testing Library", "MSW", "ESLint", "Git"] },
  { label: "AI / LLM", items: ["LangChain", "RAG", "FAISS", "MCP"] },
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
  /** "What I did" bullets on the project page. Supports **keyword** markers. */
  details: string[];
  stack: string[];
};

/** Work projects, each with its own page at /work/:id. The first three appear on the home page. */
export const projects: Project[] = [
  {
    id: "cvms",
    title: "CVMS",
    status: "In development",
    period: "Aug 2026 – now",
    role: "Architecture and core development",
    blurb: "A modular, offline-first vessel platform: every ship runs its own node, and clients deploy only the modules they buy.",
    summary:
      "**CVMS** (Coastal Vessel Management System, a working name) is a **modular, offline-first** platform, currently in development. Each vessel runs its own node that syncs with shore, and each client deploys only the modules it has purchased.",
    details: [
      "Designed for modules such as **reporting, crewing, analysis and inventory management**, each shipped as a plugin whose manifest declares its navigation, permissions and sync rules.",
      "**Offline-first sync** groundwork: UUIDv7 keys, node identity pinned at boot, a hybrid logical clock, soft deletes and a background job runner.",
      "Platform foundations: JWT sessions and RBAC on **Fastify**, TanStack Router, a content-addressed versioned file store and a shared UI kit.",
      "A token-driven **design system** with light and dark themes, used as the platform’s only styling layer.",
    ],
    stack: ["NestJS", "Fastify", "Prisma", "PostgreSQL", "React", "TanStack"],
  },
  {
    id: "voyage-tools",
    title: "Voyage Simulator & Estimator",
    role: "UI and API",
    blurb: "Predict a voyage’s CII emissions grade before it runs — or before it’s even planned.",
    summary:
      "Two planning tools that predict a voyage’s **CII ratio and grade**: the **simulator** from a voyage’s parameters before it runs, and the **estimator** before the voyage is even planned.",
    details: [
      "Simulator: change voyage parameters and see the resulting CII ratio and grade before committing to the voyage.",
      "Estimator: a two-step wizard over a voyage timeline of ports, sea legs and fuel, with validation and a calculation summary.",
      "A calculation API with **CII reference lines and rating boundaries**, and a blended carbon factor for bio-fuel mixes.",
      "Saved estimation history, so earlier scenarios can be revisited.",
    ],
    stack: ["React", "TypeScript", "Django REST Framework"],
  },
  {
    id: "access-control",
    title: "Role-based access control",
    period: "Feb – Oct 2026",
    role: "Requirements to rollout",
    blurb: "The access model every screen runs on — researched, designed and rolled out by me.",
    summary:
      "The permission layer of a **multi-client** product. I gathered the requirements, researched access models, designed the role and permission approach, and rolled it out across the app — so users only see the actions, reports and routes their roles allow.",
    details: [
      "**Roles and permission groups** with reusable assignment panels, route-level guards and a deny-by-default route manifest.",
      "Auth tokens moved into **httpOnly cookies** with matching API middleware, plus hardened login and refresh flows.",
      "**API-key lifecycle** for client integrations: split key id and secret, hashed verification, rotation, revocation and audit logs.",
    ],
    stack: ["React", "TypeScript", "Django REST Framework", "JWT"],
  },
  {
    id: "help-desk",
    title: "Help Desk",
    period: "Apr – Sep 2026",
    role: "UI and API",
    blurb: "Real-time support between ships and shore that keeps working on weak connections — with 10× fewer polling requests.",
    summary:
      "A **help desk** that connects vessels with shore support teams, with **alerts** and real-time notifications — built to keep working on unreliable connections.",
    details: [
      "Ticket lifecycle with comments, attachments, linked tickets, filters and auto-assign.",
      "**Real-time notifications** over WebSockets, and an API-to-API bridge that keeps two applications in sync.",
      "Queued actions with **retries and background reconciliation** for unstable vessel connectivity.",
      "Cut the help desk’s polling requests **10×** by moving updates to real-time notifications.",
    ],
    stack: ["React", "TypeScript", "Django", "WebSockets"],
  },
  {
    id: "dashboards",
    title: "Data dashboards",
    period: "2025 – now",
    role: "Frontend",
    blurb: "Engine, hull, fuel and emissions analytics — new views plug into one shared data layer.",
    summary:
      "Dashboards that turn vessel reports into **operational and compliance insight**: engine and hull performance, fuel, lube oil, emissions and fleet KPIs.",
    details: [
      "Engine analytics with **typed API hooks**, 3/6/12-month periods, KPI cards, dual-axis charts, scatter plots and load diagrams.",
      "**Aggregation separated from rendering**, so new views reuse one data layer.",
      "Consistent zero-vs-empty and no-data handling across every analytics view.",
    ],
    stack: ["React", "TypeScript", "ECharts", "TanStack Query"],
  },
  {
    id: "reports",
    title: "Reports",
    period: "Nov 2024 – now",
    role: "Frontend",
    blurb: "Five on-board report wizards that never lose work — partial saves, edits and revisits included.",
    summary: "The **multi-step report wizards** crews fill in on board — **five report types** covering fuel, lube oil, bunkering, fresh water and running hours.",
    details: [
      "Reliable **partial saves, revisit and edit flows**, dynamic tabs and save-change confirmations.",
      "Shared form patterns with **Formik and Yup**, and consistent server-error handling.",
      "A **responsive** reporting flow for phones and tablets.",
    ],
    stack: ["React", "TypeScript", "Formik", "Yup"],
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

export type Education = { degree: string; school: string; detail: string };

export const education: Education[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    school: "MES’ Institute of Management & Career Courses, Savitribai Phule Pune University",
    detail: "SGPA 8.0",
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "Kamla Nehru Mahavidyalaya, Nagpur",
    detail: "84%",
  },
];

export const spokenLanguages = ["English", "Hindi", "Marathi"];
