package com.fdc3.chatbot.mcp;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McpProviderRegistrationRequest {

    @NotBlank
    private String providerId;

    @NotBlank
    private String serviceName;

    @NotNull
    private McpTransportType transportType;

    @NotBlank
    private String url;

    @Builder.Default
    private List<String> enabledProfiles = List.of();

    private String description;
}
