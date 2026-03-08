package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String id;
    private Role role;
    private String content;
    private Instant timestamp;
    private List<ToolCall> toolCalls;
    private List<ToolResult> toolResults;

    public enum Role {
        USER, ASSISTANT, SYSTEM, TOOL
    }
}