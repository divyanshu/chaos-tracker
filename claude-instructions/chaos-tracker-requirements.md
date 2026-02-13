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

*Last updated: 2026-01-26*
