package com.fdc3.chatbot.mcp;

import java.util.Map;

public record McpToolDescriptor(
        String name,
        String description,
        Map<String, Object> inputSchema
) {
}
