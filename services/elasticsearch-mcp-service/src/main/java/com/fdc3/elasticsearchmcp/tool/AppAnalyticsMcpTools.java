package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AppAnalyticsService;
import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppChartResponse;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AppAnalyticsMcpTools.class);

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
        log.info("visitedUserCountByApplication called: application={}, startTime={}, endTime={}", application, startTime, endTime);
        try {
            AppStatisticCountRequest request = new AppStatisticCountRequest(
                    normalize(application),
                    parseInstant(startTime, "startTime"),
                    parseInstant(endTime, "endTime")
            );
            log.debug("Parsed request: application={}, startTime={}, endTime={}", request.application(), request.startTime(), request.endTime());
            validate(request);
            log.debug("Request validated successfully");
            AppStatisticCountResponse response = analyticsService.statisticCountByApp(request);
            log.debug("Returning response: uv={}", response.uv());
            return response;
        } catch (IllegalArgumentException e) {
            log.error("Validation error in visitedUserCountByApplication: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Error in visitedUserCountByApplication: application={}, error={}", application, e.getMessage(), e);
            throw e;
        }
    }

    @McpTool(name = "visited_user_hourly_by_application", description = "Return hourly UV data for an application within a time window. Supported applications: cashflow blotter, trades")
    public AppChartResponse visitedUserHourlyByApplication(
            @McpToolParam(description = "Application name. Supported values: cashflow blotter, trades", required = true) String application,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format", required = true) String startTime,
            @McpToolParam(description = "Inclusive end timestamp in ISO-8601 format", required = true) String endTime
    ) {
        log.info("visitedUserHourlyByApplication called: application={}, startTime={}, endTime={}", application, startTime, endTime);
        try {
            AppChartRequest request = new AppChartRequest(
                    normalize(application),
                    parseInstant(startTime, "startTime"),
                    parseInstant(endTime, "endTime")
            );
            log.debug("Parsed request: application={}, startTime={}, endTime={}", request.application(), request.startTime(), request.endTime());
            validate(request);
            log.debug("Request validated successfully");
            AppChartResponse response = analyticsService.chartByApp(request);
            log.debug("Returning response: bucket={}, pointCount={}", response.bucket(), response.points() != null ? response.points().size() : 0);
            return response;
        } catch (IllegalArgumentException e) {
            log.error("Validation error in visitedUserHourlyByApplication: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Error in visitedUserHourlyByApplication: application={}, error={}", application, e.getMessage(), e);
            throw e;
        }
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
