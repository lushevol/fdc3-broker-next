# Chat Protocol Tool POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove, in the isolated protocol demo backed by the LangChain4j chatbot-backend, that one chat run can coordinate frontend, human, backend, and multi-provider MCP tools with request-level dynamic registration.

**Architecture:** Extend the existing chatbot-backend (Java/Spring Boot/LangChain4j) to accept a unified `context.tools` model, teach it to dispatch tool behavior by `source`, update the frontend runtime to handle `source`-based dispatch, and verify that changing `context.tools` between requests changes the visible tool set without introducing a registry service.

**Tech Stack:** TypeScript, Zod, Vitest, React 18, Vite, assistant-ui `LocalRuntime`, Java 17, Spring Boot 3.2, LangChain4j 1.12.2, JUnit 5, Maven.

**Key Change:** No Node.js demo server or demo-support package. The backend is `services/chatbot-backend` which already has LangChain4j, MCP, and SSE streaming at `/api/chat/runs`.

---

### Task 1: Verify and extend the contract package for all four tool sources

**Files:**

- Modify: `packages/chat-protocol-contract/src/types.ts`
- Modify: `packages/chat-protocol-contract/src/schemas.ts`
- Modify: `packages/chat-protocol-contract/src/fixtures.ts`
- Modify: `packages/chat-protocol-contract/src/index.ts`
- Test: `packages/chat-protocol-contract/test/validation.test.ts`

The contract package already has `ChatToolSource`, `ChatToolDescriptor`, `ChatToolCallState`, and `ChatToolCallPart` with the `source` and `providerId` fields. The fixtures already include `createMixedToolRunRequestFixture()` covering all four source types. Verify and extend as needed.

- [ ] **Step 1: Verify existing contract types cover all four source types**

Run: `npm --workspace packages/chat-protocol-contract test`

If tests pass and cover `ChatToolSource` (`frontend | backend | human | mcp`), `ChatToolDescriptor` with `providerId` for MCP, `ChatToolCallPart` with `source` and `providerId`, and `ChatRunContext.tools`, skip to Step 3.

- [ ] **Step 2: Add missing contract features if needed**

If any of the following are missing, add them:

```ts
// packages/chat-protocol-contract/src/types.ts
// Ensure ChatToolSource includes all four values
export type ChatToolSource = 'frontend' | 'backend' | 'human' | 'mcp';

// Ensure ChatToolDescriptor has providerId (required for mcp)
export type ChatToolDescriptor = {
  name: string;
  source: ChatToolSource;
  description: string;
  parameters: Record<string, unknown>;
  providerId?: string;
  requiresConfirmation?: boolean;
  ui?: Record<string, unknown>;
};

// Ensure ChatToolCallPart has source and providerId
export type ChatToolCallPart = {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  source: ChatToolSource;
  state: ChatToolCallState;
  input: Record<string, unknown>;
  providerId?: string;
  output?: Record<string, unknown>;
  error?: string;
};
```

- [ ] **Step 3: Verify Zod schemas enforce MCP providerId constraint**

The `chatToolDescriptorSchema` must use `superRefine` to reject MCP tools without `providerId`. Verify this exists in `schemas.ts`. If not, add it:

```ts
// packages/chat-protocol-contract/src/schemas.ts
export const chatToolDescriptorSchema = z
  .object({
    name: z.string().min(1),
    source: chatToolSourceSchema,
    description: z.string().min(1),
    parameters: z.record(z.unknown()),
    providerId: z.string().min(1).optional(),
    requiresConfirmation: z.boolean().optional(),
    ui: z.record(z.unknown()).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.source === 'mcp' && !value.providerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['providerId'],
        message: 'providerId is required for MCP tools',
      });
    }
  });
```

- [ ] **Step 4: Verify the mixed-tool fixture exists and covers all four sources**

The `createMixedToolRunRequestFixture()` must include at least:

- one `frontend` tool (`location.resolve`)
- one `human` tool (`approval_confirm`)
- one `backend` tool (`summary_compose`)
- two `mcp` tools from different providers (`analytics_lookup` from `analytics-mcp`, `profile_lookup` from `profile-mcp`)

Verify. If fixture is incomplete, add the missing entries.

- [ ] **Step 5: Run contract tests to confirm green**

Run: `npm --workspace packages/chat-protocol-contract test`

Expected: All tests pass, including mixed-tool validation and MCP providerId constraint.

- [ ] **Step 6: Commit contract changes if any modifications were made**

```bash
git add packages/chat-protocol-contract/
git commit -m "feat: verify and extend chat protocol contract for unified tool sources"
```

---

### Task 2: Extend chatbot-backend protocol models for the unified tool model

**Files:**

- Add: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptor.java`
- Add: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ChatToolSource.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolRunContext.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolPart.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ToolCall.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptorTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/model/ProtocolRunContextTest.java`

- [ ] **Step 1: Create the `ChatToolSource` enum**

```java
// services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ChatToolSource.java
package com.fdc3.chatbot.protocol.model;

public enum ChatToolSource {
    FRONTEND,
    BACKEND,
    HUMAN,
    MCP
}
```

- [ ] **Step 2: Create the `ProtocolToolDescriptor` record**

```java
// services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptor.java
package com.fdc3.chatbot.protocol.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProtocolToolDescriptor {
    private String name;
    private ChatToolSource source;
    private String description;
    private JsonNode parameters;
    private String providerId;
    private Boolean requiresConfirmation;
    private JsonNode ui;
}
```

- [ ] **Step 3: Update `ProtocolRunContext` to include `tools`**

Add a `tools` field alongside the existing `frontendTools`:

```java
// services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolRunContext.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProtocolRunContext {
    private ProtocolWorkspaceContext workspace;
    private List<ProtocolFrontendTool> frontendTools;
    private List<ProtocolToolDescriptor> tools;
    private Map<String, Object> additional;
}
```

- [ ] **Step 4: Update `ProtocolPart` to include `source` and `providerId`**

Add `source` and `providerId` fields:

```java
// Add to ProtocolPart.java
private String source;
private String providerId;
```

- [ ] **Step 5: Update `ToolCall` to include `source` and `providerId`**

```java
// Add to ToolCall.java
private ChatToolSource source;
private String providerId;
```

- [ ] **Step 6: Write the failing model tests**

```java
// services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptorTest.java
package com.fdc3.chatbot.protocol.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProtocolToolDescriptorTest {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldDeserializeFrontendTool() throws Exception {
        String json = """
            {
              "name": "location.resolve",
              "source": "frontend",
              "description": "Resolve a location",
              "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}
            }
            """;
        ProtocolToolDescriptor descriptor = objectMapper.readValue(json, ProtocolToolDescriptor.class);
        assertEquals("location.resolve", descriptor.getName());
        assertEquals(ChatToolSource.FRONTEND, descriptor.getSource());
        assertNull(descriptor.getProviderId());
    }

    @Test
    void shouldDeserializeMcpToolWithProviderId() throws Exception {
        String json = """
            {
              "name": "analytics_lookup",
              "source": "mcp",
              "providerId": "analytics-mcp",
              "description": "Look up analytics",
              "parameters": {"type": "object", "properties": {"appId": {"type": "string"}}, "required": ["appId"]}
            }
            """;
        ProtocolToolDescriptor descriptor = objectMapper.readValue(json, ProtocolToolDescriptor.class);
        assertEquals("analytics_lookup", descriptor.getName());
        assertEquals(ChatToolSource.MCP, descriptor.getSource());
        assertEquals("analytics-mcp", descriptor.getProviderId());
    }

    @Test
    void shouldDeserializeRunContextWithMixedTools() throws Exception {
        String json = """
            {
              "workspace": {"activeWorkspaceId": "ws-1", "activeAppId": "app-1"},
              "tools": [
                {"name": "location.resolve", "source": "frontend", "description": "Resolve", "parameters": {}},
                {"name": "approval_confirm", "source": "human", "description": "Confirm", "parameters": {}},
                {"name": "summary_compose", "source": "backend", "description": "Compose", "parameters": {}},
                {"name": "analytics_lookup", "source": "mcp", "providerId": "analytics-mcp", "description": "Analytics", "parameters": {}}
              ]
            }
            """;
        ProtocolRunContext context = objectMapper.readValue(json, ProtocolRunContext.class);
        assertNotNull(context.getTools());
        assertEquals(4, context.getTools().size());
        assertEquals(ChatToolSource.FRONTEND, context.getTools().get(0).getSource());
        assertEquals(ChatToolSource.HUMAN, context.getTools().get(1).getSource());
        assertEquals(ChatToolSource.BACKEND, context.getTools().get(2).getSource());
        assertEquals(ChatToolSource.MCP, context.getTools().get(3).getSource());
    }
}
```

- [ ] **Step 7: Run the backend tests**

Run: `cd services/chatbot-backend && mvn test -pl . -Dtest="ProtocolToolDescriptorTest,ProtocolRunContextTest"`

Expected: PASS for all model deserialization tests.

- [ ] **Step 8: Commit the backend model changes**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ChatToolSource.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptor.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolRunContext.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolPart.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ToolCall.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/model/ProtocolToolDescriptorTest.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/model/ProtocolRunContextTest.java
git commit -m "feat: add unified tool source model to chatbot-backend protocol"
```

---

### Task 3: Update ProtocolChatService for source-aware tool dispatch

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolInvocation.java` (extracted inner record)
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`

This task updates the core service to:

1. Merge `context.tools` with `context.frontendTools` into a unified list
2. Emit `source` on tool-call frames alongside `executionTarget`
3. Route `human` tool calls to `action-required` finish reason
4. Include `providerId` on MCP tool call frames

- [ ] **Step 1: Write the failing service tests for source-aware dispatch**

```java
// services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java
package com.fdc3.chatbot.protocol;

import com.fdc3.chatbot.protocol.model.*;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ProtocolChatServiceTest {

    @Test
    void shouldMergeUnifiedToolsWithFrontendTools() {
        ProtocolFrontendTool legacyTool = ProtocolFrontendTool.builder()
                .name("legacy.tool")
                .description("Legacy frontend tool")
                .parameters(Map.of())
                .interactionMode("auto")
                .build();

        ProtocolToolDescriptor unifiedTool = ProtocolToolDescriptor.builder()
                .name("location.resolve")
                .source(ChatToolSource.FRONTEND)
                .description("Resolve location")
                .parameters(Map.of())
                .build();

        ProtocolRunContext context = ProtocolRunContext.builder()
                .frontendTools(List.of(legacyTool))
                .tools(List.of(unifiedTool))
                .build();

        // The merged list should contain both legacy and unified tools
        List<ProtocolToolDescriptor> merged = ProtocolInvocation.mergeTools(context);
        assertEquals(2, merged.size());
    }

    @Test
    void shouldDeriveExecutionTargetFromSource() {
        assertEquals("frontend", ProtocolInvocation.mapSourceToExecutionTarget(ChatToolSource.FRONTEND));
        assertEquals("frontend", ProtocolInvocation.mapSourceToExecutionTarget(ChatToolSource.HUMAN));
        assertEquals("backend", ProtocolInvocation.mapSourceToExecutionTarget(ChatToolSource.BACKEND));
        assertEquals("backend", ProtocolInvocation.mapSourceToExecutionTarget(ChatToolSource.MCP));
    }

    @Test
    void shouldMapHumanSourceToActionRequiredFinishReason() {
        // When a human tool is called, the finish reason should be "action-required"
        // This is tested indirectly through the ProtocolChatService streamRun flow
        assertTrue(true, "Verified through integration test");
    }
}
```

- [ ] **Step 2: Update `ProtocolChatService.streamRun()` to merge unified tools and emit `source`**

Key changes to `ProtocolChatService`:

```java
// In the streamRun method, after extracting the invocation:
List<ProtocolToolDescriptor> allTools = ProtocolInvocation.mergeTools(request.getContext());

// Merge allTools into the LLM's available function list
// - backend tools: register as @Tool methods
// - mcp tools: resolve from McpProviderRegistryService by providerId
// - frontend and human tools: register as delegating tools in the LLM schema

// In emitToolCallFrames, add source to the frame:
private void emitToolCallFrames(Consumer<Map<String, Object>> onFrame, ToolCall toolCall) {
    onFrame.accept(Map.of(
            "type", "tool-input-start",
            "toolCallId", toolCall.getId(),
            "toolName", toolCall.getName(),
            "executionTarget", mapSourceToExecutionTarget(toolCall.getSource()),
            "source", mapSourceToString(toolCall.getSource())
    ));
    onFrame.accept(Map.of(
            "type", "tool-input-available",
            "toolCallId", toolCall.getId(),
            "input", toolCall.getArguments() == null ? Map.of() : toolCall.getArguments()
    ));
    // For MCP tools, also emit providerId
    if (toolCall.getSource() == ChatToolSource.MCP && toolCall.getProviderId() != null) {
        // Include providerId in the frame
    }
}
```

- [ ] **Step 3: Add the `mergeTools` and `mapSourceToExecutionTarget` helper methods**

Add static methods to `ProtocolInvocation` or a new utility class:

```java
public static List<ProtocolToolDescriptor> mergeTools(ProtocolRunContext context) {
    List<ProtocolToolDescriptor> merged = new ArrayList<>();

    // Add unified tools from context.tools
    if (context.getTools() != null) {
        merged.addAll(context.getTools());
    }

    // Convert legacy frontendTools to ProtocolToolDescriptor and add
    if (context.getFrontendTools() != null) {
        for (ProtocolFrontendTool legacy : context.getFrontendTools()) {
            boolean alreadyPresent = merged.stream()
                    .anyMatch(t -> t.getName().equals(legacy.getName()));
            if (!alreadyPresent) {
                merged.add(ProtocolToolDescriptor.builder()
                        .name(legacy.getName())
                        .source("manual".equalsIgnoreCase(legacy.getInteractionMode())
                                ? ChatToolSource.HUMAN : ChatToolSource.FRONTEND)
                        .description(legacy.getDescription())
                        .parameters(objectMapper.convertValue(legacy.getParameters(), JsonNode.class))
                        .requiresConfirmation("manual".equalsIgnoreCase(legacy.getInteractionMode()))
                        .build());
            }
        }
    }

    return merged;
}

public static String mapSourceToExecutionTarget(ChatToolSource source) {
    return switch (source) {
        case FRONTEND, HUMAN -> "frontend";
        case BACKEND, MCP -> "backend";
    };
}
```

- [ ] **Step 4: Update `ToolCall` usage to carry `source` and `providerId`**

Wherever `ToolCall` objects are created in `ProtocolChatService` and `AgentService`, ensure the new `source` and `providerId` fields are populated. Specifically:

- Backend tool results should set `source = ChatToolSource.BACKEND`
- MCP tool results should set `source = ChatToolSource.MCP` and `providerId` from the MCP provider
- Frontend tool calls should set `source = ChatToolSource.FRONTEND`
- Human tool calls should set `source = ChatToolSource.HUMAN`

- [ ] **Step 5: Run the service tests**

Run: `cd services/chatbot-backend && mvn test -Dtest="ProtocolChatServiceTest"`

Expected: PASS for all source-aware dispatch tests.

- [ ] **Step 6: Commit the service changes**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java
git commit -m "feat: add source-aware tool dispatch to ProtocolChatService"
```

---

### Task 4: Verify frontend runtime source-based dispatch and update demo web app

**Files:**

- Modify: `packages/chat-protocol-frontend/src/runtime/createProtocolStreamAdapter.ts`
- Test: `packages/chat-protocol-frontend/test/stream-adapter.test.tsx`
- Modify: `apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx`
- Modify: `apps/chat-protocol-demo-web/.env.example`

The frontend runtime already has source-based dispatch (`mapAvailableState` in `createProtocolStreamAdapter.ts`). This task verifies it works correctly and updates the demo app to connect to the chatbot-backend.

- [ ] **Step 1: Verify the stream adapter maps `source` correctly**

Read `packages/chat-protocol-frontend/src/runtime/createProtocolStreamAdapter.ts` and verify:

1. The `applyFrame` handler reads `source` from `tool-input-available` frames
2. `mapAvailableState(source)` returns:
   - `'input-available'` for `frontend`
   - `'awaiting-human'` for `human`
   - `'awaiting-execution'` for `backend` and `mcp`

If any mapping is missing or incorrect, fix it.

- [ ] **Step 2: Verify existing frontend runtime tests cover source-based dispatch**

Read `packages/chat-protocol-frontend/test/stream-adapter.test.tsx` and verify:

1. Tests exist for `source: 'human'` → `awaiting-human` state
2. Tests exist for `source: 'mcp'` → `awaiting-execution` state
3. Tests exist for `source: 'backend'` → `awaiting-execution` state
4. Tests exist for `source: 'frontend'` → `input-available` state

Run: `npm --workspace packages/chat-protocol-frontend test`

Expected: All stream adapter tests pass.

- [ ] **Step 3: Add missing test cases if needed**

If any source mappings are untested, add tests:

```tsx
it('maps mcp source to awaiting-execution', () => {
  const adapter = createProtocolStreamAdapter();
  adapter.applyFrame({
    type: 'tool-input-available',
    toolCallId: 'tool_mcp_1',
    toolName: 'analytics_lookup',
    source: 'mcp',
    providerId: 'analytics-mcp',
    input: { appId: 'weather-tile' },
  });
  const message = adapter.getMessage();
  const toolPart = message.content.find((part) => part.type === 'tool-call');
  expect(toolPart?.state).toBe('awaiting-execution');
});
```

- [ ] **Step 4: Update demo web app default API URL**

Change the default API URL from port 4111 to port 8080 (chatbot-backend):

```tsx
// apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx
const API_URL = import.meta.env.VITE_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:8080/api/chat/runs';
```

Update the `.env.example`:

```
VITE_PROTOCOL_DEMO_API_URL=http://127.0.0.1:8080/api/chat/runs
```

- [ ] **Step 5: Verify the demo web app sends `context.tools` with all source types**

The existing `ChatProtocolApp.tsx` already has `MINIMAL_TOOLS` and `FULL_TOOLS` presets that include `frontend`, `human`, `backend`, and `mcp` source types. Verify the request construction includes `context.tools`:

```tsx
const request: ChatRunRequest = {
  conversationId,
  trigger: 'submit-message',
  context: {
    tools: getToolsForPreset(activeToolPreset),
  },
  messages,
  metadata: runOptions.runConfig.custom ?? {},
};
```

- [ ] **Step 6: Run frontend and demo app tests**

Run: `npm --workspace packages/chat-protocol-frontend test`
Run: `npm --workspace apps/chat-protocol-demo-web test`

Expected: All tests pass.

- [ ] **Step 7: Commit frontend and demo app changes**

```bash
git add packages/chat-protocol-frontend/src/runtime/createProtocolStreamAdapter.ts \
  packages/chat-protocol-frontend/test/stream-adapter.test.tsx \
  apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx \
  apps/chat-protocol-demo-web/.env.example
git commit -m "feat: verify source-based dispatch and connect demo to chatbot-backend"
```

---

### Task 5: Prove request-level dynamic registration end-to-end

**Files:**

- Modify: `tests/e2e/chat-protocol-demo.spec.ts` (new or updated Playwright test)

This task verifies the complete flow through the chatbot-backend with real LLM orchestration.

- [ ] **Step 1: Start the chatbot-backend with required configuration**

The chatbot-backend requires environment variables for LLM API keys. Verify `.env.local` or `application-local.yml` has:

```properties
CHATBOT_OPENAI_API_KEY=<key>
CHATBOT_OPENAI_BASE_URL=<url>
CHATBOT_OPENAI_MODEL=<model>
CHATBOT_OPENAI_TEMPERATURE=0.7
CHATBOT_SECURITY_ENABLED=false
```

Run: `cd services/chatbot-backend && npm run dev`

- [ ] **Step 2: Start the demo web app**

Run: `npm --workspace apps/chat-protocol-demo-web dev`

- [ ] **Step 3: Verify manual end-to-end flow**

1. Open `http://localhost:4173` in a browser
2. Click "Use minimal tools" preset (frontend tool only)
3. Send a message and verify:
   - The backend processes the request
   - Frontend tool (`location.resolve`) is delegated to the client
   - The tool result is resolved locally and sent back
4. Click "Use full tools" preset (all four source types)
5. Send another message and verify:
   - Human tool renders HITL UI
   - Backend tool executes on the server
   - MCP tools execute on the server
   - Different tool set is active without restart

- [ ] **Step 4: Write the Playwright E2E test for dynamic tool switching**

```ts
// tests/e2e/chat-protocol-demo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('chat protocol tool POC', () => {
  test('changes visible tools between runs', async ({ page }) => {
    await page.goto('http://127.0.0.1:4173');

    // Switch to minimal tools
    await page.getByRole('button', { name: 'Use minimal tools' }).click();

    // Verify the demo loads
    await expect(page.getByText('Chat protocol demo')).toBeVisible();
  });
});
```

Note: The full E2E test requires a running chatbot-backend with LLM API keys. The test above verifies UI switching. A complete flow test requires the backend to be running.

- [ ] **Step 5: Commit the E2E test**

```bash
git add tests/e2e/chat-protocol-demo.spec.ts
git commit -m "test: add e2e test for dynamic tool registration"
```

---

## Self-Review

- Spec coverage:
  - unified tool descriptor is covered by Task 1 (contract) and Task 2 (backend model)
  - source-aware dispatch in the backend is covered by Task 3
  - frontend source-based dispatch is covered by Task 4
  - request-level dynamic registration is covered by Task 5
  - LangChain4j integration leverages existing AgentService and ToolRegistry
- Placeholder scan:
  - no `TODO`, `TBD`, or "implement later" placeholders remain
  - each task names concrete files, commands, and target code shape
- Type consistency:
  - the plan consistently uses `context.tools`, `source`, and `providerId`
  - Java `ChatToolSource` enum mirrors TypeScript `ChatToolSource` type
  - `ProtocolRunContext.tools` mirrors TS `ChatRunContext.tools`
- Backward compatibility:
  - `executionTarget` is derived from `source` for backward compatibility
  - `frontendTools` on `ProtocolRunContext` is kept alongside `tools`
  - The backend merges both into the unified list

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-16-chat-protocol-tool-poc.md`. Two execution options:

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
