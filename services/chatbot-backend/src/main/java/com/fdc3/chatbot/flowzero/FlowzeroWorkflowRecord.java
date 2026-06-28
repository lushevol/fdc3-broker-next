package com.fdc3.chatbot.flowzero;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record FlowzeroWorkflowRecord(
        String workflowId,
        String workflowName,
        String description,
        String businessArea,
        List<String> countryCodes,
        List<String> ownerIds,
        List<Map<String, Object>> nodes,
        List<Map<String, Object>> edges,
        String bpmnXml,
        String summary,
        List<String> warnings,
        Instant createdAt
) {
    public FlowzeroWorkflowRecord {
        countryCodes = countryCodes == null ? List.of() : List.copyOf(countryCodes);
        ownerIds = ownerIds == null ? List.of() : List.copyOf(ownerIds);
        nodes = nodes == null ? List.of() : List.copyOf(nodes);
        edges = edges == null ? List.of() : List.copyOf(edges);
        warnings = warnings == null ? List.of() : List.copyOf(warnings);
    }
}
