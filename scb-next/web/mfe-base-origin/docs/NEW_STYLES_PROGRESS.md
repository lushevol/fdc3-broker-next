# Portal styling implementation progress

The [implementation plan](NEW_STYLES_IMPLEMENTATION_PLAN.md) and
[specification](NEW_STYLES_SPEC.md) define the scope and acceptance gates.

| Stage                                     | Status      | Evidence / next step                                                                                                                          |
| ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. References, assets, contract, fixtures | Complete    | Resolver 5 tests and fixture 7 tests: 100% line/branch coverage. Browser smoke and three native evidence captures pass; type/lint/build pass. |
| 2. Theme and header                       | Implemented | 10 browser behavior/geometry checks and 61 shell/theme tests pass. Native capture reviewed; remaining reference differences listed below.     |
| 3. Login                                  | In progress | Connect recovered presentation to the real authentication controller; verify both themes and responsive states.                               |
| 4. Empty workspace                        | In progress | Connect reference illustration and CTA composition to the existing drawer dispatch.                                                           |
| 5. Avatar menu                            | In progress | Connect recovered pointer/section presentation to identity, versions and logout controls.                                                     |
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
- Seven targeted shell/theme tests pass; theme integration has 100% line and
  94.73% branch coverage. The broader Home/theme regression set passes 61 tests.
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
