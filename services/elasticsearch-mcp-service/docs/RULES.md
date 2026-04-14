# elasticsearch-mcp-service — Rules

← [PROJECT.md](./PROJECT.md) · [Monorepo rules](../../docs/rules.md)

## MCP Protocol

- This service uses Spring AI's MCP server framework
- Tools are registered via `@McpTool` annotations on `AppAnalyticsMcpTools`
- The MCP endpoint is `/api/mcp` using Streamable HTTP protocol
- Do not add REST endpoints for analytics data — expose them only as MCP tools

## Stub Mode

- Use `dev:stub` (`ANALYTICS_STUB_ENABLED=true`) for local development without Elasticsearch
- Never use stub mode in production — `StubAppAnalyticsRepository` returns deterministic fixtures, not real data
- The ES client bean is only created when `ANALYTICS_STUB_ENABLED=false` (default)

## Request Validation

- All analytics requests require either `appId` or `appName`
- `startTime` must be before `endTime`
- Use `@ValidAppAnalyticsRequest` annotation — do not bypass validation

## Elasticsearch Auth

- Supports API key auth (`ELASTICSEARCH_API_KEY`) or basic auth (`ELASTICSEARCH_USERNAME` + `ELASTICSEARCH_PASSWORD`)
- API key takes priority when both are configured
- Never hard-code Elasticsearch credentials in source

## Field Mapping

- All ES index field names are configurable via env vars:
  - `ELASTICSEARCH_APP_ID_FIELD` (default: `appId`)
  - `ELASTICSEARCH_APP_NAME_FIELD` (default: `appName`)
  - `ELASTICSEARCH_PV_FIELD` (default: `pv`)
  - `ELASTICSEARCH_UV_FIELD` (default: `uv`)
- Do not hard-code field names in queries

## Bucket Resolution

- `BucketResolver` auto-selects `HOUR` (<7 days), `DAY` (<90 days), or `WEEK` (≥90 days)
- Do not override unless there is a specific requirement
- The `bucket` parameter on `chart_by_app` allows manual override

## Conditional Beans

- `ElasticsearchClientConfig` only creates the ES client bean when `analytics.stub.enabled=false`
- Do not make the ES client bean unconditional — it will fail without ES connection details
