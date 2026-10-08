# EMS3 Migration Plan For Approval

8 October 2026. All dates below are in 2026.

See the [short data guide](ems3-data-driven-guide.md) for database rows,
RATAN/FlowZero/Stamp examples and routing code. Use this plan for estimates and
release dates; its first production launch moves FlowZero only.

For a month-by-month view and rough later RATAN/Stamp launch targets, see the
[monthly timeline](ems3-monthly-timeline.md).

## Work To Complete

CES is the team/API providing EMS3 entitlements in this plan. The scope is
functional permissions: roles, features and actions. Data entitlements remain separate.

| Work | What needs doing | Done when |
| --- | --- | --- |
| **1. Request CES onboarding for RATAN** | Ask CES to onboard RATAN's EMS2 entitlement matrix into EMS3 in **UAT**, check it with RATAN owners, then prepare the approved setup in **PROD**. Include test-user and launch-user role assignments. | Roles, features and actions match the agreed EMS2 matrix; UAT and PROD IDs/names are confirmed. |
| **2. Integrate FMAA in `single-ui-bff`** | Confirm with FMAA/CES how the BFF should obtain its token and which endpoint/client/scope each environment requires. Integrate the agreed flow; test token acquisition, expiry, renewal and failures. | The BFF can authenticate and call CES in UAT and PROD; authentication failures block the authorization attempt. |
| **3. Integrate CES APIs and extend the tile table** | Read CES user permissions and route each tile by `provider`. Add `provider`, `ems3_app_id`, `ems3_app_name` and `ems3_subject` to `application_tile`, its audit table and admin/CSV handling. | EMS2 tiles use their existing fields; EMS3 tiles use the CES app/feature mapping and preserve existing Portal permission names. Mixed routing and no-fallback tests pass. |

Use the existing tile table for this configuration. The revised target does
not add an `authorization_application` table. RATAN onboarding prepares its
later migration; its production tiles stay on EMS2 until their approved switch.
The existing FMAA checks for admin CSV uploads do not prove CES authentication;
the supplied FlowZero example uses a client-credentials token flow.

## Known Gaps To Resolve

| Gap | Why it matters | What to do before switching |
| --- | --- | --- |
| **CES user APIs return all of a user's entitlements, rather than only selected entities.** | A user with many permissions may produce a large response, slow login or exceed the current BFF limit of **1 MiB per response**. Local filtering does not reduce the downloaded response. | Ask CES whether the required functional APIs support app filtering or paging. Until confirmed, fetch each required user endpoint once per authorization check and filter locally, rather than calling once per tile. Test users with many grants; measure response size and login time, and agree size/timeout limits. Never silently truncate permissions. |
| **Existing Portal entities do not map cleanly to EMS3 `appName` records.** | Looking up `X_RATANONE` as an EMS3 app name could miss RATAN permissions or select the wrong registration. | Confirm an explicit mapping with CES and each app owner: Portal entity/subject -> CES app ID/name/feature, separately for UAT and PROD. Store it in the tile's EMS3 columns. For example, supplied samples use `X_RATANONE` -> `RATAN_ENTITLEMENT_RULE` and `FLOW_ZERO` -> `FLOWZERO`; confirm production values. Keep existing Portal output names and reject missing or conflicting configuration. |

The UAT samples include `/fmces/v1/entitlement/app/{appId}/{appName}/user/{userId}`.
Ask CES whether it supports the complete functional grant set in PROD and how
it aligns with the aggregate response before replacing the current user APIs.

Resolve these gaps for each application before its switch. Confirm estimates
and dates once CES onboarding, FMAA/API access and the response tests are ready.

## Approach

1. Start CES RATAN onboarding alongside FMAA/CES integration in the forked Single UI BFF. Keep existing APIs, permission names and tile rules.
2. Add the provider and EMS3 mapping fields to each tile. Start all tiles on EMS2 and check existing applications.
3. Move FlowZero first. Keep RATAN settlements, other RATAN screens and Stamp on EMS2 in production.
4. Record each owner's approved tile switch in the database. Switch tiles sharing a permission together. Apply changes at the next login/recheck, without redeploying applications or the BFF.
5. Block login/rechecks when a required permission service fails. Never fall back to EMS2. Stop offering old protected screens after a failed recheck.
6. Test returning FlowZero to EMS2 before launch. Confirm its old permissions and users; otherwise test restoring the previous BFF and gateway.

## Estimation & Timeline

One person-day is one person's working day. Estimates count work across the team.

| Work | Estimated person-days |
| --- | ---: |
| Build, test and launch the FlowZero pilot | **30-45** |
| Test RATAN settlements and Stamp together; finish checks and instructions | **13-29 additional** |
| Each later application/tile group, after permissions and users are ready | **5-12** |

The 13-29 days include both test groups. Later production switches need another 0.5-1.5 days each if tests remain current. Estimate CES bulk onboarding/user setup and application fixes separately. These are the existing rough estimates; reassess BFF FMAA/CES integration and tile changes once the token contract and two gaps above are confirmed. Approval/access waits add calendar time.

Assign one BFF developer, frontend and QA support at half to full availability during their work, and named EMS3/platform/application contacts. Confirm availability before accepting dates.

| Dates | Actions | Finish check |
| --- | --- | --- |
| **8-9 Oct** | Request CES RATAN onboarding for UAT through PROD. Confirm people, FMAA/CES access, FlowZero IDs, entity/app mappings, selected tiles/functions and test users. | Owners, expected permissions and CES onboarding dates recorded. |
| **12-16 Oct** | Integrate FMAA and CES APIs. Build tile provider/mapping fields, change history and CSV support; fix browser permission handling. | Real FlowZero permissions returned; tile-selection and identity-mapping tests pass. |
| **19-23 Oct** | Deploy in UAT. Check login/renewal, denied users, removed permissions, tokens and failures. Test large CES responses and RATAN screens split between EMS2/EMS3. | FlowZero and EMS2 apps work; response size/time is acceptable; EMS2 cannot grant access to EMS3-selected screens. |
| **26 Oct-6 Nov** | Complete FlowZero user tests and fixes. Assign launch users, set alerts and test deployment/rollback. Check RATAN's CES UAT matrix and arrange PROD onboarding; prepare Stamp permissions/users. | Owner and operations approve FlowZero launch and rollback; RATAN onboarding/mapping status is recorded. |
| **9-13 Nov** | Launch FlowZero on EMS3 and monitor users. | FlowZero runs in production; other applications stay EMS2. |
| **16-27 Nov** | Test RATAN settlements and Stamp together: access, failures, rollback and user load. Confirm RATAN CES onboarding and UAT/PROD mappings. Update instructions. | Both pass; UAT permissions, users and IDs ready by 13 Nov; PROD readiness checked before later switches. |
| **30 Nov-4 Dec** | Close failures; finish switch instructions and support contacts. | Other teams can follow the tested steps. |

Move dates if access, inputs or tests are late. Launch only after user testing and rollback pass.

## Each Milestone Means

**By 13 November:**

- FlowZero tile 108 and its agreed functions use real EMS3 permissions in production.
- FMAA/CES access works in production; FlowZero mappings and large-response checks pass.
- RATAN settlements, other RATAN screens and Stamp remain on EMS2 and pass login/screen checks.
- Failed permission calls block login/rechecks without fallback. Alerts, support and tested rollback are available.

**By 4 December:**

- RATAN settlements and Stamp have passed testing together; their owners approve later production switches.
- RATAN's onboarded CES matrix matches the agreed EMS2 permissions; UAT/PROD mappings are confirmed, with PROD onboarding ready before its switch.
- Teams have permission-setup, test, switch and rollback instructions, plus support contacts.
- Teams can schedule switches after their checks pass. Tiles sharing a permission move together.

## What Each Application Needs

Before switching, the owner and platform team must:

1. Name the owner, EMS3 administrator and support contact. Choose application-team or Portal administration.
2. List tiles/functions moving and staying, including functions without tiles and tiles sharing permissions.
3. Complete CES onboarding in UAT, then PROD. Check the functional matrix against EMS2 and confirm Portal entity/subject -> CES app ID/name/feature mappings. Configure the tile fields and preserve existing Portal permission names.
4. Assign test users with access, without access and with multiple roles. Assign launch users before release.
5. Configure and test in UAT. Check FMAA/CES access, large entitlement responses, tiles/functions, login/renewal, removed access, failures and open screens. Test old tokens, which can last 12 hours.
6. Test switching and rollback without restoring removed users' access. Approve the date, record the change and check fresh logins after switching.

Check old numeric permission IDs before switching; fix application code if tests show a mismatch.
