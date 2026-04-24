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
}
