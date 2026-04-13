package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.AppFilterType;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class StubAppAnalyticsRepositoryTest {

    private StubAppAnalyticsRepository repository;

    @BeforeEach
    void setUp() {
        repository = new StubAppAnalyticsRepository();
    }

    @Test
    void returnsDeterministicFixtureMetricsForKnownAppId() {
        var metrics = repository.fetchAggregateMetrics(
                new AppFilter(AppFilterType.APP_ID, "template_tile_fdc3_2"),
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T00:00:00Z")
        );

        assertThat(metrics.pv()).isEqualTo(80L);
        assertThat(metrics.uv()).isEqualTo(24L);
    }

    @Test
    void returnsDefaultMetricsForUnknownApp() {
        var metrics = repository.fetchAggregateMetrics(
                new AppFilter(AppFilterType.APP_NAME, "Unknown App"),
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T00:00:00Z")
        );

        assertThat(metrics.pv()).isEqualTo(42L);
        assertThat(metrics.uv()).isEqualTo(12L);
    }

    @Test
    void producesTwoDeterministicChartPoints() {
        var points = repository.fetchChartMetrics(
                new AppFilter(AppFilterType.APP_ID, "cashflow"),
                Instant.parse("2026-04-01T09:37:00Z"),
                Instant.parse("2026-04-03T00:00:00Z"),
                AppChartBucket.DAY
        );

        assertThat(points).hasSize(2);
        assertThat(points.get(0).timestamp()).isEqualTo(Instant.parse("2026-04-01T00:00:00Z"));
        assertThat(points.get(0).pv() + points.get(1).pv()).isEqualTo(120L);
        assertThat(points.get(0).uv() + points.get(1).uv()).isEqualTo(30L);
    }
}
