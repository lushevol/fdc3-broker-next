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
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                null,
                List.of(ResolvedCapability.builder()
                        .capabilityId("app-usage-statistics")
                        .providerId("elasticsearch-analytics")
                        .targetName("statistic_count_by_app")
                        .executionType("mcp")
                        .accessType("read")
                        .requiredInputs(List.of("startTime", "endTime"))
                        .optionalInputs(List.of("appId", "appName"))
                        .build())
        );

        assertNotNull(plan);
        assertEquals(1, plan.getSteps().size());

        ExecutionStep step = plan.getSteps().get(0);
        assertEquals("mcp", step.getStepType());
        assertEquals("statistic_count_by_app", step.getTargetName());
        assertEquals("cashflow", step.getArguments().get("appName"));
        assertEquals("2026-04-01T00:00:00Z", step.getArguments().get("startTime"));
        assertEquals("2026-04-08T00:00:00Z", step.getArguments().get("endTime"));
    }

    @Test
    void fallsBackToWorkspaceActiveAppWhenPromptOmitsExplicitAppName() {
        ExecutionPlanner planner = new ExecutionPlanner();

        ExecutionPlan plan = planner.plan(
                "Get app usage count from 2026-04-01 to 2026-04-08",
                WorkspaceContextSnapshot.builder()
                        .workspaceId("workspace-1")
                        .activeTileId("tile-2")
                        .activeAppId("template_tile_fdc3_2")
                        .build(),
                List.of(ResolvedCapability.builder()
                        .capabilityId("app-usage-statistics")
                        .providerId("elasticsearch-analytics")
                        .targetName("statistic_count_by_app")
                        .executionType("mcp")
                        .accessType("read")
                        .requiredInputs(List.of("startTime", "endTime"))
                        .optionalInputs(List.of("appId", "appName"))
                        .build())
        );

        assertNotNull(plan);
        assertEquals(1, plan.getSteps().size());

        ExecutionStep step = plan.getSteps().get(0);
        assertEquals("statistic_count_by_app", step.getTargetName());
        assertEquals("template_tile_fdc3_2", step.getArguments().get("appId"));
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
                        .capabilityId("app-usage-statistics")
                        .targetName("statistic_count_by_app")
                        .executionType("mcp")
                        .accessType("read")
                        .build())
        );

        assertNull(plan);
    }
}
