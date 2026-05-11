package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chat/{conversationId}/question")
@RequiredArgsConstructor
public class QuestionController {

    private final PendingQuestionRegistry pendingQuestionRegistry;

    @PostMapping("/{questionId}/answer")
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
}
