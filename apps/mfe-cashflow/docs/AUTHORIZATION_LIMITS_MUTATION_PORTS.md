# Authorization Limits mutation ports

This prerequisite defines production application boundaries for the later mutation UI cohort. It does not expose mutation controls, call a backend, or change the read-only fixture route.

## Permission compatibility map

| Application permission | Policy meaning |
| --- | --- |
| `RATAN_PROFILE_LIMITS:ACCESS_FMO_POST_TRADE_PORTAL` | View Authorization Limits |
| `RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Initiate` | Maker compatibility role; create and confirmed edit/delete |
| `RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Verify` | Checker compatibility role; create, confirmed edit/delete, and pending confirm/reject when another user submitted the update |

Verify permission takes precedence when both initiate and verify are present, matching the characterized legacy implementation. A principal with access only is a Visitor: it can view but not mutate. Access and mutation decisions remain separate so the eventual route guard and action composition can explain the correct denial.

## Record action matrix

| Status | Maker | Checker, other updater | Checker, same updater | Visitor |
| --- | --- | --- | --- | --- |
| `CONFIRMED` | Edit, delete | Edit, delete | Edit, delete | None |
| `ADD_PENDING` | None | Approve add, reject add | None | None |
| `EDIT_PENDING` | None | Approve edit, reject edit | None | None |
| `DELETE_PENDING` | None | Approve delete, reject delete | None | None |

Checker edit/delete on confirmed records is intentionally preserved from legacy behavior. Tightening it requires an explicit security/product decision and backend agreement. Self-verification compares the injected `userId` with `updatedBy` and returns `self-verification`; presentation copy is application composition's responsibility.

## Injection boundary

Application bootstrap will eventually adapt authenticated identity and entitlements into:

```ts
interface AuthorizationLimitsPrincipal {
  readonly userId: string;
  readonly permissions: readonly string[];
}
```

The policy does not read globals, cookies, platform internals, or legacy `getUser`/`hasPermission`. The host should deliver identity only through an agreed, versioned capability; whether that extends `@fm/platform-contracts` or uses an application-specific authentication adapter remains unresolved and must be decided before mutation UI activation.

## Service boundary

`AuthorizationLimitsService` extends the existing source-compatible list repository with domain operations:

- `create`: profile, fixed USD currency, and numeric limitation.
- `edit`: record identity, new limitation, and expected version.
- `confirm` / `reject`: identity, pending status, and expected version.
- `remove`: identity and expected version.

A concrete adapter must validate responses, preserve optimistic concurrency, attach approved credentials, encode legacy-compatible endpoints, and map failures to `unauthorized`, `forbidden`, `validation`, `conflict`, `unavailable`, or `unexpected`. It must reject errors; it must never reproduce the legacy behavior that catches failures and returns `undefined` or an empty success value.

The transport client (fetch, generated client, or approved platform service capability), authentication mechanism, CSRF policy, backend error schema, timeout/retry policy, and delete response semantics remain unresolved. Those decisions belong in the adapter cohort, not the design system or policy module.

## Mutation UI entry criteria

Before create/edit/status UI is enabled:

1. Approve the identity/entitlement capability and concrete service transport.
2. Verify backend request/response fixtures for every operation and version conflict.
3. Inject the principal and service at the Cashflow application boundary; do not use module globals.
4. Compose `@fm/ratan-design@1.1.0` dialogs, NumberField, ConfirmationDialog, and InlineAlert with application-owned request state.
5. Test loading repeat prevention, local error feedback, refresh/reconciliation, self-verification, and every action matrix row.
6. Retain a cohort flag and legacy route fallback until browser parity and production delivery gates pass.

## Acceptance evidence

| Gate | Result |
| --- | --- |
| New port contracts | 21 policy, service, error, and forbidden-boundary tests passed |
| Complete Cashflow suite | 33 passed; 96.45% statements, 90.78% branches, 94.33% functions, 97.41% lines |
| Existing consumers | Data grid 6 tests and portal host 10 tests passed |
| Static checks | Cashflow strict TypeScript/build and all production-pilot lint passed |
| Runtime architecture | Two layers retained; only React and ReactDOM remain shared singletons |
| Production artifacts | Cashflow remains 1,911.1 KB / 505.0 KB gzip; host remains 529.4 KB / 158.3 KB gzip because the new ports are not imported by runtime composition |
| OpenSpec | `define-authorization-limit-mutation-ports` passed strict validation |

The cohort does not add a principal or service prop to `AuthorizationLimits`, expose an action control, or change fixture behavior. Mutation UI remains blocked on the six entry criteria above.
