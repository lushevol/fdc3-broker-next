package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecision;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import com.fdc3.chatbot.controlplane.policy.PolicyEvaluator;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PlanValidationService {

    static final String UNKNOWN_CAPABILITY_MESSAGE =
            "I can’t execute that request because the proposed capability is not available.";
    static final String MISSING_INPUTS_MESSAGE =
            "I need more information before I can execute that request.";
    static final String DENIED_BY_POLICY_MESSAGE =
            "I can’t execute that request because it is not allowed.";

    private final PolicyEvaluator policyEvaluator;

    public PlanValidationService(PolicyEvaluator policyEvaluator) {
        this.policyEvaluator = policyEvaluator;
    }

    public PlanValidationResult validate(AgentPlan proposedPlan, List<ResolvedCapability> allowedCapabilities) {
        return validate(
                new AgentDecision(null, null, null, proposedPlan),
                allowedCapabilities,
                UserCapabilityContext.anonymous()
        );
    }

    public PlanValidationResult validate(
            AgentDecision agentDecision,
            List<ResolvedCapability> allowedCapabilities,
            UserCapabilityContext userCapabilityContext
    ) {
        AgentPlan proposedPlan = agentDecision == null ? null : agentDecision.plan();
        List<AgentPlanStep> proposedSteps = proposedPlan == null || proposedPlan.steps() == null
                ? List.of()
                : proposedPlan.steps();
        Map<String, ResolvedCapability> capabilitiesById = allowedCapabilities == null
                ? Map.of()
                : allowedCapabilities.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(
                        ResolvedCapability::getCapabilityId,
                        Function.identity(),
                        (left, right) -> left
                ));

        List<ValidatedExecutionStep> validatedSteps = new ArrayList<>();

        for (AgentPlanStep proposedStep : proposedSteps) {
            ResolvedCapability resolvedCapability = capabilitiesById.get(proposedStep.capabilityId());
            if (resolvedCapability == null) {
                return PlanValidationResult.invalid(UNKNOWN_CAPABILITY_MESSAGE);
            }

            if (hasMissingRequiredInputs(resolvedCapability, proposedStep.arguments())) {
                return PlanValidationResult.invalid(MISSING_INPUTS_MESSAGE);
            }

            PolicyDecision policyDecision = policyEvaluator.evaluate(
                    resolvedCapability,
                    proposedStep.arguments(),
                    userCapabilityContext == null ? UserCapabilityContext.anonymous() : userCapabilityContext
            );
            if (policyDecision.getDecisionType() == PolicyDecisionType.DENY) {
                return PlanValidationResult.invalid(DENIED_BY_POLICY_MESSAGE);
            }

            validatedSteps.add(new ValidatedExecutionStep(
                    resolvedCapability.getCapabilityId(),
                    resolvedCapability,
                    immutableArguments(proposedStep.arguments()),
                    policyDecision
            ));
        }

        return PlanValidationResult.valid(new ValidatedExecutionPlan(validatedSteps));
    }

    private boolean hasMissingRequiredInputs(ResolvedCapability capability, Map<String, Object> arguments) {
        Set<String> providedKeys = arguments == null ? Set.of() : arguments.keySet();

        for (String requiredInput : capability.getRequiredInputs()) {
            if (!providedKeys.contains(requiredInput) || isMissingValue(arguments.get(requiredInput))) {
                return true;
            }
        }

        return false;
    }

    private boolean isMissingValue(Object value) {
        return value == null || value instanceof String text && text.isBlank();
    }

    private Map<String, Object> immutableArguments(Map<String, Object> arguments) {
        if (arguments == null || arguments.isEmpty()) {
            return Map.of();
        }

        return Collections.unmodifiableMap(new LinkedHashMap<>(arguments));
    }

    public record PlanValidationResult(
            boolean valid,
            String assistantMessage,
            ValidatedExecutionPlan validatedPlan
    ) {

        static PlanValidationResult valid(ValidatedExecutionPlan validatedPlan) {
            return new PlanValidationResult(true, null, validatedPlan);
        }

        static PlanValidationResult invalid(String assistantMessage) {
            return new PlanValidationResult(false, assistantMessage, null);
        }
    }
}
