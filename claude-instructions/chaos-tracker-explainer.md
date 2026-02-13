# Chaos Tracker - Learning Explainer

*This document explains the technologies and concepts used in each phase of building Chaos Tracker. It's designed for someone learning app development.*

---

## How to Use This Document

Each section corresponds to a phase in `chaos-tracker-plan.md`. Read the explainer section before or during that phase to understand:
- **What** each technology/concept is
- **Why** we chose it for this project
- **How** it works at a conceptual level

---

## The Big Picture: Multi-Client Architecture

Before diving into phases, here's the key architectural insight: **we're building one brain with multiple faces.**

### Why Multiple Visualizations?

Different interfaces suit different:
- **Thinking styles**: Some people think in lists, others in spatial maps
- **Contexts**: Terminal when coding, visual board when planning
- **Moods**: Sometimes you want rich visuals, sometimes just text

Instead of picking one and hoping it works, we're setting up the architecture to experiment with several.

### The Shared Brain

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHARED "BRAIN"                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  core/           What is a task? What are the rules?      │  │
│  │  infrastructure/ How do we talk to the database?          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │   Web   │           │   CLI   │           │ Canvas  │
   │ Kanban  │           │Terminal │           │Mind Map │
   │  board  │           │interface│           │  nodes  │
   └─────────┘           └─────────┘           └─────────┘
```

All three "faces" share:
- The same task data (stored in Supabase)
- The same business rules (what makes a task valid)
- The same operations (create, update, touch, complete)

They differ only in how they **display** and **interact with** that data.

### Why This Matters for Learning

This pattern—separating "what the app knows" from "how the app looks"—is a fundamental software architecture principle. You'll see it called:
- **Separation of concerns**
- **Clean architecture**
- **Hexagonal architecture**
- **Ports and adapters**

The benefit: change the UI without breaking the logic, or vice versa.

---

## How Modern Web Apps Work

Here's how the pieces fit together for the Web (Kanban) client:

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR BROWSER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     React App                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │  │
│  │  │   UI        │  │   State     │  │   Data       │   │  │
│  │  │ (ShadCN +   │◄─│  (Zustand)  │◄─│  (TanStack   │   │  │
│  │  │  Tailwind)  │  │             │  │   Query)     │   │  │
│  │  └─────────────┘  └─────────────┘  └──────┬───────┘   │  │
│  └───────────────────────────────────────────┼───────────┘  │
└──────────────────────────────────────────────┼──────────────┘
                                               │ Internet
                                               ▼
                                    ┌──────────────────┐
                                    │    Supabase      │
                                    │   (Database)     │
                                    └──────────────────┘
```

**In plain English:** Your app runs in the browser. It shows a user interface (UI), keeps track of what the user is doing (state), and talks to a database on the internet (Supabase) to save and load tasks.

---

## Phase 1: Project Setup & Foundation

### Vite (pronounced "veet")

**What is it?**
Vite is a *build tool*—it's the software that takes your code and prepares it to run in a browser.

**Why not just open the files directly?**
Modern JavaScript (especially with React and TypeScript) needs to be transformed before browsers can understand it. Vite does this transformation instantly while you develop, and creates optimized files when you're ready to deploy.

**Why Vite specifically?**
- **Speed**: Vite is extremely fast. Changes appear in your browser almost instantly.
- **Modern**: Uses the latest browser capabilities (ESM—"ES Modules").
- **Simple**: Less configuration than older tools like Webpack.

**Analogy**: If your code is a recipe written in shorthand, Vite is the chef who reads your shorthand, understands it, and cooks the actual dish (the running app).

---

### TypeScript

**What is it?**
TypeScript is JavaScript with *types*. Types are labels that tell you what kind of data something is.

```typescript
// JavaScript - no types, anything goes
let task = "Buy groceries"
task = 42  // JavaScript allows this (but it's probably a bug!)

// TypeScript - types catch mistakes
let task: string = "Buy groceries"
task = 42  // TypeScript ERROR: can't assign number to string
```

**Why use it?**
- **Catches bugs early**: Many errors are found while you write code, not when users find them.
- **Better autocomplete**: Your code editor knows what properties and functions are available.
- **Self-documenting**: Types explain what data looks like without comments.

**For Chaos Tracker**: Our `Task` type will define exactly what a task contains (title, status, category, etc.), and TypeScript will ensure we never accidentally use a task incorrectly.

---

### React

**What is it?**
React is a *library* for building user interfaces. It lets you create reusable *components*—self-contained pieces of UI.

**The core concept: Components**
```
┌─────────────────────────────────────────┐
│  App                                    │
│  ┌───────────────────────────────────┐  │
│  │  Header                           │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  TaskList                         │  │
│  │  ┌─────────┐ ┌─────────┐          │  │
│  │  │TaskCard │ │TaskCard │ ...      │  │
│  │  └─────────┘ └─────────┘          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

Each box is a component. You build small components (TaskCard), then combine them into bigger ones (TaskList), then into the full App.

**Why React?**
- **Huge ecosystem**: Millions of developers, tons of resources and libraries.
- **Portable**: The same React knowledge works for web, desktop (Electron), and mobile (React Native).
- **Declarative**: You describe *what* you want the UI to look like, React figures out *how* to update it.

---

### Tailwind CSS

**What is it?**
Tailwind is a *utility-first CSS framework*. Instead of writing separate CSS files, you add small utility classes directly to your HTML.

**Traditional CSS vs Tailwind:**
```html
<!-- Traditional: Write CSS separately -->
<div class="my-card">Hello</div>
<style>
  .my-card {
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>

<!-- Tailwind: Classes directly on element -->
<div class="p-4 bg-white rounded-lg shadow">Hello</div>
```

**Why Tailwind?**
- **Fast to write**: No switching between files, no naming classes.
- **Consistent**: Uses a design system (spacing, colors, sizes) by default.
- **Small files**: Only the CSS you actually use is included in the final build.

**The learning curve**: At first, `p-4 bg-white rounded-lg shadow` looks strange. But each class does one thing: `p-4` = padding of 4 units, `bg-white` = white background, etc. You'll learn the common ones quickly.

---

### ShadCN UI

**What is it?**
ShadCN is a collection of pre-built, beautiful UI components (buttons, forms, dialogs, etc.) that you copy into your project.

**How is it different from other UI libraries?**
Most UI libraries are installed as packages you can't easily modify. ShadCN gives you the actual source code—you own it and can customize everything.

**Why ShadCN for Chaos Tracker?**
- **Themeable**: You mentioned wanting custom theming later. ShadCN uses CSS variables, so changing colors is easy.
- **Professional look**: Components are well-designed out of the box.
- **No lock-in**: Since you own the code, you're never stuck with their decisions.

**Stone base color**: When setting up ShadCN, we'll choose "Stone" as the base color. This gives a warmer gray tone than the default.

---

### Directory Structure Explained

```
src/
├── app/              # The "entry point" - where the app starts
├── core/             # Business logic that doesn't depend on React
│   ├── domain/       # Data shapes (what is a Task? a Category?)
│   ├── services/     # Operations (calculate neglected tasks, etc.)
│   └── repositories/ # Rules for how to access data
├── infrastructure/   # Concrete implementation (Supabase code)
├── features/         # Actual screens and functionality
├── components/ui/    # Reusable UI pieces (buttons, cards)
├── lib/              # Helper utilities
└── stores/           # UI state management
```

**Why this structure?**

The key insight is separating `core/` from everything else:

- **core/** has zero dependencies on React or Supabase. It's pure TypeScript logic.
- This means when we build the Electron or mobile version, we can reuse `core/` entirely—we only rebuild the UI layer.

**Analogy**: Think of `core/` as the engine of a car. The `features/` and `components/` are the body and interior. You can put the same engine in a sedan, SUV, or truck (web, desktop, mobile).

---

### Environment Variables (.env.local)

**What are they?**
Configuration values that change between environments (development vs production) or contain secrets (like API keys).

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-secret-key-here
```

**Why .env.local?**
- **Security**: Keeps secrets out of your code (which might be public on GitHub).
- **Flexibility**: Different values for development and production.
- **Convention**: The `.local` suffix means "don't commit this to git."

**The VITE_ prefix**: Vite only exposes environment variables that start with `VITE_` to your app. This prevents accidentally exposing server-side secrets.

---

## Phase 2: Core UI Components

### Component Thinking

In React, you break down your UI into components. For Chaos Tracker:

```
LandscapeView (the whole dashboard)
├── Header (with app title, theme toggle)
├── CategorySection (one per category: Work, Personal, etc.)
│   ├── TaskCard (one per task)
│   │   ├── Badge (status indicator)
│   │   ├── Button (actions like Touch, Complete)
│   │   └── ...
│   └── TaskCard
│       └── ...
└── TaskForm (for creating/editing tasks)
```

**Building bottom-up**: We create small components first (Badge, Button), then combine them into bigger ones (TaskCard), then into full screens (LandscapeView).

---

### Domain Types

**What is a domain?**
In software, "domain" means "the specific problem area you're solving." For Chaos Tracker, the domain is task management.

**Domain types define your data:**
```typescript
type TaskStatus = 'pending' | 'in_progress' | 'paused' | 'completed'

type Task = {
  id: string
  title: string
  description?: string  // The ? means optional
  status: TaskStatus
  category: string
  last_touched: Date
  // ...more fields
}
```

**Why define these carefully?**
- TypeScript uses these types everywhere, catching mistakes.
- They document your data model clearly.
- They must match what's in Supabase (your database).

---

### Theme System (Light/Dark Mode)

**How it works:**
1. CSS variables define colors: `--background: white` or `--background: #1a1a1a`
2. A class on the `<html>` element (`.dark`) switches which variables are active.
3. Components use variables: `background: var(--background)`

**Why CSS variables?**
They can be changed at runtime without reloading. Click the toggle, the class changes, colors update instantly.

**Persisting preference**: We'll save the user's choice to `localStorage` (browser storage), so it remembers across sessions.

---

## Phase 3: Supabase Integration

### What is Supabase?

Supabase is a *Backend as a Service* (BaaS). Instead of building your own server and database, Supabase provides:
- A PostgreSQL database (where your tasks are stored)
- An API to access that database from your app
- Authentication (login/signup—for later)
- Real-time subscriptions (live updates—for later)

**You already have this set up.** We just need to connect the React app to it.

---

### Repository Pattern

**What is it?**
A way to separate "how we access data" from "what we do with data."

```typescript
// Repository interface (in core/ - no Supabase knowledge)
interface TaskRepository {
  getAll(): Promise<Task[]>
  getById(id: string): Promise<Task>
  create(task: NewTask): Promise<Task>
  update(id: string, changes: Partial<Task>): Promise<Task>
  delete(id: string): Promise<void>
}

// Supabase implementation (in infrastructure/)
class SupabaseTaskRepository implements TaskRepository {
  async getAll() {
    const { data } = await supabase.from('tasks').select('*')
    return data
  }
  // ...
}
```

**Why bother?**
- **Testability**: You can create a fake repository for testing without hitting the real database.
- **Portability**: If you switch from Supabase to something else, only `infrastructure/` changes.
- **Clean code**: Your UI components don't care where data comes from.

---

### TanStack Query (formerly React Query)

**The problem it solves:**
Fetching data from a server involves many concerns:
- Loading states (showing a spinner)
- Error handling (what if the network fails?)
- Caching (don't re-fetch data we already have)
- Refetching (when should we get fresh data?)
- Synchronization (what if two tabs have different data?)

**TanStack Query handles all of this:**
```typescript
function TaskList() {
  const { data: tasks, isLoading, error } = useTasks()

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return tasks.map(task => <TaskCard task={task} />)
}
```

**Optimistic updates**: When you mark a task complete, TanStack Query can update the UI immediately (optimistically), then sync with the server. If the server fails, it rolls back. This makes the app feel instant.

---

### Zustand

**What is it?**
A tiny state management library for React.

**What's "state"?**
State is data that changes over time and affects what the UI shows:
- Is the sidebar open or closed?
- Which filter is currently selected?
- What text has the user typed in the search box?

**Why Zustand (not Redux, not Context)?**
- **Simple**: Less boilerplate than Redux.
- **Tiny**: Only 1KB of code.
- **Flexible**: Works outside React components too.

**For Chaos Tracker**: We'll use Zustand for UI state only (sidebar open, current filter). Server data (tasks) goes through TanStack Query.

---

## Phase 4: Main Features

### LandscapeView

This is the main screen—the "task landscape." It uses a **kanban board** layout.

**What is a Kanban board?**
Originally from Japanese manufacturing, a kanban board organizes items into columns. Each column represents a category or stage. Items (cards) move through the board.

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   Chores     │  Connection  │    Hobby     │  Rejuvenate  │
│   ┌──────┐   │   ┌──────┐   │   ┌──────┐   │   ┌──────┐   │
│   │ Task │   │   │ Task │   │   │ Task │   │   │ Task │   │
│   └──────┘   │   └──────┘   │   │      │   │   └──────┘   │
│   ┌──────┐   │              │   └──────┘   │              │
│   │ Task │   │              │   ┌──────┐   │              │
│   └──────┘   │              │   │ Task │   │              │
│              │              │   └──────┘   │              │
│  + New task  │  + New task  │  + New task  │  + New task  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**For Chaos Tracker:**
- Each column = a category (Chores, Connection, Hobby, etc.)
- Each card = a task with title and status badge
- Colors distinguish categories at a glance
- "+ New task" at the bottom of each column for quick creation

**Design philosophy**: Show what matters, hide what doesn't. The landscape should be glanceable—you should understand your task world in seconds.

**Reference screenshot**: See `claude-instructions/reference-screenshots/` for the visual inspiration (Notion-style dark mode board).

---

### The "Touch" Concept

**What is it?**
"Touching" a task updates its `last_touched` timestamp without changing anything else. It's a way to say "I acknowledge this task exists" without starting or completing it.

**Why it matters:**
For recurring or ongoing tasks, "touch" prevents them from appearing neglected. It's lighter than "start" but still shows activity.

---

### Routing with React Router

**What is routing?**
Mapping URLs to different screens:
- `/` → LandscapeView (main dashboard)
- `/rejuvenate` → RejuvenationView

**Why React Router?**
- Standard solution for React apps.
- Works well with Electron (for future desktop version).
- Supports browser back/forward buttons.

---

### Keyboard Shortcuts

Keyboard shortcuts make the app faster for power users—no mouse needed.

**Chaos Tracker shortcuts:**

| Key | What it does |
|-----|--------------|
| `Enter` | Create task (when typing in input) |
| `Space` | Toggle status of focused task |
| `Tab` | Move focus to next task |
| `Shift+Tab` | Move focus to previous task |
| `t` | Touch the focused task |

**How focus works:**
"Focus" means which element is currently selected for keyboard interaction. You'll see a visible ring/outline around the focused task. Pressing `Tab` moves focus forward, `Shift+Tab` moves it backward.

**Implementation**: We'll:
1. Make task cards focusable (`tabindex` attribute)
2. Listen for keyboard events on focused tasks
3. Trigger the appropriate action based on the key pressed

---

## Phase 5: Polish & Theming

### What "Polish" Means

Polish is the difference between "it works" and "it feels good to use":
- **Transitions**: Elements fade or slide instead of popping in.
- **Micro-interactions**: Buttons give subtle feedback on hover/click.
- **Spacing consistency**: Everything aligns to a grid.
- **Loading states**: Skeleton screens instead of blank spaces.

---

### Responsive Design

**What is it?**
The app adapts to different screen sizes—phone, tablet, desktop.

**Mobile-first approach**:
1. Design for mobile first (smallest screen).
2. Add styles for larger screens.

**Why mobile-first?**
It's easier to add complexity for bigger screens than to remove it for smaller ones. And it ensures the mobile experience is a first-class citizen.

---

### Accessibility (a11y)

**What is it?**
Making the app usable by everyone, including people who:
- Use screen readers (vision impaired)
- Navigate with keyboard only (motor impairments)
- Have color blindness
- Need larger text

**Key practices:**
- **Semantic HTML**: Using `<button>` not `<div onclick>`.
- **ARIA labels**: Screen reader descriptions for icons.
- **Focus management**: Keyboard users can tab through the UI logically.
- **Color contrast**: Text is readable against backgrounds.

**ShadCN helps**: Its components are built with accessibility in mind.

---

### Error Boundaries

**What happens when something crashes?**
In React, if a component throws an error, the whole app can crash—showing a white screen.

**Error boundaries catch errors** and show a fallback UI instead:
```
"Something went wrong. Please refresh the page."
```

This is much better than a broken white screen.

---

### Toast Notifications

**What are they?**
Small, temporary messages that appear (usually in a corner) to confirm actions:
- "Task created successfully"
- "Failed to save changes"

**Why use them?**
They provide feedback without interrupting the user's flow. They appear, then disappear on their own.

---

## Future Experiments Explained

### CLI (Command Line Interface)

**What is a CLI?**
A text-based interface in the terminal/command prompt. Instead of clicking buttons, you type commands.

```bash
$ chaos add "Review PR" --category work
✓ Task created

$ chaos list
WORK
  ● Review PR                    [in progress]
  ○ Fix bug                      [pending]

$ chaos touch 1
✓ Touched "Review PR"
```

**Why build a CLI version?**
- Faster for keyboard-heavy users (developers)
- Works over SSH (remote servers)
- Scriptable (automate task management)
- Low resource usage
- No context-switching if you're already in terminal

**Tech we'd use:**
- **Ink**: A library that lets you use React to build terminal UIs. Yes, the same React concepts (components, state) but rendering to text instead of a browser.
- **Commander**: For parsing commands like `chaos add "Task name"`

### Canvas (Mind Map Style)

**What is a canvas interface?**
A freeform 2D space where items are "nodes" you can place anywhere. Connections between nodes show relationships.

Think: Miro, FigJam, or mind-mapping apps like MindNode.

**Why build a canvas version?**
- Shows relationships between tasks
- Non-linear organization (not forced into columns)
- Great for planning and brainstorming
- Visual clustering by proximity
- Zoom in/out for different detail levels

**Tech we'd use:**
- **ReactFlow** or **XYFlow**: Libraries for building node-based editors
- Nodes = tasks, categories, or groups
- Edges = relationships, dependencies, or connections

### How We'll Experiment

1. **Build Web (Kanban) first** — it's the most conventional, good baseline
2. **Extract shared code** — ensure `core/` and `infrastructure/` are truly independent
3. **Build CLI** — quick to prototype, tests the architecture
4. **Build Canvas** — more experimental, different interaction model
5. **Evaluate** — which feels right? Maybe combine ideas?

The shared `core/` means we're not starting from scratch each time—just building a new "face" for the same brain.

---

## Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface—how your app talks to servers |
| **Component** | A reusable piece of UI in React |
| **ESM** | ECMAScript Modules—modern way to share code between files |
| **Hook** | React function starting with `use` (useState, useEffect, etc.) |
| **Mutation** | Changing data (create, update, delete) vs just reading it |
| **Query** | Requesting data from a server |
| **State** | Data that changes over time and affects the UI |
| **Type** | In TypeScript, a label describing what kind of data something is |

---

## Questions to Ask as You Learn

Good questions to keep in mind during each phase:

1. **What problem does this solve?** (Every technology exists for a reason)
2. **What would I do without this?** (Helps appreciate the value)
3. **What are the trade-offs?** (Nothing is perfect)
4. **How does this connect to other pieces?** (Understanding the system)

---

*This document grows with the project. As we encounter new concepts, they'll be added here.*

*Last updated: 2026-01-26*
