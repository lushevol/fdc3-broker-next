# rag-knowledge-base-service - Project Overview

<- [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Spring Boot 4.0.6 MCP server (Java 21), port 8091.

## Purpose

Provides read-only retrieval over local knowledge-base documents for `chatbot-backend`. The service owns ingestion, chunking, embeddings, and vector search so chatbot integration remains a normal MCP provider registration.

## Status

Active MCP service.

## Key Features

- Streamable HTTP MCP endpoint at `/api/mcp`.
- `search_knowledge_base` MCP tool.
- Markdown ingestion from `rag.ingestion.resource-pattern`.
- Deterministic, OpenRouter, and Copilot API embedding providers.
- In-memory repository for local runs.
- Elasticsearch repository when `rag.elasticsearch.enabled=true`.
- Namespace filtering and citation-ready result metadata.

## Quick Start

```bash
cd services/rag-knowledge-base-service
ACTIVE_ENV=stub npm run dev
```

## Verification

```bash
cd services/rag-knowledge-base-service
npm run test
```
