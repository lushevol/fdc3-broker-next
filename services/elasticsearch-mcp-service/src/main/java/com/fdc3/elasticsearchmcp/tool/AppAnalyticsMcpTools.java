package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AppAnalyticsService;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
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

    @McpTool(name = "statistic_count_by_app", description = "Return PV and UV counts for an app within a time window")
    public AppStatisticCountResponse statisticCountByApp(
            @McpToolParam(description = "App identifier. Preferred when both filters are provided", required = false) String appId,
            @McpToolParam(description = "App display name. Used when appId is omitted", required = false) String appName,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Exclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                normalize(appId),
                normalize(appName),
                parseInstant(startTime, "startTime"),
                parseInstant(endTime, "endTime")
        );
        validate(request);
        return analyticsService.statisticCountByApp(request);
    }

    @McpTool(name = "chart_by_app", description = "Return PV and UV trend points for an app within a time window")
    public AppChartResponse chartByApp(
            @McpToolParam(description = "App identifier. Preferred when both filters are provided", required = false) String appId,
            @McpToolParam(description = "App display name. Used when appId is omitted", required = false) String appName,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Exclusive end timestamp in ISO-8601 format", required = true) String endTime,
            @McpToolParam(description = "Optional bucket override: HOUR, DAY, or WEEK", required = false) String bucket
    ) {
        AppChartRequest request = new AppChartRequest(
                normalize(appId),
                normalize(appName),
                parseInstant(startTime, "startTime"),
                parseInstant(endTime, "endTime"),
                parseBucket(bucket)
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

    private AppChartBucket parseBucket(String bucket) {
        if (!StringUtils.hasText(bucket)) {
            return null;
        }
        try {
            return AppChartBucket.valueOf(bucket.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("bucket must be one of HOUR, DAY, or WEEK", exception);
        }
    }
}
