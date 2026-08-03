# Authorization Limits transition cohort acceptance

Status: behavior retained and migrated to portalled WebKit dialogs. Last
reviewed 3 August 2026. See
[`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

This cohort completes application composition for confirmed delete and every pending approve/reject pair. Like create/edit, it is available only through `AuthorizationLimitsMutationCapability`; the current production bootstrap omits that capability and remains read-only.

## Operation presentation

| Record status    | Policy action  | Trigger                    | Confirmation    |
| ---------------- | -------------- | -------------------------- | --------------- |
| `CONFIRMED`      | delete         | Delete Authorization Limit | Delete          |
| `ADD_PENDING`    | approve-add    | Approve Add                | Create          |
| `ADD_PENDING`    | reject-add     | Reject Add                 | Reject Add      |
| `EDIT_PENDING`   | approve-edit   | Approve Edit               | Approve         |
| `EDIT_PENDING`   | reject-edit    | Reject Edit                | Reject          |
| `DELETE_PENDING` | approve-delete | Approve Delete             | Delete          |
| `DELETE_PENDING` | reject-delete  | Reject Delete              | Reject Deletion |

Confirmed edit remains beside delete. Pending details expose only their status-specific pair to a Checker who did not submit the latest update. Maker, Visitor, incompatible status, and self-verification decisions remain absent according to the verified policy.

## Safer confirmation semantics

Legacy popovers overloaded cancellation to execute rejection or deletion.
Production composition uses separate domain triggers. Inside every
`AuthorizationLimitTransitionDialog`, Cancel means dismissal only and never
invokes confirm, reject, or remove. The WebKit dialog is portalled to
`document.body`; danger tone is used for destructive delete/reject operations,
and loading removes close/Escape/backdrop dismissal and disables both buttons.

## Service and reconciliation behavior

- Confirmed delete invokes `remove` with profile, USD, and expected version.
- Pending approval invokes `confirm` with identity, exact pending status, and expected version.
- Pending rejection invokes `reject` with the same typed transition command.
- After the operation succeeds, `service.list()` replaces local rows. This handles backend-dependent add rejection and approved deletion without relying on a success response record.
- If the refreshed list omits the detail record, existing not-found recovery renders instead of stale data.
- Operation or refresh failures keep the dialog open, show local error feedback, and allow retry.

## Verification evidence

| Gate                    | Result                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Transition behavior     | 11 new tests cover all seven operations, explicit Cancel safety, removal reconciliation, error retry, and loading repeat prevention |
| Full Cashflow suite     | 51 passed; 96.83% statements, 92.61% branches, 94.28% functions, 97.89% lines                                                       |
| Production regressions  | Data grid 6 tests and portal host 10 tests passed                                                                                   |
| Static and architecture | Strict TypeScript, pilot lint/build, bounded dependency scan, and two-layer verifier passed                                         |
| Browser rollback        | 5/5 Chrome journeys passed; Create, Edit, Delete, Approve Add, and Reject Add are explicitly absent without capability injection    |
| OpenSpec                | `compose-authorization-limit-transitions` passed strict validation                                                                  |

## Bundle evidence

| Cashflow remote    | Before transitions | After transitions |   Delta |
| ------------------ | -----------------: | ----------------: | ------: |
| Uncompressed total |         1,923.4 KB |        1,927.2 KB | +3.8 KB |
| Gzip total         |           508.5 KB |          509.4 KB | +0.9 KB |

The complete opt-in mutation composition is 16.1 KB / 4.4 KB gzip above the accepted post-interaction read-only build. No design or federation runtime is shared to reduce this size.

## Remaining activation and cutover criteria

1. Version and approve authenticated identity/entitlement delivery.
2. Validate the dormant [HTTP adapter](AUTHORIZATION_LIMITS_HTTP_ADAPTER_ACCEPTANCE.md) against approved backend fixtures, then supply credentials, CSRF, timeout, and telemetry through an approved transport.
3. Prove real backend fixtures for all six service operations, including conflict and record-removal semantics.
4. Add authenticated non-production browser journeys for every operation and self-verification denial.
5. Activate behind cohort/canary configuration with telemetry, SLOs, legacy-route fallback, and registry rollback.
6. Remove legacy UI/runtime dependencies only after production parity and rollback evidence pass.

Until then, this is verified dormant composition—not authorization to enable production mutations.
