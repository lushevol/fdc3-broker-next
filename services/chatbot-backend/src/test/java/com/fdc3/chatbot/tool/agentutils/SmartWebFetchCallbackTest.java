package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springaicommunity.agent.tools.SmartWebFetchTool;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SmartWebFetchCallbackTest {

    @Mock
    private ChatModel chatModel;

    @Test
    void buildSmartWebFetchToolReturnsWebFetchCallback() {
        ChatClient chatClient = ChatClient.builder(chatModel).build();
        SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                .domainSafetyCheck(true)
                .maxContentLength(10000)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
        ToolCallback callback = callbacks[0];
        assertEquals("WebFetch", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void smartWebFetchToolWithCustomUserAgent() {
        ChatClient chatClient = ChatClient.builder(chatModel).build();
        SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                .domainSafetyCheck(true)
                .maxContentLength(5000)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
        assertEquals("WebFetch", callbacks[0].getToolDefinition().name());
    }

    @Test
    void smartWebFetchToolWithDomainSafetyCheck() {
        ChatClient chatClient = ChatClient.builder(chatModel).build();
        SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                .domainSafetyCheck(true)
                .maxContentLength(10000)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
        assertEquals("WebFetch", callbacks[0].getToolDefinition().name());
    }
}
