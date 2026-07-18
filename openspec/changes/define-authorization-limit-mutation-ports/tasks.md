## 1. Entitlement policy

- [ ] 1.1 Add failing tests for permission precedence, access/create decisions, confirmed actions, every pending action pair, self-verification, and denial reasons
- [ ] 1.2 Implement the pure application-owned principal policy with stable action and reason types

## 2. Mutation service port

- [ ] 2.1 Add compile/runtime contract tests for create/edit/confirm/reject/remove command shapes and categorized errors
- [ ] 2.2 Implement readonly domain commands, service interface, and mutation error without transport or UI dependencies
- [ ] 2.3 Refactor the existing list repository type to remain source-compatible with the read-only cohort

## 3. Boundaries and guidance

- [ ] 3.1 Add source/dependency scans blocking legacy globals, UI/grid, transport, and federation imports from policy/service modules
- [ ] 3.2 Document permission mapping, deliberately preserved legacy behavior, injection boundary, adapter responsibilities, and unresolved identity/transport decisions

## 4. Verification

- [ ] 4.1 Run focused tests, full Cashflow coverage/lint/build, production-pilot tests/build, boundary verification, and strict OpenSpec validation
- [ ] 4.2 Record acceptance evidence and mutation-UI entry criteria without enabling mutation controls
