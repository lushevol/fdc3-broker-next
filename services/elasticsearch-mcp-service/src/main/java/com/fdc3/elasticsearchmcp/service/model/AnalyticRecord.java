package com.fdc3.elasticsearchmcp.service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AnalyticRecord(
        String createdAt,
        String userId,
        String container,
        String tile,
        String name,
        String value,
        String event,
        String key
) {
}
