package com.fdc3.elasticsearchmcp.tool.model;

import java.time.Instant;
import java.util.List;

public record UserOperationRankingResponse(
        String application,
        Instant startTime,
        Instant endTime,
        int limit,
        List<UserOperationCount> users
) {
    public UserOperationRankingResponse {
        users = List.copyOf(users);
    }
}
