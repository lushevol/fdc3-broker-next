package com.fdc3.chatbot.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import org.springaicommunity.agent.tools.AskUserQuestionTool.Question;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
class AgentUtilsConfigTest {

    @Mock
    private ChatModel chatModel;

    private AgentUtilsConfig config;
    private AgentUtilsProperties properties;

    @BeforeEach
    void setUp() {
        config = new AgentUtilsConfig();
        properties = new AgentUtilsProperties();
    }

    @Test
    void pendingQuestionRegistryIsCreated() {
        PendingQuestionRegistry registry = config.pendingQuestionRegistry();
        assertNotNull(registry);
    }

    @Test
    void webFetchToolCallbackReturnsToolCallbackWithCorrectName() {
        properties.getWebFetch().setMaxContentLength(10000);

        ToolCallback callback = config.webFetchToolCallback(chatModel, properties);
        assertNotNull(callback);
        assertEquals("WebFetch", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void webSearchToolCallbackReturnsToolCallbackWithCorrectName() {
        ToolCallback callback = config.webSearchToolCallback(properties, "test-brave-key");
        assertNotNull(callback);
        assertEquals("WebSearch", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void webSearchToolCallbackThrowsWhenApiKeyMissing() {
        assertThrows(IllegalArgumentException.class,
                () -> config.webSearchToolCallback(properties, ""));
    }

    @Test
    void askUserQuestionToolCallbackReturnsToolCallbackWithCorrectName() {
        PendingQuestionRegistry registry = config.pendingQuestionRegistry();
        ToolCallback callback = config.askUserQuestionToolCallback(registry);
        assertNotNull(callback);
        assertEquals("AskUserQuestionTool", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void askUserQuestionToolCallbackUsesExplicitFunctionSchema() {
        PendingQuestionRegistry registry = config.pendingQuestionRegistry();
        ToolCallback callback = config.askUserQuestionToolCallback(registry);

        assertTrue(callback.getClass().getName().contains("FunctionToolCallback"));
        assertTrue(callback.getToolDefinition().inputSchema().contains("\"questions\""));
        assertTrue(callback.getToolDefinition().inputSchema().contains("\"answers\""));
    }

    @Test
    void askUserQuestionToolCallbackInvokesQuestionHandler() {
        PendingQuestionRegistry registry = new PendingQuestionRegistry() {
            @Override
            public Map<String, String> handle(List<Question> questions) {
                assertEquals(1, questions.size());
                assertEquals("Which mode?", questions.get(0).question());
                return Map.of("Which mode?", "Fast");
            }
        };
        ToolCallback callback = config.askUserQuestionToolCallback(registry);

        String result = callback.call("""
                {
                  "questions": [{
                    "question": "Which mode?",
                    "header": "Mode",
                    "options": [
                      {"label": "Fast", "description": "Run quickly"},
                      {"label": "Careful", "description": "Run more checks"}
                    ]
                  }],
                  "answers": {}
                }
                """);

        assertTrue(result.contains("Fast"));
    }

    @Test
    void skillsToolCallbackReturnsToolCallbackWithCorrectName() {
        properties.getSkills().setLocation("classpath:skills");

        ToolCallback callback = config.skillsToolCallback();
        assertNotNull(callback);
        assertEquals("Skill", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void skillsToolLoadsPdfSkillWithFilesystemBaseDirectory() throws JsonProcessingException {
        ToolCallback callback = config.skillsToolCallback();

        String result = new ObjectMapper().readValue(callback.call("{\"command\":\"pdf\"}"), String.class);

        assertTrue(result.contains("Base directory for this skill:"));
        assertTrue(result.contains("PDF Processing Guide"));
        assertTrue(result.contains("scripts/"));
        assertTrue(result.contains("reference.md"));

        String firstLine = result.lines().findFirst().orElseThrow();
        Path baseDirectory = Path.of(firstLine.replace("Base directory for this skill:", "").trim());
        assertTrue(Files.isDirectory(baseDirectory), () -> "Expected directory: " + baseDirectory + "\n" + result);
        assertTrue(Files.exists(baseDirectory.resolve("scripts")));
        assertTrue(Files.exists(baseDirectory.resolve("reference.md")));
    }
}
