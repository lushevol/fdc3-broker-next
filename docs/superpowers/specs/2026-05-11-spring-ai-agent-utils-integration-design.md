# Spring AI Agent Utils Integration Design

## Overview

Integrate [spring-ai-agent-utils](https://github.com/spring-ai-community/spring-ai-agent-utils) v0.7.0 into the chatbot-backend service to add web content fetching, user feedback polling, agent skills, and task orchestration with multi-agent sub-delegation.

Organized into two phases:

- **Day 1 (this spec):** Hybrid registration — agent-utils tools wrapped as `ToolDefinition` adapters + `ToolCallback` fallback for the existing execution loop
- **Day 2 (future):** Migrate to `ChatClient.builder()` with advisors, remove the adapter layer

---

## Day 1 — Hybrid Registration with Unified Execution

### Architecture Decision: Execution Loop Compatibility

The existing `AgentService` uses a manual tool execution loop (`streamConversation` → `continueWithToolRequests`) with `internalToolExecutionEnabled=false`. Adding new tools requires both (a) registering them in the model prompt AND (b) making them executable in the manual loop.

**Solution — Three-tier tool map:**

```
buildToolCallbacks() → merged Map<String, ToolCallback> for the prompt
availableTools     → Map<String, ToolDefinition>: existing ToolDefinition tools (unchanged)
executableCallbacks → Map<String, ToolCallback>: agent-utils tools injected via constructor

continueWithToolRequests():
  1. Check availableTools (ToolDefinition) → existing execute() path
  2. If not found, check executableCallbacks (ToolCallback) → call callback.call(request)
  3. If neither, return "Tool not available" error
```

This minimizes changes to the existing flow while ensuring new tools are both advertised to the model and actually executable.

### Dependencies

**pom.xml additions:**

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springaicommunity</groupId>
      <artifactId>spring-ai-agent-utils-bom</artifactId>
      <version>0.7.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>org.springaicommunity</groupId>
    <artifactId>spring-ai-agent-utils</artifactId>
  </dependency>
</dependencies>
```

**⚠️ Compile runtime verification required:** v0.7.0 was compiled against Spring AI 2.0.0-M3 and Spring Framework 7.0.1 (provided scope). The project uses Spring Boot 3.5.14 / Spring AI 2.0.0-M6. The `spring-ai-client-chat` and `spring-web` are `provided` scope in the library, so Maven will resolve them from the project's own BOM. Phase 1 must include a `mvn compile` spike to verify.

### Configuration

**`AgentUtilsProperties.java`** — `@ConfigurationProperties("chatbot.agent-utils")`:

```yaml
chatbot:
  agent-utils:
    web-fetch:
      enabled: true
      user-agent: "FDC3-Chatbot/1.0"
    skills:
      enabled: true
      location: classpath:skills/
    ask-user:
      enabled: true
    todo:
      enabled: true
    tasks:
      enabled: true
      sub-agent-config:
        default-model: ${CHATBOT_OPENAI_MODEL:qwen3.5-plus}
```

### Tool Registration Architecture

```
AgentUtilsConfig (@Configuration)
  │
  ├─ SmartWebFetchTool       → @Tool POJO, requires ChatClient
  ├─ AskUserQuestionTool     → @Tool POJO, requires QuestionHandler
  ├─ TodoWriteTool           → @Tool POJO, requires TodoEventHandler
  ├─ SkillsTool.builder()    → produces ToolCallback
  └─ TaskTool.builder()      → produces ToolCallback (requires ChatClient.Builders + SubagentReference)

AgentUtilsConfig also exposes:
  ├─ List<ToolCallback> agentUtilsToolCallbacks     ← injected into AgentService
  │    (SmartWebFetch, AskUserQuestion, TodoWrite wrapped via ToolCallbacks.from()
  │     + SkillsTool callback + TaskTool callback)
  │
  └─ List<ChatClient.Builder> subAgentChatClients   ← for TaskTool sub-agents

AgentService
  ├─ existing Map<String, ToolDefinition> availableTools (unchanged)
  └─ new Map<String, ToolCallback> executableCallbacks ← from agentUtilsToolCallbacks
     → fallback execution path in continueWithToolRequests()
```

### Per-Tool Integration

#### SmartWebFetchTool

- **Library class:** `org.springaicommunity.agent.tools.SmartWebFetchTool`
- **Registration:** `@Tool` POJO — wrapped as `ToolCallback` via `ToolCallbacks.from(bean)`
- **Requires:** `ChatClient` (not ChatModel) for AI summarization
- **Config:**
  ```java
  ChatClient webFetchChatClient = ChatClient.builder(chatModel).build();
  SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
      .maxContentLength(50000)
      .domainSafetyCheck(false)
      .build();
  ```
- **Tool name:** `WebFetch` (from the `@Tool(name = "WebFetch")` annotation)
- **Parameters:** `url` (string), `prompt` (string)
- **Returns:** AI-summarized web content as text
- **Execution:** Wrapped `ToolCallback` → falls into `executableCallbacks` path in `continueWithToolRequests()`

#### AskUserQuestionTool

- **Library class:** `org.springaicommunity.agent.tools.AskUserQuestionTool`
- **Registration:** `@Tool` POJO with custom `QuestionHandler`
- **Tool name:** `AskUserQuestionTool`
- **Parameters:** `questions` (list of Question objects), `answers` (optional pre-filled answers map)
- **Question model:**
  ```java
  Question(question: String, header: String, options: List<Option>, multiSelect: Boolean)
  Option(label: String, description: String)
  ```
- **QuestionHandler interface:** `Map<String, String> handle(List<Question> questions)` — returns map keyed by question text

**SSE integration flow:**
1. `QuestionHandler.handle()` is called → stores pending questions keyed by `conversationId`
2. Returns a `CompletableFuture<Map<String, String>>` that blocks until user responds
3. AgentService emits a `user_question` SSE event with the question payload
4. Frontend displays question, user selects answer(s)
5. Frontend calls `POST /api/chat/{conversationId}/question/{questionId}/answer`
6. Backend completes the CompletableFuture → tool resumes → model processes the answer

**Pending question registry:**
```java
// Keyed by conversationId:questionId
private final Map<String, CompletableFuture<Map<String, String>>> pendingQuestions = new ConcurrentHashMap<>();
// Configurable timeout (default 5 minutes)
// On timeout: complete exceptionally, tool resumes with error
```

**Endpoint:**
```
POST /api/chat/{conversationId}/question/{questionId}/answer
Body: { "answers": { "question text": "selected option label" } }
```

#### TodoWriteTool

- **Library class:** `org.springaicommunity.agent.tools.TodoWriteTool`
- **Registration:** `@Tool` POJO with `TodoEventHandler`
- **TodoEventHandler:** Receives `Todos` (list of TodoItem records) on each tool invocation
- **Handler implementation:** Persists tasks in `ConcurrentHashMap<String, Todos>` keyed by conversation ID
- **Tool name:** `TodoWrite`
- **Parameters:** `todos` — a `Todos` record with `List<TodoItem>`, each with `content`, `status` (pending/in_progress/completed), `activeForm`
- **Execution:** Wrapped `ToolCallback` → `executableCallbacks` path

#### SkillsTool

- **Library class:** `org.springaicommunity.agent.tools.SkillsTool`
- **Registration:** Builder → `ToolCallback`
- **Skills directory pattern (REQUIRED):**
  ```
  src/main/resources/skills/
    ├── fdc3-basics/
    │   └── SKILL.md          ← file MUST be named SKILL.md
    └── financial-terms/
        └── SKILL.md
  ```
  Each `SKILL.md` has YAML front-matter:
  ```yaml
  ---
  name: fdc3-basics
  description: FDC3 standard fundamentals, intents, and context types
  ---
  # FDC3 Basics
  ...
  ```
- **Builder usage:**
  ```java
  ToolCallback skillsCallback = SkillsTool.builder()
      .addSkillsResource(new ClassPathResource("skills"))
      .build();
  ```
- **Tool name:** `Skill`
- **Execution:** Direct `ToolCallback` → `executableCallbacks` path

#### TaskTool (Multi-Agent)

- **Library classes:**
  - `org.springaicommunity.agent.tools.task.TaskTool` — builder
  - `org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType` — subagent type factory
  - `org.springaicommunity.agent.tools.task.claude.ClaudeSubagentReferences` — loads agent definitions from classpath
  - `org.springaicommunity.agent.tools.task.repository.DefaultTaskRepository` — in-memory task storage for bg tasks
- **Registration:** Builder → `ToolCallback`
- **Requires:** `Map<String, ChatClient.Builder>` for sub-agent execution (must include a `"default"` key)
- **Sub-agent agent definitions:** `src/main/resources/agents/` as Markdown files with YAML front-matter
- **ClaudeSubagentType setup:**
  ```java
  ClaudeSubagentType subagentType = ClaudeSubagentType.builder()
      .chatClientBuilder("default", ChatClient.builder(chatModel))
      .skillsResources(new ClassPathResource("skills"))
      .build();
  ```
- **SubagentReferences:**
  ```java
  List<SubagentReference> refs = ClaudeSubagentReferences
      .fromResources(new ClassPathResource("agents"));
  ```
- **Builder:**
  ```java
  ToolCallback taskCallback = TaskTool.builder()
      .subagentReferences(refs)
      .subagentTypes(subagentType.build())
      .build();
  ```
- **Tool name:** `Task` (or configurable via template)
- **Sub-agent types:**
  - `general-purpose` — default, full tool access
  - `explore` — read-only exploration (defined in `agents/explore.md`)

#### Example agent definition (`src/main/resources/agents/explore.md`):

```yaml
---
name: explore
description: Read-only web research agent
tools: [WebFetch]
disallowedTools: [TodoWrite, Task]
---
You are a research assistant. Your job is to find information and summarize
it concisely for the main agent. You only have read-only tools available.
```

### AgentService Changes

**New injected dependency:**
```java
@Autowired(required = false)
List<ToolCallback> executableToolCallbacks = List.of();
```

**New field:**
```java
private final Map<String, ToolCallback> executableCallbackMap = new ConcurrentHashMap<>();
```

**During init:**
```java
for (ToolCallback callback : executableToolCallbacks) {
    executableCallbackMap.put(
        callback.getToolDefinition().name(), callback);
}
```

**Modified `buildToolCallbacks()`** — adds agent-utils callbacks for schema registration:
```java
// New: merge all callbacks for prompt registration
Map<String, ToolCallback> merged = new LinkedHashMap<>();
// existing ToolDefinition → FunctionToolCallback bridge
// + frontend tools
// + executableToolCallbacks (agent-utils)
return List.copyOf(merged.values());
```

**Modified `continueWithToolRequests()` execution path (around line 1342):**
```java
ToolDefinition toolDefinition = availableTools.get(toolExecutionRequest.name());
if (toolDefinition == null) {
    // Fallback: check executable callbacks (agent-utils tools)
    ToolCallback callback = executableCallbackMap.get(toolExecutionRequest.name());
    if (callback != null) {
        executeAgentUtilsCallback(conversationId, messages, callback,
            toolExecutionRequest, arguments, index, /* rest of params */);
        return;
    }
    onError.accept(new IllegalArgumentException("Tool not available: " 
        + toolExecutionRequest.name()));
    return;
}
```

**New execution method:**
```java
private void executeAgentUtilsCallback(
    String conversationId,
    List<Message> messages,
    ToolCallback callback,
    AssistantMessage.ToolCall toolExecutionRequest,
    Map<String, Object> arguments,
    int index,
    /* ... other params ... */
) {
    ToolExecutionRequest request = ToolExecutionRequest.builder()
        .id(toolExecutionRequest.id())
        .name(toolExecutionRequest.name())
        .arguments(writeJson(arguments))
        .build();
    
    try {
        Object result = callback.call(request);
        ToolResult toolResult = ToolResult.builder()
            .toolCallId(toolExecutionRequest.id())
            .result(result)
            .build();
        onToolResult.accept(toolResult);
        // Continue to next tool or stream completion
        continueWithToolRequests(/* next index */);
    } catch (Exception e) {
        onToolResult.accept(ToolResult.builder()
            .toolCallId(toolExecutionRequest.id())
            .error(e.getMessage())
            .build());
        onComplete.run();
    }
}
```

### New SSE Event: `user_question`

```json
event: user_question
data: {
  "type": "user_question",
  "conversationId": "uuid",
  "questionId": "uuid",
  "questions": [
    {
      "question": "Which report period would you like to analyze?",
      "header": "Period",
      "options": [
        {"label": "Last 7 days", "description": "Most recent week"},
        {"label": "Last 30 days", "description": "Monthly view"},
        {"label": "Custom range", "description": "Pick specific dates"}
      ],
      "multiSelect": false
    }
  ]
}
```

### Directory Structure

```
src/main/resources/
├── skills/                          ← SkillsTool resource directory
│   ├── fdc3-basics/
│   │   └── SKILL.md
│   └── financial-terms/
│       └── SKILL.md
└── agents/                          ← TaskTool sub-agent definitions
    ├── general-purpose.md
    └── explore.md
```

### New Java classes

```
config/
├── AgentUtilsConfig.java            ← @Configuration: instantiates & wires all tools
└── AgentUtilsProperties.java        ← @ConfigurationProperties

tool/agent-utils/
└── ToolExecutionBridge.java         ← Maps + dispatches to both ToolDefinition and ToolCallback

controller/
└── QuestionController.java          ← POST /api/chat/{id}/question/{qid}/answer

model/
└── UserQuestionEvent.java           ← SSE event model for ask_user
```

---

## Day 2 — ChatClient Migration (Future Spec)

### What Changes

1. **Replace `ChatModel`/`StreamingChatModel` with `ChatClient.builder()`**
2. **Replace manual tool loop** with `ToolCallAdvisor` — `ToolCallback`s execute natively
3. **Replace manual conversation management** with `MessageChatMemoryAdvisor`
4. **Remove `ToolDefinition` bridge** — existing tools refactored to `ToolCallback` / `@Tool` POJO
5. **Remove `ToolExecutionBridge`** — no longer needed
6. **Move agentic control loop** to advisors or a separate orchestrator

### What Stays the Same

- All agent-utils `@Tool` POJOs and `ToolCallback` tools — zero changes
- `AgentUtilsConfig` — unchanged
- `AgentUtilsProperties` — unchanged
- SSE event types, protocol frame format — unchanged
- Skills, agent definitions — unchanged

---

## Phased Delivery

### Phase 1 (Core infrastructure — compile spike)
- Add pom.xml dependency + BOM
- `AgentUtilsProperties` + `AgentUtilsConfig` skeleton
- `mvn compile` to verify Spring AI M3 vs M6 compatibility
- Adjust if needed (exclusions, version alignment)

### Phase 2 (Web + Skills)
- `SmartWebFetchTool` — ChatClient bean + ToolCallback wrapper
- `SkillsTool.builder()` + example skill files
- Add skills directory with SKILL.md structure

### Phase 3 (Feedback + Task Management)
- `AskUserQuestionTool` — QuestionHandler + SSE integration + QuestionController
- `TodoWriteTool` — TodoEventHandler + conversation-scoped storage
- `UserQuestionEvent` SSE model + pending question registry

### Phase 4 (Multi-Agent)
- `ClaudeSubagentType.builder()` + ChatClient.Builders map
- `TaskTool.builder()` + sub-agent definitions
- Agent definition files under `src/main/resources/agents/`

### Phase 5 (AgentService Integration + ToolExecutionBridge)
- Modify `AgentService.buildToolCallbacks()` to merge agent-utils callbacks
- Add `executableCallbackMap` + fallback execution path in `continueWithToolRequests()`
- `ToolExecutionBridge` as coordination point
- All unit + integration tests
- End-to-end verification with streaming SSE flow

### Phase 6 (Testing)

| Test | What it verifies |
|------|-----------------|
| `SmartWebFetchCallbackTest` | Tool executes via callback execution path |
| `AskUserQuestionHandlerTest` | QuestionHandler SSE flow + response endpoint |
| `SkillsToolTest` | Loads SKILL.md from classpath per-skill directories |
| `TodoWriteHandlerTest` | TodoEventHandler receives and stores todos |
| `TaskToolTest` | Creates sub-agent with correct ChatClient.Builder |
| `AgentUtilsConfigTest` | All beans created with correct tool names |
| `AgentUtilsPropertiesTest` | Configuration binding |
| `ToolExecutionBridgeTest` | Fallback dispatch from ToolDefinition to ToolCallback |
| `AgentServiceToolMergingTest` | Integration: model calls agent-utils tool → executes via fallback path |

---

## Spec Self-Review

1. **Placeholder scan:** All sections filled. No TBDs.
2. **Internal consistency:** Tool execution path (P0) fixed via `executableCallbackMap` fallback. Day 1 adapter layer is removable for Day 2. Skill layout, AskUserQuestion contract, and TodoWrite handler all match the actual library APIs.
3. **Scope check:** Focused on the integration. Phase 1 compile spike catches M3/M6 incompatibility early.
4. **Ambiguity check:** Tool names match the library's `@Tool(name=...)` annotations. AskUserQuestion flow has a single defined endpoint and SSE event schema. Skills directory structure requires per-subdirectory `SKILL.md` files.
