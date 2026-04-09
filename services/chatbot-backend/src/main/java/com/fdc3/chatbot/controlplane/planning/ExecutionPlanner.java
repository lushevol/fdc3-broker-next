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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Legacy compatibility planner retained only as a fallback when the agentic control loop is disabled.
 */
@Service
public class ExecutionPlanner {

    private static final Pattern DATE_RANGE_PATTERN = Pattern.compile("(\\d{4}-\\d{2}-\\d{2}).*?(\\d{4}-\\d{2}-\\d{2})");
    private static final Pattern APP_NAME_PATTERN = Pattern.compile("for\\s+([a-zA-Z0-9_-]+)\\s+from");

    public ExecutionPlan plan(
            String userMessage,
            WorkspaceContextSnapshot workspaceContext,
            List<ResolvedCapability> capabilities
    ) {
        ResolvedCapability statisticsCapability = capabilities.stream()
                .filter(capability -> "statistic_count_by_app".equals(capability.getTargetName()))
                .findFirst()
                .orElse(null);

        if (statisticsCapability == null) {
            return null;
        }

        Matcher dateRangeMatcher = DATE_RANGE_PATTERN.matcher(userMessage);
        Matcher appNameMatcher = APP_NAME_PATTERN.matcher(userMessage);
        if (!dateRangeMatcher.find()) {
            return null;
        }

        LocalDate startDate = LocalDate.parse(dateRangeMatcher.group(1));
        LocalDate endDate = LocalDate.parse(dateRangeMatcher.group(2));
        Map<String, Object> arguments = new LinkedHashMap<>();
        String appName = appNameMatcher.find() ? appNameMatcher.group(1) : null;
        String appId = workspaceContext != null ? workspaceContext.getActiveAppId() : null;
        if (appName != null && !appName.isBlank()) {
            arguments.put("appName", appName);
        } else if (appId != null && !appId.isBlank()) {
            arguments.put("appId", appId);
        } else {
            return null;
        }
        arguments.put("startTime", startDate.atStartOfDay().toInstant(ZoneOffset.UTC).toString());
        arguments.put("endTime", endDate.atStartOfDay().toInstant(ZoneOffset.UTC).toString());
        String summaryTarget = appName != null && !appName.isBlank() ? appName : appId;

        return ExecutionPlan.builder()
                .steps(List.of(ExecutionStep.builder()
                        .stepType("mcp")
                        .capabilityId(statisticsCapability.getCapabilityId())
                        .providerId(statisticsCapability.getProviderId())
                        .targetName(statisticsCapability.getTargetName())
                        .summary("Fetch PV and UV statistics for " + summaryTarget)
                        .arguments(arguments)
                        .build()))
                .build();
    }
}
