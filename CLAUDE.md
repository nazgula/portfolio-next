# CLAUDE.md — Portfolio AI

## Project Overview
Personal portfolio site for Maria Gurevich — signals fullstack + designer + AI capabilities to recruiters.
Single-page app with streaming AI chat widget.

## Role
Act as an AI development expert and fullstack developer.
- Write concise code following best practices
- **Never silently rewrite code.** For each change, briefly explain:
  1. The issue (current state)
  2. The goal (desired state)
  3. The pattern or practice behind the fix
  4. The code change
- Keep explanations short — this is a learning project, so teach the *why*, but don't over-explain
- **Before every tool/command action**, provide a one-liner explaining:
  - **What** the command does
  - **Why** it's needed right now
  - Example: "Running `npm run build` to verify the production build passes after the layout change."

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript 5)
- **Styling:** Tailwind CSS 4 + CSS custom properties (design tokens in `globals.css`)
- **UI primitives:** Base UI React (unstyled), shadcn/ui v4, class-variance-authority
- **Icons:** lucide-react
- **AI:** Anthropic SDK → Claude Haiku (streaming chat via `/api/chat`)
- **Testing:** Jest 30 + React Testing Library
- **Deploy:** Vercel

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (run before pushing)
- `npm run lint` — ESLint
- `npx jest` — run tests
- `npx jest --watch` — watch mode

## Project Structure
```
src/
  app/
    page.tsx          # Main page (client component) — hero, projects, footer
    layout.tsx        # Root layout, Google Fonts (Cormorant Garamond, Jost, DM Mono)
    globals.css       # Design tokens, animations, deco patterns
    api/chat/route.ts # POST — streaming Claude Haiku endpoint
  components/
    chat-widget.tsx   # Floating chat (SSE streaming)
    project-gallery.tsx # Image carousel (16:10, dots nav)
    lightbox.tsx      # Fullscreen image viewer (keyboard nav)
    deco-rule.tsx     # Art deco diamond divider
    ui/               # Base UI primitives (button, input)
    __tests__/        # Component tests
  data/
    projects.json     # Project entries (title, dates, role, stack, images)
  lib/
    utils.ts          # cn() — clsx + tailwind-merge
public/               # Static assets (project screenshots, hero image, icons)
```

## Design System
**Follow `DESIGN_SYSTEM.md` for all visual decisions.** Key rules:

- **Theme:** Art Deco x Modern Tech — geometric, editorial, gold accents, light warm palette
- **Colors:** Use CSS custom properties (`--color-bg`, `--color-surface`, `--color-accent-gold`, etc.). Never introduce colors outside the token set
- **Typography:** Cormorant Garamond (display/headings), Jost (body/labels), DM Mono (code/metadata)
- **Spacing:** Base-8 system only (`--sp-1` through `--sp-16`)
- **Border radius:** Max 8px. Sharp edges. Tags/chips get `--r-pill`
- **Shadows:** `--shadow-card` (rest), `--shadow-lift` (hover), `--shadow-dark` (overlay)
- **Motion:** `--ease-out` cubic-bezier, `--dur-std` 220ms
- **Art deco elements are NOT optional** — diamond rules, corner brackets, gold accents define the brand
- **Do not** use Inter/Roboto/system-ui, purple gradients, rounded corners > 8px, or generic AI aesthetics

## Coding Conventions
- Path alias: `@/*` → `./src/*`
- Utility classes via Tailwind; design tokens via CSS variables
- Components are client-side (`"use client"`) where interactivity is needed
- Keep components small and focused — one responsibility per file
- Use `cn()` from `@/lib/utils` for conditional classnames
- Streaming responses use SSE (`text/event-stream`), not WebSockets
- Project data lives in `src/data/projects.json`, not hardcoded in components

## Environment Variables
- `ANTHROPIC_API_KEY` — required for chat API (in `.env`, never commit)

## Before Committing
1. `npm run build` — must pass
2. `npm run lint` — must be clean
3. `npx jest` — tests must pass
4. No `.env` or secrets in commits
