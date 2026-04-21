package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;

public record AppStatisticCountResponse(
        String application,
        Instant startTime,
        Instant endTime,
        long uv
) {
}
