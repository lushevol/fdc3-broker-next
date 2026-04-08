package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import com.fdc3.chatbot.controlplane.policy.PolicyEvaluator;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class PlanValidationServiceTest {

    @Test
    void rejectUnknownCapabilityId() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                new AgentPlan(List.of(new AgentPlanStep(
                        "analytics.unknown.read",
                        Map.of("appName", "cashflow")
                ))),
                List.of(analyticsReadCapability())
        );

        assertThat(result.valid()).isFalse();
        assertThat(result.validatedPlan()).isNull();
        assertThat(result.assistantMessage()).isEqualTo(
                "I can’t execute that request because the proposed capability is not available."
        );
    }

    @Test
    void rejectMissingRequiredArguments() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                new AgentPlan(List.of(new AgentPlanStep(
                        "analytics.app-usage.read",
                        Map.of("appName", "cashflow")
                ))),
                List.of(analyticsReadCapability())
        );

        assertThat(result.valid()).isFalse();
        assertThat(result.validatedPlan()).isNull();
        assertThat(result.assistantMessage()).isEqualTo(
                "I need more information before I can execute that request."
        );
    }

    @Test
    void markReadOnlyMcpStepAsAllowed() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                new AgentPlan(List.of(new AgentPlanStep(
                        "analytics.app-usage.read",
                        Map.of(
                                "appName", "cashflow",
                                "from", "2026-04-01",
                                "to", "2026-04-08"
                        )
                ))),
                List.of(analyticsReadCapability())
        );

        assertThat(result.valid()).isTrue();
        assertThat(result.assistantMessage()).isNull();
        assertThat(result.validatedPlan()).isNotNull();
        assertThat(result.validatedPlan().steps()).hasSize(1);
        assertThat(result.validatedPlan().steps().get(0).capabilityId()).isEqualTo("analytics.app-usage.read");
        assertThat(result.validatedPlan().steps().get(0).arguments())
                .containsEntry("appName", "cashflow")
                .containsEntry("from", "2026-04-01")
                .containsEntry("to", "2026-04-08");
        assertThat(result.validatedPlan().steps().get(0).policyDecision().getDecisionType())
                .isEqualTo(PolicyDecisionType.ALLOW);
    }

    private static ResolvedCapability analyticsReadCapability() {
        return ResolvedCapability.builder()
                .capabilityId("analytics.app-usage.read")
                .providerId("mcp")
                .targetName("statistic_count_by_app")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("appName", "from", "to"))
                .optionalInputs(List.of("workspaceId"))
                .build();
    }
}
