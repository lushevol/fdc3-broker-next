package com.fdc3.elasticsearchmcp.tool.model;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

/**
 * Request for querying user monitoring events.
 */
public record UserMonitoringRequest(
    String tile,
    String container,
    @NotNull Instant startTime,
    @NotNull Instant endTime,
    Integer limit
) {
}
