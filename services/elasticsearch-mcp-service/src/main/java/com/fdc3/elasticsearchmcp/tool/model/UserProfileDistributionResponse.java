package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;
import java.util.Map;

/**
 * Response containing user profile distribution.
 */
public record UserProfileDistributionResponse(
    String tile,
    String container,
    Instant startTime,
    Instant endTime,
    Map<String, Long> profileDistribution
) {
}
