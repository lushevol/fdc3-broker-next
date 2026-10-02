# Base UI migration parity evidence

## Current follow-up status, 2026-10-02

Cashflow's `DateFormat` circular initialization is fixed (`dff6446c`). The real
Base/Ratan/Cashflow render/add/remove journey now completes without uncaught page
errors. The strict joined-host browser gate still fails on business-screen
console errors; those remain in the
[deferred backlog](BASE_UI_COMPONENT_MIGRATION_PLAN.md#deferred-backlog-full-ratancashflow-package-adoption).

The Base-only login/workspace/drawer journey reports no console errors, page
errors or failed requests with all configured remotes running. Focused Base
regressions, typecheck and production build pass. Expanded parity evidence is
being finalized; this current section does not invent a final aggregate count.

Ratan's corrected production typecheck reports 43 source diagnostics. The package
browser gate separately fails on the missing approved `VITE_MUI_X_LICENSE_KEY`.
Release owners, registry access, font redistribution and license approval remain
external decisions. Historical passing checks below are not evidence that those
current strict gates pass.

## Historical branch reconciliation, 2026-09-30

The migration and subsequent package optimizations are now reconciled into the
session-expiry branch. All 40 Base migration/parity cases pass across the final
runs. The eight credential-login baselines were recaptured against that branch's
original Base source, then compared with zero differing pixels after restoring
the migration. This preserves that branch's forced field-focus appearance rather
than importing the historical uncommitted focus edit described below.

The controlled production host also passes Cashflow rendering, shared appearance
updates and workspace removal. See [the optimization record](UI_PACKAGE_OPTIMIZATION.md)
for current validation, exact scope, and separate dev-runtime limitations. The
remaining sections are the original migration's historical evidence.

### What this proved at that stage

In plain language, the evidence proves that the extracted package keeps the
tested Base pages looking and behaving like the old Base pages. It does not yet
prove every possible Base state or every MFE in the portal:

- Base still needs matched fixtures for cached remote content, admin
  empty/loading/error states, admin sorting/filtering/mutations and Base-host
  picker popups.
- The local development Cashflow journey then had a `DateFormat` initialization
  error in both hosts. That startup error is now fixed; the current strict
  business-screen console failures remain separate from Base parity.
- Ratan/Cashflow feature-level MUI imports are a later backlog item. They remain
  application-owned until that separate migration is started.

The pre-migration Base source is commit `98c2d131`. The comparison uses that
checkout on port 8101 and the migrated checkout on port 8001. Both resolve the
same installed React 18.3.1, MUI 5.18.0, Emotion 11.14 and SC WebKit assets.
The package's existing component implementations did not change between those
commits; its new entries re-export the original MUI surfaces. A separate
worktree edit removes forced `focused` props in Login, so the ordinary credential
form is excluded from these new comparisons.

The repeatable [host parity suite](../tests/e2e/base-ui-auth-parity.spec.ts) uses
the pre-migration screenshots in its sibling `__screenshots__` directory. It
pins headless Playwright Chromium on macOS arm64, device scale 1, `en-US`,
`Asia/Singapore`, and 2099-12-31 00:00 UTC. It serves the same SC Prosper Sans
font files and deterministic profile SVG to both hosts. It also adds the
entitlement map missing from the existing dev login fixture to both responses;
without that map the old Profile accordion crashes on expansion. The clock is
within one day of the mock token's 2100 expiry because the old session timeout
overflows for longer intervals.

All 14 cases pass with `maxDiffPixels: 0`:

- Eight 1440x900 authenticated combinations: legacy/WebKit, old/new layout,
  dark/light. Home, open New Tile drawer, profile menu, profile dialog and
  expanded profile are captured for each combination (40 screenshots).
- Six WebKit dark responsive cases: old/new layout at 390x844, 768x1024 and
  1280x900. Home and drawer are captured for each (12 screenshots).
- The suite also checks resolved theme classes, tile visibility, drawer Escape,
  profile menu/dialog opening, accordion expansion, dialog close and no uncaught
  page errors. Existing shell and MUI 5 browser checks cover tile launch,
  workspace add/removal and profile maximize/restore.

The [admin suite](../tests/e2e/base-ui-admin-parity.spec.ts) passes all six
legacy-dark and WebKit-light Category, Tile and Import Map flows with zero
differing pixels across 14 screenshots: populated grids, editors, and Tile
autocomplete listboxes. It verifies visible records and editor open/close. The
first migrated run exposed missing DataGrid theme overrides: Vite served MUI X
and the theme from separate dependency-optimizer generations. Base now
prebundles `ratan-design-origin/data-grid` alongside `icons`; after a forced
optimizer rebuild the complete admin suite matches the old host.

The [extra suite](../tests/e2e/base-ui-extra-parity.spec.ts) passes seven cases
with zero differing pixels: SSO-only Login in legacy/WebKit at desktop/mobile,
an overflowed WebKit workspace with rename and removal, and legacy-old/WebKit-new
logout survey dialogs. It checks the SSO control's link semantics, workspace
tab count and rename value, and the survey's Escape restriction and Cancel close.
The pre-migration survey did not focus its `autoFocus` action; this test preserves
the observed dialog behavior rather than treating that prop as proof of focus.

The [session suite](../tests/e2e/base-ui-session-parity.spec.ts) passes four
legacy/WebKit cases with zero differing pixels. A rejected login displays the
same complete Snackbar and its Close action dismisses it. A deterministic
30-second auth token opens the same timeout dialog in both hosts, including
its Extend/Logout actions and Escape restriction. The Snackbar screenshot is
component-scoped because a separate in-progress Login focus edit changes the
credential field borders in a full-page comparison.

Package tests (115), Base tests, both typechecks, package lint, production Base
build, dependency isolation, package verification and the direct-MUI import guard
pass. The package's identity test verifies original MUI component references for
representative controls, icons, grid and theme exports. Base source has no
direct MUI UI imports; the type-only theme module augmentation is retained.
Across the four host suites, 31 cases compare 77 screenshots with zero
differing pixels. The Base lint command is not green: seven `no-void` errors in
admin service tests and two duplicate-import errors in
`src/module-federation.d.ts` are also present at the pre-migration commit.

This does not yet close the full [acceptance matrix](BASE_UI_COMPONENT_MIGRATION_PLAN.md#required-proof-of-unchanged-ui-and-ux).
Cached remote content and admin empty/loading/error, sorting/filtering and
mutation workflows still need matched fixtures, screenshots and behavior checks.
Base exports Date/Time picker adapters but does not open them on its own pages;
their popup behavior has package coverage, not a Base-host comparison. In the
local cross-host development setup, the Cashflow journey fails on both old and
migrated Base with the same `DateFormat` circular-initialization error in the
Cashflow remote; it cannot be counted as a migration pass even though the
controlled production-edge rendering path passes.
