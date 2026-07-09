# Admin FDC3 Backend CRUD Design

## Purpose

`apps/base/src/admin/FDC3Declaration` already provides an admin UI for FDC3 declarations, intent master data, and context master data. The backend must persist and serve that data through the POST endpoints the UI already calls, while matching the existing admin module response shape and entitlement validation flow.

## Scope

Implement backend APIs in `services/backend` for:

- Declaration CRUD at `v1/fmo/admin/fdc3/{data,create,update,delete}`.
- Intent master CRUD at `v1/fmo/admin/fdc3/intent/{data,create,update,delete}`.
- Context master CRUD at `v1/fmo/admin/fdc3/context/{data,create,update,delete}`.

The frontend contract remains unchanged. Responses use `ResponseOfAdminModule` so the UI continues reading `response.data.data`.

## Data Model

Add three Flyway-managed tables under `post_trade_portal_service`:

- `fdc3_declaration`: keyed by `app_id`, stores `interop` as JSON text plus admin metadata.
- `fdc3_intent`: keyed by `name`, stores `description` plus admin metadata.
- `fdc3_context`: keyed by `context_type`, stores `schema_json`, `samples_json`, `description`, and admin metadata.

Each table includes `ems2_role`, `is_active`, `created_at`, `updated_at`, `created_by`, and `updated_by`. Delete endpoints soft-delete by setting `is_active=false`, preserving auditability without adding separate audit tables in this change.

## API Behavior

Every endpoint accepts `entitlementsToken` in the request body and validates it through `AdminModuleUtil.validate(...)`.

List endpoints:

- Filter by the caller's `ems2Role`.
- Return active records sorted by `updatedAt` descending where useful.
- Return UI-shaped payloads:
  - declarations: `{ appId, interop }`
  - intents: `{ name, description }`
  - contexts: `{ schema, description, samples }`

Create endpoints:

- Require the natural key: `appId`, `name`, or a context type derivable from `schema.properties.type.const` or `schema.type`.
- Reject duplicates among active records.
- Store the caller's `ems2Role` and user subject from the entitlement payload.

Update endpoints:

- Require an existing active record with the same key and caller `ems2Role`.
- Update mutable payload fields and metadata.
- Do not allow changing natural keys.

Delete endpoints:

- Require the key and caller `ems2Role`.
- Soft-delete the record.
- Return the deleted UI-shaped record.

Validation failures and missing records return HTTP 400 with `ResponseOfAdminModule.result=false` and a clear `errorMessage`, matching existing admin controllers.

## Implementation Units

Add request DTOs:

- `RequestOfFdc3Declaration`
- `RequestOfFdc3Intent`
- `RequestOfFdc3Context`

Add entities and repositories:

- `Fdc3Declaration` / `Fdc3DeclarationRepo`
- `Fdc3Intent` / `Fdc3IntentRepo`
- `Fdc3Context` / `Fdc3ContextRepo`

Add a focused service:

- `Fdc3AdminService`
- `Fdc3AdminServiceImpl`

Add a controller:

- `FDC3AdminController`

Register service beans in `AuthConfig`. Add local-profile support only if boot tests require overriding persistence behavior; otherwise the H2-backed repositories should run normally under the local profile.

## Testing

Use TDD. Add failing MockMvc tests first, then implement the minimum backend code to pass.

Required tests:

- Declaration create, list, update, and delete.
- Intent create, list, update, and delete.
- Context create, list, update, and delete.
- Duplicate create returns HTTP 400.
- Missing update/delete returns HTTP 400.

Run backend tests from `services/backend` with Maven. If full application tests are too broad, run the new controller/service test class directly first, then a broader backend test command before completion.

## Out Of Scope

- Frontend redesign or endpoint changes.
- Separate audit history tables for FDC3 data.
- Export/import for FDC3 admin data.
- Broker runtime integration with the stored declarations.
