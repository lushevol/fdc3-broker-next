## Local Verification Evidence

Verified on 2026-08-19 against `http://127.0.0.1:8001` with the base host, existing federation dependencies, Alpha Payments remote, and Alpha Payments API running as independent processes.

### Passed

- The SCB Next platform suite passed: 6 files and 60 tests.
- The tenant API passed 3 contract tests with 100% statement, branch, function, and line coverage; typecheck and build passed.
- The tenant remote passed 5 behavior tests with 98.3% line and 94.73% branch coverage; typecheck and production build passed.
- The focused base-host composition assertions passed: 9 tests.
- Strict OpenSpec validation passed for `onboard-alpha-payments-tenant`.
- The Playwright portal journey passed through login, New Tile discovery, federated rendering, same-origin API loading, filtering, acknowledgement, workspace creation, and tenant-tab removal.
- Interactive browser inspection confirmed the same journey on the live portal. Responsive checks at 1440x900 and 390x844 found the tenant root's `scrollWidth` equal to its `clientWidth` and no tenant-origin browser errors after load.

### Existing Platform Baseline

- Static dependency isolation reports that the base currently resolves MUI 5 while the verifier expects MUI 9.
- Base-host typecheck reports existing MUI API/type mismatches outside the tenant integration. The base production build still passes.
- The portal shell emits existing startup console warnings and has header overlap at a 390px viewport. The Alpha Payments content remains contained and its data table provides local horizontal scrolling.

These findings were not changed as part of tenant onboarding and do not convert local proof into a production-readiness claim.

### Production Gates

The generated checklist at `/tmp/scb-next-tenants/alpha-payments/onboarding-checklist.md` remains fully incomplete. No approval is claimed for Kubernetes isolation, production routing, identity and authorization, secrets, data segregation, immutable images, network policy, observability, resilience, persistence, support ownership, security, SRE readiness, or business go-live. Production activation requires a separate approved change and direct verification of tenant resources before platform delegation.
