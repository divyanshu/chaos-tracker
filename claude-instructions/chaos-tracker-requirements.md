# Chaos Tracker Requirements

*Detailed requirements for the **Web (Kanban)** client — our first visualization experiment.*

*See also:*
- *`chaos-tracker-plan.md` — Implementation phases and other experiments (CLI, Canvas)*
- *`chaos-tracker-explainer.md` — Learning context for each concept*

---

## LandscapeView (Main Dashboard)

**Reference:** See `reference-screenshots/task-dashboard-example-notion.png`

### Layout
- Kanban-style board with categories as columns
- Each category column has:
  - Colored header (unique color per category)
  - Task count badge
  - Stack of task cards
  - "+ New task" input at bottom
- Horizontal scrolling if columns overflow viewport
- Minimalist, dark-mode-first design

### Task Cards
- Display task title
- Status badge (Not Started, In Progress, Paused, Completed)
- Visual indicator for "neglected" tasks (not touched recently)
- Hover state reveals quick actions

---

## Task Filtering

- Filter by category (show/hide specific columns)
- Filter by status (e.g., hide completed tasks)
- Filters persist in URL or local storage

---

## Quick Status Actions

Actions available on task cards:
- **Start**: Move from pending → in_progress
- **Pause**: Move from in_progress → paused
- **Resume**: Move from paused → in_progress
- **Complete**: Move to completed status
- **Touch**: Update `last_touched` without changing status

---

## Touch Functionality

- "Touching" a task updates its `last_touched` timestamp
- Purpose: Acknowledge a task exists without starting/completing it
- Use case: Recurring tasks, tasks you're aware of but not acting on
- Visual feedback: Brief animation or highlight on touch

---

## Task CRUD Operations

| Operation | Trigger |
|-----------|---------|
| Create | "+ New task" input at column bottom, or keyboard shortcut |
| Read | Tasks load on page load, grouped by category |
| Update | Click task to open detail view/modal, edit fields |
| Delete | Delete button in task detail view (with confirmation) |

---

## Rejuvenation Logging

- Separate view/route (`/rejuvenate`)
- Log rejuvenation activities (rest, recharge)
- Track rejuvenation history
- (Details TBD based on database schema)

---

## Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Create new task | When in task input field |
| `Space` | Toggle task status | When task is focused |
| `Tab` | Move focus to next task | Global |
| `Shift+Tab` | Move focus to previous task | Global |
| `t` | Touch focused task | When task is focused |

### Focus Management
- Tasks are focusable (tabindex)
- Visual focus indicator (outline/ring)
- Focus follows logical order (left-to-right, top-to-bottom)

---

## Visual Design Notes

From the reference screenshot:
- Dark background (#1a1a1a or similar)
- Category colors: soft, muted tones (not neon)
- Status badges: pill-shaped, subtle colors
- Cards: rounded corners, subtle shadow/border
- Typography: clean, readable, good contrast

---

## CLI Requirements

### First-Run Onboarding

When the CLI launches with no Supabase credentials configured:
1. Show welcome message with project name
2. Display config file path (`~/.config/chaos-tracker/.env`)
3. Prompt for Supabase URL (with placeholder hint)
4. Prompt for Supabase Anon Key (with placeholder hint)
5. Show confirmation step with URL in full and key masked (first 8 + last 4 chars)
6. On confirm: save to disk (`chmod 600`), apply to env, launch main app
7. On reject: restart from URL step
8. Show tip: "Run with --mock to try without Supabase"

### `chaos config` Command

View and edit stored credentials:
1. Show current Supabase URL (or "(not set)")
2. Show current Anon Key masked (or "(not set)")
3. `e` to enter edit mode (URL → Key → save)
4. `q`/`Esc` to exit
5. After save: show "Saved successfully." flash, auto-exit after 1s

### CLI Boot Sequence

Priority order:
1. `chaos config` — render config view, exit
2. `chaos --mock` — use MockTaskRepository, skip credential checks
3. Env vars present — use SupabaseTaskRepository, launch app
4. No env vars — render onboarding wizard

### CLI Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `j`/`k` or `↑`/`↓` | Navigate tasks | Dashboard |
| `n` | New task | Dashboard |
| `s` | Start task | Dashboard (selected task) |
| `p` | Pause task | Dashboard (selected task) |
| `c` | Complete task | Dashboard (selected task) |
| `t` | Touch task | Dashboard (selected task) |
| `d` | Delete task | Dashboard (selected task) |
| `/` | Open type-ahead search/create | Dashboard |
| `:` | Open command palette | Dashboard |
| `f` | Open filter view | Dashboard |
| `?` | Show help | Dashboard |
| `q` | Quit | Dashboard |
| `e` | Edit credentials | Config view |
| `Enter`/`y` | Confirm | Onboarding confirm step |
| `Esc`/`n` | Restart/cancel | Onboarding confirm step |

---

*Last updated: 2026-02-17*
