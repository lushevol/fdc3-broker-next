# Elasticsearch MCP Text2SQL Design

## Goal

Add text-to-SQL support to `services/elasticsearch-mcp-service` so an MCP client can answer analytics questions such as "what's the most popular function in trades" by generating Elasticsearch SQL, executing it safely, and returning structured results.

The first semantic meaning of "function" is the clicked element path stored in `attribute16`, for example `/cashflow_blotter/cashflow_cn/quick_search/search_btn`.

## Scope

This change adds a code-defined text2sql catalog, an MCP resource that exposes that catalog, and an MCP tool that executes validated read-only analytics SQL. Existing fixed analytics tools remain intact.

This change does not add a config file or server-side natural-language generation. The host LLM performs text-to-SQL using the MCP resource as grounding context.

## Architecture

The implementation uses a small Java semantic catalog rather than YAML/config. Each future text2sql requirement can be added by creating or extending a Java module.

```text
MCP client / host LLM
  -> reads analytics://text2sql/catalog
  -> generates Elasticsearch SQL
  -> calls execute_analytics_sql(sql, limit)
  -> receives structured columns and rows
```

Core packages:

- `catalog`: code-defined text2sql schema and modules
- `resource`: MCP resource exposing the catalog
- `tool`: MCP tool accepting generated SQL
- `repository`: SQL transport to Elasticsearch or Kibana proxy
- `service`: SQL validation and orchestration

## Catalog Model

The catalog is assembled in code from Java objects:

- `Text2SqlCatalog`: top-level registry
- `AnalyticsDataset`: physical index/table plus dimensions, metrics, entities, and examples
- `SemanticDimension`: user-facing concept mapped to a physical field
- `SemanticMetric`: metric name mapped to an aggregate expression
- `BusinessEntity`: named entity mapped to fixed filters
- `QueryExample`: natural-language question plus expected SQL pattern
- `Text2SqlModule`: extension point for future capabilities

Initial module:

- dataset/table: `single-ui-bff-analytic`
- dimension: `function` -> `attribute16`
- entity: `trades` -> `tile = 'trade' AND container = 'trade_blotter'`
- entity: `cashflow blotter` -> `tile = 'cashflow_cn' AND container = 'cashflow_blotter_cn'`
- metric: `popularity` -> `COUNT(*)`
- metric: `visited users` -> `COUNT(DISTINCT userId)`

Example generated SQL:

```sql
SELECT attribute16 AS function_path, COUNT(*) AS usage_count
FROM "single-ui-bff-analytic"
WHERE tile = 'trade'
  AND container = 'trade_blotter'
  AND attribute16 IS NOT NULL
GROUP BY attribute16
ORDER BY usage_count DESC
LIMIT 10
```

## MCP Resource

Expose:

```text
analytics://text2sql/catalog
```

The resource returns compact plain text or Markdown describing available datasets, fields, entities, metrics, safety rules, and examples. It is generated from catalog objects, not maintained separately.

Spring AI resource capability must be enabled in `application.yml` alongside tool capability.

## MCP Tool

Expose:

```text
execute_analytics_sql(sql, limit)
```

The tool validates and executes generated SQL, then returns:

- executed SQL
- columns
- rows
- row count
- applied limit

The tool does not interpret natural language. It only executes already-generated SQL.

## SQL Safety

Validation rules:

- allow only `SELECT`
- reject multiple statements
- reject comments
- reject metadata/system tables
- restrict queries to the configured analytics index/table
- require or inject a `LIMIT`
- cap the limit
- reject `SELECT *` by default

Validation should be deterministic and unit-tested. The repository should never execute SQL that fails validation.

## Transport

Use a repository abstraction so the public tool and service are independent of the transport.

Preferred execution target is Elasticsearch SQL REST, `POST /_sql?format=json`. If the local environment still requires Kibana proxy access, the repository can post through the existing Kibana URL pattern without changing MCP contracts.

## Tests

Add focused tests before implementation:

- catalog includes `function -> attribute16`
- catalog renders the trades/popularity example
- resource returns generated catalog content
- validator accepts a safe grouped function query
- validator rejects non-SELECT, multi-statement, comments, wrong table, missing/oversized limit, and `SELECT *`
- MCP tool delegates only validated SQL and returns structured rows
- repository builds the expected SQL request body

## Extension Path

Future requirements should add Java modules, not config entries. Examples:

- `UserActivityText2SqlModule` for user-level questions
- `ApplicationUsageText2SqlModule` for app popularity questions
- `TimeSeriesText2SqlModule` for trend and bucketed questions

Each module can contribute dimensions, metrics, entities, constraints, and examples while keeping the SQL executor generic.
