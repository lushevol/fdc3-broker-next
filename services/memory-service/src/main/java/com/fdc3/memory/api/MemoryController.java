package com.fdc3.memory.api;

import com.fdc3.memory.domain.MemoryStatus;
import com.fdc3.memory.domain.MemoryType;
import com.fdc3.memory.service.JsonFieldMapper;
import com.fdc3.memory.service.MemoryApplicationService;
import com.fdc3.memory.service.MemoryScope;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/memory/entries")
public class MemoryController {
    private final MemoryApplicationService memoryService;
    private final JsonFieldMapper jsonFieldMapper;

    public MemoryController(MemoryApplicationService memoryService, JsonFieldMapper jsonFieldMapper) {
        this.memoryService = memoryService;
        this.jsonFieldMapper = jsonFieldMapper;
    }

    @PostMapping
    ResponseEntity<MemoryDtos.MemoryResponse> create(@Valid @RequestBody MemoryDtos.CreateMemoryRequest request) {
        var created = memoryService.create(
                new MemoryScope(request.tenantId(), request.userId(), request.desk()),
                new MemoryApplicationService.CreateMemoryCommand(
                        request.type(),
                        request.title(),
                        request.body(),
                        request.tags(),
                        request.source(),
                        request.confidence(),
                        request.attributesJson()
                )
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(MemoryDtos.MemoryResponse.from(created, jsonFieldMapper));
    }

    @GetMapping
    MemoryDtos.MemorySearchResponse search(
            @RequestParam String tenantId,
            @RequestParam String userId,
            @RequestParam(required = false) String desk,
            @RequestParam(required = false) MemoryType type,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "ACTIVE") MemoryStatus status,
            @RequestParam(defaultValue = "20") int limit
    ) {
        List<MemoryDtos.MemoryResponse> entries = memoryService.search(
                        new MemoryScope(tenantId, userId, desk),
                        new MemoryApplicationService.SearchMemoryQuery(type, q, desk, status, limit)
                )
                .stream()
                .map(entry -> MemoryDtos.MemoryResponse.from(entry, jsonFieldMapper))
                .toList();
        return new MemoryDtos.MemorySearchResponse(entries);
    }

    @GetMapping("/{id}")
    MemoryDtos.MemoryResponse get(
            @PathVariable String id,
            @RequestParam String tenantId,
            @RequestParam String userId,
            @RequestParam(required = false) String desk
    ) {
        return MemoryDtos.MemoryResponse.from(
                memoryService.get(new MemoryScope(tenantId, userId, desk), id),
                jsonFieldMapper
        );
    }

    @PatchMapping("/{id}")
    MemoryDtos.MemoryResponse update(
            @PathVariable String id,
            @Valid @RequestBody MemoryDtos.UpdateMemoryRequest request
    ) {
        var updated = memoryService.update(
                new MemoryScope(request.tenantId(), request.userId(), null),
                id,
                new MemoryApplicationService.UpdateMemoryCommand(
                        request.type(),
                        request.title(),
                        request.body(),
                        request.tags(),
                        request.attributesJson()
                )
        );
        return MemoryDtos.MemoryResponse.from(updated, jsonFieldMapper);
    }

    @PostMapping("/{id}/archive")
    MemoryDtos.MemoryResponse archive(
            @PathVariable String id,
            @RequestParam String tenantId,
            @RequestParam String userId,
            @RequestParam(required = false) String desk
    ) {
        return MemoryDtos.MemoryResponse.from(
                memoryService.archive(new MemoryScope(tenantId, userId, desk), id),
                jsonFieldMapper
        );
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(
            @PathVariable String id,
            @RequestParam String tenantId,
            @RequestParam String userId,
            @RequestParam(required = false) String desk
    ) {
        memoryService.softDelete(new MemoryScope(tenantId, userId, desk), id);
        return ResponseEntity.noContent().build();
    }
}
