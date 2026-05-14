package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsConfig;
import com.fdc3.chatbot.config.AgentUtilsProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SmartWebFetchCallbackTest {

    @Mock
    private ChatModel chatModel;

    @Test
    void buildSmartWebFetchToolReturnsWebFetchCallback() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getWebFetch().setMaxContentLength(10000);

        ToolCallback callback = new AgentUtilsConfig().webFetchToolCallback(chatModel, properties);

        assertEquals("WebFetch", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void smartWebFetchToolWithCustomUserAgent() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getWebFetch().setMaxContentLength(5000);

        ToolCallback callback = new AgentUtilsConfig().webFetchToolCallback(chatModel, properties);

        assertEquals("WebFetch", callback.getToolDefinition().name());
    }

    @Test
    void smartWebFetchToolWithDomainSafetyCheck() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getWebFetch().setDomainSafetyCheck(true);

        ToolCallback callback = new AgentUtilsConfig().webFetchToolCallback(chatModel, properties);

        assertEquals("WebFetch", callback.getToolDefinition().name());
    }
}
