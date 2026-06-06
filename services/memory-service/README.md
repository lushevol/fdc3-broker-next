# Memory Service

Standalone SQL-backed memory API used by `chatbot-backend` to retrieve durable operator preferences and workflow context.

- Current service docs: [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)
- Local port: `8084`
- Default database: `services/memory-service/data/memory-service.sqlite`

## Local Run

```bash
cd services/memory-service
npm run dev
```

The dev script creates `data/` and `logs/`, then starts Spring Boot with the `local` profile.

## PostgreSQL Profile

Run with `spring.profiles.active=postgres` and set:

```bash
MEMORY_DATASOURCE_URL=jdbc:postgresql://localhost:5432/memory_service
MEMORY_DATASOURCE_USERNAME=memory_service
MEMORY_DATASOURCE_PASSWORD=memory_service
```

Flyway migrations in `src/main/resources/db/migration` are the source of truth. Hibernate validates the schema; it does not mutate it.

## API

Base path: `/api/memory/entries`

- `POST /api/memory/entries` creates a memory entry.
- `GET /api/memory/entries?tenantId=default&userId=operator-1&status=ACTIVE&limit=8` searches entries.
- `GET /api/memory/entries/{id}?tenantId=default&userId=operator-1` fetches one entry.
- `PATCH /api/memory/entries/{id}` updates mutable fields.
- `POST /api/memory/entries/{id}/archive?tenantId=default&userId=operator-1` archives an entry.
- `DELETE /api/memory/entries/{id}?tenantId=default&userId=operator-1` soft-deletes an entry.

Entries are scoped by `tenantId`, `userId`, and optional `desk`. `type`, `tags`, and `attributesJson` keep workflow-specific details extensible.

## Chatbot Integration

`chatbot-backend` reads active entries through `CHATBOT_MEMORY_BASE_URL`, `CHATBOT_MEMORY_TENANT_ID`, `CHATBOT_MEMORY_REQUEST_TIMEOUT`, and `CHATBOT_MEMORY_CONTEXT_LIMIT`.

Memory lookup is best-effort: chatbot requests continue if this service is unavailable.
