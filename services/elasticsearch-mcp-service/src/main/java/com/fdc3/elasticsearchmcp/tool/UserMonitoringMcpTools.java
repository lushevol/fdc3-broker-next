package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AnalyticsSqlService;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.tool.model.FunctionUsageCount;
import com.fdc3.elasticsearchmcp.tool.model.FunctionUsageRankingResponse;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import com.fdc3.elasticsearchmcp.tool.model.UserOperationCount;
import com.fdc3.elasticsearchmcp.tool.model.UserOperationRankingResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@Component
public class UserMonitoringMcpTools {

    private static final Logger log = LoggerFactory.getLogger(UserMonitoringMcpTools.class);

    private static final int DEFAULT_LIMIT = 10;
    private static final String ANALYTICS_TABLE = "\"single-ui-bff-analytic\"";

    private final AnalyticsSqlService analyticsSqlService;
    private final Clock clock;

    public UserMonitoringMcpTools(AnalyticsSqlService analyticsSqlService, Clock clock) {
        this.analyticsSqlService = analyticsSqlService;
        this.clock = clock;
    }

    @McpTool(name = "highest_operation_users_by_application", description = "Return users with the highest operation counts for an application. Defaults to the last 1 month and limit 10. Supported applications: cashflow blotter, trades.")
    public UserOperationRankingResponse highestOperationUsersByApplication(
            @McpToolParam(description = "Application name. Supported values: cashflow blotter, trades", required = true) String application,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format. Defaults to one month before endTime.", required = false) String startTime,
            @McpToolParam(description = "Inclusive end timestamp in ISO-8601 format. Defaults to now.", required = false) String endTime,
            @McpToolParam(description = "Maximum users to return. Defaults to 10 and is capped by SQL safety validation.", required = false) Integer limit
    ) {
        ApplicationVisitTarget target = resolveTarget(application);
        TimeWindow window = resolveWindow(startTime, endTime);
        int effectiveLimit = normalizeLimit(limit);
        String sql = """
                SELECT userId AS user_id, COUNT(*) AS operation_count
                FROM %s
                WHERE tile = '%s'
                  AND container = '%s'
                  AND createdAt >= '%s'
                  AND createdAt <= '%s'
                  AND userId IS NOT NULL
                  AND attribute16 IS NOT NULL
                GROUP BY userId
                ORDER BY operation_count DESC
                LIMIT %d
                """.formatted(
                ANALYTICS_TABLE,
                target.tile(),
                target.container(),
                window.startTime(),
                window.endTime(),
                effectiveLimit
        );

        log.info("highestOperationUsersByApplication called: application={}, startTime={}, endTime={}, limit={}",
                target.applicationName(), window.startTime(), window.endTime(), effectiveLimit);
        SqlQueryResponse response = analyticsSqlService.execute(sql, effectiveLimit);
        List<UserOperationCount> users = response.rows().stream()
                .map(row -> new UserOperationCount(stringValue(row, "user_id"), longValue(row, "operation_count")))
                .toList();
        return new UserOperationRankingResponse(target.applicationName(), window.startTime(), window.endTime(), effectiveLimit, users);
    }

    @McpTool(name = "most_used_functions_by_application", description = "Return the most used function paths for an application. Defaults to the last 1 month and limit 10. Supported applications: cashflow blotter, trades.")
    public FunctionUsageRankingResponse mostUsedFunctionsByApplication(
            @McpToolParam(description = "Application name. Supported values: cashflow blotter, trades", required = true) String application,
            @McpToolParam(description = "Inclusive start timestamp in ISO-8601 format. Defaults to one month before endTime.", required = false) String startTime,
            @McpToolParam(description = "Inclusive end timestamp in ISO-8601 format. Defaults to now.", required = false) String endTime,
            @McpToolParam(description = "Maximum functions to return. Defaults to 10 and is capped by SQL safety validation.", required = false) Integer limit
    ) {
        ApplicationVisitTarget target = resolveTarget(application);
        TimeWindow window = resolveWindow(startTime, endTime);
        int effectiveLimit = normalizeLimit(limit);
        String sql = """
                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                FROM %s
                WHERE tile = '%s'
                  AND container = '%s'
                  AND createdAt >= '%s'
                  AND createdAt <= '%s'
                  AND attribute16 IS NOT NULL
                GROUP BY attribute16
                ORDER BY usage_count DESC
                LIMIT %d
                """.formatted(
                ANALYTICS_TABLE,
                target.tile(),
                target.container(),
                window.startTime(),
                window.endTime(),
                effectiveLimit
        );

        log.info("mostUsedFunctionsByApplication called: application={}, startTime={}, endTime={}, limit={}",
                target.applicationName(), window.startTime(), window.endTime(), effectiveLimit);
        SqlQueryResponse response = analyticsSqlService.execute(sql, effectiveLimit);
        List<FunctionUsageCount> functions = response.rows().stream()
                .map(row -> new FunctionUsageCount(stringValue(row, "function_path"), longValue(row, "usage_count")))
                .toList();
        return new FunctionUsageRankingResponse(target.applicationName(), window.startTime(), window.endTime(), effectiveLimit, functions);
    }

    private ApplicationVisitTarget resolveTarget(String application) {
        ApplicationVisitTarget target = ApplicationVisitTarget.fromApplication(application);
        if (target == null) {
            throw new IllegalArgumentException("Unsupported application: " + application);
        }
        return target;
    }

    private TimeWindow resolveWindow(String startTime, String endTime) {
        Instant resolvedEndTime = StringUtils.hasText(endTime) ? parseInstant(endTime, "endTime") : Instant.now(clock);
        Instant resolvedStartTime = StringUtils.hasText(startTime)
                ? parseInstant(startTime, "startTime")
                : ZonedDateTime.ofInstant(resolvedEndTime, ZoneOffset.UTC).minusMonths(1).toInstant();
        if (resolvedStartTime.isAfter(resolvedEndTime)) {
            throw new IllegalArgumentException("startTime must be before or equal to endTime");
        }
        return new TimeWindow(resolvedStartTime, resolvedEndTime);
    }

    private Instant parseInstant(String value, String fieldName) {
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException(fieldName + " must be a valid ISO-8601 instant", exception);
        }
    }

    private int normalizeLimit(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_LIMIT;
        }
        if (limit > 100) {
            return 100; // Cap the limit to prevent excessive load
        }
        return limit;
    }

    private String stringValue(Map<String, Object> row, String fieldName) {
        Object value = row.get(fieldName);
        return value == null ? null : value.toString();
    }

    private long longValue(Map<String, Object> row, String fieldName) {
        Object value = row.get(fieldName);
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value == null) {
            return 0L;
        }
        return Long.parseLong(value.toString());
    }

    private record TimeWindow(Instant startTime, Instant endTime) {
    }
}
