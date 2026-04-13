package com.fdc3.chatbot.controlplane.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolvedCapability {

    private String capabilityId;
    private String providerId;
    private String targetName;
    private String executionType;
    private String accessType;
    private String tenantScope;

    @Builder.Default
    private List<String> requiredInputs = new ArrayList<>();

    @Builder.Default
    private List<String> optionalInputs = new ArrayList<>();

    @Builder.Default
    private List<String> promptHints = new ArrayList<>();

    @Builder.Default
    private List<String> availableToolNames = new ArrayList<>();
}
