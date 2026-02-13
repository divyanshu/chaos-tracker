# Chaos Tracker - Project Status

*This file is kept up to date by Claude Code across sessions. It tracks what's done, what's in progress, and what's next.*

---

## Overall Progress

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project Setup & Foundation | Done |
| Phase 2 | Core UI Components | Done |
| Phase 3 | Supabase Integration (hooks, stores, routing) | Not Started |
| Phase 4 | Main Features (kanban, CRUD, rejuvenation) | Not Started |
| Phase 5 | Polish & Theming | Not Started |
| CLI Prototype | Terminal UI with Ink 5 | Done |

---

## What's Been Built

### Web Client (Phases 1-2)
- Vite + React 18 + TypeScript scaffolding
- Tailwind CSS + ShadCN UI (Stone theme, dark mode support)
- `@/*` path alias configured
- Domain types: `Task`, `TaskStatus`, `Category`
- Repository pattern: `TaskRepository` interface
- Supabase implementation: `SupabaseTaskRepository`
- ShadCN components: Button, Card, Badge, Input
- `App.tsx` has a minimal test UI (not the real app yet)

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

### Phase 3: Supabase Integration (Web)
- [ ] TanStack Query hooks wrapping `TaskRepository`
- [ ] Zustand stores for UI state (selected task, filters, theme)
- [ ] React Router v6 setup (routes: `/`, `/tasks/:id`, `/rejuvenate`)
- [ ] Real data flowing from Supabase to React UI

### Phase 4: Main Features (Web)
- [ ] LandscapeView — kanban board with category columns
- [ ] Task cards with status badges and neglect indicators
- [ ] Quick status actions (Start, Pause, Resume, Complete, Touch)
- [ ] Task CRUD (create, edit, delete with confirmation)
- [ ] Task filtering by category/status
- [ ] Rejuvenation logging view
- [ ] Keyboard shortcuts (Enter, Space, Tab, Shift+Tab, t)

---

## Known Issues / Gaps
- No test framework configured
- No git repository initialized
- `App.tsx` is placeholder, not wired to real app shell
- CLI uses mock data, not connected to Supabase

---

*Last updated: 2026-02-13*
