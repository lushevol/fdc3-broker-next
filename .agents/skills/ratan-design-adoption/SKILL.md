---
name: ratan-design-adoption
description: Adopt or migrate shared UI from SCB Base into ratan-design-origin while preserving existing @fm/base contracts in mfe-base-origin, mfe-ratan-container-origin, and mfe-cashflow-blotter-origin. Use when extracting a reusable component, rewiring Base adapters, updating downstream compatibility bridges, or validating a transparent design-package upgrade.
---

# Ratan Design Adoption

Centralize reusable presentation in `scb-next/packages/ratan-design-origin` without requiring downstream feature code to change. Treat the current worktree as ground truth because the package and its migration inventory evolve together.

## Load the current contract

1. Read `scb-next/docs/UI_PACKAGE_INVENTORY.md` and `scb-next/packages/ratan-design-origin/README.md`.
2. Inspect the package's `package.json`, `src/index.ts`, and the entry point relevant to the requested surface.
3. Inspect the target application's manifest, existing component or `src/compat/base.tsx`, theme provider, Vite/Vitest configuration, and contract tests before editing.
4. Read `scb-next/docs/UI_PACKAGE_IMPLEMENTATION.md` only for evidence about an existing migrated surface. Read `scb-next/docs/UI_PACKAGE_RELEASE.md` for versioning, publication, rollout, or rollback work.
5. Follow the repository `AGENTS.md` GitNexus impact and change-detection requirements before modifying existing symbols or committing.

Do not infer a contract from component names. Record the import shape, default and named exports, TypeScript props, default values, callback arguments, refs, DOM attributes, selectors, test IDs, portal behavior, and theme behavior that the consumer actually relies on.

## Choose the migration boundary

Classify the work before changing code:

- **Already public:** adopt the existing package export through a host adapter. Do not create a second package component.
- **Reusable presentation:** move the generic rendering, styling, and presentation state into the package. Keep routing, stores, services, FDC3, authentication, analytics, persistence, and browser policy in the host.
- **Consumer policy:** retain it in the application or compatibility adapter and pass explicit inputs to the package.
- **Portal-only UI:** leave it in Base when the inventory identifies it as shell navigation, workspace orchestration, survey, timeout, version, custom-element, or feature-specific behavior.

Use the narrowest public entry point:

| Surface | Import entry |
| --- | --- |
| Core controls, feedback, loaders, search, and builder presentation | `ratan-design-origin` |
| Community date and time pickers | `ratan-design-origin/dates` |
| Pro date-range picker | `ratan-design-origin/date-range` |
| Historical portal theme helpers | `ratan-design-origin/portal-theme` |
| Base-only legacy classes and styled adapters | `ratan-design-origin/compatibility` |
| Explicit global styles | `ratan-design-origin/styles.css` |

Keep MUI X and its license out of the core entry. Treat `compatibility` as a migration boundary rather than a new customization API. SC WebKit tokens are the long-term design source; preserve legacy visuals and behavior until the owning consumer deliberately switches its explicit design generation.

## Capture behavior first

Add or update a focused contract test before changing an existing surface. Make the test prove the behavior that lets consumer source remain untouched, including relevant legacy quirks. Prefer the public package API or the compatibility bridge over implementation details.

For a new public package export, include:

- the implementation and TypeScript declaration through the appropriate entry point;
- a package-level public API or behavior test;
- a Storybook story that exercises meaningful states;
- a fixture or host evidence when portal rendering, styles, theme propagation, or optional peer dependencies matter;
- inventory and README updates that describe the final ownership and imports.

Keep package code independent of application source, application aliases, stores, routers, network services, and host-owned browser registration.

## Preserve Base contracts

In `mfe-base-origin`, turn the old component path into a thin adapter or re-export after the package behavior exists. Preserve the root `@fm/base` namespace, old named/default export shape, public prop types, refs, DOM semantics, selectors, and callback behavior.

Keep `MfeThemeProvider` and application mode selection in Base. Translate host state into explicit `RatanDesignProvider` inputs. Do not let the shared provider read authentication state, storage, URL parameters, document globals, or application stores.

Place typo-compatible class names and other Base-only styling hooks in the compatibility entry when removal would break existing consumers. Document them as transitional behavior.

## Adopt in downstream applications

For `mfe-ratan-container-origin` and `mfe-cashflow-blotter-origin`, keep feature imports from `@fm/base` unchanged when transparent adoption is requested. Adapt only the local `src/compat/base.tsx` bridge and its captured tests.

Preserve the object and module shapes already supplied by the bridge, such as `{ default: CompatibilityButton }`. Map package props to legacy expectations in the adapter. Existing examples include the legacy `type="primary"` button mapping, the 16-pixel loading indicator and start-icon behavior, default-open dialog behavior, portal placement, sizing, and the loader namespace.

Retain non-UI services and platform bridges in `src/compat/base.tsx`; they are not design-package candidates. Keep each application's `MfeThemeProvider` local because it also coordinates app state and other UI systems. Preserve deliberate theme differences between Ratan Container and Cashflow Blotter.

When the consumer directly installs the package:

1. Add `ratan-design-origin` through the repository workspace/file dependency convention.
2. Verify compatible React 18, MUI 5, Emotion, and optional MUI X peer versions.
3. Dedupe React, ReactDOM, MUI material/icons/system, and Emotion in Vite and Vitest.
4. Include `ratan-design-origin`, MUI, and Emotion in Vitest `ssr.noExternal` when the current test setup requires source transformation.
5. Keep the existing federation sharing policy unless a separate architecture change explicitly requires it.

## Verify the adoption

Run the smallest focused test while iterating, then complete the affected gates. From `scb-next`, the package gates are:

```bash
npm run test --workspace ratan-design-origin -- --maxWorkers=2
npm run typecheck --workspace ratan-design-origin
npm run lint --workspace ratan-design-origin
npm run build:packages
npm run build:storybook --workspace ratan-design-origin
npm run verify:package --workspace ratan-design-origin
npm run verify:dependency-isolation
```

For each affected application, run its contract test, typecheck when the workspace defines one, and build. Cashflow Blotter currently has no active `typecheck` script, so use its build and focused Vitest coverage rather than inventing a gate.

Run `npm exec -- playwright test tests/e2e/design-origin-host.spec.ts` for cross-host behavior. For shell-facing changes, also verify the repository UI journey at `http://localhost:8001`: log in, open **New Tile**, launch a tile, and remove its workspace tab.

Before committing:

- compare the consumer-facing exports and captured behavior with the pre-migration contract;
- confirm feature screens did not need source changes unless the request explicitly changes their API;
- run GitNexus `detect_changes()` against the intended scope;
- update the inventory and release notes when ownership, entry points, peer dependencies, or rollout guidance changed;
- commit only this completed migration stage and exclude unrelated worktree changes.

The adoption is complete when package ownership is explicit, all compatibility adapters preserve their prior public contracts, package and affected-app gates pass, cross-host behavior is verified where applicable, and the documentation matches the shipped entry points.
