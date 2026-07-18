## 1. Details action composition

- [ ] 1.1 Add failing tests for confirmed delete and every pending approve/reject pair across allowed, denied, and self-verification cases
- [ ] 1.2 Implement policy-derived details actions without changing the grid adapter

## 2. Safe asynchronous transitions

- [ ] 2.1 Add failing tests for explicit confirm/cancel semantics, typed commands, refresh reconciliation/removal, loading repeat prevention, error retention, and retry
- [ ] 2.2 Implement application-owned transition state using ConfirmationDialog and InlineAlert
- [ ] 2.3 Add boundary tests proving no raw/legacy/global mutation dependencies

## 3. Documentation and verification

- [ ] 3.1 Document operation labels, safer cancellation semantics, refresh strategy, rollback, and adapter activation blockers
- [ ] 3.2 Run focused/full coverage, lint/build, production package/pilot regression, runtime boundaries, browser rollback, and strict OpenSpec validation
- [ ] 3.3 Record bundle/test/accessibility evidence and remaining adapter/cutover criteria
