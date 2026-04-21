package com.fdc3.chatbot.controlplane.planning;

import com.fdc3.chatbot.controlplane.model.ExecutionPlan;
import com.fdc3.chatbot.controlplane.model.ExecutionStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class ExecutionPlannerTest {

    @Test
    void buildsSingleMcpReadStepForExplicitStatisticsPrompt() {
        ExecutionPlanner planner = new ExecutionPlanner();

        ExecutionPlan plan = planner.plan(
                "Get visited user count for cashflow blotter from 2026-04-01 to 2026-04-08",
                null,
                List.of(ResolvedCapability.builder()
                        .capabilityId("application-visited-user-count")
                        .providerId("elasticsearch-analytics")
                        .targetName("visited_user_count_by_application")
                        .executionType("mcp")
                        .accessType("read")
                        .requiredInputs(List.of("application", "startTime", "endTime"))
                        .build())
        );

        assertNotNull(plan);
        assertEquals(1, plan.getSteps().size());

        ExecutionStep step = plan.getSteps().get(0);
        assertEquals("mcp", step.getStepType());
        assertEquals("visited_user_count_by_application", step.getTargetName());
        assertEquals("cashflow blotter", step.getArguments().get("application"));
        assertEquals("2026-04-01T00:00:00Z", step.getArguments().get("startTime"));
        assertEquals("2026-04-08T00:00:00Z", step.getArguments().get("endTime"));
    }

    @Test
    void selectsHourlyCapabilityForTrendPrompt() {
        ExecutionPlanner planner = new ExecutionPlanner();

        ExecutionPlan plan = planner.plan(
                "Show trades hourly UV trend from 2026-04-01 to 2026-04-08",
                WorkspaceContextSnapshot.builder().build(),
                List.of(ResolvedCapability.builder()
                        .capabilityId("application-visited-user-hourly")
                        .providerId("elasticsearch-analytics")
                        .targetName("visited_user_hourly_by_application")
                        .executionType("mcp")
                        .accessType("read")
                        .requiredInputs(List.of("application", "startTime", "endTime"))
                        .build())
        );

        assertNotNull(plan);
        assertEquals(1, plan.getSteps().size());

        ExecutionStep step = plan.getSteps().get(0);
        assertEquals("visited_user_hourly_by_application", step.getTargetName());
        assertEquals("trades", step.getArguments().get("application"));
        assertEquals("2026-04-01T00:00:00Z", step.getArguments().get("startTime"));
        assertEquals("2026-04-08T00:00:00Z", step.getArguments().get("endTime"));
    }

    @Test
    void returnsNullWhenPromptDoesNotMatchSupportedCapability() {
        ExecutionPlanner planner = new ExecutionPlanner();

        ExecutionPlan plan = planner.plan(
                "Tell me a joke",
                null,
                List.of(ResolvedCapability.builder()
                        .capabilityId("application-visited-user-count")
                        .targetName("visited_user_count_by_application")
                        .executionType("mcp")
                        .accessType("read")
                        .build())
        );

        assertNull(plan);
    }
}
