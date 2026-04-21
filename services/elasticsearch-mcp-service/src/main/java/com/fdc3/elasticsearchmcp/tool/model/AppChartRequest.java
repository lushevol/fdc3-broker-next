package com.fdc3.elasticsearchmcp.tool.model;

import com.fdc3.elasticsearchmcp.tool.model.validation.ValidAppAnalyticsRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@ValidAppAnalyticsRequest
public record AppChartRequest(
        @NotBlank String application,
        @NotNull Instant startTime,
        @NotNull Instant endTime
) {
}
