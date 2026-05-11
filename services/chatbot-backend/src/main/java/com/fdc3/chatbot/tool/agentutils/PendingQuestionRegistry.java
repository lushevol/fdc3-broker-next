package com.fdc3.chatbot.tool.agentutils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Registry for pending user questions. Each question is keyed by conversationId:questionId.
 * Thread-safe and timeout-enabled. Entries are automatically cleaned up on
 * completion, cancellation, or timeout.
 */
public class PendingQuestionRegistry {

    private static final Logger log = LoggerFactory.getLogger(PendingQuestionRegistry.class);

    private final Map<String, CompletableFuture<Map<String, String>>> pending = new ConcurrentHashMap<>();
    private final long timeoutMillis;

    public PendingQuestionRegistry(long timeoutMillis) {
        this.timeoutMillis = timeoutMillis;
    }

    public PendingQuestionRegistry() {
        this(TimeUnit.MINUTES.toMillis(5));
    }

    /**
     * Register a pending question and return a future that completes when the user answers.
     * The map entry is automatically removed when the future completes, times out, or is cancelled.
     */
    public CompletableFuture<Map<String, String>> register(String conversationId, String questionId) {
        String key = key(conversationId, questionId);
        CompletableFuture<Map<String, String>> future = new CompletableFuture<>();
        future.orTimeout(timeoutMillis, TimeUnit.MILLISECONDS);
        future.whenComplete((result, ex) -> pending.remove(key));
        CompletableFuture<Map<String, String>> existing = pending.putIfAbsent(key, future);
        if (existing != null) {
            log.warn("Question already registered for key '{}' — returning existing future", key);
            return existing;
        }
        return future;
    }

    /**
     * Complete a pending question with the user's answers.
     * @return true if the question was found and completed, false if it expired or doesn't exist
     */
    public boolean complete(String conversationId, String questionId, Map<String, String> answers) {
        String key = key(conversationId, questionId);
        CompletableFuture<Map<String, String>> future = pending.remove(key);
        if (future != null) {
            return future.complete(answers);
        }
        return false;
    }

    /**
     * Cancel a pending question (e.g., on timeout or conversation close).
     */
    public void cancel(String conversationId, String questionId) {
        String key = key(conversationId, questionId);
        CompletableFuture<Map<String, String>> future = pending.remove(key);
        if (future != null) {
            log.debug("Cancelling pending question {}/{}", conversationId, questionId);
            future.cancel(false);
        }
    }

    private static String key(String conversationId, String questionId) {
        Objects.requireNonNull(conversationId, "conversationId must not be null");
        Objects.requireNonNull(questionId, "questionId must not be null");
        return conversationId + ":" + questionId;
    }
}
