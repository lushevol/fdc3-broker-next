## Context

The new portal has only two runtime layers. The host supplies generic platform capabilities, including a minimal identity snapshot, while Cashflow owns Authorization Limits policy, service ports, HTTP adaptation, and UI. The default Cashflow export currently omits mutation capability entirely. The missing boundary is an application-owned way to combine a future service bootstrap with the current host identity without extending `ApplicationProps` with domain concerns.

## Goals / Non-Goals

**Goals:**

- Preserve the standard host-to-application component contract.
- Give Cashflow an explicit factory for optional application-owned dependencies.
- Derive the domain principal only from an authenticated platform snapshot.
- Use the injected service for both reads and mutations so one runtime source owns data consistency.
- React to identity changes and fail closed on logout or missing inputs.
- Keep the default export and standalone preview behavior unchanged and read-only.

**Non-Goals:**

- Selecting or implementing an authentication provider.
- Defining environment URLs, cookies/tokens, CSRF, timeouts, or a concrete request transport.
- Activating mutations in the shipped default application.
- Adding Authorization Limits concepts to the portal host or platform packages.

## Decisions

### Export an application factory

`createCashflowApplication(dependencies)` returns a component that accepts exactly `ApplicationProps`. Dependencies live in an immutable application-owned closure. The default `Application` is created with no domain service, preserving current behavior.

Extending host props was rejected because it would make the generic platform understand a Cashflow service. A mutable module-level setter was rejected because it creates cross-instance state and order-dependent tests.

### Compose a pure runtime value

A pure `composeAuthorizationLimitsRuntime(identity, service)` helper returns no mutation unless both the service exists and identity is authenticated. When available, it supplies the same service as repository and mutation service and clones/freezes `{ userId, permissions }` into the domain principal.

Directly passing platform identity into domain policy was rejected because it couples the domain to the platform contract and makes later contract evolution harder.

### Observe identity with React external-store semantics

The factory component reads and subscribes through `PlatformClient`. Missing identity capability adapts to a stable undefined snapshot and a no-op unsubscribe. A changed snapshot recomposes runtime dependencies without remounting the application.

On downgrade or principal change, Authorization Limits closes any open mutation editor/confirmation before further interaction. Server authorization remains authoritative for requests already in flight.

### Fail closed without fabricating fallback identity

Anonymous or absent identity never produces a principal. Service without authenticated identity may provide the repository/read path but cannot expose mutation controls. Authenticated identity without a service remains on the existing read-only repository and cannot expose mutation controls.

## Risks / Trade-offs

- [An in-flight request can finish after logout] → UI affordances and dialogs close immediately; future concrete transport must cancel requests or reject expired credentials, and the server remains authoritative.
- [A service configured for reads may itself require authentication] → Concrete bootstrap owns that policy; composition never invents credentials or swallows service errors.
- [Factory adds a second exported construction path] → Keep one canonical implementation and test the default export as the no-dependency factory result.
- [Permission identifiers are passed through] → Cashflow owns the existing permission taxonomy and policy mapping; the platform remains domain-neutral.

## Migration Plan

1. Ship the factory, pure composer, and live downgrade behavior while default dependencies remain absent.
2. Verify current browser rollback and two-layer boundaries.
3. After authentication and transport decisions are approved, construct the service in the Cashflow bootstrap and pass it to the factory behind a cohort flag.
4. Exercise authenticated non-production journeys and rollback before changing the default export.

Rollback is immediate: instantiate the factory without the service or revert the application bootstrap selection; no host or registry rollback is needed.

## Open Questions

- Which host authentication adapter will publish authenticated identity?
- Which environment configuration provides the Authorization Limits base URL?
- What credential, CSRF, timeout, cancellation, and observability policy will the concrete transport implement?
- Which cohort flag and legacy route own production rollback?
