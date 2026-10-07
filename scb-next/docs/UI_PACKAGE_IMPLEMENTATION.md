# ratan-design-origin implementation contract

## Accepted interfaces

The extraction plan defines the test surfaces: existing Base component exports,
existing consumer compatibility exports, and standalone package imports. Existing
business screens must compile without import, prop, or callback changes.

## Requirements

### Application CSS token entry

- Export `ratan-design-origin/tokens.css` as an explicit, framework-independent
  stylesheet. Importing it defines tokens on `:root` so ordinary application CSS
  can use `var(--sc-...)` and the existing `--base-*` / `--theme-*` aliases without
  mounting a provider or importing JavaScript.
- Default to WebKit/light. Applications select dark mode with
  `<html data-mode="dark">` and legacy aliases with
  `<html data-generation="legacy">`; absent attributes select WebKit/light.
  Switching these attributes must recompute dependent token values.
- Generate the entry from the same source as scoped `styles.css`, preserving
  conditional rules, font assets, token values, and complete alias chains.
  Define only custom properties and font faces; do not apply document resets
  or element styling. Later `:root` declarations can override tokens without
  `!important`. Existing provider scopes remain independent.
- Ship the CSS and relative fonts in the package tarball. Verify CSS-only
  consumer bundling, all four appearance combinations, responsive values,
  and coexistence with scoped providers in a real browser.

Verification (2026-09-22): 112 package tests and five token-generation tests
pass; package coverage is 96.96% lines / 94.75% branches, and the global CSS
generator has 100% line/branch/function coverage. Typecheck, zero-warning lint,
build, and independent tarball verification pass, including a CSS-only bundle
with all 13 fonts and no JavaScript. Two Chromium tests cover document appearance
switching, inherited overlay tokens, responsive values, provider isolation, and
ordinary `:root` overrides. The localhost:8001 host smoke reaches login and tile
opening but Cashflow rendering is blocked by an unrelated `DateFormat` temporal
initialization error in `CashflowDetails/MultiExceptions/components/Affirmation`.

### Existing package requirements

1. Base and ratan-design-origin use Material/icons 5.18.0 and React 18. Existing
   consumer dependency declarations remain unchanged. Base uses Data Grid 6.20.4
   and date pickers 6.20.2, matching the installed legacy consumer matrix.
2. Preserve token aliases, legacy/newStyles defaults, both theme modes, and
   existing application state. Do not revert unrelated post-upgrade fixes.
3. The standalone package owns reusable controls and explicit theme/token entry
   points. It cannot import Base source, mount an application, fetch services,
   or require a portal store. React/MUI/Emotion are external peers.
4. Existing Base exports delegate to the package; consumer compatibility exports
   retain their existing contracts, including differing loading/dialog defaults.
5. Package installation from a tarball works without sibling source checkouts.
   Core imports exclude date/grid/Pro code and custom-element registration.
6. Verify labels, input changes, disabled/loading behavior, selector callbacks,
   theme output, and existing exports through the public interfaces. Use current
   UI as the visual baseline; do not silently redesign while extracting.

## Baseline before implementation

- Base typecheck: passes.
- Base tests: 341 pass, 2 fail (123 files). The two existing root-store fixture
  expectations omit newStyles; captured in /tmp/ratan-design-base-baseline-test.log.
- GitNexus FTS repair succeeded; full index rebuild is in progress before edits
  to existing symbols.

## Stage 1: restore Base to MUI 5

Implemented against target HEAD `ee17144e`. History reference `54319977`
predates the MUI-specific upgrades in `d0db574c`, `77359ffa`, and `a8c181bb`.
Only MUI-specific API adaptations were restored. Modern tooling, token
support, React 18, and the existing `newStyles=false` default remain intact.

### Dependency matrix

| Base dependency                    | Pinned version |
| ---------------------------------- | -------------- |
| Material and icons                 | 5.18.0         |
| Data Grid                          | 6.20.4         |
| Date pickers and Pro range pickers | 6.20.2         |

These versions match the installed legacy consumers. Ratan/Cashflow manifests,
business screens, imports, federation sharing, and appearance defaults are
unchanged. Their UI libraries remain application-local.

### Compatibility work

- Restore MUI 5 Grid `item`/`xs`, Dialog paper props, and Switch input props.
- Restore X 6 picker types and labels, single-input Pro ranges, and row-parameter
  value getters in the admin/detail flow and its fixtures.
- Accept original Input props and translate the current Base slot spelling,
  preserving label overrides, disabled state, helper descriptions, and refs.
- Correct existing store expectations to include `newStyles: false`.
- Complete the development login fixture with its missing `auth_time` claim.
  The browser regression originally crashed Profile with `Invalid time value`;
  the complete fixture renders the profile without changing production auth.

### Change-scope evidence

GitNexus FTS repair and full index rebuild completed before symbol edits.
Input, Dialog/DialogTitle, detail controller, and changed fixture impacts were
LOW with no indexed processes. InputStyled has two direct source-file
dependents (Input and Select), twelve total dependents, and no indexed process.
Direct source inspection shows broader UI use than the JSX call graph reports;
the full Base suite and integrated flows cover that limitation.

### Verification record (2026-09-17)

- Base strict typecheck passes.
- Base unit suite: 125 files, 353 tests pass. Coverage: 96.97% lines,
  93.33% branches.
- Base production build and Storybook build pass.
- Ratan and Cashflow production builds pass without consumer source changes.
- Root architecture/mock/deployment tests: 6 files, 60 tests pass.
- Dependency-isolation verification passes for Base, Ratan, and Cashflow on
  workspace-local MUI 5.
- Focused Input compatibility lint and `git diff --check` pass.
- Focused browser suite: 4 tests pass. Both style generations retain dark/light
  theme switching and 800x600 profile dialog maximize/restore/close controls.
- Integrated browser suite: 8 tests pass, 1 production-edge-only test skipped.
  Covers login, New Tile, Cashflow rendering across both federation boundaries,
  Alpha investigation, workspace deletion, and the MUI compatibility scenarios.

### Remaining limitations

- Full Base lint retains unrelated legacy debt: 8 errors and 138 warnings.
- Root workspace typecheck fails in Ratan because its `emitDeclarationOnly`
  configuration conflicts with the existing `tsc --noEmit` command. Base,
  Alpha, and the service typechecks pass.
- Narrow (390x844) login screenshots retain the existing fixed-column clipping.
  The login style source is unchanged; this restoration does not claim mobile
  responsiveness or introduce a redesign.
- Development console contains existing CSS/React warnings. Browser page-error
  assertions do not imply a warning-free console.
- Production-edge acceptance and clean corporate-registry installation were
  not verified by this stage.

## Next stage

Stage 2 implements the standalone foundation and first controls slice below.
Stage 1 establishes the compatible MUI prerequisite; neither stage completes
the remaining shared-pattern, remote-adapter or release-governance work.

## Stage 2 implementation specification

- Publish `ratan-design-origin` from `packages/ratan-design-origin` as ESM with
  declarations and explicit root, theme, tokens, compatibility, and CSS exports.
  React 18, Material/icons 5.18, and Emotion 11 are external peers.
- Root exports Button, LoadingButton, Input, Select, and RatanDesignProvider.
  Controls preserve Base defaults and accept MUI 5 props. Button and
  LoadingButton forward button refs; Input forwards root and input refs.
  Select retains its existing variant/size/callback contract and associates its
  visible label with the combobox using a generated id when none is supplied.
- Provider defaults to light/legacy. Mode and designGeneration are explicit
  inputs; it owns a scoped root and scopes its menus/popovers to that root.
  It never changes document classes, storage, body scrolling, or user selection.
  Hosts load `styles.css` explicitly for canonical WebKit variables and fonts.
  Legacy and WebKit alias declarations also live in that scoped stylesheet;
  they avoid Emotion's `label:` parsing of CSS variable names.
- Share existing palette, typography, compact defaults, and input styling.
  Intentional accessibility corrections: associate Select's visible label and
  restore a 2px primary-color keyboard focus ring on MUI button actions.
  Base retains portal extensions, global reset, Data Grid styles, date
  localization, authenticated appearance policy, and query parsing.
- Package owns existing semantic WebKit mappings and legacy aliases.
  Generate a scoped stylesheet from canonical WebKit 2.0.5 CSS with source
  hashes and packaged WOFF2 fonts; no runtime sibling-source dependency.
- Existing Base default/namespace exports and InputStyled stay supported via
  adapters. Consumer business source/manifests and compatibility loading/dialog
  defaults are unchanged in this stage.
- Verify public control behavior and >90% line/branch coverage, emitted types
  in a clean tarball fixture, SSR import without DOM globals, bundle exclusions,
  all four appearance combinations, scoped overlay inheritance, narrow/wide
  control layouts, existing Base tests, and the integrated host journey.

### Stage 2 delivered scope

`packages/ratan-design-origin` builds independently as ESM and declarations.
Base delegates its four controls, compact theme defaults, shared MUI overrides,
semantic tokens and compatibility aliases to the package. Portal reset, login
styles/policy, grid styles, date localization, store and services remain local.
Ratan/Cashflow business source, dependency manifests, compatibility loading and
dialog defaults, and federation sharing are unchanged.

Scoped stylesheet generation uses PostCSS and TypeScript parsers rather than
editing the canonical WebKit distribution. The committed assets include source
hashes and 13 WOFF2 fonts. Ordinary builds and packed consumers need no sibling
checkout. Corporate font licensing, registry and release owners are pending;
this is an internal candidate, not a published or publicly redistributable release.

Base's legacy TypeScript resolution is supported through `typesVersions`.
Its compiler and Vite/Vitest configuration resolve the application-local MUI
types/runtime consistently across the workspace symlink. This does not change
cross-application federation sharing. Development startup, ordinary builds and
production builds prepare the package before applications.

### Stage 2 verification (2026-09-17)

- Package public-interface suite: 13 tests pass; 100% lines and branches.
- Package strict typecheck, lint, ESM/declaration/asset build and Storybook pass.
- Independent tarball install from the public npm registry passes strict
  declaration checks with modern and legacy TypeScript resolution. The fixture
  explicitly installs `@emotion/sheet` for an upstream Emotion declaration
  dependency; `skipLibCheck` is false.
- Packed CSS is root-scoped, contains no sibling stylesheet imports, and all
  13 font assets are present. DOM-free bundled SSR imports and renders the
  controls. Button-only external-peer bundle is 679 bytes and excludes provider
  token CSS, grid/date/Pro/admin code and bundled React.
- Independent browser suite: 9 tests pass, covering both generations/modes at
  390px and 1280px, select callbacks/scoped overlays, loaded WebKit fonts,
  validation/loading/disabled states, no horizontal overflow/control overlap,
  screenshots, and visible keyboard focus. Desktop/mobile screenshots inspected.
- Base public suite: 125 files / 353 tests pass; 96.96% lines, 93.28% branches.
  Base strict typecheck and Storybook pass. Root suite: 60 tests pass.
- Dependency-isolation check and all SCB workspace production builds pass;
  the production build entry point includes package-first ordering.
- Host browser checks pass for login, New Tile, Cashflow rendering/deletion,
  both legacy/WebKit theme/dialog flows, and the second federation boundary.
- GitNexus refresh succeeds after FTS repair. Staged scope analysis reports
  LOW risk, 77 text files, 88 indexed symbols and no affected execution flows.
  JSX and workspace-import call-graph limits remain; source scope, compiler,
  public-interface tests and browser journeys were checked independently.

### Remaining work and limits

Stages 3-5 remain open: additional reusable patterns, central Ratan/Cashflow
adapter rewiring and cross-app theme-import removal, catalog adoption, ownership,
versioned releases and rollback governance. Legacy Poppins remains host-supplied.
No performance latency guarantee is claimed.
Stage 1's existing lint/mobile-login/console/typecheck limitations remain.
Production-edge acceptance and a corporate-registry clean install were not run.
Workspace dependency installation reported 44 audit findings (21 moderate,
23 high); audit triage is a release prerequisite, not an automatic bulk upgrade.

## Stage 2.1: distinct SC GDS WebKit generation

The first Stage 2 implementation scoped SC WebKit variables but still built the
MUI theme from the legacy palette and Poppins typography. This made the legacy
and WebKit controls visually identical. The WebKit theme now maps MUI 5 to the
SC GDS visual language while the one-argument theme helper and provider default
remain legacy-compatible.

- WebKit uses SC Prosper Sans and GDS light/dark palettes and surfaces.
- Contained and outlined buttons consume SC button state variables, use the GDS
  32px control height, 6px radius and visible focus treatment.
- Outlined inputs and selects consume SC form background, border, focus, error,
  disabled, label and placeholder variables at the GDS 32px height.
- Legacy retains the extracted appearance and existing Base adapter behavior.
- Unit coverage asserts the generation mapping; the independent browser matrix
  asserts distinct computed typography, primary color and control dimensions.

## Stage 3 progress: composed controls batch 1

SearchInput, SearchButton, ResetButton, ToggleButton and Label now live in
`ratan-design-origin`. Base keeps its existing module paths, default exports,
named prop types, `modeStyle`, and Label `MenuItem` export through thin adapters,
so existing screens and stories require no import or prop changes.

The package public suite covers search clearing, loading suppression, reset
actions, light/dark style branches, toggle selection and label selection. The
packed-consumer fixture compiles every new public export, and Storybook exposes
the batch beside the first-slice controls. Remaining Stage 3 work includes the
search layout patterns, feedback controls, date entry points and the reusable
presentation portion of Dialog.

### Stage 3 batch 2 specification: search layout patterns

- Move `SearchGrid`, `SearchCondition` and `SearchConditionContainer` into the
  standalone package as public components with their MUI 5 prop contracts.
- Keep Base's default exports and its existing `modeStyle` and
  `modeBorderStyle` named exports through compatibility adapters. The package
  uses unambiguous public names for those helpers because `ToggleButton`
  already exports `modeStyle` from the package root.
- Preserve the legacy layout, close callback, collapsed 49px container,
  expand/collapse action and caller prop precedence. WebKit generation colors,
  borders, spacing and radii consume the package's SC token aliases.
- Cover close removal, callback forwarding, expand/collapse state, enforced
  layout defaults, helper outputs and both design generations through package
  public-interface tests. Compile the new exports in the packed-consumer
  fixture and expose the composed pattern in Storybook.

### Stage 3 batch 2 delivery and verification (2026-09-18)

`SearchGrid`, `SearchCondition` and `SearchConditionContainer` now live in
`ratan-design-origin`. Base delegates through thin adapters and retains its
default exports plus the existing `modeStyle` and `modeBorderStyle` aliases.
The package root exposes uniquely named style helpers to avoid colliding with
the existing ToggleButton helper. Legacy host themes without `theme.ratan`
metadata default safely to the legacy generation.

Legacy dimensions, prop precedence, close behavior and collapse behavior are
unchanged. WebKit generation surfaces, text, borders, spacing, radii and action
states use semantic SC token aliases. The packed-consumer contract and
Storybook catalog compile and render the composed search pattern.

- Package public suite: 21 tests pass with 100% lines and branches.
- Package strict typecheck, lint, ESM/declaration build and Storybook pass.
- Independent tarball verification passes modern and legacy TypeScript
  resolution, consumer build, external-peer bundling and DOM-free SSR.
- Base strict typecheck, production build and Storybook pass.
- Base public suite: 125 files / 353 tests pass; 96.91% lines and 93.40%
  branches. Existing test-runner, mock-network and timer warnings remain.
- Required host journey passes: login, New Tile, Cashflow render and workspace
  tab deletion. The combined launcher still hits the existing Alpha API
  `EMFILE` watcher limit, so the verified journey used the Base, Ratan and
  Cashflow hosts directly.

Remaining Stage 3 work includes feedback controls, date/time entry points and
the reusable presentation portion of Dialog. Later stages still cover central
Ratan/Cashflow adapter rewiring, catalog adoption and release governance.

### Stage 3 batch 3 specification: feedback controls

- Move Loader, PageLoader and Snackbar presentation into the package root.
  Package-owned loader props accept text, numeric/CSS dimensions and native
  section attributes without importing Base types. Preserve the legacy SVG,
  90px default/cap, optional visible text and full-page positioning. Expose one
  accessible loading status with a default label and decorative SVG.
- Keep Base module paths, prop exports and test identifiers through adapters.
  Package styles use stable classes; no application environment is read by the
  package. Legacy colors/layout remain intact; WebKit uses SC semantic roles.
- Package Snackbar renders its message as React content: strings are plain text
  and React elements retain interaction. It never interprets HTML. Base alone
  preserves its existing stringification and DOMPurify HTML sanitization.
  Retain severity/variant, alert styling, action, close reasons, auto-hide and
  caller Snackbar props. Retain the 50px scrollable message region.
- Verify package public imports and Base compatibility exports, including safe
  content, notification actions, close/timeout callbacks, loader labels/sizing,
  legacy fallback and both WebKit modes. Include packed declaration/SSR checks
  and Storybook feedback states, then run Base and host acceptance checks.

### Stage 3 batch 3 delivery and verification (2026-09-18)

Loader, PageLoader and Snackbar presentation now live in `ratan-design-origin`.
Base retains its default exports, loader prop namespace, notification prop type
and test identifiers through compatibility adapters. Loader props no longer
import the Base store model. Loading status is announced even without visible
text; the SVG is decorative. Stable package classes replace the environment
prefix in presentation styles, with legacy test identifiers kept in Base.

Package Snackbar renders plain text and React content without HTML parsing.
Base retains its existing DOMPurify sanitization and message stringification.
The package preserves notification actions, close/timeout callbacks, severity,
variant and styling overrides, with a single accessible alert. WebKit loading
colors and notification radii use SC semantic tokens; legacy layout and color
values remain intact. Explicit Emotion/MUI types keep emitted declarations free
of nested installation paths.

- Package: 26 public-interface tests pass, 100% lines and branches; strict
  typecheck, lint, ESM/declaration build and Storybook build pass.
- Independent tarball: modern and legacy TypeScript resolution, production
  build, external-peer/tree-shaking checks and DOM-free SSR pass. SSR now renders
  all three feedback controls. Used a temporary npm cache after the default
  cache rejected writes; no user cache ownership changes were made.
- Base: 126 files / 354 tests pass, 96.89% lines and 93.36% branches. Strict
  typecheck, production build, Storybook build and changed-file lint pass.
  The added compatibility test preserves formatted HTML while rejecting script
  and event-handler injection and exercising notification actions/dismissal.
- Required host Playwright journey passes: login, New Tile, Cashflow fixture
  render, add workspace and delete the Cashflow workspace. Chromium required
  execution outside the macOS sandbox. The initial cold-start attempt timed out
  waiting for the tile; the warm rerun passed in 6.6 seconds without code changes.
- Storybook visual check: WebKit dark loading/notification and dismissal pass;
  WebKit light long-message notification at 390px has no horizontal overflow and
  retains a scrollable message region. Existing Base console warnings remain.
- GitNexus FTS repair and index rebuild succeed. The selected feedback symbols
  and style roots have LOW reported impact with no indexed callers/processes;
  JSX/import graph limitations are covered by public tests and the host journey.

Remaining work: BuilderButton, dedicated date/time and Pro range entry points,
Dialog presentation, central Ratan/Cashflow adapter rewiring, catalog completion
and release governance. The pre-existing `scb-next/package-lock.json` change is
excluded from this stage.

### Stage 3 batch 4 specification: BuilderButton

- Package owns BuilderButton and its tab composition helpers. Base preserves
  its default export, BuilderButtonProps, TabPanel, a11yTabPanelProps, emptyFunction,
  Tabs and Tab through a compatibility re-export. Root package names use the
  Builder prefix for tab exports to avoid future collisions.
- Keep caller-owned anchorEl/open state, Table/Filters icons, enforced outlined
  variant/primary color/start icon, caller end-icon precedence, popover dimensions,
  tab visibility and mounted children. Preserve legacy styling; WebKit uses SC
  semantic colors/spacing. Scoped provider overlays remain inside their root.
- Generate the button/popover relationship with React useId for stable SSR and
  hydration. Do not publish the former randomUUID implementation as a contract.
- Scope border-box sizing to builder tabs, panels and footer so standalone
  consumers need no document reset for correct popover content sizing.
- Verify opening/closing through the caller's state, both labels and tab helpers,
  keyboard tab navigation, unique popover IDs, dimension overrides, all theme
  generations/modes, and Base exports. Include Storybook and packed-consumer
  declarations/SSR plus the full Base suite and host journey.

### Stage 3 batch 4 delivery and verification (2026-09-18)

BuilderButton and its tab composition now live in the package; Base delegates
through compatible default/named exports. Caller anchor state, labels/icons,
dimension overrides and inactive mounted panels are preserved. React useId
provides stable trigger/popover relationships. MUI polymorphic tab contracts and
refs compile in the independent consumer. Builder tabs/panels/footer explicitly
use border-box sizing to avoid depending on Base's document reset.

Storybook browser verification exposed MUI 5 CommonJS icon-subpath interop that
unit tests did not catch. Builder and its existing composed search controls now
use named MUI icon imports, preserving appearance and behavior while rendering
correctly in the standalone production catalog.

- Package: 30 tests, 100% lines/branches; typecheck, lint, ESM/declaration build
  and production Storybook pass.
- Independent tarball: modern/legacy TypeScript resolution, consumer production
  build, external peers/tree shaking and DOM-free SSR pass; builder included.
- Base: 126 files / 354 tests pass, 96.88% lines and 93.34% branches. Strict
  typecheck, production/Storybook builds and changed-builder lint pass.
- Host Playwright login, New Tile, Cashflow render, add/delete workspace pass.
- Production Storybook: builder opens, switches tabs, supports arrow-key focus
  and closes from Apply; WebKit light desktop and dark 390px screenshots inspected.
  Footer/input fit; narrow document scroll width equals viewport width (390px).
- GitNexus FTS repair/index refresh succeeds. Builder and affected search-control
  imports report LOW impact, no affected runtime processes. Tab helper impacts
  are confined to stories/test composition and Base exports.

Stage 3 still requires date/time/optional Pro range entry points and Dialog
presentation. Consumer adapter integration and catalog/release governance remain
open. The unrelated lockfile modification is excluded from this stage.

### Stage 3 batch 5 specification: optional date integrations

- `ratan-design-origin/dates` owns DatePicker, DateTimePicker and TimePicker,
  their Dayjs prop types, LocalizationProvider and AdapterDayjs exports. Hosts
  choose locale, timezone and localization configuration explicitly.
- `ratan-design-origin/date-range` owns the Pro single-input range picker.
  X pickers 6.20.2 and Dayjs are optional peers; core/theme/compatibility must
  remain usable without date dependencies. Pro licensing belongs to the host.
- Preserve Dayjs conversion, default top/optional left labels, hidden styles,
  callback signatures, default shrink and caller slotProps precedence. Range
  keeps its single-input field and ignores caller slots as Base currently does.
- Base keeps default exports, prop-type paths and environment test identifiers.
  The shared package styles must not rely on Base's global CSS or store.
- Verify the agreed public package and Base compatibility interfaces with real
  picker controls: values, edits/callbacks, calendar selection, hidden/disabled
  state, label layout, locale and overrides. Include independent packed consumers
  with and without optional peers, declarations/SSR, catalog and host checks.

### Stage 3 batch 5 delivery and verification (2026-09-18)

DatePicker, DateTimePicker and TimePicker now live in the `dates` integration;
DateRangePicker lives in the separate optional Pro `date-range` integration.
Their identical styles share a package helper. Base retains its default/type
paths, environment prefix constants, label classes and picker prop precedence.
Base's existing host dependency deduplication now includes date libraries and
Dayjs, avoiding a second React/localization context through workspace installs.

- Package: 38 tests pass, 100% lines/branches; strict typecheck, lint, ESM and
  declaration builds and production Storybook pass.
- Independent packed consumer: core works without installed date/Pro/Dayjs
  peers; modern and legacy declarations pass before and after explicit date
  installation. Core production/SSR/tree shaking and DOM-free date SSR pass.
  Fixture explicitly includes optional/dev dependencies during installation to
  prevent npm pruning optional peer types during the second install.
- Base: 127 test files / 355 tests pass; 96.87% lines and 93.22% branches;
  typecheck, production/Storybook builds and changed date-source lint pass.
- Host acceptance login, New Tile, Cashflow render and workspace deletion pass.
- Catalog screenshots inspected: WebKit light top labels on desktop, WebKit
  dark left labels at 390px; all fields and the full-width range fit without
  document overflow. Calendar selection updates the controlled date. Existing
  legacy appearance is preserved and no global reset is required.
- GitNexus reports LOW component/style impacts, no runtime processes; prop
  types affect one or two direct Base/story dependents. JSX graph limitations
  are covered by compatibility tests and the integrated host journey.

MUI X 6 ignores top-level picker data attributes in both former Base and package
implementations; supported field identifiers use text-field input slot props.
No Pro license is bundled or initialized. Existing development license notices
remain; production licensing and font redistribution still belong to release
governance. The unrelated lockfile remains byte-for-byte unchanged by this stage.

### Stage 3 batch 6 specification: Dialog presentation

- Package Dialog composes a controlled MUI surface, title/close action, content
  and footer. Open/container, sizing, header replacement, refs and interaction
  handlers are explicit props; it reads no Base state or document policy.
- Base keeps its existing controller for workspace lookup, telemetry, dragging,
  resizing/maximize, tab overflow, positioning and modal stacking. Its adapter
  supplies those inputs to package presentation and retains existing defaults,
  classes, test identifiers, close semantics and title/action visibility.
- Package compatibility exports own the legacy Dialog root/title presentation.
  Preserve legacy appearance; WebKit title actions use semantic tokens. Drag
  integration remains host-owned through MUI PaperComponent.
- Verify public package composition, title/content/footer overrides, close and
  keyboard callbacks, disabled close and controlled maximize/resize actions;
  verify Base's existing integration suite and independent declarations/SSR.

### Stage 3 batch 6 delivery and verification (2026-09-18)

Package Dialog owns the controlled title/content/footer composition and explicit
header, surface-adornment, ref and lifecycle inputs. Compatibility exports own
Base's legacy root/title presentation. Base's controller, drag integration,
workspace lookup, analytics, resize/positioning and modal stacking remain in
Base; its adapter supplies those inputs and preserves legacy classes/test IDs.
WebKit title actions and resize styling use semantic tokens.

An initially open dialog exposed an overlay ordering issue: a ref-backed root
can still be null when MUI resolves its container. The provider now announces
its attached root through a presentation-only context and scoped Dialog waits
for that root before opening. This also prevents stale aria-hidden ancestors
when a modal moves from the body. Explicit host containers still take precedence.
Server rendering remains DOM-free; a provider-scoped portal waits for mount,
while standalone disablePortal rendering retains server content.

- Package: 45 tests, 100% lines/branches; typecheck, lint, ESM/declarations,
  production catalog and independent packed consumer all pass. Packed proof
  includes standalone Dialog SSR and unchanged core-without-optional-peers checks.
- Base: 127 files / 355 tests pass; 96.86% lines and 93.15% branches; strict
  typecheck, production/Storybook builds and changed Dialog lint pass.
- Host login, tile creation/render and workspace deletion pass.
- Catalog screenshots inspected: desktop WebKit light and 390px WebKit dark;
  dialog width is 326px on mobile with no document overflow. Escape and close
  controls dismiss; focus returns to the trigger.
- GitNexus component/title/style/provider/theme impacts are LOW with no runtime
  processes; local composition helpers have one direct dependent each. Graph
  limitations are covered by public composition tests and the existing Base suite.

Stage 3 shared-pattern implementation is complete. Stage 4 consumer adapters,
the remaining inventory classification, and release governance remain open.

### Stage 4 specification: central consumer adoption

- Ratan/Cashflow keep existing namespace/default compatibility exports and
  business screen imports. Button preserves `type="primary"` translation.
  LoadingButton preserves its 16px start-icon spinner and caller startIcon in
  the idle state; package adds explicit startIcon presentation to own this
  reusable pattern without changing Base's inline loading default.
- Consumer Loader preserves its MUI circular progress presentation through a
  package Spinner primitive. Portal splash/error orchestration remains local.
- Consumer Dialog delegates title/content/footer composition to package Dialog
  and keeps open=true, forced portal, viewport size constraints, PaperProps and
  Escape/close behavior in its adapter. Do not impose Base's drag or 400px defaults.
- Cashflow's full legacy theme and Base's matching factory/styles move to an
  opt-in `portal-theme` entry point, retaining extensions, resets and grid
  overrides for existing hosts. It accepts explicit appearance/layout flags
  and performs no URL/storage/DOM reads. Core remains free of those policies.
  Base/Cashflow adapters retain URL parsing; Ratan preserves its simpler theme.
- Verify unchanged compatibility exports and public packed package interfaces,
  existing consumer tests/builds, Base regression suite, isolation audit and
  standalone/federated browser workflows. No business-screen changes are allowed.

### Final inventory specification: presentation and portal boundaries

- Promote EmptyState, ErrorFallback and LoadingOverlay as controlled, content-
  driven presentation. Hosts supply illustrations, copy, actions and visibility.
  Base retains drawer/loading dispatch, telemetry, support-address selection,
  mailto construction and its error boundary. Preserve existing markup/classes,
  default copy and visual layout through explicit slot props and host wrappers.
- EmptyState composes illustration, title, description and action with explicit
  content/wrapper slots. ErrorFallback composes a title and optional detail/action
  in a padded section. LoadingOverlay renders a controlled backdrop; it performs
  no navigation or loading orchestration and announces supplied status content.
- Keep ErrorBoundry's class-based capture mechanism local: it owns portal error
  state/support routing and is not a reusable function component. Its fallback
  presentation becomes package-owned. Consumer-specific error/splash copy stays
  in existing adapters.
- Keep TabItem/TabPanel in Base. TabItem accepts Workspace records and curried
  portal edit/delete/refresh callbacks, reads layout policy and intentionally
  blurs the workspace name. TabPanel calls setTabPanel to schedule mounting,
  visibility and activation across cached remote applications. These contracts
  describe workspace lifecycle, not generic tabs. Package BuilderTabs/BuilderTab/
  BuilderTabPanel already provide independently usable tab presentation; extracting
  another workspace API would move domain coupling into the library.
- Optional ScWebkit/ReactWrapper registration, admin tables/editors and the
  inventory's portal-specific controls remain intentionally outside core.
  Record these dispositions explicitly in the final inventory and catalog.

### RD-001 specification: LoadingOverlay hit testing

- LoadingOverlay remains a controlled presentation surface. While `open` is
  true, its full host-supplied region blocks pointer interaction and announces
  the supplied status content. This applies while the backdrop is entering and
  fully visible.
- When `open` becomes false, the overlay root no longer participates in pointer
  hit testing, including while the backdrop exit transition is finishing. The
  underlying interface is immediately available to pointer and keyboard input,
  and the loading status is absent.
- Root element selection, sizing, custom styles, backdrop options and host
  portal/container policy remain caller-owned. In particular, Base's Splash
  continues to render LoadingOverlay permanently open inside its existing
  error boundary and full-viewport root.
- Verify the public package contract for open/closed status and root hit-testing,
  then verify through the packed consumer that an underlying action cannot be
  activated while open and can be clicked and keyboard-activated after close.

### RD-002 specification: DateRangePicker endpoint values

- `DateRangePicker` remains a controlled optional-Pro integration whose value is
  a two-element Dayjs range. Each endpoint independently accepts `Dayjs | null`:
  `[null, null]`, `[Dayjs, null]`, `[null, Dayjs]` and a complete Dayjs range are
  valid public values.
- Preserve each `null` endpoint when forwarding the value to MUI X. Never pass a
  `dayjs(null)` invalid date in its place. Continue normalizing non-null endpoints
  with Dayjs for compatibility with Base callers that historically supplied
  parseable date-like values despite the narrower public TypeScript contract.
- Clearing through the public single-input field reports `[null, null]` through
  `onChange`. Empty and partial values must not report `invalidDate` for their
  null endpoints through `onError`; non-null endpoint validation remains MUI X
  and host policy.
- The single-input field, label/layout behavior, callback signatures, caller
  localization, optional peer boundary and host-owned Pro licensing remain
  unchanged. Verify the public component and the packed optional-peer consumer.

### RD-003 specification: community date control ownership

- `DatePicker`, `DateTimePicker` and `TimePicker` preserve MUI X's value ownership
  contract. Omitting `value` forwards `undefined`, leaving the picker uncontrolled
  so `defaultValue` initializes its field and subsequent edits update internal
  state. An explicit `value={null}` remains a controlled empty field. A non-null
  Dayjs `value` remains controlled and follows caller updates.
- Uncontrolled default-value fields publish edited Dayjs values and publish
  `null` when cleared. The wrapper must not switch their ownership mode during
  their lifetime or emit controlled/uncontrolled warnings.
- Continue normalizing non-null controlled values with Dayjs for Base compatibility.
  Caller-provided `defaultValue`, localization, timezone, formats, validation,
  callbacks, label/layout and hidden styles remain MUI X or host-owned behavior.
- Verify all three public wrappers, their packed optional-peer declarations and
  SSR runtime, matching Base adapters, and the integrated host journey.

### RD-004 specification: SearchInput clear action

- `SearchInput` exposes its clear control as a named button. Its default accessible
  name is `Clear search`; callers localize or add field context through the public
  `clearButtonLabel` prop without replacing the icon or clear callback contract.
- The clear action is enabled only while the effective input is editable. A
  top-level disabled field, a read-only MUI input slot, or a read-only native input
  slot disables the clear button and prevents pointer or keyboard activation from
  calling `handleClear`. Existing legacy `InputProps`/`inputProps` spellings and
  modern `slotProps` spellings follow the Input component's precedence.
- An enabled clear action invokes `handleClear` once per pointer click or keyboard
  activation and retains normal button focus behavior. The caller continues to own
  the field value; SearchInput does not mutate it internally.
- Verify the public component, generated declarations, Base's direct re-export,
  packed-consumer pointer/keyboard behavior and an accessible-name browser check.

### RD-005 specification: Label and Select accessible names

- `Select` owns a stable control ID when callers omit `id`. Its visible
  `InputLabel` references that control through `htmlFor`; the MUI custom select
  also references the label through `labelId`. Caller-supplied `id` and `labelId`
  remain authoritative, and repeated instances receive distinct generated IDs.
- The same relationship names native and custom selects. Native mode must not
  depend on MUI's custom-select `labelId` behavior, and adding the generated ID
  must not change values, callbacks, variants, refs or label positioning.
- `Label` uses a string or numeric `label` as its default accessible name while
  retaining the label value and hidden-menu-item behavior. Caller-supplied
  `aria-label` or `aria-labelledby` remains authoritative; non-text labels require
  one of those explicit naming props.
- Verify unnamed/generated, explicit-ID and repeated Select instances, the
  Storybook `Group by` Label pattern, Base's existing adapters, packed-consumer
  browser roles and the absence of unnamed comboboxes.

### RD-006 specification: loading announcements

- `LoadingButton` keeps the action name supplied by its children or explicit ARIA
  props. While `loading` is true, both inline and start-icon positions disable the
  action and expose `aria-busy="true"`; when loading ends, the busy state is absent
  and the caller's explicit disabled state and start icon remain authoritative.
- `SearchButton` follows the same named-button busy contract for its current inline
  loading presentation. RD-012 separately owns its advertised `loadingPosition`
  behavior and DOM prop leak; this stage must preserve that follow-up's scope.
- Circular progress indicators inside these named buttons are visual decoration:
  they remain rendered and sized but use `aria-hidden="true"`, so the button's busy
  state is the only announcement and no unnamed or duplicate progressbar is exposed.
- Verify loading start/end, action names, disabled/click behavior, both
  LoadingButton positions, SearchButton, Base's direct adapters and packed-browser
  accessibility trees.

### RD-007 specification: collapsed search criteria

- `SearchConditionContainer` keeps every criterion mounted so caller and child
  state survives expansion changes. While collapsed, criteria that fit completely
  in the first visible row remain exposed and interactive; criteria in clipped
  rows are `aria-hidden` and inert, so pointer and sequential keyboard navigation
  cannot activate invisible actions.
- The toggle has the state-specific accessible name `Expand search criteria` or
  `Collapse search criteria`, exposes `aria-expanded`, and controls the effective
  container ID. A caller-supplied `id` remains authoritative; otherwise the
  component generates a stable, hydration-safe ID.
- Collapsing from the toggle retains focus there. If a viewport/zoom/layout change
  hides the currently focused criterion, focus moves to the toggle before that
  criterion becomes inert. Expanding restores interaction without remounting.
- Verify first-row and clipped-row behavior with real layout at 390px and 1280px,
  including Tab/Shift+Tab, edit/close behavior, expand/collapse and retained child
  state. Preserve the 49px legacy collapsed height and host theme policy.

### RD-008 specification: Dialog title relationships

- Resolve the effective dialog name and title ID once. Explicit caller
  `aria-labelledby` and `aria-label` props remain authoritative; an explicit
  `aria-label` suppresses the package's implicit title relationship unless the
  caller also explicitly supplies `aria-labelledby`. `PaperProps` names retain
  their MUI behavior and are applied to the role-bearing dialog paper.
- For the package-rendered header, `titleProps.id` is the effective title ID when
  supplied; otherwise use one stable generated ID. The dialog references that ID
  only when a non-null title is mounted. Multiple dialogs must receive unique IDs.
- For a custom `header`, adopt its explicit `id` when it is a valid React element.
  A custom header without an ID and `header={null}` produce no implicit
  `aria-labelledby`; callers name those dialogs explicitly when needed.
- Verify default/custom/suppressed headers, caller naming precedence, multiple
  dialogs, focus entry and portal rendering through the public package and Base
  adapter contracts. No dangling `aria-labelledby` token may remain.

### RD-009 specification: Builder instance tab relationships

- Each `BuilderButton` supplies its nested `BuilderTab` and `BuilderTabPanel`
  components one stable React `useId` namespace. Generated tab IDs, panel IDs,
  `aria-controls` and `aria-labelledby` use that shared namespace, so callers do
  not coordinate global IDs and concurrent Builders cannot collide.
- `builderTabProps(index)` retains its legacy `id`/`aria-controls` output for
  consumers that use Material tabs directly. When used with package `BuilderTab`
  inside a `BuilderButton`, its index metadata selects the Builder namespace;
  manually supplied tab and panel ID/relationship props remain authoritative.
- Panels remain mounted when inactive and keep their descendants' values. MUI
  keyboard tab selection remains controlled by the caller's `value`/`onChange`.
  React-generated namespaces must be stable for SSR hydration. MUI Popover
  portals omit tab/panel children from server output, so hydration validation
  covers the rendered Builder trigger relationship; the public runtime regression
  separately verifies generated tab/panel relationships.

### RD-010 specification: shared field state

- `Input` resolves `disabled` once, honoring its established modern slot
  precedence over legacy `InputProps`/`inputProps` spellings and the root prop.
  The resulting boolean is applied to the TextField/FormControl and native input,
  so its label, control semantics and appearance cannot disagree. `required`
  follows the same root/legacy/modern precedence through the native input props.
- `error` remains a field-level Input prop and is applied to the TextField so MUI
  propagates its semantics and styling to its label and input. Callers can still
  add non-state attributes through existing legacy and modern slot props.
- `Select` applies its public `disabled`, `error` and `required` props to both its
  FormControl and Select surface. The generated or caller-supplied label remains
  associated with that resolved field state. No new state API or host migration is
  required.

### RD-011 specification: supported `sx` composition

- SearchInput prepends its required input-padding default and then applies every
  caller `sx` item in source order. Consequently, a caller can override that
  visual default while objects, callbacks, arrays and conditional array entries
  retain their supported MUI semantics.
- DatePicker, DateTimePicker and TimePicker preserve every caller `sx` form in
  source order. Their `hidden` prop remains authoritative and is appended after
  caller styles, preserving the established `display: none !important` behavior.
  DateRangePicker follows the same rule while retaining its fixed single-input
  field slot.
- Internal composition flattens only the top-level supported `SxProps` array; it
  does not evaluate callbacks or object-spread any `sx` value. No caller style is
  silently discarded.

### RD-012 specification: SearchButton loading positions

- SearchButton supports the existing `LoadingButtonProps` positions: `inline`
  remains the default, preserving its inline decorative spinner and layout
  placeholders; `startIcon` replaces the caller's start icon with the decorative
  spinner only while loading and restores that icon while idle.
- Every loading position keeps the action's accessible name, disables activation,
  and sets `aria-busy=true`. The progress indicator remains `aria-hidden` so it
  does not create a duplicate announcement.
- `loadingPosition` is consumed by SearchButton and never forwarded to its MUI
  button DOM. Unknown positions are not part of the public type; no widening or
  compatibility alias is introduced.

### RD-013 specification: Builder controlled close requests

- BuilderButton accepts an optional `onClose` callback with MUI Popover's event
  and reason (`escapeKeyDown` or `backdropClick`). It forwards a dismissal request
  only; callers retain ownership of `anchorEl` and must clear it to close.
- A Builder trigger exposes `aria-haspopup="dialog"`, its current
  `aria-expanded` state, and an `aria-controls` reference while the popover is
  mounted. Existing `aria-describedby` behavior remains intact.
- When no callback is supplied, Escape and backdrop interaction do not change the
  controlled open state. Inactive tab panels remain mounted and their state is
  unaffected by a close request or eventual caller-controlled dismissal.
- After the caller-controlled close transition completes, focus returns to the
  Builder trigger.

### RD-014 specification: conditional token extraction

- Canonical `--sc-*` declarations on supported root/mode selectors retain every
  enclosing `@media` and `@supports` condition, including nested conditions and
  their source order. Unconditional declarations remain directly scoped to the
  matching Ratan WebKit root.
- Extraction never promotes conditional declarations to the output root and
  continues to omit declarations from unrelated selectors. Font extraction and
  light/dark mode selector mapping are unchanged.
- Regeneration from WebKit 2.0.5 is deterministic and retains the recorded
  canonical source hashes. In the packed consumer, `--sc-button-width` resolves
  to `100%` below the canonical 680px breakpoint and is undefined above it for
  both light and dark WebKit roots; `--sc-mode` continues to match the root mode.

### RD-015 specification: resolvable public token graph

- The scoped WebKit root defines `--sc-font-size: 1rem`, matching the canonical
  `var(--sc-font-size, 1rem)` default. This resolves
  `newStyleTokens.typography.fontSize` and the generated `--font-size-l/m/s`
  compatibility aliases without changing legacy-generation values.
- Dark WebKit roots define the canonical light focus-shadow formula with
  `--sc-color-blue-250-dark`, resolving the exported focus shadow and the modal
  and popover compatibility aliases that depend on it.
- Every exported WebKit token reference and generated compatibility alias is a
  root in each applicable generation/mode custom-property graph. Verification
  follows transitive `var(...)` references and fails on a missing definition or
  a reference cycle; negative fixtures prove both failure modes.
- The independently installed consumer applies the public typography token to
  its WebKit token surface. The custom property computes to `1rem` and the
  rendered surface to `16px` with the mode-appropriate focus shadow at
  narrow/wide widths in light/dark modes.

### RD-016 specification: canonical WebKit theme source

- `src/tokens/webkit-theme.json` is the versioned package authoring source for
  scoped WebKit supplements, public semantic token references, and the raw MUI
  theme values paired with their canonical CSS variables. Its WebKit version
  must match the generated asset provenance.
- `tokens:generate` reads that manifest and the pinned WebKit 2.0.5 sources. It
  emits committed scoped CSS/provenance plus a narrow generated TypeScript module
  consumed by `newStyleTokens` and `getWebkitOptions`. Generation must be
  deterministic; tests fail when the manifest version, CSS references, raw
  palette values, or scoped supplements drift.
- Components and public token exports use CSS references so mode and responsive
  changes remain live. MUI theme creation retains raw color strings because MUI
  performs JavaScript color parsing/contrast calculations, and retains numeric
  `fontSize` and `borderRadius` because MUI performs arithmetic on those fields.
- The generated TypeScript and CSS are committed distribution inputs. Ordinary
  typecheck/build/packing therefore require no sibling WebKit checkout; only
  explicit regeneration requires the pinned source tree.
- The independent tarball consumer verifies legacy/WebKit, light/dark, and
  narrow/wide computed values. A core Button-only import must not retain provider
  or token CSS, preserving the existing tree-shaking boundary.

### RD-017 specification: WebKit action-control states

- SearchButton uses the WebKit primary-button semantic variables; ResetButton and
  ToggleButton use the secondary-button variables. Normal, hover, pressed,
  focus-visible, disabled, and Toggle selected states resolve through scoped CSS
  so light/dark changes remain live. Search/Reset `color="error"` states use the
  corresponding primary/secondary error variables.
- SearchButton loading remains a disabled, `aria-busy` action with one decorative
  spinner. Its visual state therefore uses the primary disabled variables without
  changing the RD-006/RD-012 interaction and announcement contracts.
- Legacy generation retains the existing fixed Search colors, mode-specific Reset
  colors, and legacy Toggle gradients/transforms. The new semantic branch is
  selected only when `theme.ratan.designGeneration` is `webkit`.
- The catalog and independent consumer expose the state matrix. Browser checks
  cover both generations and modes at 390px and 1280px, including pointer hover,
  held press, keyboard focus, error, loading/disabled, and Toggle selection.

### RD-018 specification: contrast and keyboard focus

- Placeholder text is normal text under WCAG 2.2 SC 1.4.3 and targets at least
  4.5:1 against its rendered input background. WebKit inputs use the approved
  label semantic (`--sc-label-color`): `#595959` on white is 7.00:1 and
  `#A6A6A6` on `#333333` is 5.19:1. Error/helper text is measured on the provider
  surface and must retain the same normal-text threshold.
- Visible component boundaries and focus indicators target at least 3:1 against
  adjacent colors under SC 1.4.11. WebKit button and input focus use
  `--sc-focus-ring-color`; the canonical blue is 4.29:1 against the light
  provider background and 3.85:1 against the dark provider background.
- Legacy outlined inputs retain their historical fill/gradient and hidden notch,
  but focused roots receive a two-pixel palette-primary outline. Legacy portal
  DataGrid headers/cells replace the removed outline with the same two-pixel
  palette-primary indicator, inset to avoid changing layout or clipping.
- Pointer focus does not gain a persistent button ring; keyboard focus remains
  selected through MUI's focus-visible state. The independent consumer verifies
  keyboard traversal and computed placeholder, helper/error, input, button, and
  optional-peer DataGrid focus colors in light/dark modes.

### RD-019 specification: reduced-motion loaders

- Loader and PageLoader keep the existing two-ring SVG affordance, visible status
  text when supplied, polite live-region semantics, accessible name, dimensions,
  colors, and ordinary rotation timing in both appearance generations and modes.
  Without a reduced-motion request, the outer ring rotates with the existing
  two-second cubic-bezier cycle and the inner ring with the existing one-second
  linear cycle.
- Under `@media (prefers-reduced-motion: reduce)`, both ring segments remain
  visible but stop rotating. The static affordance and status semantics continue
  to communicate loading without substituting another component or requiring
  JavaScript media-query state.
- The preference is resolved by CSS so a live operating-system/browser preference
  change takes effect without remounting. The independent consumer verifies the
  computed animation and status contract for legacy/WebKit in light/dark modes;
  existing loading-action announcement regressions remain unchanged.

### RD-020 specification: supported public contracts and font ownership

- The package README provides one concise matrix for each public component group.
  It records defaults; controlled, uncontrolled and null value behavior;
  callbacks and close reasons; forwarded refs; slots and style precedence;
  accessible labels and IDs; and the supported inherited MUI or React props.
  Compatibility-only exports remain identified as migration helpers rather than
  general customization APIs.
- The README names every font file shipped through `styles.css`, states that hosts
  must import that stylesheet explicitly, and states that legacy Poppins is
  host-provided. It separates required React/MUI/Emotion peers from optional date,
  Pro range and portal-theme peers. Hosts own date locale/timezone/format policy,
  SC WebKit/font redistribution approval and MUI X Pro licensing/initialization.
- The independent packed-consumer fixtures compile representative examples for
  the documented contracts, including refs, slot precedence, controlled and
  uncontrolled dates, null ranges, localized/read-only search clearing, both
  loading positions, callback reasons, Builder close requests and Dialog naming
  precedence. README catalog links point to the corresponding Storybook stories.
- README, emitted declarations, compatibility guidance, release guidance and the
  changelog describe the same ownership and behavior. Package typecheck, lint,
  build, Storybook build and packed-consumer verification must pass from the
  committed sources before this documentation stage is complete.

### RD-021 specification: Button-only tree shaking and byte budget

- The independent packed consumer measures an ESM build whose only package import
  is the core `Button`. The fixture pins Vite 8.2.1 and externalizes React,
  ReactDOM, MUI Material/icons and Emotion, so the result measures emitted package
  code rather than framework bytes. The pre-fix checkout records 21,935 bytes;
  the clinic's earlier approximate 18.6 KB result remains historical evidence.
- Top-level `styled(...)` and `React.memo(...)` component creation that has no
  observable module-load side effect is explicitly marked pure. Removing an
  unused export may omit only that initialization; importing and rendering every
  public component must retain its existing behavior in unit, SSR and Storybook
  gates. The package build preserves source-module boundaries so the core index
  selects only `Button.js` as rendered package code. No icon import or public
  export shape changes are part of this stage.
- The packed verifier enforces a 2,048-byte uncompressed package-code ceiling for
  the Button-only external-peer build. It fails when another emitted package
  module besides `Button.js` has rendered code or when Loader SVG/classes,
  Snackbar styles, legacy or
  WebKit token markers, provider/theme markers, optional integrations, React or
  host code are retained. The ceiling provides review headroom over the measured
  optimized result and must be deliberately revised when the Button contract grows.
- Package coverage, typecheck, lint, production build, Storybook, independent
  declaration/build/tree-shaking and DOM-free SSR checks must pass. README,
  changelog and release guidance record the measurement boundary, before/after
  bytes, budget and rollback target.

### Component imports: compilation isolation and unused-code elimination

- Keep all existing root and integration imports compatible. Add explicit
  lowercase component subpaths, such as `ratan-design-origin/button`, that
  resolve directly to the component's emitted module and declarations.
  Each direct module is a library entry so its public runtime exports survive
  the producer build, including independently imported Builder tab helpers.
- A direct component import must load only that implementation and its required
  package dependencies during a consumer build. Independent feedback, Builder
  and date components must not share implementation modules. Dialog's overlay
  context must not require loading the provider or theme implementation.
- An unused package import contributes no rendered package code. A consumer
  with no package import loads no package modules and emits no package CSS or
  fonts. CSS remains an explicit side-effectful import; JavaScript modules remain
  removable. Type-only imports must not load runtime package code.
- Root named imports remain tree-shakable in the final bundle, but their export
  barrel may be inspected by bundlers. Direct subpaths provide the stronger
  compilation-isolation guarantee. Building the distributable library still
  emits all supported exports; consumer imports determine application inclusion.
- Verify loaded and rendered package module sets for every direct component
  against its required dependency graph, using the built package and again the
  independently installed tarball. Verify empty, unused, type-only, root Button
  and explicitly imported CSS cases. Keep the existing Button byte budget and
  behavior/type/SSR/browser checks.

Verification evidence: all 30 direct dependency graphs and the Builder helper
case pass for the workspace build and installed tarball. Root Button retains
only `Button.js` at 427 bytes with pinned Vite 8.2.1 and external UI peers;
the direct Button path also loads only that module, while the previous root
consumer graph traversed 31 package modules. The tarball's modern/legacy
declarations, root/direct export identity, DOM-free SSR, explicit CSS/13 fonts
and all 24 package/catalog browser checks pass. Package coverage is 96.96% lines
and 94.75% branches (112 tests), plus five token tests. Base/Ratan/Cashflow
compatibility tests, production builds and dependency isolation pass. Ratan's
separate typecheck has the existing TS5053 conflict between `--noEmit` and its
inherited `emitDeclarationOnly`. This host configuration limitation is separate
from the passing package typecheck and browser gate.
The committed host journey was also rerun on an isolated current-checkout stack:
login and New Tile succeed, but Cashflow stops at the already documented
`Cannot access 'DateFormat' before initialization` business-module error before
the acceptance row can render. This blocks completion of the integrated
render/delete assertion; all temporary servers were stopped after verification.

### RD-022 specification: automated browser quality gates

- A repository-owned command builds the package and Storybook, creates the
  verified independent tarball consumer, serves both surfaces, and runs the
  design-origin Playwright suites. The command fails on package verification,
  browser interaction, accessibility, console/page errors, or visual comparison
  failure and cleans up its child servers on success, failure, or interruption.
- Axe-core from the installed Storybook accessibility addon scans every rendered
  catalog story. Violations with `serious` or `critical` impact fail with the
  affected rule, help URL, story and target. The same scanner covers the complete
  consumer appearance matrix and the optional date surface. Any exclusion must
  name the exact rule and surface, include a reason and owner in this contract,
  and remain narrower than a component or story; RD-022 starts with no exclusions.
- The independent consumer gates keyboard search clearing, criteria expansion and
  collapse, dialog dismissal and trigger-focus restoration, closed/open loading
  overlay hit testing, and optional date/date-range rendering. A date picker must
  open from the keyboard, close with Escape and restore focus to its trigger.
- Reviewed screenshot comparisons cover the consumer controls at 390x844 and
  1280x844 for legacy/WebKit in light/dark mode. Animations and the caret are
  disabled for capture; full-page CSS-pixel snapshots use a reviewed small pixel
  tolerance. Updating baselines is a separate explicit command. Reviewers inspect
  all changed images and run the ordinary gate again before accepting an update.
- Baselines live beside the Playwright suite under a stable repository path. A
  package, token, font, fixture, browser or Playwright change that alters pixels
  must explain the intended visual change in the tracker; unchanged images must
  never be regenerated merely to make a failing comparison pass.

RD-022 delivered `test:e2e:design-origin` and its explicit `:update` companion.
The ordinary command builds the package and Storybook, verifies and serves a fresh
tarball consumer, then runs 24 Playwright tests. The final run passed the complete
catalog axe matrix with no exclusions, eight reviewed screenshot comparisons,
consumer axe scans, search/criteria/dialog/overlay/reduced-motion interactions and
the optional date Escape/focus-restoration flow. The red runs found and fixed
theme-dependent Loader contrast, LoadingOverlay contrast and keyboard access to
long Snackbar messages; the scanner waits for finite transitions before measuring
settled UI while leaving infinite loader animations available to motion tests.

### RD-023 specification: supported dependency resolution

- `ratan-design-origin` is the source of the supported peer ranges. Every host must
  declare each required React, ReactDOM, MUI and Emotion peer as a production
  dependency, resolve an installed version accepted by both its own declaration and
  the package peer range, and resolve host imports and package-originated imports to
  the same physical package instance through its existing Vite policy.
- Required core peers are `react`, `react-dom`, `@mui/material`,
  `@mui/icons-material`, `@emotion/react` and `@emotion/styled`. The verifier checks
  full supported ranges, including minor and patch floors, instead of treating a
  matching major version as sufficient. Missing declarations, missing installs,
  unsupported versions and split host/package resolution are failures.
- Optional peers remain `@mui/x-date-pickers`, `@mui/x-date-pickers-pro`,
  `@mui/x-data-grid`, `@mui/base` and `dayjs`. Incidental ancestor hoisting does not
  make an integration present: a host owns an optional integration only when it
  declares that package. A declared integration must resolve and satisfy both the
  host declaration and the package peer range; an undeclared integration is skipped
  and core verification must still pass. Exact prerelease contracts such as
  `@mui/base@5.0.0-beta.70` remain exact.
- Automated negative fixtures cover unsupported core versions, missing required
  dependencies, duplicate core resolution, absent optional peers and incompatible
  declared optional peers. The repository command must emit host/package/version
  details for every failure and a concise per-host resolution report on success.
- The independent packed consumer continues to prove core operation without any
  optional peer, then verifies supported optional entries after explicit install.
  Base, Ratan and Cashflow production builds prove the checked host policies remain
  executable. This stage validates existing Vite dedupe and React federation
  settings but does not alter federation sharing.

### RD-024 specification: lint policy and aggregate quality gate

- Package TypeScript and TSX use the recommended non-type-aware TypeScript rules;
  React components use the recommended Hooks rules; and JSX uses the recommended
  accessibility rules. The package declares each plugin directly, treats findings
  as errors, retains its existing JavaScript safety rules, and completes with zero
  warnings. Exceptions must name the exact rule and narrow file/line scope; this
  stage starts with no blanket rule disablement.
- `npm run verify:design-origin` is the canonical repository quality command. It
  runs labeled steps sequentially: package tests/coverage, typecheck and lint;
  dependency fixture/runtime checks; the ordinary RD-022 browser command (which
  builds and verifies the package, catalog and independent tarball consumer); Base
  typecheck; and Base, Ratan and Cashflow production builds. A step failure stops
  later work and reports both the label and failed command without replacing its
  exit status or masking its output.
- The command owns the temporary consumer and catalog servers on ports 8019/8020
  through the RD-022 runner. It requires installed workspace dependencies, a
  Playwright Chromium binary, those ports to be free and registry/cache access for
  the fresh consumer install; it requires no separately started application or
  backend service. Snapshot updates are never part of the aggregate gate.
- Unit fixtures prove all configured steps run in order on success and that a
  representative non-zero gate stops the sequence with actionable context. The
  real command must pass on the clean candidate. A checked-in Azure pipeline installs
  dependencies and Chromium before invoking the same command; external templates
  may call it directly but must not substitute a narrower set of gates.

### RD-029 specification: broad host dependency-resolution baseline

- Historical host failures are classified only from the original workspace test
  commands and their complete summaries. Focused adapter tests may minimize a
  failure and prove a repair, but never replace the recorded broad baseline.
- Test-only aliases for CommonJS UI libraries must resolve from the same host-local
  dependency tree as that host's React and ReactDOM renderer. A workspace that
  imports a hook-bearing package directly must declare it directly; relying on an
  ancestor installation is unsupported because its peer React can bind to a
  different physical instance even when package versions match.
- The repair loop must show the invalid-hook failure before the change and a green
  representative from each affected dependency path afterward. A bounded-worker
  broad run may be used when the exact post-fix command exhausts fork termination,
  provided the original command was captured and the altered worker policy is
  explicit in the evidence.
- Remaining broad failures are listed by file and failure class with an owner. They
  are not reported as design-package regressions unless the failing behavior was
  introduced by the package stage, and a focused pass is not used to claim the
  broad suite is green.

### RD-025 specification: migration-only Base presentation adapters

- `ratan-design-origin/base-compat` is a migration-only entry for the five pure
  presentation namespaces duplicated by the Ratan and Cashflow `@fm/base`
  compatibility bridges: `Loader`, `Time`, `Button`, `LoadingButton` and `Dialog`.
  Each namespace retains the legacy `{ default }` or `{ Time }` shape so existing
  host imports and call sites do not change.
- The shared entry normalizes legacy `type="primary"` to the native button type,
  defaults loading buttons to the 16px start-icon pattern, stringifies Time values,
  keeps the named circular Loader, defaults dialogs open, forces package dialogs
  into a portal and preserves the existing responsive Paper dimensions, callbacks,
  title/actions and divider layout.
- The entry is pure with respect to host policy: it must not read URL state,
  document classes, local/session storage, authentication, platform capabilities,
  routing, telemetry, FDC3, HTTP services or theme selection. Provider/context,
  error/splash orchestration, Hooks, utilities, services, dispatcher and both
  intentionally different host theme policies remain in each bridge.
- Package contract tests exercise every shared namespace. Each host contract test
  proves its legacy export is the identical shared namespace, then re-verifies its
  own theme policy and the shared rendering defaults. Both host builds and the
  required login → New Tile → render → remove journey remain acceptance gates.

### RD-026 specification: explicit host appearance propagation

- `RatanAppearance` is the host-to-design boundary and always contains both
  `mode` (`light` or `dark`) and `designGeneration` (`legacy` or `webkit`). An
  explicit child value overrides an inherited value; an omitted field inherits;
  and a standalone mount with no owner falls back to `light`/`legacy`.
- Base derives the contract from its owned reducer state: `theme` selects mode and
  the existing `newStyles` rollout flag selects the generation. Ratan receives the
  resolved object as a remote prop and forwards that same object to Cashflow.
  Direct Ratan and Cashflow mounts resolve the documented fallback before render.
- Each MFE owns one appearance scope. The scope adds Ratan generation metadata and
  an owning overlay container to that host's existing MUI theme; it does not replace
  Ratan's scrollbar policy, Cashflow's portal theme, either Ant Design algorithm,
  or Base authentication/storage/theme policy. Nested legacy theme providers inherit
  the nearest scope unless they receive an explicit override.
- Compatibility contexts receive appearance from their owning React provider.
  Consumer hooks do not watch document classes. Runtime changes flow through host
  state and props, so independently mounted MFEs may use different appearances and
  each portal remains under its owning scoped root.
- Rollout is opt-in through Base's existing `newStyles` flag. Leaving it false, or
  omitting appearance at a standalone boundary, keeps legacy rendering. Rollback is
  to stop passing the appearance prop and remove the scoped host wrappers; no URL,
  storage, authentication, routing, FDC3 or business-state migration is required.

### RD-027 specification: bounded Alpha direct-adoption pilot

- Alpha directly owns the package provider boundary and explicitly imports the
  package stylesheet. Base passes the same complete appearance contract used by
  Ratan; an independent Alpha mount retains the documented light/legacy fallback.
- The pilot replaces only duplicated search, status-select, acknowledgement,
  loading, load-error/retry and empty-state presentation. Alpha retains its case
  types, API client, state transitions, filtering rules, summary, table, routes and
  workspace ownership. Accessible names and user-visible state text remain stable.
- Alpha declares all required React, MUI and Emotion peers, deduplicates them in
  production and pins its test renderer to the same local React instance. The
  repository dependency-isolation gate includes Alpha and optional date/Pro peers
  remain absent.
- Acceptance covers default and explicit appearance metadata, search/status
  filtering, clear/action/error/retry/empty behavior, loading and busy semantics,
  Base prop propagation, production builds and the live dark/legacy Alpha journey.
  The three-run before/after bundle and development-host timing method and exact
  evidence live in `ALPHA_DIRECT_ADOPTION_PILOT.md`.
- Alpha is the only canary. The measured cold-load increase blocks mechanical
  rollout to more remotes until a separate architecture experiment meets the
  recorded 25% p95 guardrail. RD-028 still prohibits publication. Rollback reverts
  the Alpha provider/control/dependency stage without migrating business data,
  routes, services or persisted state.

### RD-028 publication governance guard

- The local candidate is `private: true`. Removing that guard requires a named
  release owner and backup, an exact restricted corporate registry/access policy,
  mapped maintainer approvers, asset/font redistribution approval and production
  MUI X Pro ownership. A git author identity is not evidence of release authority.
- Public npm publication and production use of the Pro date-range entry are not
  authorized. Credentials and license keys must never be committed. The release
  decision record stores only accountable identities, dates and evidence references.
- A releasable candidate must retain a content-addressed tarball and SHA-256 beside
  the source commit, validation output, reviewed catalog/screenshots and prior
  rollback artifact in the organization's approved immutable store. Its destination
  and retention period remain blocked until the release owner is assigned.
- Rollback ownership follows the release owner with the named backup able to execute
  independently. Application maintainers validate their own host after an exact
  package/app rollback; asset and Pro-license owners restore matching entitlements.

### RD-030 specification: integrated host performance budget

- The measurement command builds `ratan-design-origin`, Base, Ratan and Cashflow as
  production Module Federation outputs with hidden source maps. A repository-owned
  localhost edge serves the real emitted JS/CSS with gzip, immutable asset caching
  headers and the existing mock BFF; no separately running host or backend is used.
- Static evidence records raw/gzip/Brotli bytes per host and counts UI source modules
  present in more than one host map. Runtime evidence uses a fresh 1280x720 Chromium
  context with cache disabled for each sample and records login, shell, cold
  Cashflow-tile and live theme-switch timings, requests/transfer/encoded bytes,
  styles, long tasks and CDP task/script/layout/style-recalculation durations.
  Hardware, operating system, browser, viewport, cache policy and iteration count
  are part of every report. Three runs per appearance generation are the minimum;
  the maximum sample is the three-run p95 so one slow run cannot be averaged away.
- Legacy is the same-run baseline and WebKit is the candidate. The checked-in
  baseline records Base/Ratan/Cashflow gzip totals of 458,749/1,905,899/2,946,830
  bytes and 1,017 cross-host duplicated UI modules. Both generations loaded 250
  resources and 6,551,548 transfer bytes. Legacy/WebKit p95 was 1,581.7/1,597.9 ms
  for a cold tile and 185.4/181.8 ms for a theme switch under the recorded Apple M5
  conditions; the candidate therefore added no bytes/requests and was 1.0% slower
  only on cold-tile time in this sample.
- Deterministic production sizes, duplication, route bytes, request/style counts
  and generous runtime safety ceilings are absolute checks. Same-run WebKit versus
  legacy request/byte/style ratios may not increase; cold-tile, theme, long-task,
  task, script, layout and style-recalc p95 ratios may not exceed 1.25. Static
  ceilings provide approximately five percent headroom. Any ceiling increase needs
  a reviewed reason and refreshed three-run evidence, never an unexplained update.
- The evidence does not justify another provider/import rewrite or sharing MUI,
  Ant Design or Emotion through federation. Large Cashflow chunks and duplicated
  mapped UI modules may justify a separate, reversible code-splitting/federation
  design experiment with its own compatibility and rollback proof; the package-only
  Button result and this baseline do not authorize that architecture change.

### Stage 4 and final inventory delivery (2026-09-18)

Ratan and Cashflow compatibility adapters now consume the package Button,
LoadingButton, Dialog and Spinner contracts while preserving their existing
imports, defaults, callback behavior, test identifiers and business screens.
Cashflow opts into the package `portal-theme` entry after keeping URL parsing
and `new-layout` selection in its adapter; Ratan retains its palette-only theme
policy. React, MUI and Emotion peer declarations plus workspace deduplication
keep one runtime context per host.

EmptyState, ErrorFallback and LoadingOverlay are package-owned controlled
presentation. Base retains dispatch, telemetry, support routing, error capture,
mailto construction and splash/error orchestration. The final inventory and
release record classify workspace lifecycle controls, WebKit registration,
admin editors and other portal-specific features as intentionally host-owned.

- Package: 57 tests pass with 100% lines and branches; strict typecheck, lint,
  production build, Storybook build and packed consumer verification pass.
  Packed proof covers core consumption without optional date/Pro peers,
  explicit date installation, portal-theme declarations/SSR, CSS scoping,
  tree shaking and DOM-free imports.
- Base: 127 files / 355 tests pass; 96.85% lines and 94.13% branches; strict
  typecheck and production build pass. The integrated host journey passes
  login, New Tile, Cashflow render, workspace creation and deletion.
- Ratan and Cashflow focused adapter suites pass (four tests each). RD-029 later
  reproduced the historical broad failures and repaired their split React cause:
  test-only Ant Design aliases now remain host-local and Cashflow directly owns
  react-use. The broad suites now expose only classified legacy fixture/assertion
  debt; their exact before/after counts and worker limitation live in the tracker.
- `npm run verify:dependency-isolation` passes. GitNexus impact checks for the
  edited component, adapter and theme symbols report LOW risk; JSX/import graph
  gaps are covered by public compatibility tests and the browser journey.

No package publication, registry release, external ownership assignment, font
redistribution approval or production MUI X Pro licensing decision is included.
Those release-governance decisions remain documented in `UI_PACKAGE_RELEASE.md`.
