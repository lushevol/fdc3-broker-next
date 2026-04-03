package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AppAnalyticsService;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import com.fdc3.elasticsearchmcp.tool.model.AppChartResponse;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountResponse;
import jakarta.validation.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppAnalyticsMcpToolsTest {

    @Mock
    private AppAnalyticsService analyticsService;

    private AppAnalyticsMcpTools tools;

    @BeforeEach
    void setUp() {
        tools = new AppAnalyticsMcpTools(analyticsService, Validation.buildDefaultValidatorFactory().getValidator());
    }

    @Test
    void statisticCountDelegatesToServiceWithParsedRequest() {
        when(analyticsService.statisticCountByApp(any())).thenReturn(new AppStatisticCountResponse(
                "appId",
                "app-1",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z"),
                100L,
                25L
        ));

        var response = tools.statisticCountByApp(
                "app-1",
                null,
                "2026-04-01T00:00:00Z",
                "2026-04-02T00:00:00Z"
        );

        ArgumentCaptor<AppStatisticCountRequest> captor = ArgumentCaptor.forClass(AppStatisticCountRequest.class);
        verify(analyticsService).statisticCountByApp(captor.capture());
        assertThat(captor.getValue().appId()).isEqualTo("app-1");
        assertThat(response.uv()).isEqualTo(25L);
    }

    @Test
    void chartDelegatesToServiceWithParsedBucket() {
        when(analyticsService.chartByApp(any())).thenReturn(new AppChartResponse(
                "appName",
                "App One",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-03T00:00:00Z"),
                AppChartBucket.DAY,
                List.of()
        ));

        var response = tools.chartByApp(
                null,
                "App One",
                "2026-04-01T00:00:00Z",
                "2026-04-03T00:00:00Z",
                "day"
        );

        assertThat(response.bucket()).isEqualTo(AppChartBucket.DAY);
        verify(analyticsService).chartByApp(any());
    }

    @Test
    void rejectsMissingAppFilter() {
        assertThatThrownBy(() -> tools.statisticCountByApp(
                null,
                " ",
                "2026-04-01T00:00:00Z",
                "2026-04-02T00:00:00Z"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Either appId or appName must be provided");
    }

    @Test
    void rejectsUnknownBucket() {
        assertThatThrownBy(() -> tools.chartByApp(
                "app-1",
                null,
                "2026-04-01T00:00:00Z",
                "2026-04-02T00:00:00Z",
                "month"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bucket must be one of HOUR, DAY, or WEEK");
    }
}
