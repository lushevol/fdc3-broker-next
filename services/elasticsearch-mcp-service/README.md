# Elasticsearch MCP Service

Standalone Java MCP server for Elasticsearch-backed user monitoring analytics.

## Tools

- `statistic_count_by_filters`
  - Inputs: `startTime`, `endTime`, one or more monitoring filters from `key`, `event`, `container`, `tile`, `name`, `value`, `userId`, `sessionId`, `ipAddress`, `propertyFilters`
  - Output: `pv`, `uv` for matching real monitoring events
- `chart_by_filters`
  - Inputs: same filters as above plus optional `bucket`
  - Output: time-series points of `pv`, `uv`

## Configuration

Configure the Elasticsearch connection and log field mapping through environment variables or `application.yml`.

| Property                                  | Description                    |
| ----------------------------------------- | ------------------------------ |
| `analytics.elasticsearch.url`             | Elasticsearch base URL         |
| `analytics.elasticsearch.api-key`         | Optional API key               |
| `analytics.elasticsearch.username`        | Optional basic auth username   |
| `analytics.elasticsearch.password`        | Optional basic auth password   |
| `analytics.elasticsearch.index-name`      | Log index name                 |
| `analytics.elasticsearch.timestamp-field` | Timestamp field                |
| `analytics.elasticsearch.key-field`       | Monitoring key field           |
| `analytics.elasticsearch.event-field`     | Monitoring event field         |
| `analytics.elasticsearch.container-field` | Container field                |
| `analytics.elasticsearch.tile-field`      | Tile field                     |
| `analytics.elasticsearch.name-field`      | Top-level name field           |
| `analytics.elasticsearch.value-field`     | Top-level value field          |
| `analytics.elasticsearch.user-id-field`   | User identifier field for UV   |
| `analytics.elasticsearch.session-id-field`| Session/authorization field    |
| `analytics.elasticsearch.ip-address-field`| IP address field               |
| `analytics.elasticsearch.property-data-path` | Nested property array path  |
| `analytics.elasticsearch.property-name-field` | Nested property name field |
| `analytics.elasticsearch.property-value-field` | Nested property value field |

`propertyFilters` is passed to MCP as a JSON array string, for example:

```json
[{"name":"content_name","value":"Cashflow"},{"name":"route","value":"/workspace"}]
```

## Run

```bash
cd services/elasticsearch-mcp-service
npm run dev
```

The MCP endpoint is exposed at `/api/mcp` by default.

For a local runnable stub that does not require Elasticsearch:

```bash
cd services/elasticsearch-mcp-service
npm run dev:stub
```

To run the local chatbot backend against this MCP service from the repo root without changing the default `npm run dev` flow:

```bash
npm run dev:chatbot-mcp-stack
```

That starts:

- `services/elasticsearch-mcp-service` on `http://localhost:8090/api/mcp`
- `services/chatbot-backend` with `CHATBOT_MCP_ELASTICSEARCH_ENABLED=true`
- a deterministic analytics stub, enabled with `ANALYTICS_STUB_ENABLED=true`

To run the same stack against a real Elasticsearch-backed MCP service instead of the stub:

```bash
npm run dev:chatbot-mcp-stack:live
```

## Test

```bash
cd services/elasticsearch-mcp-service
npm test
```
