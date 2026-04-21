package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;

import java.time.Instant;
import java.util.List;

public interface AppAnalyticsRepository {

    AggregateMetrics fetchVisitedUserCount(ApplicationVisitTarget target, Instant startTime, Instant endTime);

    List<ChartMetricsPoint> fetchVisitedUserHourly(ApplicationVisitTarget target, Instant startTime, Instant endTime);
}
