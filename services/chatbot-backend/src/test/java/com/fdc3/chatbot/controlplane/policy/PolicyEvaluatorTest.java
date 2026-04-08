package com.fdc3.chatbot.controlplane.policy;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PolicyEvaluatorTest {

    @Test
    void allowsReadOnlyMcpCapabilityByDefault() {
        PolicyEvaluator evaluator = new PolicyEvaluator();

        PolicyDecision decision = evaluator.evaluate(ResolvedCapability.builder()
                .capabilityId("app-usage-statistics")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .build());

        assertEquals(PolicyDecisionType.ALLOW, decision.getDecisionType());
    }

    @Test
    void marksMcpMutationAsReviewRequired() {
        PolicyEvaluator evaluator = new PolicyEvaluator();

        PolicyDecision decision = evaluator.evaluate(ResolvedCapability.builder()
                .capabilityId("rebalance-portfolio")
                .executionType("mcp")
                .accessType("write")
                .tenantScope("global")
                .build());

        assertEquals(PolicyDecisionType.REVIEW_REQUIRED, decision.getDecisionType());
    }

    @Test
    void deniesCapabilityWhenTenantScopeIsMissing() {
        PolicyEvaluator evaluator = new PolicyEvaluator();

        PolicyDecision decision = evaluator.evaluate(ResolvedCapability.builder()
                .capabilityId("scoped-read")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("tenant-a")
                .build());

        assertEquals(PolicyDecisionType.DENY, decision.getDecisionType());
        assertEquals(List.of("Missing tenant scope for capability tenant-a"), decision.getReasons());
    }
}
