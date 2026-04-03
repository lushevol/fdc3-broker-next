package com.fdc3.chatbot.mcp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredMcpProvider {

    private String providerId;
    private String serviceName;
    private McpTransportType transportType;
    private String url;
    @Builder.Default
    private List<String> enabledProfiles = List.of();
    @Builder.Default
    private List<String> toolNames = List.of();
    private String description;
    @Builder.Default
    private Instant registeredAt = Instant.now();
}
