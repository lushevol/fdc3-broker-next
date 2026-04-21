# Chatbot-backend Tool 处理工作流程

## 一、整体架构

```
ProtocolChatController (HTTP)
    │
    ▼
ProtocolChatService (协议帧转换)
    │
    ▼
AgentService (AI编排 + LangChain4j)
    │
    ▼
ToolRegistry (工具注册表)
    ├─ Local Tools (本地Java)
    ├─ MCP Tools (远程MCP Provider)
    └─ Frontend Tools (前端工具)
```

## 二、Tool 分类与来源 (`ChatToolSource`)

| Source | 枚举值 | 执行目标 | 确认需求 | 说明 |
|--------|--------|----------|----------|------|
| **FRONTEND** | `frontend` | FRONTEND | 可选 | 前端渲染的tool，由用户在UI中执行 |
| **BACKEND** | `backend` | BACKEND | 否 | 后端Java实现的本地tool |
| **HUMAN** | `human` | FRONTEND | **必需** | 需要人工确认的敏感操作 |
| **MCP** | `mcp` | BACKEND | 否 | 外部MCP服务提供的tool |

## 三、Tool 处理流程

### 1. 请求接收

- `ProtocolChatController.streamRun()` → `ProtocolChatService.streamRun()`
- 解析 `ProtocolRunRequest`，提取 `messages`, `context.tools`, `context.frontendTools`

### 2. Tool 合并 (`mergeTools`)

```java
// ProtocolChatService.mergeTools()
1. 优先使用 request.context.getTools() (新协议格式)
2. 兼容 request.context.getFrontendTools() (遗留格式)
   → 转换为 ProtocolToolDescriptor
   → 根据 interactionMode 判断:
      "manual" → ChatToolSource.HUMAN
      其他   → ChatToolSource.FRONTEND
```

### 3. Tool 执行路径选择

#### 路径A: Agentic Control Loop (智能体模式)

```
条件: AgentService.shouldUseAgenticControlLoop() = true
      (capabilityResolver + agentDecisionService + planValidationService 可用)

流程:
AgentDecisionService.decide()
    → 决策类型: RESPOND | CLARIFY | PLAN
    ↓
PlanValidationService.validate()
    → PolicyEvaluator 策略检查
    ↓
ExecutionOrchestrator.execute()
    → 执行 Backend/MCP Tools
```

**决策类型说明:**
- `RESPOND`: 直接回复用户，无需tool
- `CLARIFY`: 需要澄清问题
- `PLAN`: 需要执行tool计划

#### 路径B: LangChain4j Tool-Calling (标准模式)

```
流程:
streamingChatModel.chat()
    → LLM 返回 ToolExecutionRequest
    → ToolRegistry.execute()
        ├─ Local Tools: 直接执行
        └─ MCP Tools: RemoteMcpToolDefinition.execute()
```

#### 路径C: Frontend Tool 流程

```
流程:
LLM 返回前端tool调用
    → ProtocolChatService 检测 executionTarget == FRONTEND
    → 发送 action-required 帧等待用户确认
    → 前端执行后返回结果
    → 继续conversation
```

## 四、关键处理策略

### 1. Frontend Tool 处理

```java
// ProtocolChatService.java:138-152
if (toolCall.getSource() == ChatToolSource.HUMAN
    || toolCall.isRequiresConfirmation()) {
    // 需要人工确认
    pendingFinishReason = "action-required";
    emit action-required 帧
} else if (toolCall.getExecutionTarget() == FRONTEND) {
    // 前端执行
    pendingFinishReason = "tool-calls";
}
```

### 2. Tool 执行目标映射

```java
// ProtocolChatService.enrichToolCallFromDescriptor()
if (source == HUMAN)    → executionTarget = FRONTEND
if (source == FRONTEND) → executionTarget = FRONTEND
// 默认 → executionTarget = BACKEND
```

| Source | → | ExecutionTarget |
|--------|---|--------------|
| HUMAN | | FRONTEND |
| FRONTEND | | FRONTEND |
| BACKEND | | BACKEND |
| MCP | | BACKEND |

### 3. Tool 结果 → Generative UI

```java
// ChatService.buildGenerativeUiDirective()
根据 toolName 转换��� UI Card:

- calculator → Card (计算结果: expression = result)
- get_weather → Card (天气摘要: location, temperature, conditions)
- get_current_time → Card (当前时间: timezone, formatted)
- get_weather_history → weather-summary Card
- resolve_relative_date → Card (日期解析结果)
```

### 4. MCP Tool 注册

```java
// McpProviderRegistryService.register()
1. MCP Client 连接远程服务
2. listTools() 获取工具清单
3. RemoteMcpToolDefinition 包装
4. ToolRegistry.registerMcpProvider()

// RemoteMcpToolDefinition 继承 ToolDefinition
.execute() → session.execute(toolName, arguments)
```

### 5. Policy 策略评估 (可选路径B)

```java
// AgentService.executeGovernedPlan()
PolicyDecision = policyEvaluator.evaluate(ResolvedCapability)

决策结果:
- ALLOW: 直接执行
- DENY: 返回错误
- REVIEW_REQUIRED: 等待审批 (设置 requiresConfirmation = true)
```

## 五、协议帧流 (SSE)

```
Start Frame → Message Start → Text Start → Text Delta* →
[Tool Input Start → Tool Input Available]*
[Action Required] (等待确认) →
[Tool Output Available | Tool Output Error]*
[UI Part Available]* →
Finish → Complete
```

| 帧类型 | 说明 |
|--------|------|
| `start` | 会话开始 |
| `message-start` | 助手消息开始 |
| `text-start` | 文本块开始 |
| `text-delta` | 流式文本片段 |
| `text-end` | 文本块结束 |
| `tool-input-start` | Tool调用开始 |
| `tool-input-available` | Tool输入参数 |
| `tool-output-available` | Tool执行成功结果 |
| `tool-output-error` | Tool执行错误 |
| `action-required` | **等待用户确认** (HUMAN tool) |
| `ui-part-available` | 渲染UI Card |
| `finish` | 消息结束 |
| `plan-available` | 执行计划可用 |
| `start-step` | 步骤开始 |
| `step-status` | 步骤状态 |
| `finish-step` | 步骤完成 |

## 六、核心类图

### ToolCall

```java
public class ToolCall {
    private String id;
    private String name;
    private Map<String, Object> arguments;
    private ToolStatus status;  // PENDING, RUNNING, COMPLETED, FAILED
    private ExecutionTarget executionTarget;  // BACKEND, FRONTEND
    private ChatToolSource source;
    private String providerId;
    private boolean requiresConfirmation;
}
```

### ToolDefinition (接口)

```java
public interface ToolDefinition {
    String getName();
    String getDescription();
    Map<String, Object> getParameters();

    default boolean requiresConfirmation() { return false; }

    CompletableFuture<Object> execute(Map<String, Object> arguments);
}
```

### ToolRegistry

```java
public class ToolRegistry {
    private Map<String, RegisteredTool> localTools;        // 本地Java tool
    private Map<String, RegisteredMcpProviderState> mcpProviders;  // MCP tool
    private Map<String, ToolDefinition> resolvedToolCache;

    void register(ToolDefinition tool);
    void registerMcpProvider(RegisteredMcpProvider provider, Map<String, ToolDefinition> tools);
    CompletableFuture<Object> execute(String name, Map<String, Object> arguments);
}
```

### ExecutionOrchestrator

```java
public class ExecutionOrchestrator {
    // 执行已验证的计划步骤
    public ExecutionTranscript execute(
            ValidatedExecutionPlan plan,
            Consumer<ToolCall> onToolCall,
            Consumer<ToolResult> onToolResult
    )
}
```

## 七、本地 Tool 示例

### WeatherTool

```java
@Component
public class WeatherTool implements ToolDefinition {
    @Override
    public String getName() { return "get_weather"; }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String location = (String) arguments.get("location");
            // 调用真实天气API或���回mock数据
            return Map.of(
                "location", location,
                "temperature", 22,
                "temperatureUnit", "Celsius",
                "conditions", "Partly Cloudy"
            );
        });
    }
}
```

### 其他内置工具

| Tool Name | 说明 |
|----------|------|
| `calculator` | 数学计算 |
| `get_weather` | 获取天气 |
| `get_weather_history` | 历史天气 |
| `get_current_time` | 当前时间 |
| `resolve_relative_date` | 相对日期解析 |

## 八、请求上下文

### ProtocolRunContext

```java
ProtocolRunContext {
    workspace: ProtocolWorkspaceContext  // 工作区上下文
    tools: List<ProtocolToolDescriptor>  // 工具描述 (新格式)
    frontendTools: List<ProtocolFrontendTool>  // 前端工具 (遗留格式)
}

ProtocolToolDescriptor {
    name: String
    source: ChatToolSource  // FRONTEND | BACKEND | HUMAN | MCP
    description: String
    parameters: JsonNode
    requiresConfirmation: Boolean
    providerId: String
}
```

## 九、流程图

### 完整请求处理流程

```
┌─────────────────────────────────────────────────────────────┐
│                ProtocolChatController                  │
│              POST /api/chat/runs                    │
└─────────────────────┬───────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              ProtocolChatService.streamRun()              │
│  1. mergeTools() 合并工具定义                     │
│  2. 构建ProtocolInvocation                     │
│  3. 发送 start, message-start 帧               │
└─────────────────────┬───────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              AgentService.processMessageStreaming()          │
│                                                      │
│  ┌─────────────────────────────────────────────┐       │
│  │ Agentic Control Loop (路径A)                │       │
│  │  decide() → validate() → execute()         │       │
│  └─────────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────────┐       │
│  │ LangChain4j Tool-Calling (路径B)           │       │
│  │  chat() → LLM → execute()                 │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────┬───────────────────────────────┘
                    ▼
            ┌───────────────┴───────────────┐
            ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  Backend Tool       │     │  Frontend Tool      │
│  (ExecutionTarget  │     │  (ExecutionTarget  │
│   = BACKEND)      │     │   = FRONTEND)      │
│                   │     │                   │
│ ToolRegistry.execute│    │ emit action-required│
│ → ToolDefinition  │     │ → 等待用户确认      │
│ → 返回结果       │     │ → 前端执行        │
└─────────────────────┘     └─────────────────────┘
            │                           │
            └───────────┬───────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              发送 Tool Result 帧                        │
│  - tool-output-available / tool-output-error              │
│  - ui-part-available (Generative UI)                   │
│  - finish                                         │
└─────────────────────────────────────────────────────────────┘
```

## 十、配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `chatbot.agent.max-tokens` | 最大token数 | 4096 |
| `chatbot.agent.name` | Agent名称 | FDC3 Assistant |
| `chatbot.mock.enabled` | Mock模式 | false |
| `chatbot.agent.legacy-governed-planner-enabled` | 传统规划器 | false |
| `spring.ai.openai.api-key` | OpenAI API Key | - |
| `spring.ai.openai.base-url` | OpenAI Base URL | - |
| `spring.ai.openai.model` | 模型名 | gpt-4 |
| `spring.ai.openai.temperature` | 温度 | 0.7 |