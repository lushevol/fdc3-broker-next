package com.fdc3.chatbot.tool.agentutils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.ToolCallback;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages the fallback from ToolDefinition → ToolCallback execution path.
 * Agent-utils tools registered here are checked when the primary ToolDefinition
 * lookup in AgentService fails.
 */
public class ToolExecutionBridge {

    private static final Logger log = LoggerFactory.getLogger(ToolExecutionBridge.class);
    private static final String ASK_USER_QUESTION_TOOL = "AskUserQuestionTool";

    private final Map<String, ToolCallback> executableCallbacks = new ConcurrentHashMap<>();
    private final PendingQuestionRegistry pendingQuestionRegistry;

    public ToolExecutionBridge(List<ToolCallback> toolCallbacks) {
        this(toolCallbacks, null);
    }

    public ToolExecutionBridge(List<ToolCallback> toolCallbacks, PendingQuestionRegistry pendingQuestionRegistry) {
        this.pendingQuestionRegistry = pendingQuestionRegistry;
        if (toolCallbacks != null) {
            for (ToolCallback callback : toolCallbacks) {
                if (callback == null) {
                    continue;
                }
                String name = callback.getToolDefinition().name();
                if (executableCallbacks.putIfAbsent(name, callback) != null) {
                    log.warn("Duplicate ToolCallback name '{}' — keeping first registration", name);
                }
            }
        }
    }

    public ToolCallback getCallback(String toolName) {
        return executableCallbacks.get(toolName);
    }

    public Map<String, ToolCallback> getCallbackMap() {
        return Map.copyOf(executableCallbacks);
    }

    public boolean hasCallback(String toolName) {
        return executableCallbacks.containsKey(toolName);
    }

    /**
     * Register an additional tool callback at runtime.
     * Used by AutoMemoryTools and other late-binding tool registrations.
     */
    public void registerCallback(String name, ToolCallback callback) {
        if (executableCallbacks.putIfAbsent(name, callback) != null) {
            log.warn("Duplicate ToolCallback name '{}' — keeping first registration", name);
        }
    }

    public boolean waitsForUserAnswer(String toolName) {
        return ASK_USER_QUESTION_TOOL.equals(toolName);
    }

    public void beforeCallbackExecution(String toolName, String toolCallId) {
        if (pendingQuestionRegistry != null && waitsForUserAnswer(toolName)) {
            pendingQuestionRegistry.bindCurrentBatchId(toolCallId);
        }
    }

    public void afterCallbackExecution(String toolName) {
        if (pendingQuestionRegistry != null && waitsForUserAnswer(toolName)) {
            pendingQuestionRegistry.clearCurrentBatchId();
        }
    }
}
