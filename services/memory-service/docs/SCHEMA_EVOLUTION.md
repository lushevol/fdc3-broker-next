# Memory Schema Evolution

Use Flyway for every database change.

## Rules

- Add migrations as `V<major>_<minor>_<patch>__description.sql`.
- Never edit an applied migration; add a new one.
- Keep `spring.jpa.hibernate.ddl-auto=validate` so application startup catches drift.
- Prefer additive changes first: nullable columns, new indexes, new tables, or JSON attributes.
- Backfill data in a separate migration when a new non-null column is required.
- Keep SQLite and PostgreSQL syntax portable where practical. If a change needs vendor-specific SQL, split it by profile before production adoption.

## Current Extension Points

- `type`: coarse memory category such as `PREFERENCE`, `BAU_WORKFLOW`, `WATCHLIST`, or `MARKET_CONTEXT`.
- `tags_json`: lightweight filtering labels without a join table.
- `attributes_json`: structured details for market-specific workflows, for example desk, asset class, instruments, systems, or preferred report windows.
- `schema_version`: application-level version for interpreting entry payloads as the memory model evolves.

## SQLite to PostgreSQL Path

1. Keep writing portable migrations during the POC.
2. Add PostgreSQL-specific indexes or JSONB columns in a new migration once production query patterns are known.
3. Export SQLite rows, transform JSON fields if needed, and import into PostgreSQL.
4. Start the service with `spring.profiles.active=postgres`.
5. Run the same service tests against PostgreSQL before cutover.
