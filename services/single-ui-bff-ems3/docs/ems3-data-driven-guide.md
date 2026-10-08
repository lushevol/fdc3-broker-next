# EMS2 to EMS3: a short data guide

The proposal is to extend **`application_tile`** with a provider and EMS3
lookup fields. Each tile selects its entitlement source. There is no new
`authorization_application` table in this target design.

This covers functional entitlement: tile visibility and feature/action grants.
Country, region and business-row access remain separate data entitlements.

Use the [approval plan](ems3-approval-plan.md) and [monthly timeline](ems3-monthly-timeline.md)
for effort and dates. The first production pilot is FlowZero only. The mixed
RATAN/FlowZero example below shows the later rollout pattern.

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

Write the old Portal subject into both `name` and `longName`: the current JWT
builder uses `name`, while drawer matching also checks `longName`.

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

The following is pseudocode for the new design, not the current implementation:

```text
tiles = readActiveTiles()
validateProviderFieldsAndSharedSubjectMappings(tiles)

scopes = scopesFromTilesAndConfirmedNonTileMappings(tiles)
ems2 = fetchEms2OnceIfNeeded(userId, scopes)
ems3 = fetchEms3OnceIfNeeded(userId, scopes)

for tile in tiles:
    if tile.provider == EMS2:
        grants = selectEms2UsingExistingTileRules(ems2, tile)
        visible[tile.id] = existingEms2Visibility(tile, grants)
    else:
        grants = select(ems3, tile.ems3_app_id,
                        tile.ems3_app_name, tile.ems3_subject)
        visible[tile.id] = hasGrantedSubject(grants)

    picked += mapToPortalNames(grants, tile.ems2_entities, tile.ems2_subject)

picked += resolveConfirmedNonTileFunctionMappings(ems2, ems3)
permissions = mergeByEntityAndUserRoleAndSubject(picked)
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
