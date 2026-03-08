package com.fdc3.chatbot.tool;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Interface for tool definitions that can be executed by the AI agent.
 */
public interface ToolDefinition {

    /**
     * Unique name of the tool.
     */
    String getName();

    /**
     * Description of what the tool does.
     */
    String getDescription();

    /**
     * JSON Schema for the tool parameters.
     */
    Map<String, Object> getParameters();

    /**
     * Whether this tool requires user confirmation before execution.
     */
    default boolean requiresConfirmation() {
        return false;
    }

    /**
     * Execute the tool with the given arguments.
     */
    CompletableFuture<Object> execute(Map<String, Object> arguments);
}