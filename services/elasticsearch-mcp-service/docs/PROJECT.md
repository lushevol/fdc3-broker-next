# elasticsearch-mcp-service — Project Overview

← [Monorepo AGENTS.md](../../AGENTS.md)

## Type

Spring Boot MCP Service (Java 17), Port 8090

## Purpose

Exposes Elasticsearch user monitoring analytics via the Model Context Protocol (MCP). Provides MCP tools for AI agents to query page-view and unique-visitor metrics from the real monitoring log structure, including nested `propertyData` filters. Stub mode for local dev without Elasticsearch.

## Status

Active Development

## Key Features

- **MCP Streamable HTTP protocol endpoint**: Spring AI MCP server at `/api/mcp`
- **Two MCP tools**: `statistic_count_by_filters` (aggregate PV/UV) and `chart_by_filters` (time-series PV/UV by HOUR/DAY/WEEK)
- **Stub mode**: Deterministic fixtures when `ANALYTICS_STUB_ENABLED=true` — no Elasticsearch needed
- **Auto bucket resolution**: `BucketResolver` selects HOUR/DAY/WEEK based on time range
- **Bean validation**: Custom `@ValidAppAnalyticsRequest` validator ensures at least one monitoring filter is provided and `startTime < endTime`
- **Elasticsearch Java client 9.x**: Uses `co.elastic.clients:elasticsearch-java:9.3.1`

## Quick Start

```bash
# From monorepo root
npm run dev:with-elasticsearch-mcp

# Standalone — stub mode (no Elasticsearch needed)
cd services/elasticsearch-mcp-service && npm run dev:stub

# Standalone — live Elasticsearch mode
cd services/elasticsearch-mcp-service && npm run dev:live

# Build / test
npm run build
npm run test
```

## Package

`com.fdc3.elasticsearchmcp`

## Environment Variables

| Variable                       | Default     | Description                                  |
| ------------------------------ | ----------- | -------------------------------------------- |
| `ANALYTICS_STUB_ENABLED`       | `false`     | Enable stub mode with deterministic fixtures |
| `ELASTICSEARCH_URL`            | `http://localhost:9200` | Elasticsearch base URL            |
| `ELASTICSEARCH_API_KEY`        | —           | API key auth (takes priority)                |
| `ELASTICSEARCH_USERNAME`       | —           | Basic auth username                          |
| `ELASTICSEARCH_PASSWORD`       | —           | Basic auth password (used with username)     |
| `ELASTICSEARCH_KEY_FIELD`      | `key.keyword` | Top-level monitoring key field            |
| `ELASTICSEARCH_EVENT_FIELD`    | `event.keyword` | Top-level monitoring event field       |
| `ELASTICSEARCH_CONTAINER_FIELD`| `container.keyword` | Container field                    |
| `ELASTICSEARCH_TILE_FIELD`     | `tile.keyword` | Tile field                               |
| `ELASTICSEARCH_NAME_FIELD`     | `name.keyword` | Top-level name field                     |
| `ELASTICSEARCH_VALUE_FIELD`    | `value.keyword` | Top-level value field                   |
| `ELASTICSEARCH_USER_ID_FIELD`  | `userId.keyword` | User identifier field for UV           |
| `ELASTICSEARCH_SESSION_ID_FIELD` | `singleUIAuthorization.keyword` | Session/auth field |
| `ELASTICSEARCH_IP_ADDRESS_FIELD` | `ipAddress.keyword` | IP field                     |
| `ELASTICSEARCH_PROPERTY_DATA_PATH` | `propertyData` | Nested property path               |
| `ELASTICSEARCH_PROPERTY_NAME_FIELD` | `propertyData.name.keyword` | Nested property name |
| `ELASTICSEARCH_PROPERTY_VALUE_FIELD` | `propertyData.value.keyword` | Nested property value |
| `SERVER_PORT`                  | `8090`      | HTTP server port                             |
