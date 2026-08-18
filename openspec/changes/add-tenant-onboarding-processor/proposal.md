## Why

SCB Next has a proven Ratan tenant topology but no repeatable process for taking a new business application from ownership intake through portal integration and production readiness. Teams need one reviewable onboarding contract, guide, checklist, and safe interactive processor so platform, tenant, security, and SRE responsibilities are explicit before any cluster mutation.

## What Changes

- Define a front-to-back tenant onboarding lifecycle covering business ownership, portal routes and remotes, backend dependencies, identity and entitlements, Kubernetes isolation, operations, verification, activation, rollback, and offboarding.
- Add a canonical tenant descriptor and environment handoff format that records public configuration and secret-provider references without collecting raw credentials.
- Add a repeatable interactive Bash wizard that validates input and generates a tenant-specific onboarding bundle, but does not apply resources to Kubernetes or modify the shared platform edge.
- Add a reusable onboarding checklist with evidence and approval gates for development, non-production, and production readiness.
- Add CLI contract tests for help output, input validation, idempotent generation, and secret-safety behavior.

## Capabilities

### New Capabilities

- `scb-next-tenant-onboarding`: Guided intake, generated tenant contracts and checklists, secret-safe handoff, and front-to-back onboarding gates for independently owned portal applications.

### Modified Capabilities

None.

## Impact

- Adds documentation under `scb-next/docs` and repeatable tooling under `scb-next/devops/tenant-onboarding`.
- Adds focused Vitest coverage under `scb-next/tests` and an npm entry point in `scb-next/package.json`.
- Establishes a future input contract for tenant-specific Kustomize overlays without creating a production overlay or changing current Ratan routing.
- Does not deploy workloads, create namespaces, set secrets, call enterprise systems, or change existing browser and API routes.
