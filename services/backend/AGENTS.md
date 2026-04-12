# backend

Spring Boot backend service (port 8088). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Main backend API for the MFE platform. Provides REST endpoints for data grids, workflows, and business logic.

## Key Details

- **Framework:** Spring Boot (Java)
- **Port:** 8088
- **Database:** In-memory H2 for local dev (`MODE=PostgreSQL`)
- **Build tool:** Maven (`pom.xml`)
- **Local profile:** `spring.profiles.active=local`

## Commands

```bash
npm run dev    # Start with embedded H2, port 8088, local profile
# Equivalent to: mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8088 -Dspring.profiles.active=local'
```

## Important

- The `dev` script passes a long inline environment string for H2 configuration, LDAP URL, etc. Edit directly in `package.json` if you need to change any of these.
- No test/lint npm scripts – use Maven directly for Java tasks:
  ```bash
  cd services/backend && mvn test
  ```
- Source code in `src/main/java/`
