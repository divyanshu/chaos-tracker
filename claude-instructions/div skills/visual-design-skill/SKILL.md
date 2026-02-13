---
name: visual-design
description: "Apply professional visual design principles to software interfaces. Use this skill whenever building, styling, reviewing, or improving the visual quality of any UI — web apps, mobile apps, desktop apps, dashboards, terminal UIs (TUI/CLI), canvas-based tools, landing pages, or component libraries. Also trigger when the user mentions design tokens, color palettes, typography, spacing, visual hierarchy, dark mode, theming, or asks to make something 'look better' or 'more polished'. Covers color theory, typography systems, spatial layout, visual hierarchy, Gestalt perception, motion design, and aesthetic style across minimalist, maximalist, and hybrid approaches."
---

# Visual Design for Software Interfaces

Apply professional visual design knowledge to create polished, intentional software interfaces. This skill encodes best practices from leading design systems (Material, Fluent, Apple HIG), NN/Group research, and practitioner expertise.

## When to Use This Skill

- Building any UI (web, mobile, desktop, TUI, canvas)
- Choosing colors, fonts, spacing, or layout
- Creating or reviewing design tokens / design systems
- Making an interface "look better" or more professional
- Implementing dark mode, theming, or responsive design
- Reviewing visual quality of generated UI code

## Quick Decision Framework

Before making visual choices, answer three questions:

1. **What type of app?** → Determines density, tone, and constraints
2. **What aesthetic style?** → Determines palette richness, whitespace ratio, type expression
3. **What platform?** → Determines specific values (px, dp, terminal cells)

Then read the appropriate reference files below for detailed guidance.

---

## Core Principles (Always Apply)

### 1. Visual Hierarchy First

Every screen must answer three questions within 3 seconds:
- Where am I?
- What is the most important thing here?
- What can I do?

Establish hierarchy through (in order of visual impact): **size → contrast → weight → position → whitespace → elevation → motion**. Every element fits one of three tiers:

| Tier | Role | Treatment |
|------|------|-----------|
| **Primary** | Single most important action/content | Largest, highest contrast, most prominent position |
| **Secondary** | Supporting actions/content | Medium emphasis, visible but not dominant |
| **Tertiary** | Meta info, chrome, navigation | Lowest emphasis, smallest, most muted |

### 2. Spacing Is the #1 Lever

Proximity is the most powerful Gestalt principle — it overrides color, shape, and other similarity cues. Getting spacing right matters more than getting colors right. Use a consistent spatial system:

**The 8px grid** (industry standard):
- All spacing, sizing, positioning in multiples of 8px
- 4px half-unit for fine adjustments (icon gaps, inline spacing)
- Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`

Apply spacing to express relationships:
- **Tight** (4-8px): elements that are strongly related (icon + label, avatar + name)
- **Medium** (12-16px): elements within a component (list items, form fields)
- **Wide** (24-32px): between components or content groups
- **Spacious** (48-96px): between major sections

### 3. Typography Drives Quality

Type accounts for 85-90% of screen content. The type system is the single most impactful quality signal.

**Base rules:**
- Body text: 16-20px (web), 14-17px (mobile) — never smaller for primary reading
- Line height: 1.4-1.6× for body, 1.1-1.3× for headings
- Line length: 45-75 characters (ideal: 65)
- Limit to 2 typefaces max; use weight/size for hierarchy within a family
- Type scale: pick a ratio and derive all sizes mathematically

| Scale Ratio | Name | Vibe | Good For |
|-------------|------|------|----------|
| 1.125 | Major Second | Tight, dense | Data-heavy dashboards, TUI |
| 1.200 | Minor Third | Compact | SaaS tools, dense UIs |
| 1.250 | Major Third | Balanced | General purpose apps |
| 1.333 | Perfect Fourth | Clear | Most web apps, mobile |
| 1.500 | Perfect Fifth | Bold | Marketing, editorial, landing pages |
| 1.618 | Golden Ratio | Dramatic | Hero sections, expressive consumer apps |

### 4. Color With Purpose

**The 60-30-10 rule:**
- 60% dominant/neutral (backgrounds, surfaces)
- 30% secondary (cards, navigation, sections)
- 10% accent (CTAs, highlights, interactive elements)

**Every palette needs:**
- Primary brand color + 8-12 shades (lightness range ~95 to ~30)
- Neutral scale (tint grays with primary hue — pure gray looks dead)
- Semantic colors: red=error, green=success, yellow=warning, blue=info
- Surface colors for elevation layers

**Accessibility is non-negotiable:**
- WCAG AA minimum: 4.5:1 text contrast, 3:1 for large text (18px+ or 14px+ bold)
- Never rely on color alone — always pair with icons, patterns, or labels
- Test with color blindness simulation

### 5. Gestalt Principles Guide Layout

Apply these perceptual laws to every layout decision:

| Principle | Rule | Do This |
|-----------|------|---------|
| **Proximity** | Close = related | Group related fields; separate sections with whitespace |
| **Similarity** | Same look = same function | All buttons look alike; all links share a style |
| **Enclosure** | Borders create groups | Use cards, panels, dividers to section content |
| **Continuity** | Lines guide the eye | Align elements; use consistent visual flow |
| **Figure/Ground** | Foreground vs background | Use overlays, shadows, blur to create depth layers |

### 6. Motion With Restraint

Animation serves function, not decoration. Every animation must have a purpose:

| Purpose | Example | Duration |
|---------|---------|----------|
| Instant feedback | Button press, toggle | 100-200ms |
| Simple transition | Fade, slide, expand | 200-300ms |
| Complex transition | Page change, panel expansion | 300-500ms |

**Rules:** Always use easing (never linear). Always respect `prefers-reduced-motion`. Never exceed 1 second for UI animations. Use ease-out for entering elements, ease-in for exiting.

---

## App-Type Specific Guidance

Read the appropriate reference file for detailed values and patterns:

### Consumer Apps (B2C)
→ Read `references/app-consumer.md`

Emotional design, generous whitespace, bold type, mobile-first, onboarding-focused. Color psychology matters more. Personality through motion and illustration.

### SaaS / Enterprise Apps (B2B)
→ Read `references/app-saas.md`

Information density, keyboard shortcuts, neutral palettes with strategic accents, consistent patterns across deep navigation. Desktop-optimized. Design system essential.

### Terminal UI (TUI/CLI)
→ Read `references/app-terminal.md`

Fixed-width fonts, ANSI/256/true color, box-drawing characters, semantic color tokens, panel-based layout. Hierarchy through case, weight, color, and borders.

### Canvas-Based Apps
→ Read `references/app-canvas.md`

60fps performance, infinite pan/zoom, direct manipulation, custom cursors, snapping/guides, selection states, layer management.

---

## Aesthetic Style Guide

Read `references/style-guide.md` for detailed design token presets for each style:

| Style | Whitespace | Colors | Typography | Best For |
|-------|-----------|--------|------------|----------|
| **Minimalist** | 50%+ | 1-2 + neutrals | Clean sans-serif | Productivity, fintech, dev tools |
| **Corporate Clean** | 40-50% | Neutral + 1 accent | System fonts, professional | Enterprise, banking, government |
| **Warm Organic** | 40-50% | Earth tones, gradients | Rounded sans, gentle serif | Wellness, education, family |
| **Bold Consumer** | 30-40% | Vibrant, saturated | Expressive, mixed weights | Social, lifestyle, entertainment |
| **Data Dense** | 20-30% | Muted + semantic colors | Compact, monospace accents | Dashboards, analytics, trading |
| **Maximalist** | <20% | Bold, saturated, layered | Multiple fonts, decorative | Fashion, gaming, creative |

The style exists on a multi-axis spectrum:
- **Density**: Spacious ←→ Dense
- **Expression**: Restrained ←→ Bold
- **Surface**: Flat ←→ Elevated
- **Tone**: Corporate ←→ Playful

---

## Design Token Template

When creating any UI, define tokens first. This is the universal starting point:

```css
/* === COLORS === */
--color-primary-500: ;     /* Brand color */
--color-primary-50: ;      /* Lightest tint */
--color-primary-900: ;     /* Darkest shade */
--color-neutral-0: ;       /* White/lightest surface */
--color-neutral-50: ;      /* Subtle background */
--color-neutral-100: ;     /* Card/section background */
--color-neutral-200: ;     /* Borders, dividers */
--color-neutral-400: ;     /* Placeholder text */
--color-neutral-600: ;     /* Secondary text */
--color-neutral-900: ;     /* Primary text */
--color-error: ;
--color-success: ;
--color-warning: ;
--color-info: ;

/* === TYPOGRAPHY === */
--font-family-display: ;   /* Headings */
--font-family-body: ;      /* Body text */
--font-family-mono: ;      /* Code */
--font-size-xs: ;          /* 12px */
--font-size-sm: ;          /* 14px */
--font-size-base: ;        /* 16px */
--font-size-lg: ;          /* 18-20px */
--font-size-xl: ;          /* 24px */
--font-size-2xl: ;         /* 30-32px */
--font-size-3xl: ;         /* 36-40px */
--font-size-4xl: ;         /* 48px */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

/* === SPACING === */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;

/* === BORDERS & RADII === */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
--border-width: 1px;
--border-color: var(--color-neutral-200);

/* === SHADOWS (elevation) === */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);

/* === MOTION === */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
```

Fill these tokens based on the app type and style before writing any component code.

---

## Checklist: Before Delivering Any UI

Run through this checklist on every UI you produce:

- [ ] **Hierarchy**: Can you identify primary, secondary, tertiary in 3 seconds?
- [ ] **Spacing**: Is spacing consistent and following the 8px grid?
- [ ] **Typography**: Is there a clear type scale? Body text ≥16px? Line length ≤75 chars?
- [ ] **Color**: Does it follow 60-30-10? Are semantic colors correct?
- [ ] **Contrast**: All text passes WCAG AA (4.5:1)?
- [ ] **Alignment**: Are all elements aligned to the grid?
- [ ] **Grouping**: Are related elements proximate? Are unrelated elements separated?
- [ ] **Consistency**: Do similar elements look and behave the same?
- [ ] **Responsiveness**: Does it work at the target viewport sizes?
- [ ] **Tinted neutrals**: Are grays tinted with the primary hue (no pure gray)?
