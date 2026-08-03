# Host identity injection and legacy authentication separation

Status: the capability boundary remains current; the anonymous-only bootstrap
description below has been superseded by the local verification login. Last
reviewed 3 August 2026. See
[`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

## Outcome

The two-layer host accepts an optional live `IdentityCapability` and delivers
the exact capability to directly loaded applications. The default application
starts with the frozen anonymous capability, presents the local login screen,
and creates an authenticated capability only after the configured
`AuthenticationAdapter` succeeds. Authorization Limits mutation activation
remains independently gated.

This is an injection seam, not an authentication implementation.

## Host API and behavior

- `App({ identity? })` retains the capability while the registry loads asynchronously.
- `PortalHost({ registry, runtime?, identity? })` includes that same capability reference in application props.
- A supplied capability owns its own snapshot and subscription lifecycle; the host does not translate permissions or copy snapshots.
- Without a supplied capability, `ANONYMOUS_IDENTITY_CAPABILITY` returns one frozen `{ state: "anonymous", contractVersion: "1.0.0" }` snapshot and a no-op unsubscribe.
- Current `bootstrap.tsx` renders `<App />`. `App` begins with the anonymous
  fallback and displays `LoginScreen`; the deterministic local adapter accepts
  `test` / `test` and publishes an authenticated snapshot for browser
  verification.

Production authentication adapters must publish through the validated platform SDK identity controller before being injected.

## Characterized legacy flow

The characterization is restricted to the previously approved legacy scopes: `apps/base`, `apps/root-config`, `apps/mfe-ratan-container`, and `apps/mfe-cashflow-blotter`.

### Login and persisted session

`apps/base/src/utils/login.ts` reads `Single-UI-Authorization` from the login response, dispatches it to the base store, and persists it under `SET_TOKEN`. It normalizes `userInfo`, derives `id/userId` from `sub`, decodes optional entitlement data, and stores the user. Entity data is also placed in base state; initial base state restores token, user, and entities from local storage.

This combines authentication, persistence, identity normalization, entitlements, and session timing in the legacy shell.

### Request credentials

`apps/base/src/hooks/service/util/success.request.handler.ts` adds `userId` to requests and normally adds the base-store token as `Single-UI-Authorization`; relogin uses a separate refresh header. The Authorization Limits legacy service calls the shared service object with same-origin `/api/ratan/v1/profileLimitation...` paths and therefore inherits those interceptors indirectly.

The legacy service swallows request failures and returns empty/undefined values. The production Authorization Limits adapter intentionally does not preserve that behavior.

### Identity and entitlements through the container

`apps/mfe-ratan-container/src/ratanutils/authenticator.ts` reads the container-imported hooks store. `getUser()` projects the base user and entity formats; `hasPermission()` supports both the legacy flat action array and entity/subject/action structures.

`apps/mfe-cashflow-blotter/src/Root/import/ratanutils/index.ts` imports those helpers from `@fm/ratan_container`. Authorization Limits then calls `getUser()` and `hasPermission()` for the three `RATAN_PROFILE_LIMITS` permissions. This is the runtime dependency that must disappear, not become a package or host UI layer.

## Production replacement ownership

| Legacy concern                 | Legacy owner/path                                        | Production owner                                                       |
| ------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Login/SSO response handling    | `apps/base`                                              | Approved host authentication adapter                                   |
| Session expiry/refresh/logout  | Base store and login utilities                           | Authentication adapter plus secure session transport                   |
| Credential storage             | `SET_TOKEN` and base state/storage                       | Approved secure credential/session mechanism; never `IdentitySnapshot` |
| Request authorization header   | Base Axios interceptor                                   | Application transport configured by the approved session mechanism     |
| User identity normalization    | Base login utility and container `getUser()`             | Host authentication adapter → `IdentitySnapshot`                       |
| Entitlement normalization      | Base entity/user formats and container `hasPermission()` | Authentication/entitlement adapter emits opaque permission identifiers |
| Domain maker/checker decisions | Container helper plus legacy Cashflow utilities          | Cashflow `AuthorizationLimitsPolicy`                                   |
| Domain service composition     | Container/shared globals                                 | Cashflow application factory and runtime composer                      |
| Runtime application loading    | Single-SPA/container chain                               | Portal host directly loads the federated application                   |

## Explicit prohibitions

The new host identity path contains no references to `SET_TOKEN`, local/session storage, `Single-UI-Authorization`, access/refresh tokens, `getUser`, `hasPermission`, base hooks/store, `mfe-ratan-container`, or Authorization Limits domain types.

Identity remains a minimal observable authorization context, not a credential bus. The design system remains unrelated to identity and permissions.

## Activation sequence

The local adapter is verification infrastructure, not production
authentication. Production activation still requires:

1. Select the production SSO/login source and secure session owner.
2. Normalize authenticated `userId` and approved entitlement identifiers through `createIdentityController`.
3. Inject its capability into `<App identity={...} />` while Cashflow still has no service.
4. Prove login, refresh, expiry, logout, multi-tab/OpenFin behavior, and malformed-session rejection.
5. Implement the application transport using approved base URL, authorization/CSRF, timeout, cancellation, tracing, and telemetry policies.
6. Inject the service through `createCashflowApplication` behind a cohort flag.
7. Run authenticated mutation parity, server-authorization, rollback, and legacy-fallback journeys before cutover.

## Unresolved decisions

- Replacement SSO/login endpoint and protocol.
- Secure token/cookie ownership and whether the browser application ever reads credentials.
- Refresh, expiry, logout cancellation, cross-tab, and OpenFin synchronization semantics.
- Entity/entitlement normalization rules and permission freshness.
- CSRF, timeout, retry, cancellation, correlation, and telemetry policies.
- Cohort flag, environment configuration source, and legacy fallback owner.

## Acceptance evidence

| Gate                 | Result                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Host tests           | Latest focused run: 46 tests passed                                                                               |
| Identity fallback    | 100% statements, branches, functions, and lines                                                                   |
| Static checks        | Host ESLint and strict TypeScript passed                                                                          |
| Production build     | WebKit, Portal Host, Cashflow, Identity/Profile, and FDC3 Admin passed in dependency order                        |
| Isolation diff       | Platform packages, Cashflow, registry, design/grid packages, and federation configuration unchanged in this slice |
| Runtime boundaries   | Exactly host and federated-application layers; only React and ReactDOM singleton shares                           |
| OpenSpec             | `inject-host-identity-source` passed strict validation                                                            |
| Browser verification | Live Chrome passed login, identity delivery, host/profile avatars, remote loading, dialogs, and tab lifecycle     |

Historical bundle measurements are retained in version control but are not
repeated here because current builds include the WebKit migration and additional
verification applications. Production authentication and mutation activation
remain unaccepted until the activation sequence above is completed.
