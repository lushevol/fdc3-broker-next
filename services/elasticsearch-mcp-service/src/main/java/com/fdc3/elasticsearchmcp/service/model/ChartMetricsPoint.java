package com.fdc3.elasticsearchmcp.service.model;

import java.time.Instant;

public record ChartMetricsPoint(Instant timestamp, long uv) {
}
