package com.fdc3.chatbot.controlplane.policy;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PolicyEvaluator {

    public PolicyDecision evaluate(ResolvedCapability capability) {
        List<String> reasons = new ArrayList<>();

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

        return PolicyDecision.builder()
                .decisionType(PolicyDecisionType.ALLOW)
                .reasons(reasons)
                .build();
    }
}
