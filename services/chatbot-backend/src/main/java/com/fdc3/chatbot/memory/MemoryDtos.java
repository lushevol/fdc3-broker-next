package com.fdc3.chatbot.memory;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public final class MemoryDtos {
    private MemoryDtos() {
    }

    public record MemorySearchRequest(
            String tenantId,
            String userId,
            String type,
            String status,
            String q,
            int limit
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MemoryEntryDto(
            String id,
            String type,
            String title,
            String body,
            List<String> tags,
            String status,
            int schemaVersion
    ) {
    }

    public record MemorySearchResponse(
            List<MemoryEntryDto> entries
    ) {
    }
}
