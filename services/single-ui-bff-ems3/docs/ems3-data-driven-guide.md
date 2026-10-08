# EMS2 to EMS3: a short data guide

This guide uses the data already in this repository. It explains the change
through three real examples:

- RATAN Strategic Cashflow Blotter
- FlowZero
- Stamp

The scope here is **functional entitlement**: whether a tile or feature is
available. Data entitlement is separate: it decides which rows or countries a
user can see inside an application.

## 1. What exists today

### Three different data sources

| Source | What it contains | Example |
|---|---|---|
| Portal `application_tile` dump | The menu key and the EMS2 lookup names | `37, X_RATANONE, RATAN_STRATEGIC_CASHFLOW_BLOTTER` |
| EMS2 XML export | Role -> subject -> action grants | `FMO_OPS_BO -> RATAN_STRATEGIC_CASHFLOW_BLOTTER -> F_Export_Data` |
| EMS3 response | App identity plus role -> feature -> action grants | `FMO_OPS_BO -> RATAN_STRATEGIC_CASHFLOW_BLOTTER -> F_Export_Data` |

The Portal database does **not** contain the complete EMS2 grant matrix. It
contains the names that the BFF uses to ask EMS2 for grants.

### Portal rows used in this guide

From [`application_tile.csv`](../../../scb-next/data/application_tile.csv):

| Tile ID | Entity | Current subject | Tile |
|---:|---|---|---|
| 36 | `X_RATANONE` | `RATAN_CASHFLOW_BLOTTER` | Cashflow Blotter (BAU) |
| 37, 39, 144, 152, 161, 165 | `X_RATANONE` | `RATAN_STRATEGIC_CASHFLOW_BLOTTER` | Strategic Cashflow Blotter, Cashflow Dashboard and variants |
| 108 | `FLOW_ZERO` | `FLOW_ZERO_RAISE REQUEST` | Flowzero |
| 48, 49 | `STAMP_STATIC` | `Mapping Query`, `Audit` | Stamp |

The current table has `ems2_entities`, `ems2_role` and
`ems2_subject`. It has no `entitlement_source` column yet.
The tile's `ems2_role` (for example `RATAN_PROD`) is catalogue/admin metadata;
the end-user grant role in the XML is a different value (for example
`FMO_OPS_BO`).

### What the EMS2 data looks like

The supplied exports contain these useful totals:

| Export | Grants | Roles | Subjects | Actions |
|---|---:|---:|---:|---:|
| RATAN (`entitlements.xml`) | 806 | 25 | 25 | 51 |
| Stamp (`entitlements_stamp.xml`) | 458 | 4 | 32 | 6 |

For RATAN, role `FMO_OPS_BO` has 17 actions on the strategic cashflow
subject, including:

```
ACCESS_FMO_POST_TRADE_PORTAL
F_Export_Data
F_Hold
F_Un_Hold
...
```

For Stamp, the existing matrix includes grants such as:

```
VIEW_ONLY -> Mapping Query -> Read
VIEW_ONLY -> Audit         -> Read
```

No old standalone FlowZero EMS2 matrix was supplied. The RATAN EMS2 export does
contain a separate `X_RATANONE / RATAN_FLOW_ZERO` subject; that is not the
`FLOW_ZERO` tile row above.

### Functional and data entitlements are different

The Strategic Cashflow rows also contain a `filter_rule` with a key such as
`Entity.Booking_Entity_SCI_FMID`. That is tile/configuration metadata. It must
not be treated as the functional grant that makes the tile visible. A user
data-entitlement response is a separate object, for example:
The JSON below shows the shape only; it is not the `filter_rule` expression stored in the tile row.

```json
{
  "functional": {
    "subject": "RATAN_STRATEGIC_CASHFLOW_BLOTTER",
    "actions": ["F_Export_Data"]
  },
  "data": {
    "Entity.Booking_Entity_SCI_FMID": ["10040387", "400568282"]
  }
}
```

This POC routes and checks the first part. The application or its data API must
enforce the second part.

## 2. The target data after migration

### Small database change

The existing Portal tables still have the same jobs:

| Table | Job |
|---|---|
| `application_tile` | Which tile exists, and its entity/subject/role key |
| `application_category` | Where the tile appears in the menu |
| `import_map` | Which frontend bundle is loaded |
| `*_audit` tables | History of Portal configuration changes |
| `authorization_application` | Which provider and EMS3 identity a BFF entity uses |

For the first migration, add a functional source flag to
`application_tile`:

```text
entitlement_source = EMS2 | EMS3       -- default EMS2
```

Copy this field into `application_tile_audit` and the admin/API mapping so a
source change is auditable.

Example intended rows:

```text
tile 37  X_RATANONE  RATAN_STRATEGIC_CASHFLOW_BLOTTER  EMS3
tile 39  X_RATANONE  RATAN_STRATEGIC_CASHFLOW_BLOTTER  EMS3
tile 108 FLOW_ZERO   FLOW_ZERO_RAISE REQUEST           EMS3
tile 48  STAMP_STATIC Mapping Query                    EMS2
tile 49  STAMP_STATIC Audit                            EMS2
```

One rule keeps this simple: every tile with the same `(entity, subject)` must
use the same source. Therefore all six Strategic Cashflow rows (37, 39, 144,
152, 161 and 165) move together. A separate subject-route table is only needed
if one subject later has to be split between EMS2 and EMS3.

`authorization_application` already has the provider and EMS3 identity fields:

```text
bff_entity_name | provider | ems3_app_name         | ems3_app_id | ems3_app_uid | ems3_itam_id
X_RATANONE      | EMS2*    | RATAN_ENTITLEMENT_RULE | 51358       | 10           | 51358
FLOW_ZERO       | EMS3     | FLOWZERO               | ...         | 65           | ...
STAMP_STATIC    | EMS2     | null                   | null        | null         | null
```

The IDs above are examples from the POC and must be replaced with confirmed
environment values. The table is defined in
[`V1_0_10__authorization_application.sql`](../src/main/resources/db/migration/V1_0_10__authorization_application.sql).

`*` The current POC provider is entity-wide. For the first partial rollout,
`X_RATANONE` remains EMS2 by default while the tile source flag selects EMS3
for Strategic Cashflow. The router must combine those two fields.

### Two ways to own the EMS3 registration

| Option | What the data says | Good part | Cost |
|---|---|---|---|
| Each application owns its EMS3 ID | RATAN, FlowZero and Stamp each have their own `ems3_app_name`/UID | Clear ownership and independent release | More registrations to operate |
| Portal owns one shared EMS3 ID | Portal owns one parent ID and stores all three applications' features under it | One place to manage grants | A shared app ID/ITAM ID can be reused, but the current route table still requires unique active app names/UIDs; one identical app name/UID for all apps needs a router/schema change |

Both options preserve the same functional key: role + feature/subject + action.
The owner changes; the tile decision does not.

### The three examples after migration

#### A. RATAN Strategic Cashflow Blotter: EMS2 -> EMS3

Before:

```text
Portal: X_RATANONE / RATAN_STRATEGIC_CASHFLOW_BLOTTER
EMS2:   FMO_OPS_BO -> RATAN_STRATEGIC_CASHFLOW_BLOTTER -> F_Export_Data
```

After, EMS3 returns the same business grant with app identity added (illustrative
POC response; the IDs and user are synthetic):

```json
{
  "entitlementName": "FMO_OPS_BO",
  "appName": "RATAN_ENTITLEMENT_RULE",
  "featureActionDtos": [
    {"featureName": "RATAN_STRATEGIC_CASHFLOW_BLOTTER", "actionName": "F_Export_Data"}
  ]
}
```

The adapter maps `featureName` back to the Portal subject and produces the same
internal shape:

```text
X_RATANONE:FMO_OPS_BO:RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Export_Data
```

The complete worked 17-action response is in
[ems3-detailed-response.json](examples/cashflow-ems3/ems3-detailed-response.json)
and the mapped Portal result is in
[portal-entitlements-map.json](examples/cashflow-ems3/portal-entitlements-map.json).

#### B. FlowZero: EMS3 pilot

The Portal row is `FLOW_ZERO / FLOW_ZERO_RAISE REQUEST`. The supplied EMS3 pilot
catalogue has 398 grants across 39 roles, 8 features and 11 actions. For the
worked role `Global_Onboard_BatchOps`, the relevant feature is `RAISE_REQUEST`.
Its four example actions are `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`,
`RAISE_NEW_REQUEST` and `VIEW_PUBLISHEDWORKFLOW`.

The mapping is therefore:

```text
EMS3 feature:  RAISE_REQUEST
Portal subject: FLOW_ZERO_RAISE REQUEST
```

Tile matching can use the Portal subject as the EMS3 `longName` alias. The
EMS3 subject name itself is `RAISE_REQUEST`; if a JWT consumer requires the old
`FLOW_ZERO_RAISE REQUEST` name, add that canonicalization explicitly.

#### C. Stamp: remains EMS2

No migration is required for the first phase:

```text
STAMP_STATIC / Mapping Query -> EMS2 -> VIEW_ONLY -> Read
STAMP_STATIC / Audit         -> EMS2 -> VIEW_ONLY -> Read
```

The user can log in while RATAN and FlowZero use EMS3 and Stamp still uses
EMS2. The response is merged before the Portal filters the tiles.

## 3. Rough logic and data flow

### Login or entitlement refresh

```java
tiles = tileRepository.activeTiles();

for (tile : tiles) {
    required[tile.entitlementSource].add(tile.entity, tile.subject, tile.role);
}

ems2Grants = required[EMS2].isEmpty()
    ? empty()
    : ems2.fetch(userId, filterBySelectedSubject(required[EMS2]));

ems3Grants = required[EMS3].isEmpty()
    ? empty()
    : ems3.fetchAndValidate(userId, filterBySelectedSubject(required[EMS3]));

grants = mergeByEntityRoleSubject(ems2Grants, ems3Grants);
visibleTiles = tiles.filter(tile -> grants.matches(tile));

return loginResponse(
    drawers = visibleTiles,
    entities = grants,
    entitlementToken = sign(grants)
);
```

EMS3 uses three calls in the adapter:

```text
POST token endpoint
GET  /fmces/v1/entitlement/user/{userId}          -- detailed grants
GET  /fmces/v1/entitlement/user-response/{userId} -- aggregate grants/identity
```

The adapter checks the returned app name, app ID/UID, role, feature and action
before converting it to the Portal's existing entity/subject/action DTOs.

### Failure and denial decisions

```java
if (ems3CallFailsOrResponseIsInvalid()) {
    throw new AuthorizationUnavailableException();
    // no partial drawers
    // no stale permission token
    // no EMS2 fallback for an EMS3 tile
}

if (!ems3Grants.matches(tile)) {
    hide(tile);             // a valid denial is simply no access
}
```

The current router is entity-level: one `authorization_application` row routes
all of `X_RATANONE`. The `application_tile.entitlement_source` change is what
allows Strategic Cashflow to move while other RATAN subjects remain on EMS2.
The router must apply the same source split when it builds its provider scopes.

## What this POC proves

- EMS3 detailed and aggregate responses can be validated and converted to the
  existing Portal entitlement shape.
- A mixed login can combine EMS2 Stamp grants with EMS3 RATAN/FlowZero grants
  at entity level.
- An EMS3 error fails closed and does not silently retry EMS2.
- The existing tile entity/subject keys are enough to preserve the UI contract
  when the EMS3 feature names are mapped correctly.

It does not yet prove live production values, real user-role mapping, or data
row filtering. Those need a test account and confirmed EMS3 application
identities. The examples in this guide are synthetic POC data unless marked as
coming directly from `scb-next/data`.
