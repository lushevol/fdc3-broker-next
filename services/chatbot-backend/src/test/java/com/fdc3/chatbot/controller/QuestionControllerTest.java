package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class QuestionControllerTest {

    @Test
    void submitAnswerRequiresBatchId() {
        QuestionController controller = new QuestionController(new PendingQuestionRegistry());

        ResponseEntity<Void> response = controller.submitAnswer(
                new QuestionController.BatchAnswerRequest("", Map.of("answer", "yes"))
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void submitAnswerCompletesMatchingBatch() {
        PendingQuestionRegistry registry = new PendingQuestionRegistry();
        registry.register("conversation-1", "question-1");
        QuestionController controller = new QuestionController(registry);

        ResponseEntity<Void> response = controller.submitAnswer(
                new QuestionController.BatchAnswerRequest(
                        "conversation-1:question-1",
                        Map.of("answer", "yes")
                )
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void submitBatchAnswerUsesPathBatchId() {
        PendingQuestionRegistry registry = new PendingQuestionRegistry();
        registry.register("conversation-1", "question-1");
        QuestionController controller = new QuestionController(registry);

        ResponseEntity<Void> response = controller.submitBatchAnswer(
                "conversation-1:question-1",
                Map.of("answers", Map.of("answer", "yes"))
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
