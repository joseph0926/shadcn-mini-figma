# shadcn-mini-figma

A web-based visual editor for building UI prototypes using shadcn/ui components. Designed for non-developers who need to communicate ideas quickly without writing code.

## Features

- Drag components from a palette onto a canvas
- Select, move, and resize components
- Edit properties via the Properties Panel
- Undo/Redo support
- Delete and duplicate nodes
- Smooth animations powered by Motion
- Real-time drag preview

## Who is it for

- PMs and planners who need to show UI flows quickly
- Designers who want a fast starting point
- Non-technical founders who need a prototype for validation

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000/editor

## Repository Structure

```
apps/web                 # Next.js app (landing + editor)
packages/editor-core     # Framework-agnostic core (schema/state/commands)
packages/editor-react    # React renderer with dnd-kit and motion
```

## Tech Stack

- Next.js 16 (App Router), React 19
- pnpm workspaces + Turborepo
- @dnd-kit/core for drag-and-drop
- Motion for animations
- shadcn/ui components
- Tailwind CSS v4

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Delete / Backspace | Delete selected node |
| Ctrl+D (Cmd+D) | Duplicate selected node |
| Ctrl+Z (Cmd+Z) | Undo |
| Ctrl+Shift+Z (Cmd+Shift+Z) | Redo |

## Current Scope

**Implemented**

- Add components from palette to canvas
- Select and move components
- Resize via drag handles
- Edit position, size, and props in Properties Panel
- Delete and duplicate nodes
- Undo/Redo
- 3 component types: Button, Card, Input

**Planned**

- Additional component types (Text, Container, Image, etc.)
- Local storage persistence
- Image export
- Templates

## License

MIT
