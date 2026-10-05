# Portal styling implementation progress

The [implementation plan](NEW_STYLES_IMPLEMENTATION_PLAN.md) and
[specification](NEW_STYLES_SPEC.md) define the scope and acceptance gates.

| Stage                                     | Status      | Evidence / next step                                                                                                                          |
| ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. References, assets, contract, fixtures | Complete    | Resolver 5 tests and fixture 7 tests: 100% line/branch coverage. Browser smoke and three native evidence captures pass; type/lint/build pass. |
| 2. Theme and header                       | Implemented | 10 browser behavior/geometry checks and 61 shell/theme tests pass. Native capture reviewed; remaining reference differences listed below.     |
| 3. Login                                  | Implemented | Native form geometry and responsive/Enter/loading/error checks pass in both themes; lower hero artwork remains unavailable.                   |
| 4. Empty workspace                        | Implemented | Reference dark illustration, responsive CTA and real drawer/analytics dispatch verified; light illustration is a documented adaptation.       |
| 5. Avatar menu                            | Implemented | Responsive menu, real identity/versions, logout, keyboard/outside close and focus restoration verified.                                       |
| 6. Profile                                | In progress | Connect recovered hierarchy to production identity, entitlements and photo policy.                                                            |
| 7. Tile drawer                            | In progress | Patterned responsive library and explicit launch-option metadata; retain current launch contracts.                                            |
| 8. Portal acceptance                      | Pending     | Both themes, responsive/motion checks and full localhost journey.                                                                             |

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
