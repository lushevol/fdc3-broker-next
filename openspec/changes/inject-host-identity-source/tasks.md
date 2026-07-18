## 1. Anonymous fallback contract

- [x] 1.1 Add failing tests for stable frozen anonymous snapshot/capability and no-op subscription
- [x] 1.2 Implement the isolated host anonymous identity module

## 2. Host injection and propagation

- [x] 2.1 Add failing PortalHost tests for exact capability delivery and live authenticated-to-anonymous updates
- [x] 2.2 Add failing App tests proving the capability is threaded across asynchronous registry loading
- [x] 2.3 Implement optional App/PortalHost injection with anonymous default

## 3. Legacy separation and documentation

- [x] 3.1 Add boundary checks excluding legacy globals, storage, credentials, domain roles, and container imports
- [ ] 3.2 Document legacy identity/entitlement/header behavior and replacement ownership
- [ ] 3.3 Confirm platform contracts, SDK, registry, Cashflow, and federation topology remain unchanged

## 4. Verification

- [ ] 4.1 Run host/full pilot coverage, lint, strict TypeScript, and production builds
- [ ] 4.2 Run two-layer boundary verification and browser rollback journeys
- [ ] 4.3 Strict-validate OpenSpec and record test/bundle evidence
