# Portal styling implementation progress

The [implementation plan](NEW_STYLES_IMPLEMENTATION_PLAN.md) and
[specification](NEW_STYLES_SPEC.md) define the scope and acceptance gates.

| Stage                                             | Status      | Evidence / next step                                                                                                                               |
| ------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. References, assets, contract, fixtures         | Complete    | Resolver 5 tests and fixture 7 tests: 100% line/branch coverage. Browser smoke and three native evidence captures pass; type/lint/build pass.      |
| 2. Theme and header                               | Implemented | 10 browser behavior/geometry checks and 62 shell/theme tests pass. Native capture reviewed; remaining reference differences listed below.          |
| 3. Login                                          | Implemented | Native form geometry and responsive/Enter/loading/error checks pass in both themes; lower hero artwork remains unavailable.                        |
| 4. Empty workspace                                | Implemented | Reference dark illustration, responsive CTA and real drawer/analytics dispatch verified; light illustration is a documented adaptation.            |
| 5. Avatar menu                                    | Implemented | Responsive menu, real identity/versions, logout, keyboard/outside close and focus restoration verified.                                            |
| 6. Profile                                        | Implemented | Real identity, functional/data entitlements, photo fallback, responsive hierarchy and close/focus behavior verified.                               |
| 7. Tile drawer                                    | Implemented | Responsive patterned cards, explicit launch-option metadata, real launch/disabled contracts and keyboard close/focus verified.                     |
| 8. Portal acceptance                              | In progress | 82 browser behavior/geometry/evidence checks pass; exact visual comparison and remaining rollout gates stay open.                                  |
| 9. Typography and compact density                 | Complete    | 90 Portal browser checks verified; Base/package tests, targeted quality checks and all app builds pass. Remaining baseline gates are listed below. |
| 10. Empty/dropdown text correction                | Complete    | 507 Base tests and 18 responsive browser checks pass; Base typecheck, build and targeted lint pass.                                                |
| 11. Dropdown spacing, profile layers and switches | Complete    | 509 Base tests and 32 combined browser checks pass; Base typecheck, build, targeted lint and independent browser review pass.                      |
| 12. New-styles implementation boundary            | Complete    | 531 Base tests and 76 Portal browser checks verified; typecheck, build, changed-file quality and dependency isolation checks pass.                    |

## New-styles implementation boundary

- Appearance defaults, standalone query parsing, theme selection and federated
  appearance mapping live under `src/new-styles`. The Home, Login, AppBar,
  Avatar, Profile, Drawer, Empty, NewTile, theme/time switch and workspace-tab
  implementations live in `new-styles/adapters`. Original public paths re-export
  the existing default/named contracts, including `RoleComp` and `ContainerComponent`.
- New shell roots and switches use supported package primitives independently
  of legacy styled roots. Drawer actions and New Tile use package Button and
  IconButton. Portal-specific composition stays in Base; existing reusable APIs
  cover the requested surfaces, so no new package export is needed.
- Canonical CSS loads through `ratan-design-origin/styles-and-tokens.css`.
  The new theme exposes package scope and generation/mode metadata on the
  document. Legacy fallback removes this scope while retaining document-wide
  SC variables and fonts. Authentication, telemetry, persistence, workspace
  controllers and remote lifecycle retain their existing responsibilities.
- Ownership tests first caught scattered appearance branches and a direct
  WebKit CSS import, then passed after relocation. Full Base verification passes
  531 tests across 154 files, with 99.12% line and 97.52% branch coverage;
  typecheck, production build and package dependency isolation also pass.
  The final 18 boundary/appearance tests and four header contract tests pass.
- All 76 Portal browser cases are verified across suites and focused reruns:
  26 avatar/profile/layer cases, 25 login/empty/drawer/density cases, 12 shell
  and preference cases, eight acceptance cases, two switch cases and three
  document-token cases. Desktop/mobile screenshots in both themes preserve
  compact text, dropdown spacing, profile containment and switch geometry.
  Clock focus keeps the header text color through a local selector override.
  Cached admin grids and remote drafts retain their dimensions/state through
  hiding, resizing and restoration. Both real Cashflow launch/removal journeys pass.
- Verification uses the isolated Base host on port 8001 with matching Ratan
  and Cashflow remotes on 8109 and 8115. The cached-remote fixture accepts
  `VITE_RATAN_REMOTE_URL`, matching the host's remote configuration. Browser
  mode checks verify package document metadata independently of class order.
- The separate strict design-origin host console gate remains failing on
  documented Cashflow Redux/Ant/React/style warnings and photo/stream transport
  failures; its functional launch, appearance and removal assertions complete.
  No warnings were filtered from this gate. Evidence is in
  `/tmp/portal-boundary-base-tests.log`, `/tmp/portal-boundary-profile-browser/`,
  `/tmp/portal-boundary-density-browser-final/`, `/tmp/portal-boundary-final-controls/`,
  `/tmp/portal-boundary-cached-final/` and `/tmp/portal-boundary-design-host-final.log`.

## Dropdown spacing, profile layers and switches

- The dropdown retained its 548px reference width and large section spacing
  after its text became compact. It now uses a 320px viewport-clamped width,
  16px horizontal padding, a 4px identity/hint gap and 72px/44px/60px minimum
  section heights. Its 176px native height and pointer align with the avatar;
  long identity/version values still wrap and scroll.
- Profile artwork used two incomplete crops at fixed offsets, leaving a navy
  patch behind the upper portrait. One existing themed bitmap now covers the
  full banner. Scoped overrides remove the inherited DialogContent background;
  the transparent overlapping content edge preserves the whole initial portrait.
  Banner/title/close layers remain above scrolling body backgrounds. On short
  screens, identity and portrait continue to scroll together below the fixed
  banner. A portrait-only clip follows the scroll offset, progressively removing
  the overlap without leaving a fragment across the header. Returning to the top
  restores the full portrait; the identity/hierarchy scrolling contract is retained.
- Portal switches inherited a transparent outer border and legacy blue-border,
  darkening and halo hover rules. Portal-only overrides remove those rules and
  establish 32px by 14px tracks, 12px thumbs with 1px insets, stable hover colors
  and an inset keyboard-focus cue. The input covers the full track in either
  state, including both edge pixels.
- Rendered-style and browser regressions failed before their corresponding
  fixes and pass afterward. All 509 Base tests pass with 99.11% line and 97.32%
  branch coverage. Base typecheck, build and changed-file lint pass.
- The final combined 32-case browser run passed dropdown/profile geometry, switch
  behavior, responsive header/preferences and real login -> New Tile -> Cashflow
  launch -> workspace removal. This includes all eight profile-layer cases,
  including painting checks at the portrait side after scrolling and restoration
  at the top. The 14 focused profile unit tests also pass. The strengthened
  two-case switch suite checks 12 hover frames per state, input bounds, edge
  clicks, Space activation and visible focus. An independent eight-case browser
  rerun passed; additional portrait probes cover scroll offsets 0/1/20/45/100/0.
  Desktop/mobile screenshots were reviewed in both themes. Evidence:
  `/tmp/portal-ui-polish-verified-browser/`, `/tmp/profile-portrait-scroll-green/`,
  `/tmp/portal-switch-final-green/` and `/tmp/portal-ui-polish-verified-base-tests.log`.

## Empty workspace and dropdown text correction

- Empty and Avatar retained local prototype font sizes after the shared compact
  theme correction. Empty used 28px/26px headings, 18px description text and 20px
  action text; Avatar used 20px identity/Logout text and 14px secondary text.
- Both now consume existing semantic text tokens: Empty uses a 20px/26px heading
  and 14px/20px description/action on every viewport; Avatar uses 14px/20px
  identity/Logout and 12px/18px hint/version text. Find Tile explicitly uses the
  regular button text role. Illustration, menu and touch-target geometry remain
  as specified.
- Rendered-style tests failed before the fix and pass afterward. All 507 Base
  tests pass with 98.97% line and 97.18% branch coverage. Base typecheck, build,
  changed-file lint and independent diff review pass.
- All 18 focused browser checks pass in light/dark modes across native, phone,
  tablet and short desktop viewports. These include actual computed font sizes,
  long identity wrapping, focus/keyboard behavior, Find Tile analytics and the
  login -> New Tile -> real Cashflow launch -> workspace removal journey.
  Desktop/mobile screenshots were reviewed; evidence is in
  `/tmp/portal-text-followup-final/` and `/tmp/portal-text-followup-base-tests.log`.

## Compact-density correction

The compact adaptation in [the specification](NEW_STYLES_SPEC.md#compact-typography-and-density)
is the current desktop sizing target. The native measurements in stages 1-8
below record the earlier prototype implementation.

- Rebuilt Base typography from raw options, preserving host AppBar/grid and
  custom fields. SC Prosper variants and `pxToRem` now agree; responsive font
  processing applies once to the new theme.
- Shared `compactControlTokens` define 12px/28px small buttons and inputs,
  14px/32px regular MUI controls, and 11px/12px grid text. Ant operational inputs
  retain 12px text. Outer and lazy Ant providers follow the selected generation;
  grids adopt SC Prosper while retaining their data density.
- Login now uses a 360px form, 32px heading, 14px text and 44px controls. Drawer
  cards are 125px tall in four desktop columns; entitlement rows are 48px.
  Mobile launch/close controls retain 44px touch targets; Empty's 48px CTA stays
  role-specific.
- Red-to-green tests cover actual rendered typography and geometry. Base passes
  all 507 tests (98.97% lines, 97.25% branches); the design package passes its
  control/token/story test gates. Base, Ratan, Cashflow and Alpha builds pass,
  as do Base/package typechecks, changed-file lint, import/dependency checks and
  independent tarball consumer verification.
- All 90 Portal browser checks are verified: the combined run passed 86, and the
  four adapted drawer/profile geometry checks passed focused reruns after their
  fixture expectations were corrected. The eight new desktop/mobile light/dark
  density checks verify actual fonts, 12px/28px compact controls, regular buttons,
  grid roles and single-line labels. Supplied source images and artwork baselines
  are preserved; adapted geometry follows the compact specification.
- The separate design-origin host smoke completes login, real Cashflow launch,
  theme propagation and removal assertions. Its strict console gate remains
  failing: all 16 distinct console signatures also reproduce with legacy styles,
  with zero new signatures. The gate was preserved rather than filtering them.
- Remaining unrelated gates: Ratan typecheck has 43 diagnostics outside the
  changed adapters; Storybook assets build, but its catalog guard reports missing
  `BadgeOutlined`, `MailOutline` and `VerifiedUserOutlined` examples. The earlier
  whole-workspace lint and legacy snapshot limitations remain documented below.
- Cashflow's fixed-width phone search/pending layout still clips controls. At
  390px, the input wrapper spans x=194-419 in both legacy and compact modes;
  Pending Verification ends around x=434 in both. This is a pre-existing business
  layout limitation, not a passing full mobile-business-layout gate. Comparison
  evidence: `/tmp/portal-mobile-business-baseline.json` and the paired screenshots.

## Stage 1 verification

- Appearance-selection tests were run failing before implementation, then passing.
- No existing component/controller symbols changed during foundation preparation.
- Shared WebKit aliases stay exported; Base branding/geometry and reduced-motion
  roles are defined separately for the prototype stages.
- All 14 source references and 19 exact decorative crops have provenance hashes.
- The browser fixture exercises real login, identity, entitlement expansion and
  populated drawer APIs; three native source/capture pairs verify evidence output.
- Original clean decorative exports remain a dependency for full artwork parity;
  see [asset catalog](NEW_STYLES_ASSETS.md). This does not block shell work.

## Stage 2 verification

- `newStyles` selects both the prototype theme and layout without requiring
  `new-layout` in the URL. Legacy and historical layout-preview paths remain
  separate. Login appearance is explicit and preserves the saved workspace mode.
- The native header is 94px tall. The mobile header uses an additional control
  row so tabs and actions remain reachable. Both themes pass native geometry,
  add/rename/select/delete, theme/time switching, and 390/768px long-tab checks.
- Removing the legacy spacer initially shifted tab selection by one. Explicit
  one-based tab values preserve the controller contract. Header actions sit above
  the tab row so it cannot intercept theme/time clicks.
- The Home/theme regression set passes 62 tests with 100% line and 95.23% branch
  coverage for the modified composition. Deletion clamps the tab value while the
  controller updates, preventing a transient invalid-value warning.
- Base typecheck, build, design-import verification and targeted lint pass.
  Workspace-wide lint reports 9 errors and 138 warnings outside the stage's clean
  file set; these are not represented as a passing whole-workspace lint gate.
- Native Frame 05 source/capture pairs are saved under `/tmp/portal-header-qa`.
  The screenshot's country flag has no supported workspace metadata in the
  current contract. Background treatment, icon rasterization and tab geometry
  still differ; strict zero-pixel source parity is not claimed.

Implementation status and exact visual acceptance are distinct. Full 1:1
acceptance remains open until every supplied frame passes comparison or its
specific source/data dependency is resolved.

## Stage 3 verification

- The prototype Login branch uses the existing authentication controller and SSO
  URL. Username normalization, password whitespace, Enter submission, pending
  lock and authentication errors pass through the real HTTP boundary.
- Native form geometry and both-theme 390/768/1280px layouts pass. Login controls
  honor reduced motion. SSO-only behavior remains covered by presentation tests.
- Presentation and Login adapter tests have 100% line/branch coverage; targeted
  lint and typecheck pass. The combined login/empty browser suite passes 9 tests.
- Frame 11 was visually compared to the native light capture. Form composition
  is close, but icon shapes, font metrics and the exact logo still have small
  differences. Only the upper 736px of the hero artwork is recoverable as a clean
  crop; the lower patterned region needs a clean original export. Dark login is
  a documented theme adaptation rather than a supplied reference state.

## Stage 4 verification

- Find Tile retains the existing drawer dispatch, analytics event and initial
  loading completion. Its Base adapter and presentation have 100% line/branch
  coverage in the 31-test login/empty verification set.
- The native dark illustration region exactly matches the supplied 624 x 452px
  source crop (zero unequal pixels in 282,048 pixels). The 822 x 736px clean
  login-art region also matches its source crop exactly. These limited artwork
  checks do not claim whole-screen parity.
- Both-theme small/short viewport tests verify contained text, visible controls
  and reduced motion. The light illustration uses inversion/brightness with a
  white backing; a supplied light export would replace that adaptation.
- Targeted lint/typecheck and nine combined login/empty browser tests pass.
  Native evidence is retained in `/tmp/portal-login-empty-evidence`.

## Stage 5 verification

- The avatar opens a 548px native menu with a viewport-clamped width, pointer,
  section dividers, real identity/version values and the existing logout
  confirmation. Long content wraps and scrolls within the viewport.
- Outside click, Escape, Enter activation and focus return pass in both themes.
  Menu motion follows the live reduced-motion media preference.
- Avatar/profile verification passes 23 unit tests with 100% line and 98.14%
  branch coverage across the changed modules, plus 18 browser tests covering
  native and small/short screens. Targeted lint/typecheck/build pass.
- Frame 07/13 menu surface colors match sampled source pixels. Strict source
  differences remain 11.34-11.36%, including text metrics/positions and dynamic
  production version strings; these are not accepted pixel matches.

## Stage 6 verification

- The prototype Profile uses production identity, session/timezone formatting,
  functional and data entitlements, expansion analytics and the existing photo
  endpoint. Unavailable photos use an accessible fallback.
- Native collapsed/expanded dialogs are 576/800px high with a stable banner and
  identity region. The entitlement hierarchy scrolls within the remaining space;
  long identities and nested actions remain contained. At heights of 600px or
  less, metadata and hierarchy scroll together below the fixed banner/close
  control; this preserves access to all data in short-screen adaptations.
- Both themes pass role/subject expansion, Escape/close, focus return and live
  reduced-motion preference checks. Avatar/profile verification passes 23 unit
  tests with 100% line and 98.14% branch coverage, and 18 browser checks.
  Targeted lint, typecheck, build and design primitive checks pass.
- Frame 08-10/14-16 comparisons remain pending: strict differences are
  14.65-26.93%, including incomplete banner artwork, the reference portrait's
  baked border, typography/icons and authentic session data. Evidence is in
  `/tmp/portal-avatar-profile-e2e`; these are not accepted pixel matches.

## Stage 7 verification

- The native drawer occupies x=617, y=98, width=895 and height=884 at 1512 x 982.
  Its 56px header and patterned body preserve the reference category/card rhythm;
  columns adapt to available width and scrolling stays below the header.
- Cards retain real launch parameters, disabled policy and the existing launch
  callback. Optional `presentation.launchOptions` carry explicit parameters and
  title overrides through a private `PresentedTile` extension. The shared `Tile`
  contract was left intact after its CRITICAL impact result.
- Drawer close/toggle, Escape, focus containment/return, reduced motion and
  390/768/1280px behavior pass in both themes. The focused drawer set passes 19
  unit tests with 100% line and 97.87% branch coverage, eight fixture tests and
  eight browser checks. Targeted lint, typecheck and build pass.
- The localhost login -> New Tile -> real Cashflow grid -> remove workspace
  journey passes in both themes. Evidence is in `/tmp/portal-drawer-tests`.
- Frame 06/17/18 acceptance remains open: clean full background/card artwork is
  unavailable, and production Global/Indonesia launch parameters are undefined.
  The fixture omits those pills rather than inventing launch behavior.

## Stage 8 verification

- The combined prototype browser run passes all 82 checks in 4.0 minutes,
  including native captures for all 14 references and the required login ->
  New Tile -> real tile -> remove workspace journey in both themes. Capture
  mode asserts behavior/geometry separately and does not assert source fidelity.
  Log: `/tmp/portal-final-combined.log`; evidence: `/tmp/portal-final-combined`.
- Avatar, Profile and Drawer implementation landed in `0d7e18b6`, `a77b3a88`
  and `311f5e9d`. The acceptance pass found a real workspace focus bug: MUI
  auto-scrolling moved the focused Add button off-screen. `d5ebf149` keeps Add
  outside the scrolling tabs and stabilizes desktop scroll-arrow widths. Both
  themes pass keyboard Add, selected-tab rename and ordinary delete clicks at
  390/768px. The Profile smoke locator now uses its accessible close name.
- The full Base suite passes 150 files and 497 tests, with 99.14% line and
  96.58% branch coverage. Final typecheck, build, design import verification,
  changed-file lint and formatting pass. Whole-workspace lint retains nine
  unrelated errors and 136 warnings in the existing baseline.
- Eight additional browser checks pass across both themes: survey explicit
  cancellation, session expiry and actual relogin/token renewal, cached admin
  filter/sort and remote draft restoration after resizing, and interrupted
  normal-motion drawer/profile controls with focus return.
- Two real-remote checks pass through the Ratan/Cashflow/Alpha dev servers at
  8009/8015/8018, with HTTP data fixtures. They verify rendered Cashflow rows,
  live theme propagation across design scopes, Alpha loading/503/retry/filtered
  empty states, and return to cached Cashflow after removing Alpha's workspace.
  The cached-draft check uses a remote-boundary fixture separately.
- The 125% pinch-zoom evidence includes keyboard close/reopen and focus return
  while zoomed. Pinch zoom can clip right-side controls in the visual viewport;
  it is not an all-controls-visible or desktop text/layout zoom acceptance gate.
- Legacy compatibility run: seven of eight checks pass. The remaining
  `legacy-new-light-home` zero-diff snapshot has an existing 600ms TabPanel mount
  race: the pre-delay capture matches its baseline exactly, while the post-delay
  capture matches the failed image exactly. Legacy Empty styles, timer and
  markup are unchanged from baseline `606debcd`. Repeats passed 2/2 and 7/8;
  baselines and thresholds were retained. This gate is not reported as green.
- Independent review found no actionable authentication, entitlement, launch,
  theme, cached-layout or focus regression. Desktop browser text/layout zoom,
  exact source comparison and measured interaction/API performance budgets
  remain open acceptance gates.

## Exact reference acceptance

Native captures are evidence, not passing visual comparisons. Supplied PNGs stay
fixed and implementation captures never replace them. Exact source comparison
remains appropriate for unchanged artwork; whole-screen review must account for
the compact adaptation. All 14 frames remain pending full visual review.

| Frames  | Remaining difference or dependency                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| 04      | Whole-screen typography/CTA parity; only the 624 x 452px illustration crop is an exact match.              |
| 05      | Header background, icons and tab geometry; country metadata has no supported contract.                     |
| 06      | Complete drawer/card artwork and source comparison over Cashflow.                                          |
| 07 / 13 | Menu text metrics/positions and dynamic version values; strict differences 11.34-11.36%.                   |
| 08 / 14 | Clean complete banner/portrait and typography, icons and session data.                                     |
| 09 / 15 | Expanded hierarchy/scroll geometry plus the same profile dependencies.                                     |
| 10 / 16 | Action-expanded hierarchy/chips plus the same profile dependencies; profile differences span 14.65-26.93%. |
| 11      | Lower 246px hero artwork, logo/font/icon parity; only the upper 822 x 736px art crop is exact.             |
| 17 / 18 | Complete drawer/card artwork; production Global/Indonesia launch parameters are undefined.                 |

Dark login, light empty illustration and responsive layouts are documented
adaptations without supplied counterparts. Clean artwork dependencies are listed
in [NEW_STYLES_ASSETS.md](NEW_STYLES_ASSETS.md).

## Opt-in and rollback

- Standalone preview: `http://localhost:8001/?new-styles=true&show_normal_login=Y&survey=no`.
  Optional `login-theme=light` or `login-theme=dark` selects unauthenticated mode
  without overwriting the saved authenticated workspace preference.
- Embedded hosts opt in with Base `newStyles=true`. It selects the full prototype
  theme and layout, regardless of the historical `new-layout` preview query.
- Roll back with `newStyles=false` or remove/set `new-styles=false` in standalone.
  `new-layout=true` with the prototype disabled retains the historical preview.
- Default appearance remains legacy. Default deployment rollout and full 1:1
  approval remain pending the acceptance gates above.
