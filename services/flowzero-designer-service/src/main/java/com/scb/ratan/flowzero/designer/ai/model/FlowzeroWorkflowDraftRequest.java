package com.scb.ratan.flowzero.designer.ai.model;

import java.util.List;

public record FlowzeroWorkflowDraftRequest(
    String prompt,
    String workflowName,
    String description,
    String businessArea,
    List<String> countryCodes,
    List<String> ownerIds
) {
    public FlowzeroWorkflowDraftRequest {
        countryCodes = countryCodes == null ? List.of() : List.copyOf(countryCodes);
        ownerIds = ownerIds == null ? List.of() : List.copyOf(ownerIds);
    }
}
