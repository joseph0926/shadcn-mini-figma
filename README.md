# shadcn-mini-figma

shadcn-mini-figma is a web-based visual editor for building realistic UI prototypes by dragging and arranging shadcn/ui components. It is designed for non-developers who need to communicate ideas quickly without writing code.

## Overview

- Build a prototype by dragging components onto a canvas.
- Edit basic properties to match your idea.
- Focus on speed and clarity over complex design tooling.

## Who it is for

- PMs and planners who need to show UI flows quickly.
- Designers (junior or non-designers) who want a fast starting point.
- Non-technical founders who need a prototype for validation.

## MVP scope

**Included**

- Add components from a palette to the canvas.
- Select components on the canvas.
- Move components to reposition them.

**Not included (MVP)**

- Resize, rotate, snapping, alignment guides.
- Collaboration, version history, cloud storage.

## Repository structure

- `apps/web` — Next.js app (landing + editor)
- `packages/editor-core` — framework-agnostic core (schema/state/commands)
- `packages/editor-react` — React renderer

## Tech stack (current)

- Next.js 16 (App Router), React 19
- pnpm workspaces + Turborepo

## License

MIT
