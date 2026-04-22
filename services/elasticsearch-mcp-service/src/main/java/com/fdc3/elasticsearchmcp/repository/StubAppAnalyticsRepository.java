package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "true")
public class StubAppAnalyticsRepository implements AppAnalyticsRepository {

    private static final Logger log = LoggerFactory.getLogger(StubAppAnalyticsRepository.class);

    private static final Map<ApplicationVisitTarget, AggregateMetrics> METRICS_BY_APPLICATION = Map.of(
            ApplicationVisitTarget.CASHFLOW_BLOTTER, new AggregateMetrics(0L, 30L),
            ApplicationVisitTarget.TRADES, new AggregateMetrics(0L, 18L)
    );

    @Override
    public AggregateMetrics fetchVisitedUserCount(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        log.debug("[STUB] fetchVisitedUserCount: target={}, startTime={}, endTime={}", target.applicationName(), startTime, endTime);
        AggregateMetrics result = METRICS_BY_APPLICATION.getOrDefault(target, new AggregateMetrics(0L, 0L));
        log.debug("[STUB] Returning metrics: uv={}", result.uv());
        return result;
    }

    @Override
    public List<ChartMetricsPoint> fetchVisitedUserHourly(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        log.debug("[STUB] fetchVisitedUserHourly: target={}, startTime={}, endTime={}", target.applicationName(), startTime, endTime);
        AggregateMetrics metrics = fetchVisitedUserCount(target, startTime, endTime);
        Instant firstBucket = startTime.truncatedTo(ChronoUnit.HOURS);
        Instant secondBucket = firstBucket.plus(1, ChronoUnit.HOURS);
        long firstUv = Math.max(1L, metrics.uv() / 2L);
        long secondUv = Math.max(0L, metrics.uv() - firstUv);
        log.debug("[STUB] Returning chart points: firstBucket={} uv={}, secondBucket={} uv={}", firstBucket, firstUv, secondBucket, secondUv);
        return List.of(
                new ChartMetricsPoint(firstBucket, firstUv),
                new ChartMetricsPoint(secondBucket, secondUv)
        );
    }
}
