# Memory Service

Standalone SQL-backed memory API for chatbot operator preferences and BAU work context.

## Local POC

```bash
npm --workspace services/memory-service run dev
```

The local profile uses SQLite at `services/memory-service/data/memory-service.sqlite` and runs on port `8084`.

## PostgreSQL Later

Run with the `postgres` Spring profile and set:

```bash
MEMORY_DATASOURCE_URL=jdbc:postgresql://localhost:5432/chatbot_memory
MEMORY_DATASOURCE_USERNAME=memory
MEMORY_DATASOURCE_PASSWORD=memory
```

Flyway migrations in `src/main/resources/db/migration` are the source of truth for schema changes. Hibernate is set to validate, not mutate, the database schema.

## API Shape

- `POST /api/memory/entries` creates a memory entry.
- `GET /api/memory/entries?tenantId=default&userId=operator-1&status=ACTIVE&limit=8` searches active entries.
- `GET /api/memory/entries/{id}` fetches one entry.
- `PATCH /api/memory/entries/{id}` updates mutable fields.
- `POST /api/memory/entries/{id}/archive` archives an entry.
- `DELETE /api/memory/entries/{id}` soft-deletes an entry.

Memory entries are scoped by `tenantId` and `userId`; `desk`, `type`, `tags`, and `attributesJson` keep the schema extensible without forcing a table change for every new market-workflow detail.
