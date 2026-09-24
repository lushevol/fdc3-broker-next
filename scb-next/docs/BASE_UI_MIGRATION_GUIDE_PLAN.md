# Base UI migration guide plan

Status: guide created and examples verified, 2026-09-24. The migration unit is a
reusable UI building block: a control or a useful composition of primitives.
Login, Home, portal features, and business workflows remain in Base.

This plan defines the guide for components already supplied by
`packages/ratan-design-origin` and selected building blocks still worth
adopting or extracting from `web/mfe-base-origin`. The accompanying
[component audit](BASE_UI_COMPONENT_AUDIT.md) records the inspection of both
codebases and the evidence behind the proposed scope.

The resulting [migration guide](UI_PACKAGE_MIGRATION_GUIDE.md) now contains the
current status, import mappings, verified usage recipes, candidate contracts and
implementation gates. The guide creation stage is complete. Adoption changes
and the proposed new components remain pending as recorded there.

## Component selection and ownership

The package owns reusable rendering, visual states, accessibility, and local
interaction behavior. A field may compose a label, input, adornment and helper
text; a dialog may compose a title, content, actions and focus handling. Those
are useful component interfaces even though each contains several primitives.
There is no requirement to expose every underlying primitive individually.

**Business dependencies must stay outside `ratan-design-origin`.** This includes
Base stores, authentication, entitlements, services, routing, workspace and
remote lifecycle, analytics, persistence, business record types, and decisions
based on domain field names. Passing an entire business object as a prop or
injecting a business service does not make a component independent. Base should
resolve those decisions into presentation values and ordinary event callbacks.

Use these selection rules:

- Adopt an existing package component when its interface fits the use case.
- Extract a new component when it has a meaningful shared UI contract, can
  render independently, and centralizes useful presentation or interaction.
  Prefer evidence from multiple uses; a folder name alone is insufficient.
- Keep pages and feature compositions in Base. They may consume package
  controls while retaining their layout, assets, copy and domain decisions.
- Allow local MUI layout, typography, icons and styling utilities. Their
  presence alone is not migration debt. Do not create a complete MUI facade
  or target zero direct MUI imports.
- Keep legacy visual compatibility distinct from business logic. Preserve
  existing consumer contracts while documenting which interfaces are
  transitional and unsuitable as templates for new components.

## Already migrated: guide chapters

| Component family | Current package interface | What the guide must explain |
| --- | --- | --- |
| Controls | Core `Button`, `LoadingButton`, `Input`, `Select`, `ToggleButton`, `Label` | Props, refs, defaults, disabled/loading/error states, Base import adapters |
| Search and builder | Core search inputs/actions/criteria/layout and `BuilderButton` with tabs/panels | Local interaction versus host-owned criteria, query execution and selected content |
| Feedback and state presentation | Core `Loader`, `PageLoader`, `Snackbar`, `EmptyState`, `ErrorFallback`, `LoadingOverlay` | Host-owned copy, error capture, notifications and legacy HTML adaptation |
| Dialog | Core `Dialog`; legacy title/root in `compatibility` | Package rendering/focus; Base workspace placement, telemetry and drag/resize policy |
| Date/time inputs | `dates` and optional Pro `date-range` | Values, callbacks, localization inputs, optional peers and host license setup |
| Appearance | Core provider plus `theme`, `tokens`, explicit CSS | Explicit appearance inputs; Base persistence and application-wide policy |
| Legacy integrations | `portal-theme`, `compatibility`, `base-compat` | Preserved visual contracts, existing consumers and limits on new usage |

These are implementation ownership statements, not claims that every Base call
site already uses the package. For each family, link the package implementation,
Base adapter, public behavior test, story, and compiling fixture. Explain any
consumer differences explicitly: for example, `base-compat.Time` preserves a
string renderer and is not the domain-aware Base `Time` component.

## Remaining scope: component candidates

Candidate names below describe proposed interfaces; they are not current exports.
Validate each interface before adding it to the supported catalog.

| Priority | Building block | Consumer evidence and scope |
| --- | --- | --- |
| First | Adopt existing `Input`, `Button`/`LoadingButton`, and `Dialog` where they fit | Login fields; Home/admin/Tile action buttons; Survey/Timeout dialog presentation. Keep page layouts and controllers local; verify labels, sizing, callbacks and selectors before substitution. |
| Next | Autocomplete field | `admin/Tile/index.tsx` and `components/TableDetail/Field.tsx` repeat Autocomplete + Input composition. Own the field rendering, labeling and selection interface; callers supply options, values and handlers. |
| Next | Labeled switch | `components/Switch` and `components/SwitchTime` repeat switch presentation. Own checked/disabled/label/icon rendering; Base retains mode/timezone selection, storage, clock and analytics. |
| Next | Icon action, with optional tooltip | SurveyButton, CopyText and workspace actions share icon-button behavior. Own accessible naming, focus, disabled state and tooltip composition; callers supply icon and click handler. |
| Later, if justified | Action card, generic tab group, or grid presentation | Inspect Tile, Login/Home tabs and repeated admin grids for a genuinely shared interface. Do not move workspace records, tab lifecycle, admin editors or approval actions. A DataGrid import alone does not justify a new package grid. |

AppBar, Avatar/Profile, Drawer/NewTile, TabItem/TabPanel, Time, Timeout, Survey,
Version, Table/TableDetail, ErrorBoundry and WebKit registration retain their
feature or integration ownership in Base. Selecting a reusable piece inside
one of these does not require migrating the whole feature. "Retained in Base"
is a valid final disposition, not an incomplete migration status.

## Guide creation sequence

1. **Audit both sides.** Start with the accompanying source audit. Review the
   existing package's imports, public types, default values and side effects;
   inspect remaining Base candidates and their controllers. Record findings at
   component-family level, with exact source paths where evidence matters.
2. **Document completed components.** Write one recipe per migrated family:
   supported package import, legacy Base adapter, host responsibilities,
   before/after usage, preserved behavior and test/story links. Compile examples
   against current exports. Label compatibility entries explicitly.
3. **Specify selected gaps.** For each accepted candidate, record actual uses,
   the proposed interface, internal primitives, allowed interaction state and
   excluded business dependencies. Keep speculative cards/tabs/grids deferred
   until this review establishes a useful common contract.
4. **Order implementation slices.** Adopt existing controls first, then add one
   selected missing building block at a time. Capture consumer behavior before
   extraction; implement and test the package component; adapt its Base callers;
   update the guide and inventory; verify and commit that slice.
5. **Publish the guide.** Use `UI_PACKAGE_MIGRATION_GUIDE.md` alongside these
   docs. Include a family-level status table (`migrated`, `adoption pending`,
   `candidate`, `retained in Base`, `deferred`), usage recipes, business ownership
   rules, verification evidence and rollback guidance. Update the existing
   [inventory](UI_PACKAGE_INVENTORY.md) and
   [implementation contract](UI_PACKAGE_IMPLEMENTATION.md) only as scope or
   shipped ownership changes.

## Acceptance and verification

The guide is complete when migrated families have usable, verified recipes and
selected remaining candidates have explicit interfaces, ownership and next
steps. Page and feature retention must be explained, with no blanket obligation
to move all local components, CSS, icons, or MUI primitives into the package.
Progress is measured by the agreed component catalog and actual adoption.
Import-file counts are discovery evidence only.

Each implementation slice must preserve the existing `@fm/base` contracts and
prove that its package interface works without Base runtime or domain models.
UI-only expansion, focus, selection and overlay behavior may live in the package;
authentication, data access and business decisions must remain in the host.
Review public types and semantics as well as imports to enforce this rule.

Use focused package/Base contract tests, affected typecheck/lint/build gates,
package stories and packed-consumer checks as appropriate. Shell-facing changes
also require the localhost:8001 login → New Tile → launch → remove-tab journey
and relevant legacy/WebKit light/dark and responsive checks. This documentation
revision does not change UI behavior; its audit records the focused tests run.

Before source edits, run GitNexus impact on the edited symbols and report the
blast radius; warn on HIGH or CRITICAL risk. Before committing each completed
stage, run change detection and isolate its files from unrelated work.
