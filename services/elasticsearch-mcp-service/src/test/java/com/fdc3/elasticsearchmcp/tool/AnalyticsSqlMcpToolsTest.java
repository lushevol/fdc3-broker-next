package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AnalyticsSqlService;
import com.fdc3.elasticsearchmcp.tool.model.SqlColumn;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AnalyticsSqlMcpToolsTest {

    @Test
    void delegatesSqlExecution() {
        AnalyticsSqlService service = mock(AnalyticsSqlService.class);
        AnalyticsSqlMcpTools tools = new AnalyticsSqlMcpTools(service);
        SqlQueryResponse expected = new SqlQueryResponse(
                "SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 1",
                1,
                List.of(new SqlColumn("function_path", "keyword")),
                List.of(Map.of("function_path", "/trade/path")),
                1
        );
        when(service.execute("SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 1", 1)).thenReturn(expected);

        SqlQueryResponse actual = tools.executeAnalyticsSql("SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 1", 1);

        assertThat(actual).isEqualTo(expected);
        verify(service).execute("SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 1", 1);
    }

    @Test
    void usesDefaultLimitWhenMcpOmitsOptionalLimit() {
        AnalyticsSqlService service = mock(AnalyticsSqlService.class);
        AnalyticsSqlMcpTools tools = new AnalyticsSqlMcpTools(service);
        SqlQueryResponse expected = new SqlQueryResponse(
                "SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 10",
                10,
                List.of(new SqlColumn("function_path", "keyword")),
                List.of(Map.of("function_path", "/trade/path")),
                1
        );
        when(service.execute("SELECT attribute16 FROM \"single-ui-bff-analytic\"", 0)).thenReturn(expected);

        SqlQueryResponse actual = tools.executeAnalyticsSql("SELECT attribute16 FROM \"single-ui-bff-analytic\"", null);

        assertThat(actual).isEqualTo(expected);
        verify(service).execute("SELECT attribute16 FROM \"single-ui-bff-analytic\"", 0);
    }

    @Test
    void exposesCatalogGuidanceInToolDescriptionForToolCallingModels() {
        assertThat(AnalyticsSqlMcpTools.TOOL_DESCRIPTION)
                .contains("single-ui-bff-analytic")
                .contains("attribute16")
                .contains("tile = 'trade'")
                .contains("container = 'trade_blotter'")
                .contains("tile = 'cashflow_cn'")
                .contains("container = 'cashflow_blotter_cn'")
                .contains("GROUP BY <dimension>");
    }

    @Test
    void toolDescriptionIsGenericInsteadOfPromptSpecific() {
        assertThat(AnalyticsSqlMcpTools.TOOL_DESCRIPTION)
                .doesNotContain("what's the most popular function in trades")
                .doesNotContain("For \"");
    }
}
