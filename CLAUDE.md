# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Startup

Always read `claude-instructions/chaos-tracker-plan.md` at the start of each session to regain project context.

## Commands

```bash
# CLI (primary interface)
cd cli && npm run build   # Build CLI with tsup
chaos --mock              # Run CLI in mock mode (after npm link)
chaos                     # Run CLI with Supabase
chaos config              # View/edit Supabase credentials

# Canvas experiment (React Flow infinite canvas)
cd experiments/canvas && npm install && npm run dev  # Start Vite dev server
# Runs in mock mode by default; add .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for Supabase

# Web experiment (archived — not actively developed)
cd experiments/web && npm install && npm run dev   # Start Vite dev server
```

No test framework is configured yet.

## Architecture

Chaos Tracker is a CLI-first task tracker. The CLI (`cli/`) is the primary interface, built with Ink 5 + TypeScript. The web client (React/Vite) is archived in `experiments/web/` for potential future revival. Supabase (PostgreSQL) is the backend.

### Project structure

```
chaos-tracker/
├── core/                        # Shared domain layer (platform-agnostic, no UI deps)
│   ├── domain/                  # Task, TaskStatus, Category types
│   ├── repositories/            # TaskRepository interface (data access contract)
│   └── services/                # Business logic (fuzzy search, palette actions)
├── cli/                         # Primary application (Ink 5 + @inkjs/ui + chalk)
│   ├── src/                     # CLI source code
│   ├── package.json             # CLI dependencies
│   ├── tsup.config.ts           # Build config (bundles #core alias)
│   └── tsconfig.json            # TS config (includes ../core/**)
├── experiments/
│   ├── canvas/                  # Canvas experiment (React Flow + GSAP + Tailwind)
│   │   ├── src/                 # Canvas-specific React code
│   │   ├── package.json         # Canvas dependencies
│   │   ├── vite.config.ts       # Vite config (#core alias → ../../core)
│   │   └── tsconfig.json
│   └── web/                     # Archived web experiment (React 18 + Vite + ShadCN)
│       ├── src/                 # Web-specific React code, infrastructure/
│       ├── package.json         # Web dependencies
│       ├── vite.config.ts, tailwind.config.js, etc.
│       └── tsconfig.json
├── claude-instructions/         # Planning docs and specs
├── CLAUDE.md
├── README.md
└── package.json                 # Minimal root (project identity only)
```

### Core / CLI relationship

The `core/` directory is shared between clients. The CLI imports it via a `#core` path alias:
- `cli/tsup.config.ts` — alias `#core` → `../core`
- `cli/tsconfig.json` — paths `#core/*` → `../core/*`

Data flow: **CLI UI → Ink components → TaskRepository interface → SupabaseTaskRepository → Supabase API**

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
