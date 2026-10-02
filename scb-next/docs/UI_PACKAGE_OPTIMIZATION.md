# Ratan Design Origin optimization

## Scope and contracts

Work from the current session-expiry branch, preserving its authentication and
refresh scheduling. Reconcile the completed Base UI migration from `6a3e95de`
(common ancestor `65f5f1a1`) before optimizing the shared package. Only the
`scb-next` UI migration changes are carried forward; unrelated research, staged
data, and local changes are excluded.

The public props, default values, refs, callbacks, rendered elements, styles,
accessibility, portal containers, and scoped theme behavior must remain stable.
Authentication, routing, services, stores and workspace orchestration stay in Base.

## Current status (2026-10-02)

All five package optimization stages are complete. The Base import boundary is
also complete and the package/Storybook checks pass. What remains is easier to
separate into three buckets:

- **Base parity evidence:** finish the expanded page-state comparison run and
  record its final integrated counts. Base-owned console errors are fixed, and
  the Base-only native journey has no console errors, page errors or failed
  requests with all configured remotes running.
- **Application backlog:** Cashflow's `DateFormat` startup cycle is fixed. The
  strict joined-host gate still catches business-screen console failures, and
  Ratan's corrected production typecheck reports 43 source diagnostics. These
  belong to the deferred application work, with the strict failures kept visible.
- **Release work:** assign owners, approve the registry and packaged fonts,
  define MUI X Pro ownership, and record an immutable tarball and rollback
  artifact. The strict package browser gate currently needs an approved
  `VITE_MUI_X_LICENSE_KEY`. The candidate remains private until those external
  approvals and decisions are complete.

The full Ratan/Cashflow direct-MUI migration is intentionally a later backlog
item. It is not required to close the Base-only extraction and must preserve
business logic in the applications.

## Ordered stages

1. Restore the migration entry points, Base imports, inventory, and parity tests.
   Check the import boundary, package contracts, Base typecheck, and portal flow.
2. Share LoadingButton/SearchButton loading presentation internally. Capture both
   positions, disabled/busy state, spinner size/color/spacing, start icons, refs,
   and click behavior through the existing public components first.
3. Reduce stylesheet duplication for consumers loading global and scoped tokens.
   Preserve the existing self-contained CSS entries and their cascade contracts;
   verify every appearance and responsive condition against existing output.
4. Measure provider/theme and search-layout work. Optimize only demonstrable
   redundant work without changing portal readiness or collapsed accessibility.
5. Synchronize the public inventory and document intentional legacy compatibility
   quirks. Run affected package, consumer, and browser gates.

## Validation evidence

Each completed stage records current validation below. Historical migration
screenshots are reference baselines, not evidence that this branch has passed.

### Stage 1 — reconciled

Restored `/primitives`, `/icons`, `/data-grid`, Base imports and architecture
checks from the completed migration. Package: 115 tests and 5 token tests pass;
coverage 97.15% lines / 94.57% branches. Package lint/build and Base typecheck/build
pass. The 31 extended parity cases plus the shell journey pass unchanged.

The eight older credential-login baselines contained an uncommitted removal of
forced focus. Recaptured them using this branch's original Base source (reversed
only the import migration), reviewed all eight images, then restored the migration
and passed all eight zero-diff comparisons plus the shell journey. Existing
mobile layout limitations are retained, not redesigned by this migration.

GitNexus change detection: low risk, no indexed execution processes affected.
The unrelated AGENTS.md and staged data changes are excluded from this stage.

### Stage 2 — shared loading presentation

Both public buttons now use one private props/presentation helper, retaining
their existing styled roots. Captured and passed six additional public contract
cases before and after refactoring, including stable DOM/ref identity, spinner
placement/color/size, idle spacing, busy attributes, disabled clicks and icon
restoration. All 121 package tests plus token tests, typecheck, lint and build pass.

### Stage 3 — combined CSS

Added opt-in `styles-and-tokens.css`. Both original files remain byte-for-byte
unchanged. Consumers needing both scopes can use the combined entry; consumers
needing only one keep their existing import. Measurements (raw / gzip bytes):

| Input | Raw | Gzip |
| --- | ---: | ---: |
| Separate scoped + global files | 405175 | 44612 |
| Combined entry | 203366 | 22426 |

Seven token-generation tests pass. Four browser cases pass, including exhaustive
computed custom-property comparisons for default/explicit document appearances,
all four provider appearances, nested scopes and overrides at 390/1000px. No new
fonts or visual defaults were introduced. Generator output is deterministic.

### Stage 4 — measured render work

Measured operation counts in the package's regression harness (ordinary React
mount, not StrictMode's deliberate development double invocation):

| Scenario | Before | After |
| --- | ---: | ---: |
| Full theme factory calls, mount + 10 unchanged parent rerenders | 2 | 1 |
| Geometry reads, 50 expanded criteria, resize + child mutation | 102 | 0 |

The provider memoizes the appearance theme separately and clones only portal
defaults when its root attaches. The original container identity update and
core Dialog readiness gate are retained. Expanded criteria restore managed
accessibility attributes without measuring clipping. Collapsed criteria still
measure geometry and move focus out of clipped content.

Regression coverage includes initial-open core and primitive dialogs, nested
selects, host themes, appearance changes, disabled controls and retained search
criteria. All 127 package tests and seven token tests pass, with 97.21% line and
94.42% branch coverage. These counts establish reduced work, not a wall-clock
speed guarantee. Observer lifecycle and public component APIs are unchanged.

### Stage 5 — contracts and final validation

The maintained inventory now includes all eleven JavaScript entries and the
three CSS choices. Search collapse/expansion ownership is explicitly in the
package. README documents the compatibility namespace shapes and intentional
differences from core APIs; no legacy props/defaults were removed. The new Grid
story opts into MUI 6's supported `ariaV7` semantics so pagination controls are
outside the grid role. The DataGrid export and existing host props are unchanged.

Final checks, 2026-09-30:

- Package: 127 Vitest tests, seven token tests, typecheck, zero-warning lint,
  library build, Storybook build and independent packed-consumer verification
  (declarations, SSR, optional integrations, assets and tree shaking).
- Package browser gate: 23 consumer cases pass against unchanged screenshots;
  the complete Storybook accessibility scan passes after the Grid story fix.
- CSS: four browser cases pass, including the combined-entry equivalence matrix.
- Base: all 40 migration/parity cases pass across the final runs, covering Login,
  shell, admin, feedback/session states and the workspace add/remove journey.
  Base's 15 focused component contract tests, typecheck and production build pass.
- Ratan/Cashflow: five focused bridge tests and both production builds pass.
  Dependency isolation and the Base import-boundary check pass.
- Production cross-MFE verification: the existing controlled-edge harness passes
  Login, Cashflow rendering and shared-theme updates for legacy and WebKit, with
  no page errors. Its existing render/remove Playwright test also passes against
  those production outputs. One sample per generation was collected; no new
  application performance budget or before/after timing claim is made.

Validation limitations retained outside this optimization:

- Ratan's existing `typecheck` script fails with TS5053 because its inherited
  `emitDeclarationOnly` option conflicts with `--noEmit`; its production build and
  bridge contracts pass. The package and Base typechecks pass normally.
- Running all three development servers together exposes a Cashflow DateFormat
  initialization error and a host prefix collision (Base dialog test IDs become
  `MicroWebUI_cashflow_cn_*`). The admin failure also reproduces with the original
  provider; all six admin comparisons pass in the original Base-only setup. The
  production cross-MFE path passes. These application/dev-runtime issues were not
  moved into the design package or hidden by changing parity expectations.

All five stages are complete for this optimization scope. Business logic remains
in the applications, the existing standalone CSS artifacts are unchanged, and
optimizations preserve the captured component contracts and portal screenshots.
This does not claim that every Base page state has matched evidence or that the
package is ready for production publication; those items are listed above and in
the release document.
