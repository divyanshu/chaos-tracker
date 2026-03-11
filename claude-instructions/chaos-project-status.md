# Chaos Tracker - Project Status

*This file is kept up to date by Claude Code across sessions. It tracks what's done, what's in progress, and what's next.*

---

## Overall Progress

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project Setup & Foundation | Done |
| Phase 2 | Core UI Components | Done |
| Phase 3 | Supabase Integration (hooks, stores, routing) | Done |
| Phase 4 | Main Features (kanban, CRUD, rejuvenation) | Done |
| Phase 5 | Retro 90s Restyle + Stacked Layout Toggle | Done |
| Phase 6 | Keyboard-First Command Palette | Done |
| CLI Prototype | Terminal UI with Ink 5 | Done |
| CLI: Type-Ahead Rapid Entry | Inline search+create input | Done |
| CLI: Productionization | Global install via `chaos` command | Done |
| CLI: Onboarding & Config | First-run wizard + `chaos config` | Done |
| Repo Restructure | CLI primary, web → experiments/ | Done |
| CLI: Dashboard Enhancements | Completed category, Top of Mind, dim completed | Done |
| Canvas Experiment | Infinite canvas with React Flow, keyboard-driven | Done |
| Categories → Tags Refactor | Workflow categories + topic tags | In Progress |

---

## What's Been Built

### Web Client (Phases 1-4)
- Vite + React 18 + TypeScript scaffolding
- Tailwind CSS + ShadCN UI (Stone theme, dark mode support)
- `@/*` path alias configured
- Domain types: `Task`, `TaskStatus`, `Category`
- Repository pattern: `TaskRepository` interface
- Supabase implementation: `SupabaseTaskRepository`
- ShadCN components: Button, Card, Badge, Input, Dialog, Dropdown Menu, Tooltip, Separator, Textarea, Select, Label, Command
- TanStack Query v5 hooks with optimistic updates (`useTasks`, `useTask`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`, `useTouchTask`)
- Query key factory for cache invalidation (`src/hooks/query-keys.ts`)
- Zustand store for UI state: theme toggle, filters, selected task (`src/stores/ui-store.ts`)
- React Router v6 with lazy-loaded routes (`/`, `/tasks/:id`, `/rejuvenate`)
- App shell with `<Outlet />` layout + `TooltipProvider`
- `QueryClientProvider` wrapper with sensible defaults (60s stale, 5min gc, retry 1)
- Theme init script in `index.html` to prevent flash of unstyled content

#### Phase 4 Features
- **LandscapeView** — Full kanban board with category columns (horizontally scrolling)
  - `CategoryColumn` — colored header, task list, quick-create input
  - `TaskCard` — status badge, neglect indicator (amber warning / red critical), hover quick-action buttons with tooltips
  - `FilterBar` — category chips, status chips, clear filters, theme toggle, rejuvenation link
- **TaskDetailView** — View mode (title, status, category, description, metadata, neglect indicator) + Edit mode (form with title, description, category, status selects) + Delete confirmation dialog
- **RejuvenationView** — Filtered Rejuvenate task list with quick-add, status actions, touch, relative timestamps
- **Keyboard shortcuts** (`src/hooks/use-keyboard-shortcuts.ts`) — Space toggles status, `t` touches task, Enter selects task (on focused card); Tab/Shift+Tab for navigation
- **Shared utilities**:
  - `src/lib/neglect.ts` — `daysSince`, `neglectLevel`, `relativeTime`
  - `src/lib/task-status.ts` — `STATUS_DISPLAY`, `availableActions`, `nextStatus`, `toggleStatus`, `ACTION_LABELS`

### CLI Prototype (`cli/`)
- Ink 5 + @inkjs/ui + chalk 5
- Dashboard view with category groups
- Keyboard navigation (j/k/arrows)
- Status actions (s/p/c/t/d)
- Task create/edit forms
- Command palette (:), filter view (f), help (?)
- Neglect indicators
- In-memory mock data (no Supabase connection)

#### CLI Production Features
- Supabase integration built (not just mock data) — loads `.env.local` from project root
- `--mock` flag for in-memory testing mode
- tsup build with shebang for global `chaos` command
- **First-run onboarding wizard** — detects missing credentials, walks user through interactive setup
  - `OnboardingView` — multi-step wizard (welcome → URL → key → confirm)
  - `ConfigView` — view/edit credentials via `chaos config`
  - `cli/src/utils/config.ts` — config file read/write/detect utility
  - Saves credentials to `~/.config/chaos-tracker/.env` with `chmod 600`
  - Boot sequence branches: `chaos config` | `--mock` | env vars present | onboarding

#### Phase 6 Features
- **Command Palette** (`src/features/command-palette/`) — Keyboard-first entry point (Cmd+K / Ctrl+K / `/`)
  - `CommandPalette.tsx` — Dialog wrapper, state machine orchestrator
  - `PaletteSearch.tsx` — Fuzzy search tasks, highlighted matches, category chips, neglect dots
  - `PaletteActions.tsx` — Status actions + universal actions (touch/edit/delete/open) with single-key shortcuts
  - `PaletteCreate.tsx` — Inline task creation with title + category chips
  - `use-command-palette.ts` — `useReducer` state machine (idle → search → action/create)
- **Core services** (`src/core/services/`) — Platform-agnostic logic for CLI reuse
  - `fuzzy-search.ts` — Fuzzy search with scoring, subsequence matching, highlight extraction
  - `palette-actions.ts` — Action resolution based on task status
- Existing keyboard shortcuts suppressed while palette is open (via `paletteOpen` flag in Zustand store)

### Shared Core (`core/` — top-level)
- Platform-agnostic domain types
- Repository interfaces
- Services (fuzzy search, palette actions)
- Used by CLI via `#core` alias; available to future clients

### Infrastructure (`experiments/web/src/infrastructure/`)
- Supabase client initialization
- `SupabaseTaskRepository` implementing `TaskRepository`
- Lives inside web experiment (CLI has its own Supabase integration)

### Repo Restructure (Done)
- Promoted `src/core/` → top-level `core/` as shared domain layer
- Moved web client (React/Vite/ShadCN) → `experiments/web/`
- CLI is now the primary interface; web is archived for future revival
- Root `package.json` is minimal (project identity only)
- Updated CLI `#core` alias to point to `../core` instead of `../src/core`

---

## What's Next

### Phase 6: Keyboard-First Command Palette (Done)
- [x] ShadCN Command component (cmdk) installed
- [x] Fuzzy search service with scoring, subsequence matching, highlight extraction
- [x] Palette action resolution service (status-dependent + universal actions)
- [x] State machine hook (idle → search → action/create) via useReducer
- [x] Command palette dialog with Cmd+K / Ctrl+K / `/` triggers
- [x] Search state: fuzzy-matched results with bold highlights, category chips, neglect dots
- [x] Action state: status actions + touch/edit/delete/open with single-key shortcuts, delete confirmation
- [x] Create state: inline title + category chip selector
- [x] Esc chain: action → search → idle
- [x] Existing keyboard shortcuts suppressed while palette is open
- [x] Focus restoration on close

### CLI: Type-Ahead Rapid Entry (Done)
- [x] Add `typeaheadOpen` sub-mode to AppState
- [x] Create `use-typeahead.ts` state machine hook (searching → creating → confirmed)
- [x] Create `TypeAheadInput.tsx` component (inline overlay with bordered panel)
- [x] Integrate into DashboardView (renders between header and category groups, dims categories)
- [x] Fuzzy search with highlighted matches using existing `core/services/fuzzy-search.ts`
- [x] Result navigation (↑/↓) with two-zone keyboard (input zone vs results zone)
- [x] Quick status actions (s/p/c/t) on selected result in results zone
- [x] Tab → create mode: typed text becomes title, horizontal category chip selector (←/→)
- [x] Enter creates task, auto-dismiss confirmation flash (~1s)
- [x] Remap `/` to type-ahead activation, keep `:` for command palette
- [x] Update Footer shortcut hints (added `/:find`)

### CLI: Onboarding & Config (Done)
- [x] Config utility (`cli/src/utils/config.ts`): read/write/detect/mask/applyToEnv
- [x] OnboardingView: multi-step wizard (welcome → URL → key → confirm → launch app)
- [x] ConfigView: view current values (masked key), edit flow, auto-exit after save
- [x] Boot sequence branching in index.tsx: config | mock | env present | onboarding
- [x] Dynamic import of SupabaseTaskRepository only after env vars confirmed

### CLI: Productionization (Done)
- [x] Ensure tsup bundles shared `core/` imports into standalone dist
- [x] Fix env loading: env vars → `~/.config/chaos-tracker/.env` → cwd `.env.local`
- [x] Build + `npm link` for global `chaos` command
- [x] Verify `chaos` and `chaos --mock` work from any directory

### CLI: Dashboard Enhancements (Done)
- [x] Dim completed tasks (Stone-600 color) + hide neglect indicators for completed
- [x] Sort completed tasks to bottom within each category
- [x] "Completed" collapsible category at bottom of dashboard (collapsed by default, `e` to toggle)
- [x] Migrate completed tasks to Completed category on app launch
- [x] Vertical padding between ASCII header and dashboard body
- [x] "Top of Mind" virtual category at top — tasks touched within 7 days, sorted by recency
- [x] Hide empty categories (Top of Mind and Completed hide when 0 tasks)
- [x] `e` keyboard shortcut + footer hint

### Canvas Experiment (`experiments/canvas/`) — Done
- Vite + React 18 + TypeScript + Tailwind + ShadCN (Stone theme, dark mode)
- React Flow v12 (XYFlow) infinite canvas with pan/zoom, dot-grid, minimap, controls
- Custom `TaskNode` component: status dot, title, category chip, relative time, neglect indicators, GSAP animations (appear, selection ring)
- Custom `CategoryGroup` node: dashed bounding box, category label + count badge, GSAP fade-in
- Auto-layout algorithm: groups tasks by category in a grid, snap-to-grid (20px)
- Position persistence via localStorage (`position-store.ts`)
- Supabase integration with mock data fallback (no env vars = mock mode)
- TanStack Query v5 hooks with optimistic updates (port from web experiment)
- Full keyboard navigation: arrow/vim keys, Tab cycling, s/p/c/t/d/e action keys
- Quick Entry panel (`/` or `n`): fuzzy search + create flow with category picker
- Command Palette (`:` or Cmd+K): task search, status actions, navigation commands
- Task Detail slide-over panel: view/edit/delete with inline form
- Help overlay (`?`): keyboard shortcut reference
- Sidebar (split layout mode, `l` toggle): task list grouped by category, Top of Mind, Completed
- Two layout modes: full canvas (Mode A) and canvas + sidebar (Mode B)
- Plus Jakarta Sans typography
- GSAP v3 animations: node appear/disappear, panel slide-in, selection ring, result stagger
- Sonner toast notifications for all CRUD actions
- Loading skeleton state
- Double-click canvas background to create task
- `#core` alias for shared domain layer imports

### Categories → Tags Refactor (In Progress)

**What changed:**
- Old "categories" (Work, Personal, Chores, Connection, Hobby, Rejuvenate) are now **tags** — topic labels that can be assigned multiple per task
- New **workflow categories** are the primary task grouping: **Urgent**, **Up Next**, **Admin**, **Flow**
- Tasks have one category (workflow bucket) and zero or more tags (topic labels)
- Default category for new tasks: "Up Next"

**Done:**
- [x] Domain types: `Task.tags: string[]` field, `DEFAULT_CATEGORIES` → 4 workflow categories, `DEFAULT_TAGS` for old categories
- [x] Repository interface: `getByCategory()` → `getByTag()`
- [x] Mock + Supabase repository implementations updated
- [x] Seed data reorganized with new categories + tags
- [x] Theme: new `CATEGORY_COLORS` (red/amber/stone/purple), `TAG_COLORS` + `tagColor()` export
- [x] `use-tasks.ts` groups by workflow categories
- [x] `TaskRow` shows tag chips on each row
- [x] `TaskDetail` shows category + tags
- [x] `TypeAheadInput`, `TaskForm`, `FilterView` work with new categories automatically
- [x] `CommandPaletteView` uses `DEFAULT_CATEGORY_NAME`
- [x] Error handling added to `app.tsx` `loadTasks()` for graceful Supabase failures

**Remaining:**
- [ ] Tag selection UI during task creation (currently creates with empty tags)
- [ ] Tag editing on existing tasks
- [ ] Supabase migration (add `tags text[]` column, migrate existing data)
- [ ] Update `experiments/canvas/` for new model
- [ ] Filter view: add tag filtering alongside category filtering

### Next: Dual-View Experience — In the Flow / Structured World

**Status: Planning**

The CLI dashboard will be split into two conceptual views:

#### "In the Flow" View
- Replaces "Top of Mind" — renamed to "In the Flow"
- Shows tasks I'm actively context-switching between during the day
- Touching a task logs a minimum 1-hour flow session
- Resets daily — tasks are removed from "In the Flow" at the start of each day unless re-touched
- Optimized for quick touches and fast context switches

#### "Structured World" View
- The full category/task layout for planning and review
- All categories and tasks visible, organized by category
- Where you go to organize, create, and manage tasks

#### Flow Insights Visualization
- A dedicated area to review task-working patterns
- Metrics: average flow duration, task switching frequency, category switching patterns
- Historical view of daily flow sessions
- Answers: How long do I stay focused? Which tasks do I switch between? How often do I switch?

#### Flow Check-In Notifications
- Periodic check-ins during the day (e.g., "Still working on X?")
- Detects if the user is still in flow or has context-switched
- Helps build accurate flow data without manual tracking

---

## Known Issues / Gaps
- No test framework configured
- Canvas experiment not yet updated for categories→tags refactor

---

*Last updated: 2026-03-11*
