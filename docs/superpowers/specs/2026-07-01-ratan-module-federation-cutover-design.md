# Ratan Module Federation Cutover Design

**Date:** 2026-07-01

**Scope:** `apps/mfe-ratan-container`, `apps/mfe-cashflow-blotter`, and the host loader path in `apps/base`.

**Goal:** Migrate `mfe-ratan-container` and `mfe-cashflow-blotter` from the SystemJS runtime contract to Module Federation while leaving the existing SystemJS entry files in the repository for manual cleanup later.

## Context

The two in-scope apps currently build as SystemJS modules:

- `@fm/ratan_container` is served from `ratan_container.js` on port `8009`.
- `@fm/ratan_cashflow_blotter` is served from `ratan_cashflow_blotter.js` on port `8015`.
- Both apps use `src/system-entry.ts` as their SystemJS boundary.
- `mfe-cashflow-blotter` imports `@fm/ratan_container` as a System external.
- `apps/base` currently loads workspace containers through `System.import(props.container)`.

The repository also already has Module Federation examples in `apps/mf_container` and `apps/mf_tile`, and `apps/base` already depends on `@module-federation/enhanced`.

## Decisions

This is a hard runtime cutover for the two in-scope apps. They do not need to run through both SystemJS and Module Federation at the same time.

The old SystemJS files stay in place:

- Keep `src/system-entry.ts` in both apps.
- Do not delete SystemJS-specific declarations unless they block the Module Federation build.
- Do not remove old import-map entries in this change unless a test requires the contract to be clarified.

Module Federation becomes the active runtime path:

- `mfe-ratan-container` exposes its existing root API through Module Federation.
- `mfe-cashflow-blotter` exposes its existing app/root API through Module Federation.
- `mfe-cashflow-blotter` consumes `mfe-ratan-container` as a Module Federation remote.
- `apps/base` uses the Module Federation runtime for these two app names and keeps SystemJS for the rest of the platform.

## Architecture

### Federated remotes

Each migrated app gets a `module-federation.config.ts` using `@module-federation/rsbuild-plugin`.

`mfe-ratan-container`:

- `name`: a Module Federation-safe identifier derived from the package identity, expected to be `ratan_container`.
- `filename`: `ratan_container.js`, matching the visible remote entry filename pattern used today.
- `exposes`: `'.' -> './src/root.tsx'`.
- `shared`: React and ReactDOM as singletons, plus other high-risk singleton UI/runtime libraries where required by runtime compatibility.

`mfe-cashflow-blotter`:

- `name`: expected to be `ratan_cashflow_blotter`.
- `filename`: `ratan_cashflow_blotter.js`.
- `exposes`: `'.' -> './src/root.tsx'`.
- `remotes`: `ratan_container` points to the ratan container `mf-manifest.json`.
- `shared`: React and ReactDOM as singletons.

### Rsbuild changes

The active build config switches from SystemJS library output to Module Federation plugin output:

- Keep existing `.env.mfe` parsing and `process.env.*` define injection.
- Keep the current dev ports and CORS headers.
- Keep existing asset prefix behavior.
- Preserve app-specific aliases, LESS support, version banner, and `version.json` emission where already present.
- Remove SystemJS `externalsType`, SystemJS library output, and SystemJS-only runtime public-path assumptions from the active config.

### Host loading

`apps/base/src/pages/Home/common/Container.tsx` becomes the bridge between both runtime models:

- For the migrated Ratan app identifiers, call `loadRemote()` from `@module-federation/enhanced/runtime`.
- For all other container identifiers, keep `System.import()`.
- Use a small mapping layer so existing entitlement/app-directory data can continue to refer to the known Ratan container names.

This contains the host blast radius to the component that already owns dynamic MFE loading.

## Non-Goals

- Migrating unrelated MFEs.
- Deleting SystemJS source files or historical import-map entries.
- Refactoring Ratan business components.
- Reworking entitlement payloads or app-directory data unless required to route the two migrated app names.
- Changing ports.

## Test Strategy

Specification-driven tests should cover the runtime contract rather than implementation details:

- `apps/base` should have a focused loader test proving migrated Ratan names use `loadRemote()` and non-migrated names still use `System.import()`.
- Root-config import-map tests should be updated to reflect any manifest URL contract used for the migrated apps.
- Existing Playwright checks that call `System.import('@fm/ratan_cashflow_blotter')` should be changed to verify Module Federation loading or remote artifact availability instead.

## Verification Plan

Static verification:

- Build `apps/mfe-ratan-container`.
- Build `apps/mfe-cashflow-blotter`.
- Confirm each build emits `mf-manifest.json` and the configured remote entry file.

Runtime verification:

- Start the local UI stack or the required subset for `root-config`, `base`, `mfe-ratan-container`, and `mfe-cashflow-blotter`.
- Visit `http://localhost:8001`.
- Log in.
- Open the New Tile drawer.
- Launch a tile backed by the migrated Ratan path.
- Confirm the workspace renders without missing remote, duplicate React, chunk 404, or lifecycle errors.
- Delete the workspace tab.

## Risks

The largest compatibility risk is `mfe-cashflow-blotter` importing Ratan container modules that were previously available from the SystemJS external namespace. Exposing the current `src/root.tsx` namespace from `mfe-ratan-container` should preserve that API, but the remote name and import path must line up with existing source imports.

The second risk is shared dependency duplication. React must be singleton. Additional libraries should only be promoted to shared singletons if verification shows duplicate-runtime problems.

## Success Criteria

- Both in-scope apps build as Module Federation remotes.
- `apps/base` loads the two migrated app identifiers through Module Federation.
- Other SystemJS apps still load through `System.import()`.
- Cashflow blotter can consume Ratan container exports through Module Federation.
- The existing SystemJS source files remain available for later manual deletion.
- Focused tests and local verification demonstrate the new runtime path works.
