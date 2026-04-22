# Chatbot Backend Agent 化最终执行版计划

## 1. 目标范围

本次改造只做三件事：

1. 统一 API 接口
2. 统一 Tool 注册与暴露行为
3. 删除历史遗留代码

本次**不做**：

- 自定义业务行为保留或增强
- weather / analytics / email 等 custom chaining
- backend 侧 custom UI card 生成
- 新审批流设计
- 新 continuation 机制设计

原则：

- 优先做 100% 确定安全的收敛
- 不确定或高风险的操作后置
- 删除的是遗留实现和 custom behavior，不先动 shared protocol 的正式能力

## 2. 最终目标形态

收敛后的主链路：

```text
ProtocolChatController
  -> ProtocolChatService
    -> AgentService
      -> ToolRegistry
      -> CapabilityResolver
      -> PlanValidationService
      -> ExecutionOrchestrator
      -> MCP / Local Tools
```

收敛后的边界：

- API 入口只保留正式协议接口
- Tool 来源统一通过一套 descriptor 暴露
- Agent 只负责通用 tool 决策与执行
- 不再在 backend 中写业务特判和 fallback 推理

## 3. 100% 确定可执行部分

这些改动我认为可以直接进入执行，不会改变 shared protocol 的核心语义。

### 3.1 统一 API：以 `/api/chat/runs` 为正式接口

目标：

- 以 `ProtocolRunRequest` 为唯一正式请求模型
- 以 `/api/chat/runs` 为唯一正式流式接口

执行动作：

1. 文档标记 `/api/chat/stream` 为 legacy / deprecated
2. 所有新代码、新 demo、新调用统一走 `/api/chat/runs`
3. backend 内部不再扩展 `ChatRequest` 语义

当前结论：

- 这是确定方向
- 但 `/stream` 是否立刻删除，要放到后置阶段，因为仓库里仍有旧 e2e 和调用痕迹

### 3.2 删除 `ChatService`

文件：

- `src/main/java/com/fdc3/chatbot/service/ChatService.java`

原因：

- 重复封装 `AgentService`
- 自己维护 conversation state
- 重复做 `GenerativeUIDirective` 映射
- 已不是正式协议主路径的必要组成部分

结论：

- 可以删除
- 前提是没有外部 controller 或 service 仍直接依赖它

### 3.3 删除 legacy planner 和 governed fallback flow

文件：

- `src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`

方法：

- `AgentService.shouldUseLegacyGovernedReadOnlyMcpFlow()`
- `AgentService.executeGovernedPlan()`
- `AgentService.buildGovernedPlanSummary()`
- `AgentService.enrichGovernedToolResult()`

原因：

- 明确是 legacy fallback
- 引入业务特例和补跑逻辑
- 不属于统一 Tool Agent 的核心

结论：

- 可以删除
- 这是内部执行路径收敛，不依赖 shared contract

### 3.4 删除 heuristic tool 触发和 custom fallback

文件：

- `src/main/java/com/fdc3/chatbot/agent/AgentService.java`

方法：

- `shouldUseTools()`
- `inferFallbackToolPlan()`
- `inferResolvedDateFollowup()`
- `extractRelativeDateExpression()`
- `stripDateExpression()`
- `extractWeatherLocation()`
- `extractRecipientEmail()`
- `extractRecipientName()`
- `buildSickLeaveEmailBody()`
- `extractAnalyticsApplication()`
- `selectAnalyticsToolName()`
- `hasFrontendTool()`

原因：

- 这些方法在替模型做决策
- 属于典型 custom behavior
- 与“统一 Tool 注册 + 通用 Agent 行为”的目标冲突

注意：

- 删除后会改变现有行为
- 但这是你明确要删掉的 custom behavior，属于目标内变更

结论：

- 可以删除
- 但要同步修正测试和文档，明确这是有意变化

### 3.5 删除 backend 侧 tool-result -> UI card 的 hardcode

文件：

- `src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- `src/main/java/com/fdc3/chatbot/service/ChatService.java`
- `src/main/java/com/fdc3/chatbot/model/GenerativeUIDirective.java`

删除目标：

- 按 `toolName` 判断并组装 `Card` / `weather-summary` 的 switch-case 逻辑

原因：

- 这是 custom behavior
- 与“只做统一 API / Tool 行为”不一致

注意：

- 这里删的是 hardcoded mapping
- 不是立刻删协议里的 `card` / `ui-part-available` 能力

结论：

- 可以删除 hardcode
- 协议能力本身先保留

### 3.6 统一 Tool 注册入口为 `context.tools`

目标：

- 后端只认一种正式 tool 描述格式
- 工具注册和暴露行为统一

正式字段：

- `name`
- `source`
- `description`
- `parameters`
- `providerId`
- `requiresConfirmation`
- `ui`

执行动作：

1. 以 `ProtocolToolDescriptor` / contract `ChatToolDescriptor` 为唯一 tool 描述模型
2. `ToolRegistry` 继续作为唯一工具目录
3. frontend / backend / mcp / human 都通过统一 descriptor 暴露

结论：

- 这是本次最核心、最确定的收敛目标

## 4. 需要保留但暂不重做的协议能力

这些能力现在虽然实现不完美，但它们已经属于现有协议或调用面的一部分，本次不应直接删除。

### 4.1 `submit-tool-result`

原因：

- `chat-protocol-contract` 已定义
- demo 与 e2e 已依赖

当前策略：

- 先保留
- 但不继续扩展私有 `toolContext` 方案

### 4.2 `action-required`

原因：

- shared contract 已定义 finish reason 和 frame

当前策略：

- 先保留协议语义
- 不在本次新增/扩展审批实现

### 4.3 `card` / `ui-part-available`

原因：

- 这是 contract 正式组成部分

当前策略：

- 保留协议能力
- 删除 backend hardcode 生成逻辑
- 后续再决定由 agent 输出还是前端 renderer 派生

## 5. 高危或不确定操作：全部后置

这些操作不是不能做，而是不适合放在第一轮“统一 API / Tool 行为 / 删遗留代码”里。

### 5.1 立即删除 `/api/chat/stream`

风险：

- 仓库内仍有旧测试与调用痕迹

后置条件：

- 确认所有调用方已迁移到 `/runs`

### 5.2 立即删除 `ChatRequest`

风险：

- 它仍然是 `/stream` 的输入模型

后置条件：

- `/stream` 被移除后再删

### 5.3 立即删除 `context.frontendTools`

风险：

- backend 当前仍在兼容旧输入
- 可能还有前端调用方使用

后置条件：

- 完成调用面盘点
- 前端统一改发 `context.tools`

### 5.4 立即删除 `toolContext` continuation

风险：

- 当前 backend continuation 依赖它
- 如果直接删而不切到“从 request history 恢复”，会打断 continuation

后置条件：

- 明确重构为基于 `messages` 历史恢复 continuation

### 5.5 立即删除 `action-required` / `card` / `submit-tool-result`

风险：

- 这会直接破坏 shared contract
- 会打破 demo / e2e / 前端消费逻辑

后置条件：

- 只有当 contract 升级并全链路迁移完成后才能做

## 6. 分阶段执行顺序

### Phase A：低风险收敛

1. 更新文档，确认 `/runs` 为唯一正式接口
2. 标记 `/stream` deprecated，不立刻删除
3. 删除 `ChatService`
4. 删除 `ExecutionPlanner`
5. 删除 legacy governed flow
6. 删除 fallback heuristics / custom chaining
7. 删除 backend hardcoded UI mapping
8. 清理相关测试与文档

### Phase B：统一 Tool 描述

1. 明确 `context.tools` 为唯一正式 tool descriptor
2. 保留 `frontendTools` 兼容输入，但标记 deprecated
3. 统一所有 tool source 的暴露逻辑
4. 让 `ToolRegistry` 成为唯一工具总表

### Phase C：后置高风险清理

1. 删除 `/stream`
2. 删除 `ChatRequest`
3. 删除 `context.frontendTools`
4. 删除 `toolContext` 私有 continuation
5. 重做 continuation 为 request-history 驱动
6. 视需要再处理 action / card 的实现收口

## 7. 文件级执行清单

### 第一批直接动

- `src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- `src/main/java/com/fdc3/chatbot/service/ChatService.java`
- `src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
- `src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/TOOL_WORKFLOW.md`

### 第二批在兼容确认后动

- `src/main/java/com/fdc3/chatbot/controller/ProtocolChatController.java`
- `src/main/java/com/fdc3/chatbot/model/ChatRequest.java`
- `src/main/java/com/fdc3/chatbot/protocol/model/ProtocolFrontendTool.java`
- `src/main/java/com/fdc3/chatbot/protocol/model/ProtocolRunContext.java`

### 暂不直接动

- `packages/chat-protocol-contract/*`
- demo 中对 `submit-tool-result` / `action-required` / `card` 的消费能力

## 8. 测试处理原则

### 保留并修正

- `ProtocolChatServiceTest`
- `ProtocolChatControllerTest`
- `PlanValidationServiceTest`
- `ExecutionOrchestratorTest`

### 需要重写预期

- 所有依赖 custom fallback 的 `AgentServiceTest`
- 所有断言 backend custom card 行为的测试

### 不能破坏的测试语义

- `parts` 作为 canonical message field
- `submit-tool-result`
- `tool` role message history
- `action-required`
- `plan-available` / `start-step` / `step-status` / `finish-step`

## 9. 本次执行的完成定义

满足以下条件即视为本轮完成：

- `/runs` 成为唯一正式 API 文档入口
- `ChatService` 删除
- `ExecutionPlanner` 删除
- legacy governed flow 删除
- backend custom heuristics 删除
- backend custom UI mapping 删除
- Tool 描述正式统一到 `context.tools`
- 兼容能力仍可运行，但全部被明确标记为 deprecated

## 10. 下一步建议

如果现在进入实施，建议第一批只做下面四项：

1. 删除 `ChatService`
2. 删除 `ExecutionPlanner` 和 governed fallback flow
3. 删除 `AgentService` 中的 custom heuristics
4. 删除 `ProtocolChatService` 中的 hardcoded UI mapping

这四项最符合你的目标，而且不会先碰 shared protocol 的高风险边界。
