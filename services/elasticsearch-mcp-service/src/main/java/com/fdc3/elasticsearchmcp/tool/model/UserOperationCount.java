package com.fdc3.elasticsearchmcp.tool.model;

public record UserOperationCount(
        String userId,
        long count
) {
}
