# Elasticsearch MCP Service Design

## Summary

Build a standalone Java Spring Boot MCP service that queries Elasticsearch user operation logs and exposes two analytics tools:

- `statistic_count_by_app`: return PV and UV for an app during a time range.
- `chart_by_app`: return PV and UV trend points for an app during a time range.

The service will live as a new workspace under `services/` and will not be embedded into the existing chatbot backend. It should use current stable dependency versions available from Maven Central where possible, while staying compatible with Java 17 and the repo's Spring Boot service pattern.

## Goals

- Provide a reusable MCP server that can answer application usage analytics questions from Elasticsearch logs.
- Keep the MCP handlers thin and move query construction into a dedicated analytics service layer.
- Validate all tool input with explicit schemas and deterministic errors.
- Support both `appId` and `appName` filters, with `appId` taking precedence.
- Support automatic chart bucketing with optional manual override.

## Non-Goals

- Natural-language query parsing.
- Arbitrary SQL-like analytics.
- Write/update/delete operations in Elasticsearch.
- Frontend work or chatbot auto-registration in this change.

## Service Architecture

### Runtime

- Spring Boot standalone service under `services/elasticsearch-mcp-service`
- Java 17
- Maven build
- MCP server transport over HTTP

### Layers

1. MCP tool layer
   - Exposes the two tools and maps input/output DTOs.
   - Performs request validation and error mapping.
2. Analytics service layer
   - Resolves canonical app filter.
   - Selects histogram bucket strategy.
   - Calls Elasticsearch repository methods.
3. Elasticsearch repository layer
   - Builds typed Elasticsearch queries and parses responses.
4. Configuration layer
   - Elasticsearch URL, credentials, index name, timestamp field, app/user field mappings, default chart bucket rules.

## Data Assumptions

The Elasticsearch index stores user operation logs with fields equivalent to:

- timestamp field
- app id field
- app name field
- user/profile identifier field

The exact field names must be configurable because log schemas vary across environments.

## MCP Tool Contracts

### Tool: `statistic_count_by_app`

#### Input

- `appId`: optional string
- `appName`: optional string
- `startTime`: required ISO-8601 datetime
- `endTime`: required ISO-8601 datetime

#### Validation

- At least one of `appId` or `appName` must be present.
- `startTime` must be before `endTime`.
- Empty strings are invalid after trimming.

#### Behavior

- If `appId` is present, filter by `appId`.
- Else filter by `appName`.
- Query matching logs within `[startTime, endTime)`.
- Return:
  - `pv`: total matching events
  - `uv`: cardinality of the configured user/profile identifier field

#### Output

- `appFilterType`: `appId` or `appName`
- `appFilterValue`
- `startTime`
- `endTime`
- `pv`
- `uv`

### Tool: `chart_by_app`

#### Input

- `appId`: optional string
- `appName`: optional string
- `startTime`: required ISO-8601 datetime
- `endTime`: required ISO-8601 datetime
- `bucket`: optional enum override

#### Bucket Rules

- If `bucket` is provided, use it.
- Else choose automatically from duration:
  - short ranges prefer hourly
  - medium ranges prefer daily
  - long ranges prefer weekly

Initial implementation can support a constrained enum such as `hour`, `day`, `week` with automatic selection between them.

#### Behavior

- Apply the same canonical app filter rules as `statistic_count_by_app`.
- Run a date histogram aggregation plus:
  - per-bucket doc count as `pv`
  - per-bucket user cardinality as `uv`

#### Output

- `appFilterType`
- `appFilterValue`
- `startTime`
- `endTime`
- `bucket`
- `points`
  - `timestamp`
  - `pv`
  - `uv`

## Error Handling

- Validation failures return a structured tool error with actionable messages.
- Elasticsearch connectivity failures return a service-unavailable style tool error.
- Empty result sets are valid responses with zero counts or empty chart series.

## Testing Strategy

### Unit Tests

- Request validation for missing app filter and invalid date ranges.
- Canonical filter resolution: `appId` overrides `appName`.
- Auto-bucket selection by duration.
- Response mapping for aggregate and chart results.

### Integration-Style Tests

- MCP tool handlers invoke analytics service with normalized requests.
- Repository query builder creates the expected Elasticsearch query structure.

Mock Elasticsearch interactions in tests. Do not require a live cluster for the initial test suite.

## Implementation Notes

- Use Spring validation annotations for DTOs where practical, with additional custom validation for cross-field rules.
- Prefer the official Elasticsearch Java client.
- Keep field names and index name externalized in configuration properties.
- Add a concise README describing configuration and local run/test commands.

## Open Decisions Already Resolved

- Deployment shape: standalone service under `services/`
- Initial tool set: exactly two tools
- App filter input: both `appId` and `appName`, with `appId` preferred
- Chart bucketing: auto bucket with optional override
