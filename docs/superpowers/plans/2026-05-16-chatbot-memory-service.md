# Chatbot Memory Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone SQL-backed memory service for financial markets operator BAU memories and integrate it into `chatbot-backend`.

**Architecture:** Add `services/memory-service` as the persistence owner with SQLite, Flyway migrations, JPA, and REST APIs. Update `chatbot-backend` to consume memory through a typed client, prompt context builder, and memory tool callbacks. Keep schema changes isolated behind Flyway migrations, DTOs, and service-layer mapping.

**Tech Stack:** Java 21, Spring Boot 4.0.6, Spring Web MVC, Spring Data JPA, Flyway, SQLite JDBC, Jackson, Maven, JUnit 5.

---

## File Structure

Create:

- `services/memory-service/package.json` - npm workspace scripts for Maven commands.
- `services/memory-service/pom.xml` - Spring Boot service build.
- `services/memory-service/src/main/java/com/fdc3/memory/MemoryServiceApplication.java` - app entrypoint.
- `services/memory-service/src/main/java/com/fdc3/memory/config/MemoryServiceProperties.java` - default tenant and search limits.
- `services/memory-service/src/main/java/com/fdc3/memory/domain/MemoryEntry.java` - JPA entity.
- `services/memory-service/src/main/java/com/fdc3/memory/domain/MemoryType.java` - memory type enum.
- `services/memory-service/src/main/java/com/fdc3/memory/domain/MemorySource.java` - source enum.
- `services/memory-service/src/main/java/com/fdc3/memory/domain/MemoryStatus.java` - status enum.
- `services/memory-service/src/main/java/com/fdc3/memory/repository/MemoryEntryRepository.java` - JPA queries.
- `services/memory-service/src/main/java/com/fdc3/memory/api/MemoryController.java` - REST API.
- `services/memory-service/src/main/java/com/fdc3/memory/api/MemoryDtos.java` - request/response DTOs.
- `services/memory-service/src/main/java/com/fdc3/memory/api/MemoryExceptionHandler.java` - validation/error responses.
- `services/memory-service/src/main/java/com/fdc3/memory/service/MemoryApplicationService.java` - business logic.
- `services/memory-service/src/main/java/com/fdc3/memory/service/MemoryScope.java` - tenant/user/desk scope object.
- `services/memory-service/src/main/java/com/fdc3/memory/service/JsonFieldMapper.java` - validates and serializes `tags_json` and `attributes_json`.
- `services/memory-service/src/main/resources/application.yml` - SQLite local config and Flyway config.
- `services/memory-service/src/main/resources/application-postgres.yml` - later PostgreSQL profile config.
- `services/memory-service/src/main/resources/db/migration/V1_0_0__memory_schema_init.sql` - initial portable schema.
- `services/memory-service/src/test/java/com/fdc3/memory/service/MemoryApplicationServiceTest.java` - service tests.
- `services/memory-service/src/test/java/com/fdc3/memory/repository/MemoryEntryRepositoryTest.java` - SQLite repository tests.
- `services/memory-service/src/test/java/com/fdc3/memory/api/MemoryControllerTest.java` - controller tests.

Modify:

- `package.json` - add `dev:memory` and include memory service in service dev commands.
- `turbo.json` - add memory service env vars to `globalEnv`.
- `services/chatbot-backend/package.json` - no required change unless adding a memory-specific verification script.
- `services/chatbot-backend/pom.xml` - add `spring-boot-starter-webflux` is already present; no client dependency needed.
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/ChatbotMemoryProperties.java` - switch from file directory to service client config while preserving `enabled`.
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AutoMemoryToolsConfig.java` - replace with service-backed memory config or remove after migration.
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java` - use memory context and service-backed callbacks.
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/MemoryToolsFactory.java` - remove once service callbacks replace AutoMemoryTools.

Create in chatbot backend:

- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryClient.java`
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryDtos.java`
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryContextBuilder.java`
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryToolCallbackFactory.java`
- `services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryContextBuilderTest.java`
- `services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryToolCallbackFactoryTest.java`

## Task 1: Scaffold `memory-service`

**Files:**

- Create: `services/memory-service/package.json`
- Create: `services/memory-service/pom.xml`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/MemoryServiceApplication.java`
- Create: `services/memory-service/src/main/resources/application.yml`

- [ ] **Step 1: Create package scripts**

`services/memory-service/package.json`:

```json
{
  "name": "memory-service",
  "version": "1.0.0",
  "scripts": {
    "build": "mvn -DskipTests clean package",
    "test": "mvn test",
    "dev": "mkdir -p data logs && mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8084 -Dspring.profiles.active=local'"
  }
}
```

- [ ] **Step 2: Create Maven build**

`services/memory-service/pom.xml` should use Spring Boot `4.0.6`, Java `21`, and dependencies:

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
  </dependency>
  <dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.51.0.0</version>
  </dependency>
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.8</version>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

- [ ] **Step 3: Create application entrypoint**

```java
package com.fdc3.memory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class MemoryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MemoryServiceApplication.class, args);
    }
}
```

- [ ] **Step 4: Configure SQLite and Flyway**

`application.yml`:

```yaml
spring:
  application:
    name: memory-service
  datasource:
    url: jdbc:sqlite:./data/memory-service.sqlite
    driver-class-name: org.sqlite.JDBC
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.community.dialect.SQLiteDialect
  flyway:
    enabled: true
    locations: classpath:db/migration

memory:
  default-tenant-id: default
  default-search-limit: 20
  max-search-limit: 100

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

- [ ] **Step 5: Run build to expose missing dependencies**

Run: `npm --workspace services/memory-service run build`

Expected: build may fail if Hibernate SQLite dialect is not available. If it fails with a missing SQLite dialect, add `org.hibernate.orm:hibernate-community-dialects` to `pom.xml` and rerun.

- [ ] **Step 6: Commit scaffold**

```bash
git add services/memory-service/package.json services/memory-service/pom.xml services/memory-service/src/main/java/com/fdc3/memory/MemoryServiceApplication.java services/memory-service/src/main/resources/application.yml
git commit -m "feat: scaffold memory service"
```

## Task 2: Add Portable Schema And Domain Model

**Files:**

- Create: `services/memory-service/src/main/resources/db/migration/V1_0_0__memory_schema_init.sql`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/domain/MemoryEntry.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/domain/MemoryType.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/domain/MemorySource.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/domain/MemoryStatus.java`

- [ ] **Step 1: Write migration first**

```sql
CREATE TABLE memory_entries (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(120) NOT NULL,
    user_id VARCHAR(180) NOT NULL,
    desk VARCHAR(120),
    type VARCHAR(40) NOT NULL,
    title VARCHAR(240) NOT NULL,
    body TEXT NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    source VARCHAR(40) NOT NULL,
    confidence DECIMAL(4,3) NOT NULL DEFAULT 1.000,
    status VARCHAR(40) NOT NULL,
    schema_version INTEGER NOT NULL DEFAULT 1,
    attributes_json TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP
);

CREATE INDEX idx_memory_entries_scope_updated
    ON memory_entries (tenant_id, user_id, status, updated_at);

CREATE INDEX idx_memory_entries_scope_type
    ON memory_entries (tenant_id, user_id, type, status);

CREATE INDEX idx_memory_entries_scope_desk
    ON memory_entries (tenant_id, user_id, desk, status);
```

- [ ] **Step 2: Add enums**

```java
package com.fdc3.memory.domain;

public enum MemoryType {
    PREFERENCE,
    BAU_WORKFLOW,
    WATCHLIST,
    MARKET_CONTEXT,
    INSTRUCTION,
    NOTE
}
```

Create `MemorySource` with `USER`, `ASSISTANT_CONFIRMED`, `ADMIN`.

Create `MemoryStatus` with `ACTIVE`, `ARCHIVED`, `DELETED`.

- [ ] **Step 3: Add entity**

Create `MemoryEntry` with fields matching the migration, `@Enumerated(EnumType.STRING)` for enums, and `@PrePersist/@PreUpdate` methods:

```java
@PrePersist
void onCreate() {
    Instant now = Instant.now();
    if (id == null) id = UUID.randomUUID().toString();
    if (createdAt == null) createdAt = now;
    updatedAt = now;
    if (status == null) status = MemoryStatus.ACTIVE;
    if (source == null) source = MemorySource.USER;
    if (confidence == null) confidence = BigDecimal.ONE;
    if (schemaVersion == null) schemaVersion = 1;
    if (tagsJson == null || tagsJson.isBlank()) tagsJson = "[]";
    if (attributesJson == null || attributesJson.isBlank()) attributesJson = "{}";
}

@PreUpdate
void onUpdate() {
    updatedAt = Instant.now();
}
```

- [ ] **Step 4: Run service tests**

Run: `cd services/memory-service && mvn test`

Expected: Spring context starts and Flyway migration validates.

- [ ] **Step 5: Commit schema and domain**

```bash
git add services/memory-service/src/main/resources/db/migration/V1_0_0__memory_schema_init.sql services/memory-service/src/main/java/com/fdc3/memory/domain
git commit -m "feat: add memory schema and domain model"
```

## Task 3: Implement JSON Field Mapping

**Files:**

- Create: `services/memory-service/src/main/java/com/fdc3/memory/service/JsonFieldMapper.java`
- Create: `services/memory-service/src/test/java/com/fdc3/memory/service/JsonFieldMapperTest.java`

- [ ] **Step 1: Write failing tests**

Test cases:

```java
@Test
void serializesTagsAsStableJsonArray() {
    JsonFieldMapper mapper = new JsonFieldMapper(new ObjectMapper());

    String json = mapper.tagsToJson(List.of("rates", "morning-check", "rates"));

    assertThat(json).isEqualTo("[\"rates\",\"morning-check\"]");
}

@Test
void rejectsNonObjectAttributes() {
    JsonFieldMapper mapper = new JsonFieldMapper(new ObjectMapper());

    assertThatThrownBy(() -> mapper.attributesToJsonString("[1,2]"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("attributes must be a JSON object");
}
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd services/memory-service && mvn -Dtest=JsonFieldMapperTest test`

Expected: fail because `JsonFieldMapper` does not exist.

- [ ] **Step 3: Implement mapper**

Methods:

```java
public String tagsToJson(List<String> tags)
public List<String> tagsFromJson(String json)
public String attributesToJsonString(String rawJson)
public Map<String, Object> attributesFromJson(String json)
```

Rules:

- Trim tags.
- Drop blank tags.
- Deduplicate tags in input order.
- Tags serialize to `[]`.
- Attributes serialize to `{}` when blank.
- Attributes must be a JSON object.

- [ ] **Step 4: Run tests**

Run: `cd services/memory-service && mvn -Dtest=JsonFieldMapperTest test`

Expected: pass.

- [ ] **Step 5: Commit mapper**

```bash
git add services/memory-service/src/main/java/com/fdc3/memory/service/JsonFieldMapper.java services/memory-service/src/test/java/com/fdc3/memory/service/JsonFieldMapperTest.java
git commit -m "test: cover memory json field mapping"
```

## Task 4: Add Repository And Service Layer

**Files:**

- Create: `services/memory-service/src/main/java/com/fdc3/memory/repository/MemoryEntryRepository.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/service/MemoryScope.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/service/MemoryApplicationService.java`
- Create: `services/memory-service/src/test/java/com/fdc3/memory/service/MemoryApplicationServiceTest.java`
- Create: `services/memory-service/src/test/java/com/fdc3/memory/repository/MemoryEntryRepositoryTest.java`

- [ ] **Step 1: Write service tests**

Cover:

- create defaults `status=ACTIVE`, `source=USER`, `confidence=1.000`, `schemaVersion=1`.
- search only returns same `tenantId` and `userId`.
- archive sets `status=ARCHIVED`.
- delete sets `status=DELETED`.
- query text matches title or body case-insensitively.

- [ ] **Step 2: Run tests to verify failure**

Run: `cd services/memory-service && mvn -Dtest=MemoryApplicationServiceTest test`

Expected: fail because service/repository do not exist.

- [ ] **Step 3: Implement repository**

Use portable JPQL:

```java
@Query("""
    select entry from MemoryEntry entry
    where entry.tenantId = :tenantId
      and entry.userId = :userId
      and (:desk is null or entry.desk = :desk)
      and (:type is null or entry.type = :type)
      and entry.status = :status
      and (:q is null or lower(entry.title) like lower(concat('%', :q, '%'))
        or lower(entry.body) like lower(concat('%', :q, '%')))
    order by entry.updatedAt desc
""")
List<MemoryEntry> search(..., Pageable pageable);
```

- [ ] **Step 4: Implement service**

Expose methods:

```java
MemoryEntry create(MemoryScope scope, CreateMemoryCommand command)
List<MemoryEntry> search(MemoryScope scope, SearchMemoryQuery query)
MemoryEntry get(MemoryScope scope, String id)
MemoryEntry update(MemoryScope scope, String id, UpdateMemoryCommand command)
MemoryEntry archive(MemoryScope scope, String id)
void softDelete(MemoryScope scope, String id)
```

Always load by `id`, `tenantId`, and `userId` to prevent cross-user access.

- [ ] **Step 5: Run tests**

Run: `cd services/memory-service && mvn -Dtest=MemoryApplicationServiceTest,MemoryEntryRepositoryTest test`

Expected: pass.

- [ ] **Step 6: Commit service layer**

```bash
git add services/memory-service/src/main/java/com/fdc3/memory/repository services/memory-service/src/main/java/com/fdc3/memory/service services/memory-service/src/test/java/com/fdc3/memory
git commit -m "feat: add memory service persistence layer"
```

## Task 5: Add REST API

**Files:**

- Create: `services/memory-service/src/main/java/com/fdc3/memory/api/MemoryDtos.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/api/MemoryController.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/api/MemoryExceptionHandler.java`
- Create: `services/memory-service/src/main/java/com/fdc3/memory/config/MemoryServiceProperties.java`
- Create: `services/memory-service/src/test/java/com/fdc3/memory/api/MemoryControllerTest.java`

- [ ] **Step 1: Write controller tests**

Cover:

- `POST /api/memory/entries` returns 201 with an id.
- missing `userId` returns 400.
- `GET /api/memory/entries` filters by scope and type.
- `PATCH /api/memory/entries/{id}` updates title/body/tags/attributes.
- archive and delete do not physically remove rows.

- [ ] **Step 2: Run tests to verify failure**

Run: `cd services/memory-service && mvn -Dtest=MemoryControllerTest test`

Expected: fail because controller does not exist.

- [ ] **Step 3: Implement DTOs**

Use Java records:

```java
public record CreateMemoryRequest(
        @NotBlank String tenantId,
        @NotBlank String userId,
        String desk,
        @NotNull MemoryType type,
        @NotBlank String title,
        @NotBlank String body,
        List<String> tags,
        MemorySource source,
        BigDecimal confidence,
        String attributesJson
) {}
```

Define `UpdateMemoryRequest`, `MemoryResponse`, `MemorySearchResponse`, and `FieldErrorResponse`.

- [ ] **Step 4: Implement controller**

Endpoints:

```java
@PostMapping("/api/memory/entries")
ResponseEntity<MemoryResponse> create(@Valid @RequestBody CreateMemoryRequest request)

@GetMapping("/api/memory/entries")
MemorySearchResponse search(...)

@GetMapping("/api/memory/entries/{id}")
MemoryResponse get(...)

@PatchMapping("/api/memory/entries/{id}")
MemoryResponse update(...)

@PostMapping("/api/memory/entries/{id}/archive")
MemoryResponse archive(...)

@DeleteMapping("/api/memory/entries/{id}")
ResponseEntity<Void> delete(...)
```

- [ ] **Step 5: Run controller tests**

Run: `cd services/memory-service && mvn -Dtest=MemoryControllerTest test`

Expected: pass.

- [ ] **Step 6: Commit REST API**

```bash
git add services/memory-service/src/main/java/com/fdc3/memory/api services/memory-service/src/main/java/com/fdc3/memory/config services/memory-service/src/test/java/com/fdc3/memory/api
git commit -m "feat: expose memory service api"
```

## Task 6: Add PostgreSQL Profile And Migration Rules

**Files:**

- Create: `services/memory-service/src/main/resources/application-postgres.yml`
- Create: `services/memory-service/docs/SCHEMA_EVOLUTION.md`

- [ ] **Step 1: Add PostgreSQL profile**

```yaml
spring:
  datasource:
    url: ${MEMORY_DATABASE_URL:jdbc:postgresql://localhost:5432/memory_service}
    username: ${MEMORY_DATABASE_USERNAME:memory_service}
    password: ${MEMORY_DATABASE_PASSWORD:memory_service}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: true
    locations: classpath:db/migration
```

- [ ] **Step 2: Document schema evolution**

`SCHEMA_EVOLUTION.md` must state:

- Never use `ddl-auto=update`.
- Every schema change gets a new Flyway migration.
- Additive migrations are preferred.
- Core query/access-control fields must be columns.
- Optional metadata can use `attributes_json`.
- When changing semantics, increment `schema_version` and add service code that can read older records.

- [ ] **Step 3: Run SQLite tests again**

Run: `cd services/memory-service && mvn test`

Expected: pass.

- [ ] **Step 4: Commit profile and docs**

```bash
git add services/memory-service/src/main/resources/application-postgres.yml services/memory-service/docs/SCHEMA_EVOLUTION.md
git commit -m "docs: define memory schema evolution rules"
```

## Task 7: Add Chatbot Memory Client

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/ChatbotMemoryProperties.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryDtos.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryClient.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryClientTest.java`

- [ ] **Step 1: Write client tests**

Cover:

- search calls `/api/memory/entries` with `tenantId`, `userId`, `desk`, `limit`.
- create posts a `CreateMemoryRequest`.
- unavailable service returns empty search results and logs warning.
- create failure returns a failed result so tool execution can report the error.

- [ ] **Step 2: Run tests to verify failure**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryClientTest test`

Expected: fail because client does not exist.

- [ ] **Step 3: Update properties**

Replace file-directory-specific properties with:

```java
private boolean enabled = true;
private String baseUrl = "http://localhost:8084";
private String tenantId = "default";
private Duration requestTimeout = Duration.ofSeconds(2);
private int contextLimit = 8;
```

Keep the property prefix `chatbot.memory` so existing `chatbot.memory.enabled` still works.

- [ ] **Step 4: Implement client**

Use `WebClient` with configured timeout. Expose:

```java
List<MemoryEntryDto> search(MemorySearchRequest request)
MemoryEntryDto create(CreateMemoryRequest request)
MemoryEntryDto update(String id, UpdateMemoryRequest request)
MemoryEntryDto archive(String tenantId, String userId, String id)
```

Search failures return `List.of()`. Mutating failures throw `MemoryClientException`.

- [ ] **Step 5: Run tests**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryClientTest test`

Expected: pass.

- [ ] **Step 6: Commit client**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/ChatbotMemoryProperties.java services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryClientTest.java
git commit -m "feat: add chatbot memory service client"
```

## Task 8: Replace AutoMemoryTools With Service-Backed Prompt Context

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryContextBuilder.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryContextBuilderTest.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`

- [ ] **Step 1: Write context builder tests**

Expected output format:

```text
Operator memory:
- [PREFERENCE] Prefers concise morning summaries focused on rates and FX.
- [BAU_WORKFLOW] Starts day by checking USD rates blotter, failed trades, and top client RFQs.
```

Tests:

- empty memories return empty string.
- long bodies are truncated to 500 characters.
- archived/deleted memories are never included because client search requests `ACTIVE`.

- [ ] **Step 2: Run tests to verify failure**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryContextBuilderTest test`

Expected: fail because builder does not exist.

- [ ] **Step 3: Implement builder**

```java
public String build(UserCapabilityContext context) {
    List<MemoryEntryDto> memories = memoryClient.search(MemorySearchRequest.active(
            properties.getTenantId(),
            context.getUserId(),
            null,
            properties.getContextLimit()
    ));
    if (memories.isEmpty()) {
        return "";
    }
    return formatMemoryBlock(memories);
}
```

- [ ] **Step 4: Wire into `AgentService`**

In `buildSystemPrompt`, append the memory block after the base behavior instructions when `chatbot.memory.enabled=true`.

If memory lookup fails, continue without memory.

- [ ] **Step 5: Remove file-memory prompt loading**

Delete `loadMemorySystemPrompt()` usage and the classpath `AUTO_MEMORY_TOOLS_SYSTEM_PROMPT.md` dependency from the runtime path. Keep the file only if another test still depends on it; otherwise remove it in Task 10.

- [ ] **Step 6: Run focused tests**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryContextBuilderTest,AgentServiceTest test`

Expected: pass.

- [ ] **Step 7: Commit prompt context integration**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryContextBuilder.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryContextBuilderTest.java
git commit -m "feat: include operator memory in chatbot prompts"
```

## Task 9: Add Service-Backed Memory Tool Callbacks

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryToolCallbackFactory.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryToolCallbackFactoryTest.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`

- [ ] **Step 1: Write callback tests**

Cover callbacks named:

- `MemorySearch`
- `MemoryCreate`
- `MemoryUpdate`
- `MemoryArchive`

Test `MemoryCreate` with:

```json
{
  "type": "PREFERENCE",
  "title": "Morning format",
  "body": "Prefers morning summaries grouped by Rates, FX, Credit.",
  "tags": ["morning", "format"],
  "source": "USER"
}
```

Expected result includes the created memory id and title.

- [ ] **Step 2: Run tests to verify failure**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryToolCallbackFactoryTest test`

Expected: fail because factory does not exist.

- [ ] **Step 3: Implement callback factory**

Each callback must:

- use the current `UserCapabilityContext`.
- pass `tenantId` from `ChatbotMemoryProperties`.
- validate enum values before calling the service.
- return concise JSON results.
- return a user-visible error JSON when service mutation fails.

- [ ] **Step 4: Wire callbacks into `AgentService`**

Replace `buildMemoryToolCallbacks(AutoMemoryTools memoryTools)` usage with service-backed callbacks. Keep the existing memory callback test name or replace it with `AgentServiceMemoryToolCallbackTest` assertions for the new callback names.

- [ ] **Step 5: Run focused tests**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryToolCallbackFactoryTest,AgentServiceMemoryToolCallbackTest test`

Expected: pass.

- [ ] **Step 6: Commit tool callbacks**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/memory/MemoryToolCallbackFactory.java services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/memory/MemoryToolCallbackFactoryTest.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceMemoryToolCallbackTest.java
git commit -m "feat: add service-backed chatbot memory tools"
```

## Task 10: Remove File-Backed Memory Wiring

**Files:**

- Delete: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/MemoryToolsFactory.java`
- Delete or replace: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AutoMemoryToolsConfig.java`
- Modify: `services/chatbot-backend/pom.xml`
- Modify: `services/chatbot-backend/docs/ARCHITECTURE.md`
- Modify: `services/chatbot-backend/docs/PROJECT.md`

- [ ] **Step 1: Remove AutoMemoryTools dependency if no other agent-utils tools require it**

Check:

Run: `rg "AutoMemoryTools|MemoryToolsFactory|spring-ai-agent-utils" services/chatbot-backend/src/main/java services/chatbot-backend/src/test/java services/chatbot-backend/pom.xml`

If `spring-ai-agent-utils` is still needed by other tools, keep the dependency. Remove only memory-specific classes.

- [ ] **Step 2: Update docs**

Document:

- memory is now service-backed.
- local POC uses SQLite at `services/memory-service/data/memory-service.sqlite`.
- `chatbot.memory.base-url` points to memory service.
- full chat transcripts are not stored by the memory service.

- [ ] **Step 3: Run chatbot backend tests**

Run: `cd services/chatbot-backend && mvn test`

Expected: pass.

- [ ] **Step 4: Commit cleanup**

```bash
git add services/chatbot-backend/src/main/java services/chatbot-backend/src/test/java services/chatbot-backend/pom.xml services/chatbot-backend/docs
git commit -m "refactor: remove file-backed chatbot memory"
```

## Task 11: Wire Monorepo Commands And Environment

**Files:**

- Modify: `package.json`
- Modify: `turbo.json`
- Modify: `.env.profile.dev`
- Modify: `.env.profile.stub`
- Modify: `.env.profile.copilot` if present.

- [ ] **Step 1: Add root scripts**

Add:

```json
"dev:memory": "npm --workspace services/memory-service run dev"
```

Update `dev:services` and `dev:services:stub` to include:

```bash
"npm --workspace services/memory-service run dev"
```

- [ ] **Step 2: Add env vars to Turbo**

Add to `globalEnv`:

```json
"CHATBOT_MEMORY_ENABLED",
"CHATBOT_MEMORY_BASE_URL",
"CHATBOT_MEMORY_TENANT_ID",
"MEMORY_DATABASE_URL",
"MEMORY_DATABASE_USERNAME",
"MEMORY_DATABASE_PASSWORD"
```

- [ ] **Step 3: Add local env defaults**

Add:

```bash
CHATBOT_MEMORY_ENABLED=true
CHATBOT_MEMORY_BASE_URL=http://localhost:8084
CHATBOT_MEMORY_TENANT_ID=default
```

- [ ] **Step 4: Run workspace command checks**

Run:

```bash
npm --workspace services/memory-service run test
npm --workspace services/chatbot-backend run build
```

Expected: pass.

- [ ] **Step 5: Commit monorepo wiring**

```bash
git add package.json turbo.json .env.profile.dev .env.profile.stub .env.profile.copilot
git commit -m "chore: wire memory service into local dev"
```

## Task 12: End-To-End Verification

**Files:**

- Create: `services/memory-service/README.md`
- Create: `services/chatbot-backend/docs/MEMORY_SERVICE.md`

- [ ] **Step 1: Start memory service**

Run: `npm --workspace services/memory-service run dev`

Expected: service starts on `http://localhost:8084`.

- [ ] **Step 2: Create a memory with curl**

```bash
curl -s -X POST http://localhost:8084/api/memory/entries \
  -H 'Content-Type: application/json' \
  -d '{
    "tenantId": "default",
    "userId": "operator-1",
    "desk": "rates",
    "type": "PREFERENCE",
    "title": "Morning summary format",
    "body": "Prefers concise BAU summaries grouped by Rates, FX, Credit, then exceptions.",
    "tags": ["morning", "format"],
    "source": "USER",
    "confidence": 1.0,
    "attributesJson": "{\"region\":\"APAC\"}"
  }'
```

Expected: JSON response includes `id`, `status:"ACTIVE"`, and `schemaVersion:1`.

- [ ] **Step 3: Search memory**

```bash
curl -s 'http://localhost:8084/api/memory/entries?tenantId=default&userId=operator-1&type=PREFERENCE&q=morning'
```

Expected: response includes the created `Morning summary format` entry.

- [ ] **Step 4: Start chatbot backend**

Run: `npm --workspace services/chatbot-backend run dev`

Expected: service starts on `http://localhost:8080` and logs memory service base URL.

- [ ] **Step 5: Verify chatbot memory lookup through a focused automated test**

Run: `cd services/chatbot-backend && mvn -Dtest=MemoryContextBuilderTest,MemoryToolCallbackFactoryTest,AgentServiceMemoryToolCallbackTest test`

Expected: pass.

- [ ] **Step 6: Document operator usage**

`MEMORY_SERVICE.md` must include:

- which memory types are allowed.
- examples for preference and BAU workflow.
- reminder that transcripts are not persisted.
- schema evolution rules link to `services/memory-service/docs/SCHEMA_EVOLUTION.md`.

- [ ] **Step 7: Commit docs**

```bash
git add services/memory-service/README.md services/chatbot-backend/docs/MEMORY_SERVICE.md
git commit -m "docs: document chatbot memory service"
```

## Verification Commands

Run before marking complete:

```bash
npm --workspace services/memory-service run test
npm --workspace services/memory-service run build
cd services/chatbot-backend && mvn test
npm run lint
```

If `npm run lint` reports unrelated pre-existing warnings, capture the warning file paths and rerun focused verification for changed Java services.

## Self-Review Checklist

- The memory service stores durable operator BAU memory, not chat transcripts.
- SQLite is the POC datastore.
- PostgreSQL is supported by profile and migration discipline, not a rewrite.
- Schema changes go through Flyway migrations.
- Optional metadata uses `attributes_json`; query-critical fields are columns.
- Chatbot integration fails open for search/context and reports errors for explicit memory mutations.
- Tests cover service, repository, API, client, prompt context, and tool callbacks.
