package com.fdc3.chatbot.config;

import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AgentUtilsConfigTest {

    @Mock
    private ChatModel chatModel;

    @Test
    void webFetchToolHasCorrectName() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        AgentUtilsConfig config = new AgentUtilsConfig();

        ToolCallback callback = config.webFetchToolCallback(chatModel, properties);

        assertNotNull(callback);
        assertEquals("WebFetch", callback.getToolDefinition().name());
    }

    @Test
    void skillsToolHasCorrectName() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getSkills().setLocation("classpath:skills/");
        AgentUtilsConfig config = new AgentUtilsConfig();

        ToolCallback callback = config.skillsToolCallback(properties);

        assertNotNull(callback);
        assertEquals("Skill", callback.getToolDefinition().name());
    }

    @Test
    void pendingQuestionRegistryIsCreated() {
        AgentUtilsConfig config = new AgentUtilsConfig();
        assertNotNull(config.pendingQuestionRegistry());
    }
}
