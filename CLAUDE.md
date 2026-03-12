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

## Change Management
- **Prefer local fixes over architectural changes.** If a small, scoped change solves the problem and follows good practice, do that. Don't restructure files, move responsibilities, or change patterns for a localized issue. Propose architectural changes only when the local fix would be genuinely bad practice — discuss before implementing.
- **Never auto-install dependencies.** Before adding a package, explain: (a) what it does and why it's needed, (b) whether the task can be solved without it, and (c) why this library over alternatives. Wait for approval before running `npm install`.
- **Don't reorganize, rename, or delete files** unless it's part of the requested change.
- **Don't upgrade or swap dependencies unprompted.** Only touch versions when asked or when a bug specifically requires it.
- **One concern per change.** Don't bundle "while I'm here" improvements with the requested fix. Mention other issues separately.
- **Small, atomic commits.** One logical change per commit. For work spanning more than ~3 commits, create a branch and suggest commit points at logical milestones (e.g., "data layer works — good commit point before starting UI").
- **Research before migrating.** Before upgrading a major dependency, read the migration guide / changelog first. Don't trial-and-error through breaking changes.
- **Browser-test at meaningful checkpoints** — after a feature works end-to-end or after changing behavior / data flow. Not after every small tweak.
- **Flag mock drift in tests.** When mocking a core integration (e.g., `useChat`), note what the mock doesn't cover and flag if real-format testing is needed.
- **Stop and regroup after 2 failed approaches.** If two different attempts at solving a problem both fail, stop and summarize what was tried instead of continuing to debug. Ask whether to keep going or try a different direction.
- **Flag when going in circles.** If hitting the same error twice or deep-diving into `node_modules`, pause, say so, and suggest a different approach.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript 5)
- **Styling:** Tailwind CSS 4 + CSS custom properties (design tokens in `globals.css`)
- **UI primitives:** Base UI React (unstyled), shadcn/ui v4, class-variance-authority
- **Icons:** lucide-react
- **AI:** AI SDK v6 + Anthropic provider → Claude Haiku (streaming chat via `/api/chat`)
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
    page.tsx              # Main page (client component) — hero, projects, footer
    layout.tsx            # Root layout, Google Fonts (Cormorant Garamond, Jost, DM Mono)
    globals.css           # Design tokens, animations, deco patterns
    api/chat/route.ts     # POST — streaming Claude Haiku endpoint (AI SDK v6)
  components/
    chat-lightbox.tsx     # Lightbox chat UI (NPC persona chatbot)
    chat-card-preview.tsx # Inline chat card on homepage
    chat-widget.tsx       # Floating chat button (IntersectionObserver toggle)
    inline-chat.tsx       # Inline chat component
    persona-avatars.tsx   # NPC persona avatar components
    project-gallery.tsx   # Image carousel (16:10, dots nav)
    lightbox.tsx          # Fullscreen image viewer (keyboard nav)
    deco-rule.tsx         # Art deco diamond divider
    ui/                   # Base UI primitives (button, input)
    __tests__/            # Component tests
  data/
    projects.json         # Project entries (title, dates, role, stack, images)
  lib/
    types.ts              # Shared TypeScript types
    utils.ts              # cn() — clsx + tailwind-merge
    use-chat.ts           # Custom useChat hook (AI SDK v6)
    chatbot/
      chat-context.tsx    # React context for chatbot state
      knowledge-base.ts   # Portfolio data for persona responses
      personas.ts         # NPC persona definitions (4 personas)
      system-prompt.ts    # System prompt templates for Claude Haiku
public/                   # Static assets (project screenshots, hero image, icons)
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
