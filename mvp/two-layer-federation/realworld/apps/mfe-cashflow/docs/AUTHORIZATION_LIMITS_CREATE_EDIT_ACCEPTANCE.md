# Authorization Limits create/edit cohort acceptance

Status: behavior retained and migrated to Ratan WebKit. Last reviewed 3 August 2026. Current program status is in
[`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

This cohort composes create/edit behavior against the production design system and application mutation ports. It is deliberately opt-in: the current production bootstrap does not supply `AuthorizationLimitsMutationCapability`, so deployed list/details behavior remains read-only.

## Bootstrap and rollback contract

```ts
interface AuthorizationLimitsMutationCapability {
  readonly principal: AuthorizationLimitsPrincipal;
  readonly service: AuthorizationLimitsService;
}
```

Principal and service are one coherent capability; partial configuration is not possible. An approved authenticated application bootstrap may inject it later. Omitting it is the rollback: create/edit triggers, dialogs, request state, and mutation feedback are not rendered, while the previously accepted list/details route remains intact.

## Accepted opt-in behavior

- Maker or Checker can open create from the list; Visitor cannot.
- Maker or Checker can open edit from confirmed details; pending records cannot.
- Create owns controlled profile, fixed/disabled USD, and numeric limitation.
- Edit locks profile and currency and sends limitation plus expected version.
- Profile is required; limitation is required and bounded from 0 through 99,999,999,999.
- Successful create appends the returned record; successful edit replaces it by `limitationId`.
- Loading disables submit, cancel, close, Escape, and backdrop dismissal, preventing repeat writes.
- Categorized failures remain local, keep the form open, and permit retry after loading ends.
- Delete and all pending approve/reject controls remain absent.

The current composition uses `ScDialog`, `ScTextInput`, `ScButton`,
`ScIconButton`, and `ScAlert` through the local
`@scdevkit/webkit/react` boundary. Dialogs are portalled to
`document.body` so overlays are not clipped by the remote mount. Form state,
validation, service invocation, reconciliation, and feedback decisions stay
inside Cashflow.

## Verification evidence

| Gate                             | Result                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Focused create/edit tests        | 6 passed: opt-in/Visitor visibility, create/edit, bounds, pending deferral, error retry, loading safety      |
| Full Cashflow suite              | 40 passed; 96.84% statements, 93.89% branches, 93.75% functions, 97.51% lines                                |
| Design and package compatibility | Design 1.1.0 45-test release and packed-consumer evidence retained; production foundation/grid builds passed |
| Production pilot regression      | Grid 6 tests and portal host 10 tests passed                                                                 |
| Static checks                    | Strict TypeScript, Cashflow/pilot lint, production application and host builds passed                        |
| Runtime boundaries               | Two layers retained; only React and ReactDOM shared as federation singletons                                 |
| Browser regression               | 5/5 Chrome journeys passed with explicit absence of Create and Edit in the current bootstrap                 |
| OpenSpec                         | `compose-authorization-limit-create-edit` passed strict validation                                           |

## Bundle evidence

| Cashflow remote    | Before composition | After composition |    Delta |
| ------------------ | -----------------: | ----------------: | -------: |
| Uncompressed total |         1,911.1 KB |        1,923.4 KB | +12.3 KB |
| Gzip total         |           505.0 KB |          508.5 KB |  +3.5 KB |

The code is bundled even while runtime injection is absent. The delta is accepted for the bounded cohort; a future route-level split may defer editor code, but must not create a new federation layer or runtime UI container.

## Remaining activation blockers

1. Approve a versioned authenticated identity/entitlement delivery contract.
2. Implement and contract-test the concrete production service adapter, credentials, CSRF, decoding, timeout, and error mapping.
3. Prove backend fixtures for create/edit version conflicts and audit fields.
4. Inject the capability behind a cohort/canary flag with the legacy route as rollback.
5. Run browser create/edit parity against an approved non-production backend.

Delete and add/edit/delete pending confirm/reject are now behavior-tested in the [transition cohort](AUTHORIZATION_LIMITS_TRANSITIONS_ACCEPTANCE.md), still behind the same omitted-by-default capability. Legacy Authorization Limits remains authoritative until the adapter, activation blockers, and production-delivery program are complete.
