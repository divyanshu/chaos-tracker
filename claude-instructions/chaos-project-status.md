# Chaos Tracker - Project Status

*Kept up to date by Claude Code. Tracks what's done and what's next.*

---

## Overall Progress

| Phase | Description | Status |
|-------|-------------|--------|
| CLI Foundation | Ink 5 prototype, keyboard nav, mock data | Done |
| CLI Production | Supabase integration, global `chaos` command | Done |
| CLI Onboarding | First-run wizard + `chaos config` | Done |
| CLI Dashboard Enhancements | Collapsible Completed category, dim completed tasks | Done |
| CLI Type-Ahead | Inline search+create with `/` | Done |
| CLI Command Palette | Text commands via `:` | Done |
| Categories → Tags Refactor | Workflow categories + topic tags, Supabase migration | Done |
| Tags in task creation/editing | Multi-select in TaskForm + TypeAheadInput | Done |
| Tags in filter view | Filter by tag in FilterView | Done |
| Cleanup | Remove web experiment, touch feature, Top of Mind | Done |

---

## What's Built

### CLI (`cli/`)
- Ink 5 + @inkjs/ui + chalk 5
- Dashboard: 4 workflow category groups (Urgent, Up Next, Admin, Flow)
- Collapsible Completed category at bottom (migrated on launch, `e` to toggle)
- Keyboard navigation (j/k/arrows), status actions (s/p/c/d)
- Neglect indicators (`!` / `!!`) on task rows based on `last_touched`
- Type-ahead rapid entry (`/`): fuzzy search + inline create with category + tag selection
- Command palette (`:`): text commands
- Filter view (`f`): filter by category, status, tag
- Task create/edit forms: title → category → description → tags → confirm
- Task detail view: view metadata, edit, delete
- Help view (`?`)
- Supabase integration + `--mock` mode
- First-run onboarding wizard + `chaos config`
- Global `chaos` command via `npm link`

### Core (`core/`)
- `Task`, `TaskStatus`, `Category`, `Tag` domain types
- `DEFAULT_CATEGORIES` (4 workflow buckets), `DEFAULT_TAGS` (6 topic labels)
- `TaskRepository` interface with `getByTag()`
- Fuzzy search service (`searchTasks`)
- Palette actions service

### Infrastructure
- `SupabaseTaskRepository` — full CRUD + tag support
- `MockTaskRepository` — in-memory with seed data

---

## Known Gaps

- No test framework configured
- Canvas experiment (`experiments/canvas/`) not updated for new category/tag model (archived, not actively developed)

---

## What's Next

No active planned work. The CLI is feature-complete for the current model. Possible directions:

- Flow session tracking (log time spent per task)
- Task sorting/reordering within categories
- Due dates
- Recurring tasks

---

*Last updated: 2026-03-13*
