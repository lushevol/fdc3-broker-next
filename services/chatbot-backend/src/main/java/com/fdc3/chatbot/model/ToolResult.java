package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToolResult {
    private String toolCallId;
    private String toolName;
    private Object result;
    private String error;
}
