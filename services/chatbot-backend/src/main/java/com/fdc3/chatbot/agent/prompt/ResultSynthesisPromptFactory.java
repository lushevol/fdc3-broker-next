package com.fdc3.chatbot.agent.prompt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ResultSynthesisPromptFactory {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String build(
            String userMessage,
            AgentDecision decision,
            ExecutionTranscript transcript
    ) {
        return """
                You are writing the final assistant response for a completed execution-aware turn.
                Respond with plain assistant text only.
                Use only the actual execution results provided below.
                Do not invent tools, metrics, or conclusions that are not present in the executed data.
                If execution failed, explain the failure plainly and do not claim success.

                User goal:
                %s

                Proposed plan:
                %s

                Actual execution:
                %s
                """.formatted(
                userMessage == null ? "" : userMessage,
                toJson(planView(decision, transcript)),
                toJson(executionView(transcript))
        );
    }

    private Object planView(AgentDecision decision, ExecutionTranscript transcript) {
        if (transcript != null && transcript.plan() != null) {
            return transcript.plan().steps().stream()
                    .map(this::stepView)
                    .toList();
        }
        if (decision != null && decision.plan() != null && decision.plan().steps() != null) {
            return decision.plan().steps();
        }
        return List.of();
    }

    private Object executionView(ExecutionTranscript transcript) {
        if (transcript == null) {
            return Map.of("toolCalls", List.of(), "toolResults", List.of());
        }

        return Map.of(
                "toolCalls", transcript.toolCalls().stream().map(this::toolCallView).toList(),
                "toolResults", transcript.toolResults().stream().map(this::toolResultView).toList()
        );
    }

    private Map<String, Object> stepView(ValidatedExecutionStep step) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("capabilityId", step.capabilityId());
        view.put("targetName", step.capability() == null ? null : step.capability().getTargetName());
        view.put("arguments", step.arguments());
        return view;
    }

    private Map<String, Object> toolCallView(ToolCall toolCall) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", toolCall.getId());
        view.put("name", toolCall.getName());
        view.put("arguments", toolCall.getArguments());
        view.put("status", toolCall.getStatus());
        return view;
    }

    private Map<String, Object> toolResultView(ToolResult toolResult) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("toolCallId", toolResult.getToolCallId());
        view.put("toolName", toolResult.getToolName());
        if (toolResult.getError() != null) {
            view.put("error", toolResult.getError());
            return view;
        }

        view.put("result", toolResult.getResult());
        return view;
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to serialize synthesis prompt payload.", exception);
        }
    }
}
