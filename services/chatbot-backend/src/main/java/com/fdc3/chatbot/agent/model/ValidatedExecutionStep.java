package com.fdc3.chatbot.agent.model;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecision;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public record ValidatedExecutionStep(
        String capabilityId,
        ResolvedCapability capability,
        Map<String, Object> arguments,
        PolicyDecision policyDecision
) {

    public ValidatedExecutionStep {
        capability = copyCapability(capability);
        arguments = immutableArguments(arguments);
        policyDecision = copyPolicyDecision(policyDecision);
    }

    @Override
    public ResolvedCapability capability() {
        return copyCapability(capability);
    }

    @Override
    public Map<String, Object> arguments() {
        return immutableArguments(arguments);
    }

    @Override
    public PolicyDecision policyDecision() {
        return copyPolicyDecision(policyDecision);
    }

    private static ResolvedCapability copyCapability(ResolvedCapability capability) {
        if (capability == null) {
            return null;
        }

        return ResolvedCapability.builder()
                .capabilityId(capability.getCapabilityId())
                .providerId(capability.getProviderId())
                .targetName(capability.getTargetName())
                .executionType(capability.getExecutionType())
                .accessType(capability.getAccessType())
                .tenantScope(capability.getTenantScope())
                .requiredInputs(copyList(capability.getRequiredInputs()))
                .optionalInputs(copyList(capability.getOptionalInputs()))
                .promptHints(copyList(capability.getPromptHints()))
                .availableToolNames(copyList(capability.getAvailableToolNames()))
                .build();
    }

    private static PolicyDecision copyPolicyDecision(PolicyDecision policyDecision) {
        if (policyDecision == null) {
            return null;
        }

        return PolicyDecision.builder()
                .decisionType(policyDecision.getDecisionType())
                .reasons(copyList(policyDecision.getReasons()))
                .build();
    }

    private static Map<String, Object> immutableArguments(Map<String, Object> arguments) {
        if (arguments == null || arguments.isEmpty()) {
            return Map.of();
        }

        return Collections.unmodifiableMap(new LinkedHashMap<>(arguments));
    }

    private static <T> List<T> copyList(List<T> values) {
        return values == null ? new ArrayList<>() : new ArrayList<>(values);
    }
}
