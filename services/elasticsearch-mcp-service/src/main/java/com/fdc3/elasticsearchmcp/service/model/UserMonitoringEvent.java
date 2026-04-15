package com.fdc3.elasticsearchmcp.service.model;

import java.time.Instant;

/**
 * Represents a raw user monitoring event from Elasticsearch.
 * Simulates the data schema stored in the user-operation-logs index.
 */
public record UserMonitoringEvent(
    String tile,
    String container,
    String action,
    Instant timestamp,
    String userId,
    String userProfile
) {
}
