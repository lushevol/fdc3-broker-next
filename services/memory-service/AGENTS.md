# memory-service

Spring Boot SQL-backed long-term memory service (port 8084). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Key Details

- **Framework:** Spring Boot 4.0.6 (Java 21)
- **Database:** SQLite by default, PostgreSQL profile available
- **Build tool:** Maven (`pom.xml`)
- **Docs:** [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)

## Commands

```bash
npm run dev    # Start on port 8084 with local SQLite
npm run test   # Maven tests
npm run build  # Maven package, skips tests
```

## Important

- Use Flyway for every schema change.
- Memory entries are scoped by tenant and user. Preserve that boundary in all new queries.
- Do not log memory bodies if they may contain operator-specific details.
