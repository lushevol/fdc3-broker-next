package com.fdc3.chatbot.agent.model;

import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;

import java.util.List;

public record ExecutionTranscript(
        ValidatedExecutionPlan plan,
        List<ToolCall> toolCalls,
        List<ToolResult> toolResults
) {

    public ExecutionTranscript {
        toolCalls = toolCalls == null ? List.of() : List.copyOf(toolCalls);
        toolResults = toolResults == null ? List.of() : List.copyOf(toolResults);
    }
}
