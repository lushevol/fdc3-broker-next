## Why

The tenant onboarding processor now produces an approved-shape contract, but a new tenant developer still needs a concrete, repeatable path from that contract to a working front-to-back application in the SCB Next portal. Alpha Payments provides the first end-to-end proof that a generated tenant contract can become an independently served federated UI and API without bypassing the portal boundary.

## What Changes

- Add an Alpha Payments payment-investigation application as an independently owned Module Federation remote.
- Add a tenant-owned local HTTP API for health, payment case retrieval, and case acknowledgement.
- Compose the remote into the SCB Next host and expose it through the existing authenticated New Tile journey.
- Keep tenant API calls same-origin through `/api/alpha-payments/` and load the remote through the reserved `/static/alpha-payments/` family.
- Add contract, component, composition, and browser-journey verification that demonstrates the generated onboarding contract works front to back.
- Record local onboarding evidence without marking production security, Kubernetes, or operational approval gates complete.

## Capabilities

### New Capabilities

- `alpha-payments-tenant-application`: API-backed payment investigation, tenant federation, portal discovery, same-origin routing, and the authenticated business journey for the Alpha Payments tenant.

### Modified Capabilities

None.

## Impact

- Adds an Alpha Payments frontend workspace and API service beneath `scb-next`.
- Updates the SCB Next root workspace/dev orchestration, base host federation configuration and container selection, local login fixture, and local API proxy.
- Extends focused Vitest and Playwright coverage for the new public contracts.
- Uses the generated tenant descriptor under `/tmp/scb-next-tenants/alpha-payments` as onboarding input; no secret, cluster, DNS, identity, or production resource is created.
