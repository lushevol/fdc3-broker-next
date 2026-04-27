package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;
import java.util.List;

public record FunctionUsageRankingResponse(
        String application,
        Instant startTime,
        Instant endTime,
        int limit,
        List<FunctionUsageCount> functions
) {
    public FunctionUsageRankingResponse {
        functions = List.copyOf(functions);
    }
}
