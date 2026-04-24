package com.fdc3.elasticsearchmcp.e2e;

import com.fdc3.elasticsearchmcp.resource.AnalyticsText2SqlResources;
import com.fdc3.elasticsearchmcp.tool.AnalyticsSqlMcpTools;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(properties = "analytics.stub.enabled=true")
class AnalyticsSqlFlowE2ETest {

    @Autowired
    private AnalyticsText2SqlResources resources;

    @Autowired
    private AnalyticsSqlMcpTools tools;

    @Test
    void catalogPromptSamplesAndSqlExecutionWorkTogether() {
        String catalog = resources.text2SqlCatalog();
        String promptSamples = resources.text2SqlPromptSamples();

        assertThat(catalog).contains("function: field attribute16");
        assertThat(promptSamples).contains("what's the most popular function in trades");

        SqlQueryResponse response = tools.executeAnalyticsSql("""
                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                FROM "single-ui-bff-analytic"
                WHERE tile = 'trade'
                  AND container = 'trade_blotter'
                  AND attribute16 IS NOT NULL
                GROUP BY attribute16
                ORDER BY usage_count DESC
                LIMIT 10
                """, 10);

        assertThat(response.executedSql()).contains("attribute16 AS function_path");
        assertThat(response.columns()).extracting("name").containsExactly("function_path", "usage_count");
        assertThat(response.rows()).isNotEmpty();
        assertThat(response.rowCount()).isEqualTo(2);
    }
}
