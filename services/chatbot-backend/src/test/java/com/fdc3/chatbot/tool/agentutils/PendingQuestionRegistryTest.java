package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PendingQuestionRegistryTest {

    @Test
    void handleUsesBoundBatchIdForCompletion() throws Exception {
        PendingQuestionRegistry registry = new PendingQuestionRegistry(TimeUnit.SECONDS.toMillis(5));

        CompletableFuture<Map<String, String>> result = CompletableFuture.supplyAsync(() -> {
            registry.bindCurrentBatchId("batch-1");
            try {
                return registry.handle(List.of());
            } finally {
                registry.clearCurrentBatchId();
            }
        });

        assertTrue(completeEventually(registry, "batch-1", Map.of("choice", "approve")));
        assertEquals(Map.of("choice", "approve"), result.get(1, TimeUnit.SECONDS));
    }

    @Test
    void completeByBatchIdDoesNotResolveAnotherPendingBatch() throws Exception {
        PendingQuestionRegistry registry = new PendingQuestionRegistry(TimeUnit.SECONDS.toMillis(5));

        CompletableFuture<Map<String, String>> first = pendingHandle(registry, "batch-1");
        CompletableFuture<Map<String, String>> second = pendingHandle(registry, "batch-2");

        assertTrue(completeEventually(registry, "batch-2", Map.of("choice", "second")));

        assertEquals(Map.of("choice", "second"), second.get(1, TimeUnit.SECONDS));
        assertFalse(first.isDone());

        assertTrue(registry.complete("batch-1", Map.of("choice", "first")));
        assertEquals(Map.of("choice", "first"), first.get(1, TimeUnit.SECONDS));
    }

    private static CompletableFuture<Map<String, String>> pendingHandle(
            PendingQuestionRegistry registry,
            String batchId
    ) {
        return CompletableFuture.supplyAsync(() -> {
            registry.bindCurrentBatchId(batchId);
            try {
                return registry.handle(List.of());
            } finally {
                registry.clearCurrentBatchId();
            }
        });
    }

    private static boolean completeEventually(
            PendingQuestionRegistry registry,
            String batchId,
            Map<String, String> answers
    ) throws InterruptedException {
        for (int attempts = 0; attempts < 20; attempts++) {
            if (registry.complete(batchId, answers)) {
                return true;
            }
            TimeUnit.MILLISECONDS.sleep(25);
        }
        return false;
    }
}
