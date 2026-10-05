# EMS2 to EMS3 function entitlement POC

## Status

Local POC passed on 2026-10-03. Live EMS3 integration is still pending.

The actual BFF has since gained database routing, EMS3 HTTP integration and strict
renewal checks. See the [BFF integration explanation](../../docs/ems3-bff-integration.md)
and [verification build](../../verification/README.md). The standalone POC below
remains a separate, smaller demonstration with its original in-memory fixtures.

The POC runs both providers behind one transitional router. Its route table sends
`X_RATANONE` to the EMS2 fixture and `FMO PORTAL ADMIN` to the EMS3 HTTP fixture.
The router calls each selected provider once, merges their results into the
existing `AuthorizationService`/`Ems2Result` contract, and applies the current
tile-matching rules in an isolated session. It uses five synthetic accounts and
selected permissions from the supplied production dumps. It does not change
production login, persist the route table in the BFF database, register
applications in EMS3, or evaluate data entitlements.

## Run

Requires Java 17 and Maven. From this directory:

```sh
mvn clean verify
java -cp 'target/classes:target/dependency/*' com.scb.sso.singleuibff.poc.Demo
```

On this Mac, select the installed Java 17 before running those commands:

```sh
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
```

The demo starts a loopback EMS3 fixture service, checks the accounts below through
the mixed EMS2/EMS3 router, prints seven JSON results, and closes the service. It
requires no credentials or running BFF. Maven downloads public build dependencies
on the first run. Fixtures can be regenerated using the command in
[fixtures/README.md](fixtures/README.md).

## Observed results

| Account | Visible production tile IDs | Synthetic tile IDs |
| --- | --- | --- |
| `poc-ratan` | 54, 104, 105 | 9001, 9002, 9004 |
| `poc-admin` | 1, 2, 3, 4 | 9001 |
| `poc-both` | 1, 2, 3, 4, 54, 104, 105 | 9001, 9002, 9004 |
| `poc-two-roles` | 18, 54, 104, 105 | 9001, 9002, 9004 |
| `poc-none` | None | 9001 |

Synthetic tile 9001 is a template, 9002 has a blank subject, 9003 has the wrong
entity and is always denied here, and 9004 checks case-insensitive longName
matching. Empty drawers are removed. Tiles are not duplicated when roles overlap.

The HTTP tests preserve all 21 COO grants and five KR grants in their respective
roles. Removing only the COO role leaves tile 18 and synthetic tiles 9001/9002.
Removing every role leaves only template 9001. A validated role with explicitly
empty function grants still permits its blank-subject tile, matching the current
BFF rule.

The suite contains 244 passing tests, covering:

- All five accounts, role-specific subjects/actions, drawer filtering and claim encoding.
- HTTP 204, 206, 301, 401, 403, 404, 429, 500 and 503 on every required endpoint.
- Missing, null, wrongly typed or unknown required fields; malformed JSON; duplicate JSON keys, roles and grants.
- Incorrect application IDs/names, nested application identity and echoed user identity.
- Partial multi-application results, connection failure, interruption, header timeout and a stalled body after successful headers.
- Responses over the one MiB byte limit, valid empty grants, revocation, and success followed by failure.
- Per-entity EMS2/EMS3 routing, mixed-result merging, multiple roles for one entity, unknown routes, malformed provider results, and no EMS2 fallback after an EMS3 failure.

JaCoCo enforces at least 90% line and branch coverage for the adapter and session.
The fixture server and CLI demo are excluded from that coverage gate; the tests
and finite demo exercise them through HTTP. The unchanged BFF DTOs are also
outside the gate. Generated test and coverage reports live under `target/`.

## Proposed local API contract

1. Acquire a fresh synthetic client-credentials token from `POST /token`.
2. Read role-specific grants from `GET /entitlement/user/{user}`.
3. Read aggregate role names and function grants from `GET /entitlement/user-response/{user}`.
4. Validate both responses fully before constructing any successful session result.

The two grant response shapes follow the supplied examples. Using both together
as a complete authorization contract is a proposal, not a confirmed EMS3 guarantee.
The detailed response does not echo the user. Both requests use the selected
test account, and the aggregate response must echo that account.

Every configured catalog application must have exactly one aggregate record,
including a record with empty lists when the user has no grants. This requirement
applies even if the caller requests only one of the two entities. Aggregate role
names must match the detailed roles; aggregate feature/action pairs must equal
their union. Detailed grants must retain their own role association. No duplicate
roles or duplicate pairs within one role or aggregate record are accepted.

The local catalog maps application names, roles, subject longNames and IDs. IDs
are synthetic and must match the fixture contract exactly. Unmapped applications,
roles and function pairs reject the lookup. A live adapter needs agreed production
registrations and mappings, and a defined way to scope or handle unrelated apps.
Agreement between the two endpoints cannot reveal a role omitted by both; live
completeness, effective-role and active-status behavior needs confirmation.

Only HTTP 200 with valid required fields is accepted. Each call has a two-second
deadline including its response body; its buffered body is capped at one MiB.
There are no automatic retries, permission caches, redirects or EMS2 fallback.
Token data is synthetic; the adapter accepts loopback HTTP base URLs only.

## Failure and token behavior

`PocSession.authorize` clears its current result before lookup. Any failed token,
grant, provider, or validation step throws an authorization-unavailable error. It
returns no successful result, drawers or token, including template tiles, and
leaves the number of issued tokens unchanged. Selecting EMS3 and getting an EMS3
failure never retries that entity through EMS2. A web integration should map this
failure to an unavailable response and clear the client's previous tiles.

Successful results contain a short-lived token signed with a random local key,
issuer `ems3-function-poc`, and the BFF-style string claim:
`entityName:roleName -> subject.name -> action names`. This checks serialization
and role separation. It is not a production login or a production-valid token.
Clearing this local session does not revoke previously issued production JWTs.

## What is still needed for a live POC

1. A reachable EMS3 test environment and approved service access, with credentials supplied through the normal secret mechanism.
2. Real test accounts with known roles and function grants, using the FlowZero pilot or a small newly provisioned EMS3 application.
3. EMS3 confirmation of which API gives complete effective function permissions, how no access is represented, and whether paging, inactive roles or unrelated apps affect these responses.

The production user-role source and full application coverage can wait until
rollout. Before production switching, verify the integrated session/token renewal
behavior, decide the required invalidation behavior, test real BFF/frontend consumers, and validate application mappings
one application at a time. See the [migration plan](../../docs/ems3-migration-plan.md).
