# shadcn-mini-figma

A web-based visual editor for building UI prototypes using shadcn/ui components. Designed for non-developers who need to communicate ideas quickly without writing code.

## Features

- Drag components from a palette onto a canvas
- Select, move, and resize components via 8-direction handles
- Multi-selection with Shift/Cmd/Ctrl+Click
- Alignment tools (left, center, right, top, middle, bottom)
- Layers panel with visibility toggle
- Edit position, size, and props in Properties Panel
- Configure component variants (Button: variant/size, Card: title/description, Input: placeholder)
- Color customization (text, background, border) with Tailwind color palette
- Undo/Redo with keyboard shortcuts
- Delete and duplicate nodes (supports multi-selection)
- Canvas zoom (25% - 400%)
- Dark/Light mode toggle
- Export canvas as PNG image
- Save/Load designs as JSON files
- Smooth animations powered by Motion

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000/editor

## Repository Structure

```
apps/web                 # Next.js app (landing + editor)
packages/editor-core     # Framework-agnostic core (schema/state/commands/alignment)
packages/editor-react    # React renderer with dnd-kit and motion
```

## Tech Stack

- Next.js 16 (App Router), React 19
- pnpm workspaces + Turborepo
- @dnd-kit/core for drag-and-drop
- Motion for animations
- shadcn/ui components
- Tailwind CSS v4
- html-to-image for PNG export
- next-themes for dark mode

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Delete / Backspace | Delete selected node(s) |
| Ctrl+D (Cmd+D) | Duplicate selected node(s) |
| Ctrl+A (Cmd+A) | Select all nodes |
| Escape | Clear selection |
| Ctrl+Z (Cmd+Z) | Undo |
| Ctrl+Shift+Z (Cmd+Shift+Z) | Redo |

## Current Scope

**Implemented**

- Add components from palette to canvas (Button, Card, Input)
- Select and move components
- Multi-selection (Shift/Cmd/Ctrl+Click)
- Alignment and distribution tools
- Layers panel with visibility toggle (Eye button)
- Resize via 8-direction drag handles
- Edit position, size, and props in Properties Panel
- Configure component variants via Select dropdowns
- Color customization (text, background, border colors)
- Delete and duplicate nodes (single and multi)
- Undo/Redo
- Canvas zoom in/out with percentage display
- Dark/Light mode toggle
- PNG image export
- JSON save/load

**Planned**

- Additional component types (Text, Container, Image, etc.)
- Snap-to-grid and guidelines during drag
- Local storage auto-save
- Templates

## License

MIT
