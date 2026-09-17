# ratan-design-origin implementation contract

## Accepted interfaces

The extraction plan defines the test surfaces: existing Base component exports,
existing consumer compatibility exports, and standalone package imports. Existing
business screens must compile without import, prop, or callback changes.

## Requirements

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
