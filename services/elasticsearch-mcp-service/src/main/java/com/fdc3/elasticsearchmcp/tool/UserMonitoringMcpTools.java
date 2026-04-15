package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.UserMonitoringAnalyticsService;
import com.fdc3.elasticsearchmcp.service.model.UserMonitoringEvent;
import com.fdc3.elasticsearchmcp.tool.model.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * MCP Tools for user monitoring analytics.
 * Provides access to raw user operation events and calculated metrics.
 */
@Component
public class UserMonitoringMcpTools {

    private final UserMonitoringAnalyticsService analyticsService;
    private final Validator validator;

    public UserMonitoringMcpTools(UserMonitoringAnalyticsService analyticsService, Validator validator) {
        this.analyticsService = analyticsService;
        this.validator = validator;
    }

    @McpTool(name = "query_user_events", description = "Query raw user monitoring events from the user-operation-logs index")
    public UserMonitoringResponse queryUserEvents(
            @McpToolParam(description = "Tile/application name (e.g., 'cashflow_blotter')", required = false) String tile,
            @McpToolParam(description = "Container name (e.g., 'ratan_container')", required = false) String container,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Exclusive end timestamp in ISO-8601 format", required = true) String endTime,
            @McpToolParam(description = "Maximum number of events to return (default: 100)", required = false) Integer limit
    ) {
        UserMonitoringRequest request = new UserMonitoringRequest(
                normalize(tile),
                normalize(container),
                parseInstant(startTime, "startTime"),
                parseInstant(endTime, "endTime"),
                limit != null ? limit : 100
        );
        validate(request);

        List<UserMonitoringEvent> events = analyticsService.queryEvents(request);
        return new UserMonitoringResponse(
                request.tile(),
                request.container(),
                request.startTime(),
                request.endTime(),
                events.size(),
                events.stream().limit(request.limit()).toList()
        );
    }

    @McpTool(name = "count_user_actions", description = "Count user actions by type for a tile/container within a time window")
    public UserActionCountResponse countUserActions(
            @McpToolParam(description = "Tile/application name (e.g., 'cashflow_blotter')", required = false) String tile,
            @McpToolParam(description = "Container name (e.g., 'ratan_container')", required = false) String container,
            @McpToolParam(description = "Comma-separated list of actions to count (e.g., 'click,input,submit')", required = true) String actions,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Exclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        Instant start = parseInstant(startTime, "startTime");
        Instant end = parseInstant(endTime, "endTime");
        List<String> actionList = List.of(actions.split(","));

        long totalCount = analyticsService.countActionsByTypes(normalize(tile), normalize(container), actionList, start, end);

        return new UserActionCountResponse(
                normalize(tile),
                normalize(container),
                start,
                end,
                actionList,
                totalCount
        );
    }

    @McpTool(name = "get_user_engagement_summary", description = "Get summary of user engagement for a tile/container within a time window")
    public UserEngagementSummaryResponse getUserEngagementSummary(
            @McpToolParam(description = "Tile/application name (e.g., 'cashflow_blotter')", required = false) String tile,
            @McpToolParam(description = "Container name (e.g., 'ratan_container')", required = false) String container,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Exclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        Instant start = parseInstant(startTime, "startTime");
        Instant end = parseInstant(endTime, "endTime");

        UserMonitoringAnalyticsService.UserEngagementSummary summary = analyticsService.calculateEngagementSummary(normalize(tile), normalize(container), start, end);

        return new UserEngagementSummaryResponse(
                normalize(tile),
                normalize(container),
                start,
                end,
                summary.totalEvents(),
                summary.uniqueUsers(),
                summary.uniqueUserProfiles(),
                summary.actionBreakdown()
        );
    }

    @McpTool(name = "get_user_profile_distribution", description = "Get distribution of user profiles for a tile/container within a time window")
    public UserProfileDistributionResponse getUserProfileDistribution(
            @McpToolParam(description = "Tile/application name (e.g., 'cashflow_blotter')", required = false) String tile,
            @McpToolParam(description = "Container name (e.g., 'ratan_container')", required = false) String container,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Exclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        Instant start = parseInstant(startTime, "startTime");
        Instant end = parseInstant(endTime, "endTime");

        Map<String, Long> distribution = analyticsService.calculateUserProfileDistribution(normalize(tile), normalize(container), start, end);

        return new UserProfileDistributionResponse(
                normalize(tile),
                normalize(container),
                start,
                end,
                distribution
        );
    }

    private void validate(Object request) {
        Set<ConstraintViolation<Object>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            String message = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .sorted()
                    .collect(Collectors.joining("; "));
            throw new IllegalArgumentException(message);
        }
    }

    private String normalize(String value) {
        return value != null && !value.isBlank() ? value.trim() : null;
    }

    private Instant parseInstant(String value, String fieldName) {
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException(fieldName + " must be a valid ISO-8601 instant", exception);
        }
    }
}
