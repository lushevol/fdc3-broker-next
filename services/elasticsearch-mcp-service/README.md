# Elasticsearch MCP Service

Standalone Spring AI MCP server for application usage analytics.

- Current service docs: [docs/PROJECT.md](docs/PROJECT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/RULES.md](docs/RULES.md)
- MCP endpoint: `http://localhost:8090/api/mcp`
- Health endpoint: `http://localhost:8090/actuator/health`

## Tools

Enabled by default:

- `highest_operation_users_by_application`
  - Inputs: `application`, optional `startTime`, optional `endTime`, optional `limit`
  - Defaults: last one month, limit 10
  - Output: users ranked by operation count
- `most_used_functions_by_application`
  - Inputs: `application`, optional `startTime`, optional `endTime`, optional `limit`
  - Defaults: last one month, limit 10
  - Output: function paths ranked by usage count

Opt-in app summary tools (`ANALYTICS_APP_TOOLS_ENABLED=true`):

- `visited_user_count_by_application`
- `visited_user_hourly_by_application`

Opt-in archived Text2SQL surface (`ANALYTICS_TEXT2SQL_TOOLS_ENABLED=true`):

- `execute_analytics_sql`
- `analytics://text2sql/catalog`
- `analytics://text2sql/prompt-samples`

Supported applications are currently `cashflow blotter` and `trades`.

## Configuration

| Environment variable               | Property                                    | Purpose                                                             |
| ---------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `ANALYTICS_STUB_ENABLED`           | `analytics.stub.enabled`                    | Use deterministic stub repositories instead of Kibana/Elasticsearch |
| `ANALYTICS_APP_TOOLS_ENABLED`      | `analytics.tools.app.enabled`               | Enable app UV count/hourly tools                                    |
| `ANALYTICS_TEXT2SQL_TOOLS_ENABLED` | `analytics.tools.text2sql.enabled`          | Enable archived Text2SQL tool and resources                         |
| `ELASTICSEARCH_KIBANA_SEARCH_URL`  | `analytics.elasticsearch.kibana-search-url` | Kibana proxy URL for JSON DSL search                                |
| `ELASTICSEARCH_KIBANA_SQL_URL`     | `analytics.elasticsearch.kibana-sql-url`    | Kibana proxy URL for Elasticsearch SQL                              |
| `ELASTICSEARCH_CREATED_AT_FIELD`   | `analytics.elasticsearch.created-at-field`  | Timestamp field                                                     |
| `ELASTICSEARCH_USER_ID_FIELD`      | `analytics.elasticsearch.user-id-field`     | User identifier field                                               |
| `ELASTICSEARCH_TILE_FIELD`         | `analytics.elasticsearch.tile-field`        | Tile field                                                          |
| `ELASTICSEARCH_CONTAINER_FIELD`    | `analytics.elasticsearch.container-field`   | Container field                                                     |
| `ELASTICSEARCH_NAME_FIELD`         | `analytics.elasticsearch.name-field`        | Event name field                                                    |
| `ELASTICSEARCH_EVENT_FIELD`        | `analytics.elasticsearch.event-field`       | Event field                                                         |
| `ELASTICSEARCH_KEY_FIELD`          | `analytics.elasticsearch.key-field`         | Monitoring key field                                                |

## Run

```bash
cd services/elasticsearch-mcp-service
npm run dev
```

From the monorepo root, use the profile-driven service stack:

```bash
npm run dev:services       # ACTIVE_ENV=dev
npm run dev:services:stub  # ACTIVE_ENV=stub with ANALYTICS_STUB_ENABLED=true
```

## Test

```bash
cd services/elasticsearch-mcp-service
npm run test
npm run test:e2e
```

Manual prompt examples:

- `what's the most popular function in trades`
- `what's the top 5 functions in trades`
- `which function in trades has the most clicks`
- `show the most popular function paths in cashflow blotter`
