# Database-selected EMS2 / EMS3 authorization

## Requirements and acceptance

The existing `AuthorizationService.getEntitlements(user, entities)` remains the
public BFF boundary. Each entitlement entity has exactly one database-selected
provider. A single login may combine applications on EMS2 and EMS3. The final
state supports all applications on EMS3 without calling EMS2.

The application route is read fresh for each authorization request. Existing
tile entity names are backfilled as EMS2 in a new migration. Missing, inactive,
duplicate or invalid routes fail authorization; there is no implicit EMS2
fallback. An empty requested scope is a successful empty result for templates.

The database stores application identifiers and optional subject longName
compatibility mappings, never user assignments or fetched permission snapshots.
EMS3 role, feature and action names are preserved; its numeric role/feature/action
IDs are returned. A configured `bff_entity_id` preserves the legacy entity ID.
The detailed EMS3 sample has no per-grant ID, so action.entitlementId is null on
EMS3 results rather than fabricated. Consumers needing exact old numeric grant
IDs require an explicit crosswalk before their application moves.

## Data flow

1. Existing BFF drawer query supplies requested tile entitlement entities.
2. The router reads those entities' `authorization_application` rows once.
3. EMS2 receives only its selected entities. EMS3 receives a snapshot of its
   selected application mappings. Each used provider is called once.
4. EMS3 obtains a service token and reads detailed and aggregate function grants.
   Only selected EMS3 applications are required. Unrelated identifiable app
   records are ignored; selected records must have correct IDs and matching
   roles and grants across both endpoints. Missing selected aggregate records
   are errors; explicit empty records mean no grants.
5. Valid provider results merge into the existing Entity/Subject/Action DTOs.
   Separate role rows stay separate, including identical role names in different
   applications. Any failed required call aborts the entire lookup.
6. Existing BFF tile filtering and entitlement JWT construction consume that
   result. No successful response or new token is produced on failed lookup.
   Login, Entra login, validate, relogin, extend and refresh map authorization
   failures to HTTP 503 with `AUTHORIZATION_UNAVAILABLE` and no token headers.
   Extend and refresh preserve their response shape while rechecking current
   grants before issuing new identity/refresh tokens.

## Configuration and rollout

The migration seeds EMS2 only. Switching to EMS3 requires completing its app
identity and preserving role/feature/action names. Provider choice is controlled
by database configuration changes, with versioning and audit history. No new
admin UI is part of this stage. Unknown newly added tile entities must receive
an explicit route before activation.

EMS3 endpoint and client credentials come from environment configuration under
`scb.ems3`. Secrets are required only when an EMS3 route is used. EMS3 requests use
bounded timeouts and response sizes, no automatic retries or redirects. Neither
provider uses a permission cache or fallback. Normal EMS3 transport is HTTPS; explicit loopback-only
HTTP configuration exists for local verification.

The two-endpoint completeness contract remains a proposal requiring EMS3 team
confirmation. Local verification does not establish live effective-policy,
paging or inactive-role semantics. No production application is switched by
this code change or its local tests.

## Verification boundaries

Tests exercise the production authorization service through HTTP fixtures and
database-backed route lookup, the actual Flyway migration/JPA repository on a
temporary PostgreSQL database, and public BFF login/validation/renewal APIs.
Test cases cover initial EMS2 routes, mixed providers, route switching, all EMS3,
valid no-grant responses, role revocation, unknown and inactive routes, wrong
identity, malformed/partial responses and provider failures without fallback.

The standalone `verification` Maven build compiles actual BFF sources using
public dependencies. It supplies a repeatable local check when the corporate
starter dependencies are unavailable. Corporate packaging and live service
integration must still be verified in the normal build environment.

Existing signed JWTs are not automatically revoked by a provider configuration
change. This stage must not claim immediate distributed token invalidation;
fresh authorization and renewal must use current provider results.
