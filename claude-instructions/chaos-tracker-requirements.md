# Chaos Tracker Requirements

*Requirements for the CLI interface — the primary (and only active) client.*

---

## Task Organization Model

Tasks have two axes of organization:

### Categories (Workflow Buckets)
A task has exactly **one** category, representing its urgency/workflow stage:

| Category | Color | Purpose |
|----------|-------|---------|
| **Urgent** | Red | Deadline-driven, needs immediate attention |
| **Up Next** | Amber | Queued for action soon (default for new tasks) |
| **Admin** | Stone | Routine/maintenance tasks |
| **Flow** | Purple | Deep work, creative, no hard deadline |

Users move tasks between categories as priorities shift.

### Tags (Topic Labels)
A task has **zero or more** tags describing its life area:

| Tag | Color |
|-----|-------|
| Work | Stone blue |
| Personal | Sage green |
| Chores | Tan |
| Connection | Mauve |
| Hobby | Lavender |
| Rejuvenate | Teal |

Tags are optional — used for filtering and visual context, not primary grouping.

### Special System Category
- **Completed** — Tasks with `status === 'completed'` migrate here on app launch. Rendered at bottom, collapsible.

---

## CLI Dashboard

### Layout
- Header (ASCII art)
- Workflow category groups: Urgent → Up Next → Admin → Flow
- Completed category at the bottom (collapsible, hidden when empty)
- Footer with keyboard shortcut hints
- Type-ahead panel renders inline between header and categories when active

### Task Rows
Each row shows:
- Selection indicator (`▸`) when focused
- Status badge (●/○/◐)
- Task title
- Tag chips (colored, right-aligned)
- Status label
- Relative time since creation
- Neglect indicator (`!` at 7 days, `!!` at 14 days)

### Completed Tasks
- Dimmed (Stone-600 color) in regular category views
- Neglect indicators hidden for completed tasks
- Sort to bottom within each category during a session
- Migrated to Completed system category on next app launch
- Completed category collapses by default; `e` toggles

---

## Task CRUD

| Operation | How |
|-----------|-----|
| Create | `n` → TaskForm (title → category → description → tags → confirm), or `/` type-ahead |
| Read | Loaded on launch from Supabase or mock data |
| Update | Enter on selected task → detail view → `e` → TaskForm pre-filled |
| Delete | `d` on selected task (dashboard), or `d` in detail view |

---

## Quick Status Actions

| Key | Action |
|-----|--------|
| `s` | Start (→ in_progress) |
| `p` | Pause (→ paused) |
| `c` | Complete (→ completed) |

Available in: dashboard (on selected task), type-ahead results zone, task detail view.

---

## Type-Ahead Rapid Entry (`/`)

Single inline input unifying search and create.

**Searching mode:**
- Fuzzy search against all task titles (live as you type)
- Results show: status badge, highlighted title, category (colored), relative time, neglect indicator
- `↑`/`↓` navigates between input zone and results zone
- `s`/`p`/`c` performs quick status action on selected result (in results zone)
- `Enter` opens selected task detail
- `Tab` transitions to creating mode with current text as title
- `Esc` dismisses

**Creating mode:**
- `←`/`→` cycles workflow category
- `↓`/`Tab` moves focus to tags row; `↑` goes back
- In tags row: `←`/`→` cycles tag focus, `Space` toggles tag
- `Enter` creates task and shows 1s confirmation flash
- `Esc` goes back to searching

---

## Filter View (`f`)

Three filter sections:
1. **Categories** — multi-select from Urgent, Up Next, Admin, Flow
2. **Statuses** — multi-select from Pending, In Progress, Paused, Completed
3. **Tags** — multi-select from all default tags

Navigation: `j`/`k`, `Space` toggles, `Enter`/`Esc` applies and goes back, `r` resets all.

Filters are combined with AND logic (category AND status AND any matching tag).

---

## Command Palette (`:`)

Text command input with autocomplete list. Commands:
- `add <title>` / `new` / `create` — create task (with title inline or open form)
- `start` / `s` — start selected task
- `pause` / `p` — pause selected task
- `complete` / `done` / `c` — complete selected task
- `delete` / `rm` / `del` — delete selected task
- `filter` / `f` — open filter view
- `help` / `?` / `h` — show keyboard shortcuts
- `quit` / `exit` / `q` — exit

---

## CLI Keyboard Shortcuts

### Dashboard
| Key | Action |
|-----|--------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `Enter` | Open task detail |
| `n` | Create new task |
| `s` | Start selected task |
| `p` | Pause selected task |
| `c` | Complete selected task |
| `d` | Delete selected task |
| `e` | Expand/collapse Completed category |
| `/` | Open type-ahead search/create |
| `:` | Open command palette |
| `f` | Open filter view |
| `?` | Show help |
| `q` | Quit |

### Task Detail View
| Key | Action |
|-----|--------|
| `e` | Edit task |
| `s` / `p` / `c` | Status actions |
| `d` | Delete task |
| `Esc` | Back to dashboard |

### Config View
| Key | Action |
|-----|--------|
| `e` | Edit credentials |
| `q` / `Esc` | Exit |

---

## First-Run Onboarding

On launch with no credentials:
1. Welcome message + config file path (`~/.config/chaos-tracker/.env`)
2. Prompt for Supabase Project URL
3. Prompt for Supabase Anon Key
4. Confirmation step (URL in full, key masked to first 8 + last 4 chars)
5. On confirm: save to disk (chmod 600), apply to env, launch app
6. On reject: restart from URL step
7. Tip: "Run with --mock to try without Supabase"

---

## `chaos config` Command

View and edit stored credentials:
1. Show current URL (or "(not set)") and masked key (or "(not set)")
2. `e` → edit mode: URL → Key → save → "Saved." flash → auto-exit after 1s
3. `q`/`Esc` → exit

---

## Supabase Schema

```sql
create table public.tasks (
  id text primary key default (gen_random_uuid())::text,
  title text,
  category text,
  tags text[] not null default '{}',
  status text default 'pending',
  description text,
  last_touched timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

RLS: open access via anon key (personal/dev use).

---

*Last updated: 2026-03-13*
