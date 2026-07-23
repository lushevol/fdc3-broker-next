# Design: Authorization Limit mutation ports

## Context

Legacy Authorization Limits derives a single role with Checker precedence from two permission strings. Users without initiate or verify permission are Visitors. Create, edit, and delete are available to any non-Visitor; confirm/reject are Checker-only and are blocked when the current user matches `updatedBy`. Pending status determines the confirm/reject action pair. Legacy services swallow all errors, which is not acceptable for production mutation feedback.

## Decisions

### Keep policy inside the Cashflow application

`AuthorizationLimitsPolicy` is a pure value created from `{ userId, permissions }`. It exposes view/create decisions and record-specific actions with stable denial reasons. It imports neither platform globals nor UI packages. Host identity/entitlement delivery remains a later platform decision; applications adapt the delivered principal to this port.

### Preserve proven legacy behavior before improving it

Checker permission takes precedence over Maker permission. Confirmed records allow edit/delete for Maker or Checker. Pending records allow the status-specific confirm/reject pair only for a Checker who did not submit the latest update. Unknown or incompatible states expose no mutation actions. Any future tightening of Checker initiate behavior is a product/security decision, not an accidental migration change.

### Model domain operations, not URLs

`AuthorizationLimitsService` exposes `list`, `create`, `edit`, `confirm`, `reject`, and `remove`. Commands carry immutable domain values and version metadata needed for optimistic concurrency. Endpoint paths, credentials, fetch/axios choice, and response decoding belong to a later adapter.

### Never convert failure into success-shaped absence

`AuthorizationLimitsMutationError` carries a stable category (`unauthorized`, `forbidden`, `validation`, `conflict`, `unavailable`, `unexpected`) and retryable flag. Adapters must reject; application composition decides feedback and retry. The port does not toast, navigate, or mutate UI state.

## Non-goals

- Implementing an HTTP adapter or selecting credential delivery.
- Adding mutation controls/dialogs to the production screen.
- Changing the fixture repository into a simulated backend.
- Moving entitlements into `@fm/platform-contracts` before host identity requirements are settled.
- Correcting unproven legacy policy or backend transition behavior.

## Rollout

1. Land policy/service types and exhaustive pure tests.
2. Keep the production read model unchanged and rerun pilot gates.
3. In the mutation cohort, supply an authenticated principal and concrete service adapter at the application bootstrap boundary.
4. Compose create/edit first, then status transitions, with per-operation tests and rollback flags.
