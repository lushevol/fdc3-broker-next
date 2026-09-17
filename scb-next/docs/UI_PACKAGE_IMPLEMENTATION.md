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
