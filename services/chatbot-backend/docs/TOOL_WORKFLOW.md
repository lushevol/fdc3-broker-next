# Chatbot Tool Workflow

## Tool Sources

| Source     | Execution target | How it is registered                                          |
| ---------- | ---------------- | ------------------------------------------------------------- |
| `backend`  | Backend          | Local `ToolDefinition` Spring beans and agent-utils callbacks |
| `mcp`      | Backend          | `McpProviderRegistryService` wraps remote MCP tools           |
| `frontend` | Frontend         | Request `context.tools` or legacy `context.frontendTools`     |
| `human`    | Frontend/user    | Manual approval or user-question tools                        |

## Request Handling

```text
ProtocolChatController.streamRun()
  -> ProtocolChatService.streamRun()
     -> merge request context tools
     -> AgentService.processProtocolMessageStreamingWithModel()
        -> ToolRegistry.resolveTools()
        -> model/tool execution
```

`ProtocolChatService.mergeTools()` prefers `request.context.tools` and converts legacy `request.context.frontendTools` for compatibility.

## Agentic Path

When capability resolver, decision service, plan validator, and orchestration services are available, `AgentService` can use the agentic loop:

```text
AgentDecisionService.decide()
  -> RESPOND | CLARIFY | PLAN
  -> PlanValidationService.validate()
  -> ExecutionOrchestrator.execute()
  -> ResultSynthesisService.synthesizeStreaming()
```

Policy decisions must be respected:

- `ALLOW`: execute.
- `DENY`: return a refusal/error.
- `REVIEW_REQUIRED`: emit approval flow.

## Standard Tool-Calling Path

When the model returns tool calls, backend and MCP tools execute through `ToolRegistry.execute(...)`. Results stream back as:

```text
tool-input-start
tool-input-available
tool-output-available | tool-output-error
```

Frontend tools finish with `finishReason=tool-calls` so the client can execute and resume with a continuation.

Human tools finish with `finishReason=action-required` and an `action-required` frame.

## User Questions

`AskUserQuestionTool` emits a `user_question` frame with:

- `toolCallId`
- `batchId`
- `questions`

The frontend answers with `POST /api/chat/question/answer` or `POST /api/chat/question/{batchId}/answer`.

## MCP Providers

Registration flow:

```text
McpProviderController
  -> McpProviderRegistryService.register()
     -> McpClientFactory creates session
     -> list tools
     -> wrap each tool as ToolDefinition
     -> ToolRegistry.registerMcpProvider()
```

Bootstrap providers come from `chatbot.mcp.providers`.

## Protocol Frames

Tool-related frame types:

- `tool-input-start`
- `tool-input-delta`
- `tool-input-available`
- `tool-output-available`
- `tool-output-error`
- `user_question`
- `action-required`
- `action-resolved`

Plan-related frame types:

- `reasoning-summary`
- `plan-available`
- `start-step`
- `step-status`
- `finish-step`

Completion frame:

- `finish` with `finishReason` of `stop`, `tool-calls`, `action-required`, or `error`.
