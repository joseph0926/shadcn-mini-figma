# shadcn-mini-figma

A web-based visual editor for building UI prototypes by dragging and arranging shadcn/ui components. Designed for non-developers who need to communicate ideas quickly without writing code.

## Features

- Drag components from a palette onto a canvas
- Select and move components freely
- 3-panel layout: Palette, Canvas, Properties
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

## MVP Scope

**Included**

- Add components from palette to canvas
- Select components on canvas
- Move components to reposition
- 3 component types: Button, Card, Input

**Not included (planned for v1.1)**

- Resize, rotate, snapping, alignment guides
- Property editing
- Local storage, image export
- Collaboration, version history

## License

MIT
