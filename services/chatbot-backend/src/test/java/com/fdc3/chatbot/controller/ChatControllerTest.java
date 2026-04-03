package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.security.UserCapabilityContextResolver;
import com.fdc3.chatbot.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.stubbing.Answer;
import org.springframework.http.MediaType;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ChatControllerTest {

    private ChatService chatService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        chatService = mock(ChatService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new ChatController(chatService, new UserCapabilityContextResolver())).build();
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
            Consumer<String> onNext = invocation.getArgument(5);
            Runnable onComplete = invocation.getArgument(7);
            Consumer<ToolCall> onToolCall = invocation.getArgument(8);
            Consumer<ToolResult> onToolResult = invocation.getArgument(9);
            Consumer<GenerativeUIDirective> onGenerativeUi = invocation.getArgument(10);

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
                any(),
                any(),
                any()
        );

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:conversation_id"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("data:conversation-123"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:tool_call"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:message"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("data:{\"text\":\"Hello\"}"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:tool_result"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:generative_ui"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("\"toolCallId\":\"tool-1\""));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:done"));
    }

    @Test
    void postStreamAcceptsJsonAndReturnsTextEventStream() throws Exception {
        when(chatService.createConversation()).thenReturn("conversation-123");

        doAnswer((Answer<Void>) invocation -> {
            Consumer<String> onNext = invocation.getArgument(5);
            Runnable onComplete = invocation.getArgument(7);

            onNext.accept("Hello");
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
                any(),
                any(),
                any()
        );

        mockMvc.perform(post("/api/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Hi\"}"))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM));
    }

    @Test
    void streamChatForwardsFrontendToolManifest() throws Exception {
        when(chatService.createConversation()).thenReturn("conversation-123");

        doAnswer((Answer<Void>) invocation -> {
            Runnable onComplete = invocation.getArgument(7);
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
                any(),
                any(),
                any()
        );

        MvcResult result = mockMvc.perform(get("/api/chat/stream")
                        .param("message", "Hi")
                        .param("frontendTools", "[{\"name\":\"custom_client_tool\"}]"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();

        org.mockito.Mockito.verify(chatService).processMessageStreaming(
                anyString(),
                anyString(),
                any(),
                any(),
                org.mockito.ArgumentMatchers.eq("[{\"name\":\"custom_client_tool\"}]"),
                any(),
                any(),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    void streamChatEmitsStructuredMessageChunks() throws Exception {
        when(chatService.createConversation()).thenReturn("conversation-123");

        doAnswer((Answer<Void>) invocation -> {
            Consumer<String> onNext = invocation.getArgument(5);
            Runnable onComplete = invocation.getArgument(7);

            onNext.accept("Hello");
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
                any(),
                any(),
                any()
        );

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        org.junit.jupiter.api.Assertions.assertTrue(body.contains("event:message"));
        org.junit.jupiter.api.Assertions.assertTrue(body.contains("data:{\"text\":\"Hello\"}"));
    }

    @Test
    void streamChatPreservesLeadingSpacesInMessageChunks() throws Exception {
        when(chatService.createConversation()).thenReturn("conversation-123");

        doAnswer((Answer<Void>) invocation -> {
            Consumer<String> onNext = invocation.getArgument(5);
            Runnable onComplete = invocation.getArgument(7);

            onNext.accept(" from");
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
                any(),
                any(),
                any()
        );

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        org.junit.jupiter.api.Assertions.assertTrue(body.contains("data:{\"text\":\" from\"}"));
    }
}
