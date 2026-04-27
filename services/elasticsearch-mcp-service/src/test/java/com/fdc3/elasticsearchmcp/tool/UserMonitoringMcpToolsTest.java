package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AnalyticsSqlService;
import com.fdc3.elasticsearchmcp.tool.model.SqlColumn;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserMonitoringMcpToolsTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(Instant.parse("2026-04-27T12:00:00Z"), ZoneOffset.UTC);

    @Test
    void highestOperationUsersUsesDefaultWindowAndLimit() {
        AnalyticsSqlService service = mock(AnalyticsSqlService.class);
        UserMonitoringMcpTools tools = new UserMonitoringMcpTools(service, FIXED_CLOCK);
        when(service.execute(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.eq(10)))
                .thenReturn(new SqlQueryResponse(
                        "executed",
                        10,
                        List.of(new SqlColumn("user_id", "keyword"), new SqlColumn("operation_count", "long")),
                        List.of(Map.of("user_id", "user-1", "operation_count", 42L)),
                        1
                ));

        var response = tools.highestOperationUsersByApplication("trades", null, null, null);

        ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        verify(service).execute(sqlCaptor.capture(), org.mockito.ArgumentMatchers.eq(10));
        assertThat(sqlCaptor.getValue())
                .contains("SELECT userId AS user_id, COUNT(*) AS operation_count")
                .contains("FROM \"single-ui-bff-analytic\"")
                .contains("tile = 'trade'")
                .contains("container = 'trade_blotter'")
                .contains("createdAt >= '2026-03-27T12:00:00Z'")
                .contains("createdAt <= '2026-04-27T12:00:00Z'")
                .contains("attribute16 IS NOT NULL")
                .contains("GROUP BY userId")
                .contains("ORDER BY operation_count DESC")
                .contains("LIMIT 10");
        assertThat(response.application()).isEqualTo("trades");
        assertThat(response.startTime()).isEqualTo(Instant.parse("2026-03-27T12:00:00Z"));
        assertThat(response.endTime()).isEqualTo(Instant.parse("2026-04-27T12:00:00Z"));
        assertThat(response.users()).hasSize(1);
        assertThat(response.users().get(0).userId()).isEqualTo("user-1");
        assertThat(response.users().get(0).count()).isEqualTo(42L);
    }

    @Test
    void mostUsedFunctionsUsesRequestedWindowAndLimit() {
        AnalyticsSqlService service = mock(AnalyticsSqlService.class);
        UserMonitoringMcpTools tools = new UserMonitoringMcpTools(service, FIXED_CLOCK);
        when(service.execute(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.eq(5)))
                .thenReturn(new SqlQueryResponse(
                        "executed",
                        5,
                        List.of(new SqlColumn("function_path", "keyword"), new SqlColumn("usage_count", "long")),
                        List.of(Map.of("function_path", "/trade/search", "usage_count", 17)),
                        1
                ));

        var response = tools.mostUsedFunctionsByApplication(
                "cashflow blotter",
                "2026-04-01T00:00:00Z",
                "2026-04-02T00:00:00Z",
                5
        );

        ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        verify(service).execute(sqlCaptor.capture(), org.mockito.ArgumentMatchers.eq(5));
        assertThat(sqlCaptor.getValue())
                .contains("SELECT attribute16 AS function_path, COUNT(*) AS usage_count")
                .contains("tile = 'cashflow_cn'")
                .contains("container = 'cashflow_blotter_cn'")
                .contains("createdAt >= '2026-04-01T00:00:00Z'")
                .contains("createdAt <= '2026-04-02T00:00:00Z'")
                .contains("attribute16 IS NOT NULL")
                .contains("GROUP BY attribute16")
                .contains("ORDER BY usage_count DESC")
                .contains("LIMIT 5");
        assertThat(response.application()).isEqualTo("cashflow blotter");
        assertThat(response.functions()).hasSize(1);
        assertThat(response.functions().get(0).functionPath()).isEqualTo("/trade/search");
        assertThat(response.functions().get(0).count()).isEqualTo(17L);
    }
}
