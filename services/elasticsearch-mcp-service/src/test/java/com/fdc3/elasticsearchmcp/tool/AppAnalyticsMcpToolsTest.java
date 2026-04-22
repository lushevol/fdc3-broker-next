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
    void visitedUserCountDelegatesWithParsedRequest() {
        when(analyticsService.statisticCountByApp(any())).thenReturn(new AppStatisticCountResponse(
                "cashflow blotter",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T23:59:59Z"),
                30L
        ));

        var response = tools.visitedUserCountByApplication(
                "cashflow blotter",
                "2026-04-01T00:00:00Z",
                "2026-04-08T23:59:59Z"
        );

        ArgumentCaptor<AppStatisticCountRequest> captor = ArgumentCaptor.forClass(AppStatisticCountRequest.class);
        verify(analyticsService).statisticCountByApp(captor.capture());
        assertThat(captor.getValue().application()).isEqualTo("cashflow blotter");
        assertThat(response.uv()).isEqualTo(30L);
    }

    @Test
    void visitedUserHourlyDelegatesWithParsedRequest() {
        when(analyticsService.chartByApp(any())).thenReturn(new AppChartResponse(
                "trades",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-01T12:00:00Z"),
                AppChartBucket.HOUR,
                List.of()
        ));

        var response = tools.visitedUserHourlyByApplication(
                "trades",
                "2026-04-01T00:00:00Z",
                "2026-04-01T12:00:00Z"
        );

        assertThat(response.application()).isEqualTo("trades");
        verify(analyticsService).chartByApp(any());
    }

    @Test
    void rejectsUnsupportedApplication() {
        assertThatThrownBy(() -> tools.visitedUserCountByApplication(
                "cashflow",
                "2026-04-01T00:00:00Z",
                "2026-04-01T23:59:59Z"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("application must be one of");
    }
}
