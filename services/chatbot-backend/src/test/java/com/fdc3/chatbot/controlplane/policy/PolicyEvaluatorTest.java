package com.fdc3.chatbot.controlplane.policy;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

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

    @Test
    void marksCrossTenantReadAsReviewRequiredWithoutApprovalProfile() {
        PolicyEvaluator evaluator = new PolicyEvaluator();

        PolicyDecision decision = evaluator.evaluate(
                ResolvedCapability.builder()
                        .capabilityId("app-usage-statistics")
                        .executionType("mcp")
                        .accessType("read")
                        .tenantScope("global")
                        .build(),
                Map.of("crossTenant", true),
                UserCapabilityContext.builder()
                        .userId("user-1")
                        .profiles(Set.of("default"))
                        .build()
        );

        assertEquals(PolicyDecisionType.REVIEW_REQUIRED, decision.getDecisionType());
        assertEquals(List.of("Cross-tenant read requires review for the current user context"), decision.getReasons());
    }

    @Test
    void allowsCrossTenantReadWhenApprovalProfileIsPresent() {
        PolicyEvaluator evaluator = new PolicyEvaluator();

        PolicyDecision decision = evaluator.evaluate(
                ResolvedCapability.builder()
                        .capabilityId("app-usage-statistics")
                        .executionType("mcp")
                        .accessType("read")
                        .tenantScope("global")
                        .build(),
                Map.of("crossTenant", true),
                UserCapabilityContext.builder()
                        .userId("user-1")
                        .profiles(Set.of("default", "cross-tenant-approved"))
                        .build()
        );

        assertEquals(PolicyDecisionType.ALLOW, decision.getDecisionType());
        assertEquals(List.of(), decision.getReasons());
    }

    @Test
    void allowsStepAwareCrossTenantReadForApprovedProfile() {
        PolicyEvaluator evaluator = new PolicyEvaluator();

        PolicyDecision decision = evaluator.evaluate(
                ResolvedCapability.builder()
                        .capabilityId("step-aware-analytics-read")
                        .executionType("mcp")
                        .accessType("read")
                        .tenantScope("global")
                        .build(),
                Map.of(
                        "crossTenant", true,
                        "appName", "cashflow"
                ),
                UserCapabilityContext.builder()
                        .userId("user-2")
                        .profiles(Set.of("cross-tenant-approved"))
                        .build()
        );

        assertEquals(PolicyDecisionType.ALLOW, decision.getDecisionType());
        assertEquals(List.of(), decision.getReasons());
    }
}
