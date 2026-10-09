# Tile routing: implementation and configuration

The forked BFF now chooses EMS2 or EMS3 per tile. Start with these selected
features; this is not a claim that the whole FlowZero application has migrated.

| Tiles | Provider | Portal permission | CES lookup |
|---|---|---|---|
| 36 | EMS2 | `X_RATANONE / RATAN_CASHFLOW_BLOTTER` | Existing EMS2 fields |
| 37, 39, 144, 152, 161, 165 | EMS3 | `X_RATANONE / RATAN_STRATEGIC_CASHFLOW_BLOTTER` | Confirmed RATAN app ID / `RATAN_ENTITLEMENT_RULE` / same feature name |
| 108 | EMS3 | `FLOW_ZERO / FLOW_ZERO_RAISE REQUEST` | Confirmed FlowZero app ID / `FLOWZERO` / `RAISE_REQUEST` |
| 48, 49 | EMS2 | `STAMP_STATIC / Mapping Query` or `Audit` | Existing EMS2 fields |

## Configure it

Flyway `V1_0_11__tile_entitlement_provider.sql` adds `provider`, `ems3_app_id`,
`ems3_app_name`, `ems3_subject` to tile and audit tables. Existing rows default
to EMS2. The older application table is retained for migration history.

Use the existing tile admin API or full configuration CSV. New JSON names are
`provider`, `ems3AppId`, `ems3AppName`, `ems3Subject`; CSV headers are `Provider`,
`EMS3 App ID`, `EMS3 App Name`, `EMS3 Subject`. Omitted fields preserve a saved
route. An explicit EMS3 selection requires every lookup field and one Portal
entity/subject. Update all six Strategic variants as one batch; a partial
cutover is rejected. Tile writes and their audits commit together.

Supply CES endpoints and credentials through the existing `EMS3_*` deployment
settings. Add Portal compatibility metadata in deployment YAML:

```yaml
scb:
  tile-entitlements:
    entity-ids:
      "[X_RATANONE]": ${RATAN_PORTAL_ENTITY_ID}
      "[FLOW_ZERO]": ${FLOWZERO_PORTAL_ENTITY_ID}
    subject-paths:
      "[X_RATANONE/RATAN_STRATEGIC_CASHFLOW_BLOTTER]": /RATAN_STRATEGIC_CASHFLOW_BLOTTER
    retain-ems2-entities:
      - FLOW_ZERO
```

Use the existing EMS2 entity IDs from confirmed responses. CES app IDs/UIDs
must not replace them. `51358` is the supplied UAT parent ID, not confirmed
production configuration. Brackets preserve punctuation in Spring map keys.

Optional `subject-names` preserves a JWT name when a tile stores only its path,
for example `"[FMO PORTAL ADMIN//importmap]": importmap`. `subject-paths` preserves
the separate `longName`. The tile remains the provider/feature source.

`retain-ems2-entities` keeps untiled EMS2 functional permissions. FlowZero's
launch tile covers only `RAISE_REQUEST`; keep `FLOW_ZERO` in that list until its
other functions have explicit mappings. Existing RATAN EMS2 tiles already
retain its other functions. Remove a retained entity only after full migration
has been verified. Neither the tile mapping nor this list handles data access.

## What happens at login

1. Read visible tiles and effective ownership together, including inactive
   migrated permissions and the last published state of pending admin edits.
2. Run one EMS2 lookup for needed legacy entities: account roles, then batched
   functional grants when roles exist. Call CES once per authorization
   attempt: token, detailed grants and aggregate grants, independent of tile count.
3. Validate complete selected CES registrations before selecting features.
   Convert CES names to the Portal aliases stored on the tile.
4. Remove EMS3-owned subjects from every EMS2 role. Decide each tile's visibility
   from its selected provider, then merge roles/subjects/actions for the response
   and signed entitlement JWT. In mixed roles, keep EMS2 role metadata.
5. Return the existing drawers, entities and token format. A confirmed empty
   feature grant hides its tile. A provider failure rejects the whole attempt
   with `AUTHORIZATION_UNAVAILABLE`, without fallback or new tokens.

Two registrations can share one parent ID. Multiple tiles can reuse the same
CES feature. One Portal registration can also serve several Portal aliases,
provided each tile explicitly selects its feature. Data entitlement fields
remain outside this functional permission projection.

## Verification and remaining live work

Run the [verification build](../verification/README.md) for real BFF source,
synthetic provider HTTP responses, isolated PostgreSQL and signed test JWTs.
Final local run: **782 tests passed**, no failures/errors/skips. Coverage of the
specified authorization classes and new validators: **99.89% lines, 96.83%
branches**. Router: 100% lines, 95.98% branches; both new validators: 100%.

The [dump replay](evidence/ems3-tile-scenario-results.json) passed with 113 visible
catalogue rows, 40 role/provider combinations and 50 exported roles. These are
local fixture checks, not live user migration results. A small
[verification summary](evidence/ems3-tile-verification-summary.json) records the
command, coverage and limits.

Live acceptance still requires CES production mappings/user grants, the FMAA
service-token contract, and UAT comparisons. This implementation retains the
evidenced client-credentials token flow and current bounded HTTP responses.
Large-response handling improvements, full untiled-feature mappings and browser
permission refresh after successful renewal remain later production work.
An existing signed token is not revoked by a failed renewal response.
