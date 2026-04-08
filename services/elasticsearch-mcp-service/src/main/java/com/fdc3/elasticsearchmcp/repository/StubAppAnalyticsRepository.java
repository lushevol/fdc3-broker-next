package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.AppFilterType;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "true")
public class StubAppAnalyticsRepository implements AppAnalyticsRepository {

    private static final AggregateMetrics DEFAULT_METRICS = new AggregateMetrics(42L, 12L);

    private static final Map<String, AggregateMetrics> FIXTURES_BY_APP_ID = Map.of(
            "template_tile_fdc3_2", new AggregateMetrics(80L, 24L),
            "cashflow", new AggregateMetrics(120L, 30L)
    );

    private static final Map<String, AggregateMetrics> FIXTURES_BY_APP_NAME = Map.of(
            "fdc3 tile 2", new AggregateMetrics(80L, 24L),
            "cash flow", new AggregateMetrics(120L, 30L),
            "cashflow", new AggregateMetrics(120L, 30L)
    );

    @Override
    public AggregateMetrics fetchAggregateMetrics(AppFilter filter, Instant startTime, Instant endTime) {
        return resolveMetrics(filter);
    }

    @Override
    public List<ChartMetricsPoint> fetchChartMetrics(
            AppFilter filter,
            Instant startTime,
            Instant endTime,
            AppChartBucket bucket
    ) {
        AggregateMetrics metrics = resolveMetrics(filter);
        Instant firstBucketTimestamp = truncate(startTime, bucket);
        Instant secondBucketTimestamp = truncate(firstBucketTimestamp.plus(1L, toChronoUnit(bucket)), bucket);

        long firstBucketPv = Math.max(1L, metrics.pv() / 2L);
        long firstBucketUv = Math.max(1L, metrics.uv() / 2L);

        return List.of(
                new ChartMetricsPoint(firstBucketTimestamp, firstBucketPv, firstBucketUv),
                new ChartMetricsPoint(
                        secondBucketTimestamp,
                        Math.max(0L, metrics.pv() - firstBucketPv),
                        Math.max(0L, metrics.uv() - firstBucketUv)
                )
        );
    }

    private AggregateMetrics resolveMetrics(AppFilter filter) {
        if (filter.type() == AppFilterType.APP_ID) {
            return FIXTURES_BY_APP_ID.getOrDefault(normalize(filter.value()), DEFAULT_METRICS);
        }
        return FIXTURES_BY_APP_NAME.getOrDefault(normalize(filter.value()), DEFAULT_METRICS);
    }

    private String normalize(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private Instant truncate(Instant timestamp, AppChartBucket bucket) {
        return switch (bucket) {
            case HOUR -> timestamp.truncatedTo(ChronoUnit.HOURS);
            case DAY -> timestamp.truncatedTo(ChronoUnit.DAYS);
            case WEEK -> timestamp.truncatedTo(ChronoUnit.DAYS);
        };
    }

    private ChronoUnit toChronoUnit(AppChartBucket bucket) {
        return switch (bucket) {
            case HOUR -> ChronoUnit.HOURS;
            case DAY -> ChronoUnit.DAYS;
            case WEEK -> ChronoUnit.WEEKS;
        };
    }
}
