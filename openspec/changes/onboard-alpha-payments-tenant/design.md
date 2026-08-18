## Context

The generated Alpha Payments descriptor reserves `/api/alpha-payments/`, `/static/alpha-payments/`, and remote name `@fm/alpha_payments`. The SCB Next development portal currently composes only the Ratan remote, obtains its New Tile catalog from the local login fixture, and serves broad fallback API mocks from the base Vite process. The onboarding proof must introduce a real tenant-owned UI and API while preserving the portal login, workspace, theme, and deletion behavior.

The local proof is development evidence only. It cannot close production checklist items for Kubernetes isolation, enterprise identity, data segregation, image admission, network policy, observability backends, availability, or operational approvals.

## Goals / Non-Goals

**Goals:**

- Implement a useful payment-investigation queue with API-backed case data, status filtering, text search, and acknowledgement.
- Serve the tenant UI and API as independent processes and compose the UI as a Module Federation remote.
- Preserve the descriptor's same-origin browser contract through portal proxies for `/api/alpha-payments/` and `/static/alpha-payments/`.
- Make the authorized Alpha Payments tile discoverable after portal login and removable through the existing workspace tab control.
- Verify public HTTP, React, federation-composition, and browser-journey seams using vertical red-to-green slices.

**Non-Goals:**

- Provisioning Kubernetes, ingress, DNS, identities, secrets, databases, queues, images, or production routes.
- Claiming that mock login data proves enterprise authentication, authorization, or cross-tenant isolation.
- Implementing persistence, maker-checker approval, bulk actions, FDC3 intents, or WebSockets in the initial proof.

## Decisions

### Use a dedicated Vite federation remote

`scb-next/web/mfe-alpha-payments-origin` will expose `./application` from remote name `mfe_alpha_payments` and run independently on port `8018`. It accepts the host container props but owns its page, API client, state, and styles. React and React DOM remain singleton shared dependencies.

Alternative: add the screen directly to the base host. Rejected because it would violate the generated tenant ownership and independent-release contract.

### Use a small tenant-owned Node HTTP service

`scb-next/services/alpha-payments-api` will run on port `8086` and expose `GET /healthz`, `GET /api/alpha-payments/v1/cases`, and `PATCH /api/alpha-payments/v1/cases/:id/acknowledge`. It uses an in-memory case repository for deterministic local evidence, validates methods, paths, identifiers, and request bodies, returns explicit JSON errors, and emits structured request logs carrying tenant and correlation identifiers.

Alternative: add endpoints to the broad development mock middleware. Rejected because that would not prove an independently owned backend or process boundary.

### Keep browser traffic on the reserved path families

The base Vite server proxies `/api/alpha-payments/` to the tenant API. The federation host registers the remote from a configurable development URL and provides `/static/alpha-payments/remoteEntry.js` as the canonical production contract. Local federation may resolve the independent origin directly when Vite's federation runtime requires it, but application API code contains no tenant service origin or port.

Alternative: call `http://127.0.0.1:8086` from the remote. Rejected because direct origins bypass the platform edge, complicate CORS, and diverge from the descriptor.

### Compose through the existing drawer and workspace contracts

The development login fixture will include an Alpha Payments entity, read/acknowledge entitlements, and a Payment Investigation tile using container `@fm/alpha_payments`. The base `Container` maps that container to the lazy federation import. No new navigation or workspace model is introduced.

Alternative: add a tenant-specific route outside New Tile. Rejected because it would not verify the portal onboarding journey requested by the guide.

### Keep the tenant UI operational and restrained

The remote uses inherited portal theme variables with local fallbacks, a compact summary band, filters, a semantic table, visible loading/error/empty states, and one explicit acknowledgement command per eligible case. Layout uses stable responsive tracks and horizontal table overflow at narrow widths; controls remain keyboard accessible and preserve visible focus.

Alternative: reuse the large Ratan dependency graph. Rejected because the tenant proof needs a small independent remote and does not require the existing cashflow domain components.

### Test four public seams

The agreed seams are the backend HTTP contract, federated React application behavior, portal drawer-to-remote composition, and complete authenticated browser journey. Tests observe only HTTP responses, rendered user behavior, host composition output, and public browser interactions; they do not call private helpers.

## Risks / Trade-offs

- [In-memory acknowledgements disappear on restart] -> Treat the service as local onboarding evidence and document persistence as a production dependency gate.
- [The local remote can load cross-origin during Vite development] -> Enable CORS only on the remote dev server; keep application API traffic same-origin and retain the canonical static path in the descriptor.
- [A broad mock API fallback could hide an absent tenant service] -> Configure the tenant API proxy ahead of fallback handling and assert returned tenant service metadata in HTTP and browser tests.
- [Fixture entitlements can be mistaken for real authorization] -> Label the journey as local evidence and leave identity/security approval checklist items incomplete.
- [Adding processes to the default dev command increases startup cost] -> Keep each tenant workspace independently runnable and use the root command only for full portal verification.

## Migration Plan

1. Generate and review the Alpha Payments onboarding bundle.
2. Add the API contract test and minimum service implementation.
3. Add the remote behavior test and minimum federated application.
4. Register the remote, same-origin proxies, workspace scripts, and authorized tile fixture.
5. Add and pass the portal composition and browser journey tests.
6. Run build, typecheck, focused coverage, existing portal regression, static verification, and browser inspection.
7. For production, replace in-memory data and fixture identity, package immutable images, provision tenant resources, verify them directly, and activate platform delegation last under a separate approved change.

Rollback removes the Alpha Payments drawer entry and host remote registration first, verifies existing portal tenants, and then stops or removes the tenant UI and API. No existing Ratan route or application contract changes.

## Open Questions

- Which enterprise payment case system will become the source of truth after the local proof?
- Which identity claim and entitlement evaluator will enforce `ALPHA_PAYMENTS:UI_READ` and `ALPHA_PAYMENTS:ACKNOWLEDGE` at the tenant API?
- Whether the production static family is served by a tenant edge or artifact/CDN layer remains a platform deployment decision.
