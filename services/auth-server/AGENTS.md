# auth-server

Spring Boot authentication server (port 8082). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Authentication and authorization service supporting OUD/LDAP login, Redis-backed sessions, EMS2 entitlement lookups, FMAA OAuth2 token flows, and Kong Gateway authentication.

## Key Details

- **Framework:** Spring Boot 4.0.6 (Java 21)
- **Port:** 8082
- **Build tool:** Maven (`pom.xml`)
- **Artifact:** `ratanone-auth-server`
- **Docs:** [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)

## Commands

```bash
cd services/auth-server
mvn test
mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8082'
```

## Important

- Requires corporate Redis, OUD, EMS2, FMAA, Kong, and Vault-style secrets for realistic runs.
- Do not commit real service credentials or captured token values.
- Local development may require VPN access or explicit mock configuration.
