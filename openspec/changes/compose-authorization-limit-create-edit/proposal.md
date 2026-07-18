# Change: Compose Authorization Limit create/edit cohort

## Why

The application now has verified design primitives plus pure entitlement and mutation service ports. Create/edit can be composed and behavior-tested without selecting production authentication or transport, provided the capability is explicitly injected and the current production bootstrap remains read-only by default.

## What changes

- Add an opt-in Authorization Limits mutation capability containing a principal and service port.
- Add entitled create and confirmed-record edit triggers using production design APIs only.
- Add controlled validation, loading, local success/error feedback, and local record reconciliation.
- Preserve the current read-only runtime whenever the capability is absent.
- Defer delete and all pending confirm/reject transitions to separate cohorts.

## Impact

- Affected code: production Cashflow Authorization Limits composition and tests/docs.
- No host/platform contract, backend adapter, federation sharing, or design-system changes.
- Existing production bootstrap supplies no mutation capability and remains behaviorally read-only.
