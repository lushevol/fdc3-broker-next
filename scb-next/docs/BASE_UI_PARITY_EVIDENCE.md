# Base UI migration parity evidence

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

Package tests (115), Base tests, both typechecks, package lint, production Base
build, dependency isolation, package verification and the direct-MUI import guard
pass. The package's identity test verifies original MUI component references for
representative controls, icons, grid and theme exports. Base source has no
direct MUI UI imports; the type-only theme module augmentation is retained.
Across the three host suites, 27 cases compare 73 screenshots with zero
differing pixels. The Base lint command is not green: seven `no-void` errors in
admin service tests and two duplicate-import errors in
`src/module-federation.d.ts` are also present at the pre-migration commit.

This does not yet close the full [acceptance matrix](BASE_UI_COMPONENT_MIGRATION_PLAN.md#required-proof-of-unchanged-ui-and-ux).
Cached remote content, timeout dialogs, feedback states, picker popups, and
admin empty/loading/error, sorting/filtering and mutation workflows still need
matched fixtures, screenshots and behavior checks. The existing Cashflow journey
also hits a pre-migration `DateFormat`
circular-initialization error; it cannot be counted as a migration pass.
