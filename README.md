# shadcn-mini-figma

A web-based visual editor for building UI prototypes using shadcn/ui components. Designed for non-developers who need to communicate ideas quickly without writing code.

## Features

- Drag components from a palette onto a canvas
- Components: Button, Card, Input, Text, Badge, Avatar, Separator
- Select, move, and resize components via 8-direction handles
- Multi-selection with Shift/Cmd/Ctrl+Click
- Copy/Paste/Cut with keyboard shortcuts
- Node locking (prevent move/resize/delete)
- Snap-to-grid with configurable grid size (8/16/32px)
- Alignment tools (left, center, right, top, middle, bottom)
- Layers panel with visibility and lock toggles
- Collapsible left/right panels
- Edit position, size, and props in Properties Panel
- Configure component variants (Button: variant/size, Card: title/description, Input: placeholder)
- Color customization (text, background, border) with Tailwind color palette
- Undo/Redo with keyboard shortcuts
- Delete and duplicate nodes (supports multi-selection)
- Canvas zoom (25% - 400%)
- Dark/Light mode toggle
- Export canvas as PNG image
- Save/Load designs as JSON files
- Onboarding tooltips for first-time users

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

| Shortcut                   | Action                     |
| -------------------------- | -------------------------- |
| Delete / Backspace         | Delete selected node(s)    |
| Ctrl+C (Cmd+C)             | Copy selected node(s)      |
| Ctrl+V (Cmd+V)             | Paste copied node(s)       |
| Ctrl+X (Cmd+X)             | Cut selected node(s)       |
| Ctrl+D (Cmd+D)             | Duplicate selected node(s) |
| Ctrl+A (Cmd+A)             | Select all nodes           |
| Escape                     | Clear selection            |
| Ctrl+Z (Cmd+Z)             | Undo                       |
| Ctrl+Shift+Z (Cmd+Shift+Z) | Redo                       |

## Planned

- Grouping nodes
- Local storage auto-save
- Templates

## License

MIT
