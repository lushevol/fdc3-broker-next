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
