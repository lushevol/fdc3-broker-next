# backend - Rules

<- [PROJECT.md](./PROJECT.md) - [Monorepo rules](../../../docs/rules.md)

## Runtime

- Use `npm --workspace services/backend run dev` for local work.
- Keep local runs on `spring.profiles.active=local`; production-like runs need PostgreSQL and external service configuration.
- Do not add new local-only behavior outside `LocalConfig` or `application-local.yml`.

## Database

- Local H2 is transient. Never rely on local data surviving restart.
- PostgreSQL schema changes must use Flyway migrations under `src/main/resources/migration/`.
- Do not edit an applied migration. Add a new migration instead.

## Auth and Entitlements

- Never bypass `AuthorizationService.getEntitlements()` for drawer, tile, category, or import-map visibility.
- Keep maker-checker semantics for admin create/update operations: changed records start inactive until approved.
- Do not log JWT keys, passwords, entitlement payloads, or decrypted config values.

## Security Headers

- `RequestFilter` owns response security headers. Keep new endpoints behind the same filter chain.
- Do not remove `Cache-Control`, `X-Content-Type-Options`, `X-Frame-Options`, HSTS, or `Referrer-Policy` headers without an explicit security review.

## Tests

```bash
cd services/backend
mvn test
```

Add or update tests before changing controller behavior, token handling, CSV parsing, or entitlement filtering.
