package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class StubAnalyticsSqlRepositoryTest {

    @Test
    void returnsCashflowRowsForCashflowBlotterSql() {
        StubAnalyticsSqlRepository repository = new StubAnalyticsSqlRepository();

        SqlQueryResponse response = repository.execute("""
                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                FROM "single-ui-bff-analytic"
                WHERE tile = 'cashflow_cn'
                  AND container = 'cashflow_blotter_cn'
                  AND attribute16 IS NOT NULL
                GROUP BY attribute16
                ORDER BY usage_count DESC
                LIMIT 10
                """, 10);

        assertThat(response.rows())
                .extracting(row -> row.get("function_path"))
                .containsExactly(
                        "/cashflow_blotter/cashflow_cn/quick_search/search_btn",
                        "/cashflow_blotter/cashflow_cn/filter/apply_btn"
                );
    }
}
