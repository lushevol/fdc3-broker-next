package com.fdc3.chatbot.mcp;

import java.util.List;

public record McpStatusResponse(
        int totalProviders,
        int totalTools,
        List<McpProviderStatus> providers
) {

    public record ToolStatus(
            String name,
            String status
    ) {
        public static ToolStatus enabled(String name) {
            return new ToolStatus(name, "ENABLED");
        }
    }

    public record McpProviderStatus(
            String providerId,
            String serviceName,
            McpTransportType transportType,
            String url,
            String status,
            int toolCount,
            List<String> toolNames,
            List<ToolStatus> toolStatuses,
            String registeredAt
    ) {

        public static McpProviderStatus from(RegisteredMcpProvider provider) {
            List<ToolStatus> toolStatuses = provider.getToolNames().stream()
                    .map(ToolStatus::enabled)
                    .toList();
            return new McpProviderStatus(
                    provider.getProviderId(),
                    provider.getServiceName(),
                    provider.getTransportType(),
                    provider.getUrl(),
                    "CONNECTED",
                    provider.getToolNames().size(),
                    provider.getToolNames(),
                    toolStatuses,
                    provider.getRegisteredAt() != null
                            ? provider.getRegisteredAt().toString()
                            : null
            );
        }
    }
}
