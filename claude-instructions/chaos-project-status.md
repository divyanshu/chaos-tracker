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
| Phase 5 | Polish & Theming | Not Started |
| CLI Prototype | Terminal UI with Ink 5 | Done |

---

## What's Been Built

### Web Client (Phases 1-4)
- Vite + React 18 + TypeScript scaffolding
- Tailwind CSS + ShadCN UI (Stone theme, dark mode support)
- `@/*` path alias configured
- Domain types: `Task`, `TaskStatus`, `Category`
- Repository pattern: `TaskRepository` interface
- Supabase implementation: `SupabaseTaskRepository`
- ShadCN components: Button, Card, Badge, Input, Dialog, Dropdown Menu, Tooltip, Separator, Textarea, Select, Label
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

### Shared Core (`src/core/`)
- Platform-agnostic domain types
- Repository interfaces
- Used by both web and CLI clients

### Infrastructure (`src/infrastructure/`)
- Supabase client initialization
- `SupabaseTaskRepository` implementing `TaskRepository`

---

## What's Next

### Phase 5: Polish & Theming
- [ ] Drag-and-drop for task cards between columns
- [ ] URL-synced filters (persist filter state in query params)
- [ ] Toast notifications for actions (create, update, delete, touch)
- [ ] Loading/error states with skeletons
- [ ] Responsive design (mobile layout)
- [ ] Accessibility audit (ARIA labels, screen reader support)
- [ ] Refined visual design and animations

---

## Known Issues / Gaps
- No test framework configured
- No git repository initialized
- CLI uses mock data, not connected to Supabase

---

*Last updated: 2026-02-13*
