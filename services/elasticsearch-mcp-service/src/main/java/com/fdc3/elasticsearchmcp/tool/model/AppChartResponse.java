package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;
import java.util.List;

public record AppChartResponse(
        String application,
        Instant startTime,
        Instant endTime,
        AppChartBucket bucket,
        List<AppChartPoint> points
) {
}
