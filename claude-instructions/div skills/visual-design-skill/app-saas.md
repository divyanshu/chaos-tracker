# Visual Design: SaaS & Enterprise Apps (B2B)

SaaS apps are tools people use for hours daily. Efficiency, clarity, and consistency matter more than delight. Users value trust, predictability, and information density.

## Key Characteristics

- **Information density is higher** — power users need data-at-a-glance
- **Efficiency over flair** — keyboard shortcuts, dense layouts, minimal clicks
- **Consistency across depth** — deep navigation hierarchies need uniform patterns
- **Design system is essential** — large teams need shared components
- **Desktop-optimized** — responsive, but primary use is widescreen

## Color Guidelines

SaaS palettes are restrained, using color strategically rather than expressively.

**Palette structure:**
- **Neutral-dominant** — 80%+ of the interface is neutral (grays, whites)
- **One primary accent** — for primary actions, active states, brand presence
- **Semantic colors carry load** — status, alerts, and data rely heavily on red/green/yellow/blue
- **Muted backgrounds** — off-white (#F9FAFB to #F3F4F6) rather than pure white
- **Avoid saturated backgrounds** — reserve saturation for small interactive elements

**Common SaaS accent colors and what they signal:**
| Color | Signal | Used By |
|-------|--------|---------|
| Blue (#2563EB range) | Trust, professionalism, reliability | Salesforce, Jira, Figma |
| Purple (#7C3AED range) | Innovation, premium, creative | Linear, Notion, Stripe |
| Green (#059669 range) | Growth, money, positive | Shopify, QuickBooks |
| Orange (#EA580C range) | Energy, action, warmth | HubSpot, Cloudflare |
| Indigo (#4F46E5 range) | Depth, intelligence | Vercel, Tailwind |

## Typography

- **System fonts or clean sans-serif** — Inter, SF Pro, Segoe UI are all appropriate here
- **Smaller body sizes acceptable** — 14px is common for dense data interfaces
- **Monospace for data** — numbers, codes, IDs in monospace for alignment and scannability
- **Strong weight hierarchy** — use semibold/bold sparingly but consistently for labels, section heads
- **Compact line height** — 1.4-1.5× for body; 1.25× for table rows and dense content

**Type scale for SaaS (Major Third — 1.250 ratio, base 14px):**
```
Caption:  12px
Body-sm:  13px
Body:     14px
Body-lg:  16px
Heading4: 18px
Heading3: 20px
Heading2: 24px
Heading1: 30px
Display:  36px
```

## Layout

- **Sidebar navigation** — standard for SaaS; collapsible to icons on smaller screens
- **12-column grid** — with 24px gutters, 32px margins
- **Content max-width** — prose content capped at 720px; tables/data can go wider
- **Data tables** — the workhorse component; invest heavily in table design:
  - Sticky headers, sortable columns, alternating row tones
  - Aligned numbers (right-align, monospace)
  - Row actions on hover, bulk selection
- **Split views** — list + detail panel is the dominant pattern for resource management
- **Modal discipline** — use modals sparingly; prefer inline editing and slide-over panels

**Spacing for dense UIs:**
```
Table row height:   40-48px
Form field height:  36-40px
Button height:      32-40px
Card padding:       16-24px
Section spacing:    24-32px
Page padding:       24-32px
Sidebar width:      240-280px (expanded), 64px (collapsed)
```

## Specific SaaS Patterns

### Empty States
Don't show a blank table. Empty states should:
- Explain what will appear here
- Provide the primary action to populate it
- Include a helpful illustration (optional but effective)

### Navigation Hierarchy
```
L1: Sidebar (product areas)
  L2: Sub-navigation or tabs (sections within area)
    L3: Page content (tables, forms, detail views)
      L4: Modals / slide-overs (focused tasks)
```

### Status & Badges
Standardize status indicators across the entire product:
```
Active/Online:   ● green dot + "Active"
Pending:         ◐ yellow dot + "Pending"
Error/Failed:    ● red dot + "Failed"
Inactive/Off:    ○ gray dot + "Inactive"
```

### Command Palette (⌘K)
Increasingly standard in SaaS — provides keyboard-first navigation, search across all entities, and quick actions. Design it as a centered modal with search input, categorized results, and keyboard navigation.

## SaaS App Tokens (Starting Point)

```css
/* SaaS — Professional, Efficient Style */
--color-primary-500: #2563EB;      /* Trustworthy blue */
--color-primary-50: #EFF6FF;
--color-primary-900: #1E3A5F;
--color-neutral-0: #FFFFFF;
--color-neutral-50: #F9FAFB;
--color-neutral-100: #F3F4F6;
--color-neutral-200: #E5E7EB;
--color-neutral-300: #D1D5DB;
--color-neutral-400: #9CA3AF;
--color-neutral-500: #6B7280;
--color-neutral-600: #4B5563;
--color-neutral-700: #374151;
--color-neutral-800: #1F2937;
--color-neutral-900: #111827;

--color-error: #DC2626;
--color-success: #059669;
--color-warning: #D97706;
--color-info: #2563EB;

--font-family-body: 'Inter', -apple-system, system-ui, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
--font-size-base: 14px;
--line-height-normal: 1.5;

--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);

--sidebar-width: 256px;
--sidebar-collapsed: 64px;
--header-height: 56px;
```
