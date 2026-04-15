package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;
import java.util.List;

/**
 * Response containing user action counts.
 */
public record UserActionCountResponse(
    String tile,
    String container,
    Instant startTime,
    Instant endTime,
    List<String> actions,
    long totalCount
) {
}
