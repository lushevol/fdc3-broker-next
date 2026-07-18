# Design: Delete and pending transition composition

## Decisions

### Details-first action placement

Actions render on record details rather than adding raw action callbacks to the bounded grid. Confirmed records may show Edit and Delete. Pending records may show only the policy-derived pair for their status.

### Explicit decisions replace overloaded cancellation

Legacy popovers treated Cancel as a destructive reject/delete operation. The production composition renders separate Approve and Reject triggers; each opens its own `ConfirmationDialog`, where Cancel only dismisses. This preserves domain operations while removing an unsafe interaction ambiguity.

### Refresh after transition

Confirm, reject, and remove return backend-dependent records. After a successful operation the application calls the injected service `list()` and replaces local rows. This handles add rejection and approved deletion even when the affected record no longer exists. A list refresh failure is surfaced as an operation failure and keeps reconciliation explicit.

### Loading and local failure ownership

The application owns the selected action, pending state, service sequence, refreshed rows, and local feedback. `ConfirmationDialog` owns accessible modal presentation and disables confirm/cancel/Escape/backdrop while loading.

## Non-goals

- Activating mutation capability in the current production bootstrap.
- Defining HTTP endpoints, authentication, delete response schema, or rollout flags.
- Bulk actions or grid-level action renderers.

## Rollback

Omit the capability. All transition triggers and confirmation state disappear, retaining the accepted read-only browser behavior.
