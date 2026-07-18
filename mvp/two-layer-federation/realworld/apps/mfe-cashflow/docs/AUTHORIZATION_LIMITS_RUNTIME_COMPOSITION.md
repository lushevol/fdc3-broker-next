# Authorization Limits runtime composition acceptance

## Outcome

Cashflow now owns an explicit bootstrap seam for combining platform identity with an optional Authorization Limits service. This completes the application-side architecture needed for later authenticated activation without adding domain services to the host, platform contracts, SDK, registry, or federation props.

The shipped `Application` export is still constructed with no service and remains read-only.

## Composition API

`createCashflowApplication({ authorizationLimitsService })` returns a React component accepting only `ApplicationProps`. The optional service is retained in an immutable factory closure, not a mutable module global. `composeAuthorizationLimitsRuntime(identity, service)` translates the current identity snapshot to Cashflow-owned runtime values.

| Identity | Service | Read repository | Mutation capability |
| --- | --- | --- | --- |
| Missing | Missing | Existing read-only fixture repository | Absent |
| Anonymous | Missing | Existing read-only fixture repository | Absent |
| Authenticated | Missing | Existing read-only fixture repository | Absent |
| Missing | Present | Injected service | Absent |
| Anonymous | Present | Injected service | Absent |
| Authenticated | Present | Injected service | Present; policy still determines each affordance |

When mutation capability is present, the same injected service owns list and mutation operations. This avoids displaying one data source while mutating another.

## Identity translation and downgrade

The application subscribes through `PlatformClient` using external-store semantics. Authenticated `userId` and permissions are cloned into a frozen `AuthorizationLimitsPrincipal`; the domain policy never receives the platform snapshot directly.

If identity changes or becomes anonymous, runtime composition fails closed. Authorization Limits immediately removes mutation actions and closes an open editor or transition confirmation without remounting the application. Requests already accepted by a future transport still require transport cancellation/session-expiry behavior and authoritative server authorization.

## Ownership boundary

- Portal host: generic versioned identity delivery only.
- Platform contracts/SDK: identity state and observation only.
- Cashflow factory: optional domain dependency ownership and identity translation.
- Authorization Limits policy: application permission taxonomy and maker/checker decisions.
- Authorization Limits service/adapter: domain commands, endpoint mapping, response validation, and categorized failures.
- Future concrete transport: environment base URL, credentials/cookies, CSRF, timeout, cancellation, tracing, and telemetry.
- Backend: authoritative authorization and concurrency enforcement.

The factory/composer imports no concrete transport, browser request API, environment variable, federation runtime, or legacy UI/runtime dependency.

## Default and rollback behavior

`Application` is exactly `createCashflowApplication()` with no arguments. The standalone preview also uses the default export and supplies anonymous identity. Rollback therefore requires no host or registry change: omit the service from the application factory or select the default factory result.

Production activation remains prohibited until an approved authentication adapter, permission mapping, environment endpoint, credential/CSRF policy, timeout/cancellation behavior, observability, cohort flag, and authenticated browser fixtures exist.

## Acceptance evidence

| Gate | Result |
| --- | --- |
| Cashflow tests | 83 tests passed; 97.38% statements, 94.63% branches, 95.74% functions, 98.08% lines |
| Composer coverage | 100% statements, branches, functions, and lines |
| Static checks | ESLint and strict TypeScript passed |
| Production build | All foundation packages, data grid, Cashflow, and portal host built in dependency order |
| Isolation audit | No changes to host, platform packages, registry, design/grid packages, or federation configuration in this slice |
| Runtime boundaries | Exactly host and federated-application layers; only React and ReactDOM singleton shares |
| Browser rollback | 5/5 Chrome journeys passed with Create, Edit, Delete, Approve Add, and Reject Add absent |
| OpenSpec | `compose-cashflow-runtime-dependencies` passed strict validation |

Cashflow builds at 1930.0 KB / 510.2 KB gzip, an increase of approximately 1.2 KB / 0.4 KB gzip from the preceding identity-capability baseline. Portal host remains 530.3 KB / 158.6 KB gzip.
