package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.repository.AppAnalyticsRepository;
import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.AppFilterType;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
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
    void statisticCountPrefersAppIdWhenBothFiltersArePresent() {
        when(repository.fetchAggregateMetrics(any(), any(), any())).thenReturn(new AggregateMetrics(42L, 10L));
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                "app-1",
                "App One",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        var response = service.statisticCountByApp(request);

        ArgumentCaptor<AppFilter> captor = ArgumentCaptor.forClass(AppFilter.class);
        verify(repository).fetchAggregateMetrics(captor.capture(), eq(request.startTime()), eq(request.endTime()));
        assertThat(captor.getValue()).isEqualTo(new AppFilter(AppFilterType.APP_ID, "app-1"));
        assertThat(response.pv()).isEqualTo(42L);
        assertThat(response.uv()).isEqualTo(10L);
        assertThat(response.appFilterType()).isEqualTo("appId");
    }

    @Test
    void chartUsesAutomaticBucketSelectionWhenNoOverrideIsProvided() {
        when(repository.fetchChartMetrics(any(), any(), any(), eq(AppChartBucket.HOUR)))
                .thenReturn(List.of(new ChartMetricsPoint(Instant.parse("2026-04-01T01:00:00Z"), 10L, 6L)));
        AppChartRequest request = new AppChartRequest(
                null,
                "App One",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-01T12:00:00Z"),
                null
        );

        var response = service.chartByApp(request);

        verify(repository).fetchChartMetrics(any(), eq(request.startTime()), eq(request.endTime()), eq(AppChartBucket.HOUR));
        assertThat(response.bucket()).isEqualTo(AppChartBucket.HOUR);
        assertThat(response.points()).hasSize(1);
        assertThat(response.points().get(0).uv()).isEqualTo(6L);
        assertThat(response.appFilterType()).isEqualTo("appName");
    }

    @Test
    void chartHonorsExplicitBucketOverride() {
        when(repository.fetchChartMetrics(any(), any(), any(), eq(AppChartBucket.DAY))).thenReturn(List.of());
        AppChartRequest request = new AppChartRequest(
                "app-2",
                "Ignored",
                Instant.parse("2026-01-01T00:00:00Z"),
                Instant.parse("2026-03-01T00:00:00Z"),
                AppChartBucket.DAY
        );

        var response = service.chartByApp(request);

        verify(repository).fetchChartMetrics(any(), eq(request.startTime()), eq(request.endTime()), eq(AppChartBucket.DAY));
        assertThat(response.bucket()).isEqualTo(AppChartBucket.DAY);
    }
}
