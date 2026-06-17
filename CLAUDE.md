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
pnpm test       # run all *.test.ts via node:test (Node strips TS types natively)
```

Node >= 22.12.0 is required — tests rely on Node running `.ts` files directly, so
no separate test runner or transpile step is configured.

Run a single test file or filter by name:

```bash
node --test src/lib/scoring.test.ts                       # one file
node --test --test-name-pattern="marcador exacto" "src/**/*.test.ts"  # by name
```

## Architecture

Astro 6 with strict TypeScript (`astro/tsconfigs/strict`). No framework integrations are configured yet — all current components are plain `.astro` files.

- `src/pages/` — file-based routing; each `.astro` file becomes a route
- `src/layouts/` — shared HTML shell wrappers (slot-based)
- `src/components/` — reusable `.astro` components
- `src/assets/` — static assets imported directly in components (Astro handles optimization)
- `public/` — files served verbatim at the root (favicons, etc.)
- `astro.config.mjs` — Astro config (currently empty `defineConfig({})`)

Layouts use `<slot />` to inject page content. Pages import the layout and wrap their content in it — see `src/pages/index.astro` for the pattern.

`tsconfig.json` enables `allowImportingTsExtensions`, so cross-module imports use
explicit `.ts` extensions (e.g. `import { scorePrediction } from './scoring.ts'`).
Follow that convention in new code.

### Domain model & scoring

The betting-pool logic lives outside the Astro layer and is framework-agnostic
(plain TS + `node:test`). Domain language is Spanish; keep it that way.

- `src/data/matches.ts` — the 72 group-stage `Match` records (2026 World Cup),
  each with a nullable `result: Score | null`. A `null` result means "not played
  yet" and is the single source of truth for which matches are scored.
- `src/data/participants.ts` — `Participant[]`, each with 72 `Prediction`s.
  **Generated data** extracted from `src/data/Prueba.xlsx` (sheet "Polla -
  Grupos"); treat it as data, not hand-authored code.
- `src/lib/scoring.ts` — pure scoring functions, the core of the app:
  - `scorePrediction(predHome, predAway, realHome, realAway)` → points for one
    prediction. Rules: **exact score = 5**; otherwise **+2** for the right outcome
    (winner/draw by goal-difference sign) **and +1** if either team's goal count
    matches (independent, so totals of 0/1/2/3 are possible).
  - `buildStandings(matches, participants)` → `StandingRow[]` sorted by `total`
    desc. Only matches with a non-null `result` are counted; ties keep
    registration order (relies on JS stable sort).

These functions deliberately fix bugs present in the original Excel — see the
doc comments in `scoring.ts` before changing scoring behavior, and update
`src/lib/scoring.test.ts` alongside any rule change.
