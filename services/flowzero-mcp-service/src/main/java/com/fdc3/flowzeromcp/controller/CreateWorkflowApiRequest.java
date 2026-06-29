package com.fdc3.flowzeromcp.controller;

import java.util.List;

public record CreateWorkflowApiRequest(
    String prompt,
    String workflowName,
    List<String> steps,
    String businessArea,
    List<String> countryCodes,
    List<String> ownerIds,
    String requestedBy
) {
    public CreateWorkflowApiRequest {
        steps = steps == null ? List.of() : List.copyOf(steps);
        countryCodes = countryCodes == null ? List.of() : List.copyOf(countryCodes);
        ownerIds = ownerIds == null ? List.of() : List.copyOf(ownerIds);
    }
}
