# Chatbot Backend Agent 收敛计划协议兼容性评估

## 1. 评估目标

评估 [2026-04-22-AGENT_REFACTOR_PLAN.md](/Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend/docs/2026-04-22-AGENT_REFACTOR_PLAN.md) 是否符合现有 `chat-protocol-contract`、demo 应用和 backend 测试所体现的协议要求，并识别哪些改动会打破已有功能。

## 2. 结论

原计划的总体方向是对的：

- 收敛为单一 Agent 主链路是合理的
- 删除 legacy planner 是合理的
- 删除业务 heuristics 是合理的
- 删除重复的 `ChatService` 是合理的

但原计划里有几项如果按字面直接执行，会打破现有正式协议能力，不是单纯“内部实现替换”：

1. 不能直接删除 `ui-part-available`
2. 不能直接删除 frontend tool continuation 语义
3. 不能直接删除 `action-required`
4. 不能直接把 `context.frontendTools` 当成纯内部兼容字段处理，而不检查现有调用面
5. 不能把后端从“组装协议历史”改成“只看当前用户消息”，否则会破坏 `submit-tool-result` 协议语义

因此，计划需要从“删除协议能力”改成“保留 contract，替换后端实现”。

## 3. 依据

### 3.1 `chat-protocol-contract` 明确声明的协议能力

文件：`packages/chat-protocol-contract/src/types.ts`

现有 contract 明确包含：

- `finishReason: 'tool-calls' | 'action-required' | 'stop' | 'error'`
- assistant parts:
  - `tool-call`
  - `tool-result`
  - `card`
  - `action`
  - `reasoning-summary`
  - `plan`
  - `step-start`
  - `step`
- stream frames:
  - `plan-available`
  - `start-step`
  - `step-status`
  - `finish-step`
  - `tool-input-start`
  - `tool-output-available`
  - `ui-part-available`
  - `action-required`

结论：

- 这些不是后端内部细节，而是 shared contract 的一部分
- 后端可以换实现，但不能直接删掉这些协议能力，除非同步升级 contract 并迁移消费方

### 3.2 contract 文档明确支持 continuation request

文件：`packages/chat-protocol-contract/docs/ai-chatbot-api-capture.md`

文档明确要求：

- `submit-tool-result` 请求应带上：
  - 之前的 user message
  - 发起 tool call 的 assistant message
  - 对应的 `tool` role message

结论：

- continuation 是协议一级能力，不是 backend workaround
- 原计划中“删除 continuation 并简化为只靠当前请求”的方向不兼容现有 contract

### 3.3 demo 应用确实依赖这些协议

文件：`apps/chat-protocol-demo-web/src/App.tsx`

demo 直接消费这些 frame：

- `tool-input-start`
- `tool-input-available`
- `tool-output-available`
- `tool-output-error`

文件：`tests/e2e/chat-protocol-demo.spec.ts`

demo e2e 明确验证：

- 第二次请求使用 `trigger = 'submit-tool-result'`
- 第二次请求保留 `context.tools`
- 第二次请求包含 `role = 'tool'` 的历史消息

结论：

- continuation 和 tool-history 是当前前端真实依赖
- 不能把它们当成 backend 私有 hack 一起删掉

### 3.4 backend 自测也把这些当作正式行为

文件：`services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`

测试明确校验：

- backend 会从 assistant tool part 重建 `toolContext`
- backend 会把 frontend/human tools 序列化为 frontend tool manifest
- backend 会发出 `plan-available`
- backend 会发出 `start-step`
- backend 会发出 `tool-input-start`
- backend 会发出 `tool-output-available`
- backend 会发出 `ui-part-available`

结论：

- `ProtocolChatService` 当前不仅是转发层，还承担“把内部状态翻译成协议事件”的职责
- 可以重构，但不能不顾测试中体现的协议能力直接裁掉

## 4. 对原计划的逐项评估

### 4.1 Phase 1 收口 `/runs`

评估：**基本安全**

原因：

- demo 新链路已使用 `/api/chat/runs`
- `/stream` 更像 legacy 兼容入口

注意：

- 不能只从 backend 代码判断，要先检查真实前端调用面
- 仓库中仍有 e2e 测试和旧代码 mock `/api/chat/stream`

结论：

- 可做
- 但应先“标记 deprecated + 迁移调用方”，再删除

### 4.2 Phase 2 删除 legacy planner

评估：**安全**

原因：

- `ExecutionPlanner` 文件本身就是 legacy fallback
- 它只覆盖狭窄 analytics 模式
- shared protocol 不依赖它的存在

结论：

- 可以删除
- 这属于内部实现收敛，不会破坏 chat-protocol contract

### 4.3 Phase 3 删除 heuristics/fallback

评估：**方向正确，但会改变行为**

会受影响的现有能力：

- `resolve_relative_date -> get_weather_history`
- `resolve_relative_date -> analytics tool`
- analytics 关键词触发 tool

证据：

- `AgentServiceTest` 中有专门测试这些 fallback 语义
- 本次运行 `mvn -q -Dtest=ProtocolChatServiceTest,ProtocolChatControllerTest,AgentServiceTest test` 时，失败测试名就包括：
  - `processMessageStreamingFallsBackToWeatherHistoryAfterResolvedDate`
  - `processMessageStreamingFallsBackToAnalyticsAfterResolvedDate`
  - `processMessageStreamingIncludesAnalyticsToolsForPvUvQueries`

结论：

- 从“Agent 化”角度，删除这些 heuristics 是合理的
- 但这会打破当前行为预期和现有测试
- 应在计划里明确：
  - 这是有意的行为变化
  - 需要先调整测试和产品预期
  - 需要加强 tool/capability 描述，否则模型可能退化

### 4.4 Phase 4 删除 `ui-part-available`

评估：**不安全，原计划需要修改**

原因：

- `ui-part-available` 在 `chat-protocol-contract` 里是正式 stream frame
- `card` part 在 contract 里也是正式 assistant part
- 文档明确允许“final assistant answer can include UI and text”

正确做法：

- 可以删除“硬编码业务卡片映射”
- 不能删除“协议层支持 UI part/card”

应改成：

1. 删除 `toolName -> Card` 的硬编码 mapper
2. 保留 protocol-level `ui-part-available` / `card`
3. 将 UI 渲染能力改为：
   - 由 tool descriptor `ui` 元数据驱动
   - 或由 frontend/toolkit 层根据 `tool-result` 派生
   - 或由 agent 输出结构化 `card` part，而不是 backend switch-case 拼装

### 4.5 Phase 4 删除 frontend continuation

评估：**不安全，原计划需要修改**

原因：

- 现有 contract 支持 `submit-tool-result`
- demo 和 e2e 已依赖这一轮 continuation
- backend 现在通过 `toolContext` 做 continuation，是实现不优雅，不是协议本身有问题

正确做法：

- 删除 `toolContext` 这种 backend 私有 continuation 通道可以考虑
- 但必须保留基于 request history 的 continuation 协议能力

建议替换方向：

1. backend 直接消费 `messages` 中的：
   - assistant `tool-call` part
   - tool role `tool-result` message
2. 不再把它们重新压缩为 `toolContext` JSON 私有字段
3. `AgentService` 改成直接从 `messages/history` 恢复 continuation 状态

### 4.6 Phase 5 删除 confirmation

评估：**不能直接删协议能力**

原因：

- `action-required` 是 contract 明确支持的 finishReason / stream frame
- `action` part 也是 contract 一部分
- demo 测试已经验证 human tool 会触发 `action-required`

正确做法：

- 可以删除 backend 里“placeholder 恢复逻辑”
- 不能直接删除 `action-required` 协议语义

建议：

1. 保留：
   - human tool descriptor
   - `action-required` frame
   - `finishReason = action-required`
2. 删除：
   - 非正式的 `confirmToolCall()` 占位接口
3. 用正式协议替换：
   - `trigger = submit-action`
   - assistant/action history continuation

## 5. 计划需要修改的地方

原计划建议修改为下面这版。

### 5.1 可以删的

- `ChatService`
- `ExecutionPlanner`
- legacy governed flow
- mock mode 相关主路径逻辑
- heuristic fallback tool 推断
- `toolContext` 私有 continuation 通道
- `ChatRequest` 和 `/stream`，前提是调用方已迁移

### 5.2 不能删，只能重做实现的

- `ui-part-available`
- `card` assistant part
- `action-required`
- `action` assistant part
- `submit-tool-result`
- `submit-action`
- request history 中的 assistant/tool continuation 语义

### 5.3 应改为“协议保留，内部实现替换”的部分

- frontend continuation：
  - 从 `toolContext` 私有 JSON
  - 改为直接消费 `messages` 历史

- UI rendering:
  - 从 backend switch-case 生成 card
  - 改为 agent/card part 或 frontend renderer 驱动

- approval:
  - 从 `confirmToolCall()` placeholder
  - 改为 `submit-action` 驱动的 continuation

## 6. 修订后的推荐执行顺序

1. 收口 `/runs`，但先保留 contract 兼容能力
2. 删除 `ChatService`
3. 删除 `ExecutionPlanner` 和 legacy governed flow
4. 删除 heuristics/fallback，并同步修正测试
5. 将 continuation 从 `toolContext` 改为直接使用 request history
6. 将 UI card 生成从 backend hardcode 改为协议保留 + renderer 驱动
7. 将 approval 从 placeholder API 改为 `submit-action` 正式协议
8. 最后再考虑删除 `/stream` 和 `ChatRequest`

## 7. 是否需要启动 real demo

当前结论：**暂时不需要**

原因：

- shared contract、demo 代码、e2e 测试、backend 单测已经足够证明现有协议依赖面
- 当前要解决的是协议兼容性判断，不是排查运行时不一致

何时再启动：

- 当进入“替换 `toolContext` 为 request-history continuation”的实现阶段时
- 当进入“从 backend card mapper 改为 frontend/card part 驱动”的验证阶段时

此时可以运行：

- `npm run dev:chat-protocol-real-demo`

用于验证真实前端与 backend 的联调行为

## 8. 最终结论

这份 Agent 收敛计划需要保留两条底线：

1. 删除的是 backend 内部 hack，不是 shared protocol 本身
2. 替换的是 continuation / action / UI 的实现方式，不是把这些协议能力整体删除

如果按这个修订思路执行，计划是可行的。

如果按原计划字面直接执行，至少会打破：

- frontend tool continuation
- action-required / human-in-the-loop
- ui-part-available / card rendering
- 现有 demo 和部分 e2e/单测的协议预期
