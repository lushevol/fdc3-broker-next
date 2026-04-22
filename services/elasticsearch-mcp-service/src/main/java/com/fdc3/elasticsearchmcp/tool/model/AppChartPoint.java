package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;

public record AppChartPoint(Instant timestamp, long uv) {
}
