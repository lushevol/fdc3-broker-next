package com.fdc3.chatbot.model;

import com.fdc3.chatbot.protocol.model.ChatToolSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToolCall {
    private String id;
    private String name;
    private Map<String, Object> arguments;
    private ToolStatus status;
    @Builder.Default
    private ExecutionTarget executionTarget = ExecutionTarget.BACKEND;
    private ChatToolSource source;
    private String providerId;

    @Builder.Default
    private boolean requiresConfirmation = false;

    public enum ToolStatus {
        PENDING, RUNNING, COMPLETED, FAILED
    }

    public enum ExecutionTarget {
        BACKEND, FRONTEND
    }
}
