package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Registry for managing and executing tools.
 */
@Slf4j
@Service
public class ToolRegistry {

    private final Map<String, ToolDefinition> tools = new HashMap<>();

    public ToolRegistry(List<ToolDefinition> toolDefinitions) {
        // Auto-register all ToolDefinition beans
        toolDefinitions.forEach(tool -> {
            tools.put(tool.getName(), tool);
            log.info("Registered tool: {}", tool.getName());
        });
    }

    /**
     * Register a new tool.
     */
    public void register(ToolDefinition tool) {
        tools.put(tool.getName(), tool);
        log.info("Registered tool: {}", tool.getName());
    }

    /**
     * Unregister a tool.
     */
    public void unregister(String name) {
        tools.remove(name);
        log.info("Unregistered tool: {}", name);
    }

    /**
     * Get a tool by name.
     */
    public ToolDefinition getTool(String name) {
        return tools.get(name);
    }

    /**
     * Check if a tool exists.
     */
    public boolean hasTool(String name) {
        return tools.containsKey(name);
    }

    /**
     * Get all registered tools.
     */
    public Map<String, ToolDefinition> getAllTools() {
        return new HashMap<>(tools);
    }

    /**
     * Execute a tool by name.
     */
    public CompletableFuture<Object> execute(String name, Map<String, Object> arguments) {
        ToolDefinition tool = tools.get(name);
        if (tool == null) {
            log.warn("Tool not found: {}", name);
            return CompletableFuture.failedFuture(new IllegalArgumentException("Tool not found: " + name));
        }

        log.info("Executing tool: {} with arguments: {}", name, arguments);
        return tool.execute(arguments);
    }

    /**
     * Get tool schemas for LLM function calling.
     */
    public List<Map<String, Object>> getToolSchemas() {
        return tools.values().stream()
                .map(tool -> {
                    Map<String, Object> schema = new HashMap<>();
                    schema.put("type", "function");

                    Map<String, Object> function = new HashMap<>();
                    function.put("name", tool.getName());
                    function.put("description", tool.getDescription());
                    function.put("parameters", tool.getParameters());

                    schema.put("function", function);
                    return schema;
                })
                .toList();
    }

    /**
     * Check if a tool requires confirmation.
     */
    public boolean requiresConfirmation(String name) {
        ToolDefinition tool = tools.get(name);
        return tool != null && tool.requiresConfirmation();
    }
}