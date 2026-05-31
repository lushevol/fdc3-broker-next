# Chatbot Integration Guide for MFEs

The current MFE integration uses `ChatbotSidebarV2` from `@fm/base`, backed by the shared `chat-protocol-ui` and `chat-protocol-runtime` packages.

## Runtime Shape

```text
@fm/base ChatbotSidebarV2
  -> ChatProtocolProvider
     -> POST http://127.0.0.1:8080/api/chat/runs
        -> chatbot-backend
```

`ChatbotSidebarV2` registers frontend tools through a protocol toolkit bridge and sends workspace/user context to the backend.

## Export Surface

From `apps/base/src/components/ChatbotSidebarV2/exports.ts`:

```ts
export { ChatbotSidebarV2, default as ChatbotSidebarV2Default } from './index';
export { createToolkitBridge, ToolkitBridgeError } from './toolkit/bridge';
export { createRuntimeToolkit, runtimeToolkit, getProtocolToolDescriptors } from './toolkit';
```

## Backend URL

The base component uses:

```ts
process.env.CHAT_API_URL || 'http://127.0.0.1:8080/api/chat/runs';
```

Set `CHAT_API_URL` when the backend is proxied or deployed at a different origin.

## Protocol Expectations

Clients should send `ProtocolRunRequest` messages with `parts`, not `content`.

Common stream frames:

- `start`
- `message-start`
- `reasoning-summary`
- `plan-available`
- `start-step`
- `step-status`
- `finish-step`
- `text-start`
- `text-delta`
- `text-end`
- `tool-input-start`
- `tool-input-available`
- `tool-output-available`
- `tool-output-error`
- `user_question`
- `action-required`
- `finish`
- `error`

## Workspace and User Context

`ChatbotSidebarV2` passes workspace context under `context.workspace` and the current base auth user under `userId`. The backend uses `userId` for per-user memory isolation when present.

## Troubleshooting

- Verify `CHAT_API_URL` points to `/api/chat/runs`.
- Check `GET /api/chat/health`.
- Check `GET /api/chat/mcp/providers/status` when MCP tools are missing.
- Confirm frontend tools are present in the request `context.tools`.
- Confirm `CHATBOT_SECURITY_ADDITIONAL_PROFILES=advisor` when local MCP tools are hidden by profile gating.
