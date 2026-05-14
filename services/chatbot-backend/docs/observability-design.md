# Observability & OpenTelemetry Design — chatbot-backend

**Date:** 2026-05-14
**Status:** Design draft

## 1. Goals

1. Add **OpenTelemetry**-based observability to the chatbot backend — vendor-neutral, OTLP standard
2. Track **AI state changes**: agent decisions (RESPOND/CLARIFY/PLAN), tool executions, LLM calls
3. Track **prompts and responses**: model name, temperature, token usage, conversation context summary
4. Track **performance and debugging**: request latency, SSE streaming durations, error rates, rate limit hits
5. **Day 1 output to logs** — structured JSON trace lines interleaved with SLF4J logs; no infrastructure required
6. **Future-ready for LangFuse** — switching the OTLP exporter target is a one-env-var change

## 2. Approach

**OpenTelemetry Java Agent (auto-instrumentation) + targeted manual instrumentation with @WithSpan / programmatic spans + Micrometer custom metrics.**

This combines the breadth of automatic coverage with the depth needed for AI-specific telemetry.

### Rationale

- Auto-instrumentation covers HTTP, WebFlux, Reactor, thread pools, HTTP clients — zero code
- Manual instrumentation captures domain-specific semantics (decision type, model name, tool name, prompt summary)
- Micrometer metrics provide dashboards-optimized counters, timers, and gauges
- OTLP standard means the same telemetry can be routed to logs (dev), LangFuse, Prometheus, or any OTLP-compatible backend

## 3. Dependencies

### 3.1. pom.xml additions

```xml
<!-- Actuator — health, metrics, Micrometer integration -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Micrometer OTLP registry — metrics export -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-otlp</artifactId>
</dependency>

<!-- OpenTelemetry API — for programmatic spans in private methods -->
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
    <version>1.48.0</version>
</dependency>

<!-- OpenTelemetry annotations — @WithSpan for public methods -->
<dependency>
    <groupId>io.opentelemetry.instrumentation</groupId>
    <artifactId>opentelemetry-instrumentation-annotations</artifactId>
    <version>2.14.0</version>
</dependency>

<!-- OpenTelemetry OTLP exporter — trace/metric export -->
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-otlp</artifactId>
    <version>1.48.0</version>
</dependency>

<!-- OpenTelemetry SDK — for LoggingSpanExporter in dev mode.
     IMPORTANT: <scope>provided</scope> because the OTel Java agent
     bundles its own SDK at runtime. Without this scope, classloader
     conflicts can occur between the agent's SDK and this compile-time SDK. -->
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-sdk</artifactId>
    <version>1.48.0</version>
    <scope>provided</scope>
</dependency>
```

### 3.2. OpenTelemetry Java Agent

Downloaded during build via `maven-dependency-plugin`:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <executions>
        <execution>
            <id>copy-opentelemetry-agent</id>
            <phase>prepare-package</phase>
            <goals><goal>copy</goal></goals>
            <configuration>
                <artifactItems>
                    <artifactItem>
                        <groupId>io.opentelemetry.javaagent</groupId>
                        <artifactId>opentelemetry-javaagent</artifactId>
                        <version>2.14.0</version>
                        <outputDirectory>${project.build.directory}</outputDirectory>
                        <destFileName>opentelemetry-javaagent.jar</destFileName>
                    </artifactItem>
                </artifactItems>
            </configuration>
        </execution>
    </executions>
</plugin>
```

> **Version note:** OTel 1.48.0 with instrumentation 2.14.0 targets Spring Boot 3.x. Spring Boot 4.x compatibility should be validated at Phase 1 (see Section 12).

### 3.3. Spring AI observability audit

The project uses `spring-ai-starter-model-openai` and `spring-ai-starter-model-anthropic` but does NOT include `spring-ai-observability` or the Micrometer observation modules. Additionally, `AgentService` constructs its own `OpenAiChatModel` instance manually (not via auto-configuration), so Spring AI's built-in metrics are not active by default.

**Action:** Before implementing custom LLM call spans, confirm no Spring AI auto-observation is active by checking `/actuator/metrics` for existing `spring.ai.*` metric names. If some exist, de-duplicate; if none exist, proceed with custom instrumentation.

## 4. Configuration

### 4.1. application.yml additions

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, metrics, prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    tags:
      application: ${spring.application.name}
    export:
      otlp:
        enabled: true
        step: 30s
```

### 4.2. .env.example additions

```bash
# OpenTelemetry
# NOTE: The -javaagent JVM arg controls whether the agent loads.
# OTEL_JAVAAGENT_ENABLED is a secondary runtime toggle that maps to
# the otel.javaagent.enabled system property. The primary activation
# mechanism is the -javaagent JVM argument in package.json.
OTEL_SERVICE_NAME=chatbot-backend
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_TRACES_EXPORTER=logging
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none

# For LangFuse (future):
# OTEL_EXPORTER_OTLP_ENDPOINT=https://your-langfuse-instance/api/public/otel
# OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer sk-...
# OTEL_TRACES_EXPORTER=otlp
# OTEL_METRICS_EXPORTER=otlp
```

### 4.3. Env profile additions

**File:** `../../.env.profile.dev` (monorepo root — already loaded by the `dev` command via env-cmd)

Add under the `# --- Chatbot Backend ---` section:

```bash
# OpenTelemetry
OTEL_SERVICE_NAME=chatbot-backend
OTEL_TRACES_EXPORTER=logging
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

### 4.4. package.json dev command

```json
"dev": "env-cmd -f ../../.env.profile.${ACTIVE_ENV:-dev} mvn spring-boot:run \
  -Dspring-boot.run.jvmArguments='-Dserver.port=8080 \
    -Dspring.profiles.active=local \
    -javaagent:target/opentelemetry-javaagent.jar \
    -Dotel.traces.exporter=logging \
    -Dotel.metrics.exporter=none'"
```

## 5. Auto-Instrumentation Coverage

The OpenTelemetry Java agent instruments these components without any code changes:

| Component | Spans generated | Key attributes |
|---|---|---|
| All REST controllers | `POST /api/chat/runs`, `GET /api/chat/models`, etc. | `http.method`, `http.status_code`, `http.url`, `http.route` |
| SseEmitter | Async I/O spans | Thread name |
| WebClient (MCP calls) | `HTTP POST` to MCP providers | `http.url`, `peer.service` |
| Reactor / WebFlux | Reactive pipeline spans | Thread, operator |
| Executor thread pools | `Executor.execute` | Pool name |
| Tomcat request threads | Request processing | `thread.id`, `thread.name` |

> **Reactor span noise:** Per-operator Reactor spans can be verbose. Set system property `otel.instrumentation.reactor.operator.kind-enabled=false` to suppress per-operator spans while keeping pipeline-level spans.

## 6. Custom Instrumentation

### 6.1. Core principle: programmatic spans for private methods, @WithSpan for public

- **Private methods** (`processMessageStreaming(..., boolean)`, `executeAgenticControlLoop`) — use programmatic span creation via `Span.current()` inside the method body
- **Public methods** in service classes — use `@WithSpan` on the method signature
- **Async context propagation** — capture the span before creating the Runnable, then wrap with `Context.current().wrap(runnable)` or use `span.makeCurrent()` inside the Runnable body

### 6.2. AgentService — main streaming entry point

**File:** `AgentService.java`, method `processMessageStreaming(..., boolean)` (private, line 650)

Use programmatic span inside the method body:

```java
private Runnable processMessageStreaming(...) {
    Span span = Span.current();
    span.setAttribute("conversation.id", conversationId);
    span.setAttribute("agent.model", resolveConfiguredModel());
    span.setAttribute("agent.mode",
        allowAgenticControlLoop && shouldUseAgenticControlLoop(...)
            ? "agentic-control-loop"
            : "direct-streaming");

    // Gauge-backed active requests counter
    activeRequests.incrementAndGet();

    // ... existing logic ...

    // IMPORTANT: wrap the returned Runnable with OTel context
    // so spans executed on the controller's executor thread
    // remain part of the same trace
    Context currentContext = Context.current();
    return () -> {
        try (Scope ignored = currentContext.makeCurrent()) {
            // original runnable body
        } finally {
            activeRequests.decrementAndGet();
        }
    };
}
```

### 6.3. Agentic control loop — decision tracking

**File:** `AgentService.java`, method `executeAgenticControlLoop()` (private, line 892)

Each phase within the loop gets a programmatic span:

| Phase | Span name | Attributes |
|---|---|---|
| Agent decision | `agent.decision` | `decision.type` (RESPOND/CLARIFY/PLAN), `decision.latency` |
| Plan validation | `agent.plan.validate` | `plan.steps.count`, `policy.result` |
| Tool execution (per tool) | `agent.tool.execute` | `tool.name`, `tool.duration`, `tool.success` |
| Result synthesis | `agent.synthesize` | `synthesis.latency` |

The sub-services `AgentDecisionService`, `PlanValidationService`, `ExecutionOrchestrator`, `ResultSynthesisService` — each has public entry methods suitable for `@WithSpan`:

```java
// AgentDecisionService.java
@WithSpan("agent.decision")
public AgentDecision decide(String userMessage, List<ChatMessage> history, ...) {
    Span.current().setAttribute("decision.type", ...);
    // existing logic...
}
```

### 6.4. LLM model call tracking

**File:** `AgentService.java` — in the streaming path:

```java
private void instrumentedStreamingCall(
        List<Message> messages, Consumer<String> onNext, ...) {
    Span span = Span.current();
    span.setAttribute("llm.model", resolveConfiguredModel());
    span.setAttribute("llm.temperature", resolveConfiguredTemperature());
    span.setAttribute("llm.max_tokens", maxTokens);
    span.setAttribute("llm.prompt.messages_count", messages.size());
    // Truncated summary — never log full prompt content
    span.setAttribute("llm.prompt.summary",
        truncate(firstUserMessage(messages), 500));
    // existing streaming call...
}
```

> **Security:** Never add the full prompt or response payload as span attributes. Only add truncated summaries. The OTel agent can be configured to strip HTTP headers via `otel.instrumentation.http.capture-headers` exclude patterns.

### 6.5. Protocol SSE streaming

**File:** `ProtocolChatController.java` — public method, use `@WithSpan`:

```java
@WithSpan("protocol.run")
public SseEmitter streamRun(@RequestBody ProtocolRunRequest request, Authentication authentication) {
    Span span = Span.current();
    span.setAttribute("protocol.run_id", request.runId());
    span.setAttribute("protocol.model", request.model());
    span.setAttribute("protocol.parts_count",
        request.parts() != null ? request.parts().size() : 0);
    // existing logic...
}
```

**File:** `ProtocolChatService.java` — public method:

```java
@WithSpan("protocol.service.run")
public Runnable streamRun(...) {
    Span span = Span.current();
    span.setAttribute("protocol.conversation_count",
        invocation.previousMessages() != null ? invocation.previousMessages().size() : 0);
    // existing logic...
}
```

### 6.6. MCP provider calls

**File:** `McpProviderRegistryService.java`:

```java
@WithSpan("mcp.provider.call")
public Object callProvider(String providerId, String toolName, Map<String, Object> args) {
    Span span = Span.current();
    span.setAttribute("mcp.provider.id", providerId);
    span.setAttribute("mcp.tool.name", toolName);
    // existing logic...
}
```

### 6.7. Rate limiting metrics

**File:** `RateLimitConfig.java`

Inject `MeterRegistry` and a pre-registered `Counter` bean:

```java
// In ObservabilityConfig.java:
@Bean
public Counter rateLimitExceededCounter(MeterRegistry registry) {
    return Counter.builder("chatbot.rate.limit.exceeded")
        .description("Number of rate-limited requests")
        .register(registry);
}

// In RateLimitConfig.java (injected):
private final Counter rateLimitExceededCounter;

// Inside the interceptor's preHandle when rate-limited:
rateLimitExceededCounter.increment();
```

## 7. Micrometer Custom Metrics

Defined in a dedicated `ObservabilityConfig.java`:

| Metric name | Type | Implementation | Tags | Description |
|---|---|---|---|---|
| `chatbot.request.active` | Gauge | `AtomicInteger` backing | none | Active concurrent requests |
| `chatbot.request.duration` | Timer | `Timer.builder(...)` | `endpoint`, `status` | Request latency |
| `chatbot.llm.call.count` | Counter | `Counter.builder(...)` | `model`, `operation` | Total LLM model calls |
| `chatbot.llm.call.duration` | Timer | `Timer.builder(...)` | `model` | LLM call latency |
| `chatbot.llm.token.total` | Counter | `Counter.builder(...)` | `model`, `type` (prompt/completion) | Total tokens |
| `chatbot.tool.execution.count` | Counter | `Counter.builder(...)` | `tool.name`, `success` | Tool calls |
| `chatbot.tool.execution.duration` | Timer | `Timer.builder(...)` | `tool.name` | Tool latency |
| `chatbot.rate.limit.exceeded` | Counter | `Counter.builder(...)` | none | Rate-limited requests |
| `chatbot.sse.events.sent` | Counter | `Counter.builder(...)` | `event.type` | SSE events by type |

### Gauge implementation pattern

```java
// Registration (ObservabilityConfig.java):
AtomicInteger activeRequests = new AtomicInteger(0);
Gauge.builder("chatbot.request.active", activeRequests, AtomicInteger::get)
    .register(meterRegistry);

// Usage (AgentService.java):
activeRequests.incrementAndGet();  // at request start
activeRequests.decrementAndGet();  // at request completion
```

These metrics are available via:
- `GET /actuator/metrics` (JSON)
- OTLP export (to LangFuse, Prometheus, etc.)
- Programmatic access in tests

## 8. Log Output Format (Day 1)

With `-Dotel.traces.exporter=logging`, spans appear as structured JSON in the application log:

```
[otel] {
  "name": "agent.processMessage",
  "traceId": "abc123def456",
  "spanId": "789012345678",
  "parentSpanId": "fedcba098765",
  "attributes": {
    "conversation.id": "conv-xyz",
    "agent.model": "qwen3.5-plus",
    "agent.mode": "agentic-control-loop"
  },
  "durationMs": 4523.2,
  "status": "OK"
}
```

The full trace tree is navigable via `traceId` — all spans (auto + manual) share the same `traceId` for a single request. Grep for a `traceId` to reconstruct the entire request flow across controllers, agent loop, tool calls, and LLM calls.

### Production sampling

In production, add sampling to control volume:
```
-Dotel.span.sampler=parentbased_traceidratio
-Dotel.span.sampler.arg=0.1
```
This samples 10% of traces while preserving complete trace trees within sampled requests.

## 9. Cross-Cutting Consideration: OTel Baggage

For correlating `userId`, `conversationId`, and `sessionId` across service boundaries (e.g., when chatbot-backend calls the elasticsearch-mcp-service or rag-knowledge-base-service), OTel Baggage API propagates these as HTTP headers without changing method signatures.

This is **optional** and can be added later when cross-service tracing is needed. To implement:

```java
// Set at request entry (in controller or filter)
Baggage.current().toBuilder()
    .put("user.id", userId)
    .put("conversation.id", conversationId)
    .build()
    .makeCurrent();

// Read in downstream service
String userId = Baggage.current().getEntryValue("user.id");
```

## 10. Testing Strategy

### 10.1. Actuator health check test

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class ObservabilityActuatorTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void healthEndpointReturnsUp() {
        var response = restTemplate.getForEntity("/actuator/health", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"status\":\"UP\"");
    }
}
```

### 10.2. Custom metrics registration test

```java
@SpringBootTest
class CustomMetricsRegistrationTest {
    @Autowired
    private MeterRegistry meterRegistry;

    @Test
    void rateLimitCounterIsRegistered() {
        Counter counter = meterRegistry.find("chatbot.rate.limit.exceeded").counter();
        assertThat(counter).isNotNull();
    }

    @Test
    void activeRequestsGaugeIsRegistered() {
        Gauge gauge = meterRegistry.find("chatbot.request.active").gauge();
        assertThat(gauge).isNotNull();
    }
}
```

### 10.3. Span emission test (using LoggingSpanExporter)

```java
@Test
void protocolChatControllerEmitsSpanOnRequest() {
    // Use a test OTel SDK with InMemorySpanExporter
    // POST to /api/chat/runs with a minimal request
    // Verify: exported spans contain the "protocol.run" span
    // Verify: span attributes contain protocol.run_id and protocol.model
}
```

## 11. Files to Modify

| File | Change | Phase |
|---|---|---|
| `pom.xml` | Add deps (actuator, OTel API/SDK/annotations/exporter) + maven-dependency-plugin | 1 |
| `src/main/resources/application.yml` | Add `management.*` config block | 2 |
| `.env.example` | Add `OTEL_*` vars | 3 |
| `../../.env.profile.dev` | Add `OTEL_*` vars under chatbot-backend section | 3 |
| `package.json` | Add `-javaagent` to dev JVM args | 4 |
| `config/ObservabilityConfig.java` (new) | MeterRegistry beans, Counter/Timer/Gauge definitions | 5 |
| `RateLimitConfig.java` | Inject and use `rateLimitExceededCounter` | 5 |
| `AgentService.java` | Programmatic spans in `processMessageStreaming`, `executeAgenticControlLoop`, LLM call | 6 |
| `AgentDecisionService.java` | `@WithSpan` on `decide()` | 6 |
| `PlanValidationService.java` | `@WithSpan` on `validate()` | 6 |
| `ExecutionOrchestrator.java` | `@WithSpan` on `execute()` | 6 |
| `ResultSynthesisService.java` | `@WithSpan` on `synthesize()` | 6 |
| `ProtocolChatController.java` | `@WithSpan` on `streamRun()` | 6 |
| `ProtocolChatService.java` | `@WithSpan` on `streamRun()` | 6 |
| `McpProviderRegistryService.java` | `@WithSpan` on `callProvider()` | 6 |
| Various test files | Actuator health, metrics registration, span emission tests | 7 |

## 12. Implementation Phases

```
Phase 1 — Dependencies & build
    pom.xml: add all deps + maven-dependency-plugin
    Verify: mvn compile succeeds, agent JAR is downloaded to target/

Phase 2 — Actuator configuration
    application.yml: add management.* block
    Verify: startup shows /actuator/health, /actuator/metrics endpoints respond

Phase 3 — Environment variables
    .env.example: document OTEL_* vars
    ../../.env.profile.dev: add OTEL_* vars under chatbot-backend section
    Verify: env-cf picks them up at startup

Phase 4 — OpenTelemetry agent activation
    package.json: add -javaagent JVM arg
    Verify: startup logs show OTel agent initialization banner

Phase 5 — Metrics infrastructure
    ObservabilityConfig.java: Custom metrics beans (Gauge, Counter, Timer)
    RateLimitConfig.java: Wire rate-limit counter
    Verify: GET /actuator/metrics shows registered custom metrics

Phase 6 — Custom instrumentation spans
    AgentService.java, controllers, services: @WithSpan + programmatic spans
    Verify: log output contains structured JSON span lines with traceId linkage
    Verify: spans for a single request share the same traceId

Phase 7 — Tests
    Actuator health test, metrics registration test, span emission test
    Verify: mvn test passes
```

## 13. Future Migration Path

### To LangFuse (or any OTLP backend)

1. Set env vars:
   ```bash
   OTEL_EXPORTER_OTLP_ENDPOINT=https://your-langfuse-instance/api/public/otel
   OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <langfuse-public-key>
   OTEL_TRACES_EXPORTER=otlp
   OTEL_METRICS_EXPORTER=otlp
   ```
2. Remove `-Dotel.traces.exporter=logging` from JVM args
3. No code changes needed — all spans and metrics are already in OTLP format

### To Prometheus + Grafana

1. Add `io.micrometer:micrometer-registry-prometheus` dependency
2. Enable `prometheus` in `management.endpoints.web.exposure.include`
3. Point Prometheus at `GET /actuator/prometheus`
4. No code changes — same Micrometer metrics served via a different format

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `@WithSpan` on private methods silently ignored | Missing spans | Use programmatic `Span.current()` for private methods; reserve `@WithSpan` for public only |
| Async context loss | Broken trace trees | Wrap Runnables with `Context.current().wrap(...)` or `span.makeCurrent()` |
| Span attributes leak sensitive data | Security / compliance | Never add full prompt/response; only add truncated summaries; configure header capture exclusions |
| OTel SDK version conflict with agent jars | Classloader errors | Mark `opentelemetry-sdk` as `provided` scope; pin agent and SDK to same version |
| Log volume with trace logging | Storage costs | Dev: acceptable. Prod: set sampling (`traceidratio=0.1`) or switch to OTLP exporter |
| Reactor per-operator span noise | Span explosion | Set `otel.instrumentation.reactor.operator.kind-enabled=false` |
| Spring AI built-in metrics double-count | Inflated metric values | Audit `/actuator/metrics` for existing `spring.ai.*` metrics before adding custom LLM spans |
