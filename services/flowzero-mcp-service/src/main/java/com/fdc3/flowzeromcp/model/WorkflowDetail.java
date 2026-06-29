package com.fdc3.flowzeromcp.model;

public record WorkflowDetail(
    String id,
    String name,
    String status,
    int displayVersion,
    String description,
    String content
) {
}
