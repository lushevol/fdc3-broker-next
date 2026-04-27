package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.tool.model.SqlColumn;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "true")
public class StubAnalyticsSqlRepository implements AnalyticsSqlRepository {

    private static final List<Map<String, Object>> CASHFLOW_FUNCTION_ROWS = List.of(
            Map.of("function_path", "/cashflow_blotter/cashflow_cn/quick_search/search_btn", "usage_count", 31L),
            Map.of("function_path", "/cashflow_blotter/cashflow_cn/filter/apply_btn", "usage_count", 12L),
            Map.of("function_path", "/cashflow_blotter/cashflow_cn/details/open_ticket", "usage_count", 9L),
            Map.of("function_path", "/cashflow_blotter/cashflow_cn/export/download_csv", "usage_count", 6L)
    );

    private static final List<Map<String, Object>> TRADE_FUNCTION_ROWS = List.of(
            Map.of("function_path", "/trade_blotter/trade/quick_search/search_btn", "usage_count", 42L),
            Map.of("function_path", "/trade_blotter/trade/filter/apply_btn", "usage_count", 17L),
            Map.of("function_path", "/trade_blotter/trade/details/open_ticket", "usage_count", 13L),
            Map.of("function_path", "/trade_blotter/trade/order/amend", "usage_count", 8L)
    );

    private static final List<Map<String, Object>> CASHFLOW_USER_ROWS = List.of(
            Map.of("user_id", "cash.ops", "operation_count", 84L),
            Map.of("user_id", "amy.liu", "operation_count", 63L),
            Map.of("user_id", "sam.wu", "operation_count", 48L),
            Map.of("user_id", "treasury.mo", "operation_count", 31L)
    );

    private static final List<Map<String, Object>> TRADE_USER_ROWS = List.of(
            Map.of("user_id", "trader.max", "operation_count", 98L),
            Map.of("user_id", "ops.lena", "operation_count", 76L),
            Map.of("user_id", "risk.chen", "operation_count", 59L),
            Map.of("user_id", "pm.zoe", "operation_count", 41L)
    );

    @Override
    public SqlQueryResponse execute(String sql, int limit) {
        boolean isCashflow = sql.contains("tile = 'cashflow_cn'")
                || sql.contains("tile='cashflow_cn'")
                || sql.contains("container = 'cashflow_blotter_cn'")
                || sql.contains("container='cashflow_blotter_cn'");
        boolean isUserRanking = sql.contains("userId AS user_id") || sql.contains("GROUP BY userId");

        List<Map<String, Object>> rows = limitRows(
                isUserRanking
                        ? (isCashflow ? CASHFLOW_USER_ROWS : TRADE_USER_ROWS)
                        : (isCashflow ? CASHFLOW_FUNCTION_ROWS : TRADE_FUNCTION_ROWS),
                limit
        );

        return new SqlQueryResponse(
                sql,
                limit,
                isUserRanking
                        ? List.of(
                        new SqlColumn("user_id", "keyword"),
                        new SqlColumn("operation_count", "long")
                )
                        : List.of(
                        new SqlColumn("function_path", "keyword"),
                        new SqlColumn("usage_count", "long")
                ),
                rows,
                rows.size()
        );
    }

    private List<Map<String, Object>> limitRows(List<Map<String, Object>> rows, int limit) {
        if (limit <= 0 || limit >= rows.size()) {
            return rows;
        }
        return new ArrayList<>(rows.subList(0, limit));
    }
}
