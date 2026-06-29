package com.fdc3.flowzeromcp.controller;

import java.util.List;

public record FlowzeroWorkflowPageResponse<T>(
    int page,
    int size,
    long totalElements,
    long totalPages,
    List<T> data
) {
    public FlowzeroWorkflowPageResponse {
        data = data == null ? List.of() : List.copyOf(data);
    }
}
