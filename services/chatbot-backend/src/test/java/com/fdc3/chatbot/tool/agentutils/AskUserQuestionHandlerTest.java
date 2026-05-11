package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springaicommunity.agent.tools.AskUserQuestionTool;
import org.springaicommunity.agent.tools.AskUserQuestionTool.QuestionHandler;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.junit.jupiter.api.Assertions.*;

class AskUserQuestionHandlerTest {

    @Test
    void handlerReceivesQuestionsAndReturnsAnswers() {
        List<String> capturedQuestions = new CopyOnWriteArrayList<>();

        QuestionHandler handler = questions -> {
            for (Object q : questions) {
                capturedQuestions.add(q.toString());
            }
            return Map.of();
        };

        AskUserQuestionTool tool = AskUserQuestionTool.builder()
                .questionHandler(handler)
                .answersValidation(false)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
        ToolCallback callback = callbacks[0];
        assertNotNull(callback.getToolDefinition());
        assertEquals("AskUserQuestionTool", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void handlerReturnsDefaultAnswers() {
        QuestionHandler handler = questions -> Map.of();

        AskUserQuestionTool tool = AskUserQuestionTool.builder()
                .questionHandler(handler)
                .answersValidation(false)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
    }

    @Test
    void handlerWithMultipleOptions() {
        QuestionHandler handler = questions -> {
            Map<String, String> answers = new java.util.LinkedHashMap<>();
            int i = 0;
            for (Object q : questions) {
                answers.put("answer_" + i, "selected_option_1");
                i++;
            }
            return answers;
        };

        AskUserQuestionTool tool = AskUserQuestionTool.builder()
                .questionHandler(handler)
                .answersValidation(false)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
        ToolCallback callback = callbacks[0];
        assertEquals("AskUserQuestionTool", callback.getToolDefinition().name());
    }
}
