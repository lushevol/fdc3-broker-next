package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;

import java.time.Instant;
import java.util.List;

public interface AppAnalyticsRepository {

    AggregateMetrics fetchAggregateMetrics(AppFilter filter, Instant startTime, Instant endTime);

    List<ChartMetricsPoint> fetchChartMetrics(AppFilter filter, Instant startTime, Instant endTime, AppChartBucket bucket);
}
