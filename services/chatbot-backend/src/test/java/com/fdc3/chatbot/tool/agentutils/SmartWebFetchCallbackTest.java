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
    void createsToolCallbackFromSmartWebFetchTool() {
        ChatClient chatClient = ChatClient.builder(chatModel).build();
        SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                .maxContentLength(10000)
                .domainSafetyCheck(false)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertNotNull(callbacks);
        assertEquals(1, callbacks.length);
        assertEquals("WebFetch", callbacks[0].getToolDefinition().name());
        assertNotNull(callbacks[0].getToolDefinition().description());
    }
}
