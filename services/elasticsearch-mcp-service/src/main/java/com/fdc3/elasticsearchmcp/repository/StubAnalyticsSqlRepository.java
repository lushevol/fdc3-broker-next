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
        return new SqlQueryResponse(
                sql,
                limit,
                List.of(
                        new SqlColumn("function_path", "keyword"),
                        new SqlColumn("usage_count", "long")
                ),
                List.of(
                        Map.of("function_path", "/trade_blotter/trade/quick_search/search_btn", "usage_count", 42L),
                        Map.of("function_path", "/trade_blotter/trade/filter/apply_btn", "usage_count", 17L)
                ),
                2
        );
    }
}
