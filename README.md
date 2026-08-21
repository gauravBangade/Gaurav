# Gaurav Bangade — Portfolio

A personal portfolio built with React 19, TypeScript, Vite, and Tailwind CSS. The home screen is a grid of cards that morph-expand into full sections; one of those sections is a working **JSON Toolkit**.

## Sections

- **About** — short intro and contact links.
- **Education** — background.
- **JSON Toolkit** — paste JSON and get:
  - live validation with line/column on parse errors
  - prettify / minify, configurable indent, sorted keys
  - copy and download of the formatted output
  - an auto-laid-out node graph of the document (React Flow), with a resizable split pane on desktop and an editor/graph toggle on mobile

## Stack

| Area       | Choice                                  |
| ---------- | --------------------------------------- |
| UI         | React 19, TypeScript 5.9                |
| Build      | Vite 7                                  |
| Styling    | Tailwind CSS 3                          |
| Routing    | React Router 7                          |
| Graph      | `@xyflow/react` (React Flow 12)         |
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
src/
  App.tsx                  # card grid, routes, composes the morph overlay
  main.tsx                 # entry; BrowserRouter + StrictMode
  hooks/
    useCardMorph.ts        # open/close animation state machine, synced to the URL
    useFocusTrap.ts        # keeps keyboard focus inside the open overlay
  components/
    MorphOverlay.tsx       # the expanding dialog shell (Escape to close, focus trap)
    About.tsx
    Education.tsx
    JsonToolkit.tsx        # toolbar, editor/graph panes, resize handle
    JsonEditor.tsx         # textarea with line gutter and status bar
    GraphCanvas.tsx        # React Flow canvas + custom table node
    Toast.tsx
  utils/
    jsonToGraph.ts         # JSON → nodes/edges with a tidy-tree layout
  types/
    graph.ts
```

## Routes

- `/` — home grid
- `/about`, `/education`, `/json-toolkit` — sections (deep-linkable; opening via URL still plays the morph animation)
- `/json-formatter`, `/json-graph` — legacy paths, redirect to `/json-toolkit`
