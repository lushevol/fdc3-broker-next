package com.scb.ratan.flowzero.designer.ai.model;

import java.util.List;
import java.util.Map;

public record FlowzeroWorkflowDraftResponse(
    String workflowName,
    String description,
    String businessArea,
    List<String> countryCodes,
    List<String> ownerIds,
    List<WorkflowNode> nodes,
    List<WorkflowEdge> edges,
    String bpmnXml,
    String summary,
    List<String> warnings
) {
    public FlowzeroWorkflowDraftResponse {
        countryCodes = countryCodes == null ? List.of() : List.copyOf(countryCodes);
        ownerIds = ownerIds == null ? List.of() : List.copyOf(ownerIds);
        nodes = nodes == null ? List.of() : List.copyOf(nodes);
        edges = edges == null ? List.of() : List.copyOf(edges);
        warnings = warnings == null ? List.of() : List.copyOf(warnings);
    }

    public record WorkflowNode(
        String id,
        String type,
        String label,
        Position position,
        Map<String, Object> data
    ) {
        public WorkflowNode {
            data = data == null ? Map.of() : Map.copyOf(data);
        }
    }

    public record WorkflowEdge(
        String id,
        String source,
        String target,
        String sourceHandle,
        String targetHandle,
        Map<String, Object> data
    ) {
        public WorkflowEdge {
            data = data == null ? Map.of() : Map.copyOf(data);
        }
    }

    public record Position(int x, int y) {
    }
}
