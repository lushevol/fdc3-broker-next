package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;
import java.util.Map;

/**
 * Response containing user engagement summary.
 */
public record UserEngagementSummaryResponse(
    String tile,
    String container,
    Instant startTime,
    Instant endTime,
    long totalEvents,
    long uniqueUsers,
    long uniqueUserProfiles,
    Map<String, Long> actionBreakdown
) {
}
