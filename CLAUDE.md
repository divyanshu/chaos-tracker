# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Startup

Always read `claude-instructions/chaos-tracker-plan.md` at the start of each session to regain project context.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript type-check (tsc -b) then Vite production build
npm run lint      # ESLint across the project
npm run preview   # Preview production build locally
```

No test framework is configured yet.

## Architecture

Chaos Tracker is a minimalist task tracking app built with React 18 + TypeScript + Vite. It uses Supabase (PostgreSQL) as the backend and ShadCN UI components with Tailwind CSS (Stone color theme).

### Multi-client core/UI separation

```
core/              Platform-agnostic domain types & interfaces (no React)
  domain/          Task, TaskStatus, Category types
  repositories/    TaskRepository interface (data access contract)
  services/        Business logic (planned)

infrastructure/    Supabase implementations of core interfaces
  supabase.ts              Client initialization (reads VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  supabase-task-repository.ts  TaskRepository → Supabase REST API

src/               Web client (React)
  app/             App shell and providers (planned)
  features/        Feature modules: landscape (kanban), tasks (CRUD), rejuvenation
  components/ui/   ShadCN components (Button, Card, Badge, Input)
  hooks/           React hooks (planned - TanStack Query wrappers)
  stores/          Zustand stores (planned)
  lib/utils.ts     cn() helper for className merging
```

The core layer has zero UI dependencies. The intended data flow is:
**UI → React Hook → TanStack Query → TaskRepository interface → SupabaseTaskRepository → Supabase API**

### Path alias

`@/*` maps to `./src/*` (configured in both tsconfig.json and vite.config.ts).

### Styling

- Tailwind CSS 3 with CSS variables (HSL format) defined in `src/index.css`
- Dark mode via class-based toggle
- ShadCN components use `class-variance-authority` for type-safe variants
- Base color: Stone (warm gray)

## Project Planning Docs

`claude-instructions/` contains detailed specs:
- `chaos-tracker-plan.md` — implementation roadmap and architecture decisions
- `chaos-tracker-requirements.md` — feature specs, keyboard shortcuts, visual design
- `chaos-tracker-explainer.md` — educational guide explaining technology choices
- `tech-usage.md` — tech stack tracking
- `chaos-project-status.md` — live project status (what's done, in progress, next)

Consult these before making architectural decisions.

**Keep docs in sync:** When making meaningful progress, pivoting direction, or changing the tech stack, update the relevant files above. In particular, `chaos-project-status.md` should always reflect the current state of the project.

## TypeScript

Strict mode is enabled. No unused locals or parameters allowed (`noUnusedLocals`, `noUnusedParameters`).
