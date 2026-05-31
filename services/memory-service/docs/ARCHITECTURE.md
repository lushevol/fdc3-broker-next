# memory-service - Architecture

<- [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component   | Technology         |
| ----------- | ------------------ |
| Framework   | Spring Boot 4.0.6  |
| Language    | Java 21            |
| API         | Spring Web MVC     |
| ORM         | Spring Data JPA    |
| Local DB    | SQLite             |
| Deployed DB | PostgreSQL profile |
| Migrations  | Flyway             |
| Build       | Maven              |

## Directory Structure

```text
src/main/java/com/fdc3/memory/
├── api/           # REST controller, DTOs, exception handler
├── config/        # Flyway and Jackson config
├── domain/        # MemoryEntry and enums
├── repository/    # Spring Data repository
└── service/       # Application service, scope, JSON mapping
```

## API Flow

```text
MemoryController
  -> MemoryApplicationService
     -> MemoryEntryRepository
        -> SQLite or PostgreSQL
```

All read/write operations carry a `MemoryScope` with `tenantId`, `userId`, and optional `desk`.

## Data Model

`MemoryEntry` stores:

- identity and scope: `id`, `tenantId`, `userId`, `desk`
- content: `type`, `title`, `body`
- metadata: `tagsJson`, `attributesJson`, `source`, `confidence`
- lifecycle: `status`, `schemaVersion`, timestamps

## Profiles

- Default/local: SQLite at `./data/memory-service.sqlite`.
- `postgres`: PostgreSQL with `MEMORY_DATASOURCE_*` environment variables.

Both profiles use the same Flyway migration path.
