# Chaos Tracker - Development Plan

*This plan is automatically updated as we make decisions and change directions.*

---

## Current Status: Planning Dual-View Experience (In the Flow / Structured World)

**Related Documents:**
- `chaos-tracker-requirements.md` - Detailed feature requirements
- `chaos-tracker-explainer.md` - Learning guide for each phase
- `reference-screenshots/` - Visual design references

## Vision

A minimalist task tracking app that shows tasks and categories when needed, but otherwise stays out of the way. **Multiple visualization experiments** will help discover the ideal interface:

| Experiment | Description | Status |
|------------|-------------|--------|
| **Web (Kanban)** | Board-style columns, visual cards | Done (archived in experiments/web/) |
| **CLI** | Terminal-based, keyboard-driven | Done (primary interface) |
| **Canvas** | Mind-map style, nodes & connections | Done (experiments/canvas/) |

All experiments share the same core logic and database.

---

## Tech Stack (Decided)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Build | Vite | Fast dev experience, modern ESM |
| Framework | React 18+ TypeScript | Stable, portable to Electron/RN |
| UI | ShadCN UI + Tailwind CSS | Themeable, copy-paste ownership |
| Server State | TanStack Query v5 | Caching, optimistic updates |
| Client State | Zustand | Lightweight UI state |
| Database | Supabase | Already set up with tasks table |
| Routing | React Router v6 | Works in Electron context |

---

## Architecture

### Multi-Client Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         SHARED LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  core/           Types, business logic, interfaces      │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  infrastructure/ Supabase implementation                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Web (Kanban)   │  │      CLI        │  │     Canvas      │
│  React + ShadCN │  │  Node.js + Ink  │  │  React + Flow   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Key Principle:** `core/` and `infrastructure/` have zero UI dependencies. Any client can import them.

### Directory Structure (Web Client)

```
src/
├── core/                 # SHARED: Platform-agnostic
│   ├── domain/           # Types (Task, Category)
│   ├── services/         # Business logic (no React)
│   └── repositories/     # Data access interfaces
├── infrastructure/       # SHARED: Supabase implementation
│
├── app/                  # WEB CLIENT: Shell, providers, routing
├── features/             # WEB CLIENT: Feature modules with UI + hooks
│   ├── tasks/
│   ├── landscape/        # Kanban dashboard
│   └── rejuvenation/
├── components/ui/        # WEB CLIENT: ShadCN components
└── stores/               # WEB CLIENT: Zustand (UI state only)
```

When we add CLI or Canvas experiments, they'll be separate directories/projects that import from `core/` and `infrastructure/`.

---

## Implementation Phases

### Phase 1: Project Setup & Foundation
- Initialize Vite + React + TypeScript
- Configure Tailwind CSS + ShadCN UI
- Set up directory structure
- Configure Supabase environment

**Success:** `npm run dev` works, ShadCN components render

### Phase 2: Core UI Components
- Add essential ShadCN components
- Create domain types matching Supabase schema
- Build TaskCard, CategorySection, TaskForm
- Implement theme toggle

**Success:** UI components display mock data correctly

### Phase 3: Supabase Integration
- Generate TypeScript types from Supabase
- Implement repository pattern
- Create TanStack Query hooks
- Add optimistic updates

**Success:** Real data flows from Supabase to UI

### Phase 4: Main Features
- Build LandscapeView (main dashboard)
  - Kanban-style board layout with categories as columns
  - Tasks displayed as cards within category columns
  - Each card shows title + status badge
  - Quick task creation input at bottom of each column
  - Reference: `claude-instructions/reference-screenshots/`
- Task filtering by category/status
- Quick status actions (Start, Pause, Complete)
- "Touch" functionality
  - Updates `last_touched` timestamp without changing status
  - Visual indicator for recently touched vs neglected tasks
- Task CRUD operations (create, read, update, delete)
- Rejuvenation logging
- Keyboard shortcuts:
  - `Enter`: Create new task (when in input field)
  - `Space`: Toggle task status (when task focused)
  - `Tab` / `Shift+Tab`: Navigate between tasks
  - `t`: Touch focused task

**Success:** Full task management workflow works

### Phase 5: Polish & Theming
- Refine visual design
- Set up CSS variable theming system
- Responsive design (mobile-first)
- Loading/error states
- Toast notifications
- Accessibility compliance

**Success:** Production-ready, themeable MVP

---

## Visualization Experiments

### Experiment 1: Web (Kanban) — Done (archived)
*Phases 1-5 above. Archived in `experiments/web/`.*

Standard kanban board with category columns. Best for:
- Visual overview of all tasks
- Drag-and-drop organization
- Users who think spatially

### Experiment 2: CLI (Command Line Interface) — Done (primary interface)
*Production app — `cli/` directory*

Terminal-based task management using Ink 5 (React for terminals):
- **Tech**: Ink 5 + @inkjs/ui + chalk 5 + tsup (build) + tsx (dev)
- **Reuses**: `core/` domain types bundled via tsup at build time
- **Data**: Supabase (default) or in-memory mock (`--mock` flag)
- **Features**: Dashboard (category groups), keyboard navigation (j/k/arrows), status actions (s/p/c/t/d/e), task create/edit forms, command palette (:), type-ahead rapid entry (/), filter view (f), help (?), neglect indicators, Top of Mind view, collapsible Completed category, completed task migration on launch
- **Install**: `cd cli && npm install && npm run build && npm link`
- **Run**: `chaos` (global) or `cd cli && npm run dev` (development)

```
┌─────────────────────────────────────────────────────────┐
│ chaos-tracker                                    [?] help│
├─────────────────────────────────────────────────────────┤
│ WORK (3)                                                │
│   ● Review PR #42                          [in progress]│
│   ○ Update documentation                      [pending] │
│   ○ Fix login bug                             [pending] │
│                                                         │
│ PERSONAL (2)                                            │
│   ○ Call dentist                              [pending] │
│   ◐ Plan weekend trip                          [paused] │
├─────────────────────────────────────────────────────────┤
│ > _                                                     │
└─────────────────────────────────────────────────────────┘
```

Best for:
- Developers who live in the terminal
- Quick keyboard-only workflows
- Low distraction, text-focused

### Experiment 3: Canvas (Mind Map) — Done
*Built in `experiments/canvas/`*

Infinite canvas with React Flow v12, GSAP animations, keyboard navigation, quick entry, command palette, task detail panel, sidebar layout mode, Supabase integration with mock fallback. See `chaos-project-status.md` for full feature list.

---

## CLI: Type-Ahead Rapid Entry

### Problem

The CLI currently separates search and task creation into distinct views (`:` command palette, `n` create form, `f` filter). Switching between these modes creates friction. A user who wants to jot down a thought shouldn't need to think about whether they're "searching" or "creating" — they should just start typing.

### Vision

A single inline input that unifies search and create into one fluid interaction. Press `/`, start typing. If what you typed matches existing tasks, they appear filtered below the input. If nothing matches, a couple keystrokes turn your text into a new task. No view switches, no multi-step forms — just type and go.

Think: Spotlight/Alfred for your task list.

### Activation

- **`/`** activates type-ahead from the dashboard (reclaimed from command palette)
- **`:`** remains the command palette trigger (unchanged)
- The input renders **inline within the dashboard**, not as a separate view

### State Machine

```
Dashboard ──(/)--> SEARCHING ──(type)──> SEARCHING (filter updates live)
                       │
                       ├──(↑/↓)─────> SEARCHING (navigate matched results)
                       ├──(Enter)────> Dashboard (open selected match)
                       ├──(s/p/c/t)─> Dashboard (quick-action on selected match)
                       ├──(Tab)──────> CREATING  (typed text becomes title)
                       └──(Esc)──────> Dashboard (dismiss)

                   CREATING ──(←/→)──> CREATING (cycle category chips)
                       │
                       ├──(Enter)────> Dashboard (task created, flash confirmation)
                       └──(Esc)──────> SEARCHING (go back, keep text)
```

### Visual Design

**Searching (matches found):**
```
┌─ / Quick Entry ──────────────────────────────────┐
│ > review api_                                     │
│                                                   │
│ ▸ ● Review quarterly OKRs            Work    2h  │
│   ○ Update API documentation          Work    3d  │
│                                                   │
│  2 matches · ↑↓:select · Enter:open · Tab:new    │
└───────────────────────────────────────────────────┘
╭─ Work (3) ────────────────────────────────────────╮
│ ...tasks continue below...                        │
╰───────────────────────────────────────────────────╯
```

**Searching (no matches):**
```
┌─ / Quick Entry ──────────────────────────────────┐
│ > buy groceries for dinner_                       │
│                                                   │
│   No matching tasks                               │
│                                                   │
│  Tab: create "buy groceries for dinner" · Esc:×   │
└───────────────────────────────────────────────────┘
```

**Creating (after Tab):**
```
┌─ / Quick Entry ──────────────────────────────────┐
│ + buy groceries for dinner                        │
│                                                   │
│   Category:  Work  [Personal]  Chores  Connection │
│                     ^^^^^^^^                      │
│  ←→:category · Enter:create · Esc:back            │
└───────────────────────────────────────────────────┘
```

**Confirmation flash (auto-dismiss after ~1s):**
```
┌─ / Quick Entry ──────────────────────────────────┐
│ ✓ Created "buy groceries for dinner" in Personal  │
└───────────────────────────────────────────────────┘
```

### Key UX Details

1. **Highlight matched text** — Bold the matched portions in result titles using the existing `titleHighlights` from `fuzzy-search.ts`
2. **Category + time metadata** — Each result row shows category (colored) and relative time
3. **Status badge** — Each result row shows the status symbol (●/○/◐) in its status color
4. **Neglect indicator** — Show ⚠ / !! on results where applicable
5. **Result limit** — Show max 5-6 results to keep the overlay compact
6. **Quick actions on matches** — When a result is selected (▸), `s`/`p`/`c`/`t` perform status actions inline without leaving type-ahead; the result updates in place
7. **Tab always available** — Even when matches exist, Tab creates a new task from the current text (user might want a different task with similar words)
8. **Empty input** — Shows most recently touched tasks (leverages existing `searchTasks` empty-query behavior)
9. **Auto-dismiss confirmation** — After creating a task, show a brief success flash then return to dashboard with the task list refreshed

### Implementation Plan

#### Step 1: AppState Extension

**File:** `cli/src/app.tsx`

- Add `typeaheadOpen: boolean` to `AppState` (default `false`)
- This is a sub-mode of dashboard, not a new view — the dashboard content stays visible underneath

#### Step 2: Type-Ahead State Hook

**New file:** `cli/src/hooks/use-typeahead.ts`

- `useReducer`-based state machine with states: `searching | creating | confirmed`
- State shape:
  ```typescript
  type TypeAheadState = {
    mode: 'searching' | 'creating' | 'confirmed'
    query: string
    results: SearchResult[]       // from core/services/fuzzy-search
    selectedResultIdx: number
    categoryIdx: number           // for create mode
    createdTaskTitle: string      // for confirmation flash
  }
  ```
- Actions: `SET_QUERY`, `NAVIGATE_RESULT`, `SELECT_RESULT`, `START_CREATE`, `CYCLE_CATEGORY`, `CONFIRM_CREATE`, `RESET`
- Import `searchTasks` from `core/services/fuzzy-search.ts` — already platform-agnostic
- On `SET_QUERY`: run `searchTasks(tasks, query, 6)` and update results + reset selection to 0
- On `START_CREATE`: transition to `creating` mode, carry over query as title
- On `CONFIRM_CREATE`: call `repo.create(...)`, transition to `confirmed`, auto-reset after timeout

#### Step 3: Type-Ahead Component

**New file:** `cli/src/components/TypeAheadInput.tsx`

- Renders the bordered panel with:
  - Text input line (using `@inkjs/ui` `TextInput` in `searching` mode)
  - Results list or "no matches" message (in `searching` mode)
  - Category chips row (in `creating` mode)
  - Confirmation message (in `confirmed` mode)
  - Context-sensitive hint bar at bottom
- Highlighted match rendering: iterate `titleHighlights` ranges, wrap matched chars in `chalk.bold`
- Category chips: horizontal row of `DEFAULT_CATEGORIES` names, selected one wrapped in `[brackets]` and colored
- Uses `useInput` for non-text keys (↑/↓, Tab, Esc, ←/→, Enter in create mode, s/p/c/t for quick actions)

#### Step 4: Dashboard Integration

**Modified file:** `cli/src/views/DashboardView.tsx`

- When `state.typeaheadOpen` is true, render `<TypeAheadInput />` between `<Header />` and the category groups
- The dashboard content (categories, tasks) remains visible below for context

#### Step 5: Keyboard Remapping

**Modified file:** `cli/src/hooks/use-navigation.ts`

- Change `/` handler: instead of opening command palette, set `typeaheadOpen: true`
- Keep `:` as command palette trigger
- Add `isActive` guard: `state.view === 'dashboard' && !state.typeaheadOpen`

**Modified file:** `cli/src/components/layout/Footer.tsx`

- Change `/:cmd` shortcut display to `/:entry` and `::cmd` (separate the two)

#### Step 6: Quick Actions on Matched Results

Within the `TypeAheadInput` component, when in `searching` mode with a selected result:
- `s` → set selected task to `in_progress`
- `p` → set selected task to `paused`
- `c` → set selected task to `completed`
- `t` → touch selected task
- These fire the action and refresh results in-place (task stays in results with updated status)
- Requires careful key handling: these single-char keys must NOT fire when the text input has focus. Solution: use a `useInput` handler that only activates for these keys when the input is not focused (i.e., user has pressed ↓ to navigate into the results list). Alternatively, require a modifier (e.g., Ctrl+S) or only enable quick actions when the user has navigated away from the input.

**Preferred approach:** Track an `inputFocused` boolean. When the user presses ↓ from the input, `inputFocused` becomes false and the cursor moves into results. Keys like `s/p/c/t` work on the selected result. Pressing ↑ back to the top or typing any character returns focus to the input. This gives a clear two-zone interaction: **input zone** (typing filters) and **results zone** (navigation + actions).

#### File Summary

| File | Action | Purpose |
|------|--------|---------|
| `cli/src/app.tsx` | Modify | Add `typeaheadOpen` to AppState |
| `cli/src/hooks/use-typeahead.ts` | Create | State machine hook |
| `cli/src/components/TypeAheadInput.tsx` | Create | Main UI component |
| `cli/src/views/DashboardView.tsx` | Modify | Render type-ahead overlay inline |
| `cli/src/hooks/use-navigation.ts` | Modify | Remap `/`, add typeahead guard |
| `cli/src/components/layout/Footer.tsx` | Modify | Update shortcut hints |

### Resolved Design Decisions

1. **Dashboard tasks dim when type-ahead is active** — Yes. Fade/dim the category groups below to visually separate the overlay from background content.
2. **Quick-action confirmation shows inline** — Yes. Pressing `s` on a matched task briefly flashes "Started" (or similar) next to the task row before refreshing the result in place.
3. **Web command palette adoption** — Not now. Focus on CLI first. Consider porting this pattern to the web client as a follow-up after the CLI implementation is solid.

---

## CLI: First-Time Onboarding & `chaos config`

### Problem
Users must manually create `~/.config/chaos-tracker/.env` with Supabase credentials before the CLI works. This adds friction for sharing with others.

### Solution
The CLI detects missing credentials on first run and walks the user through an interactive setup wizard. A `chaos config` command allows editing credentials later.

### Architecture

**Boot sequence in `index.tsx`:**
```
1. dotenv loads config files (unchanged)
2. Parse argv:
   a. `chaos config`  → render ConfigView, exit
   b. `chaos --mock`  → MockTaskRepository, start app
   c. env vars exist  → SupabaseTaskRepository, start app
   d. no env vars     → render OnboardingView
3. (onboarding path) On complete:
   - writeConfig() saves to disk
   - applyConfigToEnv() sets process.env
   - dynamic import SupabaseTaskRepository
   - start app
```

**Key**: `supabase-task-repository.ts` is only dynamically imported AFTER env vars are confirmed present, avoiding the synchronous throw in `supabase.ts`.

### Files

| File | Purpose |
|------|---------|
| `cli/src/utils/config.ts` | Config read/write/detect utility (pure Node.js, no React/Ink) |
| `cli/src/views/OnboardingView.tsx` | Multi-step wizard: welcome → URL → key → confirm |
| `cli/src/views/ConfigView.tsx` | View/edit screen for `chaos config` |
| `cli/src/index.tsx` | Boot sequence branching |

### Config Utility (`config.ts`)
- `configFileExists()` — checks if `~/.config/chaos-tracker/.env` exists
- `readConfig()` — parses URL and key from file
- `writeConfig(config)` — creates dir + writes file with `chmod 600`
- `applyConfigToEnv(config)` — sets `process.env` vars
- `hasSupabaseEnv()` — checks if both env vars are present
- `maskValue(value)` — shows first 8 + last 4 chars for display

---

## CLI: Productionization

### Goal
Make the CLI installable as a global `chaos` command from the local git repo.

### Changes

#### 1. tsup bundling
Ensure `../../src/core/` imports are bundled into `dist/index.js`. tsup/esbuild bundles local imports by default (only `node_modules` are external), but we verify this works and add explicit config if needed.

#### 2. Environment config resolution
Replace hardcoded `../../.env.local` path with a resolution chain that works from any directory:
1. **Environment variables** already set in shell (highest priority)
2. **`~/.config/chaos-tracker/.env`** — XDG-style persistent config
3. **`.env.local` in cwd** — fallback for running from project directory

#### 3. Install workflow
```bash
cd cli
npm install
npm run build    # tsup → dist/index.js with shebang
npm link         # symlinks `chaos` into global node bin
```

After this, `chaos` works from any directory. `chaos --mock` for offline/testing.

### What we're NOT doing
- **npm workspaces**: tsup bundles everything at build time, no runtime cross-package deps needed
- **npm publish**: Not needed — local git clone install is sufficient
- **Repo restructure**: Current layout works fine with tsup bundling

---

## CLI: Dashboard Enhancements

### Goal
Better completed-task handling, a "Top of Mind" view for recently-touched tasks, and visual polish.

### Features
1. **Dim completed tasks** — Override all colors to Stone-600 dim, hide neglect indicators, sort to bottom within each category
2. **"Completed" collapsible category** — System category at dashboard bottom, collapsed by default (`[+]`/`[-]` indicator), `e` key toggles, excluded from keyboard nav when collapsed
3. **Migrate completed tasks on launch** — On initial load, tasks with `status === 'completed'` and `category !== 'Completed'` are moved to the Completed category. During a session, just-completed tasks stay in their original category (dimmed, at bottom)
4. **Vertical padding** — `marginBottom={1}` on the wide-terminal ASCII header
5. **"Top of Mind" virtual category** — Rendered at the top of the dashboard, shows tasks touched within 7 days that are not completed, sorted by `last_touched` desc. View-only (not in keyboard nav). Ignores filters.
6. **Hide empty categories** — Top of Mind and Completed hide when they have 0 tasks

### Files Modified
- `core/domain/category.ts` — `COMPLETED_CATEGORY_NAME` and `TOP_OF_MIND_CATEGORY_NAME` constants
- `cli/src/theme/colors.ts` — Category colors for Completed and Top of Mind
- `cli/src/app.tsx` — `completedCollapsed` state + migration in `loadTasks()`
- `cli/src/components/layout/AsciiHeader.tsx` — Wide-terminal padding
- `cli/src/components/task/TaskRow.tsx` — Dim completed tasks
- `cli/src/components/layout/Panel.tsx` — `isCollapsed` prop
- `cli/src/components/category/CategoryGroup.tsx` — Pass-through `isCollapsed`
- `cli/src/hooks/use-tasks.ts` — Top of Mind computation, regular category sorting, Completed group, updated `flatTaskIds`
- `cli/src/views/DashboardView.tsx` — Render Top of Mind → regular → Completed
- `cli/src/hooks/use-navigation.ts` — `e` key handler
- `cli/src/components/layout/Footer.tsx` — `e:expand` shortcut hint

---

## Categories → Tags Refactor

### Problem
The original "categories" (Work, Personal, Chores, etc.) describe *what* a task is about, but don't help with day-to-day prioritization. Users need a way to triage tasks by urgency/workflow stage and move them between buckets as deadlines shift.

### Solution
Split the single concept into two:

| Concept | Cardinality | Purpose | Values |
|---------|-------------|---------|--------|
| **Category** | One per task | Workflow bucket — how urgent/what mode | Urgent, Up Next, Admin, Flow |
| **Tags** | Zero or more per task | Topic labels — what area of life | Work, Personal, Chores, Connection, Hobby, Rejuvenate |

### Data Model
```typescript
type Task = {
  // ...existing fields...
  category: string    // workflow category (Urgent, Up Next, Admin, Flow)
  tags: string[]      // topic labels (Work, Personal, etc.)
}
```

### Key Decisions
- Default category for new tasks: **Up Next**
- Dashboard groups by **category** (workflow), tags shown as colored chips on rows
- Completed and Top of Mind remain as special system categories
- Tags are optional — tasks can have zero tags
- `getByCategory()` removed from repository, replaced with `getByTag()`

### Files Changed
- `core/domain/task.ts` — Added `tags: string[]`
- `core/domain/category.ts` — `DEFAULT_CATEGORIES` = 4 workflow categories, `DEFAULT_TAGS` = old categories, `Tag` type
- `core/repositories/task-repository.ts` — `getByTag()` replaces `getByCategory()`
- `cli/src/infrastructure/` — Mock + Supabase repos updated
- `cli/src/infrastructure/seed-data.ts` — Reorganized with new categories + tags
- `cli/src/theme/colors.ts` — New category colors, added `TAG_COLORS` + `tagColor()`
- `cli/src/hooks/use-tasks.ts` — Groups by workflow categories
- `cli/src/components/task/TaskRow.tsx` — Tag chip display
- `cli/src/components/task/TaskDetail.tsx` — Tags display
- `cli/src/views/CommandPaletteView.tsx` — Uses `DEFAULT_CATEGORY_NAME`

---

## Next Phase: Dual-View Experience — In the Flow / Structured World

### Vision

Split the app into two modes that match how people actually work:

1. **"In the Flow"** — The active workday view. Shows what you're touching right now. Optimized for fast context switches. Resets daily.
2. **"Structured World"** — The planning/organizing view. Full category layout, all tasks, big-picture management.

### Key Design Changes

| Change | From | To |
|--------|------|----|
| "Top of Mind" category | 7-day window, always visible | **"In the Flow"** — today only, resets daily |
| Touch semantics | Just updates `last_touched` | Logs a **1-hour minimum flow session** |
| Flow data | Single `last_touched` timestamp | **Touch event log** with timestamps for analytics |

### New Capabilities

1. **Daily reset** — "In the Flow" clears at midnight / first launch of day. Tasks only appear when re-touched.
2. **Flow Insights** — Visualization area showing focus duration, switch frequency, category patterns, daily flow timelines.
3. **Flow Check-In Notifications** — Periodic prompts ("Still working on X?") to build accurate flow data without manual tracking.

### Data Model Changes Needed
- New `touch_events` table: `{ id, task_id, touched_at, category_at_time }`
- Migrate from single `last_touched` field to event-sourced touch history
- Keep `last_touched` on task for backward compat (denormalized from latest event)

### Implementation Order (TBD)
1. Rename "Top of Mind" → "In the Flow" + daily reset logic
2. Touch event logging (new table + touch semantics)
3. Structured World view separation
4. Flow Insights visualization
5. Notification system

See `chaos-tracker-requirements.md` for detailed requirements.

---

## Future Platform Roadmap

### Electron (Mac Desktop)
- Wrap Web client (or any experiment that wins)
- Add native menu bar integration
- Consider local SQLite fallback for offline
- Use `electron-vite` or `electron-builder`

### Mobile (React Native)
- Reuse `core/` business logic entirely
- Rebuild UI with RN components
- Same Supabase backend

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Use ShadCN UI | Themeable, user wants full customization later |
| 2026-01-26 | Architecture separates core from UI | Enables Electron/mobile ports |
| 2026-01-26 | TanStack Query for server state | Better than raw Supabase hooks |
| 2026-01-26 | Zustand for client state | Minimal boilerplate |
| 2026-01-26 | Stone base color for ShadCN | Warmer gray, user preference |
| 2026-01-26 | Skip PWA for initial build | Keep setup simpler, add later if needed |
| 2026-01-26 | Multi-client architecture | Experiment with Web, CLI, Canvas visualizations |
| 2026-01-26 | Web (Kanban) first | Most conventional, establishes baseline before experiments |
| 2026-02-16 | CLI type-ahead rapid entry | Unify search+create into single inline input for zero-friction task capture |
| 2026-02-16 | Reclaim `/` for type-ahead, keep `:` for commands | `/` is natural "search" key; commands are a different intent |
| 2026-02-17 | CLI productionization via npm link | Global `chaos` command from local repo, no npm publish needed |
| 2026-02-17 | XDG config for CLI credentials | `~/.config/chaos-tracker/.env` so CLI works from any directory |
| 2026-02-17 | Interactive onboarding wizard | Detect missing credentials on first run, walk through setup; `chaos config` for editing later |
| 2026-02-17 | Dynamic import for SupabaseTaskRepository | Only import after env vars confirmed present, avoids synchronous throw in supabase.ts |
| 2026-02-20 | CLI dashboard enhancements | Top of Mind view, collapsible Completed category, dim completed tasks, launch migration for better task lifecycle management |
| 2026-03-08 | Dual-view experience | Split into "In the Flow" (active workday, daily reset, 1hr min flow sessions) and "Structured World" (planning/organizing); add flow insights and check-in notifications |
| 2026-03-11 | Categories → Tags refactor | Old categories become tags (topic labels, multi-select); new workflow categories (Urgent, Up Next, Admin, Flow) for day-to-day prioritization |

---

*Last updated: 2026-03-11*
