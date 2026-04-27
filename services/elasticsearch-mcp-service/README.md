# Elasticsearch MCP Service

Standalone Java MCP server for Elasticsearch-backed user monitoring analytics.

## Tools

- `visited_user_count_by_application`
  - Inputs: `application`, `startTime`, `endTime`
  - Output: UV count for supported applications: `cashflow blotter`, `trades`
- `visited_user_hourly_by_application`
  - Inputs: `application`, `startTime`, `endTime`
  - Output: hourly UV series for supported applications: `cashflow blotter`, `trades`
- `highest_operation_users_by_application`
  - Inputs: `application`, optional `startTime`, optional `endTime`, optional `limit`
  - Defaults: last 1 month, limit 10
  - Output: `userId` and operation `count`
- `most_used_functions_by_application`
  - Inputs: `application`, optional `startTime`, optional `endTime`, optional `limit`
  - Defaults: last 1 month, limit 10
  - Output: `functionPath` and usage `count`

## Archived Text2SQL

The generic text-to-SQL MCP surface is archived and disabled by default. The code remains available for reference and targeted testing, but the service no longer exposes it unless explicitly enabled:

- `execute_analytics_sql`
- `analytics://text2sql/catalog`
- `analytics://text2sql/prompt-samples`

Enable only for legacy testing with `ANALYTICS_TEXT2SQL_TOOLS_ENABLED=true`.

## Resources

No MCP resources are exposed by default.

Archived text-to-SQL resources, when `ANALYTICS_TEXT2SQL_TOOLS_ENABLED=true`:

- `analytics://text2sql/catalog`
  - Code-defined schema and semantic catalog for text-to-SQL generation
  - Defines `function` as the clicked element path stored in `attribute16`
  - Includes business mappings such as `trades` -> `tile = 'trade' AND container = 'trade_blotter'`
- `analytics://text2sql/prompt-samples`
  - Ready-to-use prompt samples for manual testing
  - Includes expected SQL shapes for common function-usage questions

## Configuration

Configure the Elasticsearch connection and log field mapping through environment variables or `application.yml`.

| Property                                  | Description                         |
| ----------------------------------------- | ----------------------------------- |
| `analytics.elasticsearch.kibana-search-url` | Kibana proxy URL for JSON DSL search |
| `analytics.elasticsearch.kibana-sql-url`  | Kibana proxy URL for Elasticsearch SQL |
| `analytics.elasticsearch.index-name`      | Log index name                      |
| `analytics.elasticsearch.created-at-field` | Timestamp field                    |
| `analytics.elasticsearch.key-field`       | Monitoring key field                |
| `analytics.elasticsearch.event-field`     | Monitoring event field              |
| `analytics.elasticsearch.container-field` | Container field                     |
| `analytics.elasticsearch.tile-field`      | Tile field                          |
| `analytics.elasticsearch.name-field`      | Event name field                    |
| `analytics.elasticsearch.user-id-field`   | User identifier field for UV        |
| `analytics.tools.text2sql.enabled`        | Enables archived text-to-SQL tool/resources |

Text-to-SQL semantics are code-defined under `com.fdc3.elasticsearchmcp.catalog`, not in configuration files.

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

Run only the text2sql E2E flow in stub mode:

```bash
cd services/elasticsearch-mcp-service
npm run test:e2e
```

Manual prompt samples:

- `what's the most popular function in trades`
- `what's the top 5 functions in trades`
- `which function in trades has the most clicks`
- `show the most popular function paths in cashflow blotter`
