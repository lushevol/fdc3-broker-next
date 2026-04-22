# ChatbotSidebarV2 — Chat Protocol Integration

## Summary

Replace the custom SSE-based chatbot in `apps/base` with the `chat-protocol-ui` / `chat-protocol-runtime` stack, matching the working pattern from `chat-protocol-demo-web`. Start minimal (no custom tools), migrate base-specific features incrementally.

## Context

- `apps/base` currently has a 940-line `AssistantUIRuntimeProvider` with custom SSE adapters (`fetchSSE.ts`, `sseToAssistantUi.ts`) talking to `/api/chat`
- `chat-protocol-demo-web` demonstrates a working integration using `ChatProtocolProvider` + `AssistantModal` from `chat-protocol-ui`
- The `chat-protocol-contract` package defines the protocol types; `chat-protocol-runtime` handles streaming

## Approach: New v2 alongside old

### 1. Add dependencies to `apps/base/package.json`

```
chat-protocol-contract: 0.0.1
chat-protocol-runtime: 0.0.1
chat-protocol-ui: 0.0.1
```

### 2. Create `src/components/ChatbotSidebarV2/`

**`ChatbotProvider.tsx`** — Wraps `ChatProtocolProvider` from `chat-protocol-ui`:
- Reads API URL from env (`process.env.REACT_APP_CHAT_API_URL` or similar)
- Passes empty toolkit `{}` for initial release
- No custom tools, no GenerativeUI, no workspace context yet

**`index.tsx`** — Renders `<AssistantModal />` from `chat-protocol-ui`

**`exports.ts`** — Public API: `ChatbotSidebarV2`, `ChatbotProvider`

### 3. Update `src/pages/Home/index.tsx`

- Replace `AssistantUIRuntimeProvider` with `ChatbotProvider`
- Replace `ChatbotSidebar` with new `ChatbotSidebarV2`
- Remove old imports from `ChatbotSidebar/exports`
- Keep `toolRegistryConfig` logic commented/preserved for future migration

### 4. Environment configuration

- Add `REACT_APP_CHAT_API_URL` to `.env.local` (pointing to `http://localhost:8080/api/chat/runs`)
- Add to `.env.server` for production builds

### 5. Preserve old code

- Keep `src/components/ChatbotSidebar/` intact
- Keep old exports in `root.tsx` working
- Migrate tools (FDC3, workspace status, workspace summary) incrementally in follow-up tasks

## API endpoint

- Dev: `http://localhost:8080/api/chat/runs` (chatbot-backend)
- Uses `ChatRunRequest` / `ChatStreamFrame` protocol from `chat-protocol-contract`

## Future work (not in scope)

- Migrate FDC3 intent tool to Toolkit/ToolkitBridge pattern
- Migrate workspace status/summary tools
- Migrate GenerativeUI registry to protocol render pattern
- Remove old `ChatbotSidebar/` and SSE adapter code
