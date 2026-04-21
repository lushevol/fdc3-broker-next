package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "true")
public class StubAppAnalyticsRepository implements AppAnalyticsRepository {

    private static final Map<ApplicationVisitTarget, AggregateMetrics> METRICS_BY_APPLICATION = Map.of(
            ApplicationVisitTarget.CASHFLOW_BLOTTER, new AggregateMetrics(0L, 30L),
            ApplicationVisitTarget.TRADES, new AggregateMetrics(0L, 18L)
    );

    @Override
    public AggregateMetrics fetchVisitedUserCount(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        return METRICS_BY_APPLICATION.getOrDefault(target, new AggregateMetrics(0L, 0L));
    }

    @Override
    public List<ChartMetricsPoint> fetchVisitedUserHourly(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        AggregateMetrics metrics = fetchVisitedUserCount(target, startTime, endTime);
        Instant firstBucket = startTime.truncatedTo(ChronoUnit.HOURS);
        Instant secondBucket = firstBucket.plus(1, ChronoUnit.HOURS);
        long firstUv = Math.max(1L, metrics.uv() / 2L);
        long secondUv = Math.max(0L, metrics.uv() - firstUv);
        return List.of(
                new ChartMetricsPoint(firstBucket, firstUv),
                new ChartMetricsPoint(secondBucket, secondUv)
        );
    }
}
