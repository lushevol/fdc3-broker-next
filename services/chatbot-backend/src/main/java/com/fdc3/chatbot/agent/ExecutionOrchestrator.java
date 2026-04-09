package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Consumer;

public class ExecutionOrchestrator {

    private final ExecutionDependency executionDependency;

    public ExecutionOrchestrator(ExecutionDependency executionDependency) {
        this.executionDependency = executionDependency;
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
            ToolCall toolCall = ToolCall.builder()
                    .id(UUID.randomUUID().toString())
                    .name(step.capability().getTargetName())
                    .arguments(step.arguments())
                    .status(ToolCall.ToolStatus.RUNNING)
                    .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                    .requiresConfirmation(false)
                    .build();
            toolCallConsumer.accept(toolCall);
            toolCalls.add(toolCall);

            Object executionResult = executionDependency.execute(step.capability(), step.arguments());
            ToolResult toolResult = ToolResult.builder()
                    .toolCallId(toolCall.getId())
                    .toolName(toolCall.getName())
                    .result(normalizeResult(executionResult))
                    .build();
            toolResultConsumer.accept(toolResult);
            toolResults.add(toolResult);
        }

        return new ExecutionTranscript(validatedPlan, toolCalls, toolResults);
    }

    private Object normalizeResult(Object executionResult) {
        if (executionResult instanceof Map<?, ?> resultMap) {
            return Map.copyOf(resultMap);
        }
        return executionResult;
    }

    @FunctionalInterface
    public interface ExecutionDependency {
        Object execute(ResolvedCapability capability, Map<String, Object> arguments);
    }
}
