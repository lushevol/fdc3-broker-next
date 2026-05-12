# RAG Knowledge Base MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a simple, decoupled RAG knowledge base service that chatbot-backend consumes as an MCP tool provider.

**Architecture:** Create a standalone Spring Boot MCP server at `services/rag-knowledge-base-service` on port `8091`. The service owns document loading, chunking, OpenRouter embedding calls, and retrieval through repository interfaces; chatbot-backend only registers it through existing MCP bootstrap config and sees it as normal read-only tools. The POC uses an in-memory vector repository, while the `KnowledgeChunkRepository` boundary and chunk metadata are designed so an Elasticsearch vector adapter can replace the repository later without changing chatbot-backend or MCP tool contracts.

**Tech Stack:** Java 17, Spring Boot, Spring AI MCP server, Spring WebFlux WebClient, Jakarta Validation, JUnit 5, Mockito, AssertJ, OpenRouter embeddings API (`openai/text-embedding-3-small`), in-memory cosine similarity.

---

## Scope And Assumptions

- Build path: `services/rag-knowledge-base-service`.
- MCP endpoint: `http://localhost:8091/api/mcp`.
- Provider id in chatbot: `rag-knowledge-base`.
- Tool source model: MCP-only, no automatic chatbot retrieval middleware.
- First knowledge source: Markdown files in `services/rag-knowledge-base-service/src/main/resources/knowledge/*.md`.
- First retrieval API: `search_knowledge_base(query, topK, namespace)`.
- Embeddings: call `https://openrouter.ai/api/v1/embeddings` with `Authorization: Bearer ${OPENROUTER_API_KEY}`, model `openai/text-embedding-3-small`, `encoding_format: float`.
- Local dev should be able to start with `npm run dev:stub` using deterministic fake embeddings if `OPENROUTER_API_KEY` is not set.
- Initial indexing must start after `ApplicationReadyEvent` on a dedicated embedding executor. Startup must not fail just because OpenRouter is temporarily unavailable.
- Request-time embeddings must use the same embedding provider as indexed chunks, run on the dedicated embedding executor, and have a bounded wait timeout. Do not fall back from OpenRouter query embeddings to deterministic embeddings because that mixes vector spaces and corrupts similarity scores.
- Elasticsearch migration is prepared by interfaces, metadata, config naming, and repository tests; the actual Elasticsearch vector repository is outside this POC unless explicitly requested.

## File Structure

- Create `services/rag-knowledge-base-service/package.json`: npm workspace scripts.
- Create `services/rag-knowledge-base-service/pom.xml`: Spring Boot service dependencies.
- Create `services/rag-knowledge-base-service/AGENTS.md`: service-local guidance.
- Create `services/rag-knowledge-base-service/README.md`: local run, env, MCP usage.
- Create `services/rag-knowledge-base-service/src/main/resources/application.yml`: port, MCP server config, embedding/store config.
- Create `services/rag-knowledge-base-service/src/main/resources/knowledge/mfe-chatbot.md`: small seed document for demo retrieval.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/RagKnowledgeBaseApplication.java`: app entry point.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/config/RagProperties.java`: typed properties.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/config/EmbeddingExecutorConfig.java`: bounded executor for indexing and query embedding calls.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding/EmbeddingClient.java`: embedding interface.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding/OpenRouterEmbeddingClient.java`: production HTTP embedding client.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding/DeterministicEmbeddingClient.java`: local/test fallback.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeDocument.java`: raw loaded document.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeChunk.java`: chunk model with vector metadata.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeDocumentLoader.java`: loads Markdown resources.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/MarkdownKnowledgeDocumentLoader.java`: resource implementation.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeChunker.java`: chunking interface.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/SimpleMarkdownChunker.java`: heading-aware chunking.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/repository/KnowledgeChunkRepository.java`: repository interface.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/repository/InMemoryKnowledgeChunkRepository.java`: cosine search repository.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/service/KnowledgeBaseIndexService.java`: startup ingestion and indexing.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/service/KnowledgeSearchService.java`: embeds query and searches repository.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool/KnowledgeBaseMcpTools.java`: MCP tool wrapper.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool/model/KnowledgeSearchResponse.java`: response record.
- Create `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool/model/KnowledgeSearchResult.java`: result record.
- Modify `services/chatbot-backend/src/main/resources/application.yml`: add disabled RAG MCP provider.
- Modify `services/chatbot-backend/package.json`: add `dev:with-rag-mcp`.
- Modify root `package.json`: add optional `dev:rag` script.
- Modify `turbo.json`: add OpenRouter and RAG env vars to `globalEnv`.
- Test files mirror production packages under `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/**`.

---

### Task 1: Scaffold The RAG MCP Service

**Files:**
- Create: `services/rag-knowledge-base-service/package.json`
- Create: `services/rag-knowledge-base-service/pom.xml`
- Create: `services/rag-knowledge-base-service/AGENTS.md`
- Create: `services/rag-knowledge-base-service/README.md`
- Create: `services/rag-knowledge-base-service/src/main/resources/application.yml`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/RagKnowledgeBaseApplication.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/RagKnowledgeBaseApplicationTests.java`

- [ ] **Step 1: Write the application context test**

```java
package com.fdc3.rag;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "rag.embedding.provider=deterministic",
        "rag.ingestion.enabled=false"
})
class RagKnowledgeBaseApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

- [ ] **Step 2: Run the test and verify it fails because the service does not exist**

Run:

```bash
cd services/rag-knowledge-base-service && npm run test
```

Expected: FAIL with missing workspace/package or Maven project.

- [ ] **Step 3: Add `package.json`**

```json
{
  "name": "rag-knowledge-base-service",
  "version": "1.0.0",
  "scripts": {
    "build": "mvn -DskipTests clean package",
    "test": "mvn test",
    "dev": "mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8091'",
    "dev:stub": "cross-env RAG_EMBEDDING_PROVIDER=deterministic mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8091'"
  }
}
```

- [ ] **Step 4: Add `pom.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.14</version>
        <relativePath />
    </parent>

    <groupId>com.fdc3</groupId>
    <artifactId>rag-knowledge-base-service</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>rag-knowledge-base-service</name>
    <description>Standalone MCP RAG knowledge base service</description>

    <properties>
        <java.version>17</java.version>
        <spring-ai.version>1.1.3</spring-ai.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.squareup.okhttp3</groupId>
            <artifactId>mockwebserver</artifactId>
            <version>4.12.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>rag-knowledge-base-service</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 5: Add application entry point**

```java
package com.fdc3.rag;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class RagKnowledgeBaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(RagKnowledgeBaseApplication.class, args);
    }
}
```

- [ ] **Step 6: Add `application.yml`**

```yaml
server:
  port: 8091

spring:
  application:
    name: rag-knowledge-base-service
  ai:
    mcp:
      server:
        name: rag-knowledge-base-service
        version: 0.0.1
        type: SYNC
        protocol: STREAMABLE
        instructions: 'Provides read-only retrieval over local knowledge base documents'
        capabilities:
          tool: true
          resource: false
        streamable-http:
          mcp-endpoint: /api/mcp

management:
  endpoints:
    web:
      exposure:
        include: health,info

rag:
  ingestion:
    enabled: ${RAG_INGESTION_ENABLED:true}
    resource-pattern: ${RAG_KNOWLEDGE_RESOURCE_PATTERN:classpath:/knowledge/*.md}
  chunking:
    max-chars: ${RAG_CHUNK_MAX_CHARS:1200}
    overlap-chars: ${RAG_CHUNK_OVERLAP_CHARS:160}
  embedding:
    provider: ${RAG_EMBEDDING_PROVIDER:openrouter}
    openrouter:
      api-key: ${OPENROUTER_API_KEY:}
      base-url: ${OPENROUTER_BASE_URL:https://openrouter.ai/api/v1}
      model: ${OPENROUTER_EMBEDDING_MODEL:openai/text-embedding-3-small}
      timeout-millis: ${OPENROUTER_EMBEDDING_TIMEOUT_MILLIS:30000}
  search:
    default-top-k: ${RAG_SEARCH_DEFAULT_TOP_K:5}
    max-top-k: ${RAG_SEARCH_MAX_TOP_K:10}
    embedding-timeout-millis: ${RAG_SEARCH_EMBEDDING_TIMEOUT_MILLIS:30000}
  executor:
    core-pool-size: ${RAG_EMBEDDING_EXECUTOR_CORE_POOL_SIZE:2}
    max-pool-size: ${RAG_EMBEDDING_EXECUTOR_MAX_POOL_SIZE:4}
    queue-capacity: ${RAG_EMBEDDING_EXECUTOR_QUEUE_CAPACITY:32}

logging:
  level:
    root: INFO
    com.fdc3.rag: DEBUG
```

- [ ] **Step 7: Add service docs**

`AGENTS.md`:

```markdown
# rag-knowledge-base-service

Spring Boot MCP service for read-only RAG retrieval (port 8091). See root `AGENTS.md` for monorepo-wide context.

## Commands

```bash
npm run dev       # Start with OpenRouter embeddings
npm run dev:stub  # Start with deterministic local embeddings
npm run test      # Maven tests
npm run build     # Maven package, skips tests
```

## Important

- Keep chatbot-backend decoupled; expose capabilities through MCP tools only.
- Keep vector storage behind `KnowledgeChunkRepository` so Elasticsearch can replace the in-memory implementation later.
- Never log embedding API keys or full document contents.
```

`README.md`:

```markdown
# RAG Knowledge Base Service

Standalone MCP server that exposes read-only knowledge retrieval to chatbot-backend.

## Local Run

```bash
cd services/rag-knowledge-base-service
npm run dev:stub
```

For OpenRouter embeddings:

```bash
export OPENROUTER_API_KEY=...
npm run dev
```

MCP endpoint:

```text
http://localhost:8091/api/mcp
```

## Chatbot Integration

Set:

```bash
CHATBOT_MCP_RAG_ENABLED=true
CHATBOT_MCP_RAG_URL=http://localhost:8091/api/mcp
CHATBOT_SECURITY_ADDITIONAL_PROFILES=advisor
```
```

- [ ] **Step 8: Run context test**

Run:

```bash
cd services/rag-knowledge-base-service && npm run test
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add services/rag-knowledge-base-service
git commit -m "feat: scaffold rag knowledge base mcp service"
```

---

### Task 2: Add Typed Configuration

**Files:**
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/config/RagProperties.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/config/EmbeddingExecutorConfig.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/config/RagPropertiesTest.java`

- [ ] **Step 1: Write configuration binding test**

```java
package com.fdc3.rag.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.context.properties.source.ConfigurationPropertySources;
import org.springframework.mock.env.MockEnvironment;

import static org.assertj.core.api.Assertions.assertThat;

class RagPropertiesTest {

    @Test
    void bindsRagProperties() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("rag.ingestion.enabled", "true")
                .withProperty("rag.ingestion.resource-pattern", "classpath:/knowledge/*.md")
                .withProperty("rag.chunking.max-chars", "900")
                .withProperty("rag.chunking.overlap-chars", "120")
                .withProperty("rag.embedding.provider", "openrouter")
                .withProperty("rag.embedding.openrouter.api-key", "secret")
                .withProperty("rag.embedding.openrouter.base-url", "http://localhost:9999")
                .withProperty("rag.embedding.openrouter.model", "openai/text-embedding-3-small")
                .withProperty("rag.embedding.openrouter.timeout-millis", "5000")
                .withProperty("rag.search.default-top-k", "4")
                .withProperty("rag.search.max-top-k", "8")
                .withProperty("rag.search.embedding-timeout-millis", "3000")
                .withProperty("rag.executor.core-pool-size", "2")
                .withProperty("rag.executor.max-pool-size", "4")
                .withProperty("rag.executor.queue-capacity", "16");

        Binder binder = new Binder(ConfigurationPropertySources.from(environment.getPropertySources()));
        RagProperties properties = binder.bind("rag", Bindable.of(RagProperties.class)).get();

        assertThat(properties.ingestion().enabled()).isTrue();
        assertThat(properties.ingestion().resourcePattern()).isEqualTo("classpath:/knowledge/*.md");
        assertThat(properties.chunking().maxChars()).isEqualTo(900);
        assertThat(properties.chunking().overlapChars()).isEqualTo(120);
        assertThat(properties.embedding().provider()).isEqualTo("openrouter");
        assertThat(properties.embedding().openrouter().apiKey()).isEqualTo("secret");
        assertThat(properties.embedding().openrouter().baseUrl()).isEqualTo("http://localhost:9999");
        assertThat(properties.embedding().openrouter().model()).isEqualTo("openai/text-embedding-3-small");
        assertThat(properties.embedding().openrouter().timeoutMillis()).isEqualTo(5000);
        assertThat(properties.search().defaultTopK()).isEqualTo(4);
        assertThat(properties.search().maxTopK()).isEqualTo(8);
        assertThat(properties.search().embeddingTimeoutMillis()).isEqualTo(3000);
        assertThat(properties.executor().corePoolSize()).isEqualTo(2);
        assertThat(properties.executor().maxPoolSize()).isEqualTo(4);
        assertThat(properties.executor().queueCapacity()).isEqualTo(16);
    }
}
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=RagPropertiesTest test
```

Expected: FAIL because `RagProperties` does not exist.

- [ ] **Step 3: Implement properties record**

```java
package com.fdc3.rag.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rag")
public record RagProperties(
        Ingestion ingestion,
        Chunking chunking,
        Embedding embedding,
        Search search,
        Executor executor
) {
    public record Ingestion(boolean enabled, String resourcePattern) {
    }

    public record Chunking(int maxChars, int overlapChars) {
    }

    public record Embedding(String provider, OpenRouter openrouter) {
    }

    public record OpenRouter(String apiKey, String baseUrl, String model, int timeoutMillis) {
    }

    public record Search(int defaultTopK, int maxTopK, long embeddingTimeoutMillis) {
    }

    public record Executor(int corePoolSize, int maxPoolSize, int queueCapacity) {
    }
}
```

- [ ] **Step 4: Add embedding executor config**

```java
package com.fdc3.rag.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class EmbeddingExecutorConfig {

    @Bean(name = "ragEmbeddingExecutor")
    public ThreadPoolTaskExecutor ragEmbeddingExecutor(RagProperties properties) {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("rag-embedding-");
        executor.setCorePoolSize(properties.executor().corePoolSize());
        executor.setMaxPoolSize(properties.executor().maxPoolSize());
        executor.setQueueCapacity(properties.executor().queueCapacity());
        executor.initialize();
        return executor;
    }
}
```

- [ ] **Step 5: Run test**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=RagPropertiesTest test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/config services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/config/RagPropertiesTest.java
git commit -m "feat: add rag service configuration properties"
```

---

### Task 3: Implement Embedding Clients

**Files:**
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding/EmbeddingClient.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding/OpenRouterEmbeddingClient.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding/DeterministicEmbeddingClient.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/embedding/DeterministicEmbeddingClientTest.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/embedding/OpenRouterEmbeddingClientTest.java`

- [ ] **Step 1: Write deterministic embedding tests**

```java
package com.fdc3.rag.embedding;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DeterministicEmbeddingClientTest {

    @Test
    void returnsStableNormalizedVectors() {
        DeterministicEmbeddingClient client = new DeterministicEmbeddingClient();

        List<Double> first = client.embed("Single-SPA loads micro frontends").block();
        List<Double> second = client.embed("Single-SPA loads micro frontends").block();

        assertThat(first).hasSize(64);
        assertThat(first).isEqualTo(second);
        assertThat(first).allSatisfy(value -> assertThat(value).isBetween(-1.0, 1.0));
    }

    @Test
    void supportsBatchEmbeddings() {
        DeterministicEmbeddingClient client = new DeterministicEmbeddingClient();

        List<List<Double>> vectors = client.embedAll(List.of("alpha", "beta")).block();

        assertThat(vectors).hasSize(2);
        assertThat(vectors.get(0)).hasSize(64);
        assertThat(vectors.get(1)).hasSize(64);
        assertThat(vectors.get(0)).isNotEqualTo(vectors.get(1));
    }
}
```

- [ ] **Step 2: Write OpenRouter request/response test**

```java
package com.fdc3.rag.embedding;

import com.fdc3.rag.config.RagProperties;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class OpenRouterEmbeddingClientTest {

    @Test
    void callsOpenRouterEmbeddingEndpoint() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.enqueue(new MockResponse()
                    .setResponseCode(200)
                    .setBody("""
                            {
                              "data": [
                                { "embedding": [0.1, 0.2, 0.3] }
                              ]
                            }
                            """)
                    .addHeader("Content-Type", "application/json")
            );

            RagProperties.OpenRouter properties = new RagProperties.OpenRouter(
                    "test-key",
                    server.url("/api/v1").toString().replaceAll("/$", ""),
                    "openai/text-embedding-3-small",
                    5000
            );
            OpenRouterEmbeddingClient client = new OpenRouterEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("Your text string goes here").block();

            assertThat(embedding).containsExactly(0.1, 0.2, 0.3);
            RecordedRequest request = server.takeRequest();
            assertThat(request.getPath()).isEqualTo("/api/v1/embeddings");
            assertThat(request.getHeaders().get("Authorization")).isEqualTo("Bearer test-key");
            assertThat(request.getBody().readUtf8())
                    .contains("\"model\":\"openai/text-embedding-3-small\"")
                    .contains("\"input\":\"Your text string goes here\"")
                    .contains("\"encoding_format\":\"float\"");
        }
    }

    @Test
    void supportsBatchInput() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.enqueue(new MockResponse()
                    .setResponseCode(200)
                    .setBody("""
                            {
                              "data": [
                                { "embedding": [0.1, 0.2] },
                                { "embedding": [0.3, 0.4] }
                              ]
                            }
                            """)
                    .addHeader("Content-Type", "application/json")
            );

            RagProperties.OpenRouter properties = new RagProperties.OpenRouter(
                    "test-key",
                    server.url("/api/v1").toString().replaceAll("/$", ""),
                    "openai/text-embedding-3-small",
                    5000
            );
            OpenRouterEmbeddingClient client = new OpenRouterEmbeddingClient(WebClient.builder(), properties);

            List<List<Double>> embeddings = client.embedAll(List.of("text1", "text2")).block();

            assertThat(embeddings).containsExactly(List.of(0.1, 0.2), List.of(0.3, 0.4));
            assertThat(server.takeRequest().getBody().readUtf8()).contains("\"input\":[\"text1\",\"text2\"]");
        }
    }

    @Test
    void retriesTransientOpenRouterFailures() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.enqueue(new MockResponse().setResponseCode(503).setBody("temporarily unavailable"));
            server.enqueue(new MockResponse()
                    .setResponseCode(200)
                    .setBody("""
                            {
                              "data": [
                                { "embedding": [0.5, 0.6] }
                              ]
                            }
                            """)
                    .addHeader("Content-Type", "application/json")
            );

            RagProperties.OpenRouter properties = new RagProperties.OpenRouter(
                    "test-key",
                    server.url("/api/v1").toString().replaceAll("/$", ""),
                    "openai/text-embedding-3-small",
                    5000
            );
            OpenRouterEmbeddingClient client = new OpenRouterEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("retry me").block();

            assertThat(embedding).containsExactly(0.5, 0.6);
            assertThat(server.getRequestCount()).isEqualTo(2);
        }
    }
}
```

- [ ] **Step 3: Run tests and verify they fail**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=DeterministicEmbeddingClientTest,OpenRouterEmbeddingClientTest test
```

Expected: FAIL because embedding classes do not exist.

- [ ] **Step 4: Add `EmbeddingClient`**

```java
package com.fdc3.rag.embedding;

import reactor.core.publisher.Mono;

import java.util.List;

public interface EmbeddingClient {

    Mono<List<Double>> embed(String input);

    Mono<List<List<Double>>> embedAll(List<String> inputs);
}
```

- [ ] **Step 5: Add deterministic client**

```java
package com.fdc3.rag.embedding;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

@Component
@ConditionalOnProperty(prefix = "rag.embedding", name = "provider", havingValue = "deterministic")
public class DeterministicEmbeddingClient implements EmbeddingClient {

    private static final int DIMENSIONS = 64;

    @Override
    public Mono<List<Double>> embed(String input) {
        return Mono.fromSupplier(() -> vectorFor(input == null ? "" : input));
    }

    @Override
    public Mono<List<List<Double>>> embedAll(List<String> inputs) {
        return Mono.fromSupplier(() -> inputs.stream().map(value -> vectorFor(value == null ? "" : value)).toList());
    }

    private List<Double> vectorFor(String input) {
        byte[] digest = digest(input);
        List<Double> vector = new ArrayList<>(DIMENSIONS);
        for (int index = 0; index < DIMENSIONS; index++) {
            int value = digest[index % digest.length] & 0xff;
            vector.add((value / 127.5) - 1.0);
        }
        return vector;
    }

    private byte[] digest(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(input.getBytes(StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to create deterministic embedding.", exception);
        }
    }
}
```

- [ ] **Step 6: Add OpenRouter client**

```java
package com.fdc3.rag.embedding;

import com.fdc3.rag.config.RagProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(prefix = "rag.embedding", name = "provider", havingValue = "openrouter", matchIfMissing = true)
public class OpenRouterEmbeddingClient implements EmbeddingClient {

    private final WebClient webClient;
    private final RagProperties.OpenRouter properties;

    public OpenRouterEmbeddingClient(WebClient.Builder webClientBuilder, RagProperties properties) {
        this(webClientBuilder, properties.embedding().openrouter());
    }

    OpenRouterEmbeddingClient(WebClient.Builder webClientBuilder, RagProperties.OpenRouter properties) {
        this.webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
        this.properties = properties;
    }

    @Override
    public Mono<List<Double>> embed(String input) {
        return embedRequest(input).map(response -> response.data().get(0).embedding());
    }

    @Override
    public Mono<List<List<Double>>> embedAll(List<String> inputs) {
        return embedRequest(inputs).map(response -> response.data().stream()
                .map(OpenRouterEmbeddingResponse.Item::embedding)
                .toList());
    }

    private Mono<OpenRouterEmbeddingResponse> embedRequest(Object input) {
        if (properties.apiKey() == null || properties.apiKey().isBlank()) {
            return Mono.error(new IllegalStateException("OPENROUTER_API_KEY is required when rag.embedding.provider=openrouter"));
        }
        Map<String, Object> body = Map.of(
                "model", properties.model(),
                "input", input,
                "encoding_format", "float"
        );
        return webClient.post()
                .uri("/embeddings")
                .header("Authorization", "Bearer " + properties.apiKey())
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(OpenRouterEmbeddingResponse.class)
                .timeout(Duration.ofMillis(properties.timeoutMillis()))
                .retryWhen(Retry.backoff(2, Duration.ofMillis(250))
                        .filter(this::isRetryable));
    }

    private boolean isRetryable(Throwable throwable) {
        if (throwable instanceof WebClientResponseException responseException) {
            return responseException.getStatusCode().is5xxServerError()
                    || responseException.getStatusCode().value() == 429;
        }
        return !(throwable instanceof IllegalStateException);
    }

    record OpenRouterEmbeddingResponse(List<Item> data) {
        record Item(List<Double> embedding) {
        }
    }
}
```

- [ ] **Step 7: Run embedding tests**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=DeterministicEmbeddingClientTest,OpenRouterEmbeddingClientTest test
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/embedding services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/embedding
git commit -m "feat: add openrouter embedding clients"
```

---

### Task 4: Add Document Loading And Chunking

**Files:**
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeDocument.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeChunk.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeDocumentLoader.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/MarkdownKnowledgeDocumentLoader.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/KnowledgeChunker.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest/SimpleMarkdownChunker.java`
- Create: `services/rag-knowledge-base-service/src/main/resources/knowledge/mfe-chatbot.md`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/ingest/SimpleMarkdownChunkerTest.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/ingest/MarkdownKnowledgeDocumentLoaderTest.java`
- Test resource: `services/rag-knowledge-base-service/src/test/resources/knowledge/test-doc.md`

- [ ] **Step 1: Write chunker test**

```java
package com.fdc3.rag.ingest;

import com.fdc3.rag.config.RagProperties;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class SimpleMarkdownChunkerTest {

    @Test
    void splitsMarkdownIntoMetadataRichChunks() {
        SimpleMarkdownChunker chunker = new SimpleMarkdownChunker(new RagProperties.Chunking(120, 20));
        KnowledgeDocument document = new KnowledgeDocument(
                "mfe-chatbot",
                "MFE Chatbot",
                "advisor",
                "# Chatbot\n\nThe chatbot uses MCP tools.\n\n## RAG\n\nRAG retrieval is provided by a standalone service.",
                Map.of("source", "test")
        );

        List<KnowledgeChunk> chunks = chunker.chunk(document);

        assertThat(chunks).isNotEmpty();
        assertThat(chunks.get(0).documentId()).isEqualTo("mfe-chatbot");
        assertThat(chunks.get(0).namespace()).isEqualTo("advisor");
        assertThat(chunks.get(0).title()).isEqualTo("MFE Chatbot");
        assertThat(chunks.get(0).text()).contains("chatbot uses MCP tools");
        assertThat(chunks.get(0).metadata()).containsEntry("source", "test");
    }
}
```

- [ ] **Step 2: Write loader test**

```java
package com.fdc3.rag.ingest;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import static org.assertj.core.api.Assertions.assertThat;

class MarkdownKnowledgeDocumentLoaderTest {

    @Test
    void loadsMarkdownResources() {
        MarkdownKnowledgeDocumentLoader loader = new MarkdownKnowledgeDocumentLoader(
                new PathMatchingResourcePatternResolver(),
                "classpath:/knowledge/test-*.md"
        );

        assertThat(loader.load()).singleElement().satisfies(document -> {
            assertThat(document.id()).isEqualTo("test-doc");
            assertThat(document.title()).isEqualTo("Test Doc");
            assertThat(document.namespace()).isEqualTo("default");
            assertThat(document.text()).contains("RAG test content");
        });
    }
}
```

- [ ] **Step 3: Add test resource**

```markdown
---
title: Test Doc
namespace: default
---

# Test Doc

RAG test content for loader verification.
```

- [ ] **Step 4: Run tests and verify they fail**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=SimpleMarkdownChunkerTest,MarkdownKnowledgeDocumentLoaderTest test
```

Expected: FAIL because ingest classes do not exist.

- [ ] **Step 5: Add document and chunk records**

```java
package com.fdc3.rag.ingest;

import java.util.Map;

public record KnowledgeDocument(
        String id,
        String title,
        String namespace,
        String text,
        Map<String, String> metadata
) {
}
```

```java
package com.fdc3.rag.ingest;

import java.util.List;
import java.util.Map;

public record KnowledgeChunk(
        String id,
        String documentId,
        String title,
        String namespace,
        String text,
        Map<String, String> metadata,
        List<Double> embedding
) {
    public KnowledgeChunk withEmbedding(List<Double> vector) {
        return new KnowledgeChunk(id, documentId, title, namespace, text, metadata, vector);
    }
}
```

- [ ] **Step 6: Add loader and chunker interfaces**

```java
package com.fdc3.rag.ingest;

import java.util.List;

public interface KnowledgeDocumentLoader {

    List<KnowledgeDocument> load();
}
```

```java
package com.fdc3.rag.ingest;

import java.util.List;

public interface KnowledgeChunker {

    List<KnowledgeChunk> chunk(KnowledgeDocument document);
}
```

- [ ] **Step 7: Add Markdown loader**

```java
package com.fdc3.rag.ingest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class MarkdownKnowledgeDocumentLoader implements KnowledgeDocumentLoader {

    private final ResourcePatternResolver resolver;
    private final String resourcePattern;

    public MarkdownKnowledgeDocumentLoader(
            ResourcePatternResolver resolver,
            @Value("${rag.ingestion.resource-pattern}") String resourcePattern
    ) {
        this.resolver = resolver;
        this.resourcePattern = resourcePattern;
    }

    @Override
    public List<KnowledgeDocument> load() {
        try {
            Resource[] resources = resolver.getResources(resourcePattern);
            return java.util.Arrays.stream(resources).map(this::loadResource).toList();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to load knowledge documents.", exception);
        }
    }

    private KnowledgeDocument loadResource(Resource resource) {
        try {
            String filename = resource.getFilename() == null ? "knowledge" : resource.getFilename();
            String id = filename.replaceFirst("\\.md$", "");
            String rawText = resource.getContentAsString(StandardCharsets.UTF_8);
            ParsedFrontMatter parsed = parseFrontMatter(rawText);
            String title = parsed.metadata().getOrDefault("title", id);
            String namespace = parsed.metadata().getOrDefault("namespace", "default");
            return new KnowledgeDocument(id, title, namespace, parsed.body(), parsed.metadata());
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to load knowledge resource " + resource, exception);
        }
    }

    private ParsedFrontMatter parseFrontMatter(String rawText) {
        if (!rawText.startsWith("---")) {
            return new ParsedFrontMatter(Map.of(), rawText);
        }
        int closing = rawText.indexOf("\n---", 3);
        if (closing < 0) {
            return new ParsedFrontMatter(Map.of(), rawText);
        }
        String frontMatter = rawText.substring(3, closing).trim();
        String body = rawText.substring(closing + 4).trim();
        Map<String, String> metadata = new LinkedHashMap<>();
        for (String line : frontMatter.split("\\R")) {
            int separator = line.indexOf(':');
            if (separator > 0) {
                metadata.put(line.substring(0, separator).trim(), line.substring(separator + 1).trim());
            }
        }
        return new ParsedFrontMatter(Map.copyOf(metadata), body);
    }

    private record ParsedFrontMatter(Map<String, String> metadata, String body) {
    }
}
```

- [ ] **Step 8: Add simple chunker**

```java
package com.fdc3.rag.ingest;

import com.fdc3.rag.config.RagProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SimpleMarkdownChunker implements KnowledgeChunker {

    private final RagProperties.Chunking properties;

    public SimpleMarkdownChunker(RagProperties properties) {
        this(properties.chunking());
    }

    SimpleMarkdownChunker(RagProperties.Chunking properties) {
        this.properties = properties;
    }

    @Override
    public List<KnowledgeChunk> chunk(KnowledgeDocument document) {
        String normalized = document.text().replaceAll("\\R{3,}", "\n\n").trim();
        List<KnowledgeChunk> chunks = new ArrayList<>();
        int start = 0;
        int index = 1;
        while (start < normalized.length()) {
            int end = Math.min(normalized.length(), start + properties.maxChars());
            if (end < normalized.length()) {
                int paragraphBreak = normalized.lastIndexOf("\n\n", end);
                if (paragraphBreak > start) {
                    end = paragraphBreak;
                }
            }
            String text = normalized.substring(start, end).trim();
            if (!text.isBlank()) {
                chunks.add(new KnowledgeChunk(
                        document.id() + "#" + index,
                        document.id(),
                        document.title(),
                        document.namespace(),
                        text,
                        document.metadata(),
                        List.of()
                ));
                index++;
            }
            if (end >= normalized.length()) {
                break;
            }
            start = Math.max(end - properties.overlapChars(), start + 1);
        }
        return List.copyOf(chunks);
    }
}
```

- [ ] **Step 9: Add seed knowledge file**

```markdown
---
title: MFE Chatbot And MCP
namespace: advisor
---

# MFE Chatbot And MCP

The chatbot-backend is a Spring Boot service that streams assistant responses and exposes tool lifecycle events through the chat protocol.

## MCP Providers

Remote MCP providers are registered into chatbot-backend through `chatbot.mcp.providers`. Once registered, their tools are resolved through `ToolRegistry` and can be used by the agent as read-only backend capabilities.

## RAG Knowledge Base

The RAG knowledge base service should stay decoupled from chatbot-backend. It exposes retrieval as MCP tools, owns document ingestion and embeddings, and can move from in-memory vector search to Elasticsearch vector search without changing chatbot-backend.
```

- [ ] **Step 10: Run ingest tests**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=SimpleMarkdownChunkerTest,MarkdownKnowledgeDocumentLoaderTest test
```

Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/ingest services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/ingest services/rag-knowledge-base-service/src/main/resources/knowledge services/rag-knowledge-base-service/src/test/resources/knowledge
git commit -m "feat: add markdown knowledge ingestion"
```

---

### Task 5: Implement In-Memory Vector Repository

**Files:**
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/repository/KnowledgeChunkRepository.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/repository/InMemoryKnowledgeChunkRepository.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/repository/InMemoryKnowledgeChunkRepositoryTest.java`

- [ ] **Step 1: Write repository test**

```java
package com.fdc3.rag.repository;

import com.fdc3.rag.ingest.KnowledgeChunk;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class InMemoryKnowledgeChunkRepositoryTest {

    @Test
    void searchesByCosineSimilarityAndNamespace() {
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        repository.replaceAll(List.of(
                chunk("one", "advisor", "MCP tools", List.of(1.0, 0.0)),
                chunk("two", "advisor", "Weather", List.of(0.0, 1.0)),
                chunk("three", "admin", "MCP admin", List.of(1.0, 0.0))
        ));

        List<KnowledgeChunkRepository.ScoredKnowledgeChunk> results =
                repository.search(List.of(1.0, 0.0), "advisor", 2);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).chunk().id()).isEqualTo("one");
        assertThat(results.get(0).score()).isEqualTo(1.0);
        assertThat(results.get(1).chunk().id()).isEqualTo("two");
    }

    private KnowledgeChunk chunk(String id, String namespace, String text, List<Double> vector) {
        return new KnowledgeChunk(id, "doc", "Doc", namespace, text, Map.of(), vector);
    }
}
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=InMemoryKnowledgeChunkRepositoryTest test
```

Expected: FAIL because repository classes do not exist.

- [ ] **Step 3: Add repository interface**

```java
package com.fdc3.rag.repository;

import com.fdc3.rag.ingest.KnowledgeChunk;

import java.util.List;

public interface KnowledgeChunkRepository {

    void replaceAll(List<KnowledgeChunk> chunks);

    List<ScoredKnowledgeChunk> search(List<Double> queryEmbedding, String namespace, int topK);

    int size();

    record ScoredKnowledgeChunk(KnowledgeChunk chunk, double score) {
    }
}
```

- [ ] **Step 4: Add in-memory implementation**

```java
package com.fdc3.rag.repository;

import com.fdc3.rag.ingest.KnowledgeChunk;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Repository
public class InMemoryKnowledgeChunkRepository implements KnowledgeChunkRepository {

    private final AtomicReference<List<KnowledgeChunk>> chunks = new AtomicReference<>(List.of());

    @Override
    public void replaceAll(List<KnowledgeChunk> chunks) {
        this.chunks.set(List.copyOf(chunks));
    }

    @Override
    public List<ScoredKnowledgeChunk> search(List<Double> queryEmbedding, String namespace, int topK) {
        String normalizedNamespace = namespace == null || namespace.isBlank() ? null : namespace.trim();
        return chunks.get().stream()
                .filter(chunk -> normalizedNamespace == null || normalizedNamespace.equals(chunk.namespace()))
                .map(chunk -> new ScoredKnowledgeChunk(chunk, cosine(queryEmbedding, chunk.embedding())))
                .sorted(Comparator.comparingDouble(ScoredKnowledgeChunk::score).reversed())
                .limit(topK)
                .toList();
    }

    @Override
    public int size() {
        return chunks.get().size();
    }

    private double cosine(List<Double> left, List<Double> right) {
        if (left == null || right == null || left.isEmpty() || right.isEmpty()) {
            return 0.0;
        }
        int length = Math.min(left.size(), right.size());
        double dot = 0.0;
        double leftNorm = 0.0;
        double rightNorm = 0.0;
        for (int index = 0; index < length; index++) {
            double leftValue = left.get(index);
            double rightValue = right.get(index);
            dot += leftValue * rightValue;
            leftNorm += leftValue * leftValue;
            rightNorm += rightValue * rightValue;
        }
        if (leftNorm == 0.0 || rightNorm == 0.0) {
            return 0.0;
        }
        return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
    }
}
```

- [ ] **Step 5: Run repository test**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=InMemoryKnowledgeChunkRepositoryTest test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/repository services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/repository
git commit -m "feat: add in-memory knowledge vector repository"
```

---

### Task 6: Add Indexing And Search Services

**Files:**
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/service/KnowledgeBaseIndexService.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/service/KnowledgeSearchService.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/service/KnowledgeBaseIndexServiceTest.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/service/KnowledgeSearchServiceTest.java`

- [ ] **Step 1: Write indexing service test**

```java
package com.fdc3.rag.service;

import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.ingest.KnowledgeChunker;
import com.fdc3.rag.ingest.KnowledgeDocument;
import com.fdc3.rag.ingest.KnowledgeDocumentLoader;
import com.fdc3.rag.repository.InMemoryKnowledgeChunkRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class KnowledgeBaseIndexServiceTest {

    @Test
    void loadsChunksEmbedsAndReplacesRepository() {
        KnowledgeDocumentLoader loader = () -> List.of(new KnowledgeDocument(
                "doc",
                "Doc",
                "advisor",
                "MCP retrieval content",
                Map.of()
        ));
        KnowledgeChunker chunker = document -> List.of(new KnowledgeChunk(
                "doc#1",
                "doc",
                "Doc",
                "advisor",
                document.text(),
                Map.of(),
                List.of()
        ));
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.just(List.of(1.0, 0.0));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.just(List.of(List.of(1.0, 0.0)));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        KnowledgeBaseIndexService service = new KnowledgeBaseIndexService(loader, chunker, embeddingClient, repository);

        service.rebuildIndex();

        assertThat(repository.size()).isEqualTo(1);
        assertThat(repository.search(List.of(1.0, 0.0), "advisor", 1).get(0).chunk().embedding())
                .containsExactly(1.0, 0.0);
    }

    @Test
    void applicationReadyDoesNotFailStartupWhenIndexingFails() {
        KnowledgeDocumentLoader loader = () -> List.of(new KnowledgeDocument(
                "doc",
                "Doc",
                "advisor",
                "MCP retrieval content",
                Map.of()
        ));
        KnowledgeChunker chunker = document -> List.of(new KnowledgeChunk(
                "doc#1",
                "doc",
                "Doc",
                "advisor",
                document.text(),
                Map.of(),
                List.of()
        ));
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.error(new IllegalStateException("network down"));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.error(new IllegalStateException("network down"));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        KnowledgeBaseIndexService service = new KnowledgeBaseIndexService(
                loader,
                chunker,
                embeddingClient,
                repository,
                Runnable::run,
                true
        );

        service.onApplicationReady(null);

        assertThat(repository.size()).isZero();
    }
}
```

- [ ] **Step 2: Write search service test**

```java
package com.fdc3.rag.service;

import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.repository.InMemoryKnowledgeChunkRepository;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class KnowledgeSearchServiceTest {

    @Test
    void embedsQueryAndCapsTopK() {
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.just(List.of(1.0, 0.0));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.just(List.of(List.of(1.0, 0.0)));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        repository.replaceAll(List.of(
                new KnowledgeChunk("doc#1", "doc", "Doc", "advisor", "MCP retrieval", Map.of(), List.of(1.0, 0.0))
        ));
        KnowledgeSearchService service = new KnowledgeSearchService(
                embeddingClient,
                repository,
                new RagProperties.Search(5, 10, 3000)
        );

        List<com.fdc3.rag.repository.KnowledgeChunkRepository.ScoredKnowledgeChunk> results =
                service.search("How does MCP retrieval work?", 50, "advisor");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).chunk().text()).contains("MCP retrieval");
    }
}
```

- [ ] **Step 3: Run tests and verify they fail**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=KnowledgeBaseIndexServiceTest,KnowledgeSearchServiceTest test
```

Expected: FAIL because service classes do not exist.

- [ ] **Step 4: Add index service**

```java
package com.fdc3.rag.service;

import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.ingest.KnowledgeChunker;
import com.fdc3.rag.ingest.KnowledgeDocumentLoader;
import com.fdc3.rag.repository.KnowledgeChunkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;

@Service
public class KnowledgeBaseIndexService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeBaseIndexService.class);

    private final KnowledgeDocumentLoader loader;
    private final KnowledgeChunker chunker;
    private final EmbeddingClient embeddingClient;
    private final KnowledgeChunkRepository repository;
    private final Executor embeddingExecutor;
    private final boolean ingestionEnabled;

    public KnowledgeBaseIndexService(
            KnowledgeDocumentLoader loader,
            KnowledgeChunker chunker,
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            @Qualifier("ragEmbeddingExecutor") Executor embeddingExecutor,
            @Value("${rag.ingestion.enabled:true}") boolean ingestionEnabled
    ) {
        this.loader = loader;
        this.chunker = chunker;
        this.embeddingClient = embeddingClient;
        this.repository = repository;
        this.embeddingExecutor = embeddingExecutor;
        this.ingestionEnabled = ingestionEnabled;
    }

    KnowledgeBaseIndexService(
            KnowledgeDocumentLoader loader,
            KnowledgeChunker chunker,
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository
    ) {
        this(loader, chunker, embeddingClient, repository, Runnable::run, true);
    }

    KnowledgeBaseIndexService(
            KnowledgeDocumentLoader loader,
            KnowledgeChunker chunker,
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            Executor embeddingExecutor,
            boolean ingestionEnabled
    ) {
        this.loader = loader;
        this.chunker = chunker;
        this.embeddingClient = embeddingClient;
        this.repository = repository;
        this.embeddingExecutor = embeddingExecutor;
        this.ingestionEnabled = ingestionEnabled;
    }

    @EventListener(ApplicationReadyEvent.class)
    void onApplicationReady(ApplicationReadyEvent event) {
        if (ingestionEnabled) {
            embeddingExecutor.execute(() -> {
                try {
                    rebuildIndex();
                } catch (Exception exception) {
                    log.warn("Initial RAG indexing failed. MCP endpoint remains available and can be reindexed after configuration is fixed.", exception);
                }
            });
        }
    }

    public void rebuildIndex() {
        List<KnowledgeChunk> chunks = loader.load().stream()
                .flatMap(document -> chunker.chunk(document).stream())
                .toList();
        List<List<Double>> embeddings = embeddingClient.embedAll(chunks.stream().map(KnowledgeChunk::text).toList()).block();
        if (embeddings == null || embeddings.size() != chunks.size()) {
            throw new IllegalStateException("Embedding response size did not match chunk count.");
        }
        List<KnowledgeChunk> embeddedChunks = new ArrayList<>(chunks.size());
        for (int index = 0; index < chunks.size(); index++) {
            embeddedChunks.add(chunks.get(index).withEmbedding(embeddings.get(index)));
        }
        repository.replaceAll(embeddedChunks);
        log.info("Indexed {} knowledge chunks.", embeddedChunks.size());
    }
}
```

- [ ] **Step 5: Add search service**

```java
package com.fdc3.rag.service;

import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.repository.KnowledgeChunkRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

@Service
public class KnowledgeSearchService {

    private final EmbeddingClient embeddingClient;
    private final KnowledgeChunkRepository repository;
    private final RagProperties.Search searchProperties;
    private final Executor embeddingExecutor;

    public KnowledgeSearchService(
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            RagProperties properties,
            @Qualifier("ragEmbeddingExecutor") Executor embeddingExecutor
    ) {
        this(embeddingClient, repository, properties.search(), embeddingExecutor);
    }

    KnowledgeSearchService(
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            RagProperties.Search searchProperties
    ) {
        this(embeddingClient, repository, searchProperties, Runnable::run);
    }

    KnowledgeSearchService(
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            RagProperties.Search searchProperties,
            Executor embeddingExecutor
    ) {
        this.embeddingClient = embeddingClient;
        this.repository = repository;
        this.searchProperties = searchProperties;
        this.embeddingExecutor = embeddingExecutor;
    }

    public List<KnowledgeChunkRepository.ScoredKnowledgeChunk> search(String query, Integer topK, String namespace) {
        int requestedTopK = topK == null || topK <= 0 ? searchProperties.defaultTopK() : topK;
        int effectiveTopK = Math.min(requestedTopK, searchProperties.maxTopK());
        List<Double> queryEmbedding = embedQuery(query);
        return repository.search(queryEmbedding, namespace, effectiveTopK);
    }

    private List<Double> embedQuery(String query) {
        long timeoutMillis = searchProperties.embeddingTimeoutMillis();
        try {
            return CompletableFuture.supplyAsync(
                    () -> embeddingClient.embed(query).block(Duration.ofMillis(timeoutMillis)),
                    embeddingExecutor
            ).get(timeoutMillis + 500L, TimeUnit.MILLISECONDS);
        } catch (Exception exception) {
            throw new CompletionException("Failed to embed RAG query within timeout.", exception);
        }
    }
}
```

- [ ] **Step 6: Run service tests**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=KnowledgeBaseIndexServiceTest,KnowledgeSearchServiceTest test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/service services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/service
git commit -m "feat: add rag indexing and search services"
```

---

### Task 7: Expose MCP Search Tool

**Files:**
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool/KnowledgeBaseMcpTools.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool/model/KnowledgeSearchResult.java`
- Create: `services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool/model/KnowledgeSearchResponse.java`
- Test: `services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/tool/KnowledgeBaseMcpToolsTest.java`

- [ ] **Step 1: Write MCP tool test**

```java
package com.fdc3.rag.tool;

import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.repository.InMemoryKnowledgeChunkRepository;
import com.fdc3.rag.service.KnowledgeSearchService;
import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.tool.model.KnowledgeSearchResponse;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class KnowledgeBaseMcpToolsTest {

    @Test
    void returnsSearchResultsWithCitationMetadata() {
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.just(List.of(1.0, 0.0));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.just(List.of(List.of(1.0, 0.0)));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        repository.replaceAll(List.of(new KnowledgeChunk(
                "mfe-chatbot#1",
                "mfe-chatbot",
                "MFE Chatbot",
                "advisor",
                "Remote MCP providers are registered into chatbot-backend.",
                Map.of("source", "seed"),
                List.of(1.0, 0.0)
        )));
        KnowledgeSearchService service = new KnowledgeSearchService(
                embeddingClient,
                repository,
                new RagProperties.Search(5, 10, 3000)
        );
        KnowledgeBaseMcpTools tools = new KnowledgeBaseMcpTools(service);

        KnowledgeSearchResponse response = tools.searchKnowledgeBase("How are MCP providers registered?", 3, "advisor");

        assertThat(response.query()).isEqualTo("How are MCP providers registered?");
        assertThat(response.results()).hasSize(1);
        assertThat(response.results().get(0).documentId()).isEqualTo("mfe-chatbot");
        assertThat(response.results().get(0).text()).contains("Remote MCP providers");
        assertThat(response.results().get(0).score()).isGreaterThan(0.99);
    }
}
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=KnowledgeBaseMcpToolsTest test
```

Expected: FAIL because MCP tool classes do not exist.

- [ ] **Step 3: Add tool response models**

```java
package com.fdc3.rag.tool.model;

import java.util.Map;

public record KnowledgeSearchResult(
        String chunkId,
        String documentId,
        String title,
        String namespace,
        String text,
        double score,
        Map<String, String> metadata
) {
}
```

```java
package com.fdc3.rag.tool.model;

import java.util.List;

public record KnowledgeSearchResponse(
        String query,
        String namespace,
        int topK,
        List<KnowledgeSearchResult> results
) {
}
```

- [ ] **Step 4: Add MCP tool**

```java
package com.fdc3.rag.tool;

import com.fdc3.rag.repository.KnowledgeChunkRepository;
import com.fdc3.rag.service.KnowledgeSearchService;
import com.fdc3.rag.tool.model.KnowledgeSearchResponse;
import com.fdc3.rag.tool.model.KnowledgeSearchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeBaseMcpTools {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeBaseMcpTools.class);
    public static final String TOOL_DESCRIPTION = """
            Search the read-only RAG knowledge base for relevant internal documentation.
            Use this when the user asks about project architecture, chatbot behavior, MCP integration,
            runbook details, or implementation guidance that may be documented in the knowledge base.
            Return cited chunks only; do not invent facts beyond retrieved results.
            """;

    private final KnowledgeSearchService searchService;

    public KnowledgeBaseMcpTools(KnowledgeSearchService searchService) {
        this.searchService = searchService;
    }

    @McpTool(name = "search_knowledge_base", description = TOOL_DESCRIPTION)
    public KnowledgeSearchResponse searchKnowledgeBase(
            @McpToolParam(description = "Natural language search query", required = true) String query,
            @McpToolParam(description = "Maximum number of chunks to return. The service caps this value.", required = false) Integer topK,
            @McpToolParam(description = "Optional namespace such as advisor, default, or app name.", required = false) String namespace
    ) {
        log.info("search_knowledge_base called: namespace={}, topK={}", namespace, topK);
        java.util.List<KnowledgeChunkRepository.ScoredKnowledgeChunk> results =
                searchService.search(query, topK, namespace);
        int effectiveTopK = topK == null ? results.size() : Math.min(topK, results.size());
        return new KnowledgeSearchResponse(
                query,
                namespace,
                effectiveTopK,
                results.stream().map(result -> new KnowledgeSearchResult(
                        result.chunk().id(),
                        result.chunk().documentId(),
                        result.chunk().title(),
                        result.chunk().namespace(),
                        result.chunk().text(),
                        result.score(),
                        result.chunk().metadata()
                )).toList()
        );
    }
}
```

- [ ] **Step 5: Run MCP tool test**

Run:

```bash
cd services/rag-knowledge-base-service && mvn -Dtest=KnowledgeBaseMcpToolsTest test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add services/rag-knowledge-base-service/src/main/java/com/fdc3/rag/tool services/rag-knowledge-base-service/src/test/java/com/fdc3/rag/tool
git commit -m "feat: expose knowledge search mcp tool"
```

---

### Task 8: Register RAG MCP Provider In Chatbot

**Files:**
- Modify: `services/chatbot-backend/src/main/resources/application.yml`
- Modify: `services/chatbot-backend/package.json`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/mcp/McpBootstrapRegistrarTest.java`
- Modify: `package.json`
- Modify: `turbo.json`

- [ ] **Step 1: Add chatbot bootstrap test case**

Append this test to `McpBootstrapRegistrarTest`:

```java
    @Test
    void registersRagProviderFromConfiguration() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider ragProvider = new McpBootstrapProperties.Provider();
        ragProvider.setEnabled(true);
        ragProvider.setProviderId("rag-knowledge-base");
        ragProvider.setServiceName("RAG Knowledge Base MCP");
        ragProvider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        ragProvider.setUrl("http://localhost:8091/api/mcp");
        ragProvider.setEnabledProfiles(List.of("advisor"));
        ragProvider.setDescription("Read-only RAG retrieval provider.");
        properties.setProviders(List.of(ragProvider));
        properties.setRegistrationMaxAttempts(1);
        properties.setRegistrationRetryDelayMillis(0L);

        RecordingMcpProviderRegistryService registryService = new RecordingMcpProviderRegistryService();
        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(properties, registryService);

        registrar.registerConfiguredProviders();

        assertEquals(1, registryService.requests.size());
        McpProviderRegistrationRequest request = registryService.requests.get(0);
        assertEquals("rag-knowledge-base", request.getProviderId());
        assertEquals("RAG Knowledge Base MCP", request.getServiceName());
        assertEquals(McpTransportType.STREAMABLE_HTTP, request.getTransportType());
        assertEquals("http://localhost:8091/api/mcp", request.getUrl());
        assertEquals(List.of("advisor"), request.getEnabledProfiles());
    }
```

- [ ] **Step 2: Run chatbot test**

Run:

```bash
cd services/chatbot-backend && mvn -Dtest=McpBootstrapRegistrarTest test
```

Expected: PASS before config changes because this test constructs properties directly.

- [ ] **Step 3: Add disabled RAG provider to `application.yml`**

Add after the Elasticsearch provider entry:

```yaml
      - enabled: ${CHATBOT_MCP_RAG_ENABLED:false}
        provider-id: rag-knowledge-base
        service-name: RAG Knowledge Base MCP
        transport-type: STREAMABLE_HTTP
        url: ${CHATBOT_MCP_RAG_URL:}
        enabled-profiles:
          - advisor
        description: Read-only RAG retrieval MCP provider used for knowledge base search.
```

- [ ] **Step 4: Add chatbot script**

In `services/chatbot-backend/package.json`, add:

```json
"dev:with-rag-mcp": "cross-env CHATBOT_SECURITY_ENABLED=false CHATBOT_MCP_RAG_ENABLED=true CHATBOT_MCP_RAG_URL=http://localhost:8091/api/mcp CHATBOT_SECURITY_ADDITIONAL_PROFILES=advisor mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8080 -Dspring.profiles.active=local'"
```

- [ ] **Step 5: Add root dev script**

In root `package.json`, add:

```json
"dev:rag": "cross-env RAG_EMBEDDING_PROVIDER=deterministic CHATBOT_MCP_RAG_ENABLED=true CHATBOT_MCP_RAG_URL=http://localhost:8091/api/mcp CHATBOT_SECURITY_ADDITIONAL_PROFILES=advisor turbo run dev --filter=\"./services/rag-knowledge-base-service\" --filter=\"./services/chatbot-backend\""
```

- [ ] **Step 6: Add env vars to `turbo.json`**

Add to `globalEnv`:

```json
"OPENROUTER_API_KEY",
"OPENROUTER_BASE_URL",
"OPENROUTER_EMBEDDING_MODEL",
"OPENROUTER_EMBEDDING_TIMEOUT_MILLIS",
"RAG_EMBEDDING_PROVIDER",
"RAG_INGESTION_ENABLED",
"RAG_KNOWLEDGE_RESOURCE_PATTERN",
"RAG_CHUNK_MAX_CHARS",
"RAG_CHUNK_OVERLAP_CHARS",
"RAG_SEARCH_DEFAULT_TOP_K",
"RAG_SEARCH_MAX_TOP_K",
"RAG_SEARCH_EMBEDDING_TIMEOUT_MILLIS",
"RAG_EMBEDDING_EXECUTOR_CORE_POOL_SIZE",
"RAG_EMBEDDING_EXECUTOR_MAX_POOL_SIZE",
"RAG_EMBEDDING_EXECUTOR_QUEUE_CAPACITY",
"CHATBOT_MCP_RAG_ENABLED",
"CHATBOT_MCP_RAG_URL"
```

- [ ] **Step 7: Run chatbot MCP tests**

Run:

```bash
cd services/chatbot-backend && mvn -Dtest=McpBootstrapRegistrarTest,McpProviderRegistryServiceTest test
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add services/chatbot-backend/src/main/resources/application.yml services/chatbot-backend/package.json services/chatbot-backend/src/test/java/com/fdc3/chatbot/mcp/McpBootstrapRegistrarTest.java package.json turbo.json
git commit -m "feat: bootstrap rag mcp provider for chatbot"
```

---

### Task 9: Verify Local MCP Flow

**Files:**
- Modify: `services/rag-knowledge-base-service/README.md`

- [ ] **Step 1: Start RAG service in stub mode**

Run:

```bash
cd services/rag-knowledge-base-service && npm run dev:stub
```

Expected logs:

```text
Started RagKnowledgeBaseApplication
Indexed 1 knowledge chunks.
```

- [ ] **Step 2: Start chatbot with RAG MCP registration**

In a separate terminal:

```bash
cd services/chatbot-backend && npm run dev:with-rag-mcp
```

Expected logs:

```text
Bootstrapping MCP provider rag-knowledge-base
Registered MCP provider: rag-knowledge-base with tools [search_knowledge_base]
```

- [ ] **Step 3: Verify chatbot provider list**

Run:

```bash
curl http://localhost:8080/api/chat/mcp/providers
```

Expected response includes:

```json
{
  "providerId": "rag-knowledge-base",
  "serviceName": "RAG Knowledge Base MCP",
  "toolNames": ["search_knowledge_base"]
}
```

- [ ] **Step 4: Add manual verification section to README**

Append:

```markdown
## Manual Verification

Start RAG with deterministic embeddings:

```bash
cd services/rag-knowledge-base-service
npm run dev:stub
```

Start chatbot with the RAG MCP provider:

```bash
cd services/chatbot-backend
npm run dev:with-rag-mcp
```

Verify provider registration:

```bash
curl http://localhost:8080/api/chat/mcp/providers
```

Expected provider:

```json
{
  "providerId": "rag-knowledge-base",
  "toolNames": ["search_knowledge_base"]
}
```
```

- [ ] **Step 5: Commit**

```bash
git add services/rag-knowledge-base-service/README.md
git commit -m "docs: document rag mcp verification"
```

---

### Task 10: Full Verification

**Files:**
- No source files unless a previous task fails.

- [ ] **Step 1: Run RAG service unit tests**

Run:

```bash
cd services/rag-knowledge-base-service && npm run test
```

Expected: PASS.

- [ ] **Step 2: Run chatbot MCP tests**

Run:

```bash
cd services/chatbot-backend && mvn -Dtest=McpBootstrapRegistrarTest,McpProviderRegistryServiceTest test
```

Expected: PASS.

- [ ] **Step 3: Run package build for new service**

Run:

```bash
cd services/rag-knowledge-base-service && npm run build
```

Expected: PASS and `target/rag-knowledge-base-service.jar` exists.

- [ ] **Step 4: Run root workspace status check**

Run:

```bash
git status --short
```

Expected: only intended RAG service, chatbot config/script, root script/env, and docs changes are present.

---

## Elasticsearch Migration Boundary

The POC must keep these boundaries stable:

- `KnowledgeChunkRepository.replaceAll(List<KnowledgeChunk>)`
- `KnowledgeChunkRepository.search(List<Double> queryEmbedding, String namespace, int topK)`
- `KnowledgeChunk.embedding`
- `KnowledgeChunk.documentId`
- `KnowledgeChunk.namespace`
- `KnowledgeChunk.metadata`

The later Elasticsearch adapter should implement `KnowledgeChunkRepository` and be selected by a property such as `rag.store.provider=elasticsearch`. It should index one document per chunk with fields:

```json
{
  "chunkId": "mfe-chatbot#1",
  "documentId": "mfe-chatbot",
  "title": "MFE Chatbot And MCP",
  "namespace": "advisor",
  "text": "Remote MCP providers are registered...",
  "embedding": [0.1, 0.2],
  "metadata": {
    "source": "seed"
  }
}
```

This means chatbot-backend integration remains unchanged when storage migrates from memory to Elasticsearch.

## Plan Self-Review

- Spec coverage: The plan covers standalone service creation, OpenRouter embeddings, in-memory retrieval, MCP tool exposure, chatbot registration, local verification, and Elasticsearch migration readiness.
- Placeholder scan: No placeholder markers or incomplete implementation steps remain.
- Type consistency: `KnowledgeChunk`, `EmbeddingClient`, `KnowledgeChunkRepository`, `KnowledgeSearchService`, and `KnowledgeBaseMcpTools` names are consistent across tasks.
- Scope check: The Elasticsearch production adapter is intentionally deferred, but the repository boundary and metadata schema are included in the POC so migration does not require chatbot changes.
