# EMS2 to EMS3: a short data guide

The implementation extends **`application_tile`** with a provider and EMS3
lookup fields. Each tile selects its entitlement source. There is no new
`authorization_application` table in this target design.

This covers functional entitlement: tile visibility and feature/action grants.
Country, region and business-row access remain separate data entitlements.

Use the [approval plan](ems3-approval-plan.md) and [monthly timeline](ems3-monthly-timeline.md)
for effort and dates. The first production pilot is FlowZero only. The mixed
RATAN/FlowZero example below shows the later rollout pattern.

The branch now implements the selected tile feature pattern. The deployment
[configuration and verification notes](ems3-tile-implementation-results.md) show
how to keep FlowZero's untiled functions on EMS2 during this first phase.
Live CES onboarding and production permission equivalence still need UAT proof.

## 1. Before migration: actual data

Portal stores tile configuration; EMS2 stores the grants. The database dump
does not contain the complete permission matrix or user-role assignments.

Representative rows from [application_tile.csv](../../../scb-next/data/application_tile.csv):

| Tile ID | `ems2_entities` | `ems2_subject` | What opens |
|---:|---|---|---|
| 36 | `X_RATANONE` | `RATAN_CASHFLOW_BLOTTER` | Older BAU Cashflow Blotter |
| 37, 39, 144, 152, 161, 165 | `X_RATANONE` | `RATAN_STRATEGIC_CASHFLOW_BLOTTER` | Strategic Cashflow Blotter/Dashboard and variants |
| 108 | `FLOW_ZERO` | `FLOW_ZERO_RAISE REQUEST` | FlowZero |
| 48 | `STAMP_STATIC` | `Mapping Query` | Stamp Mapping Query |
| 49 | `STAMP_STATIC` | `Audit` | Stamp Audit |

Example grants from the supplied matrices:

| Source | User role | Subject/feature | Allowed actions, shortened |
|---|---|---|---|
| RATAN EMS2 XML | `FMO_OPS_BO` | `RATAN_STRATEGIC_CASHFLOW_BLOTTER` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Export_Data`, `F_Hold`, plus 14 others |
| FlowZero EMS3 pilot | `Global_Onboard_BatchOps` | `RAISE_REQUEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| Stamp EMS2 XML | `VIEW_ONLY` | `Mapping Query` | `Read` |
| Stamp EMS2 XML | `VIEW_ONLY` | `Audit` | `Read` |

RATAN has 806 grant rows, Stamp 458, and the FlowZero EMS3 pilot catalogue 398.
See the [full matrices](ems3-matrices-current.md) for all roles and actions.
No standalone `FLOW_ZERO` EMS2 matrix was supplied. RATAN's separate
`RATAN_FLOW_ZERO` subject is not the same binding as tile 108.

The tile's `ems2_role`, such as `RATAN_PROD`, controls configuration
administration. It is not the user's grant role. Read user roles from EMS.

## 2. After migration: extend the tile row

### Columns

Add these four columns to `application_tile`:

| Column | Example | Purpose |
|---|---|---|
| `provider` | `EMS2` or `EMS3` | Selects the source; default `EMS2` |
| `ems3_app_id` | `51358` | Expected EMS3 registration/parent ID |
| `ems3_app_name` | `FLOWZERO` | Selects the EMS3 application |
| `ems3_subject` | `RAISE_REQUEST` | Selects the EMS3 feature |

Require nonblank EMS3 fields when `provider='EMS3'`. An EMS2 tile can leave them
empty. Use `(ems3_app_id, ems3_app_name)` to identify the application.
The target does not require a stored `ems3_app_uid` or duplicate `ems3_itam_id`.
The samples use the same value for detailed `appId` and aggregate `itam_id`;
confirm that relationship for the production API before validating both against
one column.

**Provider determines the permission lookup:**

```text
EMS2 -> ems2_entities + ems2_subject
EMS3 -> ems3_app_id + ems3_app_name + ems3_subject
```

For an EMS3 tile, the existing `ems2_entities` and `ems2_subject` values also
serve as the Portal output names. They are not used to get its grants from
EMS2. This keeps JWT keys and drawer metadata compatible:

```text
EMS3: FLOWZERO / RAISE_REQUEST
Portal output: FLOW_ZERO / FLOW_ZERO_RAISE REQUEST
```

Map `name` to the old Portal subject and `longName` to its expected name/path.
For FlowZero, both can use `FLOW_ZERO_RAISE REQUEST`. The current JWT builder
uses `name`, while drawer matching also checks `longName`.

### Response field mappings: EMS2 -> EMS3 -> Portal

EMS2 uses two responses: `GET /ems2/rest/account/{userId}` for assigned roles
and `POST /ems2/rest/entitlements/entitlementList` for grants. EMS3 uses
`GET /fmces/v1/entitlement/user/{userId}` for grants grouped by role and
`GET /fmces/v1/entitlement/user-response/{userId}` for the combined result.

In the table below, EMS2 grant fields are inside
`response[userId].entitlements[]`; EMS3 detail fields are inside each item of
the detailed response array. Portal fields are inside `entities[]`, unless
otherwise stated. These mappings describe the revised tile-based target.

| Meaning | EMS2 response field | EMS3 response field | Portal result / rule |
|---|---|---|---|
| User | Account response `accountName`; grant response key `[userId]` | Aggregate `user_data.user_id` | Validate against the signed-in user; internal `accountName` stays that user ID. |
| Application/entity name | `role.entity.name` | Detail `appName`; aggregate `user_data.app_name` | Match the tile's `ems3_app_name`, then return `name = ems2_entities`, e.g. `RATAN_ENTITLEMENT_RULE` -> `X_RATANONE`. `applicationName` holds the EMS3 app name for a CES-only role; mixed roles retain EMS2 metadata. |
| Application registration ID | No direct equivalent to the EMS3 registration | Detail `appId`; aggregate `user_data.itam_id` | Validate against `ems3_app_id` only after confirming their relationship with CES. Do not use this as the Portal entity ID. |
| User role name | `role.name`, also encoded in account `entitlementTypes[].uniqueName` | Detail `entitlementName` | `roleName`, e.g. `FMO_OPS_BO`. This is not the tile's admin `ems2_role`. Any role rename needs an approved mapping. |
| Subject/feature name | `subject.name` | `featureActionDtos[].features.featureName` | Select using `ems3_subject`, then return the Portal subject name from `ems2_subject`, with an optional `subject-names` compatibility override for path-only bindings. |
| Subject path/display name | `subject.longName` | No direct equivalent in the supplied detail response | Return the agreed Portal `subjects[].longName`; preserve existing paths where required. |
| Action name | `action.name` | `featureActionDtos[].actions.actionName` | `subjects[].actions[].name`; preserve the action name, e.g. `F_Export_Data`, or use an approved rename. |
| Portal entity numeric ID | `role.entity.id` (also in subject/action entity references) | No equivalent Portal ID; `appUID` is an EMS3 application identity | Preserve the agreed Portal `id`; do not substitute `appId` or `appUID`. Configure it in `scb.tile-entitlements.entity-ids`. |
| Role numeric ID | `role.id` | Detail `entitlementId` (numeric string) | `roleId`; retain EMS2 metadata for a mixed role, otherwise use the numeric CES role ID. |
| Subject numeric ID | `subject.id` | `featureActionDtos[].features.featureId` | `subjects[].id`; the current POC uses the EMS3 feature ID. |
| Action numeric ID | `action.id` | `featureActionDtos[].actions.actionId` | `subjects[].actions[].id`; the current POC uses the EMS3 action ID. |
| One grant's numeric ID | Grant `id` | No equivalent grant ID in the supplied EMS3 detail | EMS2 fills `subjects[].actions[].entitlementId` with the grant ID; EMS3 leaves it null. EMS3 `entitlementId` identifies the role, not this grant. |

EMS2 account `uniqueName` contains
`entityId|entityName|roleId|roleName`. The supplied XML export shows role,
subject and action names, but does not supply these numeric API IDs or user
assignments. EMS2 `applicationName` is descriptive metadata, not the entity
lookup key. Confirm numeric-ID consumers before launch; the two systems' IDs
are not interchangeable. The tile router uses the deployment compatibility map for Portal IDs, and
validates them against EMS2 metadata when both providers serve an entity.

The aggregate EMS3 response is a cross-check, not the source for assigning
permissions to individual roles:

| Aggregate EMS3 field | How it relates to the detailed response |
|---|---|
| `user_data.user_id` | Must match the requested user; the detail sample has no user field. |
| `user_data.app_name`, `user_data.itam_id` | Check the selected app name and confirmed registration identity. Detail `itamId` may be null; do not confuse it with aggregate `itam_id`. |
| `entitlements.entitlement_name[]` | Must match the set of detail `entitlementName` values for that app. |
| `entitlements.role_entitlements[].feature` / `.action` | Must match the union of detail feature/action pairs. This list does not say which role granted each pair; do not copy the union into every role. |
| `entitlements.data_entitlements[].key` / `.values` | Country/region/business data access. Keep separate from subjects/actions and tile visibility; also keep its policies, profiles and logical indicator separate. |

The other data-only paths are `entitlements.data_policies.policy_rules[]`,
`entitlements.data_profiles.data_profile_rules[]` and
`entitlements.data_entitlements_logical_indicator`. None maps to a functional
subject/action grant.

Nested `features.applicationDto` and `actions.applicationDto` carry `appName`
and `appUID`; check that they identify the same application as their parent.
The revised target selects by app name/ID without requiring a stored UID.
EMS2's `count` must equal its grant-list length. EMS3 has no equivalent count
in these samples; validate both endpoint results and their agreement before
returning success. A failed API response is not an empty grant list.

Full names and other EMS2 account metadata have no demonstrated equivalent in
these EMS3 functional responses. Keep the agreed authentication/profile source;
do not invent values from entitlement names.
EMS2 account `status` describes API success; `accountStatus` describes account
state. EMS3's normalized `SUCCESS` means the grant lookup was validated, not
that the account is enabled.

#### Worked example: RATAN_STRATEGIC_CASHFLOW_BLOTTER

Use tile 37, role `FMO_OPS_BO` and action `F_Export_Data`. The EMS2 names
come from the supplied XML. The EMS3 values below use the [worked detailed JSON](examples/cashflow-ems3/ems3-detailed-response.json):
its permission IDs are synthetic, and its app identity comes from UAT samples.
This is an illustration of the mapping, not a live migrated user response.

| Field | EMS2 value | EMS3 value | Portal result |
|---|---|---|---|
| Entity/application | `role.entity.name = X_RATANONE` (tile binding) | `appName = RATAN_ENTITLEMENT_RULE` | `name = X_RATANONE`; `applicationName = RATAN_ENTITLEMENT_RULE` |
| Registration | No equivalent registration ID | `appId = "51358"`, `appUID = 10` | Validate app identity; neither value replaces the Portal entity ID. |
| Role | `role.name = FMO_OPS_BO` | `entitlementName = FMO_OPS_BO` | `roleName = FMO_OPS_BO` |
| Subject/feature | `subject.name = RATAN_STRATEGIC_CASHFLOW_BLOTTER` | `features.featureName = RATAN_STRATEGIC_CASHFLOW_BLOTTER` | `subjects[].name = RATAN_STRATEGIC_CASHFLOW_BLOTTER` |
| Subject path | `subject.longName = /RATAN_STRATEGIC_CASHFLOW_BLOTTER` | No `longName` field | Preserve `/RATAN_STRATEGIC_CASHFLOW_BLOTTER` in `subjects[].longName`. |
| Action | `action.name = F_Export_Data` | `actions.actionName = F_Export_Data` | `subjects[].actions[].name = F_Export_Data` |
| Role ID | Not supplied in the XML | `entitlementId = "9001"` (synthetic) | `roleId = 9001` for a CES-only role; mixed roles retain EMS2 metadata |
| Subject ID | Not supplied in the XML | `features.featureId = 9101` (synthetic) | `subjects[].id = 9101` in this POC example |
| Action ID | Not supplied in the XML | `actions.actionId = 9206` (synthetic) | `subjects[].actions[].id = 9206` in this POC example |

Here, the subject and action names already match. The application name needs
the mapping `RATAN_ENTITLEMENT_RULE` -> `X_RATANONE`.

#### Worked example: FLOWZERO

Use tile 108, role `Global_Onboard_BatchOps` and feature `RAISE_REQUEST`.
EMS3 values come from the [supplied UAT responses](../../../scb/services/new-auth-service/EMS3%20Samples.json).
On the EMS2 side, only the tile binding is supplied; there is no standalone
FlowZero EMS2 user response or matrix to prove the roles/actions are the same.

| Field | EMS2 side: evidence available | EMS3 UAT value | Proposed Portal result |
|---|---|---|---|
| Entity/application | Tile `ems2_entities = FLOW_ZERO` | `appName = FLOWZERO` | `name = FLOW_ZERO`; `applicationName = FLOWZERO` |
| Registration | No equivalent registration ID | `appId = "51358"`, `appUID = 65` | Validate app identity; preserve the agreed Portal entity ID separately. |
| Role | User role not supplied | `entitlementName = Global_Onboard_BatchOps` | `roleName = Global_Onboard_BatchOps`, subject to owner confirmation. |
| Subject/feature | Tile `ems2_subject = FLOW_ZERO_RAISE REQUEST` | `features.featureName = RAISE_REQUEST` | `subjects[].name = FLOW_ZERO_RAISE REQUEST` |
| Subject path | EMS2 `longName` not supplied | No `longName` field | Use the agreed alias `FLOW_ZERO_RAISE REQUEST` for `subjects[].longName`. |
| Action | EMS2 action not supplied | `actions.actionName = RAISE_NEW_REQUEST` | `subjects[].actions[].name = RAISE_NEW_REQUEST`, subject to owner confirmation. |
| Role ID | Not supplied | `entitlementId = "339"` | `roleId = 339` for a CES-only role; mixed roles retain EMS2 metadata |
| Subject ID | Not supplied | `features.featureId = 1500` | `subjects[].id = 1500` under the current POC conversion rule |
| Action ID | Not supplied | `actions.actionId = 345` | `subjects[].actions[].id = 345` under the current POC conversion rule |

Here, both names need mapping: `FLOWZERO` -> `FLOW_ZERO` and
`RAISE_REQUEST` -> `FLOW_ZERO_RAISE REQUEST`. The tile router now updates both `name` and `longName`, preserving the Portal JWT key.

The resulting parsed Portal permission map could look like this. It combines
the two examples for illustration; it is not one real user's captured response.
RATAN is shortened to one of its 17 actions; FlowZero shows all four actions
on `RAISE_REQUEST` for this role. The mapper must retain all granted actions.

```json
{
  "X_RATANONE:FMO_OPS_BO": {
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER": ["F_Export_Data"]
  },
  "FLOW_ZERO:Global_Onboard_BatchOps": {
    "FLOW_ZERO_RAISE REQUEST": [
      "ACCESS_FMO_POST_TRADE_PORTAL", "VIEW_PUBLISHEDWORKFLOW",
      "RAISE_NEW_REQUEST", "BATCH_IMPORT"
    ]
  }
}
```

See the RATAN [aggregate JSON](examples/cashflow-ems3/ems3-aggregate-response.json),
[Portal response](examples/cashflow-ems3/portal-login-response.json) and
[manifest](examples/cashflow-ems3/manifest.json) for the full earlier POC example.

### Example rows: selected RATAN and FlowZero migrated; Stamp stays

All rows below are in `application_tile`. The six Strategic Cashflow variants
have the same settings; 37 and 39 are shown.

| Tile ID | `provider` | `ems2_entities` | `ems2_subject` | `ems3_app_id` | `ems3_app_name` | `ems3_subject` |
|---:|---|---|---|---|---|---|
| 36 | EMS2 | `X_RATANONE` | `RATAN_CASHFLOW_BLOTTER` | null | null | null |
| 37, 39 | EMS3 | `X_RATANONE` | `RATAN_STRATEGIC_CASHFLOW_BLOTTER` | `51358` | `RATAN_ENTITLEMENT_RULE` | `RATAN_STRATEGIC_CASHFLOW_BLOTTER` |
| 108 | EMS3 | `FLOW_ZERO` | `FLOW_ZERO_RAISE REQUEST` | `51358` | `FLOWZERO` | `RAISE_REQUEST` |
| 48 | EMS2 | `STAMP_STATIC` | `Mapping Query` | null | null | null |
| 49 | EMS2 | `STAMP_STATIC` | `Audit` | null | null | null |

`51358` and the application names are supplied sample identities, not confirmed
production configuration. NSTP can follow the same pattern using its confirmed
EMS3 feature name.

Tiles sharing a Portal `(entity, subject)` must have one provider and a
consistent EMS3 mapping. Change their rows together. This lets Strategic
Cashflow move while BAU Cashflow remains EMS2.

### Application-owned or Portal-owned registration

The tile schema is the same for both options. Example EMS3 lookup values:

| Example | Each application owns a registration | Portal owns a shared parent registration |
|---|---|---|
| RATAN Strategic Cashflow | `RATAN_ID / RATAN_ENTITLEMENT_RULE / RATAN_STRATEGIC_CASHFLOW_BLOTTER` | `PORTAL_ID / RATAN_ENTITLEMENT_RULE / RATAN_STRATEGIC_CASHFLOW_BLOTTER` |
| FlowZero | `FLOWZERO_ID / FLOWZERO / RAISE_REQUEST` | `PORTAL_ID / FLOWZERO / RAISE_REQUEST` |
| Stamp, when it migrates | `STAMP_ID / STAMP / Mapping Query` | `PORTAL_ID / STAMP / Mapping Query` |

These are proposed identity patterns. In the shared-parent option, application
names still separate grants. If EMS3 instead registers everything under one
`PORTAL` application name, use distinct feature names and explicit tile mappings
to separate RATAN, FlowZero and Stamp.

Application ownership distributes EMS3 edits among teams. Portal ownership
puts those edits in a central queue. Application owners approve and test the
permissions in both options.

### Related tables and changes

| Table/path | Change |
|---|---|
| `application_tile` | Add provider and the three EMS3 lookup columns |
| `application_tile_audit` | Copy the new columns into configuration history |
| `application_category` / `application_category_audit` | Keep menu/category configuration |
| `import_map` / `import_map_audit` | Keep frontend bundle configuration |
| Tile admin APIs and CSV import/export | Read, validate and save the new columns |
| BFF router and drawer/JWT builder | Read tile settings; use only the selected provider; map results to Portal names |

Repeated application IDs/names across tile rows are expected. Validate rows
sharing a permission together so one tile does not point to the wrong app.

### A launch tile is not every function

FlowZero has eight EMS3 features, but tile 108 names only `RAISE_REQUEST`.
The fields above select its launch feature and all actions/roles on that feature.
Before claiming the whole application has migrated, also bind its other
function permissions and test that the full grant set reaches the JWT.

Additional features without their own tiles need explicit mappings associated
with the owning tile, for example an additional feature-map JSON column in the
same table. Define that list with the owner; do not drop those grants or copy
all grants from a shared Portal registration. The separate untiled
`RATAN_FLOW_ZERO` permissions also need an approved binding. Existing unmigrated
function permissions keep EMS2 as their source during the transition.

## 3. Rough routing and data flow

The following is a simplified sketch of the tile router. The executable code is in
[`RoutingAuthorizationService`](../src/main/java/com/scb/sso/singleuibff/service/v2/implementation/RoutingAuthorizationService.java):

```text
snapshot = readVisibleTilesAndEffectiveOwnershipTogether()
legacyScope = activeEms2Entities(snapshot) + configuredRetainedEms2Entities
cesApps = distinctRegistrationsFromActiveEms3Tiles(snapshot)

ems2 = lookupEms2IfNeeded(userId, legacyScope)
ems3 = lookupAndValidateCompleteCesResponsesIfNeeded(userId, cesApps)
legacy = removeEms3OwnedSubjectsFromAllLegacyRoles(ems2, snapshot.ownership)
modern = selectConfiguredFeaturesAndMapToPortalAliases(ems3, snapshot.tiles)

for tile in snapshot.visibleTiles:
    source = modern if tile.provider == EMS3 else legacy
    visible[tile.id] = existingTemplateOrEntitySubjectRules(tile, source)

permissions = mergeByEntityAndUserRoleAndSubject(legacy + modern)
return { drawers: visibleTiles(visible),
         entities: permissions, entitlementToken: sign(permissions) }
```

Keep the source decision through filtering. EMS2 grants for a matching subject
cannot make an EMS3-selected tile visible. Merge actions under the same
`entity:userRole` before building the JWT so one provider's fragment cannot
overwrite the other.

Keep the existing EMS2 visibility rules: template tiles bypass grant checks,
and a blank subject uses entity-only access (for example tile 193, Exception
Auto Recover). An EMS3 tile requires its three lookup fields; a blank EMS3
subject is a configuration error.

The EMS3 adapter currently makes three calls per authorization check:

```text
POST token endpoint
GET  /fmces/v1/entitlement/user/{userId}          -- detailed grants
GET  /fmces/v1/entitlement/user-response/{userId} -- aggregate grants
```

The call count does not grow with the tile count. Filter the returned grants
by app identity and feature. Each response currently has a 1 MiB limit;
test response size for users with many grants.

An allowed RATAN test role can produce the same Portal permission key:

```json
{
  "X_RATANONE:FMO_OPS_BO": {
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER": ["F_Export_Data", "F_Hold"]
  }
}
```

This is a shortened illustration. The [full JSON example](examples/cashflow-ems3/portal-entitlements-map.json)
has all 17 actions. Its [manifest](examples/cashflow-ems3/manifest.json) identifies
the synthetic values.

**Successful response with no grant:** hide that tile. **Required provider call
fails or response is invalid:** reject the authorization attempt; issue no new
permission token and do not fall back to EMS2. Previously issued tokens and
open browser screens still need the session/browser handling in the rollout plan.

Data entitlements such as `Entity.Booking_Entity_SCI_FMID` and existing
`filter_rule` metadata remain separate from these provider columns. This
routing proposal does not implement business-row filtering.

## What is implemented

The saved POC uses `authorization_application` for entity-level routing and
makes `appUID` mandatory. This guide replaces that proposed configuration model
with tile-based routing and app-name/ID matching.

The code and database have not been changed for this revision. Implement the
tile/audit/admin/CSV changes, replace the router's table lookup, and test mixed
RATAN subjects, aliases, multi-role JWT merging, non-tile functions and failures.
The earlier POC results demonstrate the older routing and EMS3 API conversion;
they do not prove this revised schema or complete application migration.
