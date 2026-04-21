package com.fdc3.chatbot.controlplane.planning;

import com.fdc3.chatbot.controlplane.model.ExecutionPlan;
import com.fdc3.chatbot.controlplane.model.ExecutionStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Legacy compatibility planner retained only as a fallback when the agentic control loop is disabled.
 */
@Service
public class ExecutionPlanner {

    private static final Pattern DATE_RANGE_PATTERN = Pattern.compile("(\\d{4}-\\d{2}-\\d{2}).*?(\\d{4}-\\d{2}-\\d{2})");
    private static final String COUNT_TOOL = "visited_user_count_by_application";
    private static final String HOURLY_TOOL = "visited_user_hourly_by_application";

    public ExecutionPlan plan(
            String userMessage,
            WorkspaceContextSnapshot workspaceContext,
            List<ResolvedCapability> capabilities
    ) {
        java.util.regex.Matcher dateRangeMatcher = DATE_RANGE_PATTERN.matcher(userMessage);
        if (!dateRangeMatcher.find()) {
            return null;
        }

        String application = extractApplication(userMessage);
        if (application == null) {
            return null;
        }

        String targetName = isHourlyIntent(userMessage) ? HOURLY_TOOL : COUNT_TOOL;
        ResolvedCapability selectedCapability = capabilities.stream()
                .filter(capability -> targetName.equals(capability.getTargetName()))
                .findFirst()
                .orElse(null);
        if (selectedCapability == null) {
            return null;
        }

        LocalDate startDate = LocalDate.parse(dateRangeMatcher.group(1));
        LocalDate endDate = LocalDate.parse(dateRangeMatcher.group(2));
        Map<String, Object> arguments = new LinkedHashMap<>();
        arguments.put("application", application);
        arguments.put("startTime", startDate.atStartOfDay().toInstant(ZoneOffset.UTC).toString());
        arguments.put("endTime", endDate.atStartOfDay().toInstant(ZoneOffset.UTC).toString());

        return ExecutionPlan.builder()
                .steps(List.of(ExecutionStep.builder()
                        .stepType("mcp")
                        .capabilityId(selectedCapability.getCapabilityId())
                        .providerId(selectedCapability.getProviderId())
                        .targetName(selectedCapability.getTargetName())
                        .summary(buildSummary(application, targetName))
                        .arguments(arguments)
                        .build()))
                .build();
    }

    private String extractApplication(String userMessage) {
        String normalized = userMessage.toLowerCase();
        if (normalized.contains("cashflow blotter")) {
            return "cashflow blotter";
        }
        if (normalized.contains("trades")) {
            return "trades";
        }
        return null;
    }

    private boolean isHourlyIntent(String userMessage) {
        String normalized = userMessage.toLowerCase();
        return normalized.contains("hourly")
                || normalized.contains("per hour")
                || normalized.contains("each hour")
                || normalized.contains("trend")
                || normalized.contains("chart");
    }

    private String buildSummary(String application, String targetName) {
        if (HOURLY_TOOL.equals(targetName)) {
            return "Fetch hourly visited user trend for " + application;
        }
        return "Fetch visited user count for " + application;
    }
}
