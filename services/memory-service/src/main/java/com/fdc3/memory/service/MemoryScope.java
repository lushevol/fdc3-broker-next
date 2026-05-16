package com.fdc3.memory.service;

public record MemoryScope(String tenantId, String userId, String desk) {
    public MemoryScope {
        if (tenantId == null || tenantId.isBlank()) {
            throw new IllegalArgumentException("tenantId is required");
        }
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId is required");
        }
    }
}
