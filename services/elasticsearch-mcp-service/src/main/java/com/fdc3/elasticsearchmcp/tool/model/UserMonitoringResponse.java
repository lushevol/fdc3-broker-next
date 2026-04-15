package com.fdc3.elasticsearchmcp.tool.model;

import com.fdc3.elasticsearchmcp.service.model.UserMonitoringEvent;

import java.time.Instant;
import java.util.List;

/**
 * Response containing user monitoring events.
 */
public record UserMonitoringResponse(
    String tile,
    String container,
    Instant startTime,
    Instant endTime,
    int totalCount,
    List<UserMonitoringEvent> events
) {
}
