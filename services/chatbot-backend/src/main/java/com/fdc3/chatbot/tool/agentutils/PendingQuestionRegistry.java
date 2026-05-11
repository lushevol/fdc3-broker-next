package com.fdc3.chatbot.tool.agentutils;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Registry for pending user questions. Each question is keyed by conversationId:questionId.
 * Thread-safe and timeout-enabled.
 */
public class PendingQuestionRegistry {

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
     */
    public CompletableFuture<Map<String, String>> register(String conversationId, String questionId) {
        String key = key(conversationId, questionId);
        CompletableFuture<Map<String, String>> future = new CompletableFuture<>();
        future.orTimeout(timeoutMillis, TimeUnit.MILLISECONDS);
        pending.put(key, future);
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
            future.cancel(false);
        }
    }

    private static String key(String conversationId, String questionId) {
        return conversationId + ":" + questionId;
    }
}
