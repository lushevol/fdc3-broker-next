package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.tool.model.SqlColumn;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "true")
public class StubAnalyticsSqlRepository implements AnalyticsSqlRepository {

    @Override
    public SqlQueryResponse execute(String sql, int limit) {
        boolean isCashflow = sql.contains("tile = 'cashflow_cn'")
                || sql.contains("tile='cashflow_cn'")
                || sql.contains("container = 'cashflow_blotter_cn'")
                || sql.contains("container='cashflow_blotter_cn'");
        List<Map<String, Object>> rows = isCashflow
                ? List.of(
                        Map.of("function_path", "/cashflow_blotter/cashflow_cn/quick_search/search_btn", "usage_count", 31L),
                        Map.of("function_path", "/cashflow_blotter/cashflow_cn/filter/apply_btn", "usage_count", 12L)
                )
                : List.of(
                        Map.of("function_path", "/trade_blotter/trade/quick_search/search_btn", "usage_count", 42L),
                        Map.of("function_path", "/trade_blotter/trade/filter/apply_btn", "usage_count", 17L)
                );

        return new SqlQueryResponse(
                sql,
                limit,
                List.of(
                        new SqlColumn("function_path", "keyword"),
                        new SqlColumn("usage_count", "long")
                ),
                rows,
                rows.size()
        );
    }
}
