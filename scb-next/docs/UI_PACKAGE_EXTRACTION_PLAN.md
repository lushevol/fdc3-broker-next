# Standalone SCB UI package: analysis and migration plan

Status: planning only; no application implementation changed.

Source inspected: `scb-next/web/mfe-base-origin`, sibling SCB applications,
workspace dependency policy, Storybook, and existing theme/token code.
Plan date: 2026-09-16.

## Goal and decisions

Create an independently consumable React design-system library that owns shared
visual styles, component behavior, and UX conventions. Applications should use
the library without importing the Base application or requiring its store,
authentication, services, router, analytics, or federation runtime.

Confirmed by the user: **SC WebKit tokens are the long-term source of design
values; preserve legacy styling during migration.**

Working assumptions pending the other questions:

- Preserve the current appearance and behavior during extraction; introduce
  visual changes as separately reviewed token/component changes.
- Retain MUI as the React implementation foundation initially.
- Target SCB applications first, but prove consumption by an independent React
  application installed from a packed package.
- Use versioned package releases and controlled application upgrades. Central
  ownership does not mean every deployed application changes immediately.
- Use `@scb/ui` and `@scb/ui-tokens` as provisional names, located under
  `scb-next/packages/`. Confirm scope, registry, and release owner before release.

If runtime-wide immediate updates or replacement of MUI is desired, revise the
distribution or implementation stages before starting them.

## Findings from the repository

| Evidence | Finding | Consequence |
| --- | --- | --- |
| `web/mfe-base-origin/src/root.tsx` | UI exports coexist with mounting, services, dispatchers, router, analytics, and application state. | A standalone package needs a new entry point; publishing this barrel would publish the application contract. |
| `web/mfe-base-origin/vite.config.ts` | This source is a Vite federation host sharing React and ReactDOM, not the root repository's older SystemJS setup. | Plan against SCB's current build and deployment configuration. |
| `web/mfe-base-origin/src/components/` | 42 nonempty component directories contain both reusable controls and portal features. | Classify by dependency and behavior, not directory name. |
| `web/mfe-base-origin/src/components/Button/index.tsx` | Button currently passes through MUI props and children. | Central styling belongs primarily in the theme; avoid manufacturing wrapper logic with no shared behavior. |
| `web/mfe-base-origin/src/theme/Config.ts` | Central MUI defaults and overrides already exist. | Extract and refine this existing design policy. |
| `web/mfe-base-origin/src/theme/index.tsx` | Theme selection reads user/token state and changes document classes/body styles during memoized computation. | Keep authentication policy in Base; give the library explicit theme inputs and controlled style effects. |
| `web/mfe-base-origin/src/theme/config/utils.ts` | `getTheme` reads `window.location.search` for `new-layout`. | Parse application URLs outside the library; make the theme factory pure. |
| `web/mfe-base-origin/src/new-styles/` and `theme/config/color*.ts` | Semantic aliases use SC WebKit variables; legacy aliases are retained. | Reuse this migration path; do not invent a competing color palette. |
| `web/mfe-base-origin/src/theme/config/light.ts` and `dark.ts` | MUI palette and many overrides still use literals; token adoption is partial. Baseline styles also lock body scrolling and text selection. | Full central control requires auditing remaining literals and separating portal-wide CSS from library defaults. |
| `web/mfe-base-origin/src/@types/index.d.ts` | Custom MUI theme types refer back into Base. | Ship declarations with the package; keep portal-only theme extensions in a temporary adapter. |
| `web/mfe-base-origin/src/components/Dialog/common/useController.ts` | Dialog reads workspace state, sends analytics, queries portal tab containers, and manipulates modal stacking. | Extract dialog presentation/interaction behind explicit props; leave workspace and telemetry decisions in Base. |
| `web/mfe-base-origin/src/components/Table/common/interface.ts` | Table uses `AdminRecord` plus verify/deactivate/save workflows. | This is an admin feature, not yet a generic data-grid component. |
| `web/mfe-base-origin/src/components/Snackbar/index.tsx` | A ReactNode-typed message is stringified and sanitized as HTML. | Specify text/React content versus legacy HTML behavior before publishing a public contract. |
| `web/mfe-base-origin/src/components/ScWebkit/index.tsx` | Web components use dynamic registration and browser globals. | Keep registration out of the core entry point; treat wrappers as an optional integration. |
| `scripts/verify-dependency-isolation.mjs`, `.npmrc`, application manifests | Base uses MUI 9; Ratan/Cashflow use MUI 5 with nested installation. | Do not declare one UI peer range spanning both majors or make MUI a cross-major singleton. |
| Ratan/Cashflow `vite.config.ts` and `src/compat/base.tsx` | `@fm/base` resolves to local compatibility implementations; Cashflow imports Base theme source directly, while Ratan constructs a simpler theme. | Updating Base exports alone will not migrate consumers or unify their UI. |
| `web/mfe-alpha-payments-origin/package.json` and `src/styles.css` | Alpha uses React and custom CSS with host theme-variable fallbacks. | It is a possible second consumer without a MUI 5 migration, but adds a MUI dependency and requires deliberate UX comparison. |
| `web/mfe-base-origin/stories/`, `.storybook/`, `vitest.config.ts` | Storybook and component tests already exist; coverage thresholds are 90% lines/branches. | Move relevant stories/tests and add public-interface checks rather than rebuilding documentation from scratch. |
| `scb-next/package.json` | Workspace membership and build order are explicit. WebKit dependencies use local `file:` overrides. | Add package workspaces and dependency-ordered builds; prove release artifacts work without sibling-source paths. |

The repository also contains an independent `@fm/ratan-design-legacy` package in
`mvp/two-layer-federation/realworld/packages/ratan-design`. Its current manifest
uses React Aria rather than MUI. Reuse useful packaging/testing conventions, but
do not merge these design systems as an incidental part of extraction.

### Analysis limitations

GitNexus reported a stale index. The required refresh was attempted but failed
with an inconsistent `const_fts` index; a flow query also failed. Findings above
are based on direct source and import inspection, not a validated graph blast
radius. Repair/rebuild the index and run symbol impact analysis before editing
functions, classes, or methods. No component tests or browser verification were
run for this documentation-only planning stage. Historical audit test results
are not treated as current verification.

## Target design

```mermaid
flowchart BT
  WK[SC WebKit token definitions] --> TK["@scb/ui-tokens: semantic roles and theme CSS"]
  TK --> UI["@scb/ui: provider, controls, feedback, shared patterns"]
  MUI[MUI and Emotion] --> UI
  UI --> BASE[Base portal adapters and features]
  UI --> APP[Independent React application]
  TK --> LEGACY[Legacy MUI 5 consumers during transition]
  UI -. after MUI compatibility migration .-> MFE[Ratan and Cashflow]
```

Start with two modules with separate interfaces:

1. **`@scb/ui-tokens`**: framework-independent semantic color, typography, spacing,
   radius, shadow, focus, and layering roles; explicit light/dark theme CSS.
   SC WebKit owns primitive values. This package owns the application-facing
   semantic mapping and only adds centrally defined roles where WebKit has gaps.
   Legacy aliases live in a clearly marked compatibility export.
2. **`@scb/ui`**: React provider, branded MUI theme, selected controls, and reusable
   interaction patterns. MUI and Emotion remain supported implementation
   dependencies. Expose useful MUI-compatible props initially; do not promise
   that consumers can later switch rendering libraries without API migration.

Date pickers can use a dedicated entry point with optional peer dependencies.
Keep Pro date-range functionality separately installable if it would otherwise
force Pro dependencies on all consumers. Delay separate grid, shell, and
web-component packages until the corresponding extraction is justified.

The important seam is **explicit presentation inputs and interaction callbacks**.
For example, a dialog receives open state, content, actions, close callbacks, and
an optional container. Base translates workspace state and records telemetry.
Do not move the Base store into a new shared provider merely to make extraction
compile.

### Theme and styling contract

- The library receives explicit mode and design-generation inputs. Base retains
  login-dependent dark-mode selection, query flags, persistence, and appearance
  subscriptions. Preserve the existing `newStyles=false` default in its adapter.
- Maintain `legacy` and `webkit` visual baselines during migration. An adapter
  maps existing flags to the new interface; choose the new package's default
  explicitly in the specification rather than silently changing Base.
- Make date localization independent of the core theme provider; ordinary
  buttons must not load date-picker code.
- Scope theme CSS to a documented root. Application-wide reset/body rules are
  explicit opt-ins owned by the host. Do not erase unrelated document classes.
- Define how portal-rendered menus/dialogs inherit theme variables, how a
  container is selected, and how multiple themed roots coexist.
- Replace `process.env.MFE_APP_PREFIX_STYLE` dependencies with stable package
  classes and internal slot names. Keep old selectors in compatibility adapters
  only where consumer inspection proves they are needed.
- Move theme augmentation into emitted declarations and test it in an external
  TypeScript consumer. Do not expose Base-derived types through the package.
- Audit MUI color manipulation before feeding CSS variable strings into palette
  operations. Use a supported theme-variable approach for the installed version;
  validate contrast, hover, disabled, and alpha-derived colors in both modes.
- Keep tokens canonical; application overrides use documented slots/variants
  and semantic roles. Review exceptions so raw `sx` values do not recreate drift.

MUI supports centralized defaults/overrides and brand themes; the proposed theme
module follows those existing mechanisms rather than duplicating them.
[Themed components](https://mui.com/material-ui/customization/theme-components/),
[Extensible themes](https://mui.com/material-ui/guides/building-extensible-themes/).

### Packaging and runtime contract

- Publish ESM and TypeScript declarations with an explicit export map and stable
  documented imports. Only add CommonJS if an identified consumer needs it.
- Keep React/ReactDOM, MUI, and Emotion external to the library build; declare
  tested peer ranges. Start with Base's React 18 and MUI 9 line, not an untested
  range that includes MUI 5 or React 19. Externalize subpath imports too.
- Expose CSS explicitly and mark its side effects correctly. Root imports must
  not mount applications, register web components, read storage, or access DOM
  globals. Core imports must not pull in Pro pickers, admin code, or services.
- Resolve WebKit distribution: consume approved published token assets, or
  produce a versioned stylesheet from the canonical WebKit build. The packed
  UI packages must not depend on repository-relative `file:` paths or an
  unpublished sibling checkout. Include required fonts/assets reproducibly.
- Build packages before applications; plain workspace iteration is not a
  substitute for dependency ordering. Keep the lockfile and isolation check.
- Keep UI libraries application-local initially, matching the existing SCB
  policy. Each application configures its provider from explicit appearance
  data. Do not rely on React singleton sharing to imply shared MUI/Emotion
  context identity. Test style insertion and portal theming across remotes.
- If runtime sharing is selected later, treat it as a separate distribution
  adapter with compatible dependency versions, rollout rules, and rollback.
  MUI 5 and MUI 9 must not be forced into one singleton share.

Vite library mode supports the build shape and external dependencies; Module
Federation's shared configuration controls dependency negotiation separately.
[Vite library build options](https://vite.dev/config/build-options),
[Federation shared dependencies](https://module-federation.io/configure/shared).

## Extraction inventory

| Group | Candidates | Required work |
| --- | --- | --- |
| First slice | Theme/tokens, Button, LoadingButton, Input, Select | Remove application environment assumptions; specify defaults, refs, labels, loading, errors, and disabled behavior. |
| Next controls | SearchInput, SearchButton, ResetButton, ToggleButton, Label | Align with core control contracts; retain useful composed behavior and centralize redundant styling. |
| Search patterns | SearchGrid, SearchCondition, SearchConditionContainer, BuilderButton | Document state ownership, wrapping/responsiveness, keyboard behavior, and composition. |
| Feedback | Loader/PageLoader, Snackbar | Replace portal types with package-owned types; define accessible status and notification content contracts. |
| Date controls | DatePicker, DateTimePicker, TimePicker; DateRangePicker separately | Own localization configuration and date types; avoid imposing Pro imports on core consumers. |
| Requires separation | Dialog, ErrorBoundry/FallbackError, Splash, Empty, TabItem/TabPanel | Extract reusable presentation only; retain workspace, error reporting, navigation, and loading orchestration in adapters. |
| Remain in Base initially | AppBar, Avatar/Profile, Drawer/NewTile/Tile, Switch/SwitchTime, Time, Timeout, Survey/SurveyButton, Version | These names represent portal-specific behavior. Pure visual pieces may move when a second use case is demonstrated. |
| Remain feature modules | Table, TableDetail and admin editors/actions | Preserve admin workflows; design a generic table interface separately if required. |
| Optional integration | ScWebkit wrappers and ReactWrapper | Specify explicit custom-element registration/events and browser-only loading independently of core UI. |

Retain old Base namespace/default exports through adapters where necessary. The
new package should use ordinary named component/type exports. Preserve existing
typos and prop translations only in legacy adapters; avoid adding them to a new
permanent public interface.

## Delivery stages and exit criteria

| Stage | Deliverables | Exit criteria |
| --- | --- | --- |
| 0. Specify and baseline | Confirm remaining decisions; record component contracts, consumer imports, dependency versions, visual states, and release ownership. Repair GitNexus and inspect impact for selected symbols. | First-slice scope is explicit; current tests/typecheck/build/Storybook results and known failures are recorded; legacy/WebKit screenshots captured. |
| 1. Package foundation | Token package and UI package scaffolding; exports, declarations, CSS/assets, builds, Storybook, checks, and clean-install consumer fixture. | Packed packages install/build without Base or sibling-source aliases; simple import needs no federation/server/store; core import excludes optional integrations. |
| 2. First vertical slice | Theme provider plus Button, LoadingButton, Input, Select; migrate one Base form and equivalent standalone fixture. Keep Base adapters. | Same controls work in Base and standalone; legacy and WebKit light/dark states match accepted baselines; theme/ref/type contracts pass. |
| 3. Shared patterns | Feedback/search/date controls in batches; decouple Dialog with explicit container and event contracts. | Each promoted component has public-interface tests and documented states; existing Base behavior remains verified. |
| 4. Application adoption | Remove duplicated compatibility UI in stages. Pilot Alpha if selected. Upgrade Ratan/Cashflow MUI compatibility independently before full UI adoption. | Each adopted application consumes package exports; obsolete cross-app theme imports disappear; its standalone and federated flows both pass. |
| 5. Release and governance | Versioning/changelog process, ownership, contribution guide, visual review, dependency constraints, deprecations, and upgrade instructions. | A reproducible versioned release can be consumed and rolled back; each migrated surface has one maintained implementation. |

The first useful implementation milestone is **Stage 2**, not extraction of all
42 directories. It proves central visual policy, reusable behavior, packaging,
and real adoption before tackling portal-specific complexity.

Use specification-first, test-first implementation for changed behavior. Run
GitNexus impact before symbol edits, report high-risk findings, and perform
change-scope analysis plus a focused commit for each verified stage.

### MUI 5 transition

Do not change all applications in the initial package commit. Legacy apps can
adopt semantic CSS roles while their MUI 5 implementations remain local. Full
`@scb/ui` adoption requires either a verified application upgrade to its supported
MUI line, or an explicitly scoped temporary legacy adapter with its own tests.
Prefer application upgrades over maintaining two full component libraries.
Update the dependency-isolation expectations only as each upgrade is completed.
Browser/OpenFin targets must be assessed during those upgrades as well.

## Verification and central UX ownership

- **Public behavior:** accessible labels, keyboard/focus movement, dialog
  Escape/close/drag behavior, input validation states, select interaction,
  loading/disabled controls, and notification announcements. Maintain the
  repository's greater-than-90% line and branch coverage requirement for the
  extracted implementation; coverage is not a substitute for these checks.
- **Visual regression:** legacy/WebKit × light/dark; narrow/wide layouts;
  hover/focus/disabled/error/loading; overlays and multiple themed roots. Fix
  focus visibility deliberately: current theme overrides suppress outlines.
- **Packaging:** clean tarball installation, declaration checking, explicit CSS
  loading, packaged fonts/assets, import without DOM globals, and bundle checks
  proving that a Button import excludes date/grid/admin/WebKit registration code.
- **Integration:** run the SCB stack at `http://localhost:8001`; sign in, open
  New Tile, render a tile, switch theme, exercise a form/dialog, and remove the
  workspace tab. Extend `tests/e2e/federation.spec.ts` for adopted surfaces.
  Verify production builds as well as development rendering.
- **Compatibility/performance:** run dependency isolation after installation,
  test separate MUI roots, record bundle/render baselines, and use representative
  interactions to validate the repository's performance targets. Set numeric
  bundle budgets from measured baselines rather than inventing them now.
- **Governance:** move reusable documentation into package Storybook. Assign
  design and engineering owners; review token and interaction changes centrally;
  document allowed variants, error/empty/loading states, and responsive rules.
  Enforce imports for adopted controls and prevent imports back into application
  source. Keep temporary exceptions explicit with a removal milestone.
- **Rollback:** pin a previous package version and rebuild the affected app;
  preserve existing style flags and legacy adapters until adoption is verified.
  Retire aliases after a declared deprecation window, not merely after Base is
  migrated.

## Remaining decisions

The following were asked during analysis and remain assumptions until answered:

1. Preserve existing UI on MUI, redesign during extraction, or replace MUI?
2. SCB-first reusable library, SCB-only, or multi-repository consumption from day one?
3. Versioned upgrades, runtime-wide updates, or both distributions?

Before release, also select the package scope/registry and accountable owners.
Before optional extraction, confirm whether Pro date ranges, admin grids, and
portal-shell presentation belong in the initial supported catalog. These do not
block specifying or validating the initial theme-and-controls slice.
