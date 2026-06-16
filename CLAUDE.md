# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`polla_mundialista` — a World Cup betting pool web app built with Astro 6.

## Commands

```bash
pnpm dev        # start dev server (localhost:4321)
pnpm build      # production build → dist/
pnpm preview    # serve the built dist/
pnpm astro      # run any astro CLI command
```

Node >= 22.12.0 is required.

## Architecture

Astro 6 with strict TypeScript (`astro/tsconfigs/strict`). No framework integrations are configured yet — all current components are plain `.astro` files.

- `src/pages/` — file-based routing; each `.astro` file becomes a route
- `src/layouts/` — shared HTML shell wrappers (slot-based)
- `src/components/` — reusable `.astro` components
- `src/assets/` — static assets imported directly in components (Astro handles optimization)
- `public/` — files served verbatim at the root (favicons, etc.)
- `astro.config.mjs` — Astro config (currently empty `defineConfig({})`)

Layouts use `<slot />` to inject page content. Pages import the layout and wrap their content in it — see `src/pages/index.astro` for the pattern.
