# auth-server

Spring Boot authentication server (port 8082). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Authentication and authorization service supporting LDAP/OUD, JWT, FMAA OAuth2, and Kong Gateway auth. Manages sessions via Redis.

## Key Details

- **Framework:** Spring Boot 3.3.7 (Java 17)
- **Port:** 8082
- **Build tool:** Maven (`pom.xml`)
- **No package.json** – not part of the npm workspace; managed separately

## Architecture

See `ARCHITECTURE.md` in this directory for full details.

**Auth methods supported:**

1. OUD/LDAP (username/password)
2. JWT (`Single-UI-Authorization` header)
3. FMAA OAuth2 (`FMAA-Token` header)
4. Kong Gateway (`X-Token` / `/v3/kong/token`)
5. Session Token (Redis lookup)

**External dependencies:** Redis cluster, LDAP/OUD, EMS2 (entitlements), FMAA, Kong Gateway, HashiCorp Vault

## Important

- This service requires many external services (Redis, LDAP, etc.) that are not available in local dev
- No npm scripts – run directly with Maven:
  ```bash
  cd services/auth-server
  mvn spring-boot:run -Dserver.port=8082
  ```
- Local dev may require mock configurations or VPN access to corporate services
