package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.tool.ToolRegistry;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessageType;
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.output.FinishReason;
import dev.langchain4j.model.output.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AgentServiceTest {

    private ToolRegistry toolRegistry;
    private AgentService agentService;

    @BeforeEach
    void setUp() {
        toolRegistry = mock(ToolRegistry.class);
        agentService = new AgentService(toolRegistry);
        ReflectionTestUtils.setField(agentService, "mockEnabled", true);
    }

    @Test
    void processMessageStreamingWaitsForConfirmationBeforeExecutingTool() throws Exception {
        when(toolRegistry.requiresConfirmation("calculator")).thenReturn(true);
        when(toolRegistry.execute(eq("calculator"), anyMap()))
                .thenReturn(CompletableFuture.completedFuture(Map.of("expression", "2 + 2", "result", 4)));

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-1",
                "calculate 2 + 2",
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertEquals(1, toolCalls.size());
        assertEquals(ToolCall.ToolStatus.PENDING, toolCalls.get(0).getStatus());
        assertTrue(toolCalls.get(0).isRequiresConfirmation());
        verify(toolRegistry, never()).execute(eq("calculator"), anyMap());
        assertEquals(0, toolResults.size());
        assertFalse(completed.await(200, TimeUnit.MILLISECONDS));

        agentService.confirmToolCall("conversation-1", toolCalls.get(0).getId(), true);

        assertTrue(completed.await(2, TimeUnit.SECONDS));
        assertEquals(2, toolCalls.size());
        assertEquals(ToolCall.ToolStatus.RUNNING, toolCalls.get(1).getStatus());
        assertEquals(toolCalls.get(0).getId(), toolCalls.get(1).getId());
        assertEquals(1, toolResults.size());
        assertEquals(toolCalls.get(0).getId(), toolResults.get(0).getToolCallId());
        assertNotNull(toolResults.get(0).getResult());
        assertTrue(streamedText.toString().contains("I calculated"));
        verify(toolRegistry).execute(eq("calculator"), anyMap());
    }

    @Test
    void confirmToolCallFalseCancelsPendingExecution() throws Exception {
        when(toolRegistry.requiresConfirmation("calculator")).thenReturn(true);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-2",
                "calculate 3 + 4",
                List.<ChatMessage>of(),
                token -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertEquals(1, toolCalls.size());
        assertEquals(ToolCall.ToolStatus.PENDING, toolCalls.get(0).getStatus());

        agentService.confirmToolCall("conversation-2", toolCalls.get(0).getId(), false);

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(1, toolResults.size());
        assertEquals(toolCalls.get(0).getId(), toolResults.get(0).getToolCallId());
        assertEquals("Tool execution cancelled by user.", toolResults.get(0).getError());
        verify(toolRegistry, never()).execute(eq("calculator"), anyMap());
    }

    @Test
    void cancelStreamStopsScheduledMockResponse() throws Exception {
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        Runnable cancelStream = agentService.processMessageStreaming(
                "conversation-3",
                "hello",
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown
        );

        cancelStream.run();
        TimeUnit.MILLISECONDS.sleep(250);

        assertEquals("", streamedText.toString());
        assertEquals(1L, completed.getCount());
    }

    @Test
    void processMessageStreamingExecutesToolRequestsFromStreamingModel() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.getAllTools()).thenReturn(Map.of(
                "get_current_time",
                new TestToolDefinition("get_current_time", "Get the current time", Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "timezone", Map.of(
                                        "type", "string",
                                        "description", "IANA timezone name"
                                )
                        ),
                        "required", List.of("timezone")
                ))
        ));
        when(toolRegistry.getTool("get_current_time")).thenReturn(
                new TestToolDefinition("get_current_time", "Get the current time", Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "timezone", Map.of(
                                        "type", "string",
                                        "description", "IANA timezone name"
                                )
                        ),
                        "required", List.of("timezone")
                ))
        );
        when(toolRegistry.requiresConfirmation("get_current_time")).thenReturn(false);
        when(toolRegistry.execute(eq("get_current_time"), eq(Map.of("timezone", "America/New_York"))))
                .thenReturn(CompletableFuture.completedFuture(Map.of(
                        "timezone", "America/New_York",
                        "formatted", "2026-03-18 09:31"
                )));

        AtomicInteger invocationCount = new AtomicInteger();
        List<ToolSpecification> capturedToolSpecs = new CopyOnWriteArrayList<>();
        StreamingChatLanguageModel streamingChatLanguageModel = new StreamingChatLanguageModel() {
            @Override
            public void generate(List<dev.langchain4j.data.message.ChatMessage> messages,
                                 StreamingResponseHandler<AiMessage> handler) {
                throw new AssertionError("Tool-aware generate overload should be used");
            }

            @Override
            public void generate(List<dev.langchain4j.data.message.ChatMessage> messages,
                                 List<ToolSpecification> toolSpecifications,
                                 StreamingResponseHandler<AiMessage> handler) {
                capturedToolSpecs.addAll(toolSpecifications);
                if (invocationCount.getAndIncrement() == 0) {
                    ToolExecutionRequest toolExecutionRequest = ToolExecutionRequest.builder()
                            .id("tool-1")
                            .name("get_current_time")
                            .arguments("{\"timezone\":\"America/New_York\"}")
                            .build();
                    handler.onComplete(Response.from(
                            AiMessage.from(List.of(toolExecutionRequest)),
                            null,
                            FinishReason.TOOL_EXECUTION
                    ));
                    return;
                }

                assertTrue(messages.stream().anyMatch(message -> message.type() == ChatMessageType.TOOL_EXECUTION_RESULT));
                handler.onNext("The current time in America/New_York is 2026-03-18 09:31.");
                handler.onComplete(Response.from(
                        AiMessage.from("The current time in America/New_York is 2026-03-18 09:31."),
                        null,
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-4",
                "What time is it in New York?",
                List.of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertTrue(capturedToolSpecs.stream().anyMatch(toolSpecification ->
                "get_current_time".equals(toolSpecification.name())));
        assertEquals(1, toolCalls.size());
        assertEquals("tool-1", toolCalls.get(0).getId());
        assertEquals(ToolCall.ToolStatus.RUNNING, toolCalls.get(0).getStatus());
        assertFalse(toolCalls.get(0).isRequiresConfirmation());
        assertEquals(1, toolResults.size());
        assertEquals("tool-1", toolResults.get(0).getToolCallId());
        assertEquals("2026-03-18 09:31", ((Map<?, ?>) toolResults.get(0).getResult()).get("formatted"));
        assertTrue(streamedText.toString().contains("The current time in America/New_York is 2026-03-18 09:31."));
        verify(toolRegistry).execute(eq("get_current_time"), eq(Map.of("timezone", "America/New_York")));
    }

    private record TestToolDefinition(String name, String description, Map<String, Object> parameters)
            implements com.fdc3.chatbot.tool.ToolDefinition {
        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public Map<String, Object> getParameters() {
            return parameters;
        }

        @Override
        public CompletableFuture<Object> execute(Map<String, Object> arguments) {
            throw new UnsupportedOperationException("Not used directly in this test");
        }
    }
}
