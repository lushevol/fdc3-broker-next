package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AnalyticsSqlService;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "analytics.tools.text2sql", name = "enabled", havingValue = "true")
public class AnalyticsSqlMcpTools {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsSqlMcpTools.class);
    public static final String TOOL_DESCRIPTION = """
            Execute validated read-only Elasticsearch SQL against the analytics index.
            Generate SQL from this embedded Text2SQL catalog. Do not query catalog or metadata tables.
            Only SELECT statements are allowed. Do not use SELECT *, SHOW, DESCRIBE, or analytics:// URIs.

            Dataset user_monitoring:
            - Table: "single-ui-bff-analytic"
            - Dimension function path: attribute16, alias function_path. Synonyms: function, feature, clicked element, button, action, path.
            - Dimension user: userId. Synonyms: user, visitor, unique user.
            - Metric popularity/clicks/usage/top/most used: COUNT(*), alias usage_count, sort descending.
            - Metric visited users/UV: COUNT(DISTINCT userId), alias user_count.
            - Time duration: createdAt, always set a time boundary for query. End time by default is now, start time is 30 days ago.

            Entity filters:
            - trades, trade blotter: tile = 'trade' AND container = 'trade_blotter'
            - cashflow blotter, cashflow: tile = 'cashflow_cn' AND container = 'cashflow_blotter_cn'

            Aggregation template:
            SELECT <dimension> AS <alias>, <metric> AS <metric_alias>
            FROM "single-ui-bff-analytic"
            WHERE <entity filters>
              AND <dimension> IS NOT NULL
              AND createdAt >= <start time, default 30 days ago>
              AND createdAt <= <end time, default now>
            GROUP BY <dimension>
            ORDER BY <metric_alias> DESC
            LIMIT <requested N or 10>
            """;
    static final int DEFAULT_LIMIT = 0;

    private final AnalyticsSqlService analyticsSqlService;

    public AnalyticsSqlMcpTools(AnalyticsSqlService analyticsSqlService) {
        this.analyticsSqlService = analyticsSqlService;
    }

    @McpTool(name = "execute_analytics_sql", description = TOOL_DESCRIPTION)
    public SqlQueryResponse executeAnalyticsSql(
            @McpToolParam(description = "Read-only SELECT SQL generated from the embedded Text2SQL catalog in the tool description", required = true) String sql,
            @McpToolParam(description = "Requested maximum rows. The service caps this at 100.", required = false) Integer limit
    ) {
        int requestedLimit = limit == null ? DEFAULT_LIMIT : limit;
        log.info("executeAnalyticsSql called: limit={}", requestedLimit);
        return analyticsSqlService.execute(sql, requestedLimit);
    }
}
