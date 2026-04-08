# Elasticsearch MCP Service Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Java Spring Boot MCP service that queries Elasticsearch user operation logs and exposes `statistic_count_by_app` and `chart_by_app`.

**Architecture:** Create a new Spring Boot service workspace under `services/` with clear separation between MCP tool handlers, analytics orchestration, and Elasticsearch query execution. Keep field mappings and index details in configuration so the tool contract remains stable even if the log schema changes.

**Tech Stack:** Java 17, Spring Boot, Spring Validation, official Elasticsearch Java client, JUnit 5, Mockito

---

### Task 1: Scaffold the New Service Workspace

**Files:**

- Create: `services/elasticsearch-mcp-service/pom.xml`
- Create: `services/elasticsearch-mcp-service/package.json`
- Create: `services/elasticsearch-mcp-service/README.md`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/ElasticsearchMcpApplication.java`
- Create: `services/elasticsearch-mcp-service/src/main/resources/application.yml`
- Create: `services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/ElasticsearchMcpApplicationTests.java`

- [ ] **Step 1: Write the failing application context test**

```java
@SpringBootTest
class ElasticsearchMcpApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=ElasticsearchMcpApplicationTests`
Expected: FAIL because the service files do not exist yet.

- [ ] **Step 3: Add the minimal Maven/Spring Boot scaffold**

Create the new workspace, configure Java 17, add Spring Boot starter dependencies, test dependencies, and a minimal application entrypoint.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=ElasticsearchMcpApplicationTests`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/elasticsearch-mcp-service docs/superpowers/specs/2026-04-03-elasticsearch-mcp-service-design.md docs/superpowers/plans/2026-04-03-elasticsearch-mcp-service.md
git commit -m "feat: scaffold elasticsearch mcp service"
```

### Task 2: Add Request and Response Models for Both Tools

**Files:**

- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/model/AppStatisticCountRequest.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/model/AppStatisticCountResponse.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/model/AppChartRequest.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/model/AppChartResponse.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/model/AppChartPoint.java`
- Test: `services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/tool/model/RequestValidationTest.java`

- [ ] **Step 1: Write failing validation tests**

Cover:

- missing both `appId` and `appName`
- `startTime >= endTime`
- blank strings rejected

- [ ] **Step 2: Run test to verify it fails**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=RequestValidationTest`
Expected: FAIL because DTOs and validators do not exist.

- [ ] **Step 3: Implement minimal DTOs and validation**

Use bean validation plus custom cross-field validation where needed.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=RequestValidationTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/model services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/tool/model
git commit -m "feat: add analytics tool request models"
```

### Task 3: Implement Analytics Service Logic

**Files:**

- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/service/AppAnalyticsService.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/service/BucketResolver.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/service/model/AppFilter.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/service/model/AggregateMetrics.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/service/model/ChartMetricsPoint.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/repository/AppAnalyticsRepository.java`
- Test: `services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/service/AppAnalyticsServiceTest.java`

- [ ] **Step 1: Write failing service tests**

Cover:

- `appId` overrides `appName`
- auto bucket selection for short and medium durations
- repository results map into the two tool response shapes

- [ ] **Step 2: Run test to verify it fails**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=AppAnalyticsServiceTest`
Expected: FAIL because the service and repository interfaces do not exist.

- [ ] **Step 3: Implement minimal service and bucket resolution**

Keep the service orchestration deterministic and free of transport details.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=AppAnalyticsServiceTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/service services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/repository services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/service
git commit -m "feat: add analytics service layer"
```

### Task 4: Implement Elasticsearch Repository and Configuration

**Files:**

- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/config/ElasticsearchAnalyticsProperties.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/config/ElasticsearchClientConfig.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/repository/ElasticsearchAppAnalyticsRepository.java`
- Test: `services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/repository/ElasticsearchAppAnalyticsRepositoryTest.java`
- Modify: `services/elasticsearch-mcp-service/src/main/resources/application.yml`

- [ ] **Step 1: Write failing repository tests**

Cover:

- canonical app filter produces the expected term query
- aggregate query includes total count plus user cardinality aggregation
- chart query includes date histogram plus per-bucket cardinality aggregation

- [ ] **Step 2: Run test to verify it fails**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=ElasticsearchAppAnalyticsRepositoryTest`
Expected: FAIL because the repository implementation does not exist.

- [ ] **Step 3: Implement minimal Elasticsearch client config and repository**

Externalize:

- index name
- timestamp field
- app id field
- app name field
- user id/profile field

- [ ] **Step 4: Run test to verify it passes**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=ElasticsearchAppAnalyticsRepositoryTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/config services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/repository services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/repository services/elasticsearch-mcp-service/src/main/resources/application.yml
git commit -m "feat: add elasticsearch analytics repository"
```

### Task 5: Expose MCP Tools

**Files:**

- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/AppAnalyticsMcpTools.java`
- Create: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/config/McpToolConfig.java`
- Test: `services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/tool/AppAnalyticsMcpToolsTest.java`

- [ ] **Step 1: Write failing tool tests**

Cover:

- `statistic_count_by_app` delegates to service and returns the expected response
- `chart_by_app` delegates to service and returns the expected response
- validation errors propagate as deterministic exceptions

- [ ] **Step 2: Run test to verify it fails**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=AppAnalyticsMcpToolsTest`
Expected: FAIL because MCP tool classes do not exist.

- [ ] **Step 3: Implement minimal MCP tool registration**

Use the chosen MCP Java library to expose two named tools with stable schemas.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd services/elasticsearch-mcp-service && mvn test -Dtest=AppAnalyticsMcpToolsTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/config services/elasticsearch-mcp-service/src/test/java/com/fdc3/elasticsearchmcp/tool
git commit -m "feat: expose app analytics mcp tools"
```

### Task 6: Documentation and Verification

**Files:**

- Modify: `package.json`
- Modify: `README.md`
- Modify: `services/elasticsearch-mcp-service/README.md`

- [ ] **Step 1: Add workspace scripts if needed**

Document how to run tests and start the service locally.

- [ ] **Step 2: Run the service test suite**

Run: `cd services/elasticsearch-mcp-service && mvn test`
Expected: PASS

- [ ] **Step 3: Run repo-level verification relevant to the change**

Run: `npm test -- --filter=\"./services/elasticsearch-mcp-service\"`
Expected: PASS if the workspace is wired into Turbo execution; otherwise document why service-local Maven verification is the canonical check.

- [ ] **Step 4: Final review**

Confirm:

- no `any`
- no hardcoded schema field names outside configuration defaults
- README covers configuration and sample tool usage

- [ ] **Step 5: Commit**

```bash
git add package.json README.md services/elasticsearch-mcp-service/README.md
git commit -m "docs: document elasticsearch mcp service usage"
```
