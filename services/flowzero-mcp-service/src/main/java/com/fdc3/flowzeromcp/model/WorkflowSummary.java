package com.fdc3.flowzeromcp.model;

import java.util.List;

public record WorkflowSummary(
    String id,
    String name,
    String status,
    int displayVersion,
    String description,
    String businessArea,
    List<String> countryCodes,
    List<String> ownerIds
) {
    public WorkflowSummary {
        countryCodes = countryCodes == null ? List.of() : List.copyOf(countryCodes);
        ownerIds = ownerIds == null ? List.of() : List.copyOf(ownerIds);
    }
}
