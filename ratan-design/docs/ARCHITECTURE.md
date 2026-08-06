# ratan-design — Architecture

> Parent: [PROJECT.md](PROJECT.md) · Onboarding: [NEW-JOINER.md](NEW-JOINER.md)

## Governing Decisions (top 10)

1. **Parity over invention** — Ratan is a from-scratch React implementation of the frozen SC WebKit design, not a new visual language. The baseline snapshot at `@scdevkit/webkit@2.0.5` commit `a8398ea6df30e4843e22fcb5a1d3343107463c60` is the one-time authority; runtime observation outranks tests, Storybook, and docs.
2. **Token contract is frozen** — existing `--sc-*` names and resolved values are the permanent public contract. No `--pui-*` / `--ratan-*` replacements.
3. **One public package** — `packages/react` publishes as `@fm/ratan-design` with tree-shakable subpaths; all other workspaces are private build-time boundaries.
4. **No provider, no shared runtime** — no `@fm/ratan-design/runtime`, no singleton, no event bus. Theme/font modes are document-global; direction inherits from `dir`; locale defaults to browser; overlays portal to `document.body`.
5. **React Aria is mandatory** for interactive behavior when a primitive exists. Exceptions require an ADR + manifest rationale + keyboard/focus tests + owner approval (`packages/foundation/exceptions/interaction-exceptions.json`).
6. **DataGrid uses TanStack Table + TanStack Virtual** privately; Ratan owns the public column/filter/sort/selection/editing contract.
7. **Static CSS only** — exact `--sc-*` variables + CSS Modules + cascade layers + stable `data-*` attributes. No CSS-in-JS, no runtime style engine.
8. **Coexistence with WebKit** during migration — same tokens, different implementation classes; component CSS is scoped so neither overrides the other.
9. **Only `react`/`react-dom` are shared** federation singletons (`>=18.2.0 <20`). Ratan, React Aria, and TanStack are bundled per application.
10. **Telemetry is deferred** — core components emit ordinary React callbacks/native events only. Sections 19–28 of `plan.md` are non-normative design material.

## Package Structure

### `packages/react` — the public package

Build pipeline (`npm run build`):

```
generate            parity-lab baseline + button state CSS generation
  → tsup            ESM build; per-subpath entry points (button.ts, dialog.ts, ...)
  → copy-static     frozen styles, themes, modes, fonts, manifests into dist/
  → sbom            sbom.cdx.json (CycloneDX)
  → integrity       package-integrity.json (hash pinning)
  → verify          verify-package.mjs (prohibited deps, export shape, side effects)
```

**Subpath entries** each produce a `*-with-style.js` bundle (component + CSS side effect) plus `.d.ts`:

- `.` (root barrel), `/button`, `/dialog`, `/date-picker`, `/tabs`, `/text-input` — proof cohort
- `/data-grid` — heavy, isolated; never in the root barrel
- `/tokens` — immutable `--sc-*` metadata (JS only; CSS remains the rendering authority)
- `/testing` — consumer test helpers
- `/styles.css`, `/themes/{light,dark,cpbb}.css`, `/modes/{inter,roboto-mono,dyslexic}.css`
- `/parity-manifest.json`, `/migration-map.json`

`sideEffects: ["**/*.css"]` keeps CSS importable tree-shakably. The root barrel re-exports only button/date-picker/dialog/tabs/text-input.

### `packages/components` — component sources

Proof-cohort dirs: `button/`, `text-input/`, `dialog/`, `date-picker/`, `tabs/`, `data-grid/`. Each component ships:

- `*.tsx` — typed React component (`forwardRef`, controllable state, `RatanPressEvent`)
- `*.css` / `*-states.css` — scoped CSS Modules consuming `--sc-*` variables
- Contract tests in `packages/react/tests/*.contract.test.tsx` + style tests (`*.styles.test.ts`)

Example contract (Button): `variant` (primary/secondary/text/link), `tone` (default/error/alert/success), `size` (xxs/xs/sm/md/lg), `loading`/`loadingLabel`, `selectable`, `onPress`, icons, native attributes, forwarded ref. Legacy capabilities (`fill`, `inverse`, `iconButton`, `snack`, `pill`) are retained for parity with documented waivers.

### `packages/foundation` — behavior foundation

- Re-exports React Aria Components/hooks as `Aria*Adapter` (private names so Aria types never leak)
- `useControllableState` + `RatanChangeDetail` (`reason`: clear/dismiss/input/press/programmatic/reset/selection) — controlled/uncontrolled contract shared by all components
- `RatanPressEvent` — stable press callback detail
- `exceptions/` — interaction-exception manifest (empty until approved) + ADR template

### `packages/data-grid` — DataGrid implementation

TanStack `@tanstack/react-table` + `@tanstack/react-virtual` behind Ratan-owned state contract. `packages/react` bundles its output into the `/data-grid` subpath.

### `packages/tokens`, `packages/styles`, `packages/icons`, `packages/patterns`

Internal source boundaries; their approved outputs are bundled/copied into `@fm/ratan-design`. `patterns/` is reserved for shared compositions approved after parity.

### `packages/testing`, `packages/vitest`

- `testing` — `renderRatanFixture`, `createRatanUser`/`runKeyboardSequence`, `submitForm`/`resetForm`, `overlayQueries` (document-body overlay access)
- `vitest` — shared Vitest config (`@fm/ratan-design-vitest/config`) + `assertNoAxeViolations` (axe-core, color-contrast disabled by default for parity-lab reasons)

## Workbench Apps

### `apps/docs`

Static per-component pages under `content/proof/*.md`, each with the enforced sections `## Purpose / ## Guidance / ## API / ## Tokens / ## WebKit mapping / ## Deviations` (`scripts/verify-docs.mjs` fails the build if any is missing) plus compilable examples in `src/examples/proof.tsx`.

### `apps/parity-lab`

Evidence pipeline: `generate` (baseline from WebKit CEM), `capture` / `capture:proof` (Playwright runtime observations), `measure:proof` (performance), `verify:proof` (evidence verification), `check:drift` (baseline hash drift). Artifacts: `evidence/proof-cohort/`, `fixtures/{react,runtime,fixture-matrix.json}`, schemas under `schemas/`. Data precedent order: observed runtime > tests/source > application usage > storybook > documentation.

### `apps/playground`

Rsbuild app exercising real MFE consumption scenarios, WebKit coexistence, and — on build — **packed-package consumption** (`verify-packed-consumption.mjs` tests the built tarball as an external consumer would).

### `packages/storybook`

Storybook 10 (port 6006) with `addon-a11y` + `addon-docs`; exhaustive variants/states per component. Storybook is a workbench, **not** the design authority.

## Manifests & Governance

| File | Content |
|---|---|
| `manifests/parity-manifest.json` | 136 WebKit exports: 113 included, 19 supporting-only, 4 excluded; per-component prop/event/slot/method mapping, token deps, fixtures, deviations |
| `manifests/migration-map.json` | Legacy tag → React component/subpath/prop mappings (drives codemods + docs) |
| `manifests/deviations.json` | Approved deviations with rationale, approval reference, and linked tests (e.g. `button-loading-announcement`) |

Generated copies of these manifests ship inside `@fm/ratan-design` so consumers can introspect the contract.

## Testing Architecture

- **Vitest** everywhere (jsdom, coverage required in `packages/react` + `packages/data-grid`)
- Contract tests exercise the public API (props, events, a11y via axe); style tests assert frozen `--sc-*` consumption and CSS shape
- `tooling/release/verify-workspace-boundaries.mjs` — blocks imports across private package boundaries and prohibited deps (Lit/Shoelace/WebKit runtime in production package)
- `tooling/release/verify-interaction-foundation.mjs` — rejects hand-rolled press/focus/collection/selection/overlay/date/keyboard infrastructure unless in the exception manifest
- Packed-consumer + parity-lab proof tests run in `npm run verify:foundation`

## Build & Tooling Stack

- **Turbo** (nested `turbo.json`; root monorepo filters via `ratan:*` scripts using `--filter='./ratan-design/**'`)
- **tsup** for `packages/react`; `tsc` for private packages (strict, NodeNext, `noUncheckedIndexedAccess`)
- **Rsbuild** for playground; **Storybook 10** (webpack5) for stories
- Node >= 20; React 18.2–19 peers
