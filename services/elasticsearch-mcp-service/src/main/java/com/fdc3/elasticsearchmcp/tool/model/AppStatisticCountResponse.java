package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;

public record AppStatisticCountResponse(
        String appFilterType,
        String appFilterValue,
        Instant startTime,
        Instant endTime,
        long pv,
        long uv
) {
}
