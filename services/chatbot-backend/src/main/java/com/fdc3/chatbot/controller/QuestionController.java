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
     * Answer the first pending question batch. Works with the new
     * {@link PendingQuestionRegistry#handle(java.util.List)} code path
     * used by AskUserQuestionTool (which keys by random UUID).
     */
    @PostMapping("/api/chat/question/answer")
    public ResponseEntity<Void> submitAnswer(@RequestBody Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        boolean completed = pendingQuestionRegistry.complete(answers);
        if (!completed) {
            log.warn("No pending question batch to complete");
            return ResponseEntity.notFound().build();
        }

        log.info("User answered a pending question batch");
        return ResponseEntity.ok().build();
    }
}
