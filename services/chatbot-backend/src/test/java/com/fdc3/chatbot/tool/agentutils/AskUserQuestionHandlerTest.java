package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsConfig;
import org.junit.jupiter.api.Test;
import org.springaicommunity.agent.tools.AskUserQuestionTool;
import org.springframework.ai.tool.ToolCallback;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.junit.jupiter.api.Assertions.*;

class AskUserQuestionHandlerTest {

    @Test
    void handlerReceivesQuestionsAndReturnsAnswers() {
        List<String> capturedQuestions = new CopyOnWriteArrayList<>();

        PendingQuestionRegistry registry = new PendingQuestionRegistry() {
            @Override
            public Map<String, String> handle(List<AskUserQuestionTool.Question> questions) {
                questions.forEach(question -> capturedQuestions.add(question.question()));
                return Map.of(questions.get(0).question(), "Fast");
            }
        };

        ToolCallback callback = new AgentUtilsConfig().askUserQuestionToolCallback(registry);
        callback.call("""
                {
                  "questions": [{
                    "question": "Which mode?",
                    "header": "Mode",
                    "options": [
                      {"label": "Fast", "description": "Run quickly"},
                      {"label": "Careful", "description": "Run carefully"}
                    ]
                  }],
                  "answers": {
                    "Which mode?": "Fast"
                  }
                }
                """);

        assertEquals(List.of("Which mode?"), capturedQuestions);
        assertNotNull(callback.getToolDefinition());
        assertEquals("AskUserQuestionTool", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void handlerReturnsDefaultAnswers() {
        ToolCallback callback = new AgentUtilsConfig().askUserQuestionToolCallback(new PendingQuestionRegistry());

        assertNotNull(callback);
        assertTrue(callback.getToolDefinition().inputSchema().contains("\"questions\""));
    }

    @Test
    void handlerWithMultipleOptions() {
        ToolCallback callback = new AgentUtilsConfig().askUserQuestionToolCallback(new PendingQuestionRegistry());

        assertEquals("AskUserQuestionTool", callback.getToolDefinition().name());
        assertTrue(callback.getToolDefinition().inputSchema().contains("\"options\""));
    }
}
