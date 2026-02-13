# Chaos Tracker - Development Plan

*This plan is automatically updated as we make decisions and change directions.*

---

## Current Status: CLI Prototype Complete, Web Phases 1-2 Done

**Related Documents:**
- `chaos-tracker-requirements.md` - Detailed feature requirements
- `chaos-tracker-explainer.md` - Learning guide for each phase
- `reference-screenshots/` - Visual design references

## Vision

A minimalist task tracking app that shows tasks and categories when needed, but otherwise stays out of the way. **Multiple visualization experiments** will help discover the ideal interface:

| Experiment | Description | Status |
|------------|-------------|--------|
| **Web (Kanban)** | Board-style columns, visual cards | Planned first |
| **CLI** | Terminal-based, keyboard-driven | Future experiment |
| **Canvas** | Mind-map style, nodes & connections | Future experiment |

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

### Experiment 1: Web (Kanban) — CURRENT FOCUS
*Phases 1-5 above*

Standard kanban board with category columns. Best for:
- Visual overview of all tasks
- Drag-and-drop organization
- Users who think spatially

### Experiment 2: CLI (Command Line Interface)
*Prototype complete — `cli/` directory*

Terminal-based task management using Ink 5 (React for terminals):
- **Tech**: Ink 5 + @inkjs/ui + chalk 5 + tsx
- **Reuses**: `core/` domain types directly via relative imports
- **Data**: In-memory mock repository with seed data (no Supabase)
- **Features**: Dashboard (category groups), keyboard navigation (j/k/arrows), status actions (s/p/c/t/d), task create/edit forms, command palette (:), filter view (f), help (?), neglect indicators
- **Run**: `cd cli && npm run dev`

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

### Experiment 3: Canvas (Mind Map)
*Future — after Web MVP*

Freeform canvas with tasks as nodes. Potential approach:
- **Tech**: React + ReactFlow or XYFlow
- **Reuses**: `core/` domain types, `infrastructure/` Supabase client
- **New**: Node components, edge connections, canvas controls

```
                    ┌─────────┐
                    │  WORK   │
                    └────┬────┘
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌────────┐
         │Task A  │ │Task B  │ │Task C  │
         │        │ │        │ └────────┘
         └───┬────┘ └────────┘
             │
             ▼
        ┌─────────┐
        │Subtask  │
        └─────────┘
```

Best for:
- Non-linear thinkers
- Seeing relationships between tasks
- Brainstorming and planning

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

---

*Last updated: 2026-02-12*
