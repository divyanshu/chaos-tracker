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
| `e` | Expand/collapse Completed category | Dashboard |
| `/` | Open type-ahead search/create | Dashboard |
| `:` | Open command palette | Dashboard |
| `f` | Open filter view | Dashboard |
| `?` | Show help | Dashboard |
| `q` | Quit | Dashboard |
| `e` | Edit credentials | Config view |
| `Enter`/`y` | Confirm | Onboarding confirm step |
| `Esc`/`n` | Restart/cancel | Onboarding confirm step |

---

## CLI Dashboard Features

### Top of Mind
- Virtual category rendered at the top of the dashboard
- Shows tasks touched within the last 7 days that are not completed
- Sorted by `last_touched` descending (most recent first)
- View-only — tasks are not navigable here (they remain navigable in their real categories)
- Ignores active category/status filters (always computed from the full task list)
- Hidden when empty

### Completed Tasks
- Completed tasks are visually dimmed (Stone-600 color) with neglect indicators hidden
- Within regular categories, completed tasks sort to the bottom
- On app launch, tasks with `status === 'completed'` are migrated to a dedicated "Completed" system category
- During a session, just-completed tasks stay in their original category (dimmed, at bottom); they migrate on next launch

### Completed Category
- System category rendered at the bottom of the dashboard, below all regular categories
- Collapsed by default — shows header with `[+]` indicator and task count only
- `e` key toggles expand/collapse
- When expanded: shows `[-]` in header, tasks are included in keyboard navigation
- When collapsed: tasks are excluded from keyboard navigation
- Hidden when empty (no completed tasks)

### Empty Category Handling
- Categories with 0 tasks are hidden from the dashboard (including Top of Mind and Completed)

---

## Dual-View Experience: In the Flow / Structured World

### Concept

The app experience is split into two views reflecting two modes of working:

1. **"In the Flow"** — for when you're actively working and context-switching throughout the day
2. **"Structured World"** — for when you're planning, organizing, and reviewing

### "In the Flow" View

**Replaces "Top of Mind".** This is the default view when the app opens during a workday.

#### Touch Semantics
- Touching a task means "I worked on this" — assume a **minimum 1-hour flow session** per touch
- Multiple touches on the same task in a day extend the flow time (each touch = +1 hour minimum)
- Touch timestamp is recorded for flow analytics

#### Daily Reset
- At the start of each new day (midnight or first app launch of the day), clear all tasks from "In the Flow"
- Tasks only reappear if touched again that day
- This reflects reality: yesterday's flow doesn't carry over unless you actively resume

#### Display
- Shows only tasks touched today, sorted by most recent touch
- Compact layout optimized for quick scanning and fast touch actions
- Categories are visible but secondary — the focus is on recency, not organization

### "Structured World" View

- Full category/task layout for planning and review
- All categories and tasks visible, organized by category
- This is where you go to create tasks, reorganize, edit details, and review the big picture
- Completed category, filters, and all existing dashboard features live here

### Flow Insights Visualization

A dedicated area (accessible from either view) for reviewing task-working patterns.

#### Metrics
- **Flow duration**: How long do I typically stay focused on a single task? (based on touch intervals)
- **Switch frequency**: How often do I context-switch in a day? (number of distinct task touches per day)
- **Category patterns**: Which categories do I switch between most? Do I tend to hop between Work and Personal, or stay within one category?
- **Daily flow map**: Timeline visualization of which tasks were touched and when throughout the day
- **Streak tracking**: Consecutive days of touching a recurring task

#### Data Requirements
- Need to persist touch events with timestamps (not just `last_touched`)
- Each touch event: `{ task_id, touched_at, category_at_time }`
- Historical data for trend analysis (weekly/monthly views)

### Flow Check-In Notifications

Periodic check-ins that help build accurate flow data without constant manual tracking.

#### Behavior
- After a configurable interval (e.g., 30-60 minutes) since last touch, prompt: "Still working on [task name]?"
- If yes: extend the flow session (auto-touch)
- If no: ask what you switched to (optional — can dismiss)
- If no response: assume flow ended at the last touch

#### Implementation Considerations
- CLI: Could use system notifications (node-notifier) or terminal bell
- Canvas/Web: Browser notifications or in-app toast
- Must be non-intrusive — a missed notification should not break anything
- Configurable: enable/disable, interval, quiet hours

---

*Last updated: 2026-03-08*
