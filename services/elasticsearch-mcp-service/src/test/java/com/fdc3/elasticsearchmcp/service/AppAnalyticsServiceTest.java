package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.repository.AppAnalyticsRepository;
import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppAnalyticsServiceTest {

    @Mock
    private AppAnalyticsRepository repository;

    private AppAnalyticsService service;

    @BeforeEach
    void setUp() {
        service = new AppAnalyticsService(repository, new BucketResolver());
    }

    @Test
    void statisticCountMapsApplicationToVisitTarget() {
        when(repository.fetchVisitedUserCount(any(), any(), any())).thenReturn(new AggregateMetrics(0L, 30L));
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                "cashflow blotter",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T23:59:59Z")
        );

        var response = service.statisticCountByApp(request);

        ArgumentCaptor<ApplicationVisitTarget> captor = ArgumentCaptor.forClass(ApplicationVisitTarget.class);
        verify(repository).fetchVisitedUserCount(captor.capture(), eq(request.startTime()), eq(request.endTime()));
        assertThat(captor.getValue()).isEqualTo(ApplicationVisitTarget.CASHFLOW_BLOTTER);
        assertThat(response.application()).isEqualTo("cashflow blotter");
        assertThat(response.uv()).isEqualTo(30L);
    }

    @Test
    void chartReturnsHourlyUvPointsForApplication() {
        when(repository.fetchVisitedUserHourly(any(), any(), any()))
                .thenReturn(List.of(new ChartMetricsPoint(Instant.parse("2026-04-01T01:00:00Z"), 6L)));
        AppChartRequest request = new AppChartRequest(
                "trades",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-01T12:00:00Z")
        );

        var response = service.chartByApp(request);

        verify(repository).fetchVisitedUserHourly(eq(ApplicationVisitTarget.TRADES), eq(request.startTime()), eq(request.endTime()));
        assertThat(response.application()).isEqualTo("trades");
        assertThat(response.bucket().name()).isEqualTo("HOUR");
        assertThat(response.points()).hasSize(1);
        assertThat(response.points().get(0).uv()).isEqualTo(6L);
    }
}
