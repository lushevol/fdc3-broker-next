# Tool Creation Guide for Backend Developers

This guide explains how to create and register new tools for the AI chatbot agent.

## Overview

Tools allow the AI agent to execute actions on behalf of the user. Each tool is a Java class that implements the `ToolDefinition` interface.

## ToolDefinition Interface

```java
public interface ToolDefinition {
    String getName();
    String getDescription();
    Map<String, Object> getParameters();
    default boolean requiresConfirmation() { return false; }
    CompletableFuture<Object> execute(Map<String, Object> arguments);
}
```

## Creating a New Tool

### 1. Create the Tool Class

Create a new class in `src/main/java/com/fdc3/chatbot/tool/`:

```java
package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class MyCustomTool implements ToolDefinition {

    @Override
    public String getName() {
        return "my_custom_tool";
    }

    @Override
    public String getDescription() {
        return "Description of what this tool does. Be specific - this is shown to the AI.";
    }

    @Override
    public Map<String, Object> getParameters() {
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");

        Map<String, Object> properties = new HashMap<>();

        // Define each parameter
        Map<String, Object> param1 = new HashMap<>();
        param1.put("type", "string");
        param1.put("description", "Description of parameter 1");
        properties.put("param1", param1);

        Map<String, Object> param2 = new HashMap<>();
        param2.put("type", "number");
        param2.put("description", "Description of parameter 2");
        properties.put("param2", param2);

        params.put("properties", properties);
        params.put("required", List.of("param1")); // Required parameters

        return params;
    }

    @Override
    public boolean requiresConfirmation() {
        return false; // Set to true for destructive operations
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String param1 = (String) arguments.get("param1");
                Number param2 = (Number) arguments.getOrDefault("param2", 0);

                // Your tool logic here
                Object result = doWork(param1, param2);

                log.info("Tool {} executed successfully", getName());
                return result;

            } catch (Exception e) {
                log.error("Tool {} failed", getName(), e);
                Map<String, Object> error = new HashMap<>();
                error.put("error", e.getMessage());
                return error;
            }
        });
    }

    private Object doWork(String param1, Number param2) {
        // Implement your tool logic
        return "Result: " + param1 + " - " + param2;
    }
}
```

### 2. Register the Tool

Tools are auto-registered via Spring's dependency injection. The `ToolRegistry` automatically picks up all beans that implement `ToolDefinition`.

### 3. Test the Tool

Create a test class:

```java
package com.fdc3.chatbot.tool;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class MyCustomToolTest {

    @Test
    void testExecute() {
        MyCustomTool tool = new MyCustomTool();

        Map<String, Object> args = Map.of(
            "param1", "test",
            "param2", 42
        );

        Object result = tool.execute(args).join();

        assertNotNull(result);
        assertTrue(result.toString().contains("test"));
    }

    @Test
    void testGetName() {
        MyCustomTool tool = new MyCustomTool();
        assertEquals("my_custom_tool", tool.getName());
    }

    @Test
    void testGetParameters() {
        MyCustomTool tool = new MyCustomTool();
        Map<String, Object> params = tool.getParameters();

        assertNotNull(params);
        assertEquals("object", params.get("type"));
        assertTrue(params.containsKey("properties"));
    }
}
```

## Parameter Schema Types

### String

```java
Map<String, Object> stringParam = new HashMap<>();
stringParam.put("type", "string");
stringParam.put("description", "A string parameter");
// Optional: enum values
stringParam.put("enum", List.of("option1", "option2"));
```

### Number

```java
Map<String, Object> numberParam = new HashMap<>();
numberParam.put("type", "number");
numberParam.put("description", "A numeric parameter");
// Optional: range
numberParam.put("minimum", 0);
numberParam.put("maximum", 100);
```

### Integer

```java
Map<String, Object> intParam = new HashMap<>();
intParam.put("type", "integer");
intParam.put("description", "An integer parameter");
```

### Boolean

```java
Map<String, Object> boolParam = new HashMap<>();
boolParam.put("type", "boolean");
boolParam.put("description", "A boolean parameter");
```

### Array

```java
Map<String, Object> arrayParam = new HashMap<>();
arrayParam.put("type", "array");
arrayParam.put("description", "An array parameter");

Map<String, Object> items = new HashMap<>();
items.put("type", "string");
arrayParam.put("items", items);
```

### Object

```java
Map<String, Object> objectParam = new HashMap<>();
objectParam.put("type", "object");
objectParam.put("description", "An object parameter");

Map<String, Object> properties = new HashMap<>();
// Add nested properties...
objectParam.put("properties", properties);
```

## Tool Confirmation

For tools that perform destructive or sensitive operations, require user confirmation:

```java
@Override
public boolean requiresConfirmation() {
    return true;
}
```

When a tool requires confirmation, the frontend will prompt the user before execution.

## External API Integration

For tools that call external APIs:

```java
@Component
public class ExternalApiTool implements ToolDefinition {

    private final WebClient webClient;

    public ExternalApiTool(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl("https://api.example.com")
            .build();
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = webClient.get()
                    .uri("/endpoint")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

                return Map.of("result", response);
            } catch (Exception e) {
                return Map.of("error", e.getMessage());
            }
        });
    }
}
```

## Best Practices

1. **Clear Names**: Use snake_case for tool names (e.g., `get_stock_price`)
2. **Detailed Descriptions**: The AI uses descriptions to understand when to use the tool
3. **Input Validation**: Validate all arguments before processing
4. **Error Handling**: Return meaningful error messages
5. **Logging**: Log tool execution for debugging
6. **Async Execution**: Use `CompletableFuture.supplyAsync()` for non-blocking execution
7. **Timeout Handling**: Set appropriate timeouts for external API calls

## Example Tools

See the existing implementations:

- `TimeTool.java` - Get current time
- `WeatherTool.java` - Get weather information
- `CalculatorTool.java` - Perform calculations