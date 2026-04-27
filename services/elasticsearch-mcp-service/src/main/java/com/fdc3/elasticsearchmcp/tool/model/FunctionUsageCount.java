package com.fdc3.elasticsearchmcp.tool.model;

public record FunctionUsageCount(
        String functionPath,
        long count
) {
}
