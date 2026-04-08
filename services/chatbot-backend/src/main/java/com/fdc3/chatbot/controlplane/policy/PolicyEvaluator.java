package com.fdc3.chatbot.controlplane.policy;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PolicyEvaluator {

    public PolicyDecision evaluate(ResolvedCapability capability) {
        return evaluate(capability, Map.of(), UserCapabilityContext.anonymous());
    }

    public PolicyDecision evaluate(ResolvedCapability capability, Map<String, Object> arguments) {
        return evaluate(capability, arguments, UserCapabilityContext.anonymous());
    }

    public PolicyDecision evaluate(
            ResolvedCapability capability,
            Map<String, Object> arguments,
            UserCapabilityContext userCapabilityContext
    ) {
        List<String> reasons = new ArrayList<>();
        Map<String, Object> safeArguments = arguments == null ? Map.of() : arguments;
        UserCapabilityContext safeUserContext = userCapabilityContext == null
                ? UserCapabilityContext.anonymous()
                : userCapabilityContext;

        if (capability.getTenantScope() != null && !"global".equals(capability.getTenantScope())) {
            reasons.add("Missing tenant scope for capability " + capability.getTenantScope());
            return PolicyDecision.builder()
                    .decisionType(PolicyDecisionType.DENY)
                    .reasons(reasons)
                    .build();
        }

        if ("mcp".equals(capability.getExecutionType()) && !"read".equals(capability.getAccessType())) {
            return PolicyDecision.builder()
                    .decisionType(PolicyDecisionType.REVIEW_REQUIRED)
                    .reasons(reasons)
                    .build();
        }

        if ("mcp".equals(capability.getExecutionType())
                && "read".equals(capability.getAccessType())
                && Boolean.TRUE.equals(safeArguments.get("crossTenant"))
                && (safeUserContext.getProfiles() == null
                || !safeUserContext.getProfiles().contains("cross-tenant-approved"))) {
            reasons.add("Cross-tenant read requires review for the current user context");
            return PolicyDecision.builder()
                    .decisionType(PolicyDecisionType.REVIEW_REQUIRED)
                    .reasons(reasons)
                    .build();
        }

        return PolicyDecision.builder()
                .decisionType(PolicyDecisionType.ALLOW)
                .reasons(reasons)
                .build();
    }
}
