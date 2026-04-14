# backend — Rules

← [PROJECT.md](./PROJECT.md) · [Monorepo rules](../../docs/rules.md)

## Profiles

- Always use `-Dspring.profiles.active=local` for local development
- Never run without a profile in production — production requires PostgreSQL and all external service URLs

## Database

- Local profile uses H2 with `create-drop` — schema is rebuilt on every restart
- All entity classes define the JPA schema — Flyway migrations only run on PostgreSQL
- Never rely on data persisted in local H2 across restarts

## Authentication

- `LocalConfig` mocks all auth — accepts any username/password
- Never use `LocalConfig` beans in production (they are `@Profile("local")`)
- Never commit real LDAP, EMS2, or MFA credentials

## JWT Keys

- Same RSA512 keys exist in local and production configs for compatibility
- Rotate keys in production following your organization's key rotation policy
- Never expose JWT secret keys in logs or error responses

## Admin Operations

- Tile, category, and import map create/update operations follow maker-checker pattern
- New/modified records set `isActive=false` until a checker approves
- Do not bypass the maker-checker approval workflow

## Entitlements

- All tile, category, and import map data is scoped by `ems2Role`
- Never bypass role filtering — always use `AuthorizationService.getEntitlements()`
- EMS2 calls are cached — clear the cache if role data changes

## Security Headers

- `RequestFilter` sets `Cache-Control`, `X-XSS-Protection`, `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `Referrer-Policy`
- Never remove these headers or the filter registration

## Tests

- Run via `mvn test` from `services/backend`
- Only 2 test files exist: `LocalAuthFlowIntegrationTest`, `JwtTokenUtilTest`
- Add tests for new endpoints before marking work complete
- Local tests rely on `LocalConfig` — no external services needed
