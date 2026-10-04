/**
 * Editable site content. The home page reads from here so copy changes never
 * touch component code.
 *
 * Wrap a keyword in double asterisks — "built the **helpdesk**" — and it
 * renders highlighted (see components/RichText.tsx).
 *
 * Work content is deliberately anonymous: technical detail only, with no
 * employer, product, client, repository or ticket names.
 */

import type { PokemonId } from "./party";

export const profile = {
  name: "Gaurav Bangade",
  greeting: "Hey, I’m Gaurav.",
  headline: "Software engineer · React, TypeScript, Node and Django",
  intro: [
    "I build web applications with **React** and **TypeScript** that are fast, reliable, and thoughtfully designed.",
    "For the last two years I’ve worked on **maritime emissions-compliance software**: crew reporting on board, analytics and compliance on shore, and now the **offline-first platform** that ties ship and shore together.",
    "Outside of work, I build tools, small applications, and experiments.",
  ],
};

export const contact = {
  email: "bangadegaurav@gmail.com",
  /**
   * FormSubmit AJAX endpoint. The first submission sends an activation email
   * to the address above; after activating you can swap the address in this
   * URL for the random alias FormSubmit gives you, to keep it out of the source.
   */
  formEndpoint: "https://formsubmit.co/ajax/bangadegaurav@gmail.com",
  github: "https://github.com/gauravBangade",
  linkedin: "https://www.linkedin.com/in/gaurav-bangade-9a2430222/",
};

/** Sections in the header and footer nav, in page order. */
export const sections = [
  { id: "work", label: "Work" },
  { id: "route", label: "Route map" },
  { id: "party", label: "Party" },
  { id: "contact", label: "Contact" },
];

export const role = {
  title: "Software Engineer",
  field: "Maritime software",
  /** ISO year-month, e.g. "2024-11". */
  start: "2024-11",
  /** ISO year-month, or null while the role is current. */
  end: null as string | null,
};

/** Domains a project touches; each renders as a Pokémon-type-coloured badge. */
export type Domain = "frontend" | "backend" | "architecture" | "realtime" | "data" | "security" | "design";

export type Project = {
  id: string;
  title: string;
  period: string;
  /** What I did on it, e.g. "Main author". */
  role: string;
  domains: Domain[];
  /** One or two sentences, always visible. Supports **keyword** markers. */
  summary: string;
  /** Shown when the card is expanded. Supports **keyword** markers. */
  details: string[];
  stack: string[];
  /** The party member who "leads" this project, with a one-line reason. */
  lead?: { pokemon: PokemonId; note: string };
};

export const projects: Project[] = [
  {
    id: "platform",
    title: "Offline-first ship/shore platform",
    period: "Aug 2026 – now",
    role: "Main author",
    domains: ["architecture", "backend", "frontend"],
    summary:
      "A **plugin-based modular monolith** in which every vessel runs its own offline node that syncs with shore. I started it from my own prototype and lead it.",
    details: [
      "Built the **kernel and module system**: each module ships a manifest that drives navigation, permissions and its sync rules, with the sync section checked when the database schema is composed.",
      "Auth with **JWT sessions** and RBAC; replaced Express with **Fastify** and react-router with **TanStack Router**, and centralised configuration in one typed env module.",
      "Sync groundwork: **UUIDv7** keys, node identity with roles pinned at boot, a **hybrid logical clock**, soft deletes, write stamping of sync version and origin node, and a **pg-boss** job runner.",
      "A **content-addressed, versioned file store**, plus a kernel UI kit — data tables, combobox, rich text, file preview, toasts, a date picker and a responsive shell with a mobile nav drawer — documented in a live component gallery.",
      "An animated sign-in diorama held at **60 fps**, and architecture docs on the deployment model, MQTT vs HTTP reliability, node roles and API data contracts.",
    ],
    stack: ["NestJS", "Fastify", "Prisma", "PostgreSQL", "React", "TanStack", "pg-boss"],
    lead: { pokemon: "tyranitar", note: "Sand Stream sets the field before the rest of the team arrives." },
  },
  {
    id: "helpdesk",
    title: "Helpdesk and master-data hub",
    period: "Apr – Sep 2026",
    role: "Planned it; built the front end and most of the helpdesk API",
    domains: ["frontend", "backend", "realtime"],
    summary:
      "A shore-side app that owns master data for every client installation and runs the **helpdesk** their tickets flow into. I built the **front end from scratch**.",
    details: [
      "Front-end foundation: routing, lazy loading, auth, RBAC, sidebar and form patterns, a test lab and the **React Compiler** from the first commit.",
      "The helpdesk end to end: ticket lifecycle, comments in a **rich-text editor**, attachments with preview, linked and multi-vessel tickets, filters, sorting, pagination and auto-assign.",
      "**Real-time notifications** over WebSockets with sound and toasts, and an API-to-API bridge that keeps tickets, vessels and attachment events in sync with the reporting app; an unreachable **webhook** can no longer break a ticket update.",
      "**Client API keys** with machine authentication and audit logging.",
      "Resilience fixes: kept rotated refresh tokens to stop surprise logouts, recovered from **stale chunks** after a deploy, and made dashboard counts add up and link through to their lists.",
    ],
    stack: ["React", "TypeScript", "Django", "WebSockets"],
    lead: { pokemon: "incineroar", note: "The best support in doubles — it makes everyone around it better." },
  },
  {
    id: "reporting",
    title: "Vessel reporting and compliance app",
    period: "Nov 2024 – now",
    role: "One of the main front-end authors",
    domains: ["frontend", "data"],
    summary:
      "The production app where ship crews file deck and engine reports and shore offices track **CII**, **EU MRV/ETS**, **IMO DCS** and **FuelEU** compliance. **960+ merged PRs** across eight release lines.",
    details: [
      "Reporting flows: forms moved to **Formik** with shared server-error handling, bunkering and delivery-note uploads, and fuel, fresh-water and lube-oil remaining-on-board screens with a wizard and **live consumption maths**.",
      "Analytics: lube-oil trends, SFOC and consumption charts, fleet assessment, and a fuel-oil dashboard with an honest daily trend and a **fitted speed–power curve**.",
      "Compliance screens for EU MRV/ETS and off-hire, spreadsheet exports for IMO DCS, and a **responsive** reporting flow for phones and tablets.",
      "Platform features: **role-based access control** with permission hooks and a deny-by-default route manifest, and an organisation-wide **trial period** with countdown, lockout and a grace mode for ship crew.",
      "Build and quality: cleared dozens of hook warnings, added Husky and stricter lint rules, Docker and **white-label builds**, and stabilised a major release by working through its critical and high-priority defects.",
    ],
    stack: ["React", "TypeScript", "Vite", "Redux", "TanStack Query", "Formik", "Django REST"],
    lead: { pokemon: "psyduck", note: "Water type, so it handles the ships. Mostly." },
  },
  {
    id: "voyage-estimator",
    title: "Voyage emissions estimator",
    period: "Jul 2026",
    role: "Designed and built, UI and API",
    domains: ["frontend", "backend", "data"],
    summary:
      "A planning tool that turns a **voyage timeline** of ports, sea legs and fuel burn into CO₂ and a **CII rating** before the ship sails.",
    details: [
      "A two-step wizard over a voyage timeline, with validation, a calculate flow and a **calculation summary** report.",
      "A calculation endpoint with CII reference lines and rating boundaries, and a **blended carbon factor** for bio-fuel mixes.",
      "Saved estimation history, and a complete developer guide for whoever picks it up next.",
    ],
    stack: ["React", "TypeScript", "Django REST"],
    lead: { pokemon: "skarmory", note: "It has flown every route before the ship has." },
  },
  {
    id: "security",
    title: "Auth, access control and hardening",
    period: "Feb – Oct 2026",
    role: "Front end and API",
    domains: ["security", "backend"],
    summary:
      "Security work across front ends and APIs, from where tokens live to a **multi-repository audit**.",
    details: [
      "Moved auth tokens into **httpOnly cookies** with matching API middleware, and cleared client state on idle logout.",
      "Routed user-generated rich text through **safe HTML rendering**, upgraded vulnerable dependencies and cut polling traffic **tenfold**.",
      "Rewrote **RBAC** on a roles-only model: multi-role users, a **privilege ceiling** enforced by the API, permission hooks and a deny-by-default route manifest with anchored matching and a 403 page.",
      "Ran a **security audit** across several repositories, with every finding tracked as an issue.",
    ],
    stack: ["JWT", "Django REST", "React"],
    lead: { pokemon: "gengar", note: "Nothing hides in the shadows from a Ghost type." },
  },
  {
    id: "design-system",
    title: "Token-driven design system",
    period: "Aug – Sep 2026",
    role: "Author",
    domains: ["design", "frontend"],
    summary:
      "The design language for the new platform: **design tokens**, light and dark themes, and a 26-section React showcase.",
    details: [
      "Covers typography, controls, navigation, tables, charts, forms, modals, calendars and a full fleet dashboard.",
      "Vendored into the platform as its **only styling system**, so product screens use the same tokens and primitives the showcase documents; later mirrored as a standalone UI kit and gallery.",
    ],
    stack: ["React", "TypeScript", "CSS tokens"],
    lead: { pokemon: "sylveon", note: "Ribbons, pastel and surprisingly strong. Good design is like that." },
  },
  {
    id: "partner-portal",
    title: "Partner admin portal",
    period: "Sep 2026",
    role: "Backend foundation and admin UI",
    domains: ["backend", "security"],
    summary:
      "A new portal on **NestJS, Fastify and Prisma** over Postgres, with a root task runner for the whole repo.",
    details: [
      "Cookie-based JWT login with **Argon2id** password hashing, sessions and guards.",
      "RBAC with partners, partner users and roles, and a front end wired to live admin screens using the shared design system and shell.",
    ],
    stack: ["NestJS", "Fastify", "Prisma", "PostgreSQL", "Argon2id"],
  },
];

/** Smaller pieces of work, one line each. */
export const alsoBuilt = [
  "A page-flip magazine reader, kept smooth on phones by turning the flip off there.",
  "Per-environment builds for an Electron desktop wrapper.",
  "An installer and launcher for an on-board offline API.",
  "Technical docs: dashboard guides, a notification-system walkthrough, ticket architecture and API references.",
];

export type Stat = { label: string; value: number; prefix?: string; suffix?: string };

/** Two years of work, Oct 2024 – Oct 2026. Counts are approximate. */
export const stats: Stat[] = [
  { label: "Commits", value: 1270, prefix: "~" },
  { label: "Merged PRs", value: 1110, prefix: "~" },
  { label: "Repositories", value: 13 },
  { label: "Release lines", value: 8 },
];

export type TimelineStop = { period: string; focus: string };

export const timeline: TimelineStop[] = [
  {
    period: "Nov 2024 – Jan 2025",
    focus: "Joined the reporting app: cleared hook warnings, optimised the build, vessel configuration forms, user management, pagination and desktop builds.",
  },
  {
    period: "Feb – Apr 2025",
    focus: "Reporting forms, bunkering uploads, CII assessment charts, custom reports, a navbar redesign, Docker and white-label builds.",
  },
  {
    period: "May – Aug 2025",
    focus: "Remaining-on-board screens and wizard, a fleet management and assessment redesign, sea-trial and speed-and-consumption views.",
  },
  {
    period: "Sep – Dec 2025",
    focus: "Major-release bug fixing, other-port bunkering, the EU MRV/ETS UI, off-hire, report emails and IMO DCS exports; a page-flip magazine reader.",
  },
  {
    period: "Jan – Apr 2026",
    focus: "Lube-oil analytics, SFOC and consumption charts, fuel-oil assessment, RBAC v1, httpOnly-cookie auth and a hull performance UI.",
  },
  {
    period: "Apr – Jun 2026",
    focus: "Built the helpdesk and master-data hub end to end, with a ticket bridge, vessel sync and cross-app notifications.",
  },
  {
    period: "Jul 2026",
    focus: "The voyage estimator, an organisation-wide trial period and RBAC system groups.",
  },
  {
    period: "Aug – Oct 2026",
    focus: "Release stabilisation, a security audit and fixes, an RBAC rewrite — and the new ship/shore platform, its design system and a partner portal.",
  },
];

/** The "Building now" tile points at this project. */
export const currentProjectId = "platform";

export type BuiltThing = { title: string; to: string; description: string };

export const builtThings: BuiltThing[] = [
  { title: "JSON Toolkit", to: "/json-toolkit", description: "Format, validate, and visualize JSON as a graph." },
];
