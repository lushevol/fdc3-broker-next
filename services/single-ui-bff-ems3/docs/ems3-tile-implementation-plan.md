# EMS3 tile implementation plan

Review date: 9 October 2026. Branch: `codex/ems3-single-ui-bff`.
This is the plan for review; runtime code has not changed.

Use the [data guide](ems3-data-driven-guide.md) for field mappings and the
[approval plan](ems3-approval-plan.md) for CES onboarding, dates and user access.

## Result we want

Each tile chooses EMS2 or EMS3. Strategic Cashflow can move while other RATAN
subjects stay on EMS2. FlowZero uses its explicit app/feature mapping; Stamp
continues using EMS2. The browser receives the agreed Portal permission names.

| Example | Provider | Portal entity / subject | CES app / feature |
|---|---|---|---|
| RATAN BAU Cashflow, tile 36 | EMS2 | `X_RATANONE / RATAN_CASHFLOW_BLOTTER` | Not used |
| Strategic Cashflow, tiles 37, 39, 144, 152, 161, 165 | EMS3 | `X_RATANONE / RATAN_STRATEGIC_CASHFLOW_BLOTTER` | `RATAN_ENTITLEMENT_RULE / RATAN_STRATEGIC_CASHFLOW_BLOTTER` |
| FlowZero, tile 108 | EMS3 | `FLOW_ZERO / FLOW_ZERO_RAISE REQUEST` | `FLOWZERO / RAISE_REQUEST` |
| Stamp, tiles 48 and 49 | EMS2 | `STAMP_STATIC / Mapping Query` or `Audit` | Not used |

These are test scenarios. Migrations default existing tiles to EMS2; they do
not switch live applications. Production CES identities still need confirmation.

## What the branch already has

The forked service has EMS2/CES adapters, strict failure handling and fresh
permission checks on authentication paths. Its router still reads
`authorization_application` and chooses one provider for an entire entity.
The tile-based design in the latest guide has not been implemented.

The review also found that the JWT builder overwrites repeated
`entity:role` records, and the CES adapter changes FlowZero's `longName`
without changing its JWT subject `name`. Both need fixing for mixed routing.

## Implementation stages

| Stage | Changes | Proof required |
|---|---|---|
| **1. Tests and database/configuration** | Establish the existing test baseline. Add a later Flyway migration for `provider`, `ems3_app_id`, `ems3_app_name`, `ems3_subject` on tile and audit tables. Extend tile request/config DTOs, admin writes and CSV parsing. | Existing rows use EMS2; fields survive create/edit/audit/CSV; malformed EMS3 configuration is rejected. |
| **2. Tile routing and CES mapping** | Replace runtime application-table lookups with an immutable tile configuration snapshot. Group CES lookups by app ID/name, validate complete detail/aggregate responses, then select configured features and map them to Portal names. Remove the requirement to store UID and duplicate ITAM ID. | Mixed RATAN subjects work; repeated/shared registrations work; unrelated features and data entitlements do not become tile permissions. |
| **3. Drawer/JWT consistency** | Decide visibility using each tile's provider before merging grants. Merge by Portal entity, actual user role and subject, union actions, then build both entities and the JWT. Preserve subject names and expected paths. | FlowZero aliases are correct; both providers' RATAN subjects survive; EMS2 cannot authorize an EMS3-owned subject, including when its tile is inactive. |
| **4. Transport and renewal** | Extract CES token acquisition behind a replaceable interface. Keep the evidenced client-credentials flow while FMAA's CES contract is confirmed. Make response-size limits configurable and bounded. Ensure successful renewal applies fresh permissions through the agreed browser flow. | Calls do not increase with tile count; large/truncated/invalid responses and timeouts fail safely; failed rechecks issue no new tokens or partial permissions. |
| **5. Additional functions and live checks** | Define explicit mappings for features without tiles before full application migration. Configure confirmed FMAA/CES access and approved test accounts; run UAT comparisons and browser checks. | Selected-feature tests pass first; full FlowZero migration also proves all eight agreed features. Live acceptance remains dependent on CES access/onboarding. |

A valid response with no matching grant hides the tile. A required provider
failure or invalid response rejects the whole authorization attempt, with no
EMS2 fallback, partial permission result or new token.

Each stage starts with failing tests, adds the implementation, then receives a
separate verified commit. Work stays in `services/single-ui-bff-ems3`; any
browser integration changes are identified and reviewed separately.

### Configuration rules

- New tiles default to EMS2. An old admin request or CSV that omits the new
  fields must preserve an existing tile's provider and mapping on update.
- An EMS3 tile requires one Portal entity alias and nonblank app ID/name/feature.
  Existing EMS2 tiles keep their comma-separated entities, template behavior
  and blank-subject entity access.
- Tiles sharing a Portal permission use consistent mappings. Change the six
  Strategic Cashflow rows as one transaction, with audit and normal approval
  checks. Reject a conflicting single-row update; bulk writes need the same checks.
- Snapshot visible candidates and permission ownership consistently. Inactive
  EMS3-owned subjects must not return through retained EMS2 functional grants.
  Keep unpublished admin edits distinct from effective permission ownership.
- Retain unmigrated EMS2 functions explicitly. Do not infer that an application's
  whole grant catalogue has migrated from its one launch tile.
- Preserve committed Flyway history. The new router stops reading the old
  application table; migration/history cleanup can follow after compatibility checks.

## Decisions for this review

**Recommended: keep the four routing columns.** Store the existing Portal
entity IDs and exceptional subject paths in a small deployment compatibility
map keyed by Portal names. This supplies metadata, not provider routing. It
avoids another table and avoids requesting EMS2 just to recover an EMS3 ID.
For RATAN, preserve the subject path `/RATAN_STRATEGIC_CASHFLOW_BLOTTER`.

**Numeric IDs need an explicit policy.** Names drive permission checks. Keep
the configured Portal entity ID; validate it against legacy results in mixed
scenarios. For a mixed role, retain EMS2 role metadata when present; use CES
role IDs for a CES-only role. Subject/action IDs come from their owning provider.
Test consumers before live use; applications needing old permission IDs need
explicit compatibility mappings. CES role `entitlementId` is not an EMS2 grant ID.

**First delivery proves selected tile features.** The four columns cover
FlowZero's `RAISE_REQUEST` feature and every granted action/role on it.
For a complete FlowZero migration, recommend an optional additional feature-map
JSON field on the owning tile after the owner confirms the other feature aliases.
Untiled `RATAN_FLOW_ZERO` is also a separate mapping. This avoids adding a
new authorization application table or exporting every grant from a shared app.

## Validation

Use the [verification build](../verification/README.md): actual Java source,
synthetic HTTP fixtures, an isolated PostgreSQL database and signed test JWTs.
Update its coverage scope for the new authorization components and retain the
90% line/branch gate. Check schema migration, old admin/CSV compatibility,
atomic shared-permission updates, mixed-role IDs, source-specific visibility,
aliases, inactive configurations, concurrent changes, revocation and failures.

Test separate app IDs, a shared parent ID, and one Portal app with distinct
features. Check all authentication/renewal paths. Browser acceptance must show
fresh grants and removal after successful rechecks, and clear old protected
state after failure; an already signed JWT is not revoked by an HTTP 503.

CES still needs to confirm: production app mappings, whether absent app records
mean no access, `appId` versus `itam_id`, large-response/scoped API support,
the FMAA service-token contract, and temporary eForms/approved assignments.
OneCert self-service can follow its own onboarding. These are live acceptance
dependencies; they do not prevent building the tile pattern with test fixtures.

The GitNexus index refers to an older sibling checkout. The review used its
query capability, then verified findings against this branch's source.
