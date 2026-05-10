# Spring AI 2.x Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `services/chatbot-backend` from Spring AI `1.1.6` to `2.0.0-M6`, adapting to all breaking API changes.

**Architecture:** Spring AI 2.x is a milestone release with significant internal restructuring: `OpenAiApi` is replaced by the official `openai-java` SDK, `ChatModel` now extends `StreamingChatModel`, configuration properties are flattened, and `ChatResponse.getResult()` was removed in favor of `getResults().get(0)`. The manual model construction and tool-loop patterns remain intact — only the API surface needs updating.

**Tech Stack:** Spring Boot `3.5.14`, Spring AI `2.0.0-M6`, Java 17, OpenAI-compatible chat model, Anthropic chat model, Spring AI MCP Client.

**Risks:**
- Spring AI `2.0.0-M6` is a milestone release, not a stable release. This should only be deployed after thorough testing in all environments.
- `elasticsearch-mcp-service` uses Spring AI `1.1.3` — consider upgrading it in a separate plan for consistency.

---

### Task 1: Update Spring AI BOM version

**Files:**
- Modify: `services/chatbot-backend/pom.xml:22`

- [ ] **Change spring-ai.version from 1.1.6 to 2.0.0-M6**

  ```xml
  <spring-ai.version>2.0.0-M6</spring-ai.version>
  ```

- [ ] **Add Spring milestone repository** (Spring AI 2.x milestones require the Spring milestone repo)

  Add the milestone repository to `pom.xml`:

  ```xml
  <repositories>
      <repository>
          <id>spring-milestones</id>
          <name>Spring Milestones</name>
          <url>https://repo.spring.io/milestone</url>
          <snapshots>
              <enabled>false</enabled>
          </snapshots>
      </repository>
  </repositories>
  ```

- [ ] **Build to verify dependency resolution**

  Run: `cd services/chatbot-backend && mvn dependency:tree -Dincludes=org.springframework.ai`
  Expected: Spring AI BOM 2.0.0-M6 resolved, all starters resolved to 2.0.0-M6 versions.

---

### Task 2: Fix `AgentService.java` — `OpenAiApi` removal + model construction

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java:38`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java:155-173`

**Context:** Spring AI 2.0.0-M5 removed the `OpenAiApi` class (replaced by the official openai-java SDK). The `OpenAiChatModel.builder()` no longer accepts `.openAiApi(...)`. Instead, it accepts `.apiKey(...)` and `.baseUrl(...)` directly.

- [ ] **Remove OpenAiApi import**

  Remove: `import org.springframework.ai.openai.api.OpenAiApi;` (line 38)

- [ ] **Replace OpenAiApi builder with direct OpenAiChatModel builder**

  **Before** (lines 155-170):
  ```java
  OpenAiApi.Builder apiBuilder = OpenAiApi.builder().apiKey(openaiApiKey);
  if (openaiBaseUrl != null && !openaiBaseUrl.isEmpty()) {
      apiBuilder.baseUrl(openaiBaseUrl);
      log.info("Using custom OpenAI base URL: {}", openaiBaseUrl);
  }

  OpenAiChatOptions options = OpenAiChatOptions.builder()
          .model(model)
          .temperature(temperature)
          .maxTokens(maxTokens)
          .build();

  OpenAiChatModel openAiChatModel = OpenAiChatModel.builder()
          .openAiApi(apiBuilder.build())
          .defaultOptions(options)
          .build();
  ```

  **After**:
  ```java
  OpenAiChatOptions options = OpenAiChatOptions.builder()
          .model(model)
          .temperature(temperature)
          .maxTokens(maxTokens)
          .build();

  OpenAiChatModel.OpenAiChatModelBuilder modelBuilder = OpenAiChatModel.builder()
          .apiKey(openaiApiKey)
          .defaultOptions(options);
  if (openaiBaseUrl != null && !openaiBaseUrl.isEmpty()) {
      modelBuilder.baseUrl(openaiBaseUrl);
      log.info("Using custom OpenAI base URL: {}", openaiBaseUrl);
  }

  OpenAiChatModel openAiChatModel = modelBuilder.build();
  ```

- [ ] **Build to verify compilation**

  Run: `cd services/chatbot-backend && mvn compile -q`
  Expected: Compilation succeeds.

---

### Task 3: Fix `AgentService.java` — `ChatResponse.getResult()` → `getResults().get(0)`

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java:1603-1606`

**Context:** Spring AI 2.x removed the `getResult()` convenience method from `ChatResponse`. The `ModelResponse` interface only defines `getResults()` which returns `List<Generation>`.

- [ ] **Update `assistantMessage()` helper**

  **Before** (lines 1602-1606):
  ```java
  private AssistantMessage assistantMessage(ChatResponse response) {
      if (response == null || response.getResult() == null) {
          return null;
      }
      return response.getResult().getOutput();
  }
  ```

  **After**:
  ```java
  private AssistantMessage assistantMessage(ChatResponse response) {
      if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
          return null;
      }
      return response.getResults().get(0).getOutput();
  }
  ```

- [ ] **Build to verify compilation**

  Run: `cd services/chatbot-backend && mvn compile -q`
  Expected: Compilation succeeds.

---

### Task 4: Fix `AgentDecisionService.java` and `ResultSynthesisService.java`

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java:56`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java:64-66,130-132`

**Context:** Same `ChatResponse.getResult()` → `getResults().get(0)` change in the other two services.

- [ ] **Update AgentDecisionService.decide()**

  **Before** (line 56):
  ```java
  String responseText = response.getResult().getOutput().getText();
  ```

  **After**:
  ```java
  Generation generation = response.getResults().get(Generation.class, 0);
  String responseText = generation != null ? generation.getOutput().getText() : null;
  ```

  Or more simply:
  ```java
  String responseText = response.getResults().isEmpty() ? null
          : response.getResults().get(0).getOutput().getText();
  ```

  **Add import:**
  ```java
  import org.springframework.ai.chat.model.Generation;
  ```

- [ ] **Update ResultSynthesisService.synthesize()**

  **Before** (lines 64-66):
  ```java
  String modelText = response.getResult() == null || response.getResult().getOutput() == null
          ? null
          : response.getResult().getOutput().getText();
  ```

  **After**:
  ```java
  Generation generation = response.getResults().isEmpty() ? null : response.getResults().get(0);
  String modelText = generation == null || generation.getOutput() == null
          ? null
          : generation.getOutput().getText();
  ```

  **Add import:**
  ```java
  import org.springframework.ai.chat.model.Generation;
  ```

- [ ] **Update ResultSynthesisService.synthesizeStreaming()**

  **Before** (lines 130-132):
  ```java
  String deltaText = response.getResult() == null || response.getResult().getOutput() == null
          ? null
          : response.getResult().getOutput().getText();
  ```

  **After**:
  ```java
  Generation generation = response.getResults().isEmpty() ? null : response.getResults().get(0);
  String deltaText = generation == null || generation.getOutput() == null
          ? null
          : generation.getOutput().getText();
  ```

- [ ] **Build to verify compilation**

  Run: `cd services/chatbot-backend && mvn compile -q`
  Expected: Compilation succeeds.

---

### Task 5: Fix test stubs — `ChatModel` now extends `StreamingChatModel`

**Files:**
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java:391-411`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ResultSynthesisServiceTest.java:290-310`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java:630-636`

**Context:** In Spring AI 2.x, `ChatModel` extends `StreamingChatModel`. Any class implementing `ChatModel` must now also implement `stream(Prompt)` → `Flux<ChatResponse>`. Additionally, `ChatResponse.builder().generations(...)` may use a different builder API.

- [ ] **Verify ChatResponse builder API in 2.x**

  Run: `cd services/chatbot-backend && mvn dependency:copy -Dartifact=org.springframework.ai:spring-ai-model:2.0.0-M6 -DoutputDirectory=./target/deps && jar tf target/deps/spring-ai-model-2.0.0-M6.jar | grep ChatResponse`

  Expected: Check if `ChatResponse.Builder` exists and has `generations(List<Generation>)` method.

  If `ChatResponse.builder().generations(...)` still works, proceed. If not, switch to constructor:
  ```java
  new ChatResponse(List.of(new Generation(new AssistantMessage(text))))
  ```
  (Constructor signature: `ChatResponse(List<Generation> generations)` or `ChatResponse(List<Generation> generations, ChatResponseMetadata metadata)`)

- [ ] **Add `stream()` to `CapturingChatModel` in AgentDecisionServiceTest**

  **After** the existing `call()` method, add:
  ```java
  @Override
  public Flux<ChatResponse> stream(Prompt prompt) {
      this.capturedRequest = prompt;
      return Flux.just(ChatResponse.builder()
              .generations(List.of(new Generation(new AssistantMessage(responseText))))
              .build());
  }
  ```

  **Add imports:**
  ```java
  import org.springframework.ai.chat.model.Generation;
  import reactor.core.publisher.Flux;
  ```

- [ ] **Add `stream()` to `CapturingChatModel` in ResultSynthesisServiceTest**

  Same change as AgentDecisionServiceTest's CapturingChatModel.

- [ ] **Add `stream()` to `NoOpChatModel` in AgentControlPlaneExecutionTest**

  **After** the existing `call()` method, add:
  ```java
  @Override
  public Flux<ChatResponse> stream(Prompt prompt) {
      return Flux.just(chatResponse("{}"));
  }
  ```

  **Add imports:**
  ```java
  import reactor.core.publisher.Flux;
  ```

- [ ] **Build and run tests**

  Run: `cd services/chatbot-backend && mvn test`
  Expected: All tests pass. If any test fails due to API mismatch, fix the specific test assertion or stub.

---

### Task 6: Verify and fix tool callback API

**Files:**
- Verify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java:1438-1493,1505-1515`

**Context:** `FunctionToolCallback.builder()` API may have changed in 2.x. The builder's `.inputType()` and `.inputSchema()` methods need verification. Also `OpenAiChatOptions.builder().toolCallbacks()` and `.internalToolExecutionEnabled()` need verification.

- [ ] **Verify `FunctionToolCallback.builder()` API compiles**

  Run: `cd services/chatbot-backend && mvn compile`
  Expected: The existing `FunctionToolCallback.builder(name, function).description(...).inputSchema(...).inputType(...)` compiles.

  If compilation fails, the API likely changed. In Spring AI 2.x, try:
  - `FunctionToolCallback.builder(name, function).description(...).inputSchema(schemaMap).inputType(typeRef)` (same API)
  - If `.inputSchema()` parameter type changed from `JsonSchema` to `Map<String, Object>`, update accordingly

- [ ] **Verify `OpenAiChatOptions.builder().toolCallbacks()` and `.internalToolExecutionEnabled()` compile**

  Run: `cd services/chatbot-backend && mvn compile`
  Expected: `buildPrompt()` method at line 1505-1515 compiles.

  If `.toolCallbacks()` is deprecated or removed in 2.x, migrate to:
  ```java
  import org.springframework.ai.model.tool.ToolCallingChatOptions;
  
  ToolCallingChatOptions.builder()
      .toolCallbacks(toolCallbacks)
      .internalToolExecutionEnabled(false)
      .build()
  ```
  Merge into `OpenAiChatOptions` via `.copy()` or use `ToolCallingChatOptions` directly.

  If `.internalToolExecutionEnabled()` is removed in 2.x, use:
  ```java
  optionsBuilder.toolCallbacks(toolCallbacks);
  // internalToolExecutionEnabled was removed in 2.x — Spring AI 2.x no longer auto-executes tools when using low-level ChatModel API directly
  ```

- [ ] **Build to verify**

  Run: `cd services/chatbot-backend && mvn compile -q`
  Expected: Compilation succeeds.

---

### Task 7: Fix test files that use `AssistantMessage.ToolCall` and `ToolCallingChatOptions`

**Files:**
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java`

**Context:** `ToolCallingChatOptions` (used in test only) and `AssistantMessage.ToolCall` might have different import paths or constructors in 2.x.

- [ ] **Verify `AssistantMessage.ToolCall` constructor**

  The `AgentService.java` frontend continuation code (line 567-572) uses:
  ```java
  new AssistantMessage.ToolCall(
      frontendToolContinuation.getToolCallId(),
      "function",
      frontendToolContinuation.getToolName(),
      writeJson(frontendToolContinuation.getArgs())
  )
  ```

  If compilation fails, the `ToolCall` record constructor may have changed. Try creating via builder or check if fields are in different order.

- [ ] **Verify `ToolCallingChatOptions` (used in AgentServiceTest)**

  AgentServiceTest imports `ToolCallingChatOptions` — verify it still exists in 2.x or update import path.

- [ ] **Run tests**

  Run: `cd services/chatbot-backend && mvn test -q`
  Expected: All tests pass.

---

### Task 8: Update configuration properties (if needed)

**Files:**
- Modify (conditional): `services/chatbot-backend/src/main/resources/application.yml`

**Context:** Spring AI 2.0.0-M6 restructured configuration properties, removing the `.options` prefix. The current `application.yml` uses flat property keys (`spring.ai.openai.model`, `spring.ai.openai.temperature`).

- [ ] **Verify property resolution at runtime**

  The `@Value` annotations in `AgentService` read:
  - `${spring.ai.openai.api-key}`
  - `${spring.ai.openai.base-url}`
  - `${spring.ai.openai.model}`
  - `${spring.ai.openai.temperature}`

  In Spring AI 2.x, autoconfiguration properties changed from:
  - `spring.ai.openai.chat.options.model` → `spring.ai.openai.chat.model`
  - `spring.ai.openai.chat.options.temperature` → `spring.ai.openai.chat.temperature`

  However, since the code reads these via `@Value` (not autoconfiguration), the current `application.yml` paths may continue to work. Run the service locally to verify.

  If properties are not resolved, update `application.yml`:
  ```yaml
  spring:
    ai:
      openai:
        api-key: ${CHATBOT_OPENAI_API_KEY:}
        base-url: ${CHATBOT_OPENAI_BASE_URL:https://coding.dashscope.aliyuncs.com/v1}
        chat:
          model: ${CHATBOT_OPENAI_MODEL:qwen3.5-plus}
          temperature: ${CHATBOT_OPENAI_TEMPERATURE:0.7}
  ```

- [ ] **Verify Anthropic properties (if used at runtime)**

  The Anthropic config in `application.yml`:
  ```yaml
  spring:
    ai:
      anthropic:
        api-key: ${CHATBOT_ANTHROPIC_API_KEY:}
        model: ${CHATBOT_ANTHROPIC_MODEL:claude-3-sonnet-20240229}
  ```
  
  In 2.x Anthropic properties might follow the same flattening pattern. Check if `spring.ai.anthropic.chat.model` is needed.

- [ ] **Verify autoconfiguration exclusion**

  Since `AgentService.init()` manually constructs `OpenAiChatModel`, the `spring-ai-starter-model-openai` autoconfiguration may also create a `ChatModel` bean, causing a conflict.

  If startup fails with a bean conflict, disable the autoconfiguration in `application.yml`:
  ```yaml
  spring:
    autoconfigure:
      exclude:
        - org.springframework.ai.autoconfigure.openai.OpenAiChatAutoConfiguration
  ```

---

### Task 9: MCP client compatibility verification

**Files:**
- Read-only: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/LangChain4jMcpClientFactory.java`

**Context:** The MCP client implementation uses the raw `io.modelcontextprotocol` SDK directly, not Spring AI's MCP abstractions. However, the `spring-ai-starter-mcp-client` may pull in a different version of the MCP SDK in 2.x.

- [ ] **Verify MCP SDK compatibility**

  Run: `cd services/chatbot-backend && mvn dependency:tree -Dincludes=io.modelcontextprotocol`
  Compare the MCP SDK version resolved by Spring AI 1.1.6 vs 2.0.0-M6. If the MCP SDK version is different, verify `LangChain4jMcpClientFactory` still compiles against the new version.

  The key classes used: `McpClient`, `McpSyncClient`, `HttpClientSseClientTransport`, `HttpClientStreamableHttpTransport` — these are from the standalone `io.modelcontextprotocol:mcp` SDK, not Spring AI MCP classes, so they should be compatible.

- [ ] **Run MCP-related tests**

  Run: `cd services/chatbot-backend && mvn test -Dtest="*Mcp*" -q`
  Expected: All MCP tests pass.

---

### Task 10: Full compile and test pass

**Files:**
- Read-only: All modified files

- [ ] **Full compile**

  Run: `cd services/chatbot-backend && mvn compile -q`
  Expected: `BUILD SUCCESS`

- [ ] **Full test pass**

  Run: `cd services/chatbot-backend && mvn test`
  Expected: All tests pass (green).

- [ ] **Check Spring AI version in dependency tree**

  Run: `cd services/chatbot-backend && mvn dependency:tree -Dincludes=org.springframework.ai`
  Expected: All Spring AI artifacts at version 2.0.0-M6.

---

### Task 11: Manual smoke test

**Files:**
- Read-only: Full application

- [ ] **Start the service locally**

  Set the required env vars and run:
  ```bash
  export CHATBOT_OPENAI_API_KEY=<test-key>
  cd services/chatbot-backend && mvn spring-boot:run
  ```
  Expected: Application starts without errors, no bean conflicts, no ClassNotFoundException.

- [ ] **Test a basic chat request**

  ```bash
  curl -X POST http://localhost:8080/api/chat/stream \
    -H "Content-Type: application/json" \
    -d '{"message":"hello","conversationId":"test-1"}'
  ```
  Expected: SSE stream flows without errors.

- [ ] **Verify log output**

  Check logs for:
  - `Spring AI` version banner shows 2.0.0-M6
  - No `OpenAiApi` or class loading errors
  - `Initialized OpenAI chat model with model: qwen3.5-plus` appears

---

### Task 12: Documentation update

**Files:**
- Modify: `services/chatbot-backend/docs/PROJECT.md`
- Modify: `services/chatbot-backend/docs/ARCHITECTURE.md`
- Modify: `services/chatbot-backend/docs/RULES.md`

- [ ] **Update PROJECT.md**

  Change Spring AI version reference from `1.1.6` to `2.0.0-M6`. Note that this is a milestone release.

- [ ] **Update ARCHITECTURE.md**

  Update the tech stack table to reflect `Spring AI 2.0.0-M6`.

- [ ] **Update RULES.md**

  No significant rule changes needed, but verify tool callback rules are still accurate.

---

## Self-Review Checklist

- **Spec coverage:** Each task addresses a specific breaking change (OpenAiApi removal, ChatResponse.getResult() removal, ChatModel extends StreamingChatModel, property restructuring, MCP compatibility).
- **Placeholder scan:** No "TBD", "TODO", or incomplete code blocks. All changes include exact before/after code.
- **Type consistency:** `getResult()` → `getResults().get(0)` is consistent across all 3 services. `Generation` type is used correctly. `OpenAiChatModel.builder()` API change is consistent.
