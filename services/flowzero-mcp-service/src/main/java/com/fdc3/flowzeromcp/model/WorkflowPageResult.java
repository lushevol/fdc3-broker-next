package com.fdc3.flowzeromcp.model;

import java.util.List;

public record WorkflowPageResult(List<WorkflowSummary> records, long total, int page, int size) {
    public WorkflowPageResult {
        records = records == null ? List.of() : List.copyOf(records);
    }
}
