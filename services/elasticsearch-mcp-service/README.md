# Elasticsearch MCP Service

Standalone Java MCP server for Elasticsearch-backed application usage analytics.

## Tools

- `statistic_count_by_app`
  - Inputs: `appId?`, `appName?`, `startTime`, `endTime`
  - Output: `pv`, `uv` for the selected app and duration
- `chart_by_app`
  - Inputs: `appId?`, `appName?`, `startTime`, `endTime`, `bucket?`
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
| `analytics.elasticsearch.app-id-field`    | App ID field                   |
| `analytics.elasticsearch.app-name-field`  | App name field                 |
| `analytics.elasticsearch.user-id-field`   | User/profile field used for UV |

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
