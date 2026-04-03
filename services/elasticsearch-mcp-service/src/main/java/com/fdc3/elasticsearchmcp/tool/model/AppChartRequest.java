package com.fdc3.elasticsearchmcp.tool.model;

import com.fdc3.elasticsearchmcp.tool.model.validation.ValidAppAnalyticsRequest;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@ValidAppAnalyticsRequest
public record AppChartRequest(
        String appId,
        String appName,
        @NotNull Instant startTime,
        @NotNull Instant endTime,
        AppChartBucket bucket
) {
}
