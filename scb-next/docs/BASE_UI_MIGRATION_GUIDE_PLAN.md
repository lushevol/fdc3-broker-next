# Base UI migration guide plan

Status: planning inventory, 2026-09-24. Scope: production UI under
`web/mfe-base-origin/src` and its public `@fm/base` compatibility surface.
The goal is for Base's visual components and design policy to come from
`packages/ratan-design-origin`, while Base continues to own portal state,
workflows, routing, services, authentication, and browser integrations.

This document plans the **migration guide** and records the starting inventory.
It does not mark the remaining surfaces as migrated. The existing
[UI package inventory](UI_PACKAGE_INVENTORY.md) and
[implementation contract](UI_PACKAGE_IMPLEMENTATION.md) are the evidence for
completed extraction; reconcile them with source and tests when writing each
guide entry. The older [extraction plan](UI_PACKAGE_EXTRACTION_PLAN.md)
describes the original stages and includes historical status.

## Working definition and audit boundary

For this goal, "from `ratan-design-origin`" means Base's rendered controls,
shared presentation, theme values, and reusable styled patterns use a documented
package entry point. A Base component may remain as an adapter that supplies
portal data and callbacks. A package component must not import Base stores,
services, routes, analytics, or browser registration.

Audit production `.ts` and `.tsx` in `src`, excluding tests, stories, fixtures,
and generated output. Record JSX usage, styles, icons, component imports, type
imports, theme hooks, global CSS, and public exports separately. A source scan
currently finds **55** production files importing `ratan-design-origin` and
**62** importing `@mui/material`, `@mui/icons-material`, or MUI X directly;
these file counts overlap and are a discovery measure, not a component count or
proof of runtime adoption. Re-run the scan at the start of the guide work and
keep a file-level ledger rather than using the counts as the exit gate.

The guide must classify every UI use as:

1. **Package owned:** a public package component/theme/token is already used
   through a direct import or a thin Base adapter.
2. **Ready to adopt:** the package already exports the needed presentation, but
   the Base call site still uses MUI or a local duplicate.
3. **Package gap:** reusable presentation needs a new package primitive or
   pattern before a Base call site can migrate.
4. **Host composition:** Base keeps the feature component and policy, but its
   visual building blocks must use package UI. This is not an exemption for
   direct MUI component rendering.
5. **Integration exception:** an external runtime or browser capability, such
   as WebKit custom-element registration, needs an explicit integration contract.
   Record why it cannot be provided by the package and how its visuals follow
   package tokens.

Treat `@mui/*` type-only imports, MUI `styled`/`useTheme`, icons, DataGrid,
date localization, and `@scdevkit/webkit` as distinct rows. The final guide
must state whether each becomes a package export, a package-defined type, a
host configuration boundary, or a documented exception. Do not declare success
from replacing import strings with an undifferentiated MUI re-export.

## Already migrated: guide chapters to write first

| Surface | Current package entry and Base bridge | Guide evidence to capture |
| --- | --- | --- |
| Theme, tokens, CSS aliases | `theme`, `tokens`, `portal-theme`, `compatibility`, explicit `styles.css`; Base theme adapter remains | Legacy/WebKit and light/dark selection, provider boundary, CSS loading, portal overrides |
| Core controls | `Button`, `LoadingButton`, `Input`, `Select`, `ToggleButton`, `Label` from core; Base component paths remain | Import/export shape, MUI prop mapping, refs, disabled/loading states, selectors |
| Search and builder | `SearchInput`, `SearchButton`, `ResetButton`, `SearchGrid`, `SearchCondition`, `SearchConditionContainer`, `BuilderButton` from core | Controlled state, clear/remove behavior, keyboard use, layout and popup ownership |
| Feedback and states | `Loader`, `PageLoader`, `Snackbar`, `EmptyState`, `ErrorFallback`, `LoadingOverlay` from core | Base orchestration, sanitized legacy HTML, error capture, copy, loading and empty states |
| Dialog | Core `Dialog` and compatibility styles/title | Base drag/resize, workspace portal lookup, close callbacks, sizing and focus |
| Date/time | Community pickers from `dates`; Pro range picker from `date-range` | Localization ownership, optional peers, Pro license setup, null and uncontrolled values |

For each chapter, publish a short before/after import example using the actual
Base path, the package path, and the adapter relationship. Link the current
contract test, package public API test, Storybook story, and relevant consumer
fixture. Verify the example compiles; do not copy an outdated example from an
earlier plan. Explicitly label the compatibility and `base-compat` entries as
transitional APIs.

## Not yet done: guide backlog

| Area | Current evidence | Guide decision and migration work to specify |
| --- | --- | --- |
| Login and Home screens | `pages/Login/index.tsx` and `pages/Home/index.tsx` render MUI layout, tabs, typography, fields, buttons, icons | Map each rendered primitive to an existing package control or a narrowly designed package primitive. Keep sign-in and workspace behavior in Base. |
| Shell navigation and workspace UI | AppBar, Avatar/Profile, Drawer/NewTile/Tile, TabItem/TabPanel, Switch/SwitchTime, Time, Timeout, Version retain local presentation and MUI imports/styles | Separate visual slots from portal controllers; define package primitives/patterns only where reusable. Preserve workspace editing, remote mounting, identity and session policy in Base. |
| Survey and portal dialogs | Survey, SurveyButton and parts of the Base Dialog adapter still render MUI controls or icons | Use package Dialog/controls where the contract fits; specify any missing slots/icons. Keep survey and logout decisions in Base. |
| Admin screens and grids | `admin/**`, Table and TableDetail render MUI controls, icons and DataGrid; Table owns `AdminRecord` workflows | Design a package grid/toolbar/field presentation API with an optional MUI X entry if justified. Keep audit, verification and save behavior in Base; document licensing and peer dependencies. |
| Styled surfaces and theme access | Many `common/style.ts` files use MUI `styled`; Home uses `useTheme`; Base still has host CSS/assets | Move reusable visual rules into package components/tokens. Keep explicit host layout and global policy, with a documented token bridge and reviewed exceptions. |
| WebKit elements | `ScWebkit` registers custom elements in the browser | Keep registration in Base; decide whether a package integration entry can own reusable visual wrappers. Document tokens, events, SSR behavior and browser validation. |

The current inventory calls many of these components "deliberately retained".
That describes **behavior ownership**, not a permanent exception to this goal's
UI sourcing requirement. The guide must show the host/package seam for each
retained component and list any still-local visual code as open work.

## Guide creation sequence

1. **Build the ledger.** Enumerate every production UI import and rendered
   surface under `src`, including indirect local component usage and `root.tsx`
   exports. Give each row a file path, consumer, current source, package
   equivalent, category above, behavior owner, and contract/test link. Reconcile
   the ledger with the package export map and the two existing UI package docs.
2. **Publish completed migration recipes.** For each already migrated family,
   document the supported import entry, Base adapter, unchanged consumer API,
   deliberate legacy behavior, and verification command. Mark any partial
   adapters as partial rather than complete.
3. **Specify remaining recipes.** Group the backlog into core primitives,
   shell presentation, admin/grid presentation, styling/theme, and optional
   integrations. For each, write the proposed public API, host inputs/callbacks,
   compatibility mapping, dependencies, tests, and migration order. Do not
   create generic package components merely to rename portal workflows.
4. **Order implementation slices.** Start with call sites that can use existing
   package exports, then add missing package primitives, then shell and admin
   compositions, then the WebKit integration decision. Keep each slice small
   enough to verify and commit independently; update the guide and ledger as
   its source changes land.
5. **Close with an executable verification section.** Include the package and
   Base tests, typecheck, lint, build, Storybook/package checks, dependency
   isolation, cross-host Playwright journey, and screenshots for legacy/WebKit
   light/dark and responsive states. Record actual outcomes and known baseline
   failures rather than treating historical results as current proof.

The finished guide should live alongside these docs and contain: a scope and
ownership rule; a live status table with `migrated`, `partial`, `planned`, or
`blocked`; one recipe per surface; an import/type/CSS mapping table; a test and
visual evidence index; a compatibility and deprecation policy; and a rollback
procedure. Update [UI_PACKAGE_INVENTORY.md](UI_PACKAGE_INVENTORY.md) when an
ownership decision changes, rather than maintaining conflicting status claims.

## Acceptance for the guide and for eventual migration

The **guide** is ready when every production UI use has a ledger row and a
decision, completed entries have source/test evidence, pending entries have a
concrete migration recipe and ordered dependency, and all examples compile.
Unknowns must be listed as open decisions with an owner and an evidence task.

The **migration** is ready only when the ledger has no unreviewed direct UI
component imports from MUI or other visual libraries in Base production code;
remaining type, localization, styling, and runtime imports are explicitly
classified; old `@fm/base` contracts still work; and package, Base, and
integrated host gates pass. The existing portal shell and admin workflows may
remain in Base as compositions of package presentation.

Before source edits, follow repository GitNexus impact analysis for each edited
symbol, capture current behavior in focused contract tests, and warn on HIGH or
CRITICAL risk. Before each stage commit, run change detection and exclude
unrelated working-tree edits.
