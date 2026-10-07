# MFBase Component Extraction into Ratan Design

## Purpose and fixed destination

This is a standalone execution guide for an AI agent moving reusable
presentation from MFBase into the existing design package at
**`scb-next/packages/ratan-design-origin`**. Its npm import name is
**`ratan-design-origin`**. Reuse this package and its public APIs.

The objective is one maintained implementation of each reusable control or
pattern, usable without MFBase and consumed through compatible Base adapters.
Preserve the existing application runtime, business behavior, and consumer
imports throughout the extraction.

This guide covers package extraction and compatibility wiring. The companion
[MFBase style adoption guide](SCB_MFBASE_RATAN_DESIGN_MIGRATION_GUIDE.md) covers
consuming the resulting package in the original SCB application.

Many components have already been extracted in SCB Next. Verify those exports
and adapters before starting; do not recreate them or assume their names prove
behavioral parity.

## Working paths

All paths below are relative to the checkout root, so the guide can be used on
an internal PC with a different absolute path.

| Role                  | Path                                         | Use                                                                      |
| --------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| Active MFBase         | `scb-next/web/mfe-base-origin`               | Inspect current adapters and extract approved remaining presentation     |
| Original MFBase       | `scb/web/mfe-base-origin`                    | Read-only source for historical contracts and visual evidence            |
| Package               | `scb-next/packages/ratan-design-origin`      | Component implementations, tokens, themes, types, tests, stories, assets |
| Ratan consumer        | `scb-next/web/mfe-ratan-container-origin`    | Validate unchanged `@fm/base` imports through `src/compat/base.tsx`      |
| Cashflow consumer     | `scb-next/web/mfe-cashflow-blotter-origin`   | Validate its compatibility bridge and feature behavior                   |
| Package inventory     | `scb-next/docs/UI_PACKAGE_INVENTORY.md`      | Current ownership and intentional host responsibilities                  |
| Package specification | `scb-next/docs/UI_PACKAGE_IMPLEMENTATION.md` | Existing behavior and extraction requirements                            |
| Release policy        | `scb-next/docs/UI_PACKAGE_RELEASE.md`        | Versioning, redistribution, publication, and rollback                    |

Record the selected source revision and implementation destination before
editing. Use `scb-next` for package development and active compatibility wiring.
Keep the original `scb/` snapshot intact as evidence. Adopting a resulting
package in the original application is a separate consumer change, described
by the companion guide.

## Agent instructions

Read repository `AGENTS.md`, `docs/rules.md`, the package inventory, and the
package README before changing a component. Inspect the implementation,
consumers, tests, relevant package entry, and actual emitted artifacts.

For every existing symbol being modified:

1. Run GitNexus upstream impact analysis before editing.
2. Report direct callers, affected execution flows, and risk.
3. Warn about HIGH or CRITICAL impact before making the change.
4. Define the required contract in the specification.
5. Add a focused regression test and observe the intended failure.
6. Implement and validate one coherent extraction stage.
7. Run GitNexus change detection before committing that stage.
8. Commit only the verified stage and preserve unrelated worktree changes.

If GitNexus is unavailable on the internal PC, record the unavailable command
and satisfy the repository's required analysis through its supported runner
before changing symbols. Do not invent an impact result.

Specification and behavior tests precede implementation. Package coverage must
meet the repository requirement of greater than 90% lines and branches; the
current package configuration enforces a minimum of 90%. Preserve those gates
and add meaningful cases rather than lowering thresholds or excluding changed
modules.

## Internal-PC preparation

Bring source files, not generated output used as a substitute for source:

- this guide and the applicable repository instructions;
- the entire package source, assets, scripts, tests, stories, fixtures, build
  configuration, and README;
- the selected Base components, their dependencies, providers, tests, and
  public exports;
- the Ratan/Cashflow compatibility bridges and tests for consumed surfaces;
- `scb-next/package.json`, its lockfile and installation policy, and the
  package inventory/specification/release documents;
- accepted screenshots or sanitized fixtures required for parity.

Use the Node/npm version supported by the current package toolchain. Install
from the approved corporate registry with the committed lockfile. Record
registry host, tool versions, and private dependency availability without
logging credentials.

The current full `scb-next` workspace installation references sibling
`sc-dev-web` packages through root overrides. Provide that approved source or
record an intentional internal-registry mapping; package-local asset copying
does not remove this workspace installation requirement.

The package verifier at `scripts/verify-package.mjs` currently hardcodes
`https://registry.npmjs.org` for fixture installs and `/tmp/npm-cache` as a
cache location. Inspect these assumptions on the internal PC. If the public
registry or that cache path is unavailable, make a scoped configuration change
that uses the approved registry and a writable cache, while preserving all
verification assertions. Record that configuration and test it; a blocked
fixture is not a successful clean-install check.

Token generation additionally needs the approved SC WebKit source build at
`sc-dev-web/sc-dev-web/dist`. Ordinary package builds copy the existing checked-in
assets and do not require regeneration when token sources are unchanged.
Regeneration requires the approved canonical inputs and their recorded hashes.

## Ownership model

```text
Ratan Design: tokens + pure controls + reusable presentation
                         |
                         v
Base adapter: legacy exports + host callbacks + application policy
                         |
                         v
Base shell and existing @fm/base consumers
```

The package must work in an independent React host. It may depend on supported
UI peers, explicit props, and its own presentation context. It must not import
application source, application aliases, `@fm/base`, stores, routing, service
clients, FDC3, authentication, analytics, browser registration, or persistence.

All new reusable style components and visual behavior belong in this package.
Base's `src/new-styles` is the home for portal-specific appearance composition
and switching policy. Existing Base component paths remain compatibility
wrappers, not a second implementation of package styling.

| Responsibility                                                               | Owner                       |
| ---------------------------------------------------------------------------- | --------------------------- |
| Rendering, semantic tokens, component variants and generic interaction state | Package                     |
| Controlled input values, query execution and business validation             | Consumer                    |
| Mode/generation selection from auth, URL, configuration or storage           | Base/new-styles             |
| Explicit appearance values and scoped UI theme                               | Package provider            |
| Navigation, entitlements, service calls, workspace lifecycle, telemetry      | Base or feature application |
| Generic visual dialog surface                                                | Package                     |
| Dialog drag/resize/maximize, workspace placement and stacking policy         | Base adapter                |
| Plain text/React notification presentation                                   | Package                     |
| Legacy HTML notification sanitization and orchestration                      | Base adapter                |
| Date localization, timezone, validation and licensing                        | Date consumer               |
| WebKit custom-element registration and browser integration                   | Host                        |

## Classify every candidate

Assign one disposition before changing a file:

| Disposition               | Action                                                        | Completion condition                                                      |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Already exported          | Adopt or verify the existing package export                   | Base adapter and tests preserve the required contract                     |
| Reusable presentation     | Extract its rendering, styles and generic interaction         | Package works without application providers or source                     |
| Mixed presentation/policy | Split explicit inputs and callbacks from application behavior | Host policy remains local; one package-owned visual implementation exists |
| Portal or feature policy  | Retain it in Base                                             | Inventory records its owner and reason                                    |
| Blocked                   | Record missing contract, dependency or evidence               | A concrete unblock requirement is identified                              |

Extract only a coherent surface with a defined standalone API. A direct MUI
import in Base is not, by itself, evidence that a component should move.

## Existing extraction inventory

The following surfaces are already represented in the selected SCB Next
package. Confirm their current implementation and consumer wiring in the
internal checkout before marking them verified.

| Base surface                                                | Package surface/entry                               | Important host remainder                                                       |
| ----------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| Button, LoadingButton, Input, Select                        | Core named exports                                  | Legacy prop translation where a consumer requires it                           |
| SearchInput, SearchButton, ResetButton, ToggleButton, Label | Core named exports                                  | Search state, query execution, analytics                                       |
| SearchGrid, SearchCondition, SearchConditionContainer       | Core named exports                                  | Criteria data and business expansion/removal policy                            |
| BuilderButton and builder tabs/panel                        | Core named exports                                  | Controlled anchor, selected tab, business content                              |
| Loader, PageLoader, Snackbar                                | Core named exports                                  | Loading/notification orchestration and sanitized HTML compatibility            |
| Dialog                                                      | Core Dialog plus `/compatibility` root/title styles | Drag, resize, maximize, workspace lookup, sizing, telemetry                    |
| Empty, FallbackError, Splash                                | EmptyState, ErrorFallback, LoadingOverlay           | Illustration/copy/actions, error capture, support policy, viewport composition |
| DatePicker, DateTimePicker, TimePicker                      | `/dates`                                            | LocalizationProvider, date state, timezone, validation                         |
| DateRangePicker                                             | Optional `/date-range`                              | Pro entitlement/initialization and date policy                                 |
| Config and historical theme/reset helpers                   | `/portal-theme`                                     | Host URL flags, document class/reset policy                                    |
| Theme, appearance, tokens                                   | Core provider, `/theme`, `/tokens`, explicit CSS    | Application mode/generation selection and CSS loading                          |

The namespace adapters in `/base-compat` also preserve narrowly defined pure
presentation exports for Ratan/Cashflow. Its value-display `Time` is not a move
of the portal's timezone control or time orchestration.

## Components deliberately retained in Base

Retain the following application responsibilities:

- AppBar, Avatar/Profile, Drawer/NewTile/Tile and portal navigation;
- TabItem/TabPanel and workspace mounting, activation, editing and removal;
- theme/timezone Switch/SwitchTime, Time, Timeout and session behavior;
- Survey/SurveyButton, Version and portal-specific workflows;
- Table/TableDetail and admin editors/actions;
- ErrorBoundry capture and support-state orchestration;
- ScWebkit/ReactWrapper custom-element integration;
- stores, transport/services, storage, auth, entitlements and telemetry.

If one of these contains a visual piece that should be reused, specify and
extract only that piece. For example, a controlled visual toggle may become a
package component; deciding the portal theme or timezone stays in the host.
Keep Profile's identity/loading policy in Base even if a reusable profile
surface is later promoted. Update the inventory to describe the split.

Do not confuse the exported `ToggleButton` action with Base's theme/timezone
Switch controls. Their existing contracts and behavior differ.

## Contract record for each component

Create this record in the extraction specification before implementation:

| Field               | Required evidence                                                         |
| ------------------- | ------------------------------------------------------------------------- |
| Source and revision | Exact source files, commit, tests and accepted visuals                    |
| Consumers           | Base paths, root namespace, remote bridges, feature imports               |
| Import shape        | Named/default exports, namespace objects and public type names            |
| Props/defaults      | Required/optional values, variant, size, label and layout defaults        |
| State ownership     | Controlled/uncontrolled behavior; omitted, null, empty and false values   |
| Events              | Callback arguments, reasons, order, cancellation and disabled behavior    |
| Refs                | Existing supported ref targets and imperative expectations                |
| DOM contract        | Roles, labels, IDs, attributes, classes, selectors, test IDs              |
| Style extension     | `sx`, className, slots, precedence and supported overrides                |
| Overlay policy      | Container precedence, portal scoping, focus, Escape, scroll and z-index   |
| Appearance          | Legacy/WebKit, light/dark, font metrics and control geometry              |
| Host remainder      | Store/router/service dependencies to retain and explicit inputs/callbacks |
| Package API         | Export name, entry point, prop type and standalone states                 |
| Verification        | Tests, story, packed fixture, affected consumers and browser journey      |

Preserve behavior that callers actually rely on, including deliberate legacy
quirks. Record corrections separately if a proposed improvement changes a
public contract; extraction alone is not authorization to redesign consumers.

## Extraction sequence

### Stage 0: Establish the baseline

1. Record source/target SHAs, dirty state, tool versions and installed peer
   resolutions. If both folders belong to one repository, record that fact.
2. Locate the source component, styles, exports, controllers, tests and callers.
3. Inspect the matching package export and current Base adapter, if present.
4. Complete the classification and contract record.
5. Run focused baseline tests and capture relevant screenshots/focus behavior.

**Gate:** every requested surface has a disposition and contract evidence;
pre-existing failures are recorded rather than attributed to the extraction.

### Stage 1: Specify and test the boundary

1. Update `UI_PACKAGE_IMPLEMENTATION.md` with the proposed ownership and API.
2. Add Base/consumer regression cases for retained imports and behavior.
3. Add package cases through the public entry for the standalone behavior.
4. Observe a focused failure caused by the missing capability. For an already
   migrated component, verify its existing tests and add only missing coverage.

Avoid tests that merely assert implementation identity or copied style objects.
Test user-visible state, callbacks, refs, accessibility and compatibility.

**Gate:** tests distinguish the required behavior from an absent or broken
extraction without relying on unrelated private-package or environment errors.

### Stage 2: Implement the package surface

1. Move reusable rendering and styles into a focused package module.
2. Replace application dependencies with explicit props, content slots or
   callbacks. Leave application policy in the host.
3. Use existing package token/theme helpers and supported MUI 5 props.
4. Preserve supported refs, controlled/uncontrolled behavior, override
   precedence and event arguments.
5. Export the component and its public types through the appropriate entry.
6. Add a Storybook story and a compiling packed-consumer usage case.

Use the package's current module organization; an internal helper does not
need a new public subpath. Do not copy a complete Base directory and its
controller dependencies into the package.

**Gate:** the standalone surface works without Base source, services, routing,
stores or document policy, and its public behavior tests pass.

### Stage 3: Replace Base implementation with an adapter

Use a direct re-export when the contracts are identical. An existing example
in `src/components/Button/index.tsx` is:

```ts
export { Button as default } from 'ratan-design-origin';
```

Use a thin adapter when props, namespace shape, sanitization or host policy
needs translation. Preserve public prop type exports and the root `@fm/base`
namespace. Import only documented package entries, never package `src/` files.

Remove the duplicated promoted presentation implementation after all consumers
use the package. Keep host controllers and compatibility selectors where their
contracts still require them. Keep new portal-specific appearance work in
`src/new-styles`.

**Gate:** unchanged Base imports render the package implementation, supported
behavior/refs remain compatible, and duplicate rendering/styles are removed.

### Stage 4: Validate downstream adapters

Inspect `src/compat/base.tsx` and its tests in Ratan and Cashflow. Preserve
feature imports from `@fm/base`; change the bridge when necessary.

Important existing differences to preserve:

- namespace shapes such as `{ default: CompatibilityButton }`;
- legacy button `type="primary"` translated to a valid button type;
- consumer loading indicator default of 16px and start-icon replacement;
- the independent core loading default, currently 14px;
- default-open consumer Dialog behavior and its close callback shape;
- Dialog placement, constrained sizing and overlay policy;
- loader namespace versus core Loader presentation;
- deliberate consumer theme differences and local Ant Design/AG Grid behavior.

Also preserve Base's component-specific exports: Builder's `Tabs`, `Tab`,
`TabPanel`, `a11yTabPanelProps` and `emptyFunction` aliases, and Input's
`InputStyled`, supported root/native refs and environment-prefixed legacy
selectors. Verify these against their current adapters and consumers.

Do not move service/platform bridge code into `/base-compat`. Preserve each
application's local MfeThemeProvider and existing sharing configuration.

**Gate:** affected bridge tests, feature journeys and dependency-isolation checks
pass with unchanged consumer imports.

### Stage 5: Verify the distributable package

Build before testing external consumption. Verify emitted ESM, declaration
paths, exports, CSS/assets, optional peer boundaries and tree shaking through
the packed fixture. Source-alias tests alone do not prove the package can ship.

Run the commands in the verification section for the actual affected scope.
Inspect browser geometry and overlays as well as test/build results.

**Gate:** package, affected Base/remote contracts, standalone packed fixture and
relevant browser checks pass; failures are reported with their evidence.

### Stage 6: Record and commit the extraction

Update the inventory, README/API table, specification, stories and changelog
for the final ownership and behavior. Record validation commands/results,
source/package versions, known blockers and rollback target.

Run GitNexus change detection and inspect the final diff. Commit only the
verified component or coherent batch; exclude unrelated staged files.

**Gate:** there is one promoted presentation implementation, documented public
contracts, compatible adapters, checkable verification and an isolated commit.

## Public entries and build changes

| Entry                 | Use                                                           |
| --------------------- | ------------------------------------------------------------- |
| `ratan-design-origin` | Core controls, provider, feedback and reusable patterns       |
| `/theme`              | Core theme construction and shared appearance types           |
| `/tokens`             | Framework-independent JavaScript token exports                |
| `/compatibility`      | Transitional Base selectors and styled compatibility surfaces |
| `/base-compat`        | Narrow legacy namespace presentation adapters                 |
| `/portal-theme`       | Opt-in historical portal theme/config/reset integration       |
| `/dates`              | Community date/time picker integration                        |
| `/date-range`         | Optional Pro range integration                                |
| `/styles.css`         | Explicit scoped provider tokens and font assets               |
| `/tokens.css`         | CSS-only global token consumers                               |

For an export added to an existing entry, update that entry and its public type
exports. The current declaration build includes `src`; the library preserves
modules. Confirm actual output rather than assuming the file is shipped.

If a new public subpath is justified, update all of these together:

- its source entry module;
- `vite.config.ts` library entry map;
- `package.json` export map with ESM and declaration paths;
- applicable `typesVersions` mapping;
- external peer handling if a new integration requires it;
- compiling public-import fixture, tests, docs and catalog.

The package is currently ESM-only. Do not claim CommonJS support or import
private MUI internals to compensate for module-resolution problems. Keep React,
ReactDOM, MUI and Emotion as supported external peers; avoid bundling duplicate
host UI runtimes.

Preserve the existing PURE annotations for pure module-scope initialization
such as styled controls, forwardRef, memo and contexts. Annotate only calls
known to be pure; preserve CSS side-effect declarations. The current packed
Button-only fixture requires only `Button.js` as rendered package code and a
2,048-byte limit with its pinned builder and external UI peers. Keep that
tree-shaking gate when adding core exports rather than widening it to admit
unrelated component, theme, token or runtime code.

Keep imports safe for server rendering: avoid browser globals at module load
and preserve the verifier's DOM-free SSR checks.

The current core peer ranges are React/ReactDOM `^18.2.0`, MUI/material and
icons `^5.18.0`, Emotion React `^11.14.0` and styled `^11.14.1`. Optional
peers include pickers/Pro `~6.20.2`, grid `~6.20.4`, MUI Base
`5.0.0-beta.70` and Day.js `^1.11.21`. Recheck the manifest on the internal PC;
do not broaden peer ranges solely because their major versions match.

Core must remain usable without MUI X, Pro, grid, Day.js or WebKit element
registration. An optional integration needs an isolated entry and a consumer
that declares its optional peers. Ancestor hoisting is not a dependency contract.

## Tokens, typography and generated assets

New reusable visual values belong in semantic tokens and package styles. Retain
documented historical values in compatibility/portal-theme where changing them
would break accepted visuals. Use existing helpers before adding another styling
abstraction.

Canonical generation inputs include:

- approved SC WebKit source CSS under `sc-dev-web/sc-dev-web/dist/styles`;
- `src/tokens/webkit-theme.json`;
- static `src/tokens/color*.ts` templates;
- `scripts/generate-webkit-assets.mjs` and its token helpers.

Generated outputs include `assets/styles.css`, `assets/tokens.css`,
`assets/webkit-sources.json`, packaged fonts and
`src/tokens/webkit-theme.generated.ts`. Update the inputs and regenerate;
avoid manual edits to generated outputs or `dist`.

From `scb-next`, when approved token inputs change:

```bash
npm run tokens:generate --workspace ratan-design-origin
npm run test:tokens --workspace ratan-design-origin
```

`styles.css` uses provider-scoped mode/generation selectors. Hosts import it
explicitly; the provider does not load it automatically. `tokens.css` exposes
global variables and defaults to WebKit/light, while the provider's default
appearance is legacy/light. Preserve that distinction and avoid silently
switching an existing consumer by importing the wrong stylesheet.

Legacy Poppins remains host-provided. Packaged WebKit fonts retain corporate
distribution restrictions. Token changes must keep JavaScript/MUI values and
CSS aliases consistent in light/dark and both generations.

## Provider and overlay contract

Audit the host integration before assuming it exists. At guide creation,
Base's `src/theme/Provider.tsx` mounts MUI ThemeProvider, CssBaseline and
LocalizationProvider, and Base has no package-provider or package-CSS import.
Its new-styles stylesheet imports the SC WebKit dark stylesheet. Re-exporting
a component alone does not provide the scoped package root or appearance
context. Complete the required provider/CSS wiring in the host's new-styles
boundary and verify existing layout/reset behavior; inspect the internal
checkout again because this integration may have changed.

Keep mode/generation selection in the host. Pass explicit appearance inputs to
`RatanDesignProvider`; reuse existing `RatanAppearance` and resolver exports
rather than defining competing types or reading host state in the package.

For an existing portal theme, pass `baseTheme` where the host needs to preserve
its MUI extensions and component overrides. Use the core theme for a standalone
consumer. Keep document-wide CssBaseline/reset policy as an explicit host opt-in.

Test overlay container precedence, dialogs, menus, popovers, tooltips and focus
return. A scoped root must not cause clipping or lose host theme/z-index
behavior. Explicit caller containers must keep their documented precedence.
Multiple providers and simultaneous controls must not create duplicate IDs or
cross-link ARIA relationships.

## Regression cases that must survive extraction

| Surface        | Required cases                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions        | Stable label, busy state, disabled activation, loading icon placement and ref                                                                 |
| Inputs/selects | Root/native refs where supported, disabled/read-only/error/required state, label association, caller slot/sx precedence                       |
| Search         | Clear action disabled for disabled/read-only inputs, accessible clear name, callbacks preserved                                               |
| Criteria       | Collapsed content remains mounted as required; clipped controls are removed from keyboard/accessibility navigation                            |
| Builder        | Controlled anchor/close, Escape/backdrop reason, focus return, stable and unique tab/panel IDs                                                |
| Snackbar       | Package strings stay plain text; Base alone preserves sanitized legacy HTML                                                                   |
| Loader/overlay | Accessible status, reduced motion, closed overlay immediately releases pointer input                                                          |
| Dialog         | Controlled open, close reasons, custom/absent title labels, explicit containers, host resizing/drag behavior                                  |
| Dates          | Omitted value permits defaultValue; null is controlled-empty; partial ranges preserve null endpoints; callbacks and date policy remain intact |

Preserve current supported refs; do not promise new ref behavior for date
wrappers or other surfaces that did not expose it.

Measure typography and component size against the accepted baseline for each
generation. Legacy and WebKit have intentionally different defaults; do not
force them to look identical or apply one blanket font-size fix across the host.

Shell checks must include the previously reported risks: oversized empty/profile
text, profile dropdown width/spacing, profile header/avatar background
containment and contrast, and off-state theme/timezone toggle hover flicker or
thumb misalignment. Test on/off, hover, focus and disabled geometry. Record
approved measurements and add regression evidence; prior conversation or a
different worktree is not proof those fixes exist in this checkout.

## Verification commands

Run the following from **`scb-next`**, not the outer repository root. Confirm
the scripts still exist in the internal checkout before invoking them.

### Package completion gates

For focused package iteration, run Vitest directly without claiming whole-package
coverage from a selected test run:

```bash
npm exec --workspace ratan-design-origin -- vitest run tests/controls.test.tsx
```

Replace the test file with the relevant contract test. At stage completion,
run the full gates below with coverage enabled.

```bash
npm run test --workspace ratan-design-origin -- --maxWorkers=2
npm run typecheck --workspace ratan-design-origin
npm run lint --workspace ratan-design-origin -- --max-warnings=0
npm run build:packages
npm run build:storybook --workspace ratan-design-origin
npm run verify:package --workspace ratan-design-origin
npm run test:dependency-isolation
npm run verify:dependency-isolation
```

`verify:package` installs a packed artifact into an isolated fixture and checks
ordinary and optional integrations, declarations, CSS/fonts and core boundaries.
Preserve its assertions when adapting internal registry/cache configuration.

### Base completion gates

```bash
npm run test --workspace @fm/base-origin -- --maxWorkers=2
npm run typecheck --workspace @fm/base-origin
npm run lint --workspace @fm/base-origin -- --max-warnings=0
npm run build --workspace @fm/base-origin
npm run build:storybook --workspace @fm/base-origin
```

During Base iteration use the relevant test file filter. Complete the affected
stage gates before committing; record baseline failures separately.

### Downstream gates when affected

```bash
npm run test --workspace @fm/ratan_container-origin -- src/compat/base.test.tsx src/compat/design-controls.test.tsx
npm run typecheck --workspace @fm/ratan_container-origin
npm run build --workspace @fm/ratan_container-origin
npm run test --workspace @fm/ratan_cashflow_blotter-origin -- src/compat/base.test.ts src/compat/design-controls.test.tsx src/compat/ratan-webkit-boundaries.test.ts
npm run build --workspace @fm/ratan_cashflow_blotter-origin
```

Cashflow currently has no active `typecheck` script. Use its existing build and
focused tests, plus relevant feature tests; do not invent a command or call a
nonexistent script a passed gate. Broaden consumer tests for shared provider,
theme, Dialog or dependency changes.

### Browser gates

```bash
npm run test:e2e:design-origin
```

This runner builds the package/catalog, packs and installs its fixture, starts
the standalone fixture/catalog servers and runs their browser tests. It is
separate from integrated portal validation.

For integrated checks, start the existing SCB Next dev stack in a separate
terminal using `npm run dev`, verify the services started successfully, and run:

```bash
npm exec -- playwright test tests/e2e/design-origin-host.spec.ts tests/e2e/mui5-compatibility.spec.ts
```

At `http://localhost:8001`, verify login, New Tile, tile rendering and workspace
tab removal. Include the extracted component's representative business journey.
Validate legacy/WebKit and light/dark at `1280x720` and `390x844`, plus additional
breakpoints where the changed surface needs them. Check overlays, keyboard
focus, contrast, asset requests, console errors and dimensions.

When global token CSS changes, run the existing CSS token browser spec with its
configured server prerequisites. `npm run verify:design-origin` provides an
aggregate gate, but does not replace Base unit tests, Base Storybook or the
integrated host checks above.

Review screenshot differences before accepting new baselines. Do not update
snapshots solely to clear a regression. For performance-sensitive changes, use
the existing host performance verifier and preserve its accepted budgets.

## Publication and rollback

Local extraction, tests and packed internal consumption can be completed
without publishing the package. Keep `private: true` until a reviewed release
has the owners, registry/visibility, asset approvals and retained artifacts
required by `UI_PACKAGE_RELEASE.md`.

Missing production Pro license ownership blocks release of the Pro integration;
it does not block unrelated core component extraction. Report registry/private
dependency access failures as environment blockers for their affected gates.

For each completed batch, retain the previous package revision and compatible
Base/bridge revision. To roll back, use those matching revisions in a clean
checkout, build the package before its consumers, and rerun the same gates.
Restore matching CSS/fonts and exact lockfile resolution. Preserve dirty
worktrees and avoid deploying mixed package/adapter versions.

## Definition of done

- [ ] Destination is the existing `scb-next/packages/ratan-design-origin` package.
- [ ] Every selected surface has a recorded disposition, contract and impact result.
- [ ] Already exported components were reused rather than duplicated.
- [ ] Reusable presentation has one package implementation and no application imports.
- [ ] Host policy remains in Base/consumer code and new appearance policy stays in new-styles.
- [ ] Public ESM exports, types and applicable optional entries are complete.
- [ ] Base paths, namespace shapes, props, events, supported refs and selectors remain compatible.
- [ ] Focused regression tests, meaningful stories and compiling fixture usage exist.
- [ ] Package coverage, types, lint, build, catalog, packed fixture and isolation gates pass.
- [ ] Affected Base/remote contracts and representative browser journeys pass.
- [ ] Legacy/WebKit light/dark typography, sizes, overlays and responsive geometry are accepted.
- [ ] Inventory, README, specification and changelog describe final ownership and behavior.
- [ ] An isolated commit and matching rollback revisions/artifacts are recorded.

## Starter instruction for an internal AI agent

Use this prompt together with the repository and this guide:

```text
Read docs/SCB_MFBASE_COMPONENT_EXTRACTION_TO_RATAN_DESIGN_GUIDE.md and the
repository instructions. Extract approved reusable presentation from
scb-next/web/mfe-base-origin into the existing
scb-next/packages/ratan-design-origin package. Use scb/web/mfe-base-origin
as read-only contract evidence. First inventory selected components and
verify existing package exports/adapters. Reuse already migrated surfaces.
Specify and test each new extraction before implementation, preserve
@fm/base imports and host policy, and complete one verified batch per commit.
Report actual commands, evidence, blockers and rollback revisions. Keep
the existing application runtime and deployment composition intact.
```
