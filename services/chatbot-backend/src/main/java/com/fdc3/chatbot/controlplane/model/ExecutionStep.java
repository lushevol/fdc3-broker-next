package com.fdc3.chatbot.controlplane.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionStep {

    private String stepType;
    private String capabilityId;
    private String providerId;
    private String targetName;
    private String summary;

    @Builder.Default
    private Map<String, Object> arguments = new LinkedHashMap<>();
}
