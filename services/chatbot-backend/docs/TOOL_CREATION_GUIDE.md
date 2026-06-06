# Tool Creation Guide

Local backend tools are Spring beans that implement `ToolDefinition`.

## Interface

```java
public interface ToolDefinition {
    String getName();
    String getDescription();
    Map<String, Object> getParameters();
    default boolean requiresConfirmation() { return false; }
    CompletableFuture<Object> execute(Map<String, Object> arguments);
}
```

## Add A Local Tool

Create a class under `src/main/java/com/fdc3/chatbot/tool/`:

```java
package com.fdc3.chatbot.tool;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Component
public class DeskLookupTool implements ToolDefinition {
    @Override
    public String getName() {
        return "desk_lookup";
    }

    @Override
    public String getDescription() {
        return "Look up a desk by short code.";
    }

    @Override
    public Map<String, Object> getParameters() {
        return Map.of(
                "type", "object",
                "properties", Map.of(
                        "deskCode", Map.of(
                                "type", "string",
                                "description", "Desk short code"
                        )
                ),
                "required", List.of("deskCode")
        );
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String deskCode = String.valueOf(arguments.get("deskCode"));
            return Map.of("deskCode", deskCode, "name", "Example Desk");
        });
    }
}
```

`ToolRegistry` auto-registers all `ToolDefinition` beans.

## Confirmation

Return `true` from `requiresConfirmation()` for sensitive or destructive work. The protocol will emit `action-required` before execution.

## Tests

Add a focused unit test beside the existing tool tests:

```java
class DeskLookupToolTest {
    @Test
    void executesLookup() {
        DeskLookupTool tool = new DeskLookupTool();

        Object result = tool.execute(Map.of("deskCode", "FX")).join();

        assertNotNull(result);
    }
}
```

## MCP Tools

Prefer MCP providers for service-owned remote capabilities. Register them through `POST /api/chat/mcp/providers` or `chatbot.mcp.providers` in `application.yml`; do not call remote MCP endpoints directly from agent code.
