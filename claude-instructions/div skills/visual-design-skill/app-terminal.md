# Visual Design: Terminal User Interfaces (TUI/CLI)

Terminal UIs operate under unique constraints but the same visual principles apply. The best TUIs feel intentionally designed, not default. Every choice — color, alignment, border style, density — should be deliberate.

## Constraints

- **Fixed-width font only** — all alignment is character-based
- **Limited color** — 16 ANSI, 256-color, or true color (24-bit RGB) depending on terminal
- **No images** — visual communication through characters, color, and layout
- **Keyboard-first** — mouse support is secondary
- **Variable terminal width** — must handle resize gracefully

## Color System

### Define a Centralized Theme

The #1 architectural decision: centralize ALL colors in a single theme module. Never hardcode color strings in UI code.

```
Theme structure:
├── Colors (semantic)
│   ├── PRIMARY      — brand/accent
│   ├── SUCCESS      — green tones
│   ├── ERROR        — red tones
│   ├── WARNING      — yellow tones
│   ├── INFO         — blue tones
│   ├── TEXT_PRIMARY  — high contrast
│   ├── TEXT_MUTED    — low contrast
│   └── BORDER       — panel edges
├── Icons (unicode)
│   ├── SUCCESS: ✓
│   ├── ERROR: ✗
│   ├── WARNING: ⚠
│   ├── INFO: ℹ
│   ├── BULLET: •
│   └── ARROW: →
└── Layout
    ├── PADDING: 2 (characters)
    ├── MAX_WIDTH: 100
    └── BOX_STYLE: rounded / heavy / double
```

### ANSI Color Best Practices

- Use **bright** variants for emphasis (bright white, bright cyan)
- Use **dim** for de-emphasized content (dim gray, dim text)
- Reserve **bold** + color for headings and key data
- Use **background color sparingly** — only for selections, highlights, status badges
- Avoid red on blue or green on red (color blindness)
- Test with both light and dark terminal backgrounds

### Semantic Colors for TUI

```
Status indicators:
  ● (green)   — active, running, success, healthy
  ○ (gray)    — inactive, stopped, empty
  ◐ (yellow)  — pending, in progress, partial
  ● (red)     — error, failed, critical
  ● (blue)    — informational, selected

Text hierarchy:
  Bright/Bold  — headings, key values, active items
  Normal       — body content, descriptions
  Dim/Gray     — secondary info, timestamps, IDs, help text
  Underline    — links, interactive elements (or use bright color)
```

## Typography (Character-Based)

Since all fonts are monospace, hierarchy comes from other means:

- **UPPERCASE** for section headers, labels, status badges
- **Bold** for emphasis, key values, active items
- **Dim** for secondary text, metadata, timestamps
- **Color** for semantic meaning and interactive elements
- **Indentation** for hierarchy (2-space indent per level)
- **Box-drawing characters** for structure

### Box Drawing Characters

```
Rounded:  ╭─────╮    Heavy:  ┏━━━━━┓    Double:  ╔═════╗
          │     │            ┃     ┃             ║     ║
          ╰─────╯            ┗━━━━━┛             ╚═════╝

Light:    ┌─────┐    ASCII:  +-----+
          │     │            |     |
          └─────┘            +-----+

Tree:     ├── child           Divider: ──────────────────
          ├── child           Thick:   ━━━━━━━━━━━━━━━━━━
          └── last child      Dotted:  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
```

Use **rounded corners** (╭╮╰╯) for a modern feel. Use **heavy borders** (┏┓┗┛) for emphasis. Use **light borders** (┌┐└┘) as the default.

## Layout

### Panel-Based Structure

TUIs use panels (bordered regions) in place of cards:

```
╭─ Dashboard ──────────────────────────────────────╮
│                                                   │
│  ╭─ CPU ──────╮  ╭─ Memory ───╮  ╭─ Disk ─────╮ │
│  │ ████░░ 67% │  │ ██████ 85% │  │ ███░░░ 42% │ │
│  ╰────────────╯  ╰────────────╯  ╰────────────╯ │
│                                                   │
│  ╭─ Processes ───────────────────────────────────╮│
│  │  PID   NAME            CPU   MEM   STATUS    ││
│  │  1234  node            12%   256M  ● running ││
│  │  5678  postgres         8%   512M  ● running ││
│  │  9012  redis            2%    64M  ● running ││
│  ╰───────────────────────────────────────────────╯│
╰───────────────────────────────────────────────────╯
```

### Data Visualization

Use Unicode block characters for inline charts and gauges:

```
Sparklines:    ▁▂▃▄▅▆▇█▇▅▃▂▁▂▄▆█▇▅▃
Progress:      [████████████░░░░░░░░] 60%
Bar chart:     Sales    ████████████████████ 95%
               Revenue  ████████████████     80%
               Growth   ████████████         60%
Gauge:         CPU [████████░░] 80%
Heatmap:       ░▒▓█ (increasing intensity)
Status dots:   ●●●●●○○○○○ 5/10
```

### Table Design

```
┌──────────┬─────────┬──────────┬────────┐
│ NAME     │ STATUS  │ UPTIME   │   CPU  │
├──────────┼─────────┼──────────┼────────┤
│ api-01   │ ● up    │ 14d 3h   │  12.3% │
│ api-02   │ ● up    │ 14d 3h   │   8.7% │
│ worker   │ ◐ drain │  2h 15m  │  45.2% │
│ cache    │ ● down  │     —    │     —  │
└──────────┴─────────┴──────────┴────────┘
```

- Right-align numbers
- Use alternating dim rows for dense tables
- Status symbols + color (don't rely on color alone)
- Truncate long values with ellipsis (…) rather than wrapping

### Status Bar

Reserve a persistent line (top or bottom) for:
- Current context / breadcrumb
- Keyboard shortcuts
- Status indicators
- Timestamp / refresh indicator

```
╭─ myapp ─ production ──────── 3 services ─ Last refresh: 12:34:05 ─╮
│ ...content...                                                       │
╰─ [q]uit  [r]efresh  [/]search  [?]help ────────────────────────────╯
```

## Animation in TUI

- **Spinners**: `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` (braille), `⣾⣽⣻⢿⡿⣟⣯⣷` (dot), `◐◓◑◒` (circle)
- **Progress bars**: animate fill with `█` and `░`
- **Typing effects**: character-by-character reveal for streamed content
- **Live updates**: streaming data with in-place updates (cursor manipulation)
- **Transitions**: simple clear-and-redraw; avoid complex animations in terminals

## Frameworks

| Language | Library | Notes |
|----------|---------|-------|
| Python | Rich | Best for formatted output, tables, progress bars, panels |
| Python | Textual | Full TUI framework with widget system, CSS-like styling |
| Go | Bubbletea + Lipgloss | Elm-architecture TUI framework + styling library |
| Rust | Ratatui | High-performance rendering with widget system |
| Node.js | Ink | React-like component model for terminal |
| Any | ANSI escape codes | Direct control: `\x1b[1m` bold, `\x1b[31m` red, etc. |

## TUI Aesthetic Presets

**Cyberpunk**: Neon green (#00FF41) on black, heavy borders, matrix-style rain effects, bright cyan accents.

**Zen/Minimal**: Muted colors, thin borders, generous padding, dim secondary text, subtle rounded corners.

**Retro/Amber**: Amber (#FFB000) on dark brown (#1A0F00), classic CRT feel, blinking cursor, scanline effect.

**Modern/Polished**: True color gradients, rounded corners, pastel accents on dark gray, Nerd Font icons.
