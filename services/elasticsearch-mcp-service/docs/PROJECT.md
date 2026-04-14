# elasticsearch-mcp-service — Project Overview

← [Monorepo AGENTS.md](../../AGENTS.md)

## Type

Spring Boot MCP Service (Java 17), Port 8090

## Purpose

Exposes Elasticsearch application usage analytics via the Model Context Protocol (MCP). Provides MCP tools for AI agents to query page-view and unique-visitor metrics. Stub mode for local dev without Elasticsearch.

## Status

Active Development

## Key Features

- **MCP Streamable HTTP protocol endpoint**: Spring AI MCP server at `/api/mcp`
- **Two MCP tools**: `statistic_count_by_app` (aggregate PV/UV) and `chart_by_app` (time-series PV/UV by HOUR/DAY/WEEK)
- **Stub mode**: Deterministic fixtures when `ANALYTICS_STUB_ENABLED=true` — no Elasticsearch needed
- **Auto bucket resolution**: `BucketResolver` selects HOUR/DAY/WEEK based on time range
- **Bean validation**: Custom `@ValidAppAnalyticsRequest` validator ensures `appId` or `appName` is provided and `startTime < endTime`
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
| `ELASTICSEARCH_HOST`           | `localhost` | Elasticsearch host                           |
| `ELASTICSEARCH_PORT`           | `9200`      | Elasticsearch port                           |
| `ELASTICSEARCH_PROTOCOL`       | `https`     | Elasticsearch protocol                       |
| `ELASTICSEARCH_API_KEY`        | —           | API key auth (takes priority)                |
| `ELASTICSEARCH_USERNAME`       | —           | Basic auth username                          |
| `ELASTICSEARCH_PASSWORD`       | —           | Basic auth password (used with username)     |
| `ELASTICSEARCH_APP_ID_FIELD`   | `appId`     | Field name for app ID                        |
| `ELASTICSEARCH_APP_NAME_FIELD` | `appName`   | Field name for app name                      |
| `ELASTICSEARCH_PV_FIELD`       | `pv`        | Field name for page views                    |
| `ELASTICSEARCH_UV_FIELD`       | `uv`        | Field name for unique visitors               |
| `SERVER_PORT`                  | `8090`      | HTTP server port                             |
