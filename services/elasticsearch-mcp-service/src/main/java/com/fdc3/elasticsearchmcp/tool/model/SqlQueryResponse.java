package com.fdc3.elasticsearchmcp.tool.model;

import java.util.List;
import java.util.Map;

public record SqlQueryResponse(
        String executedSql,
        int limit,
        List<SqlColumn> columns,
        List<Map<String, Object>> rows,
        int rowCount
) {

    public SqlQueryResponse {
        columns = List.copyOf(columns);
        rows = List.copyOf(rows);
    }
}
