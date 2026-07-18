## 1. Runtime composition contract

- [ ] 1.1 Add failing pure tests for authenticated/service composition and every missing-input combination
- [ ] 1.2 Add failing tests for cloned frozen principals and service-as-repository consistency
- [ ] 1.3 Implement the pure Authorization Limits runtime composer

## 2. Federated application factory

- [ ] 2.1 Add failing application tests for factory isolation, authenticated affordances, and unchanged default export
- [ ] 2.2 Implement the Cashflow application factory with optional immutable dependencies
- [ ] 2.3 Subscribe to optional live identity and close mutation UI on downgrade or principal change

## 3. Boundaries and documentation

- [ ] 3.1 Extend boundary checks for host/domain isolation, no concrete transport, and dormant default bootstrap
- [ ] 3.2 Document the composition API, activation inputs, live downgrade behavior, and rollback path
- [ ] 3.3 Confirm platform packages, host, registry, and federation topology remain unchanged

## 4. Verification

- [ ] 4.1 Run focused/full coverage, lint, strict TypeScript, and production builds
- [ ] 4.2 Run runtime-boundary verification and all current browser rollback journeys
- [ ] 4.3 Strict-validate OpenSpec and record bundle/test evidence
