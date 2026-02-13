# Visual Design: Aesthetic Style Guide

This reference provides concrete design token presets for different aesthetic styles. Choose a style based on the app's audience, brand, and purpose, then use these tokens as a starting point.

## How to Choose a Style

| Question | Minimalist | Corporate | Warm Organic | Bold Consumer | Data Dense | Maximalist |
|----------|:----------:|:---------:|:------------:|:-------------:|:----------:|:----------:|
| Daily tool for hours? | ✓ | ✓ | | | ✓ | |
| First impression matters most? | | | ✓ | ✓ | | ✓ |
| Users are technical? | ✓ | | | | ✓ | |
| Brand is playful? | | | ✓ | ✓ | | ✓ |
| Content is dense/complex? | | ✓ | | | ✓ | |
| Audience is creative? | ✓ | | | ✓ | | ✓ |

---

## 1. Minimalist

**Philosophy:** Every element earns its place. Whitespace is the primary design element. Reduction to essentials.

**Exemplars:** Linear, Notion, Apple.com, Stripe Docs, Things 3

**Characteristics:**
- 50%+ whitespace
- 1-2 colors + neutral scale
- Single font family (weight hierarchy only)
- Flat or near-flat (minimal shadows)
- Generous padding, no clutter
- Progressive disclosure (hide complexity)

```css
/* MINIMALIST TOKENS */
--color-primary-500: #171717;       /* Near-black as primary */
--color-primary-50: #F5F5F5;
--color-accent: #2563EB;            /* One accent for actions */
--color-neutral-0: #FFFFFF;
--color-neutral-50: #FAFAFA;
--color-neutral-100: #F5F5F5;
--color-neutral-200: #E5E5E5;
--color-neutral-400: #A3A3A3;
--color-neutral-600: #525252;
--color-neutral-900: #171717;

--font-family-display: -apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif;
--font-family-body: -apple-system, 'SF Pro Text', 'Inter', system-ui, sans-serif;
--font-size-base: 16px;
--line-height-normal: 1.6;

--space-section: 64px;              /* Generous section spacing */
--space-component: 32px;
--space-element: 16px;

--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 2px 8px rgba(0,0,0,0.06);

--border-color: rgba(0,0,0,0.06);   /* Very subtle borders */
--border-width: 1px;

--transition: 200ms ease-out;
```

**Key rules:**
- No decorative elements, no gradients, no textures
- Borders should be barely visible or replaced by spacing
- If you can remove it without losing meaning, remove it
- White or near-white backgrounds only
- One bold element per section maximum

---

## 2. Corporate Clean

**Philosophy:** Professional, trustworthy, familiar. Optimize for zero friction across large organizations.

**Exemplars:** Salesforce Lightning, Microsoft Fluent, IBM Carbon, Google Workspace

**Characteristics:**
- 40-50% whitespace
- Blue-dominant with neutral supporting palette
- System fonts for maximum compatibility
- Standardized component patterns
- Clear information hierarchy
- Accessible by default

```css
/* CORPORATE CLEAN TOKENS */
--color-primary-500: #0F62FE;       /* IBM/Microsoft blue range */
--color-primary-50: #EDF5FF;
--color-primary-700: #0043CE;
--color-neutral-0: #FFFFFF;
--color-neutral-50: #F4F4F4;
--color-neutral-100: #E0E0E0;
--color-neutral-200: #C6C6C6;
--color-neutral-400: #8D8D8D;
--color-neutral-600: #525252;
--color-neutral-900: #161616;

--color-error: #DA1E28;
--color-success: #198038;
--color-warning: #F1C21B;
--color-info: #0043CE;

--font-family-display: 'Segoe UI', -apple-system, 'Helvetica Neue', sans-serif;
--font-family-body: 'Segoe UI', -apple-system, 'Helvetica Neue', sans-serif;
--font-family-mono: 'Cascadia Code', 'Consolas', monospace;
--font-size-base: 14px;
--line-height-normal: 1.5;

--space-section: 48px;
--space-component: 24px;
--space-element: 12px;

--radius-sm: 4px;
--radius-md: 4px;                   /* Conservative, uniform radii */
--radius-lg: 8px;

--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
--shadow-md: 0 4px 8px rgba(0,0,0,0.1);

--header-height: 48px;
--sidebar-width: 256px;
```

**Key rules:**
- Never surprising — every element should be immediately recognizable
- Follow platform conventions strictly
- Prioritize keyboard accessibility
- Use iconography from a standard system set (Material, Fluent, Carbon)
- Tables, forms, and lists are the core components — invest heavily in these

---

## 3. Warm Organic

**Philosophy:** Human, approachable, comforting. Design that feels handcrafted and alive.

**Exemplars:** Headspace, Airbnb, Mailchimp, Duolingo, Notion (casual mode)

**Characteristics:**
- Earth tones, warm neutrals, soft pastels
- Rounded shapes everywhere
- Illustrations and hand-drawn elements
- Gentle gradients (not harsh)
- Friendly, approachable typography
- Generous but not extreme whitespace

```css
/* WARM ORGANIC TOKENS */
--color-primary-500: #E07A5F;       /* Terracotta */
--color-primary-50: #FFF5F2;
--color-primary-700: #B85A42;
--color-secondary: #81B29A;          /* Sage green */
--color-tertiary: #F2CC8F;           /* Warm gold */
--color-neutral-0: #FFFCF9;          /* Warm white */
--color-neutral-50: #FDF6F0;
--color-neutral-100: #F3ECE4;
--color-neutral-200: #E3D5C8;
--color-neutral-400: #B5A393;
--color-neutral-600: #6D5D4B;
--color-neutral-900: #2D241C;

--font-family-display: 'DM Serif Display', 'Georgia', serif;
--font-family-body: 'DM Sans', 'Nunito', sans-serif;
--font-size-base: 17px;
--line-height-normal: 1.65;

--space-section: 56px;
--space-component: 28px;
--space-element: 14px;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 20px;                  /* Very rounded */
--radius-xl: 28px;
--radius-full: 9999px;

--shadow-sm: 0 2px 4px rgba(45,36,28,0.06);
--shadow-md: 0 6px 16px rgba(45,36,28,0.08);

--gradient-warm: linear-gradient(135deg, #FFF5F2 0%, #FDF6F0 100%);
--transition: 300ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Slightly bouncy */
```

**Key rules:**
- Round everything — buttons, cards, inputs, avatars, images
- Use serif for headlines to feel editorial/premium
- Warm tint on all neutrals (never cold gray)
- Illustrations > icons where space allows
- Subtle background gradients add warmth
- Button hover states should feel alive (gentle scale, color shift)

---

## 4. Bold Consumer

**Philosophy:** Grabbing attention, expressing personality, creating energy. Stand out in a crowded market.

**Exemplars:** Spotify, Cash App, Nike, Discord, Figma marketing

**Characteristics:**
- Vibrant, saturated primary palette
- Dark backgrounds for immersion (or striking contrast)
- Large, confident typography
- Bold imagery and illustration
- Expressive motion
- Strong brand personality in every element

```css
/* BOLD CONSUMER TOKENS */
--color-primary-500: #1DB954;        /* Spotify green as example */
--color-primary-50: #E6F9ED;
--color-primary-900: #0A4D22;
--color-neutral-0: #FFFFFF;
--color-neutral-900: #121212;        /* Near-black */
--color-surface-dark: #181818;
--color-surface-mid: #282828;
--color-surface-light: #3E3E3E;
--color-text-on-dark: #FFFFFF;
--color-text-muted-on-dark: #B3B3B3;

--font-family-display: 'Clash Display', 'Syne', 'Poppins', sans-serif;
--font-family-body: 'Plus Jakarta Sans', 'Outfit', sans-serif;
--font-size-base: 16px;
--font-size-hero: 72px;             /* Go big */
--line-height-normal: 1.5;
--letter-spacing-tight: -0.02em;    /* Tight headlines */
--letter-spacing-wide: 0.1em;       /* UPPERCASE labels */

--space-section: 80px;
--space-component: 32px;
--space-element: 16px;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-pill: 9999px;

--shadow-glow: 0 0 20px rgba(29,185,84,0.3); /* Colored glow */
--shadow-lg: 0 16px 48px rgba(0,0,0,0.4);

--transition-fast: 150ms ease-out;
--transition-bounce: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Key rules:**
- Dark mode is the default canvas — content pops against it
- One signature color, used boldly and consistently
- Headlines are LARGE (48-96px) and tight-tracked (-0.02 to -0.04em)
- Cards and surfaces use subtle elevation, not borders
- Motion should feel energetic: spring physics, overshoot easing
- CTAs are impossible to miss: full saturation, large, pill-shaped

---

## 5. Data Dense

**Philosophy:** Maximum information in minimum space. Every pixel serves the data. Users are experts who crave efficiency.

**Exemplars:** Bloomberg Terminal, Grafana, Datadog, Trading platforms, Admin dashboards

**Characteristics:**
- <30% whitespace
- Compact components (small fonts, tight padding)
- Monospace for numbers and data
- Muted chrome, vivid data colors
- Tables, charts, and metrics dominate
- Dark mode often preferred (reduces eye strain during long sessions)

```css
/* DATA DENSE TOKENS */
--color-primary-500: #3B82F6;
--color-neutral-0: #0D1117;         /* Dark background (GitHub dark) */
--color-neutral-50: #161B22;
--color-neutral-100: #21262D;
--color-neutral-200: #30363D;
--color-neutral-400: #484F58;
--color-neutral-600: #8B949E;
--color-neutral-900: #F0F6FC;       /* Light text on dark */

--color-error: #F85149;
--color-success: #3FB950;
--color-warning: #D29922;
--color-info: #58A6FF;
--color-chart-1: #58A6FF;
--color-chart-2: #3FB950;
--color-chart-3: #D29922;
--color-chart-4: #F85149;
--color-chart-5: #BC8CFF;
--color-chart-6: #39D2C0;

--font-family-body: 'Inter', -apple-system, system-ui, sans-serif;
--font-family-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
--font-size-base: 13px;             /* Compact */
--font-size-sm: 11px;
--font-size-xs: 10px;
--line-height-normal: 1.4;
--line-height-tight: 1.25;

--space-section: 16px;
--space-component: 8px;
--space-element: 4px;

--table-row-height: 32px;
--table-header-height: 36px;
--input-height: 28px;
--button-height: 28px;

--radius-sm: 3px;
--radius-md: 4px;
--radius-lg: 6px;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--border-color: rgba(240,246,252,0.1);
```

**Key rules:**
- Dark mode default — reduces eye strain during 8+ hour sessions
- Right-align all numbers in tables (monospace font)
- Zebra striping (alternating row backgrounds) for wide tables
- Sticky headers and columns for scrollable data
- Dense padding (4-8px internal, 8-12px between components)
- Chart colors must be colorblind-safe (test with protanopia/deuteranopia)
- Real-time updates: flash or highlight changed values briefly

---

## 6. Maximalist

**Philosophy:** More is more. Fill the space with energy, personality, and visual richness. Make an impression.

**Exemplars:** Gucci digital, Awwwards winners, gaming UIs, festival/event sites

**Characteristics:**
- <20% whitespace — surfaces are filled
- Bold, clashing colors with high saturation
- Multiple fonts, decorative type, variable sizes
- Layered textures, patterns, imagery
- Complex animations and transitions
- Immersive, story-driven experience

```css
/* MAXIMALIST TOKENS */
--color-primary: #FF003C;           /* Electric red */
--color-secondary: #FFD700;          /* Gold */
--color-tertiary: #00E5FF;           /* Cyan */
--color-bg-1: #0A0A0A;
--color-bg-2: #1A0A2E;              /* Deep purple */
--color-bg-3: #2D0A4E;
--color-text: #FFFFFF;
--color-text-accent: #FFD700;

--font-family-display: 'Playfair Display', 'Cormorant Garamond', serif;
--font-family-body: 'Space Grotesk', 'Work Sans', sans-serif;
--font-family-accent: 'Major Mono Display', monospace;
--font-size-hero: 120px;            /* Extreme */
--font-size-base: 18px;
--line-height-normal: 1.6;
--letter-spacing-hero: -0.04em;

--space-section: 40px;              /* Less whitespace */
--space-component: 16px;

--radius-none: 0;                   /* Mix sharp and round */
--radius-full: 9999px;

--shadow-neon: 0 0 30px rgba(255,0,60,0.5);
--shadow-glow: 0 0 60px rgba(0,229,255,0.3);

--gradient-hero: linear-gradient(135deg, #0A0A0A 0%, #1A0A2E 50%, #2D0A4E 100%);
--texture-noise: url('data:image/svg+xml,...'); /* Noise overlay */

--transition-dramatic: 600ms cubic-bezier(0.22, 1, 0.36, 1);
```

**Key rules:**
- Visual hierarchy is CRITICAL — without it, maximalism becomes chaos
- Even in maximalism, one element per section should be the clear focal point
- Use layering: background texture → mid-ground pattern → foreground content
- Typography as art: oversized, cropped, overlapping headlines are valid
- Performance budget: test on low-end devices; complex visuals must still render smoothly
- Accessibility is still required: ensure text contrast ratios, keyboard navigation, reduced-motion support
- The goal is controlled excess, not random noise

---

## Dark Mode Adaptation

Regardless of style, apply these rules when creating dark variants:

1. **Background:** Use dark gray (#121212 to #1E1E1E), not pure black (#000000)
2. **Elevation:** Lighter surfaces = higher elevation (opposite of light mode shadows)
3. **Saturation:** Reduce color saturation by 10-20% to prevent visual vibration
4. **Contrast:** Maintain WCAG ratios; test specifically in dark mode
5. **Borders:** Often lighter/more visible in dark mode since shadows are less effective
6. **Images:** Consider adding slight vignette or reducing brightness on user photos
7. **Semantic colors:** Lighten slightly for readability on dark backgrounds
   - Error: #DC2626 → #F87171
   - Success: #059669 → #34D399
   - Warning: #D97706 → #FBBF24

```css
/* Dark mode surface elevation scale */
--surface-0: #121212;    /* Base */
--surface-1: #1E1E1E;    /* +1 elevation (cards) */
--surface-2: #252525;    /* +2 elevation (dialogs) */
--surface-3: #2C2C2C;    /* +3 elevation (menus) */
--surface-4: #333333;    /* +4 elevation (tooltips) */
```
