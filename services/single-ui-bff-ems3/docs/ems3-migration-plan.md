# EMS2 to EMS3: function entitlement POC and rollout plan

Updated 2026-10-05. This document defines the agreed migration scope. See the [BFF integration explanation](ems3-bff-integration.md) for the current code, database schema and verification steps.

Use the separate [plan for approval](ems3-approval-plan.md) for the current
approach, estimates, dates, milestone checks and application checklist.

## Current progress

**Local POC passed:** the [runnable POC](../poc/ems3-functions/README.md) exercises five synthetic accounts through a real loopback EMS3 HTTP service and a mixed EMS2/EMS3 router. The route table sends Ratan to EMS2 and portal-admin to EMS3, then merges both providers into the unchanged BFF response. It preserves the selected role grants and tile rules, keeps multiple roles for one entity, and denies every required-call failure without retaining the previous local result or falling back from EMS3 to EMS2. All 244 tests and the seven-result CLI demo pass. This completes steps 1-5 below for the selected function scope.

**Live EMS3 integration pending:** step 6 still needs EMS3 test access, real test accounts with known assignments, and confirmation that the selected API contract returns complete effective permissions. The local fixture does not establish those guarantees or production token revocation.

**BFF implementation added:** the actual service now has a PostgreSQL route table and audit history, provider routing in `AuthConfig`, a production EMS3 HTTP adapter, strict EMS2 response handling, and fresh entitlement checks on token renewal. The [verification build](../verification/README.md) tests actual BFF source with isolated PostgreSQL and synthetic provider responses. No live application is switched by these tests.

## Agreed first phase

Prove a reusable way to read EMS3 function permissions and show the correct Single UI tiles. Use a small selection of existing roles and synthetic test accounts. Keep existing function permission names and tile-matching behavior where possible.

The user confirmed:

- Production user-to-role assignments are maintained in another source. Use test accounts for the POC; connecting that source comes later.
- Complete application coverage is deferred. First establish the pattern and finish a small POC.
- This task covers function entitlements, mainly tile visibility. Country, booking-entity and other data entitlement controls are outside scope and are not prerequisites.
- Handle EMS3 API exceptions as restrictively as possible: reject the authorization attempt without using old or fallback permissions.

FlowZero is the only confirmed EMS3 pilot. The other applications' target definitions and test responses will be created during the work. Existing Ratan examples and EMS3 filter-rule columns do not establish a migrated Ratan application.

## What we can start with

The [production tile export](../../../scb-next/data/application_tile.csv), [Ratan role matrix](../../../scb-next/data/entitlements.xml), and [portal-admin matrix](../../../scb-next/data/entitlements_fmo_portal_admin.xml) are sufficient to define this POC. The [EMS3 samples](../../../scb/services/new-auth-service/EMS3%20Samples.json) and [FlowZero reference](../../../scb/services/new-auth-service/docs/ems3-integration-research.md) provide candidate transport and response patterns.

The XML matrices define role/subject/action relationships. The POC creates its own small user-to-role assignment fixture so it can exercise these relationships without the production assignment source. Label all test users and any fixture IDs as synthetic. Numeric IDs in fixtures demonstrate response compatibility only; they are not a production EMS2-to-EMS3 ID mapping.

The proposed initial selection is Ratan function permissions plus portal-admin function permissions. This exercises more than one application and role without requiring all applications. FlowZero supplies the integration reference; a later live test can use its existing test setup or a minimal EMS3 app provisioned for the POC.

## Test accounts and tiles

Proposed local test accounts:

| Test account | Assigned roles | Expected access in the selected tile set |
| --- | --- | --- |
| `poc-ratan` | `X_RATANONE` / `FMO_COO_SUP` | Trade Blotter, FM COO Rules and FM COO Exceptions; no portal-admin tiles. |
| `poc-admin` | `FMO PORTAL ADMIN` / `FMO_ADMIN` | Module Map, Drawer Category, Tile Configuration and FDC3; no Ratan tiles. |
| `poc-both` | Both assignments above | Both sets, with each role's own permissions preserved and no duplicate tiles. |
| `poc-two-roles` | `X_RATANONE` / `FMO_COO_SUP` and `FMO_KR_OPS` | Ratan COO/trade tiles plus Korea MX Exceptions; each role retains only its own subjects/actions. |
| `poc-none` | No roles | No protected tiles. |

These names are fixture identities, not existing production or EMS3 accounts. Removing the Ratan assignment from `poc-ratan` supplies the revocation scenario.

The initial protected tile set uses production tile IDs 1, 2, 3, 4, 18, 54, 104 and 105. Korea MX Exceptions (18) is denied to the COO-only account and allowed to the two-role account. Add synthetic blank-subject, case/path-matching and template tiles to check existing special behavior without expanding application scope. Expected decisions come from the EMS2 matrices and current matching rules, not from the mapper's own output.

## What to build

| Step | Work | Result |
| --- | --- | --- |
| 1. Prepare fixtures | Select the function permissions and tiles above, create test assignments, and define the expected visible tiles. | A small, repeatable example with known allowed and denied outcomes. |
| 2. Add an EMS3 test service | Return sample-shaped function responses for the test accounts and allow timeout, HTTP failure, malformed response and partial-result scenarios. Record the proposed application/role/name mapping explicitly. | Controllable API calls that exercise both successful and failed requests. |
| 3. Connect a POC authorization adapter | Read function grants, preserve their application and role association, and return the existing BFF entities/subjects/actions shape. Apply the current tile filter and preserve the entitlement-claim format where exercised. | The same selected tiles and function permissions as the EMS2 baseline. |
| 4. Add strict failure handling | Validate required responses before building any successful authorization result. Abort the whole request if any required token or grant call fails. Clear the POC's previous visible permissions on a failed recheck. | No new or stale tile access from a failed authorization attempt. |
| 5. Demonstrate the pattern | Run each account and error scenario through the POC. Record input, expected tiles, actual tiles and failure behavior. | A runnable local proof, documented results, and a list of platform assumptions to validate live. |
| 6. Validate against EMS3 | Use approved EMS3 test accounts and connectivity with FlowZero or a minimal provisioned application. Repeat successful, no-access, changed-role and failure checks. | Evidence that the pattern works against actual EMS3, separate from the local proof. |

The integration uses the existing `AuthorizationService` boundary, preserving the BFF's entity → role → subject → action relationships and `entityName:roleName` entitlement-claim keys. Database routing and the EMS3 adapter are implemented in BFF source; confirmation against the live EMS3 contract remains pending.

Use test-first development for the actual adapter and API behavior. Observe results through the authorization response and visible tile list. The prototype UI, if one is added, is only a way to drive these cases; a visual simulation alone is not evidence that an API failure is handled correctly.

## Preserve the existing function rules

The current [tile filter](../src/main/java/com/scb/sso/singleuibff/util/AdminModuleUtil.java#L97) uses exact entity-name matching and case-insensitive matching against either subject `name` or `longName`. It does not require a particular action name to show a tile. The POC preserves this behavior while keeping the role/action relationships available in the response.

For a non-template tile with a blank subject, a validated assigned entity is enough. Never create an entity just because it is listed in configuration or because part of a failed response was available.

Template tiles bypass the entitlement match after successful authorization. A valid no-grants result therefore hides protected tiles but may leave template tiles visible. An API failure is different: abort before the tile filter and return no successful drawer response, including templates.

Data entitlement fields and stored data filter expressions are not evaluated in this POC. Passing the POC establishes function-entitlement and tile-visibility behavior only. It makes no statement about row/data access in other services.

## Strict handling of API problems

The proposed POC API returns a clear authorization-service error, such as HTTP 503, if it cannot obtain a complete valid result. The frontend shows an authorization error and clears the POC's previous tiles/permissions. It must not show a successful login with whatever permissions were available before the error.

| Situation | Required behavior |
| --- | --- |
| Successful, complete response with grants | Show only tiles allowed by those grants; issue the corresponding successful result. |
| Successful, complete response explicitly saying no grants | Clear old function grants; return no protected tiles. Preserve template behavior only on this successful path. |
| Timeout, connection/TLS failure, failed token request, or non-success HTTP response | Abort the entire authorization attempt; no successful drawer response and no newly issued auth or entitlement token. |
| Malformed JSON, missing required fields, unsupported response shape, or unmapped permission in the requested POC scope | Abort; do not guess permissions or silently discard an invalid part. |
| Wrong application identity or wrong user identity where the API echoes it | Abort. Bind requests to the authenticated test user; do not claim to validate a response user field that the selected API does not provide. |
| Only some required application requests succeed | Abort the whole attempt; do not return the successful subset. |
| Recheck fails after a previous successful lookup | Clear local POC grants and tiles, and deny renewal/continuation that depends on the failed check. Do not reuse the earlier response. |

Set explicit bounded timeouts. For the POC, use no automatic retry or EMS2 fallback; a fresh user retry starts a fresh lookup. Do not serve stale permission caches, combine old and new responses, or substitute a successful empty result for an error. A missing record counts as no access only if the agreed API contract explicitly defines it that way.

The current [BFF response builder](../src/main/java/com/scb/sso/singleuibff/controller/v2/JwtAuthenticationController.java#L94) fetches permissions before issuing new tokens, which supports stopping issuance on failure. Existing extend/refresh paths and previously issued signed tokens require care: a failed lookup does not automatically revoke an old token. Use fresh isolated sessions for the local demo, test failure after success, and explicitly report this limit. Before an integrated/live rollout claims immediate revocation, it must verify session/token invalidation and renewal behavior at all affected consumers.

## POC acceptance checks

The local POC is complete when all of these are demonstrated with recorded results:

- Each test account sees exactly the protected tiles listed above for its role assignments.
- Multi-role access keeps grants associated with the correct app and role and does not duplicate tiles.
- Wrong entity, wrong subject and a same-named role in a different app cannot reveal a protected tile.
- Subject name/longName matching, blank subjects, empty drawers and template behavior match the current BFF on valid responses.
- A valid empty result and removal of a test role remove the corresponding function grants on the next successful lookup.
- Every error case in the table produces no successful authorization response or newly issued tokens. A success followed by an error cannot reuse the old tile list.
- At least one real local HTTP request exercises timeout/non-success handling; mapping JSON in memory alone is not enough to claim API handling is proven.
- A mixed request sends each entity to its configured provider, merges the results, and keeps separate roles for one entity.
- An EMS3 failure fails the whole authorization attempt and does not retry that entity through EMS2.
- No production settings, assignments or application permissions are changed by the local POC.

Report two separate milestones: **local POC passed** and **EMS3 test-environment integration passed**. The first can be completed using synthetic accounts and responses. The second requires platform access and real EMS3 test accounts but does not require all production apps or the production user-role source.

## What comes after the POC

Once the pattern is accepted, connect the real user-role source, collect the remaining function definitions as each app is onboarded, and replace test-only identifiers with the agreed production mapping. Use the implemented application-by-application provider routing, validate all consumers of the function entitlement response, and plan production switching, removal timing, observation and rollback.

The existing production inventory remains useful for that later work: 129 tiles, 115 active, including 99 active non-template tiles; five supplied XML entities cover at least one configured entity on 59 of those 99. The other 40 are later onboarding work, not POC blockers. Defer full catalog coverage, SSTM ownership gaps, inactive/test-row disposition and bulk user assignment migration until their application rollout is planned.

The [BFF assessment](ems3-migration-assessment.md) remains a technical reference. This agreed phase-one scope takes precedence over its earlier whole-system collection and data-policy recommendations.
