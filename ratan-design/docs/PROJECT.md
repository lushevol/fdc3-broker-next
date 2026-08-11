# ratan-design — Project Overview

> Parent: [Monorepo AGENTS.md](../../AGENTS.md) · Onboarding: [NEW-JOINER.md](NEW-JOINER.md)

## Type

Nested npm-workspaces monorepo (`apps/*`, `packages/*`) that builds exactly one public package: `@fm/ratan-design`.

## Purpose

Ratan Design v2 is the **React-native successor to SC WebKit** for independently deployed portal applications. It reproduces the frozen `@scdevkit/webkit@2.0.5` design contract (tokens, component variants, states, themes, typography modes, and intended interaction behavior) without Web Components, Lit, Shoelace, or untyped wrappers — while removing the need for a design-system provider, shell runtime, or mandatory telemetry.

**Design authority:** `@scdevkit/webkit@2.0.5` pinned at repository commit `a8398ea6df30e4843e22fcb5a1d3343107463c60` (one-time snapshot, not continuously mirrored).

**Governing plan:** [`ratan-design/plan.md`](../plan.md) is the authoritative steering document. [`ratan-design/decisions/foundation-approval.md`](../decisions/foundation-approval.md) records the approved foundation gate.

## Status

`2.0.0-alpha.0` — foundation approved, **proof cohort** shipped (Button, TextInput, Dialog, DatePicker, Tabs, DataGrid) with full parity baseline, frozen styles/tokens, and parity-lab evidence. Stable `2.0.0` is gated on complete catalogue parity (113 of 136 WebKit exports in scope, per `manifests/parity-manifest.json`).

## Key Features

- **One public package, many tree-shakable subpaths** — root barrel plus `/button`, `/dialog`, `/date-picker`, `/data-grid`, `/tabs`, `/text-input`, `/tokens`, `/testing`, CSS subpaths, and machine-readable manifests. DataGrid is isolated behind its subpath and never re-exported from the root.
- **React Aria foundation** — interactive behavior built on React Aria Components/hooks (private); Ratan owns all public names, props, and semantics. Hand-rolled interaction primitives require a written exception (`packages/foundation/exceptions/`).
- **Exact `--sc-*` token contract** — frozen WebKit CSS assets copied verbatim (`packages/react/src/styles/frozen/`); no replacement token namespace.
- **Static, isolated CSS** — CSS Modules + cascade layers + stable `data-*` attributes; no CSS-in-JS runtime.
- **Provider-free runtime model** — no provider, no singleton; themes are document-global, overlays portal to `document.body`.
- **DataGrid parity** — TanStack Table + TanStack Virtual behind a Ratan-owned public contract.
- **Parity evidence** — `apps/parity-lab` captures WebKit-vs-Ratan runtime observations, fixtures, screenshots (Playwright + pixelmatch), and performance benchmarks.
- **Machine-readable manifests** — `parity-manifest.json`, `migration-map.json`, `deviations.json` drive completeness checks, migration codemods, and docs.

## Quick Start

```bash
npm install                 # from repo root (npm workspaces install everything)
npm run ratan:build         # turbo build for ratan-design/** workspaces
npm run ratan:test          # turbo test
npm run ratan:lint          # turbo lint
npm run ratan:typecheck     # turbo typecheck
npm run ratan:verify:boundaries   # package-boundary enforcement
npm run ratan:verify:interactions # React Aria mandatory-foundation enforcement
```

Or from inside `ratan-design/`:

```bash
npm run build               # turbo build (all workspaces)
npm run verify:foundation   # boundaries + interactions + tests + docs/storybook/playground/parity-lab
npm run docs                # turbo docs
```

### Typical consumer usage

```tsx
import { Button } from '@fm/ratan-design/button';
import '@fm/ratan-design/styles.css';

<Button variant="primary" tone="default" size="sm">Confirm</Button>;
```

No provider required. React 18.2–19 are peer dependencies; `@fm/ratan-design` is bundled with each application.

## Workspace Layout

| Path | Role | Public? |
|---|---|---|
| `packages/react` | **`@fm/ratan-design`** — the only published package (tsup build + static asset copy) | Yes |
| `packages/components` | Proof-cohort component sources | Private |
| `packages/data-grid` | DataGrid implementation (TanStack Table + Virtual) | Private |
| `packages/foundation` | React Aria adapter layer, `useControllableState`, press-event contract | Private |
| `packages/tokens` | `--sc-*` token metadata | Private |
| `packages/styles` | Scoped component CSS | Private |
| `packages/icons` | Frozen built-in icon libraries | Private |
| `packages/patterns` | Shared compositions (post-parity) | Private |
| `packages/testing` | Consumer-facing test helpers (fixtures, keyboard, overlays, forms) | Private |
| `packages/vitest` | Shared Vitest config + axe-based accessibility assertions | Private |
| `packages/standard` | Lint/boundary standard | Private |
| `packages/storybook` | Storybook workbench (port 6006, a11y + docs addons) | Private |
| `apps/docs` | Durable docs app: per-component pages with Purpose/Guidance/API/Tokens/WebKit mapping/Deviations | Private |
| `apps/playground` | Realistic MFE/integration scenarios + packed-consumer verification | Private |
| `apps/parity-lab` | Frozen WebKit-vs-Ratan evidence, fixtures, benchmarks | Private |
| `manifests/` | `parity-manifest.json`, `migration-map.json`, `deviations.json` | — |
| `migration/` | Codemods, MUI/AntD/legacy-Ratan/WebKit mappings, playbook | — |
| `tooling/` | Release verification (`verify-workspace-boundaries.mjs`, `verify-interaction-foundation.mjs`) | — |
| `decisions/` | ADR-style governance records | — |

## Package Version

`@fm/ratan-design` — `2.0.0-alpha.0` (private registry, `publishConfig.tag: next`; stable `2.0.0` pending full catalogue parity).

## Key Documents

- [`plan.md`](../plan.md) — full parity architecture + implementation plan (authoritative)
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — build, package, styling, and test architecture
- [`docs/RULES.md`](RULES.md) — contribution and development conventions
- [`docs/NEW-JOINER.md`](NEW-JOINER.md) — 30-minute onboarding walkthrough
