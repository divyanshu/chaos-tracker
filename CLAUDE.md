# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Startup

Always read `claude-instructions/chaos-tracker-plan.md` at the start of each session to regain project context.

## Commands

```bash
# CLI (the app)
cd cli && npm run build   # Build CLI with tsup
chaos --mock              # Run CLI in mock mode (after npm link)
chaos                     # Run CLI with Supabase
chaos config              # View/edit Supabase credentials
cd cli && npm run dev     # Run without rebuilding (tsx)
```

No test framework is configured yet.

## Architecture

Chaos Tracker is a CLI-only task tracker built with Ink 5 + TypeScript. Supabase (PostgreSQL) is the backend.

### Project structure

```
chaos-tracker/
├── core/                        # Shared domain layer (platform-agnostic, no UI deps)
│   ├── domain/                  # Task, TaskStatus, Category, Tag types
│   ├── repositories/            # TaskRepository interface (data access contract)
│   └── services/                # Business logic (fuzzy search, palette actions)
├── cli/                         # The app (Ink 5 + @inkjs/ui + chalk)
│   ├── src/                     # CLI source code
│   ├── package.json             # CLI dependencies
│   ├── tsup.config.ts           # Build config (bundles #core alias)
│   └── tsconfig.json            # TS config (includes ../core/**)
├── experiments/
│   └── canvas/                  # Archived canvas experiment (React Flow + GSAP) — not actively developed
├── claude-instructions/         # Planning docs and specs
├── CLAUDE.md
├── README.md
└── package.json                 # Minimal root (project identity only)
```

### Core / CLI relationship

The `core/` directory is shared domain logic. The CLI imports it via a `#core` path alias:
- `cli/tsup.config.ts` — alias `#core` → `../core`
- `cli/tsconfig.json` — paths `#core/*` → `../core/*`

Data flow: **CLI UI → Ink components → TaskRepository interface → SupabaseTaskRepository → Supabase API**

## Project Planning Docs

`claude-instructions/` contains:
- `chaos-tracker-plan.md` — architecture decisions and feature details
- `chaos-tracker-requirements.md` — feature specs and keyboard shortcuts
- `chaos-project-status.md` — live project status (what's done, what's next)

Consult these before making architectural decisions.

**Keep docs in sync:** When making meaningful progress, pivoting direction, or changing the approach, update the relevant files above. `chaos-project-status.md` should always reflect the current state.

## TypeScript

Strict mode is enabled. No unused locals or parameters allowed (`noUnusedLocals`, `noUnusedParameters`).
