package com.fdc3.chatbot.service;

import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.tool.ToolRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class ChatServiceTest {

    private AgentService agentService;
    private ChatService chatService;

    @BeforeEach
    void setUp() {
        agentService = mock(AgentService.class);
        ToolRegistry toolRegistry = mock(ToolRegistry.class);
        chatService = new ChatService(agentService, toolRegistry);
    }

    @Test
    void processMessageStreamingPersistsAssistantMessageOnCompletion() {
        doAnswer(invocation -> {
            Consumer<String> onNext = invocation.getArgument(3);
            Runnable onComplete = invocation.getArgument(5);

            onNext.accept("Hello ");
            onNext.accept("world");
            onComplete.run();
            return null;
        }).when(agentService).processMessageStreaming(
                anyString(),
                anyString(),
                anyList(),
                any(),
                any(),
                any(),
                any(),
                any()
        );

        String conversationId = chatService.createConversation();

        chatService.processMessageStreaming(
                conversationId,
                "Hi",
                token -> {
                },
                error -> {
                },
                () -> {
                }
        );

        List<ChatMessage> history = chatService.getHistory(conversationId);

        assertEquals(2, history.size());
        assertEquals(ChatMessage.Role.USER, history.get(0).getRole());
        assertEquals("Hi", history.get(0).getContent());
        assertEquals(ChatMessage.Role.ASSISTANT, history.get(1).getRole());
        assertEquals("Hello world", history.get(1).getContent());
        assertNotNull(history.get(1).getId());
        assertNotNull(history.get(1).getTimestamp());
    }

    @Test
    void processMessageStreamingForwardsToolLifecycleEvents() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("calculator")
                .arguments(java.util.Map.of("expression", "2 + 2"))
                .status(ToolCall.ToolStatus.RUNNING)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .result(java.util.Map.of("result", 4))
                .build();

        doAnswer(invocation -> {
            Consumer<ToolCall> onToolCall = invocation.getArgument(6);
            Consumer<ToolResult> onToolResult = invocation.getArgument(7);
            Runnable onComplete = invocation.getArgument(5);

            onToolCall.accept(toolCall);
            onToolResult.accept(toolResult);
            onComplete.run();
            return null;
        }).when(agentService).processMessageStreaming(
                anyString(),
                anyString(),
                anyList(),
                any(),
                any(),
                any(),
                any(),
                any()
        );

        Consumer<ToolCall> onToolCall = mock(Consumer.class);
        Consumer<ToolResult> onToolResult = mock(Consumer.class);
        String conversationId = chatService.createConversation();

        chatService.processMessageStreaming(
                conversationId,
                "calculate 2 + 2",
                token -> {
                },
                error -> {
                },
                () -> {
                },
                onToolCall,
                onToolResult
        );

        verify(onToolCall).accept(toolCall);
        verify(onToolResult).accept(toolResult);
    }

    @Test
    void cancelledStreamDoesNotPersistPartialAssistantMessage() {
        final Runnable[] onCompleteRef = new Runnable[1];
        final Consumer<String>[] onNextRef = new Consumer[1];

        doAnswer((org.mockito.stubbing.Answer<Runnable>) invocation -> {
            onNextRef[0] = invocation.getArgument(3);
            onCompleteRef[0] = invocation.getArgument(5);
            return () -> {
            };
        }).when(agentService).processMessageStreaming(
                anyString(),
                anyString(),
                anyList(),
                any(),
                any(),
                any(),
                any(),
                any()
        );

        String conversationId = chatService.createConversation();

        Runnable cancelStream = chatService.processMessageStreaming(
                conversationId,
                "Hi",
                token -> {
                },
                error -> {
                },
                () -> {
                }
        );

        onNextRef[0].accept("partial");
        cancelStream.run();
        onCompleteRef[0].run();

        List<ChatMessage> history = chatService.getHistory(conversationId);
        assertEquals(1, history.size());
        assertEquals(ChatMessage.Role.USER, history.get(0).getRole());
    }
}
