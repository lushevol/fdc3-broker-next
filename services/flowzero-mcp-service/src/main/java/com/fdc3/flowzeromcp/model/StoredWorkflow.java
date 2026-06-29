package com.fdc3.flowzeromcp.model;

import java.util.List;

public record StoredWorkflow(
    String id,
    String name,
    String status,
    int displayVersion,
    String businessArea,
    List<String> countryCodes,
    List<String> ownerIds,
    String description,
    String summary,
    List<String> steps,
    String content,
    String requestedBy
) {
    public StoredWorkflow {
        countryCodes = countryCodes == null ? List.of() : List.copyOf(countryCodes);
        ownerIds = ownerIds == null ? List.of() : List.copyOf(ownerIds);
        steps = steps == null ? List.of() : List.copyOf(steps);
    }
}
