# Chaos Tracker - Development Plan

*This plan is automatically updated as we make decisions and change directions.*

---

## Current Focus: CLI-Only

Chaos Tracker is a CLI-first task tracker. The CLI (`cli/`) is the only active interface. Web and canvas experiments were done as explorations but the project has settled on the terminal as the primary — and only — client going forward.

---

## Architecture

```
chaos-tracker/
├── core/                  Shared domain layer (no UI dependencies)
│   ├── domain/            Task, TaskStatus, Category, Tag types
│   ├── repositories/      TaskRepository interface
│   └── services/          Fuzzy search, palette actions
├── cli/                   The app (Ink 5 + Supabase)
│   ├── src/views/         Dashboard, onboarding, config, detail, filter, help, command
│   ├── src/hooks/         Navigation, type-ahead, task grouping
│   ├── src/components/    Category groups, panels, task rows, type-ahead input
│   ├── src/infrastructure/ Supabase + mock repositories
│   └── src/utils/         Config file management, time formatting
├── experiments/canvas/    Archived canvas experiment (not actively developed)
└── claude-instructions/   Planning docs and specs
```

**Data flow:** Ink UI → React hooks → TaskRepository interface → Supabase

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript (strict) |
| Terminal UI | Ink 5 + @inkjs/ui |
| Styling | chalk 5 |
| Build | tsup |
| Database | Supabase (PostgreSQL) |

---

## Task Model

```typescript
type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus           // pending | in_progress | paused | completed
  category: string             // workflow bucket (Urgent, Up Next, Admin, Flow)
  tags: string[]               // topic labels (Work, Personal, Chores, etc.)
  last_touched: string
  created_at: string
  updated_at: string
}
```

### Categories (workflow buckets)
| Category | Color | Purpose |
|----------|-------|---------|
| **Urgent** | Red | Deadline-driven, needs immediate attention |
| **Up Next** | Amber | Queued for action soon (default for new tasks) |
| **Admin** | Stone | Routine/maintenance tasks |
| **Flow** | Purple | Deep work, creative, no hard deadline |

### Tags (topic labels)
Work, Personal, Chores, Connection, Hobby, Rejuvenate — optional, multi-select, used for filtering and visual context.

### Special system categories
- **Completed** — Tasks with `status === 'completed'` migrate here on app launch. Collapsible.

---

## CLI Features (Done)

- Dashboard with workflow category groups (Urgent, Up Next, Admin, Flow)
- Keyboard navigation (j/k/arrows), status actions (s/p/c/d)
- Task create/edit forms with category + tags + description
- Type-ahead rapid entry (`/`) — fuzzy search + create inline
- Command palette (`:`) — text commands
- Filter view (`f`) — filter by category, status, and tag
- Help (`?`)
- Neglect indicators (`!` / `!!`) on task rows
- Completed category — collapsible at bottom, migrated on launch
- Supabase integration (default) + `--mock` mode (in-memory)
- First-run onboarding wizard + `chaos config` for credential editing
- Global `chaos` command via `npm link`

---

## CLI: Type-Ahead Rapid Entry

A single inline input that unifies search and create into one fluid interaction.

**State machine:**
```
Dashboard ──(/)--> SEARCHING ──(type)──> SEARCHING (filter updates live)
                       │
                       ├──(↑/↓)─────> navigate results
                       ├──(Enter)────> open selected task
                       ├──(s/p/c)───> quick-action on selected result
                       ├──(Tab)──────> CREATING (typed text becomes title)
                       └──(Esc)──────> dismiss

               CREATING ──(←/→)──> cycle category
                   │       (↓/Tab)─> focus tags row
                   │       (←/→)──> cycle tag focus
                   │       (Space)─> toggle tag
                   │       (↑)────> back to category row
                   ├──(Enter)────> create task, flash confirmation
                   └──(Esc)──────> back to searching
```

---

## CLI: Onboarding & Config

Boot sequence (in order):
1. `chaos config` → show ConfigView, exit
2. `chaos --mock` → MockTaskRepository, launch app
3. Env vars present → SupabaseTaskRepository, launch app
4. No env vars → OnboardingView (multi-step wizard)

Credentials saved to `~/.config/chaos-tracker/.env` (chmod 600).

---

## CLI: Categories → Tags Refactor (Done)

Old "categories" (Work, Personal, etc.) are now **tags** — topic labels assigned to tasks. New **workflow categories** (Urgent, Up Next, Admin, Flow) are the primary grouping. Tasks have one category and zero or more tags.

Supabase migration: `tags text[]` column added, old category names migrated to tags array.

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Multi-client architecture | Experiment with Web, CLI, Canvas visualizations |
| 2026-01-26 | Supabase backend | Already set up, simple to integrate |
| 2026-02-16 | CLI type-ahead rapid entry | Unify search+create into single inline input for zero-friction task capture |
| 2026-02-16 | Reclaim `/` for type-ahead, keep `:` for commands | `/` is natural "search" key |
| 2026-02-17 | CLI productionization via npm link | Global `chaos` command from local repo |
| 2026-02-17 | XDG config for CLI credentials | `~/.config/chaos-tracker/.env` works from any directory |
| 2026-02-17 | Interactive onboarding wizard | Detect missing credentials on first run |
| 2026-03-11 | Categories → Tags refactor | Old categories become tags; new workflow categories for prioritization |
| 2026-03-13 | Remove web experiment | CLI is the settled interface; web/canvas are archived explorations |
| 2026-03-13 | Remove Top of Mind + touch | 'Flow' workflow category replaces the need for touch-based surfacing |
| 2026-03-13 | Remove Dual-view planning | Over-engineered; current category model is sufficient |

---

*Last updated: 2026-03-13*
