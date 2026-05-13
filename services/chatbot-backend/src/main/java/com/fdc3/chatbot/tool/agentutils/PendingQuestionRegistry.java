package com.fdc3.chatbot.tool.agentutils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springaicommunity.agent.tools.AskUserQuestionTool.Question;
import org.springaicommunity.agent.tools.AskUserQuestionTool.QuestionHandler;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Registry for pending user questions. Implements {@link QuestionHandler} to
 * bridge {@link org.springaicommunity.agent.tools.AskUserQuestionTool} with the
 * frontend via completion-based answer delivery.
 *
 * <p>Each question batch is keyed by a UUID, stored as a future, and resolved
 * when {@link #complete(String, Map)} is called externally (e.g., from an SSE
 * endpoint). Entries are automatically cleaned up on completion, cancellation,
 * or timeout.
 */
public class PendingQuestionRegistry implements QuestionHandler {

    private static final Logger log = LoggerFactory.getLogger(PendingQuestionRegistry.class);

    private final Map<String, PendingEntry> pending = new ConcurrentHashMap<>();
    private final long timeoutMillis;

    public PendingQuestionRegistry(long timeoutMillis) {
        this.timeoutMillis = timeoutMillis;
    }

    public PendingQuestionRegistry() {
        this(TimeUnit.MINUTES.toMillis(5));
    }

    /**
     * Called by AskUserQuestionTool when the model asks a question.
     * Stores the question batch and blocks until answers are provided via {@link #complete}.
     */
    @Override
    public Map<String, String> handle(List<Question> questions) {
        String batchId = UUID.randomUUID().toString();
        CompletableFuture<Map<String, String>> future = new CompletableFuture<>();
        future.orTimeout(timeoutMillis, TimeUnit.MILLISECONDS);
        future.whenComplete((result, ex) -> pending.remove(batchId));

        PendingEntry entry = new PendingEntry(questions, future);
        pending.put(batchId, entry);

        log.info("Registered question batch {} with {} question(s)", batchId, questions.size());

        try {
            return future.join();
        } catch (Exception e) {
            log.warn("Question batch {} failed or timed out: {}", batchId, e.getMessage());
            return Map.of("_error", "Question timed out or was cancelled");
        }
    }

    /**
     * Complete the most recently registered batch whose blocking {@link #handle( List )}
     * call has not yet returned. This is a best-effort lookup — if multiple batches
     * are pending, completes the one with the first non-cancelled future.
     *
     * @return true if a batch was found and completed
     */
    public boolean complete(Map<String, String> answers) {
        for (var entry : pending.entrySet()) {
            CompletableFuture<Map<String, String>> future = entry.getValue().future();
            if (!future.isDone()) {
                pending.remove(entry.getKey());
                return future.complete(answers);
            }
        }
        return false;
    }

    /**
     * Complete a pending question batch by ID.
     */
    public boolean complete(String batchId, Map<String, String> answers) {
        PendingEntry entry = pending.remove(batchId);
        if (entry != null && !entry.future().isDone()) {
            return entry.future().complete(answers);
        }
        return false;
    }

    /**
     * Register a pending question with the old {@code conversationId:questionId} key scheme.
     * Maintained for backward compatibility with the REST endpoint.
     */
    public CompletableFuture<Map<String, String>> register(String conversationId, String questionId) {
        String key = key(conversationId, questionId);
        CompletableFuture<Map<String, String>> future = new CompletableFuture<>();
        future.orTimeout(timeoutMillis, TimeUnit.MILLISECONDS);
        future.whenComplete((result, ex) -> pending.remove(key));
        PendingEntry entry = new PendingEntry(List.of(), future);
        pending.put(key, entry);
        return future;
    }

    /**
     * Complete a pending question registered via {@link #register(String, String)}.
     * Maintained for backward compatibility with the REST endpoint.
     */
    public boolean complete(String conversationId, String questionId, Map<String, String> answers) {
        return complete(key(conversationId, questionId), answers);
    }

    /**
     * Cancel a pending question registered via {@link #register(String, String)}.
     */
    public void cancel(String conversationId, String questionId) {
        String key = key(conversationId, questionId);
        PendingEntry entry = pending.remove(key);
        if (entry != null && !entry.future().isDone()) {
            log.debug("Cancelling pending question {}/{}", conversationId, questionId);
            entry.future().cancel(false);
        }
    }

    private static String key(String conversationId, String questionId) {
        Objects.requireNonNull(conversationId, "conversationId must not be null");
        Objects.requireNonNull(questionId, "questionId must not be null");
        return conversationId + ":" + questionId;
    }

    /**
     * Cancel all pending question batches.
     */
    public void cancelAll() {
        pending.forEach((key, entry) -> {
            if (!entry.future().isDone()) {
                entry.future().cancel(false);
            }
        });
        pending.clear();
    }

    private record PendingEntry(List<Question> questions, CompletableFuture<Map<String, String>> future) {}
}
