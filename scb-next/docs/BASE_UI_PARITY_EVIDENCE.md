# Base UI migration parity evidence

## Current follow-up status, 2026-10-02

Cashflow's `DateFormat` circular initialization is fixed (`dff6446c`). The real
Base/Ratan/Cashflow render/add/remove journey now completes without uncaught page
errors. The strict joined-host browser gate still fails on business-screen
console errors; those remain in the
[deferred backlog](BASE_UI_COMPONENT_MIGRATION_PLAN.md#deferred-backlog-full-ratancashflow-package-adoption).
Ratan/Cashflow providers now build the MUI theme matching the selected WebKit
generation (`c6840c7e`), while retaining their local host overrides and legacy
defaults; focused appearance contracts cover the selected palette and typography.

The Base-only native login/workspace/drawer journey reports no console errors,
page errors or failed requests with all configured remotes running. The final
full Base comparison has zero forwarded current-phase `console.error` entries;
its only 40 forwarded warnings are React Router future flags. The subsequent
admin request-recovery stage (`40705968`) replays the affected state suite with
zero current console errors and zero unhandled rejections, while preserving
its original snapshots. Focused Base regressions, typecheck and production
build pass. The complete Base comparison
passes **56 original and 56 migrated tests with 167 exact screenshot matches**,
without masks or tolerance. This includes the added state-only pair of 16
original/16 migrated tests and 82 screenshots for cached remotes, admin states
and workflows, and picker-host fixtures. Deterministic transition settling fixes
the earlier drawer text-capture discrepancy (`b84da53f`); the complete passing
run after the UI console fixes is recorded in
`/tmp/base-ui-parity-final-console-fixes.log`. The earlier pre-fix passing run
is `/tmp/base-ui-parity-complete-deterministic.log`.

The cached-remote restore cases now require the restored panel to be visible
before asserting its retained draft, rather than accepting a hidden input.
The targeted repeat passes two original and two current cases with four exact
screenshots (`/tmp/base-ui-parity-cache-visible.log`); the updated original
baselines and stronger assertion are retained in `e424e7bd`. This strengthens
existing cases in the 56-case matrix and is not an additional screenshot count.

### Base UI console fixes

The earlier full current-phase log had 60 unsafe `:nth-child` errors, 36
`findDOMNode` messages, eight uncontrolled Autocomplete errors, two React key
spread errors and two hidden-grid dimension errors, plus invalid Autocomplete/
Select warnings. These were Base/package presentation issues, separate from
the deferred Ratan/Cashflow business-screen backlog. The final UI stage fixes:

- Cached Base admin panels stay mounted and measurable while hidden, inaccessible
  and nonfocusable. The scope is Base Category/Tile/Import Map only; remote panels
  retain their previous zero-height hidden behavior and cached drafts. Two
  strict legacy/WebKit cases also check desktop/mobile grid dimensions, restored
  sort/filter state and dialog geometry, with zero dimension errors.
- Draggable dialog papers forward explicit DOM refs while retaining drag/resize
  behavior. Equivalent theme selectors avoid Emotion's unsafe child-selector errors.
- TableDetail gives MUI valid empty display values while controller values,
  300 ms callbacks and saved payloads remain raw. Existing nonempty unmatched
  values are not replaced. Option React keys are passed explicitly, and refreshed
  Tile categories match by non-null stable ID, with reference fallback for missing IDs.

The verified Base UI stage is committed as `4e2926db`. The 12 focused
field/category regressions, existing TableDetail/Tile tests and Base typecheck
pass. The full final comparison retains all 167 exact screenshots.
At that UI checkpoint, six expected-admin-503 unhandled rejections still needed
the separate service-boundary stage below.

### Admin request recovery

`40705968` adds failure handling to eight Base admin read paths and twelve
detail-mutation callbacks across Category, Tile and Import Map. Read and audit
failures retain existing rows/options and audit-dialog state. Mutation failures
clear loading while preserving the current record, edits, dialog and rows, and
allow retry. Existing alerts still come from the service interceptor; public
services continue rejecting failed requests, and processing errors still
propagate. Business logic and services remain in Base, not the design package.

The 57 new contracts cover read/audit recovery and all twelve mutation handlers.
The affected state replay passes 16 original and 16 current cases, with the same
82 original snapshots (`/tmp/base-ui-state-final-request-recovery.log`). The
original phase still has six expected-admin-503 unhandled rejections; the current
phase has zero, zero forwarded console errors, and 28 React Router future flag
warnings. This rerun strengthens the existing 56-case matrix and does not add
unique screenshot comparisons to the 183 Base/Cashflow total.

The final full Base unit suite passes 136 files/435 tests, with no failures or
skips, and 99.01% line/95.28% branch coverage
(`/tmp/base-full-unit-final-request.log` and
`/tmp/base-full-unit-final-request-results.json`). This is unit/coverage evidence,
not a claim that every unit test logs nothing. The earlier pre-console-fix
checkpoint passed 129 files/361 tests with 96.86% line/94.10% branch coverage;
the UI-stage checkpoint passed 134 files/378 tests with 96.72% line/93.76%
branch coverage. Those earlier counts are historical. Base typecheck, the package-import guard and host dependency
isolation pass, as do 10 Ratan and 13 Cashflow bridge tests. These results verify
their scoped contracts; they do not declare every Base or remote console state
error-free.

The final Cashflow rendering comparison passes four original and four migrated
cases with 16 exact screenshots in
`/tmp/base-ui-cashflow-final-console-fixes.log` at the verified UI-stage source
`4e2926db`. It covers
legacy/WebKit light/dark grids, search, details and filter builder, plus retained
cached workspace state, deletion, and no uncaught page errors. All sixteen
pinned-original PNGs are retained in the repository, and the migrated repeat
passes against them. Across Base and Cashflow, the evidence totals 120 old/current
test executions (56 + 56 + 4 + 4) and 183 exact screenshot comparisons
(167 + 16). These totals describe the tested scope; they do not remove the
console limitations above or prove every business-screen state. The Cashflow
remote still emits inherited application Emotion console errors; those are
deferred business-screen issues, not a clean joined-host console result.

The native journey at `http://localhost:8001` also passes login, New Tile,
actual `CF-ACCEPT-001` Cashflow rendering, Add Workspace and Cashflow tab deletion.
`/tmp/base-native-final-journey.json` records separate Base and remote phases:
Base has zero console errors, page errors, failed requests and HTTP failures;
the remote phase has zero page errors/HTTP failures, inherited business console
errors, and one expected SockJS `ERR_ABORTED` during tab deletion cleanup.
The desktop/mobile captures are `/tmp/base-native-final-desktop.png` and
`/tmp/base-native-final-mobile.png`. Existing mobile horizontal overflow is
preserved by the old/current comparison, not represented as a responsive redesign.
This native check complements the replayed negative-admin-service checks.

### Current comparison provenance

`npm run test:e2e:base-ui-parity` builds the package and extracts original Base UI
source from `98c2d131:scb-next/web/mfe-base-origin` into a temporary directory.
It supplies that source with the current Vite configuration and deterministic
dev/mock fixtures, then captures the original on port 8122 and compares the
current Base on port 8121 in the same run. Both use the same installed peers,
canonical WebKit assets, fixture data and browser environment. Separate
`cache-old`/`cache-new` optimizer directories avoid shared-cache interference.
Expectations live in a temporary snapshot directory and the current run uses
`--update-snapshots=none`; it cannot rewrite those originals. This also keeps OS
rasterization differences from being mistaken for migration changes in CI.

`npm run test:e2e:base-ui-parity -- --states-only` selects the added state suite.
The `--cashflow` selection exercises the real Ratan/Cashflow remote chain;
full feature-UI migration in those remotes is outside this Base comparison.
`--baseline` may intentionally capture the pinned original into tracked
expectations, but it is not the ordinary quality gate. CI fetches full Git
history, installs the locked canonical WebKit dependencies and runs
`prepare:webkit-host` before host validation (`2ce183e1`).

Ratan's corrected production typecheck reports 43 source diagnostics. The package
browser gate separately fails on the missing approved `VITE_MUI_X_LICENSE_KEY`.
Release owners, registry access, font redistribution and license approval remain
external decisions. Historical passing checks below are not evidence that those
current strict gates pass.

The final controlled host performance gate at `40705968` fails exactly two strict same-run
WebKit/legacy comparisons: 222 versus 221 requests, and 6,646,714 versus
6,621,050 transfer bytes. All 26 absolute and ten other ratio limits pass. The extra
request is the canonical SC Prosper Sans Regular font actively rendering the
WebKit controls, not a duplicate download. The final three-run report,
resource URL/hash, rendered-font probes and unresolved budget decision are
recorded in
[UI package release](UI_PACKAGE_RELEASE.md#current-controlled-performance-result-2026-10-02).

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

In plain language, this historical evidence proved that the extracted package
kept the tested Base pages looking and behaving like the old Base pages. It did
not prove every possible Base state or every MFE in the portal:

- Base then still needed matched fixtures for cached remote content, admin
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

At that stage, this did not close the full [acceptance matrix](BASE_UI_COMPONENT_MIGRATION_PLAN.md#required-proof-of-unchanged-ui-and-ux).
Cached remote content and admin empty/loading/error, sorting/filtering and
mutation workflows then still needed matched fixtures, screenshots and behavior checks.
Base exports Date/Time picker adapters but does not open them on its own pages;
their popup behavior has package coverage, not a Base-host comparison. In the
local cross-host development setup, the Cashflow journey then failed on both old
and migrated Base with the same `DateFormat` circular-initialization error in the
Cashflow remote; it cannot be counted as a migration pass even though the
controlled production-edge rendering path passed. The current evidence above
supersedes that startup limitation and records the complete Base comparison.
