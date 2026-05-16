package com.fdc3.memory.api;

import com.fdc3.memory.domain.MemoryEntry;
import com.fdc3.memory.domain.MemorySource;
import com.fdc3.memory.domain.MemoryStatus;
import com.fdc3.memory.domain.MemoryType;
import com.fdc3.memory.service.JsonFieldMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public final class MemoryDtos {
    private MemoryDtos() {}

    public record CreateMemoryRequest(
            @NotBlank String tenantId,
            @NotBlank String userId,
            String desk,
            @NotNull MemoryType type,
            @NotBlank String title,
            @NotBlank String body,
            List<String> tags,
            MemorySource source,
            BigDecimal confidence,
            String attributesJson
    ) {}

    public record UpdateMemoryRequest(
            @NotBlank String tenantId,
            @NotBlank String userId,
            MemoryType type,
            String title,
            String body,
            List<String> tags,
            String attributesJson
    ) {}

    public record MemoryResponse(
            String id,
            String tenantId,
            String userId,
            String desk,
            MemoryType type,
            String title,
            String body,
            List<String> tags,
            MemorySource source,
            BigDecimal confidence,
            MemoryStatus status,
            int schemaVersion,
            Map<String, Object> attributes,
            Instant createdAt,
            Instant updatedAt,
            Instant lastUsedAt
    ) {
        public static MemoryResponse from(MemoryEntry entry, JsonFieldMapper mapper) {
            return new MemoryResponse(
                    entry.getId(),
                    entry.getTenantId(),
                    entry.getUserId(),
                    entry.getDesk(),
                    entry.getType(),
                    entry.getTitle(),
                    entry.getBody(),
                    mapper.tagsFromJson(entry.getTagsJson()),
                    entry.getSource(),
                    entry.getConfidence(),
                    entry.getStatus(),
                    entry.getSchemaVersion(),
                    mapper.attributesFromJson(entry.getAttributesJson()),
                    entry.getCreatedAt(),
                    entry.getUpdatedAt(),
                    entry.getLastUsedAt()
            );
        }
    }

    public record MemorySearchResponse(List<MemoryResponse> entries) {}

    public record ErrorResponse(String message, Map<String, String> errors) {}
}
