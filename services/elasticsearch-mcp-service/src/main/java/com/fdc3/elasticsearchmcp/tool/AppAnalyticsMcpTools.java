package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AppAnalyticsService;
import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppChartResponse;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AppAnalyticsMcpTools {

    private final AppAnalyticsService analyticsService;
    private final Validator validator;

    public AppAnalyticsMcpTools(AppAnalyticsService analyticsService, Validator validator) {
        this.analyticsService = analyticsService;
        this.validator = validator;
    }

    @McpTool(name = "visited_user_count_by_application", description = "Return UV count for an application within a time window. Supported applications: cashflow blotter, trades")
    public AppStatisticCountResponse visitedUserCountByApplication(
            @McpToolParam(description = "Application name. Supported values: cashflow blotter, trades", required = true) String application,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Inclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                normalize(application),
                parseInstant(startTime, "startTime"),
                parseInstant(endTime, "endTime")
        );
        validate(request);
        return analyticsService.statisticCountByApp(request);
    }

    @McpTool(name = "visited_user_hourly_by_application", description = "Return hourly UV data for an application within a time window. Supported applications: cashflow blotter, trades")
    public AppChartResponse visitedUserHourlyByApplication(
            @McpToolParam(description = "Application name. Supported values: cashflow blotter, trades", required = true) String application,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Inclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        AppChartRequest request = new AppChartRequest(
                normalize(application),
                parseInstant(startTime, "startTime"),
                parseInstant(endTime, "endTime")
        );
        validate(request);
        return analyticsService.chartByApp(request);
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
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private Instant parseInstant(String value, String fieldName) {
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException(fieldName + " must be a valid ISO-8601 instant", exception);
        }
    }
}
