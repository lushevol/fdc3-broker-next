# Chatbot Backend Agent 化收敛计划

## 1. 目标

将 `services/chatbot-backend` 收敛为一套单一、可解释、可验证的 Agent tool 执行架构，去掉当前散落在协议层、执行层、展示层、兼容层中的 hacking points。

目标架构：

```text
ProtocolChatController
  -> ProtocolChatService
    -> AgentService
      -> CapabilityResolver
      -> PlanValidationService
      -> ExecutionOrchestrator
      -> ToolRegistry / MCP
```

最终约束：

- 后端只保留一条主执行链路
- 后端不再做关键词猜测式 tool 触发
- 后端不再做业务特定补跑或结果拼装
- 后端不再把 tool result 映射为 UI Card
- 后端不再长期维护多套 legacy 协议
- 审批/continuation 语义必须完整，要么删除，要么正式实现

## 2. 现状判断

当前代码里真正应保留的 Agent 骨架不多，主要复杂度来自以下几类额外工作：

1. 多条执行路径并存
2. 后端 fallback heuristics 代替模型决策
3. 展示层逻辑侵入后端
4. 半成品审批和 continuation 机制
5. legacy 协议兼容长期滞留

## 3. 保留与删除原则

### 3.1 保留

- `tool/ToolRegistry.java`
- `mcp/*`
- `controlplane/CapabilityResolver.java`
- `agent/AgentDecisionService.java`
- `agent/PlanValidationService.java`
- `agent/ExecutionOrchestrator.java`
- `agent/ResultSynthesisService.java`
- `protocol/ProtocolChatService.java` 的协议编排职责
- `controller/ProtocolChatController.java` 的 `/api/chat/runs`

### 3.2 删除或下线

- `service/ChatService.java`
- `controlplane/planning/ExecutionPlanner.java`
- `AgentService` 中 legacy governed flow
- `AgentService` 中 heuristic fallback tool 推断
- `AgentService` 中 mock 路径
- `ProtocolChatController` 中 `/api/chat/stream` 兼容入口
- `ProtocolChatService` / `ChatService` 中 `GenerativeUIDirective` 映射
- `context.frontendTools` legacy 协议兼容路径

## 4. 分阶段执行计划

### Phase 1: 收口唯一入口

目标：明确协议主入口，只允许一套正式请求格式。

#### 改动范围

- 文件：`src/main/java/com/fdc3/chatbot/controller/ProtocolChatController.java`
- 文件：`src/main/java/com/fdc3/chatbot/model/ChatRequest.java`
- 文件：`src/main/java/com/fdc3/chatbot/protocol/model/ProtocolRunRequest.java`
- 文档：`docs/API.md`

#### 具体动作

1. 保留 `/api/chat/runs` 作为唯一主入口。
2. 将 `/api/chat/stream` 标记为 deprecated。
3. 停止给新客户端暴露 `ChatRequest` 作为正式协议对象。
4. 评估是否还有调用方依赖 `ChatRequest`：
   - 如果无依赖，直接删除 `/stream` 和 `ChatRequest`
   - 如果有依赖，先保留一版兼容，但在文档中标明迁移期限
5. 明确 `ProtocolRunRequest.context.tools` 为唯一 tool 描述入口。

#### 预期删改点

- 删除或下线 `ProtocolChatController.convertToProtocolRequest()`
- 删除 `ChatRequest.toolContext`
- 删除 `ChatRequest.frontendTools`
- 删除 `ChatRequest.history`

#### 风险

- 前端可能仍在调用 `/stream`
- 某些旧集成仍依赖 `ChatRequest`

#### 验收标准

- 协议文档中只有 `/runs` 为正式入口
- 所有活跃调用方都能直接构造 `ProtocolRunRequest`

### Phase 2: 收口为单一 Agent 执行模式

目标：`AgentService` 只保留一种执行引擎。

#### 改动范围

- 文件：`src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- 文件：`src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
- 文档：`docs/ARCHITECTURE.md`
- 配置：`application.yml`

#### 具体动作

1. 保留 agentic control loop：
   - `AgentDecisionService`
   - `PlanValidationService`
   - `ExecutionOrchestrator`
   - `ResultSynthesisService`
2. 删除 legacy governed flow：
   - `shouldUseLegacyGovernedReadOnlyMcpFlow()`
   - `executeGovernedPlan()`
   - `buildGovernedPlanSummary()`
3. 删除 `ExecutionPlanner` 及其 wiring。
4. 删除配置项：
   - `chatbot.agent.legacy-governed-planner-enabled`
5. 将 `processMessageStreaming()` 简化为：
   - 构造上下文
   - 决策
   - 校验
   - 执行
   - 汇总

#### 预期删改点

- 删除 `ExecutionPlanner.java`
- 删除 `AgentService` 中 legacy governed 相关调用分支
- 删除与 `ExecutionPlan` legacy model 的强耦合

#### 风险

- 某些 analytics 查询之前依赖 legacy planner 自动补足

#### 验收标准

- `AgentService` 不再依据 flag 在多套执行模式之间切换
- 任一请求只有一条可追踪的执行路径

### Phase 3: 删除 heuristics 和业务特例

目标：后端不再代替模型思考。

#### 改动范围

- 文件：`src/main/java/com/fdc3/chatbot/agent/AgentService.java`

#### 具体动作

1. 删除工具触发 heuristics：
   - `shouldUseTools()`
2. 删除 fallback tool 计划推断：
   - `inferFallbackToolPlan()`
   - `inferResolvedDateFollowup()`
3. 删除配套文本解析逻辑：
   - `extractRelativeDateExpression()`
   - `stripDateExpression()`
   - `extractWeatherLocation()`
   - `extractRecipientEmail()`
   - `extractRecipientName()`
   - `buildSickLeaveEmailBody()`
   - `extractAnalyticsApplication()`
   - `selectAnalyticsToolName()`
   - `hasFrontendTool()`
4. 删除业务补跑逻辑：
   - `enrichGovernedToolResult()`
5. 简化 prompt：
   - 保留通用 tool-calling 约束
   - 去掉 weather/email/analytics 的硬编码强指导

#### 原则

- “工具怎么链式调用”应由 capability 描述和模型决策完成
- 后端只验证计划是否合法，不补造计划

#### 风险

- 模型在少数场景下可能比过去更依赖 prompt 质量和 schema 设计

#### 验收标准

- 后端不再通过关键词/正则生成任何 tool call
- 后端不再额外触发第二个业务 tool 来补数据

### Phase 4: 清理展示层和 legacy tool 协议兼容

目标：把 UI 和协议债从后端主链路剥离。

#### 改动范围

- 文件：`src/main/java/com/fdc3/chatbot/service/ChatService.java`
- 文件：`src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- 文件：`src/main/java/com/fdc3/chatbot/model/GenerativeUIDirective.java`
- 文件：`src/main/java/com/fdc3/chatbot/model/FrontendToolManifestEntry.java`
- 文件：`src/main/java/com/fdc3/chatbot/model/FrontendToolContinuation.java`
- 文件：`src/main/java/com/fdc3/chatbot/protocol/model/ProtocolFrontendTool.java`
- 文件：`src/main/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptor.java`
- 文档：`docs/TOOL_WORKFLOW.md`
- 文档：`docs/GENERATIVE_UI_GUIDE.md`

#### 具体动作

1. 删除 `ChatService`，除非仍存在明确调用方。
2. 删除 tool result -> `GenerativeUIDirective` 映射逻辑。
3. 删除 `ui-part-available` 的后端生成逻辑，除非协议仍强依赖。
4. 删除 legacy `context.frontendTools` 支持。
5. 删除 `ProtocolFrontendTool` 模型。
6. 将 frontend tool 与 backend/mcp tool 统一为 `context.tools` 下的同一描述结构。

#### 协议目标

tool 描述统一字段：

- `name`
- `source`
- `description`
- `parameters`
- `providerId`
- `requiresConfirmation`
- `executionTarget`

#### 风险

- 前端如果仍依赖 `ui-part-available`，需要同步调整渲染层
- 前端如果仍发送 `frontendTools`，需要先做迁移

#### 验收标准

- 后端不再出现 `toolName -> Card/UI` 硬编码
- `context.tools` 成为唯一 tool 描述协议

### Phase 5: 重做或删除审批/continuation

目标：去掉半成品状态机。

#### 改动范围

- 文件：`src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- 文件：`src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- 文件：`src/main/java/com/fdc3/chatbot/model/FrontendToolContinuation.java`

#### 方案选择

#### 方案 A：短期收敛

- 删除 backend confirmation 支持
- 删除 `confirmToolCall()` 占位行为
- 只保留：
  - backend auto tools
  - frontend delegated tools

适用场景：

- 当前核心目标是先把架构收干净

#### 方案 B：完整实现

- 将 pending execution 持久化
- 将 plan step / tool call state 显式建模
- 用正式恢复协议恢复执行
- 不再通过扫描 assistant 历史消息来重建 continuation

适用场景：

- 产品明确需要 human-in-the-loop 审批

#### 当前建议

先执行方案 A，再独立设计方案 B。

#### 需要删除的半成品

- `confirmToolCall()` 中 placeholder 逻辑
- `PendingToolExecution` 的非 mock 外显接口语义
- 通过历史 `ProtocolPart` 反向重建 continuation 的做法

#### 验收标准

- 线上没有“注释里写 placeholder”的关键能力
- continuation 语义只有一套正式机制

## 5. 文件级改动清单

### 可直接删除候选

- `src/main/java/com/fdc3/chatbot/service/ChatService.java`
- `src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
- `src/main/java/com/fdc3/chatbot/protocol/model/ProtocolFrontendTool.java`

### 高优先级重构文件

- `src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- `src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- `src/main/java/com/fdc3/chatbot/controller/ProtocolChatController.java`

### 可能随收敛删除的模型

- `src/main/java/com/fdc3/chatbot/model/GenerativeUIDirective.java`
- `src/main/java/com/fdc3/chatbot/model/FrontendToolContinuation.java`
- `src/main/java/com/fdc3/chatbot/model/FrontendToolManifestEntry.java`
- `src/main/java/com/fdc3/chatbot/model/ChatRequest.java`

### 保留核心文件

- `src/main/java/com/fdc3/chatbot/tool/ToolRegistry.java`
- `src/main/java/com/fdc3/chatbot/controlplane/CapabilityResolver.java`
- `src/main/java/com/fdc3/chatbot/agent/PlanValidationService.java`
- `src/main/java/com/fdc3/chatbot/agent/ExecutionOrchestrator.java`
- `src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java`
- `src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java`

## 6. 测试计划

### 保留并更新

- `AgentDecisionServiceTest`
- `PlanValidationServiceTest`
- `ExecutionOrchestratorTest`
- `ProtocolChatServiceTest`
- `ProtocolChatControllerTest`

### 新增测试

1. 单一路径执行测试
   - 请求进入后只走 agent loop
   - 不触发 legacy planner

2. 无 fallback 测试
   - 模型未生成 tool call 时，后端不会自动补造

3. 无 UI directive 测试
   - tool result 不触发 card directive

4. 协议收口测试
   - `/runs` 正常
   - `/stream` 已废弃或已移除
   - `context.frontendTools` 拒收或被标记不支持

5. capability 校验测试
   - 缺参数
   - deny
   - review-required
   - 正常执行

### 回归测试

- MCP provider 注册
- MCP tool 调用
- frontend delegated tool 事件发射
- tool result 序列化与 SSE 输出

## 7. 推荐执行顺序

1. 收口入口与协议文档
2. 删除 legacy planner 和 governed flow
3. 删除 `ChatService` 与 UI directive 映射
4. 删除 heuristic fallback 与业务补跑
5. 清理 legacy frontend tool 协议
6. 重做或删除 confirmation/continuation
7. 补测试并更新文档

## 8. 风险清单

### 外部依赖风险

- 前端是否仍依赖 `/api/chat/stream`
- 前端是否仍发送 `frontendTools`
- 前端是否仍依赖 `ui-part-available`
- 外部是否调用 `confirmToolCall`

### 行为变化风险

- 删除 fallback 后，模型必须更稳定地产生正确 tool plan
- 删除业务补跑后，某些 analytics 响应会变得更“原始”

### 迁移建议

在真正删除代码前，先盘点：

1. controller 调用点
2. frontend request shape
3. SSE frame 消费点
4. approval 流程消费点

## 9. 完成定义

满足以下条件，视为本次 Agent 化收敛完成：

- 代码中只有一条正式 tool 执行链
- 不再存在 legacy planner
- 不再存在 heuristic fallback tool 触发
- 不再存在后端 UI card 映射
- 不再依赖 legacy frontend tool 协议
- 审批机制要么完整实现，要么完全移除
- 所有文档已更新并与实际代码一致
- 核心测试覆盖新的主链路

## 10. 下一步建议

按本计划，第一批实际代码改动建议优先做：

1. `ProtocolChatController` 收口 `/runs`
2. 删除 `ExecutionPlanner` 和 `AgentService.executeGovernedPlan()`
3. 删除 `ChatService`
4. 删除 `GenerativeUIDirective` 映射

这样可以先把最大的结构性重复去掉，再进入更细的 tool 语义收敛。
