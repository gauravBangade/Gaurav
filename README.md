# Gaurav Bangade — Personal site

My personal site, built with React 19, TypeScript, Vite and Tailwind CSS. It's mostly about my work, with a way to email me and my Pokémon party, who all get involved. It also hosts a working **JSON Toolkit**.

## The site

A professional portfolio first, with Pokémon as a quiet recurring theme. Every page sits in one reading column under a sticky header (name, Work · Party · Contact, and Gengar's night switch) and above a one-line footer.

| Page | Route | What's on it |
| --- | --- | --- |
| Home | `/` | Who I am, where I work and what I do; Experience (summary, metrics, one line per area); Selected work; Skills; Education; Beyond work (with the current party); Get in touch |
| Work | `/work` | Every work project and side project as a simple list |
| Project | `/work/:id` | One work project: summary, what I did, what it's built with, previous/next |
| Party | `/party` | The Game Boy party screen — pick a Pokémon and use its move |
| Contact | `/contact` | A FormSubmit form, plus email, LinkedIn and GitHub |

Pokémon touches, all opt-in: Psyduck is the profile picture (hover it; click it and it uses Confusion on the page), Gengar is the night switch, the party gets a strip on the home page and its own page, Sinistcha hides in the footer, and the contact form says "Gotcha!" when a message is caught.

Party moves:

| Pokémon | Move | Effect |
| --- | --- | --- |
| Incineroar | Darkest Lariat | spins and throws embers |
| Psyduck | Confusion | every word on the page wobbles, explodes and snaps back |
| Tyranitar | Sand Stream | a sandstorm blows across the screen and the page shakes |
| Gengar | Night Shade | a purple wave, then night mode toggles (the header Gengar does the same) |
| Sylveon | Fairy Wind | hearts and ribbons float up |
| Skarmory | Brave Bird | charges, streaks across the screen, hits with a flash and a shake, then takes recoil damage that slowly refills |

Each Pokémon has a 1/64 chance to be shiny per visit (`?shiny` forces it), and the Konami code (↑↑↓↓←→←→BA) makes every one shiny. Every effect is a no-op or an instant change under `prefers-reduced-motion`.

On a page change the window starts at the top (back/forward keeps the browser's position), the tab title updates and focus moves to the page's heading. `vercel.json` rewrites every path to `index.html` so deep links work.

All content lives in `src/data/site.ts` (profile, experience, skills, projects, education, contact) and `src/data/party.ts` (the Pokémon). Work descriptions are technical only: the employer is named, but no clients, products or repositories are.

### Contact form (FormSubmit)

The form posts to `contact.formEndpoint` in `src/data/site.ts`, which uses FormSubmit's alias for my address rather than the address itself. The form is activated for `gaurav-fun.vercel.app`; submissions from another domain (including localhost) need their own activation.

## JSON Toolkit (`/json-toolkit`)

Paste JSON and get:
- live validation with line/column on parse errors
- prettify / minify, configurable indent, sorted keys
- copy and download of the formatted output
- an auto-laid-out node graph of the document (React Flow), with a resizable split pane on desktop and an editor/graph toggle on mobile

## Stack

| Area       | Choice                                  |
| ---------- | --------------------------------------- |
| UI         | React 19, TypeScript 5.9                |
| Build      | Vite 7                                  |
| Styling    | Tailwind CSS 3, theme colours as CSS variables (light + night); Instrument Serif + Inter |
| Routing    | React Router 7                          |
| Graph      | `@xyflow/react` (React Flow 12)         |
| Effects    | Hand-written: one rAF loop for Confusion, the Web Animations API for moves |
| Lint       | ESLint 9 + typescript-eslint + react-hooks |

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build locally
npm run lint      # eslint
```

## Project layout

```
public/
  sitting-psyduck.webp     # the hero Psyduck
  pokemon/<id>[-shiny].png # Gen 5-style party sprites
src/
  App.tsx                  # routes + legacy redirects
  pages/                   # HomePage, WorkPage, ProjectPage, PartyPage, ContactPage
  data/
    site.ts                # profile, contact, work projects, stats, timeline
    party.ts               # the party, Sinistcha, shiny odds
  hooks/
    usePsychicBlast.ts     # the Confusion animation (one rAF loop over registered glyphs)
    useTheme.ts            # light/night theme store (data-theme on <html>)
    prefersReducedMotion.ts
    useDocumentTitle.ts
    useKonamiCode.ts
  pokemon/
    moves.ts               # move effects (particles, sandstorm, Brave Bird, Night Shade…)
    useNightShade.ts       # Night Shade for any Gengar button
    TypeBadge.tsx          # Game Boy type tag
  components/
    site/                  # Shared site pieces: Layout, Header, Footer, Section/PageHeader,
                           # ProjectList, PsyduckHero, PartyScreen, ContactForm, icons, styles
    PsychicText.tsx        # text split into blast-able glyph spans
    RichText.tsx           # **keyword** highlighting on top of PsychicText
    PokemonDialog.tsx      # Gen 1 text box
    JsonToolkit.tsx        # toolbar, editor/graph panes, resize handle
    JsonEditor.tsx         # textarea with line gutter and status bar
    GraphCanvas.tsx        # React Flow canvas + custom table node
    Toast.tsx
  utils/
    jsonToGraph.ts         # JSON → nodes/edges with a tidy-tree layout
```

## Routes

- `/`, `/work`, `/work/:id`, `/party`, `/contact` — the site
- `/json-toolkit` — the toolkit
- Legacy paths redirect: `/about`, `/education` and `/route` → `/`, `/json-formatter` and `/json-graph` → `/json-toolkit`

Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc. and GAME FREAK. Sprites are fan-made Gen 5-style sprites; this is a personal, non-commercial site.
