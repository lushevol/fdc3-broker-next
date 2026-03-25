package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.stubbing.Answer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;
import java.util.function.Consumer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

class ChatControllerTest {

    private ChatService chatService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        chatService = mock(ChatService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new ChatController(chatService)).build();
    }

    @Test
    void streamChatEmitsCanonicalSseEventSequence() throws Exception {
        when(chatService.createConversation()).thenReturn("conversation-123");

        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("calculator")
                .arguments(Map.of("expression", "2 + 2"))
                .status(ToolCall.ToolStatus.RUNNING)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .result(Map.of("result", 4))
                .build();
        GenerativeUIDirective generativeUiDirective = GenerativeUIDirective.builder()
                .name("Card")
                .toolCallId("tool-1")
                .props(Map.of("title", "Calculation Complete"))
                .build();

        doAnswer((Answer<Void>) invocation -> {
            Consumer<String> onNext = invocation.getArgument(3);
            Runnable onComplete = invocation.getArgument(5);
            Consumer<ToolCall> onToolCall = invocation.getArgument(6);
            Consumer<ToolResult> onToolResult = invocation.getArgument(7);
            Consumer<GenerativeUIDirective> onGenerativeUi = invocation.getArgument(8);

            onToolCall.accept(toolCall);
            onNext.accept("Hello");
            onToolResult.accept(toolResult);
            onGenerativeUi.accept(generativeUiDirective);
            onComplete.run();
            return null;
        }).when(chatService).processMessageStreaming(
                anyString(),
                anyString(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any()
        );

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        String body = result.getResponse().getContentAsString();

        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:conversation_id"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("data:conversation-123"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:tool_call"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:message"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("data:Hello"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:tool_result"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:generative_ui"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("\"toolCallId\":\"tool-1\""));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:done"));
    }
}
