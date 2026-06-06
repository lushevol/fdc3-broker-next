# memory-service - Project Overview

<- [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Spring Boot 4.0.6 backend service (Java 21), port 8084.

## Purpose

Provides durable, queryable operator memory for chatbot workflows. The service stores preferences, BAU workflow facts, watchlists, and market context in SQL while preserving tenant/user/desk boundaries.

## Status

Active service. Used by `chatbot-backend` as a best-effort context provider.

## Key Features

- CRUD-style API for memory entries.
- Tenant, user, and optional desk scoping.
- SQLite default storage for local development.
- PostgreSQL-ready profile for deployed use.
- Flyway-managed schema.
- JSON-backed `tags` and `attributes` extension fields.
- Soft delete and archive operations.

## Quick Start

```bash
cd services/memory-service
npm run dev
```

## Verification

```bash
cd services/memory-service
npm run test
```
