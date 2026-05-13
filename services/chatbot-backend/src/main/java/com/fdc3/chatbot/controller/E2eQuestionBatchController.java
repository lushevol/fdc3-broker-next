package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat/e2e/question-batches")
@ConditionalOnProperty(name = "chatbot.e2e-support.enabled", havingValue = "true")
public class E2eQuestionBatchController {

    private final PendingQuestionRegistry pendingQuestionRegistry;
    private final ConcurrentMap<String, CompletableFuture<Map<String, String>>> batches = new ConcurrentHashMap<>();

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @PostMapping("/{batchId}")
    public ResponseEntity<Void> createBatch(@PathVariable String batchId) {
        if (batchId == null || batchId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        CompletableFuture<Map<String, String>> future = CompletableFuture.supplyAsync(() -> {
            pendingQuestionRegistry.bindCurrentBatchId(batchId);
            try {
                return pendingQuestionRegistry.handle(List.of());
            } finally {
                pendingQuestionRegistry.clearCurrentBatchId();
            }
        });

        CompletableFuture<Map<String, String>> existing = batches.putIfAbsent(batchId, future);
        if (existing != null) {
            return ResponseEntity.status(409).build();
        }

        future.whenComplete((answers, error) -> {
            if (error != null || answers.containsKey("_error")) {
                batches.remove(batchId);
            }
        });
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<BatchStatus> getBatch(@PathVariable String batchId) {
        CompletableFuture<Map<String, String>> future = batches.get(batchId);
        if (future == null) {
            return ResponseEntity.notFound().build();
        }
        if (!future.isDone()) {
            return ResponseEntity.ok(new BatchStatus("pending", Map.of()));
        }
        return ResponseEntity.ok(new BatchStatus("answered", future.join()));
    }

    public record BatchStatus(String status, Map<String, String> answers) {}
}
