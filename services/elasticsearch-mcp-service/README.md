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

| Property | Description |
| --- | --- |
| `analytics.elasticsearch.url` | Elasticsearch base URL |
| `analytics.elasticsearch.api-key` | Optional API key |
| `analytics.elasticsearch.username` | Optional basic auth username |
| `analytics.elasticsearch.password` | Optional basic auth password |
| `analytics.elasticsearch.index-name` | Log index name |
| `analytics.elasticsearch.timestamp-field` | Timestamp field |
| `analytics.elasticsearch.app-id-field` | App ID field |
| `analytics.elasticsearch.app-name-field` | App name field |
| `analytics.elasticsearch.user-id-field` | User/profile field used for UV |

## Run

```bash
cd services/elasticsearch-mcp-service
npm run dev
```

The MCP endpoint is exposed at `/api/mcp` by default.

## Test

```bash
cd services/elasticsearch-mcp-service
npm test
```
