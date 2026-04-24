package com.fdc3.elasticsearchmcp.catalog;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FunctionUsageText2SqlModule implements Text2SqlModule {

    static final String DATASET_NAME = "user_monitoring";
    static final String TABLE_NAME = "single-ui-bff-analytic";

    @Override
    public List<AnalyticsDataset> datasets() {
        return List.of(AnalyticsDataset.builder(DATASET_NAME, TABLE_NAME)
                .dimension(new SemanticDimension(
                        "function",
                        "attribute16",
                        "Clicked element path, for example /cashflow_blotter/cashflow_cn/quick_search/search_btn.",
                        List.of("function", "feature", "clicked element", "button", "action")
                ))
                .dimension(new SemanticDimension(
                        "user",
                        "userId",
                        "User identifier for unique visitor and user-level questions.",
                        List.of("user", "visitor", "visited user")
                ))
                .metric(new SemanticMetric(
                        "popularity",
                        "COUNT(*)",
                        "Count matching events and sort descending for most popular or most used questions.",
                        List.of("popular", "most used", "top", "frequent", "usage")
                ))
                .metric(new SemanticMetric(
                        "visited users",
                        "COUNT(DISTINCT userId)",
                        "Count distinct users.",
                        List.of("uv", "users", "visited users", "unique users")
                ))
                .entity(BusinessEntity.builder("trades")
                        .filter("tile", "trade")
                        .filter("container", "trade_blotter")
                        .synonym("trade blotter")
                        .build())
                .entity(BusinessEntity.builder("cashflow blotter")
                        .filter("tile", "cashflow_cn")
                        .filter("container", "cashflow_blotter_cn")
                        .synonym("cashflow")
                        .build())
                .example(new QueryExample(
                        "what's the most popular function in trades",
                        """
                                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                                FROM "single-ui-bff-analytic"
                                WHERE tile = 'trade'
                                  AND container = 'trade_blotter'
                                  AND attribute16 IS NOT NULL
                                GROUP BY attribute16
                                ORDER BY usage_count DESC
                                LIMIT 10
                                """
                ))
                .build());
    }
}
