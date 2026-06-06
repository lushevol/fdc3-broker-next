# backend

Spring Boot backend service (port 8088). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Single UI BFF for authentication, JWT lifecycle, EMS2 entitlement filtering, MFE admin config, config upload, and analytics forwarding.

## Key Details

- **Framework:** Spring Boot 4.0.6 (Java 21)
- **Port:** 8088
- **Database:** H2 in PostgreSQL mode for local dev, PostgreSQL for deployed profiles
- **Build tool:** Maven (`pom.xml`)
- **Local profile:** `spring.profiles.active=local`
- **Docs:** [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)

## Commands

```bash
npm run dev    # Start with .env.profile.${ACTIVE_ENV:-dev}, embedded H2, port 8088
```

Maven verification:

```bash
cd services/backend
mvn test
```

## Important

- Environment values come from root `.env.profile.*` files through `env-cmd`.
- Local profile mocks external dependencies through `LocalConfig`.
- Source code lives in `src/main/java/`.
