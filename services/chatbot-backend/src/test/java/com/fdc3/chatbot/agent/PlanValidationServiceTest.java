package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import com.fdc3.chatbot.controlplane.policy.PolicyEvaluator;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PlanValidationServiceTest {

    @Test
    void rejectUnknownCapabilityId() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "analytics.unknown.read",
                        Map.of("application", "cashflow")
                )))),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
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
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        Map.of("application", "cashflow")
                )))),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
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
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        Map.of(
                                "application", "cashflow",
                                "startTime", "2026-04-01",
                                "endTime", "2026-04-08"
                        )
                )))),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isTrue();
        assertThat(result.reviewRequired()).isFalse();
        assertThat(result.assistantMessage()).isNull();
        assertThat(result.validatedPlan()).isNotNull();
        assertThat(result.validatedPlan().steps()).hasSize(1);
        assertThat(result.validatedPlan().steps().get(0).capabilityId()).isEqualTo("visited_user_count_by_application");
        assertThat(result.validatedPlan().steps().get(0).capability()).isEqualTo(analyticsReadCapability());
        assertThat(result.validatedPlan().steps().get(0).arguments())
                .containsEntry("application", "cashflow")
                .containsEntry("startTime", "2026-04-01")
                .containsEntry("endTime", "2026-04-08");
        assertThat(result.validatedPlan().steps().get(0).policyDecision().getDecisionType())
                .isEqualTo(PolicyDecisionType.ALLOW);
    }

    @Test
    void markReviewRequiredStepWithExplicitPlanSignal() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        Map.of(
                                "application", "cashflow",
                                "startTime", "2026-04-01",
                                "endTime", "2026-04-08",
                                "crossTenant", true
                        )
                )))),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isTrue();
        assertThat(result.reviewRequired()).isTrue();
        assertThat(result.assistantMessage()).isNull();
        assertThat(result.validatedPlan()).isNotNull();
        assertThat(result.validatedPlan().steps()).hasSize(1);
        assertThat(result.validatedPlan().steps().get(0).policyDecision().getDecisionType())
                .isEqualTo(PolicyDecisionType.REVIEW_REQUIRED);
    }

    @Test
    void rejectNullPlanStepWithoutThrowing() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(java.util.Collections.singletonList(null))),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isFalse();
        assertThat(result.reviewRequired()).isFalse();
        assertThat(result.validatedPlan()).isNull();
        assertThat(result.assistantMessage()).isEqualTo(
                "I can’t execute that request because the proposed plan is invalid."
        );
    }

    @Test
    void rejectMissingPlanAsMalformed() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                new AgentDecision(AgentDecisionType.PLAN, "Working on it.", null, null),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isFalse();
        assertThat(result.reviewRequired()).isFalse();
        assertThat(result.validatedPlan()).isNull();
        assertThat(result.assistantMessage()).isEqualTo(
                "I can’t execute that request because the proposed plan is invalid."
        );
    }

    @Test
    void rejectNullDecisionAndNullStepListAsMalformed() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult nullDecisionResult = service.validate(
                null,
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );
        PlanValidationService.PlanValidationResult nullStepListResult = service.validate(
                decisionWithPlan(new AgentPlan(null)),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        assertThat(nullDecisionResult.valid()).isFalse();
        assertThat(nullDecisionResult.reviewRequired()).isFalse();
        assertThat(nullDecisionResult.validatedPlan()).isNull();
        assertThat(nullDecisionResult.assistantMessage()).isEqualTo(
                "I can’t execute that request because the proposed plan is invalid."
        );

        assertThat(nullStepListResult.valid()).isFalse();
        assertThat(nullStepListResult.reviewRequired()).isFalse();
        assertThat(nullStepListResult.validatedPlan()).isNull();
        assertThat(nullStepListResult.assistantMessage()).isEqualTo(
                "I can’t execute that request because the proposed plan is invalid."
        );
    }

    @Test
    void rejectEmptyPlanAsMalformed() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of())),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isFalse();
        assertThat(result.reviewRequired()).isFalse();
        assertThat(result.validatedPlan()).isNull();
        assertThat(result.assistantMessage()).isEqualTo(
                "I can’t execute that request because the proposed plan is invalid."
        );
    }

    @Test
    void validatedStepDefensivelyCopiesAndShieldsMutableState() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());
        ResolvedCapability capability = analyticsReadCapability();

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        Map.of(
                                "application", "cashflow",
                                "startTime", "2026-04-01",
                                "endTime", "2026-04-08"
                        )
                )))),
                List.of(capability),
                UserCapabilityContext.anonymous()
        );

        ResolvedCapability validatedCapability = result.validatedPlan().steps().get(0).capability();
        validatedCapability.setTargetName("returned-copy-mutation");
        validatedCapability.setRequiredInputs(new ArrayList<>());

        result.validatedPlan().steps().get(0).policyDecision().setDecisionType(PolicyDecisionType.DENY);
        capability.setTargetName("mutated-target");
        capability.setRequiredInputs(new ArrayList<>());

        assertThat(result.validatedPlan().steps().get(0).capability().getTargetName()).isEqualTo("visited_user_count_by_application");
        assertThat(result.validatedPlan().steps().get(0).capability().getRequiredInputs()).containsExactly("application", "startTime", "endTime");
        assertThat(result.validatedPlan().steps().get(0).policyDecision().getDecisionType()).isEqualTo(PolicyDecisionType.ALLOW);
    }

    @Test
    void validatedStepDefensivelyCopiesNestedArgumentPayloads() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());
        List<String> mutableFilters = new ArrayList<>(List.of("cashflow"));
        Map<String, Object> mutableWindow = new HashMap<>();
        mutableWindow.put("from", "2026-04-01");
        mutableWindow.put("to", "2026-04-08");
        Map<String, Object> mutableArguments = new HashMap<>();
        mutableArguments.put("application", "cashflow");
        mutableArguments.put("startTime", "2026-04-01");
        mutableArguments.put("endTime", "2026-04-08");
        mutableArguments.put("filters", mutableFilters);
        mutableArguments.put("window", mutableWindow);

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        mutableArguments
                )))),
                List.of(analyticsReadCapability()),
                UserCapabilityContext.anonymous()
        );

        @SuppressWarnings("unchecked")
        List<String> storedFilters = (List<String>) result.validatedPlan().steps().get(0).arguments().get("filters");
        @SuppressWarnings("unchecked")
        Map<String, Object> storedWindow = (Map<String, Object>) result.validatedPlan().steps().get(0).arguments().get("window");

        mutableFilters.add("payments");
        mutableWindow.put("from", "2099-01-01");
        assertThatThrownBy(() -> storedFilters.add("mutated-return"))
                .isInstanceOf(UnsupportedOperationException.class);
        assertThatThrownBy(() -> storedWindow.put("to", "2099-12-31"))
                .isInstanceOf(UnsupportedOperationException.class);

        @SuppressWarnings("unchecked")
        List<String> reloadedFilters = (List<String>) result.validatedPlan().steps().get(0).arguments().get("filters");
        @SuppressWarnings("unchecked")
        Map<String, Object> reloadedWindow = (Map<String, Object>) result.validatedPlan().steps().get(0).arguments().get("window");

        assertThat(reloadedFilters).containsExactly("cashflow");
        assertThat(reloadedWindow)
                .containsEntry("from", "2026-04-01")
                .containsEntry("to", "2026-04-08");
    }

    @Test
    void rejectPlanWhenPolicyEvaluationDeniesStep() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        Map.of(
                                "application", "cashflow",
                                "startTime", "2026-04-01",
                                "endTime", "2026-04-08"
                        )
                )))),
                List.of(ResolvedCapability.builder()
                        .capabilityId("visited_user_count_by_application")
                        .providerId("mcp")
                        .targetName("visited_user_count_by_application")
                        .executionType("mcp")
                        .accessType("read")
                        .tenantScope("tenant-a")
                        .requiredInputs(List.of("application", "startTime", "endTime"))
                        .optionalInputs(List.of("workspaceId"))
                        .build()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isFalse();
        assertThat(result.reviewRequired()).isFalse();
        assertThat(result.validatedPlan()).isNull();
        assertThat(result.assistantMessage()).isEqualTo(
                "I can’t execute that request because it is not allowed."
        );
    }

    @Test
    void allowValidationWhenRequiredInputMetadataIsNull() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        PlanValidationService.PlanValidationResult result = service.validate(
                decisionWithPlan(new AgentPlan(List.of(new AgentPlanStep(
                        "visited_user_count_by_application",
                        Map.of("crossTenant", false)
                )))),
                List.of(ResolvedCapability.builder()
                        .capabilityId("visited_user_count_by_application")
                        .providerId("mcp")
                        .targetName("visited_user_count_by_application")
                        .executionType("mcp")
                        .accessType("read")
                        .tenantScope("global")
                        .requiredInputs(null)
                        .optionalInputs(List.of("workspaceId"))
                        .build()),
                UserCapabilityContext.anonymous()
        );

        assertThat(result.valid()).isTrue();
        assertThat(result.reviewRequired()).isFalse();
        assertThat(result.assistantMessage()).isNull();
        assertThat(result.validatedPlan()).isNotNull();
        assertThat(result.validatedPlan().steps()).hasSize(1);
    }

    private static ResolvedCapability analyticsReadCapability() {
        return ResolvedCapability.builder()
                .capabilityId("visited_user_count_by_application")
                .providerId("mcp")
                .targetName("visited_user_count_by_application")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("application", "startTime", "endTime"))
                .optionalInputs(List.of("workspaceId"))
                .build();
    }

    private static AgentDecision decisionWithPlan(AgentPlan plan) {
        return new AgentDecision(AgentDecisionType.PLAN, "Working on it.", null, plan);
    }
}
