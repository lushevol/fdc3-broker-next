package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;

public interface AnalyticsSqlRepository {

    SqlQueryResponse execute(String sql, int limit);
}
