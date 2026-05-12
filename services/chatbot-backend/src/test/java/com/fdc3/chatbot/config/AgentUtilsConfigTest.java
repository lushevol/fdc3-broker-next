package com.fdc3.chatbot.config;

import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
        // Enable web-fetch
        properties.getWebFetch().setEnabled(true);
        properties.getWebFetch().setMaxContentLength(10000);

        ToolCallback callback = config.webFetchToolCallback(chatModel, properties);
        assertNotNull(callback);
        assertEquals("WebFetch", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void skillsToolCallbackReturnsToolCallbackWithCorrectName() {
        properties.getSkills().setEnabled(true);
        properties.getSkills().setLocation("classpath:skills");

        ToolCallback callback = config.skillsToolCallback(properties);
        assertNotNull(callback);
        assertEquals("Skill", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }
}
