# Plan to move all Single UI applications from EMS2 to EMS3

Updated 2026-10-02. This plan uses the production exports supplied in `scb-next/data`, the existing BFF code, and the FlowZero pilot reference.

## What we are doing

Move every application in the supplied Single UI production setup to EMS3 while keeping each person's access the same. Preserve existing role and permission names where EMS3 supports them. This includes portal administration, business actions, and restrictions on which data a person can see.

The user confirmed that **FlowZero is the only EMS3 pilot**. Ratan and the other applications still need to be set up in EMS3. Their EMS3 permission lists, user assignments, and comparison results will be created during this work. Existing JSON examples help us understand possible API shapes; they do not prove those applications are already migrated.

We have enough information to make this plan. Remaining exports, platform decisions, credentials, and tests are execution tasks with owners below. They do not need to exist before planning can proceed.

## The work in six steps

| Step | What happens | Main people involved | Result needed to finish the step |
| --- | --- | --- | --- |
| 1. List current access | Use the production dumps to list each app, its roles, permissions, users, data restrictions, and services that check access. Collect the missing EMS2 exports. | App owners and EMS2 team, with the BFF team | A complete list of what must move, who owns it, and how current access works. |
| 2. Design the same access in EMS3 | Agree how each existing app, role, permission, and data rule will be represented in EMS3. Use FlowZero to learn the platform's behavior. | EMS3 team, app owners, BFF team | A mapping for each app that preserves current access, including any name or ID translations. |
| 3. Set up the apps and users in EMS3 | Create each app's roles and permissions in a test environment, then copy the correct user/group assignments and data restrictions. Make the process repeatable. | EMS3 team and app owners | Working EMS3 setups and a report showing that every intended permission and assignment was copied. |
| 4. Connect the BFF and business services | Add EMS3 support to the BFF and update each app's own access checks and access-request process. Allow individual apps to switch when ready. | BFF team, app teams, access-management team | The same UI, token contents, allowed actions, and denied actions using EMS3. |
| 5. Compare the two systems | Generate EMS2/EMS3 results for the same users after the app is set up. Compare full permission definitions and assignments, then test user behavior. | App owners, testers, BFF and EMS3 teams | No unexplained extra access or missing access, including data restrictions and removed permissions. |
| 6. Switch production apps in groups | Refresh assignments, switch a tested group, observe it, and repeat. Retire each remaining EMS2 dependency when all its consumers have moved. | Release owner, app owners, EMS2/EMS3 and support teams | All applications and their access-management processes run on EMS3; old tokens, caches, and EMS2 connections are dealt with. |

Steps 2–4 can overlap once the shared EMS3 interface is agreed. Each app must finish its own setup and checks before its production switch. All apps remain in scope even though they switch in different groups.

## What the current files already give us

The user identified the CSV/XML dumps as production data. Record the extraction time and confirm completeness when creating the first migration snapshot; a row's `updated_at` value is not the export time.

| Supplied item | What is available | What it does not establish yet |
| --- | --- | --- |
| [Categories](../../../../scb-next/data/application_category.csv), [tiles](../../../../scb-next/data/application_tile.csv), [import maps](../../../../scb-next/data/import_map.csv) | 25 categories, 129 tiles, and 74 import maps. There are 115 active tiles: 99 non-template and 16 template tiles. | User-to-role assignments, all backend access checks, or complete application boundaries. |
| [Ratan matrix](../../../../scb-next/data/entitlements.xml) | `X_RATANONE`: 806 role/subject/action grants. | Actual users in those roles and data scopes. |
| [Portal-admin matrix](../../../../scb-next/data/entitlements_fmo_portal_admin.xml) | `FMO PORTAL ADMIN`: 36 grants across 12 roles, covering category, tile, and import-map management. | How those same admin roles will be registered and assigned in EMS3. |
| [SSI matrix](../../../../scb-next/data/entitlements_ssi.xml) | `SSIPLUS`: 35 grants. | Other entities such as the separately configured `SSI`. |
| [STAMP matrix](../../../../scb-next/data/entitlements_stamp.xml) | `STAMP_STATIC`: 458 grants. | The separately configured `VPA` permissions. |
| [SSDR matrix](../../../../scb-next/data/entitlements_ssdr.xml) | `SSDR_ANALYST`: 20 grants. | The other SSDR and reporting entities. |

Of the 99 active non-template tiles, 59 reference at least one entity represented in the supplied XML files; 40 reference none. This measures where collection can start, not whether an app is ready to migrate. A tile can reference many entities, so one matching entity does not establish full coverage. The 1,044 distinct entity values across active tiles are not 1,044 applications.

The tile export also has EMS3 filter rules on 24 active tiles using `Entity.Booking_Entity_SCI_FMID`. Include those rules in the design and verify their actual enforcement. Their presence in the database does not establish that the checked-out BFF or deployed services execute them.

Template tiles bypass the BFF's normal tile entitlement check. Preserve the intended behavior and test any backend they open. Review inactive/test-labelled rows with the owner so future reactivation cannot unexpectedly require EMS2; do not silently discard them because of their name or current status.

## Step 1: finish the list of what must move

Start a migration register with one row per application, expanding to entity/role mappings where needed. Track:

- App name and owner; all EMS2 entities it uses; proposed EMS3 application registration.
- Roles, subjects, actions, subject paths, and IDs used by consumers.
- Which users/groups receive each role, including inherited membership, expiry, disabled users, and service accounts where applicable.
- Data restrictions such as country, booking entity, or business area, and the service that actually checks them.
- BFF, backend, batch job, gateway, and other consumers of EMS2 or signed entitlement tokens.
- How access is requested, approved, changed, and removed; who operates that process.
- Status of test setup, comparison, production switch, rollback check, and EMS2 retirement.

The production tile list is the starting inventory. Ask each app owner to identify access checks outside the BFF as well. An app is complete only when its dependent services and jobs are included.

Collect the remaining EMS2 permission definitions and user assignments as a bulk export where available. Preserve an as-of snapshot and a record of later changes. The XML files contain definitions but do not include user assignments or numeric entitlement IDs; the migration team collects those from the relevant EMS2/account sources during this step.

Treat CSV `ems2_role` as the role that owns/manages the configuration record. For example, `RATAN_PROD` owns Ratan tile configuration, while Ratan users can have business roles such as `FMO_COO_SUP`. Keep those purposes separate when creating the EMS3 model. The category export also contains `SSTM_ADMIN`, absent from the supplied admin matrix; resolve its ownership/use during inventory even though no supplied tile uses that owner role.

## Steps 2–3: create the equivalent setup in EMS3

For each app, the EMS3 team and app owner will:

1. Choose its EMS3 application/ITAM registration and list every EMS2 entity it must represent. Do not assume every country/entity string needs a separate app, or merge them into one broad grant without preserving their restrictions.
2. Start with the existing role, subject, and action names. Record necessary translations explicitly. For Ratan, `X_RATANONE` is the existing entity; `RATAN_ENTITLEMENT_RULE` appears in examples and stored rules and is a candidate target name to agree, not proof of a ready target. Likewise, validate `FLOW_ZERO` and its BFF subjects against the pilot's `FLOWZERO` application.
3. Preserve which actions belong to each role, including admin ownership and maker/checker behavior. An aggregate list of all actions a user can do must not be assigned to every role they hold.
4. Define how country/booking-entity rules, combinations of rules, and inherited permissions work in EMS3. Identify the backend enforcement point for each rule.
5. Decide how consumers receive stable IDs and subject paths. Keep required legacy IDs through an explicit mapping, or update affected consumers deliberately. Matching names do not imply matching numeric IDs.
6. Agree the API that returns final allowed access and, where required, the association between each role and its grants. Confirm no-access responses, removals, missing/partial results, pagination, and response identity. Use FlowZero and EMS3 documentation/owner guidance to settle these questions.
7. Build a repeatable import using EMS3's supported onboarding mechanism. Import definitions, assign the correct users/groups, preserve restrictions and expiry, and capture the resulting IDs/version. Rerunning the import must not duplicate roles or silently broaden access.
8. Reconcile the complete role/subject/action sets and user/group assignments, not just total counts. Report rejected or unmapped rows for correction. Capture example EMS3 responses after the setup exists.

Keep EMS2 authoritative for each application's access changes until its switch. Choose either a controlled change freeze or a repeatable process that copies changes made after the snapshot. Copy removals as well as additions, and reconcile once more immediately before cutover. After switching, route new access requests and removals through the EMS3 process.

The EMS3 team also provides test/production endpoint configuration, service-principal permissions, secret references, network access, token behavior, and capacity limits as part of onboarding. These are provisioning tasks, not information the user must supply to complete this plan.

## Step 4: connect the applications

The BFF already has an `AuthorizationService` boundary suitable for an EMS3 implementation. Build a shared client for service-token handling and EMS3 requests, a mapper that produces the current BFF permission structure, and configuration that chooses the authority for each application's entities.

During rollout, each permission scope has exactly one provider: EMS2 or EMS3. The BFF may assemble responses from both for different applications, but it must never combine both providers' grants for the same scope. An EMS3 denial or error must not silently fall back to EMS2. Make the switching configuration complete and unambiguous, including entities shared by several tiles and users with roles in several apps.

Preserve the current `entities`, visible drawers, and string-valued `entitlements` claim in the BFF's signed token. Test login, Entra login, validate, relogin, and the existing token consumers. Plan refresh/extend behavior and invalidation explicitly because these flows do not currently all fetch new permissions. Keep portal-admin ownership and maker/checker checks equivalent, including people holding multiple admin roles.

Each app team also updates direct EMS2 calls, caches, backend data filters, scheduled jobs, and provisioning flows discovered in Step 1. Visible tiles alone cannot prove that business operations or data access work correctly.

Use the FlowZero reference to learn service authentication and response shapes. Correct its identified limitations before adopting any behavior: selecting only the first returned app, retaining function permissions after an empty grant response, losing policy combinations, and using a fixed token lifetime. Preserve actual permission decisions; handle transport or parse failures as failures rather than successful partial authorization.

Define the specification and tests before implementation, following the repository workflow. Include timeout/expiry/retry behavior, identity validation, empty/revoked grants, unknown mappings, role attribution, data restrictions, and mixed-provider users. Size requests by supported application/batch API, not by making a separate request for each of the 1,044 configured entity values. Meet the repository API response target and the agreed EMS3 request limits using measured tests.

## Step 5: prove people keep the same access

First compare all imported definitions and assignments. Then exercise representative users: normal access, several roles, admin roles, restricted data, no access, and recently removed access. Include every distinct mapping/restriction pattern and critical action; two sample users alone cannot establish whole-application coverage.

Compare at the same point in time, accounting for the recorded access changes. Check:

- The same apps and tiles are visible, and permitted apps open correctly.
- The same role-specific actions are allowed and forbidden in both UI and backend.
- Each user sees the same permitted data and cannot access data outside their scope.
- Admin ownership and maker/checker decisions match.
- User removal, role removal, expiry, and disabled accounts stop access within the agreed time.
- Service failures cannot accidentally grant access; slow or unavailable EMS3 behaves as designed.
- Existing token consumers still work, including users with applications on different providers.

Initially let EMS2 make the live decision and compare EMS3 in a way that cannot delay or change that decision. Use comparison reports containing the minimum necessary identifiers/differences. Correct every unexplained grant or denial. Any intended access change requires its own explicit decision because the migration requirement is to keep access the same.

## Suggested groups for production rollout

Prepare app setups in parallel when teams are available. The order below is a starting sequence; readiness and dependencies determine actual dates.

| Group | Applications | Why this group / work still needed |
| --- | --- | --- |
| 1 | FlowZero | Use the existing pilot to prove the shared integration and full BFF-to-backend behavior. Confirm its environment and readiness before treating it as a production success. Validate the legacy `FLOW_ZERO` mapping. |
| 2 | Ratan and portal administration | The Ratan and admin EMS2 matrices provide a strong starting point. Create their EMS3 setups and test the shared login/admin behavior. Prepare and test admin recovery early; switch portal admin only once management and rollback paths have passed. |
| 3 | SSI Plus and STAMP Static | Supplied matrices support `SSIPLUS` and `STAMP_STATIC`. Keep `SSI` and `VPA` in the register as separate work. |
| 4 | Remaining STAMP/VPA, CDUPS, LoanIQ, FMCES, and SSDR/reporting | Collect and migrate each complete application's entities and consumers. `SSDR_ANALYST` is one part of reporting; include the other roles and entity families before declaring the app complete. |
| 5 | FSS applications and all remaining register entries | Split FSS into owner-led groups such as payments, billing, fund services, and reporting. Cover country/data-scope variants. Resolve every inactive or test-labelled entry with its owner and record its outcome. |

Moving all apps does not require one simultaneous switch. When two applications share permission definitions or backend dependencies, move them together or document a tested coexistence arrangement.

## Step 6: switch, recover if needed, and finish

For each group, record a release owner and complete this runbook:

1. Confirm definition, assignment, behavior, failure, and performance checks passed. Provision the production EMS3 setup from the versioned mapping/import and reconcile it.
2. Copy the final access changes and record which system now owns future grants/removals.
3. Deal with previously issued tokens and caches. The checked-in BFF issues 12-hour entitlement tokens; switching providers alone does not invalidate them. Test the selected token/session invalidation or expiry strategy against the agreed removal deadline, including token use at downstream services.
4. Switch the group's BFF routes and dependent services in a tested order. Monitor unexpected grants/denials, login failures, entitlement lookup errors, and latency. Perform agreed business and admin smoke checks.
5. If access differs or service behavior breaches the agreed limits, stop that group and use the tested rollback. Reconcile changes made while EMS3 was authoritative before restoring EMS2, so rollback cannot restore revoked access. Invalidate affected tokens/caches and verify the recovered behavior.
6. After an agreed observation period, record the app owner's acceptance and remove the group's remaining EMS2 calls/configuration when no consumer needs them.

The rollout is complete when every inventory entry has a recorded outcome, every in-use application and dependency uses EMS3, new access requests and removals work, comparison issues are resolved, old tokens/caches are addressed, and monitoring shows no required EMS2 traffic for these applications. Retire their EMS2 credentials/configuration with the platform teams. Broader EMS2 shutdown must account for any consumers outside this deployment.

## First work package

The immediate work is to turn the supplied production exports into the migration register, assign owners to uncovered application families, and draft EMS3 definitions from the five available EMS2 matrices. In parallel, the EMS3 team uses FlowZero to confirm the API and supported import process, and the BFF team specifies the adapter and provider routing. These produce the inputs needed for app setup and testing.

The earlier [BFF assessment](ems3-migration-assessment.md) provides source references and detailed code concerns. The [FlowZero integration research](../../new-auth-service/docs/ems3-integration-research.md) records observed reference behavior. Neither document is a production migration result. This plan changes documentation only; no EMS3 application has been provisioned or production setting switched by this work.
