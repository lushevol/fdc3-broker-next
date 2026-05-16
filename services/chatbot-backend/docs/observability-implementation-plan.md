# Observability & OpenTelemetry Implementation Plan

> **For agentic workers:** This plan is implemented phase-by-phase in sequential order. Each phase depends on the previous.

**Goal:** Add OpenTelemetry-based observability with Micrometer metrics to chatbot-backend — tracing, custom spans, and metrics, exported to logs on Day 1.

**Files to modify/create:**
- `pom.xml` — Add deps + maven-dependency-plugin for OTel agent
- `src/main/resources/application.yml` — Add `management.*` config
- `.env.example` — Document OTEL_* vars
- `../../.env.profile.dev` — Add OTEL_* vars under chatbot-backend section
- `package.json` — Add `-javaagent` JVM arg
- `src/main/java/com/fdc3/chatbot/config/ObservabilityConfig.java` (new) — Custom metrics beans
- `src/main/java/com/fdc3/chatbot/config/RateLimitConfig.java` — Wire rate-limit counter
- `src/main/java/com/fdc3/chatbot/agent/AgentService.java` — Programmatic spans around streaming & agent loop
- `src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java` — `@WithSpan` on `decide()`
- `src/main/java/com/fdc3/chatbot/agent/PlanValidationService.java` — `@WithSpan` on `validate()`
- `src/main/java/com/fdc3/chatbot/agent/ExecutionOrchestrator.java` — `@WithSpan` on `execute()`
- `src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java` — `@WithSpan` on `synthesize()`
- `src/main/java/com/fdc3/chatbot/controller/ProtocolChatController.java` — `@WithSpan` on `streamRun()`
- `src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java` — `@WithSpan` on `streamRun()`
- `src/main/java/com/fdc3/chatbot/mcp/McpProviderRegistryService.java` — `@WithSpan` on `callProvider()`
- Various new test files — Actuator health, metrics registration, span emission

---

## Phase 1: Dependencies & Build

- [ ] **1.1** Add Spring Boot Actuator, Micrometer OTLP, OTel API, OTel annotations, OTel exporter, OTel SDK (provided scope) dependencies to `pom.xml`
- [ ] **1.2** Add maven-dependency-plugin to download OTel Java agent during build
- [ ] **1.3** Run `mvn compile` and verify success + agent JAR downloaded to `target/`

## Phase 2: Actuator Configuration

- [ ] **2.1** Add `management.*` block to `src/main/resources/application.yml`
- [ ] **2.2** Start service and verify `/actuator/health` and `/actuator/metrics` respond

## Phase 3: Environment Variables

- [ ] **3.1** Add OTEL_* vars to `.env.example`
- [ ] **3.2** Add OTEL_* vars to `../../.env.profile.dev` under chatbot-backend section

## Phase 4: OpenTelemetry Agent Activation

- [ ] **4.1** Update `package.json` dev command with `-javaagent` JVM arg
- [ ] **4.2** Verify startup logs show OTel agent initialization banner

## Phase 5: Metrics Infrastructure

- [ ] **5.1** Create `ObservabilityConfig.java` — custom metrics beans (Gauge backed by AtomicInteger, Counters, Timers)
- [ ] **5.2** Wire rate-limit counter into `RateLimitConfig.java`
- [ ] **5.3** Verify `GET /actuator/metricics` lists all custom metrics

## Phase 6: Custom Instrumentation Spans

- [ ] **6.1** Add programmatic spans to `AgentService.java`:
  - `processMessageStreaming(..., boolean)` — main entry span with conversation/agent attributes + context propagation for async Runnable
  - `executeAgenticControlLoop()` — per-phase spans (decision, plan validation, tool execution, synthesis)
  - LLM streaming call — model, temperature, token count, prompt summary attributes
- [ ] **6.2** Add `@WithSpan` to public methods in:
  - `AgentDecisionService.decide()`
  - `PlanValidationService.validate()`
  - `ExecutionOrchestrator.execute()`
  - `ResultSynthesisService.synthesize()`
- [ ] **6.3** Add `@WithSpan` to `ProtocolChatController.streamRun()` — protocol.run_id, model, parts_count
- [ ] **6.4** Add `@WithSpan` to `ProtocolChatService.streamRun()` — conversation count
- [ ] **6.5** Add `@WithSpan` to `McpProviderRegistryService.callProvider()` — provider.id, tool.name
- [ ] **6.6** Verify log output contains structured JSON span lines with traceId linkage

## Phase 7: Tests

- [ ] **7.1** Write actuator health check test
- [ ] **7.2** Write custom metrics registration test
- [ ] **7.3** Write span emission test
- [ ] **7.4** Run `mvn test` and verify all pass
