# Gaurav Bangade — Personal site

My personal site, built with React 19, TypeScript, Vite and Tailwind CSS. It's mostly about my work, with a way to email me and my Pokémon party, who all get involved. It also hosts a working **JSON Toolkit**.

## The home page (`/`)

A sticky header (section links that track where you are, Gengar's night switch, "Email me"; a Game Boy START menu on phones, with a scroll-progress line underneath), a bento grid of tiles, and a footer with link columns.

- **Overview** — hero with Psyduck, a "Building now" tile, four stat tiles that count up like an EXP bar, a Gengar Night Shade tile and the JSON Toolkit.
- **Work** — project tiles in a bento (the flagship gets a 2×2 tile with a ship-to-shore sync diagram), tagged with work domains painted in Pokémon type colours. Each has a party member as its "lead". Tapping a tile opens a detail sheet: a centred dialog on large screens, a bottom sheet on phones.
- **Route map** — the two years as a timeline: a horizontal track on large screens, a vertical list on phones.
- **My party** — a Game Boy party screen. Pick a Pokémon, read its entry, use its move:
  | Pokémon | Move | Effect |
  | --- | --- | --- |
  | Incineroar | Darkest Lariat | spins and throws embers |
  | Psyduck | Confusion | every word on the page wobbles, explodes and snaps back |
  | Tyranitar | Sand Stream | a sandstorm blows across the screen and the page shakes |
  | Gengar | Night Shade | a purple wave, then night mode toggles (the header and tile Gengars do the same) |
  | Sylveon | Fairy Wind | hearts and ribbons float up |
  | Skarmory | Brave Bird | charges, streaks across the screen, hits with a flash and a shake, then takes recoil damage that slowly refills |
- **Contact** — a FormSubmit form, plus a `mailto:` link and a copy button.

Small details: each Pokémon has a 1/64 chance to be shiny per visit (`?shiny` forces it), the Konami code (↑↑↓↓←→←→BA) makes every one shiny, and Sinistcha hides in the footer. Every effect is a no-op or an instant change under `prefers-reduced-motion`.

All content lives in `src/data/site.ts` (work, stats, timeline, contact) and `src/data/party.ts` (the Pokémon). Work content is kept anonymous on purpose: technical detail only, with no employer, product, client or repository names.

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
| Styling    | Tailwind CSS 3, with theme colours as CSS variables (light + night) |
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
  data/
    site.ts                # profile, contact, work projects, stats, timeline
    party.ts               # the party, Sinistcha, shiny odds
  hooks/
    usePsychicBlast.ts     # the Confusion animation (one rAF loop over registered glyphs)
    useTheme.ts            # light/night theme store (data-theme on <html>)
    useInView.ts           # in-view + active-section observers
    useKonamiCode.ts
  pokemon/
    moves.ts               # move effects (particles, sandstorm, Brave Bird, Night Shade…)
    useNightShade.ts       # Night Shade for any Gengar button
    TypeBadge.tsx          # Game Boy type tag
  components/
    home/                  # Home page: Header, Overview, WorkSection + ProjectSheet,
                           # RouteSection, PartySection, ContactSection, Footer…
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

- `/` — home (sections are deep-linkable: `/#work`, `/#numbers`, `/#route`, `/#party`, `/#contact`)
- `/json-toolkit` — the toolkit
- Legacy paths redirect: `/about` and `/education` → `/`, `/json-formatter` and `/json-graph` → `/json-toolkit`

Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc. and GAME FREAK. Sprites are fan-made Gen 5-style sprites; this is a personal, non-commercial site.
