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
