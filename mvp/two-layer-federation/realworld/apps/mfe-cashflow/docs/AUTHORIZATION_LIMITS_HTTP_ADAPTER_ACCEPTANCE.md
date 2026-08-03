# Authorization Limits HTTP adapter acceptance

Status: adapter contract remains current; production activation blockers remain
open. Last reviewed 3 August 2026. See
[`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

This cohort adds a runtime-validating `AuthorizationLimitsService` adapter behind an injected request transport. It does not create a fetch client, own credentials, or instantiate mutation capability in the current production bootstrap.

## Endpoint and payload mapping

| Port operation | Request                                                                     | Body assumption                                     |
| -------------- | --------------------------------------------------------------------------- | --------------------------------------------------- |
| `list`         | `GET /api/ratan/v1/profileLimitation/`                                      | None                                                |
| `create`       | `POST /api/ratan/v1/profileLimitation/create`                               | `{ profile, currency: "USD", limitation }`          |
| `edit`         | `PUT /api/ratan/v1/profileLimitation/edit`                                  | `{ profile, currency: "USD", limitation, version }` |
| `confirm`      | `PUT /api/ratan/v1/profileLimitation/confirm/{profile}/{currency}/{status}` | `{ profile, currency, status, version }`            |
| `reject`       | `PUT /api/ratan/v1/profileLimitation/reject/{profile}/{currency}/{status}`  | `{ profile, currency, status, version }`            |
| `remove`       | `DELETE /api/ratan/v1/profileLimitation/{profile}/{currency}`               | `{ version }`                                       |

Every path segment is URI encoded. These shapes are characterized from legacy source plus the new optimistic-version port; they are assumptions until approved request/response fixtures prove backend behavior. In particular, DELETE body acceptance and mutation response shape require explicit verification.

## Runtime decoding

Successful list responses must be arrays. Every list member and mutation response must be a complete record with:

- non-empty limitation ID, profile, created/updated timestamps, and audit users;
- currency exactly `USD`;
- status in `CONFIRMED`, `ADD_PENDING`, `EDIT_PENDING`, or `DELETE_PENDING`;
- finite numeric limitation;
- non-negative integer version.

Decoded arrays and records are cloned and frozen. Unsupported currency/status, invalid numbers, missing audit fields, non-array lists, and non-object mutation responses reject as `unexpected`; the adapter never fabricates an empty list or undefined record.

## Failure mapping

| Response/failure         | Category     | Retryable |
| ------------------------ | ------------ | --------- |
| 400 or 422               | validation   | No        |
| 401                      | unauthorized | No        |
| 403                      | forbidden    | No        |
| 409                      | conflict     | No        |
| 5xx                      | unavailable  | Yes       |
| Other non-2xx            | unexpected   | No        |
| Thrown transport failure | unavailable  | Yes       |

Existing categorized errors are preserved. A response `{ message }` supplies local feedback text; otherwise the adapter creates deterministic status text.

## Transport responsibility

The injected `AuthorizationLimitsHttpTransport` owns environment base URL, approved cookie/token behavior, CSRF, timeouts, cancellation, correlation IDs, telemetry, and response acquisition. The adapter owns only domain paths/bodies, status mapping, and decoding. It imports no concrete client, browser request global, React/UI package, federation runtime, or legacy service/global.

## Verification evidence

| Gate                   | Result                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Adapter contracts      | 19 tests cover all methods/paths/bodies, encoding, immutable decoding, malformed payloads, every status category, transport errors, and no swallowed list failures |
| Adapter boundaries     | 4 policy/service/adapter/composition boundary checks passed                                                                                                        |
| Full Cashflow suite    | 71 passed; 97.15% statements, 93.87% branches, 95.40% functions, 97.90% lines                                                                                      |
| Production regressions | Data grid 6 tests and portal host 10 tests passed                                                                                                                  |
| Static/runtime         | Strict TypeScript, pilot lint/build, two-layer boundary verification, and strict OpenSpec validation passed                                                        |
| Browser rollback       | 5/5 Chrome journeys passed with all mutation actions absent                                                                                                        |
| Bundle                 | Cashflow remains 1,927.2 KB / 509.4 KB gzip because the uninstantiated adapter is outside the runtime import graph                                                 |

## Activation blockers

1. Capture and approve real request/response/error fixtures for all six operations.
2. Decide and version host/application identity plus entitlement delivery.
3. Implement the approved transport with credentials, CSRF, timeout, cancellation, telemetry, and environment URL policy.
4. Test authentication expiry, forbidden, validation, conflict, retryable outage, malformed response, and record-removal journeys against a non-production backend.
5. Inject adapter and principal only behind cohort/canary configuration with legacy route fallback and registry rollback.

The adapter is technically ready for fixture validation, not approved for production network activation.
