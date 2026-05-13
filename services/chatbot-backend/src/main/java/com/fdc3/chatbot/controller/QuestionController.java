package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class QuestionController {

    private final PendingQuestionRegistry pendingQuestionRegistry;

    /**
     * Legacy endpoint: answer a question by conversation/ question IDs.
     * Keyed by the old {@code conversationId:questionId} composite key scheme
     * used by {@link PendingQuestionRegistry#register(String, String)}.
     */
    @PostMapping("/api/chat/{conversationId}/question/{questionId}/answer")
    public ResponseEntity<Void> submitAnswer(
            @PathVariable String conversationId,
            @PathVariable String questionId,
            @RequestBody Map<String, Map<String, String>> body
    ) {
        Map<String, String> answers = body.get("answers");
        if (answers == null || answers.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        boolean completed = pendingQuestionRegistry.complete(conversationId, questionId, answers);
        if (!completed) {
            log.warn("No pending question found for {}/{}", conversationId, questionId);
            return ResponseEntity.notFound().build();
        }

        log.info("User answered question {}/{}", conversationId, questionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Answer a pending AskUserQuestionTool batch by the stable batch ID emitted
     * to the frontend in the user_question frame.
     */
    @PostMapping("/api/chat/question/answer")
    public ResponseEntity<Void> submitAnswer(@RequestBody BatchAnswerRequest request) {
        if (request == null || request.batchId() == null || request.batchId().isBlank()
                || request.answers() == null || request.answers().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        boolean completed = pendingQuestionRegistry.complete(request.batchId(), request.answers());
        if (!completed) {
            log.warn("No pending question batch found for {}", request.batchId());
            return ResponseEntity.notFound().build();
        }

        log.info("User answered question batch {}", request.batchId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/chat/question/{batchId}/answer")
    public ResponseEntity<Void> submitBatchAnswer(
            @PathVariable String batchId,
            @RequestBody Map<String, Map<String, String>> body
    ) {
        Map<String, String> answers = body == null ? null : body.get("answers");
        return submitAnswer(new BatchAnswerRequest(batchId, answers));
    }

    public record BatchAnswerRequest(String batchId, Map<String, String> answers) {}
}
