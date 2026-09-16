/**
 * Editable site content. The home page reads from here so copy changes never
 * touch component code.
 *
 * Wrap a keyword in double asterisks — "shipped the **Voyage Estimator**" —
 * and it renders highlighted (see components/RichText.tsx).
 */

export type ExperienceEntry = {
  company: string;
  role: string;
  /** ISO year-month, e.g. "2024-11". */
  start: string;
  /** ISO year-month, or null while the role is current. */
  end: string | null;
  /** What the company does and where the work sits. Supports **keyword** markers. */
  summary: string;
  /** Concrete outcomes, one to two sentences each. Supports **keyword** markers. */
  highlights: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "Ecosail Infotech",
    role: "Software Engineer",
    start: "2024-11",
    end: null,
    summary:
      "Ecosail builds **maritime emissions software**: crews file deck and engine reports on board, and shore offices get **CII**, **EU MRV/ETS** and **FuelEU** compliance, fuel analytics and a helpdesk. I work across the **React** front ends and the **Django** and **NestJS** back ends of its three products.",
    highlights: [
      "Designed and built the **Voyage Estimator** end to end, UI and API: a two-step wizard turns a voyage timeline of ports, sea legs and daily fuel burn into **CO₂**, attained-versus-required CII with its A–E rating and **EU ETS allowances**. Every regulatory constant moved out of code into seeded **database masters**, checked by parity tests, with saved scenarios and a 1,100-line developer guide.",
      "Sole author of **CVMS**, the next-generation ship-and-shore platform: a **plugin-based modular monolith** on NestJS, Prisma and React where each module ships its own manifest, with JWT auth, a content-addressed file store, a **50-component UI kit** and Playwright suites, styled by **Ensign**, the token-driven design system I published alongside it.",
      "Designed and built the **helpdesk** that connects every customer installation to the shore office: ticket lifecycle, rich-text comments, attachments, saved filters, auto-assign and **webhooks** in the Global API and UI, **client API keys** with audit logging, and **real-time notifications** over a Django Channels WebSocket layer I added to both back ends.",
      "Rebuilt **Ecosail Global**’s web app on a modern stack (React 19, React Router 7, Zustand, TanStack Query, Tailwind 4 and shadcn) with a **Vitest** test lab from the first commit; three-quarters of its source files are mine.",
      "Own the **vessel reporting** flow: deck and engine wizards, bunkering and remaining-on-board screens, the **lube-oil and fuel-oil analytics** dashboards, and a phone-and-tablet **responsive layout** for the whole flow, delivered CSS-first with no behaviour changes.",
      "Shipped an **organisation-wide trial period** across UI and API: server-owned clock, countdown states, admin start/extend/end actions, a post-trial grace mode for ship crew and automatic suppression of reminder emails, backed by 21 tests. Grew the **role-based access control** system with seeded, immutable **system groups**, permission categories and manager scoping, from a 790-line spec I wrote.",
      "Hardened security: moved JWTs into **httpOnly cookies** behind new auth middleware, closed a stored **XSS** hole by routing all eight raw-HTML sites through one sanitiser, cut helpdesk polling traffic **tenfold**, and wrote a **security audit** of five repositories with 28 findings tracked as GitHub issues.",
      "Led the **TypeScript hardening** of a 620-file front end: explicit any types fell from **4,795 to 4**, 321 request call sites were re-typed to unknown, the lint rule flipped to error, and the sweep surfaced **ten real bugs** that shipped as individual fixes.",
    ],
  },
];
