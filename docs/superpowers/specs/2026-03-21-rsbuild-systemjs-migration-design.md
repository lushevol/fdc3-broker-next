# Rsbuild SystemJS Migration Design

**Date:** 2026-03-21

**Scope:** `apps/base`, `apps/container`, `apps/tile`

**Goal:** Replace webpack entirely with the latest Rsbuild-compatible toolchain for the three legacy SystemJS microfrontends without changing the host-facing import-map contract, and verify that container and tile still load successfully through `root-config`.

## Context

The repository currently runs a mixed build strategy:

- `apps/base`, `apps/container`, and `apps/tile` use webpack with `webpack-config-single-spa-react-ts`.
- `apps/mf_container` and `apps/mf_tile` already use Rsbuild, but they follow a different runtime path and do not prove compatibility with the legacy SystemJS import-map flow.
- `apps/root-config` still serves the import maps that load the legacy applications by URL:
  - `@fm/base` -> `base.js`
  - `@fm/template_container` -> `template_container.js`
  - `@fm/template` -> `template.js`

The migration must therefore preserve the runtime contract visible to `root-config` while swapping the underlying builder to Rsbuild.

## Hard Constraints

- Migrate all three legacy webpack apps in one pass.
- Remove webpack from `apps/base`, `apps/container`, and `apps/tile`.
- Keep SystemJS mode.
- Keep the current import-map keys unchanged.
- Keep the current top-level entry filenames unchanged.
- Avoid host/runtime changes outside what is strictly required for verification.

## Non-Goals

- Migrating `apps/root-config` to Rsbuild.
- Converting the three apps to Module Federation or native ESM loading.
- Renaming packages, import-map entries, or public asset URLs.
- Performing unrelated refactors inside app business logic.

## Recommended Architecture

### 1. Builder replacement

Each of the three apps will replace `webpack.config.js` with an `rsbuild.config.ts` that reproduces the current runtime behavior:

- same dev-server port semantics via environment variables
- same asset base URL/public path semantics
- same externally visible entry filename
- equivalent chunk naming behavior where required
- equivalent environment-variable injection for `.env.local`, `.env.server`, and `.env.mfe`

Package scripts will move from `webpack serve` and `webpack --mode=production` to the Rsbuild equivalents.

### 2. Runtime contract preservation

The output must still be consumable by SystemJS using the existing import maps in `apps/root-config/public/importmap.json` and `apps/root-config/public/importmaplocal.json`.

Preserved contract:

- `@fm/base` resolves to `base.js`
- `@fm/template_container` resolves to `template_container.js`
- `@fm/template` resolves to `template.js`
- async chunks load from the same host/port origin as the entry file

No change is permitted to module names or host-facing URLs unless verification shows a hard technical blocker and a follow-up design review is done first.

### 3. Single-spa entry handling

`apps/base` already exposes explicit single-spa lifecycle exports from `src/root.tsx`. That entry should remain the canonical runtime boundary.

`apps/container` and `apps/tile` currently have very thin root entries. The migration must verify whether their current webpack setup implicitly supplies single-spa-compatible wrapping, or whether the Rsbuild migration must introduce explicit lifecycle modules so the host still mounts them correctly.

This is the highest-risk part of the migration and should be validated early in execution.

### 4. Asset and style compatibility

The migration must port any webpack-only loader behavior that affects runtime:

- `dotenv-webpack` usage
- LESS and CSS handling in `apps/container`
- banner/version injection in `apps/container`
- chunk path generation and asset prefixes

The goal is functional parity, not identical configuration structure.

## Approach Alternatives Considered

### Option A: Migrate only the three legacy apps and keep `root-config` unchanged

This is the recommended option because it contains risk to the in-scope apps while preserving the stable SystemJS host.

### Option B: Migrate `root-config` too

Rejected for this change because it increases blast radius into HTML, import-map serving, and single-spa bootstrapping without helping the core requirement.

### Option C: Use Rsbuild but switch the runtime model away from SystemJS

Rejected because it breaks the explicit compatibility requirement.

## Implementation Shape

1. Inventory each app's webpack behavior and map it to Rsbuild/Rspack primitives.
2. Create `rsbuild.config.ts` for `base`, `container`, and `tile`.
3. Update scripts and dependencies for the latest Rsbuild-compatible versions.
4. Remove webpack-specific build configuration and unneeded dependencies from those apps.
5. Add or adapt root entry handling where explicit single-spa lifecycle exports are required.
6. Verify the built artifacts still appear at the same URLs and load through SystemJS.
7. Verify host-driven mount behavior via `root-config`.

## Verification Plan

### Static verification

- `rsbuild build` succeeds in each migrated app.
- The build emits `base.js`, `template_container.js`, and `template.js`.
- The generated assets are served from the expected origin and chunk paths are resolvable.

### Local integration verification

- Start `apps/root-config` with the three migrated apps.
- Load the host app in local SystemJS mode.
- Confirm SystemJS resolves all three import-map entries successfully.
- Confirm `@fm/template_container` mounts without lifecycle errors.
- Confirm a tile reachable through the container path renders successfully.

### Browser/runtime verification

- No console errors for:
  - missing lifecycle exports
  - SystemJS format/registration failures
  - chunk 404s
  - asset-prefix/public-path resolution failures
- Network panel shows successful requests for the entry files and async chunks.

### Regression verification

- Run app-local tests/lint where they already exist.
- Add focused runtime-contract tests only if existing tests do not cover the entry surface enough to make the migration defensible.

## Key Risks

### SystemJS output incompatibility

Rsbuild/Rspack defaults may not produce a bundle format that SystemJS can execute directly. This must be proven with actual host loading, not inferred from a successful build.

### Implicit single-spa behavior in `container` and `tile`

These apps may currently rely on webpack-single-spa conventions that are not obvious from their entry files. If so, Rsbuild migration needs explicit recreation of that behavior.

### Asset-path regressions

The entry file can load while async chunks or styles still fail because of changed public-path behavior.

### CSS pipeline differences

`apps/container` has non-trivial stylesheet handling. Equivalent runtime behavior must be verified in the browser.

## Success Criteria

The migration is complete only when all of the following are true:

- webpack is no longer used by `apps/base`, `apps/container`, or `apps/tile`
- the three apps build with Rsbuild
- `root-config` continues loading them by the same import-map names and entry filenames
- `container` mounts successfully in local SystemJS mode
- a tile loads successfully through the container path in local SystemJS mode
- there are no SystemJS or lifecycle export regressions in the browser console
