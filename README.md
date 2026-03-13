# Chaos Tracker

A minimalist, keyboard-first task tracker for the terminal. Built with Ink 5 (React for CLIs) and backed by Supabase (PostgreSQL).

Tasks are organized by **workflow category** (Urgent, Up Next, Admin, Flow) and optional **tags** (Work, Personal, Chores, etc.). The philosophy: show what matters, stay out of the way.

## Features

- **Terminal-native dashboard** — tasks grouped by workflow category, navigated entirely by keyboard
- **Type-ahead quick entry** (`/`) — fuzzy search existing tasks or create new ones inline
- **Tags** — assign topic labels to tasks; filter by tag in the filter view
- **Command palette** (`:`) — text-based quick actions
- **Filter view** (`f`) — filter by category, status, or tag
- **Collapsible Completed category** — completed tasks stay out of the way until needed
- **First-run onboarding** — interactive wizard walks you through Supabase setup
- **Mock mode** (`--mock`) — try it out with in-memory data, no database needed

```
┌─────────────────────────────────────────────────────────┐
│ chaos-tracker                                    [?] help│
├─────────────────────────────────────────────────────────┤
│ Urgent (2)                                              │
│ ▸ ● Review quarterly OKRs            Work   in progress │
│   ○ Fix production bug               Work      pending  │
│                                                         │
│ Up Next (3)                                             │
│   ○ Grocery shopping                Chores    pending   │
│   ○ Read design feedback             Work     pending   │
│   ◐ Plan weekend trip             Personal    paused    │
│                                                         │
│ Flow (1)                                                │
│   ○ Write blog post                  Work     pending   │
├─────────────────────────────────────────────────────────┤
│ j/k:nav  n:new  s:start  p:pause  c:done  d:del  /:find │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Node.js 18+

### 1. Clone and install

```bash
git clone <repo-url>
cd chaos-tracker/cli
npm install
```

### 2. Build and link

```bash
npm run build     # Build with tsup
npm link          # Install globally as `chaos`
```

### 3. Try it out

```bash
chaos --mock      # Launch with in-memory mock data (no Supabase needed)
```

When you're ready to persist tasks, follow the Supabase setup below.

---

## Supabase Setup

### 1. Create a project

Sign up at [supabase.com](https://supabase.com), create a new project.

### 2. Run the schema

In the Supabase SQL Editor:

```sql
create table if not exists public.tasks (
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

alter table public.tasks enable row level security;
create policy "Allow all access" on public.tasks for all to anon using (true) with check (true);
```

### 3. Connect

```bash
chaos
```

On first run the CLI launches an interactive setup wizard asking for your Supabase Project URL and anon key (both found in Settings → API). Credentials are saved to `~/.config/chaos-tracker/.env`.

```bash
chaos config      # View or edit credentials later
```

---

## Usage

```bash
chaos             # Launch (onboarding wizard on first run)
chaos config      # View or edit stored Supabase credentials
chaos --mock      # Run with in-memory mock data
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `k` or arrows | Navigate tasks |
| `n` | New task |
| `s` / `p` / `c` | Start / pause / complete |
| `d` | Delete task |
| `e` | Expand/collapse Completed |
| `/` | Type-ahead search + create |
| `:` | Command palette |
| `f` | Filter view |
| `?` | Help |
| `q` | Quit |

---

## Development

```bash
cd cli
npm run dev       # Run with tsx (no rebuild needed)
npm run build     # Build with tsup
```

### Architecture

```
chaos-tracker/
├── core/                  Shared domain layer (no UI dependencies)
│   ├── domain/            Task, TaskStatus, Category, Tag types
│   ├── repositories/      TaskRepository interface
│   └── services/          Fuzzy search, palette actions
└── cli/                   The app (Ink 5 + Supabase)
    ├── src/views/         Dashboard, detail, filter, help, command palette
    ├── src/hooks/         Navigation, type-ahead state, task grouping
    ├── src/components/    Category groups, task rows, type-ahead input
    ├── src/infrastructure/ Supabase + mock repositories
    └── src/utils/         Config file management, time formatting
```

The CLI imports `core/` via a `#core` path alias, bundled by tsup at build time.

**Stack:** Node.js · TypeScript · Ink 5 · @inkjs/ui · chalk 5 · tsup · Supabase

---

## License

MIT
