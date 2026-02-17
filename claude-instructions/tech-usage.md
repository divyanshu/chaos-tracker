# Tech & Platform Usage Log

This file tracks the technologies and platforms used in the chaos-tracker project.

## Current Stack

| Technology | Purpose | Notes |
|------------|---------|-------|
| Supabase | Database & Backend | PostgreSQL database hosting tasks table |
| Anthropic | AI Assistant | Claude Code for development assistance |
| Zed.dev | Code Editor | Primary development environment |

## Web Frontend Stack

| Technology | Purpose | Notes |
|------------|---------|-------|
| Vite | Build Tool | Fast HMR, modern ESM support |
| React 18 | UI Framework | TypeScript, future Electron/RN compatible |
| ShadCN UI | Component Library | Tailwind-based, themeable, copy-paste ownership |
| Tailwind CSS | Styling | Utility-first, works with ShadCN |
| TanStack Query v5 | Server State | Caching, optimistic updates for Supabase |
| Zustand | Client State | Lightweight UI state management |
| React Router v6 | Routing | Works in Electron context |

## CLI Stack

| Technology | Purpose | Notes |
|------------|---------|-------|
| Ink 5 | Terminal UI Framework | React for terminals |
| @inkjs/ui | Ink Components | TextInput, Select, etc. |
| chalk 5 | Terminal Styling | Colors and formatting |
| tsup | Build Tool | Bundles to standalone dist with shebang |
| tsx | Dev Runner | TypeScript execution for development |
| dotenv | Env Loading | Reads `.env` config files |

## Platforms

| Platform | Technology | Status |
|----------|------------|--------|
| Web | React + Vite | Done (Phases 1-6) |
| CLI | Node.js + Ink 5 | Done (prototype + productionization in progress) |
| Mac Desktop | Electron | Future |
| Mobile | React Native | Future |

---

*This log is automatically updated as new technologies are added to the project.*
