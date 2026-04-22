# elasticsearch-mcp-service — Architecture

← [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component     | Technology                 |
| ------------- | -------------------------- |
| Framework     | Spring Boot 3.5.12         |
| Language      | Java 17                    |
| AI            | Spring AI MCP Server 1.1.3 |
| Elasticsearch | Java Client 9.3.1          |
| Validation    | Jakarta Bean Validation    |
| Build         | Maven                      |

## Directory Structure

```
src/main/java/com/fdc3/elasticsearchmcp/
├── config/
│   ├── ElasticsearchClientConfig.java     # Conditional ES client bean (stub=false only)
│   └── ElasticsearchAnalyticsProperties.java  # Config properties
├── repository/
│   ├── AppAnalyticsRepository.java        # Interface
│   ├── ElasticsearchAppAnalyticsRepository.java  # Production implementation
│   └── StubAppAnalyticsRepository.java    # Stub mode implementation
├── service/
│   ├── AppAnalyticsService.java           # Core analytics logic
│   ├── BucketResolver.java               # Auto HOUR/DAY/WEEK selection
│   └── model/
│       ├── AggregateMetrics.java
│       ├── ChartMetricsPoint.java
│       ├── MonitoringPropertyFilter.java
│       └── MonitoringQuery.java
├── tool/
│   ├── AppAnalyticsMcpTools.java          # @McpTool annotated endpoints
│   └── model/
│       ├── AppStatisticCountRequest.java
│       ├── AppStatisticCountResponse.java
│       ├── AppChartRequest.java
│       ├── AppChartResponse.java
│       ├── AppChartBucket.java
│       └── validation/
│           ├── ValidAppAnalyticsRequest.java  # Custom constraint annotation
│           └── AppAnalyticsRequestValidator.java
└── ElasticsearchMcpApplication.java        # Entry point
```

## Architecture

```
AI Agent
  │
  ▼ MCP Protocol (Streamable HTTP /api/mcp)
  │
AppAnalyticsMcpTools (@McpTool)
  │
  ├── statistic_count_by_filters(filters..., startTime, endTime, propertyFilters?)
  │       │
  │       └── AppAnalyticsService.statisticCountByApp()
  │               │
  │               └── AppAnalyticsRepository
  │                     ├── StubAppAnalyticsRepository (ANALYTICS_STUB_ENABLED=true)
  │                     └── ElasticsearchAppAnalyticsRepository (production)
  │
  └── chart_by_filters(filters..., startTime, endTime, bucket?, propertyFilters?)
          │
          └── AppAnalyticsService.chartByApp()
                  │
                  ├── BucketResolver.resolveBucket(startTime, endTime, bucketOverride)
                  │       └── Auto-selects HOUR (<7d), DAY (<90d), or WEEK
                  │
                  └── AppAnalyticsRepository
                        ├── StubAppAnalyticsRepository
                        └── ElasticsearchAppAnalyticsRepository
```

## MCP Tools

### `statistic_count_by_filters`

Returns aggregate page-view (PV) and unique-visitor (UV) counts.

Parameters:

- one or more top-level monitoring filters from `key`, `event`, `container`, `tile`, `name`, `value`, `userId`, `sessionId`, `ipAddress`
- `startTime` (required) — Inclusive start, ISO-8601
- `endTime` (required) — Exclusive end, ISO-8601
- `propertyFilters` (optional) — JSON array of nested `propertyData` name/value filters

### `chart_by_filters`

Returns time-series PV/UV data points.

Parameters:

- same top-level monitoring filters as `statistic_count_by_filters`
- `startTime` (required) — Inclusive start, ISO-8601
- `endTime` (required) — Exclusive end, ISO-8601
- `bucket` (optional) — Override: `HOUR`, `DAY`, or `WEEK`
- `propertyFilters` (optional) — JSON array of nested `propertyData` name/value filters

## Stub Mode

When `ANALYTICS_STUB_ENABLED=true`:

- `ElasticsearchClientConfig` does **not** create the ES client bean
- `StubAppAnalyticsRepository` returns deterministic fixtures
- No Elasticsearch connection required
- Use for local development and testing

## MCP Configuration

```yaml
spring:
  ai:
    mcp:
      server:
        type: SYNC
        protocol: STREAMABLE
        endpoint: /api/mcp
```

## Validation

`@ValidAppAnalyticsRequest` custom validator enforces:

- At least one top-level monitoring filter or nested `propertyData` filter must be provided
- `startTime` must be before `endTime`

## Build

Maven with `spring-boot-maven-plugin`. No Spring profiles — single `application.yml` with env var overrides for all configuration.
