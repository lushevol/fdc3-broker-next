package com.fdc3.chatbot.agent.model;

import com.fdc3.chatbot.controlplane.policy.PolicyDecision;

import java.util.Map;

public record ValidatedExecutionStep(
        String capabilityId,
        String providerId,
        String targetName,
        String executionType,
        String accessType,
        Map<String, Object> arguments,
        PolicyDecision policyDecision
) {
}
