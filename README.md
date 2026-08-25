# Gaurav Bangade — Portfolio

A personal portfolio built with React 19, TypeScript, Vite, and Tailwind CSS. The home page is a single narrow column — intro, projects, recent writing, experience, education, contact — guarded by a Psyduck that uses Confusion on the whole page when clicked. It also hosts a small markdown blog and a working **JSON Toolkit**.

## Sections

- **Home** (`/`) — intro, *Things I've built*, recent *Writing*, *Experience*, *Education*, *Contact*. Content lives in `src/data/site.ts`.
- **Writing** (`/blog`, `/blog/:slug`) — posts are markdown files in `src/content/posts/`, loaded at build time with `import.meta.glob` and rendered by a tiny dependency-free markdown renderer (`src/lib/markdown.tsx`). See `src/lib/posts.ts` for the frontmatter format; `draft: true` hides a post.
- **JSON Toolkit** (`/json-toolkit`) — paste JSON and get:
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
  App.tsx                  # routes + legacy redirects
  main.tsx                 # entry; BrowserRouter + StrictMode
  data/
    site.ts                # projects, experience, education, stack — edit content here
  content/posts/*.md       # blog posts (frontmatter + markdown)
  lib/
    posts.ts               # loads + sorts posts, parses frontmatter
    markdown.tsx           # minimal markdown → React renderer
  hooks/
    usePsychicBlast.ts     # the Confusion animation (one rAF loop over registered glyphs)
    useDocumentTitle.ts
  components/
    About.tsx              # home page
    Blog.tsx               # post list
    BlogPost.tsx           # single post + prev/next
    ui.tsx                 # shared link styles, page column, breadcrumb
    PsychicText.tsx        # text split into blast-able glyph spans
    PokemonDialog.tsx      # Gen 1 text box
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

- `/` — home (sections are deep-linkable: `/#projects`, `/#writing`, `/#experience`, `/#education`, `/#contact`)
- `/blog` — post list; `/blog/:slug` — a post
- `/json-toolkit` — the toolkit
- Legacy paths redirect: `/about` → `/`, `/education` → `/#education`, `/writing` and `/posts` → `/blog`, `/json-formatter` and `/json-graph` → `/json-toolkit`
