# SCB Web MFBase to SCB Next Styles Migration Guide

This guide is for an AI agent migrating the original SCB Web MFBase project to
the styles and reusable presentation components developed in SCB Next Web.
It is written to be usable from a fresh checkout and without the conversation
that produced it.

Adopt the presentation layer from **`scb-next/packages/ratan-design-origin`**
in the original Webpack/Single-SPA MFBase while preserving its runtime and
`@fm/base` contracts. This is the selected design package and the source of
truth for this migration.

The migration must remain reversible while preserving import maps, remote
URLs, and the production composition.

## Repository map

| Role                 | Path                                    | Meaning                                                                         |
| -------------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| Original Base        | `scb/web/mfe-base-origin`               | Webpack, Single-SPA, SystemJS, Jest/Babel, legacy `@fm/base` namespace          |
| Original root config | `scb/web/mfe-root-config-origin`        | Legacy import maps and remote addresses                                         |
| Original Ratan       | `scb/web/mfe-ratan-container-origin`    | Legacy Ratan remote consuming `@fm/base` at runtime                             |
| Original Cashflow    | `scb/web/mfe-cashflow-blotter-origin`   | Legacy Cashflow remote and business screens                                     |
| SCB Next Base        | `scb-next/web/mfe-base-origin`          | Reference implementation for appearance and compatibility adapters              |
| Design package       | `scb-next/packages/ratan-design-origin` | Reusable controls, tokens, themes, CSS, declarations, and compatibility exports |
| Migration evidence   | `scb-next/docs`                         | Existing target specifications, inventory, verification, and release policy     |

The `scb/` tree is evidence and rollback source. Do not edit it as part of
baseline investigation. The target package and target Base are references;
inspect their current source rather than copying directories wholesale.

## Required reading before editing

Read these files in this order:

1. Repository `AGENTS.md`.
2. `docs/rules.md`.
3. `scb-next/docs/UI_PACKAGE_INVENTORY.md` for ownership boundaries.
4. `scb-next/docs/UI_PACKAGE_IMPLEMENTATION.md` for existing package contracts.
5. `scb-next/docs/UI_PACKAGE_RELEASE.md` for publication, licensing, and rollback.
6. `scb-next/packages/ratan-design-origin/README.md` and `package.json`.
7. The original and reference Base manifests, theme providers, component paths,
   test configuration, and root entry points. Inspect the original Webpack
   configuration for package, stylesheet, and asset consumption.

`scb-next/docs/base-origin-dependency-audit.md` contains useful history but has
stale MUI 9 prose. Current manifests, package peers, and the UI package
implementation documents are authoritative for the design backport.

Before editing an existing function, class, hook, component, provider, or
exported symbol, run the repository's GitNexus upstream impact analysis and
record the result. Warn on HIGH or CRITICAL risk before proceeding. Before each
commit, run GitNexus change detection and confirm that only the intended
symbols and execution flows changed.

## Target outcome

At the end of the migration:

- The original Base can render the legacy generation and the SCB WebKit
  generation through an explicit host-owned appearance flag.
- Legacy behavior remains the default until a deliberate rollout changes it.
- Existing `@fm/base` imports, default exports, named exports, props, refs,
  callbacks, selectors, test IDs, and DOM semantics remain compatible.
- Shared presentation is supplied by an approved, reproducible package
  artifact rather than a sibling checkout or a source path.
- Portal policy remains in Base: authentication, routing, storage, services,
  analytics, FDC3, workspace state, browser registration, and persistence.
- Original Ratan and Cashflow screens continue to use their existing imports
  and runtime composition during the first rollout.
- Both appearance generations work in light and dark mode, on desktop and
  narrow screens, with no missing assets, duplicate runtimes, or console errors.
- The previous package, bundle, import map, and asset set can be restored
  without source changes.

## Scope limits

This migration preserves the original build and runtime composition. Its scope
does not include:

- import-map or remote URL replacement;
- React major-version changes;
- upgrading original Ratan or Cashflow business dependencies;
- moving authentication, service calls, stores, routing, or browser policy
  into `ratan-design-origin`;
- replacing every local MUI component;
- production adoption of MUI X Pro date-range controls without licensing;
- publishing corporate WebKit/font assets without written approval.

## Current compatibility facts

The original Base currently uses Webpack and Single-SPA with a Jest/Babel test
stack. Its manifest allows MUI/icons `^5.15.0`, MUI X `^6.18.7`, Emotion 11.11,
and a wildcard private `@scdevkit/webkit` dependency.

The SCB Next package is ESM-oriented, private, and declares these peer
expectations:

| Dependency             | Original Base declaration    | Package target matrix                                                  |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| React/ReactDOM         | React 18 range               | React 18.2+                                                            |
| MUI/material and icons | 5.15 range                   | 5.18.0                                                                 |
| Emotion                | 11.11 range                  | `@emotion/react` 11.14.0, `@emotion/styled` 11.14.1                    |
| MUI X pickers          | 6.18 range                   | 6.20.2                                                                 |
| MUI X Data Grid        | 6.18 range                   | 6.20.4                                                                 |
| Day.js                 | 1.11 range                   | 1.11.21                                                                |
| Node build toolchain   | Original CI includes Node 14 | Package build requires modern Node; verify the current package engines |

The original Ratan and Cashflow applications have their own older MUI/Emotion
trees. Do not force those remotes to use Base's package peers in the first
stage. Resolve peer mismatches through tested dependency placement while
preserving the original runtime sharing policy.

## Implementation placement rule

Put new visual behavior, tokens, component styling, appearance switching, and
design-generation logic in `ratan-design-origin` when it is reusable, or in
the original Base's `new-styles` adapter when it is portal policy. Existing
Base component files should become thin compatibility wrappers that preserve
the old public paths and contracts. Do not introduce a second style system in
legacy component folders, and do not place authentication, routing, stores,
services, analytics, persistence, or browser registration in the package.

## Package and release decisions

Resolve these decisions before application code changes:

### Selected package

Use **`ratan-design-origin` from `scb-next/packages/ratan-design-origin`**.
Build the adopted artifact from that package's recorded source revision and
keep its existing public entry points. Package selection is already decided;
there is no package replacement, renaming, or convergence task in this migration.
Reuse and evolve this package rather than creating another design-package fork.

Other design-system packages in the repository are outside the scope. Add a
boundary test that proves the original Base consumes the artifact built from
the selected SCB Next package.

### Distribution

The original project must consume either:

- an approved private-registry package at an exact version; or
- an immutable packed tarball with a recorded SHA-256 checksum.

Both delivery options must contain the artifact built from the selected
`scb-next/packages/ratan-design-origin` source revision.

The `file:../../packages/ratan-design-origin` dependency is a development
workspace convenience and is not a production rollout contract. Do not add a
cross-root `file:` dependency from the original project to `scb-next` unless a
separate workspace design explicitly owns that relationship.

The release record must include the source commit, package version, peer matrix,
asset manifest, validation logs, checksum, publication audience, and prior
rollback artifact.

### Ownership and approvals

Name a release owner, backup owner, design-system maintainer, Base maintainer,
Ratan/Cashflow approvers, and asset/license owner. Obtain written approval for
SC WebKit/font redistribution and production MUI X Pro use. Keep license keys
and credentials out of the repository.

### Node and lockfile strategy

Choose one of these supported paths:

1. Build and publish the package in a modern Node lane, then let the original
   Node 14 application consume the prebuilt artifact after Webpack/Jest proof;
2. Upgrade the original build/test image to the package's supported Node/npm
   line and validate the entire application toolchain.

Establish one reproducible lockfile strategy for the original project. Do not
depend on accidental root hoisting. The lockfile must resolve the package and
its peer dependencies deterministically in clean CI.

## Ownership boundary

Use the following disposition when deciding what to migrate:

| Surface                 | Package owns                                                                                  | Original Base owns                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Tokens/theme primitives | Semantic tokens, core theme, CSS aliases, control overrides                                   | Auth mode, URL/storage policy, document classes, reset policy              |
| Core controls           | Button, LoadingButton, Input, Select                                                          | Consumer-specific prop translation                                         |
| Search                  | SearchInput, SearchButton, ResetButton, ToggleButton, Label, SearchGrid, criteria composition | Query state, execution, analytics, screen layout                           |
| Builder                 | Builder button, tabs, generic panel presentation                                              | Selected tab, anchor state, business filters                               |
| Feedback                | Loader, PageLoader, Snackbar, EmptyState, ErrorFallback, LoadingOverlay                       | Loading/error orchestration, portal copy, support address, boundaries      |
| Dialog                  | Reusable Dialog presentation and legacy root/title compatibility                              | Workspace lookup, drag/resize/maximize, stacking, telemetry                |
| Dates                   | Community date/time controls through `/dates`                                                 | Localization, timezone, formats, validation, values                        |
| Date range              | Optional `/date-range` entry only after Pro approval                                          | License initialization and date policy                                     |
| Portal shell            | Generic visual pieces only                                                                    | AppBar, Avatar/Profile, Drawer/NewTile/Tile, workspace tabs, auth, session |
| Portal-only controls    | No package move until a second consumer contract exists                                       | Switch/SwitchTime, Time, Timeout, Survey, Version, admin tables            |
| Integrations            | No browser registration or services                                                           | ScWebkit, ReactWrapper, FDC3, network, storage, navigation                 |

The package's `compatibility` and `base-compat` entries are narrow migration
facades. They are not a general customization API.

## Execution plan

Every phase ends with a gate. A failed gate stops the affected phase; record the
command, exit code, first actionable error, environment, and last passing gate.

### G0: Baseline and parity specification

Record:

- original and target commit SHAs;
- `git status --short` for both trees;
- Node, npm, browser, and private-registry versions;
- current Base, Ratan, Cashflow test and build results;
- existing warnings and known UI defects.

Capture the original journey at `1280x720` and `390x844` in legacy light and
dark mode:

1. authenticate;
2. open **New Tile**;
3. launch a representative tile or remote;
4. render a grid, search controls, dialog, profile, loading, empty, and error
   state;
5. remove the workspace tab.

Capture screenshots, computed typography/colors/dimensions, focus behavior,
console errors, network failures, and relevant request/response fixtures.
Create a source map for every changed file: `copy`, `translate`, `facade`,
`regenerate`, `retain`, `exclude`, or `block`. Whole-directory copying is not a
valid disposition.

**Gate G0:** all requested behavior has an evidence source and all baseline
failures are recorded before migration edits begin.

### G1: Package readiness and consumer proof

Build the package from its own workspace and verify its public exports,
declarations, CSS, and assets. Pack it and install the tarball into a clean
consumer that has no sibling package checkout.

Add a legacy-consumer fixture using the original Webpack configuration and
Jest/Babel configuration. Prove:

- Webpack resolves the package export map and TypeScript declarations;
- Jest can load the package through the chosen ESM strategy;
- CSS loaders process `styles.css` and optional `tokens.css`;
- WOFF2 assets resolve from the built Base `dist` path;
- no package import reaches `scb-next` source files;
- React, MUI, and Emotion resolve from the intended host tree;
- optional MUI X peers fail clearly when absent and work when declared.

If Jest cannot consume the ESM package, choose either a supported dual-module
package build or a narrowly scoped Jest ESM/transform configuration. Do not
silently transform all of `node_modules`.

**Gate G1:** a clean packed-artifact install builds and runs the Webpack and
focused Jest consumer fixture with the exact recorded dependency matrix.

### G2: Base theme and appearance bridge

Implement the smallest adapter in the original Base's new-styles boundary.
Keep the original Single-SPA lifecycle, provider nesting, auth/session logic,
and theme persistence.

The adapter should:

- default `newStyles` to `false`;
- preserve the existing `?new-layout=true` behavior and define precedence if
  another flag is introduced;
- compute `mode` in Base from the existing policy;
- map the flag to an explicit `designGeneration` such as `legacy` or `webkit`;
- pass the existing portal theme as `baseTheme` to the package provider;
- load `ratan-design-origin/styles.css` once at the host entry;
- preserve MUI theme augmentation used by portal components, including
  `customColor` and other local fields;
- preserve Emotion insertion order, portal containers, z-index, and reset
  behavior;
- clean up provider roots on Single-SPA mount/unmount.

The package provider is presentation-only. It must not read auth, storage, URL,
document globals, router state, or application stores. Prefer scoped package CSS
under the provider root. Use global `tokens.css` only when the host deliberately
owns document-level mode/generation attributes and has coexistence tests for
other micro-frontends.

If Ratan or Cashflow must receive the new generation, define and version a
small appearance contract, for example:

```ts
type DesignGeneration = 'legacy' | 'webkit';

type RatanAppearance = {
  mode: 'light' | 'dark';
  designGeneration: DesignGeneration;
};
```

Keep appearance policy in Base and pass it as data. Do not let remotes infer it
from storage or URL parameters.

**Gate G2:** `newStyles=false` is visually and behaviorally equivalent to the
baseline, while `newStyles=true` produces the scoped WebKit appearance without
changing login, navigation, workspace, or overlay behavior.

### G3: Primitive controls and contract adapters

Migrate one batch at a time through the existing Base component paths. Add or
update a contract test before changing each path.

For every adapter, preserve:

- default and named export shape;
- TypeScript prop compatibility;
- forwarded refs and ref element type;
- callback arguments and event timing;
- disabled/loading behavior;
- DOM roles, labels, attributes, selectors, and test IDs;
- portal target and z-index behavior;
- legacy visual quirks that consumers rely on.

Use this order:

1. Button, LoadingButton, Input, Select;
2. SearchInput, SearchButton, ResetButton, ToggleButton, Label;
3. SearchGrid, SearchCondition, SearchConditionContainer;
4. BuilderButton and generic builder tabs/panel;
5. Loader, PageLoader, Snackbar;
6. EmptyState, ErrorFallback, LoadingOverlay;
7. Dialog presentation and compatibility root/title styles.

Keep feature screens importing their existing Base paths. The implementation
behind those paths may become a package re-export or a thin prop adapter.

**Gate G3:** package tests and original Base contract tests pass for every
migrated batch; representative consumers require no import or prop changes.

### G4: Dates and downstream appearance

Adopt community DatePicker, DateTimePicker, and TimePicker through the package
`/dates` entry only after host localization and validation tests pass.

Keep date values, timezone, format, error policy, and `LocalizationProvider`
ownership in Base or the feature host. Treat the Pro range entry as blocked
until license ownership and secure initialization are recorded.

For original Ratan and Cashflow:

- preserve their runtime `@fm/base` imports in the first wave;
- keep Base's `ThemeConfig` and `ThemeUtil` facade shapes stable;
- verify their MUI/Emotion trees remain local and compatible;
- preserve Ant Design tokens, AG Grid skin, dialog z-index, and remote CSS
  namespaces;
- only add direct package dependencies after separate peer and bundle tests.

**Gate G4:** legacy remotes render through the unchanged Base namespace and
retain their existing provider, grid, dialog, loading, and theme behavior.

### G5: Integrated validation and artifact inspection

Run package gates:

```bash
npm run test --workspace ratan-design-origin -- --maxWorkers=2
npm run typecheck --workspace ratan-design-origin
npm run lint --workspace ratan-design-origin
npm run build:packages
npm run build:storybook --workspace ratan-design-origin
npm run verify:package --workspace ratan-design-origin
```

Run the original Base's existing test, lint, typecheck, Storybook, and
production build scripts from `scb/web/mfe-base-origin`. Run equivalent focused
tests and builds for original Ratan and Cashflow.

Inspect the built artifacts for:

- package source or `file:` paths that escaped into production;
- missing CSS, WOFF2, image, chunk, or public-path assets;
- duplicate React, ReactDOM, MUI, or Emotion runtimes;
- unexpected MUI major versions;
- retired package names or active `scb-next` source references;
- changed SystemJS/import-map URLs or original runtime composition.

Browser validation must cover:

- login and session restoration;
- New Tile drawer and permission filtering;
- representative Ratan/Cashflow launch;
- grid, search, builder, details, loading, empty, failure, and dialog states;
- profile and workspace tab operations;
- tab removal;
- keyboard focus and accessible names;
- light/dark and legacy/WebKit combinations;
- `1280x720` and `390x844` without overlap or clipping;
- clean console and expected network responses.

**Gate G5:** all package, consumer, artifact, browser, accessibility, and
responsive checks pass, with evidence stored alongside the migration change.

### G6: Controlled rollout

Roll out in this order:

1. package fixture/catalog host;
2. original Base with `newStyles=false` and the new package installed;
3. original Base with a controlled `newStyles=true` cohort;
4. original Ratan/Cashflow consumers after their compatibility gate;
5. broader production rollout after monitoring confirms no regressions.

Retain the previous application bundle, package artifact, lockfile, CSS, fonts,
and import-map deployment for the whole rollout period.

## Optional development styling console

If a local styling console is carried forward, keep it development-only and
drive it through the explicit appearance contract. It may change font size,
primary color, generation, mode, and supported component variants for visual
comparison. It must not become a production configuration API, bypass package
tokens, mutate application stores, or load unapproved font assets.

The console should identify the active package version and appearance inputs so
screenshots can be reproduced. Its controls must be covered by a small smoke
test and excluded from production bundles where the existing build supports
that distinction.

## Dependency isolation rules

Use application-local UI dependencies. Preserve the original React/ReactDOM and
router resolution and sharing policy while validating package peer resolution.

After each clean install, prove:

- Base resolves its declared MUI and Emotion versions;
- Ratan and Cashflow resolve their own declared MUI trees;
- package peers resolve to the intended host instances;
- React identity is stable at every active runtime boundary;
- no MUI 5 and MUI 9 singleton policy is introduced;
- no remote import is rewritten merely to hide an installation problem.

If an icon or MUI module fails to resolve, inspect lockfile placement and
workspace-local resolution first. Do not upgrade a remote or alter imports as
the first response.

## Rollback procedure

### Package/style-only regression

1. Stop the rollout or disable the `newStyles` flag.
2. Restore the exact previous package version and lockfile resolution.
3. Restore matching CSS/font assets and the previously verified Base bundle.
4. Re-run login, New Tile, tile render, tab removal, loading, Dialog, date, and
   theme checks.
5. Preserve the failing artifact, screenshot, console output, and dependency
   graph for diagnosis.

Do not mix CSS/fonts from one package version with a bundle from another.

### Single remote regression

Roll back that remote bundle first while retaining the Base package version only
if the compatibility contract is proven. Record the incompatibility before
producing a patch release.

## Stop conditions

Stop and report the affected gate when:

- the package cannot be installed reproducibly from an approved source;
- registry, release owner, font, or MUI X Pro approval is missing;
- Webpack or Jest cannot consume the package through a documented strategy;
- CSS/font assets cannot be served from the original production `dist` path;
- a change requires a React major upgrade in only one origin;
- Ratan or Cashflow resolves UI libraries from an unintended workspace;
- a compatibility adapter would duplicate business logic;
- the proposed implementation requires replacing the original bundler or
  application runtime to make package adoption pass;
- legacy behavior or production contracts cannot be established from evidence.

Never weaken tests or change unrelated business code to clear a blocked gate.

## Completion checklist

The migration is complete only when all of these are true:

- [ ] The adopted artifact comes from `scb-next/packages/ratan-design-origin`; its version, registry, owners, licenses, and retention are recorded.
- [ ] Clean packed-artifact Webpack/Jest consumer proof passes.
- [ ] Original Base has a reproducible lockfile and dependency matrix.
- [ ] `newStyles=false` preserves the original baseline.
- [ ] `newStyles=true` applies scoped tokens, provider theme, fonts, and controls.
- [ ] Existing `@fm/base` contracts and downstream imports remain compatible.
- [ ] Package-owned and portal-owned responsibilities match the inventory.
- [ ] Ratan/Cashflow dependency isolation and provider behavior pass.
- [ ] Desktop/mobile, light/dark, legacy/WebKit browser evidence passes.
- [ ] Built artifact and asset-path scans pass.
- [ ] Previous package, bundle, import map, and assets are retained for rollback.
- [ ] The original bundler, runtime composition, import maps, and remote URLs are preserved.

The agent performing the migration must report the completed gates, commands,
artifact versions, unresolved blockers, and rollback target in its final change
summary. No gate is considered passed from a source inspection alone when a
build, browser, dependency, or production asset check is required.
