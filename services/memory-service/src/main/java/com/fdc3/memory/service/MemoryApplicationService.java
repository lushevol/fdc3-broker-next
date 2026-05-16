package com.fdc3.memory.service;

import com.fdc3.memory.domain.MemoryEntry;
import com.fdc3.memory.domain.MemorySource;
import com.fdc3.memory.domain.MemoryStatus;
import com.fdc3.memory.domain.MemoryType;
import com.fdc3.memory.repository.MemoryEntryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MemoryApplicationService {
    private final MemoryEntryRepository repository;
    private final JsonFieldMapper jsonFieldMapper;

    public MemoryApplicationService(MemoryEntryRepository repository, JsonFieldMapper jsonFieldMapper) {
        this.repository = repository;
        this.jsonFieldMapper = jsonFieldMapper;
    }

    @Transactional
    public MemoryEntry create(MemoryScope scope, CreateMemoryCommand command) {
        MemoryEntry entry = new MemoryEntry();
        entry.setTenantId(scope.tenantId());
        entry.setUserId(scope.userId());
        entry.setDesk(scope.desk());
        entry.setType(command.type());
        entry.setTitle(requireText(command.title(), "title"));
        entry.setBody(requireText(command.body(), "body"));
        entry.setTagsJson(jsonFieldMapper.tagsToJson(command.tags()));
        entry.setSource(command.source());
        entry.setConfidence(command.confidence());
        entry.setAttributesJson(jsonFieldMapper.attributesToJsonString(command.attributesJson()));
        return repository.save(entry);
    }

    @Transactional(readOnly = true)
    public List<MemoryEntry> search(MemoryScope scope, SearchMemoryQuery query) {
        int limit = query.limit() == null || query.limit() < 1 ? 20 : Math.min(query.limit(), 100);
        MemoryStatus status = query.status() == null ? MemoryStatus.ACTIVE : query.status();
        String q = query.q() == null || query.q().isBlank() ? null : query.q().trim();
        return repository.search(
                scope.tenantId(),
                scope.userId(),
                query.desk(),
                query.type(),
                q,
                status,
                PageRequest.of(0, limit)
        );
    }

    @Transactional(readOnly = true)
    public MemoryEntry get(MemoryScope scope, String id) {
        return findScoped(scope, id);
    }

    @Transactional
    public MemoryEntry update(MemoryScope scope, String id, UpdateMemoryCommand command) {
        MemoryEntry entry = findScoped(scope, id);
        if (command.type() != null) entry.setType(command.type());
        if (command.title() != null) entry.setTitle(requireText(command.title(), "title"));
        if (command.body() != null) entry.setBody(requireText(command.body(), "body"));
        if (command.tags() != null) entry.setTagsJson(jsonFieldMapper.tagsToJson(command.tags()));
        if (command.attributesJson() != null) {
            entry.setAttributesJson(jsonFieldMapper.attributesToJsonString(command.attributesJson()));
        }
        return repository.save(entry);
    }

    @Transactional
    public MemoryEntry archive(MemoryScope scope, String id) {
        MemoryEntry entry = findScoped(scope, id);
        entry.setStatus(MemoryStatus.ARCHIVED);
        return repository.save(entry);
    }

    @Transactional
    public void softDelete(MemoryScope scope, String id) {
        MemoryEntry entry = findScoped(scope, id);
        entry.setStatus(MemoryStatus.DELETED);
        repository.save(entry);
    }

    private MemoryEntry findScoped(MemoryScope scope, String id) {
        return repository.findByIdAndTenantIdAndUserId(id, scope.tenantId(), scope.userId())
                .orElseThrow(() -> new EntityNotFoundException("memory entry not found"));
    }

    private String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
        return value.trim();
    }

    public record CreateMemoryCommand(
            MemoryType type,
            String title,
            String body,
            List<String> tags,
            MemorySource source,
            BigDecimal confidence,
            String attributesJson
    ) {}

    public record SearchMemoryQuery(
            MemoryType type,
            String q,
            String desk,
            MemoryStatus status,
            Integer limit
    ) {}

    public record UpdateMemoryCommand(
            MemoryType type,
            String title,
            String body,
            List<String> tags,
            String attributesJson
    ) {}
}
