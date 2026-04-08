package com.fdc3.chatbot.agent.model;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecision;

import java.util.Map;

public record ValidatedExecutionStep(
        String capabilityId,
        ResolvedCapability capability,
        Map<String, Object> arguments,
        PolicyDecision policyDecision
) {
}
