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
                .startsWith(
                        "/cashflow_blotter/cashflow_cn/quick_search/search_btn",
                        "/cashflow_blotter/cashflow_cn/filter/apply_btn"
                );
    }

    @Test
    void returnsUserRankingRowsForHighestOperationUsersSql() {
        StubAnalyticsSqlRepository repository = new StubAnalyticsSqlRepository();

        SqlQueryResponse response = repository.execute("""
                SELECT userId AS user_id, COUNT(*) AS operation_count
                FROM "single-ui-bff-analytic"
                WHERE tile = 'trade'
                  AND container = 'trade_blotter'
                  AND createdAt >= '2026-03-01T00:00:00Z'
                  AND createdAt <= '2026-04-01T00:00:00Z'
                  AND userId IS NOT NULL
                  AND attribute16 IS NOT NULL
                GROUP BY userId
                ORDER BY operation_count DESC
                LIMIT 3
                """, 3);

        assertThat(response.columns())
                .extracting("name")
                .containsExactly("user_id", "operation_count");
        assertThat(response.rows())
                .extracting(row -> row.get("user_id"))
                .containsExactly("trader.max", "ops.lena", "risk.chen");
    }

    @Test
    void returnsFunctionRankingRowsForMostUsedFunctionsSql() {
        StubAnalyticsSqlRepository repository = new StubAnalyticsSqlRepository();

        SqlQueryResponse response = repository.execute("""
                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                FROM "single-ui-bff-analytic"
                WHERE tile = 'trade'
                  AND container = 'trade_blotter'
                  AND createdAt >= '2026-03-01T00:00:00Z'
                  AND createdAt <= '2026-04-01T00:00:00Z'
                  AND attribute16 IS NOT NULL
                GROUP BY attribute16
                ORDER BY usage_count DESC
                LIMIT 3
                """, 3);

        assertThat(response.columns())
                .extracting("name")
                .containsExactly("function_path", "usage_count");
        assertThat(response.rows())
                .extracting(row -> row.get("function_path"))
                .containsExactly(
                        "/trade_blotter/trade/quick_search/search_btn",
                        "/trade_blotter/trade/filter/apply_btn",
                        "/trade_blotter/trade/details/open_ticket"
                );
    }
}
