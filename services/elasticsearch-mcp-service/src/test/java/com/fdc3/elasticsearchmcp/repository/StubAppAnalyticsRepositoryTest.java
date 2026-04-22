package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
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
    void returnsDeterministicUvMetricsForCashflowBlotter() {
        var metrics = repository.fetchVisitedUserCount(
                ApplicationVisitTarget.CASHFLOW_BLOTTER,
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T23:59:59Z")
        );

        assertThat(metrics.uv()).isEqualTo(30L);
    }

    @Test
    void returnsHourlyUvPoints() {
        var points = repository.fetchVisitedUserHourly(
                ApplicationVisitTarget.TRADES,
                Instant.parse("2026-04-01T09:37:00Z"),
                Instant.parse("2026-04-01T12:00:00Z")
        );

        assertThat(points).hasSize(2);
        assertThat(points.get(0).uv() + points.get(1).uv()).isEqualTo(18L);
    }
}
