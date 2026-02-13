# Visual Design: Canvas-Based Applications

Canvas apps include design tools (Figma, Miro), map viewers, data visualization, diagramming, game UIs, photo/video editors, and any application where users directly manipulate objects on an infinite or bounded plane.

## Key Characteristics

- **Performance is paramount** — target 60fps for all interactions
- **Direct manipulation** — click, drag, resize, rotate, draw
- **Infinite canvas** — pan and zoom through large workspaces
- **Multi-selection** — operate on groups of objects simultaneously
- **Precision** — pixel-accurate placement, alignment, snapping
- **Layered rendering** — z-order, groups, locked layers

## Visual Design Principles for Canvas UIs

### Chrome vs. Canvas

The UI splits into two zones with fundamentally different rules:

| Zone | Role | Design Approach |
|------|------|----------------|
| **Chrome** (toolbars, panels, menus) | Controls and properties | Standard UI design — consistent, predictable, compact |
| **Canvas** (the workspace) | User content and objects | Minimal, unobtrusive — let content breathe |

**Chrome should be invisible.** Users focus on the canvas. Chrome recedes:
- Use muted, neutral colors for chrome (dark gray or light gray depending on theme)
- Reserve saturated colors for canvas content and active states
- Collapsible panels — let users maximize canvas space
- Translucent overlays over opaque sidebars when possible

### Selection & Focus States

Objects on canvas need clear, consistent states:

```
Default:      No outline, natural appearance
Hover:        Subtle outline or highlight (1px, low opacity)
Selected:     Strong outline (2px, primary color) + resize handles
Multi-select: Selection outline + shared bounding box
Dragging:     Slight opacity reduction (0.8) + drop shadow
Locked:       Dimmed + lock icon, no resize handles
Hidden:       Not rendered (or ghosted at 0.15 opacity in edit mode)
```

**Resize handles:** Small squares at corners + midpoints of bounding box. Color matches selection outline. Cursor changes to indicate resize direction.

**Rotation handle:** Connected to top-center of bounding box by a short line. Circular or curved arrow handle.

### Cursor Design

Cursor shape communicates available interaction before the user acts:

| Cursor | Meaning |
|--------|---------|
| Default arrow | No special interaction |
| Crosshair (+) | Place / create / draw |
| Grab hand (open) | Ready to pan |
| Grabbing hand (closed) | Actively panning |
| Move (four arrows) | Repositioning an object |
| Resize (diagonal/edge) | Resizing object in that direction |
| Rotate (curved arrow) | Rotating object |
| Text cursor (I-beam) | Editing text |
| Eyedropper | Sampling color |
| Zoom in/out (+/-) | Zoom interaction |

### Zoom & Pan

- **Zoom levels:** Typically 10% to 3200%, with 100% as actual size
- **Zoom indicator:** Small, non-intrusive display (corner or status bar)
- **Smooth zoom:** Animate between levels (200-300ms ease-out)
- **Zoom to cursor:** Zoom should center on the mouse position
- **Minimap:** Optional overview panel showing viewport position within full canvas
- **Fit to content:** One-click zoom to show all objects

### Snapping & Alignment

Visual guides that appear during object manipulation:

- **Grid snap:** Objects lock to grid positions (toggleable)
- **Smart guides:** Appear when edges/centers align with other objects
  - Magenta/pink lines are the convention for alignment guides
  - Show distance measurements between aligned objects
- **Snap to pixel:** For precision work, snap to whole pixels
- **Distribution guides:** Show when objects are evenly spaced

### Toolbar & Panel Layout

Common canvas app layout pattern:

```
┌──────────────────────────────────────────────────────┐
│ ≡  File  Edit  View  [Tool Toolbar]          Zoom: 100% │  ← Top bar
├────┬─────────────────────────────────────────┬───────┤
│    │                                         │       │
│ T  │                                         │  P    │
│ o  │           C A N V A S                   │  r    │
│ o  │                                         │  o    │
│ l  │         (infinite workspace)            │  p    │
│ s  │                                         │  s    │
│    │                                         │       │
├────┴─────────────────────────────────────────┴───────┤
│ [Status bar: selection info, coordinates, zoom]      │  ← Bottom bar
└──────────────────────────────────────────────────────┘

Tools panel (left):  40-56px wide, icon-only, vertical
Props panel (right): 240-320px wide, collapsible
Top bar:             40-48px height
Status bar:          24-32px height
```

### Color Picker

Canvas apps usually need a sophisticated color picker:
- HSB/HSL visual selector (square or circular)
- Eyedropper tool for sampling from canvas
- Opacity/alpha slider
- Hex/RGB/HSL input fields
- Recent colors palette
- Document/system color palette

## Data Visualization Canvas

For apps where the canvas displays data (charts, graphs, node editors):

### Node-Based Editors (Workflows, Pipelines)

- **Nodes:** Rounded rectangles with title bar, input/output ports
- **Connections:** Bezier curves between ports, colored by data type
- **Ports:** Small circles on node edges; connected = filled, available = outlined
- **Grouping:** Dashed boundary that encloses related nodes
- **Minimap:** Essential when graphs get complex

### Chart/Graph Canvas

- **Axis labels** in muted text; data in high-contrast
- **Gridlines** very subtle (0.1-0.2 opacity)
- **Interactive elements** (hover tooltips, click-to-drill-down) clearly signaled
- **Color coding** should be colorblind-safe (use shape + color, not color alone)

## Performance Considerations

Visual design choices that affect canvas performance:

| Faster | Slower |
|--------|--------|
| Solid colors | Gradients, blur effects |
| Simple borders | Box shadows (especially blurred) |
| Rectangular clips | Rounded corners on many elements |
| Flat rendering | Blend modes, transparency layers |
| Canvas/WebGL rendering | DOM-based rendering for many objects |
| Virtualization (render only visible) | Rendering all objects always |

**Rule:** Chrome can use full CSS styling. Canvas objects should use the simplest visual representation that maintains clarity, especially when hundreds or thousands of objects are visible.

## Canvas App Tokens (Starting Point)

```css
/* Canvas App — Dark Chrome, Neutral Canvas */
--chrome-bg: #1E1E1E;
--chrome-bg-elevated: #2D2D2D;
--chrome-border: #3E3E3E;
--chrome-text: #CCCCCC;
--chrome-text-muted: #808080;

--canvas-bg: #F5F5F5;             /* Light canvas (or #1A1A1A for dark) */
--canvas-grid: rgba(0,0,0,0.06);

--selection-color: #2680EB;        /* Blue selection */
--selection-bg: rgba(38,128,235,0.1);
--smart-guide: #FF00FF;            /* Magenta alignment guides */
--snap-point: #2680EB;

--handle-size: 8px;
--handle-border: 2px;
--toolbar-width: 48px;
--panel-width: 280px;
--status-height: 28px;

--z-chrome: 100;
--z-overlay: 200;
--z-modal: 300;
--z-tooltip: 400;
```
