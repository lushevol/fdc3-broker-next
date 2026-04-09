package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Consumer;

public class ExecutionOrchestrator {
    private static final String DEFAULT_EXECUTION_ERROR = "Tool execution failed.";

    private final ExecutionDependency executionDependency;

    public ExecutionOrchestrator(ExecutionDependency executionDependency) {
        this.executionDependency = Objects.requireNonNull(executionDependency, "executionDependency");
    }

    public ExecutionTranscript execute(
            ValidatedExecutionPlan validatedPlan,
            Consumer<ToolCall> onToolCall,
            Consumer<ToolResult> onToolResult
    ) {
        Objects.requireNonNull(validatedPlan, "validatedPlan");

        Consumer<ToolCall> toolCallConsumer = onToolCall == null ? toolCall -> {
        } : onToolCall;
        Consumer<ToolResult> toolResultConsumer = onToolResult == null ? toolResult -> {
        } : onToolResult;

        List<ToolCall> toolCalls = new ArrayList<>();
        List<ToolResult> toolResults = new ArrayList<>();

        for (ValidatedExecutionStep step : validatedPlan.steps()) {
            ToolCall runningToolCall = ToolCall.builder()
                    .id(UUID.randomUUID().toString())
                    .name(step.capability().getTargetName())
                    .arguments(step.arguments())
                    .status(ToolCall.ToolStatus.RUNNING)
                    .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                    .requiresConfirmation(false)
                    .build();
            toolCallConsumer.accept(runningToolCall);

            ToolResult toolResult;
            ToolCall terminalToolCall;
            try {
                Object executionResult = executionDependency.execute(step.capability(), step.arguments());
                toolResult = ToolResult.builder()
                        .toolCallId(runningToolCall.getId())
                        .toolName(runningToolCall.getName())
                        .result(normalizeResult(executionResult))
                        .build();
                terminalToolCall = copyToolCallWithStatus(runningToolCall, ToolCall.ToolStatus.COMPLETED);
            } catch (RuntimeException exception) {
                toolResult = ToolResult.builder()
                        .toolCallId(runningToolCall.getId())
                        .toolName(runningToolCall.getName())
                        .error(resolveErrorMessage(exception))
                        .build();
                terminalToolCall = copyToolCallWithStatus(runningToolCall, ToolCall.ToolStatus.FAILED);
            }
            toolResultConsumer.accept(toolResult);
            toolCalls.add(terminalToolCall);
            toolResults.add(toolResult);
        }

        return new ExecutionTranscript(validatedPlan, toolCalls, toolResults);
    }

    private Object normalizeResult(Object executionResult) {
        if (executionResult instanceof Map<?, ?> resultMap) {
            return immutableCopyMap(resultMap);
        }
        if (executionResult instanceof List<?> resultList) {
            return immutableCopyList(resultList);
        }
        return executionResult;
    }

    private Map<String, Object> immutableCopyMap(Map<?, ?> resultMap) {
        Map<String, Object> copiedMap = new LinkedHashMap<>();
        for (Map.Entry<?, ?> entry : resultMap.entrySet()) {
            if (!(entry.getKey() instanceof String key)) {
                throw new IllegalArgumentException("Cannot normalize result map with non-string key: " + entry.getKey());
            }
            copiedMap.put(key, normalizeValue(entry.getValue()));
        }
        return Collections.unmodifiableMap(copiedMap);
    }

    private List<Object> immutableCopyList(List<?> resultList) {
        List<Object> copiedList = new ArrayList<>(resultList.size());
        for (Object value : resultList) {
            copiedList.add(normalizeValue(value));
        }
        return Collections.unmodifiableList(copiedList);
    }

    private Object normalizeValue(Object value) {
        if (value instanceof Map<?, ?> nestedMap) {
            return immutableCopyMap(nestedMap);
        }
        if (value instanceof List<?> nestedList) {
            return immutableCopyList(nestedList);
        }
        return value;
    }

    private ToolCall copyToolCallWithStatus(ToolCall toolCall, ToolCall.ToolStatus status) {
        return ToolCall.builder()
                .id(toolCall.getId())
                .name(toolCall.getName())
                .arguments(toolCall.getArguments())
                .status(status)
                .executionTarget(toolCall.getExecutionTarget())
                .requiresConfirmation(toolCall.isRequiresConfirmation())
                .build();
    }

    private String resolveErrorMessage(RuntimeException exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank() ? DEFAULT_EXECUTION_ERROR : message;
    }

    @FunctionalInterface
    public interface ExecutionDependency {
        Object execute(ResolvedCapability capability, Map<String, Object> arguments);
    }
}
