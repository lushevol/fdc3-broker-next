## 1. Onboarding Contract

- [x] 1.1 Generate the Alpha Payments onboarding bundle and review the descriptor and checklist.
- [x] 1.2 Define the tenant application proposal, technical design, requirements, and agreed public test seams.

## 2. Tenant API

- [x] 2.1 Add a failing HTTP contract test for health and payment case retrieval.
- [x] 2.2 Implement the minimum independently runnable tenant API for health and case retrieval.
- [x] 2.3 Add failing contract tests for acknowledgement, validation, errors, correlation IDs, and structured completion logs.
- [x] 2.4 Implement acknowledgement validation, mutation, errors, correlation handling, and structured request logging.

## 3. Tenant Remote

- [x] 3.1 Add a failing React behavior test for loading and rendering the payment investigation queue.
- [x] 3.2 Implement the minimum federated React application, typed API client, stable layout, and theme-aware styles.
- [x] 3.3 Add failing behavior tests for filtering, acknowledgement, empty, error, and retry states.
- [x] 3.4 Implement filtering, acknowledgement, summaries, empty/error states, and accessible interactions.

## 4. Portal Composition

- [x] 4.1 Add a failing base-host composition test for the `@fm/alpha_payments` container.
- [x] 4.2 Register the remote, container mapping, federation types, and test alias in the base host.
- [x] 4.3 Add the authorized Alpha Payments drawer fixture and same-origin API proxy behavior.
- [x] 4.4 Add the tenant UI and API to SCB Next workspace, build, typecheck, and development orchestration.

## 5. End-To-End Verification

- [x] 5.1 Add a failing Playwright journey for login, discovery, remote rendering, filtering, acknowledgement, and workspace removal.
- [x] 5.2 Run focused unit/contract coverage, typecheck, builds, existing portal regressions, static verification, and strict OpenSpec validation.
- [x] 5.3 Start the full stack and verify the public portal journey in the in-app browser at `http://127.0.0.1:8001` across desktop and mobile layouts.
- [x] 5.4 Record local evidence and explicitly leave production-only onboarding approvals incomplete.

## 6. Change Control

- [x] 6.1 Run GitNexus change detection against `main`, review the affected symbols and flows, and commit only this completed onboarding stage.
