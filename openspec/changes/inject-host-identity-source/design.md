## Context

The identity contract and SDK controller exist, but `PortalHost` currently constructs a hard-coded anonymous capability inside the component. The legacy platform obtains a token and user/entity data in `apps/base`, persists `SET_TOKEN` and user/entity values, injects `userId` and `Single-UI-Authorization` through a shared request interceptor, and exposes `getUser/hasPermission` to Cashflow through `mfe-ratan-container`. The two-layer target must replace that chain rather than rehost it.

## Goals / Non-Goals

**Goals:**

- Let the host bootstrap provide one generic live `IdentityCapability`.
- Thread the same capability through registry loading and direct application composition.
- Keep a stable frozen anonymous default when no source is configured.
- Preserve source subscription semantics for login, refresh, and logout.
- Document the legacy behavior and explicit migration boundary.

**Non-Goals:**

- Reading legacy local/session storage or importing legacy stores/globals.
- Exposing access or refresh tokens in platform contracts.
- Choosing login, SSO, refresh, CSRF, or request-header behavior.
- Activating Cashflow mutations.

## Decisions

### Inject the versioned capability, not user data or credentials

`App` and `PortalHost` accept an optional `IdentityCapability`. The bootstrap can later create that capability from an approved adapter, normally via the validated SDK identity controller. The host forwards the capability by reference rather than copying snapshots, so mounted applications observe its existing subscription stream.

Passing a raw user object was rejected because it bypasses runtime versioning and observation. Passing tokens was rejected because applications do not need credentials to make UI authorization decisions and contracts must not become a credential bus.

### Use a module-owned anonymous fallback

A dedicated host identity module exports one frozen anonymous snapshot and one frozen capability. Reads return the same snapshot reference and subscription returns a no-op unsubscribe because the fallback never changes.

Constructing anonymous state inside `PortalHost` was rejected because it obscures the bootstrap dependency and creates redundant capability instances.

### Keep authentication and request transport separate

The identity capability carries only state, user id, and permission identifiers. A future concrete request transport obtains credentials from its approved secure session mechanism; it does not extract them from `IdentitySnapshot`.

Copying `SET_TOKEN`, `Single-UI-Authorization`, or `mfe-ratan-container` helpers into the host was rejected because it would retain legacy storage coupling and create a third runtime dependency in practice.

## Risks / Trade-offs

- [An injected capability violates its type at runtime] → Production adapters must publish through `createIdentityController`, which validates, clones, and freezes snapshots; host tests use that path.
- [Identity and credential session updates can race] → The future auth adapter/transport integration must define atomic session activation and logout cancellation; this slice keeps the concerns separate.
- [Default remains anonymous] → This is intentional fail-closed behavior until a real source is approved.
- [Permissions expose domain identifiers] → The platform transports opaque strings; applications retain all domain interpretation.

## Migration Plan

1. Introduce identity injection with the anonymous default and verify no runtime behavior changes.
2. Implement an approved authentication adapter separately and publish through the SDK controller.
3. Inject that capability at host bootstrap while Cashflow still has no service.
4. Add the approved transport and cohort activation only after authenticated identity journeys pass.

Rollback removes the injected source or restores the anonymous default; registry and applications do not change.

## Open Questions

- Which SSO/login integration replaces the legacy base login flow?
- Where will the secure credential/session state live if it is not exposed in identity?
- How are refresh, expiry, logout cancellation, and cross-tab/OpenFin synchronization coordinated?
- Which legacy entity formats map to the flat permission identifiers in identity?
