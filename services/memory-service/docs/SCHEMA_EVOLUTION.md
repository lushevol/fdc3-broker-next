# Memory Schema Evolution

Use Flyway for every database change.

## Rules

- Add migrations as `V<major>_<minor>_<patch>__description.sql`.
- Never edit an applied migration; add a new one.
- Keep `spring.jpa.hibernate.ddl-auto=validate`.
- Prefer additive changes first: nullable columns, indexes, tables, or JSON attributes.
- Backfill data in a separate migration when a new non-null column is required.
- Keep SQLite and PostgreSQL syntax portable where practical. Split vendor-specific changes before production adoption.

## Current Extension Points

- `type`: coarse memory category such as `PREFERENCE`, `BAU_WORKFLOW`, `WATCHLIST`, or `MARKET_CONTEXT`.
- `tags_json`: lightweight filtering labels without a join table.
- `attributes_json`: structured details for market-specific workflows.
- `schema_version`: application-level version for interpreting entry payloads as the memory model evolves.

## SQLite to PostgreSQL Path

1. Keep writing portable migrations during local/POC work.
2. Add PostgreSQL-specific indexes or JSONB columns in a new migration once query patterns are known.
3. Export SQLite rows and transform JSON fields if needed.
4. Import into PostgreSQL.
5. Start the service with `spring.profiles.active=postgres`.
6. Run the same service tests against PostgreSQL before cutover.
