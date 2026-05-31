# elasticsearch-mcp-service - Architecture

<- [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component            | Technology                                         |
| -------------------- | -------------------------------------------------- |
| Framework            | Spring Boot 4.0.6                                  |
| Language             | Java 21                                            |
| MCP                  | Spring AI 2.0.0-M6 MCP server                      |
| Elasticsearch client | `elasticsearch-java` 9.3.1 plus Kibana proxy calls |
| Validation           | Jakarta Validation                                 |
| Build                | Maven                                              |

## Directory Structure

```text
src/main/java/com/fdc3/elasticsearchmcp/
├── catalog/        # Code-defined Text2SQL catalog and examples
├── config/         # Clock, Kibana client, analytics properties
├── repository/     # Elasticsearch and stub repositories
├── resource/       # Optional MCP resources
├── service/        # SQL execution, app analytics, validation, buckets
└── tool/           # MCP tools and request/response models
```

## MCP Surface

```text
chatbot-backend MCP client
  -> /api/mcp
     -> UserMonitoringMcpTools
        -> AnalyticsSqlService
           -> AnalyticsSqlRepository
              -> ElasticsearchAnalyticsSqlRepository or StubAnalyticsSqlRepository
```

Default tools:

- `highest_operation_users_by_application`
- `most_used_functions_by_application`

Optional tools:

- `visited_user_count_by_application`
- `visited_user_hourly_by_application`
- `execute_analytics_sql`

Optional resources:

- `analytics://text2sql/catalog`
- `analytics://text2sql/prompt-samples`

## Repository Selection

- `analytics.stub.enabled=false` or unset: use Kibana/Elasticsearch repositories.
- `analytics.stub.enabled=true`: use stub repositories backed by deterministic mock data.

## Safety

`SqlSafetyValidator` restricts SQL to read-only `SELECT` statements and caps limits. User-facing tools construct constrained SQL from validated application aliases and time windows.
