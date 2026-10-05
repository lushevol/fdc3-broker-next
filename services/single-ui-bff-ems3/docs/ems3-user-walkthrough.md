# What each user sees, and why

This walkthrough follows the original SCB frontend and the EMS3 BFF fork on
`codex/ems3-single-ui-bff`. It was checked against source and local execution on
2026-10-06. The original frontend is not yet connected to the fork.

Start with a distinction that matters on screen:

- A successful entitlement lookup decides which tiles the BFF returns.
- The browser stores that response and renders it. Its handling of an old menu,
  an already-open application or a failed renewal is a separate step.

The backend tests alone cannot prove that an old browser screen disappears.

## What "every case" means here

This report covers every branch of the current tile visibility rules, all 129
exported tile records, all 50 entity/role pairs in the supplied XMLs, every
subset of the three POC roles, the provider selection patterns, and the
login/session/failure paths in the current frontend.

Actual employees cannot be enumerated because their user-to-role source was not
supplied. Some tiles refer to applications absent from the supplied entitlement
XMLs. Their outcomes are described by the same rules but their real grants are
unknown. With 1,044 requested entity names, there are 2^1044 possible binary
provider selections; the report checks their behavioral classes rather than
claiming to execute that many configurations.

## Read the evidence

| Evidence | What it can establish |
| --- | --- |
| [Screen walkthrough](ems3-user-screen-flow.md) | Exact frontend click, state and rendering code; source-inspected screen behavior. |
| [Every database record](ems3-user-records.md) | All tile eligibility/visibility rows, all 50 role result sets and selected record traces. |
| [Replay input](evidence/ems3-scenario-input.json) | Sanitized CSV rows and XML grants, including source file, physical line and grant ordinal. |
| [Executed replay results](evidence/ems3-scenario-results.json) | Actual PostgreSQL query, actual mapping migration/JPA router and actual Java tile filter results. |
| [Replay commands](../verification/scenarios/README.md) | How to reproduce the new results. |
| Existing 747 BFF and 244 POC tests | Provider parsing/failure handling, mapping DB, controller responses and token checks. |

The new replay uses normalized provider fixtures. It does not call live EMS,
perform real user authentication, or drive the production browser. The SQL and
filter are the actual BFF code; the imported tables contain the fields used by
those paths, not the complete production schema.

## One complete example: COO user opens Trade Blotter

Use a synthetic user assigned `X_RATANONE:FMO_COO_SUP`. Set the Ratan route to
EMS2 and the portal-admin route to EMS3. Other catalogue routes remain EMS2.

| Step | What the user sees or does | Code and specific data |
| --- | --- | --- |
| 1 | Open the portal. With no saved token, the login screen appears after its initial session check. | [F1], [F2]. No tile permissions have been looked up yet. |
| 2 | Click Sign In With SSO. Alternatively use the password form when its flag is enabled. | [F3]. The callback selects Entra v3 login or OneMFA v2 login. |
| 3 | Authentication must succeed before any tiles can be returned. | [B1]. Local integration tests replace the identity provider with a test response; real identity-provider behavior remains untested. |
| 4 | The BFF reads active tile/category/import combinations. | [B2]. Trade Blotter is `application_tile_id=54`, category 15, import 10. See [D1]. All three rows are active. |
| 5 | The BFF collects entity names from the whole eligible catalogue. | [B3]. Tile 54 contributes `X_RATANONE`; the full dump produces 1,044 distinct names. This is not limited to the user's own roles. |
| 6 | The route row selects the provider. | [B4]. Record key: `authorization_application.bff_entity_name='X_RATANONE'`. Its `provider='EMS2'`. Each replay result records the actual generated row ID and version. |
| 7 | EMS2 returns the user's COO subject grants. | [B5]. `entitlements.xml`, line 1, entitlement ordinal 49 contains the COO Trade Blotter grant. Exact key: entity `X_RATANONE`, role `FMO_COO_SUP`, subject `RATAN_TRADE_BLOTTER`, action `ACCESS_FMO_POST_TRADE_PORTAL`. |
| 8 | The existing filter includes Trade Blotter. | [B6]. Exact entity match plus case-insensitive subject name/longName match. Tile 54's `ems2_subject='RATAN_TRADE_BLOTTER'`. |
| 9 | Login returns a permitted menu and signed entitlement JWT. | [B7]. The permission claim contains `X_RATANONE:FMO_COO_SUP -> RATAN_TRADE_BLOTTER -> actions`. |
| 10 | The home page initially has an empty workspace. Click New Tile or Find tile. | [F4]. This opens the already-stored menu; it does not call EMS again. |
| 11 | Trade Blotter appears under Trade Processing. Click it. | [F5]. The drawer record has ID 54, `container='@fm/ratan_container'`, `module='/trade_blotter'`, `tile='/trade'`. |
| 12 | A workspace panel loads the business app. | [F6]. SystemJS imports `@fm/ratan_container`; the module/tile paths are passed to it. Import map record 10 points at `/ratan_container/ratan_container.js`. |
| 13 | The business app either renders or its panel shows an error. | [F7]. Permitted menu visibility does not prove the application's bundle or API works. No live Trade Blotter render was tested against EMS3. |

If the Ratan route changes to EMS3, step 7 instead fetches a service token,
detailed grants and aggregate grants [B8]. EMS3 must return the registered
application identity and consistent permissions. After mapping those grants to
the common structure, steps 8-13 remain the same for equivalent named grants.
Numeric role/feature/action IDs may differ. The per-grant ID is null for EMS3.

## Every combination of the three test roles

These outcomes use all exported tiles, not the original eight-tile POC subset.
All rows assume authentication succeeds, the full mapping scope is valid and
every required provider responds successfully.

The 14 common templates are IDs `65,66,67,68,69,70,71,72,73,79,80,101,131,136`.
They include example tools, FDC3 tools, Report Scheduler and Access Management.

| Test user has | Protected tiles returned | Plus templates | Total tiles |
| --- | --- | ---: | ---: |
| No roles | None | 14 | 14 |
| COO only | 54 Trade Blotter; 104 FM COO Rules; 105 FM COO Exceptions; 156 Rule Engine; 193 Exception Auto Recover | 14 | 19 |
| Korea only | 18 Korea MX Exceptions; 193 Exception Auto Recover | 14 | 16 |
| COO + Korea | 18,54,104,105,156,193 | 14 | 20 |
| Admin only | 1 Module Map; 2 Drawer Category; 3 Tile Configuration; 4 FDC3 | 14 | 18 |
| COO + Admin | 1,2,3,4,54,104,105,156,193 | 14 | 23 |
| Korea + Admin | 1,2,3,4,18,193 | 14 | 20 |
| COO + Korea + Admin | 1,2,3,4,18,54,104,105,156,193 | 14 | 24 |

The replay executed each row under five provider patterns: both selected apps
on EMS2; Ratan EMS2/admin EMS3; Ratan EMS3/admin EMS2; both selected apps EMS3;
and the entire 1,044-name scope on synthetic EMS3 mappings. All 40 cases passed
with the same visible IDs. In the last pattern, EMS2 received zero calls.

For every mixed pattern, the other catalogue entities remain on EMS2. Putting
the two selected applications on EMS3 therefore does not yet remove EMS2 from
the full catalogue.

The actual browser has a further distinction: an SSO callback with no returned
entities triggers "No entitlements found" and logout [F8]. Password login does
not apply that same guard and can reach Home with template-only drawers. These
are source-inspected frontend paths, not an EMS3 browser test.

## All tile decision branches

Apply these in order to each database record:

| Case | What appears in New Tile after a successful current response | Code |
| --- | --- | --- |
| Category missing/inactive | Tile absent. | [B2] |
| Tile inactive | Tile absent. | [B2] |
| Import map missing/inactive | Tile absent. | [B2] |
| Eligible template, even with an entity or subject configured | Tile present without a grant check. | [B6] |
| Eligible non-template, no configured entity | Tile absent. | [B3], [B6] |
| Non-template, entity differs from every returned role's entity | Tile absent. Entity matching is case-sensitive. | [B6] |
| Non-template, matching entity and blank subject | Tile present even when that role has zero subjects. | [B6] |
| Matching entity and subject short name | Tile present, ignoring subject case. | [B6] |
| Matching entity and subject longName/path | Tile present, ignoring subject case. | [B6] |
| Matching entity but no matching subject | Tile absent. | [B6] |
| Several configured entities | Any matching entity/subject pair is enough. | [B6] |
| Several user roles for one entity | Subjects from any role may expose the tile; duplicates are removed. | [B6] |
| Same role name under another entity | No access from the role name alone. | [B6] |
| Subject exists but actions are empty or are not a presumed "allow" action | The filter still includes the tile. It checks subject presence, not action semantics. | [B6] |
| Category has no remaining visible tiles | Category disappears from the menu. | [B6] |

`ems2_role` on the tile/category/import row is not a direct menu filter here.
Neither `filter_rule` nor `entry_name` controls this menu. Business actions and
data permissions inside a loaded application are a separate concern.

### Two records that easily cause confusion

- Tile 131, Report Scheduler, has a long entity list but `is_template=True`.
  The current filter includes it after successful authorization even for no-role
  users. Its entities still contribute to the global provider lookup scope.
- Tile 193, Exception Auto Recover, has a blank subject. Any assigned Ratan
  role can expose it; Korea-only users do not need a separate subject grant.

## What every provider choice means

| Choice | Calls and screen outcome if every call succeeds |
| --- | --- |
| All requested names use EMS2 | EMS2 only. No EMS3 credentials are needed. |
| Some names EMS2, some EMS3 | Each provider gets its own scope; validated grants are combined before any successful response. |
| All requested names EMS3 | EMS3 only; no EMS2 fallback or calls. |
| Eligible catalogue has no entity names | No mapping/provider call; the successful filter can still return templates. |
| Change a route between requests | Next login/validate/relogin reads the new choice. |
| Change a route while a lookup is running | That lookup uses its copied route snapshot; a later lookup uses the change. |

All choices use [B4]. The choice is per BFF entity name; one visual tile can
reference several names. It is not necessarily one row per microfrontend bundle.

## Failed login or entitlement lookup

| Failure case | BFF result | What the current browser does |
| --- | --- | --- |
| Local password form validation fails | No BFF call. | Shows "Enter valid login credentials." |
| Identity provider rejects credentials | Login fails, normally HTTP 400. | Stays on login with generic retry message. |
| Missing, inactive, duplicated, invalid or incomplete route | Authorization HTTP 503 before provider calls. | New login stays on login; session-reopen failure clears auth and returns to login. |
| Mapping database cannot be read | Authorization HTTP 503. | Same respective frontend failure path. |
| EMS2 required API fails or is inconsistent | Authorization HTTP 503. | No successful replacement menu/token. Existing renewal screen may remain. |
| EMS3 credentials/URLs/settings missing when selected | Authorization HTTP 503. | Same. EMS2 is not tried as a replacement. |
| Token, detail or aggregate HTTP response is not 200 | Authorization HTTP 503. | Same. This includes 204,206,redirects,401,403,404,429,500,503. |
| Connection failure, timeout, interruption or oversized/stalled body | Authorization HTTP 503. | Same. |
| Malformed/duplicate/trailing JSON or wrong required field type | Authorization HTTP 503. | Same. |
| Wrong echoed user or application identity | Authorization HTTP 503. | Same. |
| Duplicate/conflicting roles, subjects, actions or IDs | Authorization HTTP 503. | Same. |
| Detailed and aggregate permissions disagree | Authorization HTTP 503. | Same. |
| Selected app omitted from aggregate result | Authorization HTTP 503, not "no access". | Same. |
| Selected app has explicit empty role/grant lists in both valid responses | Successful lookup with no roles for that app. | Other apps/templates may remain; SSO no-entity guard can still log out. |
| EMS2 portion succeeds but EMS3 portion fails | Whole response is 503; no partial EMS2 menu/token returned. | Renewal can leave the previously stored screen visible. |

Backend denial means `result=false`, `AUTHORIZATION_UNAVAILABLE`, no new
entities/drawers/entitlement token and no new session/refresh headers [B9]. It
does not automatically erase an old browser menu or revoke an old JWT.

One requested route can block every user's login even when that user has no
grant for that entity, because the requested scope comes from the whole eligible
catalogue. The large export produces 1,044 names. Live latency, EMS API scoping
limits and completeness at that size have not been tested.

## After login: every important transition

| User sequence | Fresh BFF behavior | Existing screen behavior / evidence |
| --- | --- | --- |
| Click New Tile repeatedly | No fresh entitlement call. | Existing stored menu opens/closes. |
| Click a visible tile | No fresh entitlement call at the click. | Creates/reuses workspace and imports its container. |
| Container fails to load | Outside provider routing. | Error panel says "There is a problem in this Tile." |
| FDC3 requests a tile absent from current drawer | No workspace opened by the dispatcher. | Unauthorized-or-does-not-exist error. |
| Close a workspace | No change to permissions. | Tab/panel removed; saved workspace state updated. |
| Reopen page with valid saved token | `/validate` checks current grants and issues current drawers/claim. | Home restores saved workspaces against current entities. |
| Reopen saved blank-subject tile 193 | BFF still permits it for an assigned Ratan entity. | Frontend restore requires a nonempty subject, so it can remove this saved panel. |
| Reopen a subject whose case differs | BFF ignores subject case and can return the tile. | Frontend restore compares case exactly and can remove the saved panel. |
| Reopen with invalid/expired/revoked session | `/validate` returns 401. | Return to login. |
| Reopen while entitlement provider is down | `/validate` returns 503. | Return to login; current CLEAR can remove the useful outage message. |
| Permissions added; login/validate/relogin succeeds | New drawers and claim include them. | Menu updated when nonempty. Existing panels are not automatically changed. |
| One role removed; login/validate/relogin succeeds | Drawers/claims shrink. | Menu can shrink; already-open panels are not reliably removed. |
| All roles removed | Templates can remain in the response; claim is `{}`. | Behavior differs between SSO/password; empty drawer responses are ignored by current handler. |
| Mouse activity triggers `/extend` | Rechecks providers then returns access token/expiry only. | Existing drawer and entitlement JWT do not refresh. |
| Near expiry triggers `/refreshtoken` | Rechecks providers then returns refresh token/expiry only. | Existing drawer and entitlement JWT do not refresh. |
| Extend/refresh gets 503 | Issues no new token. | Existing menu/workspace/tokens remain until other session handling occurs. |
| Session expires; user clicks Extend | `/relogin` checks refresh token/session/providers. | Successful result can replace drawers/claim; failure can leave timeout screen and old workspace state. |
| Logout | Session revocation attempted; browser clears auth locally. | Login screen returns; in-memory drawers/entities/workspaces are not all cleared. |
| Another user logs into same mounted frontend | New nonempty response should replace menu. | Stale drawer state can leak into a zero-drawer response because empty arrays are ignored. |
| Logout in another browser tab | Server session may be revoked. | Current storage listener does not immediately propagate logout to the other tab. |

See the exact frontend lines and timings in [the screen walkthrough](ems3-user-screen-flow.md).

## Screen gaps found by this analysis

These are unfinished compatibility checks, not behaviors proved by the previous
BFF test count:

1. Wire the browser/gateway to the new fork; it currently uses the existing gateway.
2. Decide and implement clearing the screen after authorization 503 during renewal.
3. Accept empty drawer results as replacement state.
4. Recheck/remove already-open workspaces when grants change.
5. Clear user-specific drawer/entity/workspace state on logout/account change.
6. Make SSO and password no-grant handling follow the agreed same rule.
7. Make restored-workspace checking match the BFF rules: consider all matching
   roles, allow matching-entity blank subjects, and ignore subject case. It
   currently checks only the first matching role and requires a nonempty,
   exactly cased subject, so permitted panels can disappear after reopening.
8. Preserve the outage reason when a restored-session lookup fails.
9. Agree whether template flags on Report Scheduler and Access Management should
   keep their current unrestricted menu visibility.
10. Agree the old-token lifetime/revocation rule and check downstream numeric-ID consumers.

These items have not been changed by this documentation/report work. A local
POC's clearing of its own memory is not proof that the real frontend clears its
screen.

## Exact boundaries of the new execution

The new report ran the native SQL read directly from `ApplicationCategoryRepo`
against a temporary PostgreSQL database loaded with sanitized dump records. It
ran the actual mapping migration, actual JPA route repository and actual
`RoutingAuthorizationService`, followed by actual `AdminModuleUtil.getDrawer`.

Observed: 129 tiles loaded; 113 selected; 16 excluded; 14 templates; 1,044 active
requested entity strings; 1,048 route rows backfilled including inactive tiles;
40 role/provider combinations and 50 single-role cases passed. Independent CSV/XML
predictions matched the executed results. All role/provider combinations retained
the same visible IDs; all-scope EMS3 made zero EMS2 fixture calls.

The five supplied XML catalogs describe 1,355 grant rows and 50 entity/role pairs.
Their union explains 59 of the 99 protected candidate tiles. Forty protected
tiles refer to entities outside these catalogs; they are not proven inaccessible
to real employees. Their corresponding grants and employee assignments are missing.

Production source was not edited. This report does not prove real EMS3 policy
completeness, real authentication, application API access, browser rendering,
full production-schema migration or immediate invalidation of old signed tokens.

## Code and record references

[F1]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-root-config-origin/src/index.ejs:22
[F2]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/routing/common/useController.ts:40
[F3]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Login/common/useController.ts:23
[F4]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/NewTile/index.tsx:33
[F5]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/Drawer/common/MenuItem.useController.ts:11
[F6]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/pages/Home/common/Container.tsx:11
[F7]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/components/FallbackError/index.tsx:17
[F8]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/scb/web/mfe-base-origin/src/utils/login.ts:143
[B1]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/controller/v2/JwtAuthenticationController.java:188
[B2]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/repository/ApplicationCategoryRepo.java:24
[B3]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:89
[B4]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/service/v2/implementation/RoutingAuthorizationService.java:43
[B5]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/service/v2/implementation/EMS2AuthorizationImplementation.java:47
[B6]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java:97
[B7]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/controller/v2/JwtAuthenticationController.java:95
[B8]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/service/v2/implementation/EMS3AuthorizationImplementation.java:53
[B9]: /Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/src/main/java/com/scb/sso/singleuibff/controller/v2/JwtAuthenticationController.java:144
[D1]: /Users/lushevol/code/github/fdc3-broker-next/scb-next/data/application_tile.csv:41
