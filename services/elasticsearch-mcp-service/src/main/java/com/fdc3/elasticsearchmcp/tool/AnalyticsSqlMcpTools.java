package com.fdc3.elasticsearchmcp.tool;

import com.fdc3.elasticsearchmcp.service.AnalyticsSqlService;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsSqlMcpTools {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsSqlMcpTools.class);

    private final AnalyticsSqlService analyticsSqlService;

    public AnalyticsSqlMcpTools(AnalyticsSqlService analyticsSqlService) {
        this.analyticsSqlService = analyticsSqlService;
    }

    @McpTool(name = "execute_analytics_sql", description = "Execute validated read-only Elasticsearch SQL against the analytics index. Read analytics://text2sql/catalog before generating SQL.")
    public SqlQueryResponse executeAnalyticsSql(
            @McpToolParam(description = "Read-only SELECT SQL generated from analytics://text2sql/catalog", required = true) String sql,
            @McpToolParam(description = "Requested maximum rows. The service caps this at 100.", required = false) int limit
    ) {
        log.info("executeAnalyticsSql called: limit={}", limit);
        return analyticsSqlService.execute(sql, limit);
    }
}
