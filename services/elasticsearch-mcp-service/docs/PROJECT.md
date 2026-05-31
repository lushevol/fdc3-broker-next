# elasticsearch-mcp-service - Project Overview

<- [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Spring Boot 4.0.6 MCP server (Java 21), port 8090.

## Purpose

Exposes read-only analytics capabilities to `chatbot-backend` through MCP. It wraps Kibana/Elasticsearch search and SQL access behind validated tools for usage rankings, user-operation rankings, optional app UV summaries, and archived Text2SQL diagnostics.

## Status

Active MCP service. Text2SQL is retained as an opt-in diagnostic surface.

## Key Features

- Streamable HTTP MCP endpoint at `/api/mcp`.
- Deterministic stub mode for local and CI-style testing.
- Read-only analytics SQL validation and result shaping.
- Application aliases for `trades` and `cashflow blotter`.
- Optional MCP resources for Text2SQL catalog and prompt samples.

## Quick Start

```bash
cd services/elasticsearch-mcp-service
npm run dev
```

Root stack commands:

```bash
npm run dev:services
npm run dev:services:stub
```

## Verification

```bash
cd services/elasticsearch-mcp-service
npm run test
npm run test:e2e
```
