package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolRegistry;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessageType;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;
import dev.langchain4j.model.output.FinishReason;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;
import java.util.Objects;
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
    private TestToolDefinition calculatorTool;
    private TestToolDefinition timeTool;
    private TestToolDefinition weatherTool;

    @BeforeEach
    void setUp() {
        toolRegistry = mock(ToolRegistry.class);
        agentService = new AgentService(toolRegistry);
        ReflectionTestUtils.setField(agentService, "mockEnabled", true);

        calculatorTool = new TestToolDefinition(
                "calculator",
                "Perform calculations",
                Map.of("type", "object"),
                true,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "expression", arguments.get("expression"),
                        "result", 4
                ))
        );
        timeTool = new TestToolDefinition(
                "get_current_time",
                "Get the current time",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "timezone", arguments.get("timezone"),
                        "formatted", "2026-03-18 09:31"
                ))
        );
        weatherTool = new TestToolDefinition(
                "get_weather",
                "Get the current weather",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "location", arguments.get("location"),
                        "temperature", 22,
                        "conditions", "Partly Cloudy"
                ))
        );

        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "calculator", calculatorTool,
                "get_current_time", timeTool,
                "get_weather", weatherTool
        ));
        when(toolRegistry.getTool("calculator")).thenReturn(calculatorTool);
        when(toolRegistry.getTool("get_current_time")).thenReturn(timeTool);
        when(toolRegistry.getTool("get_weather")).thenReturn(weatherTool);
    }

    private static ChatResponse chatResponse(AiMessage aiMessage, FinishReason finishReason) {
        return ChatResponse.builder()
                .aiMessage(aiMessage)
                .finishReason(finishReason)
                .build();
    }

    @Test
    void processMessageStreamingWaitsForConfirmationBeforeExecutingTool() throws Exception {
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
    }

    @Test
    void confirmToolCallFalseCancelsPendingExecution() throws Exception {
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
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
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
                ), false, arguments -> CompletableFuture.completedFuture(Map.of(
                        "timezone", "America/New_York",
                        "formatted", "2026-03-18 09:31"
                )))
        ));

        AtomicInteger invocationCount = new AtomicInteger();
        List<ToolSpecification> capturedToolSpecs = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                capturedToolSpecs.addAll(request.toolSpecifications());
                if (invocationCount.getAndIncrement() == 0) {
                    ToolExecutionRequest toolExecutionRequest = ToolExecutionRequest.builder()
                            .id("tool-1")
                            .name("get_current_time")
                            .arguments("{\"timezone\":\"America/New_York\"}")
                            .build();
                    handler.onCompleteResponse(chatResponse(
                            AiMessage.from(List.of(toolExecutionRequest)),
                            FinishReason.TOOL_EXECUTION
                    ));
                    return;
                }

                assertTrue(request.messages().stream().anyMatch(message -> message.type() == ChatMessageType.TOOL_EXECUTION_RESULT));
                handler.onPartialResponse("The current time in America/New_York is 2026-03-18 09:31.");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("The current time in America/New_York is 2026-03-18 09:31."),
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
    }

    @Test
    void processMessageStreamingEmitsFrontendToolCallsFromManifestWithoutServerExecution() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of());

        List<ToolSpecification> capturedToolSpecs = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                capturedToolSpecs.addAll(request.toolSpecifications());
                ToolExecutionRequest toolExecutionRequest = ToolExecutionRequest.builder()
                        .id("frontend-tool-1")
                        .name("custom_client_tool")
                        .arguments("{\"query\":\"workspace\"}")
                        .build();
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from(List.of(toolExecutionRequest)),
                        FinishReason.TOOL_EXECUTION
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-frontend-1",
                "Use the custom client tool",
                (String) null,
                "[{\"name\":\"custom_client_tool\",\"description\":\"Custom client tool\",\"inputSchema\":{\"type\":\"object\"},\"humanInTheLoop\":false,\"hasRender\":true}]",
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

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertTrue(capturedToolSpecs.stream().anyMatch(toolSpecification ->
                "custom_client_tool".equals(toolSpecification.name())));
        assertEquals(1, toolCalls.size());
        assertEquals("frontend-tool-1", toolCalls.get(0).getId());
        assertEquals(ToolCall.ExecutionTarget.FRONTEND, toolCalls.get(0).getExecutionTarget());
        assertEquals(ToolCall.ToolStatus.RUNNING, toolCalls.get(0).getStatus());
        assertEquals(0, toolResults.size());
        verify(toolRegistry, never()).execute(eq("custom_client_tool"), anyMap());
    }

    @Test
    void processMessageStreamingDeduplicatesFrontendToolNamesThatOverlapBackendTools() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "calculator",
                new TestToolDefinition("calculator", "Perform calculations", Map.of("type", "object"))
        ));

        List<ToolSpecification> capturedToolSpecs = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                capturedToolSpecs.addAll(request.toolSpecifications());
                handler.onPartialResponse("Hello");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("Hello"),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-dedup-tools",
                "hi",
                (String) null,
                """
                        [{"name":"calculator","description":"Frontend calculator","inputSchema":{"type":"object"},"humanInTheLoop":false,"hasRender":true},
                        {"name":"custom_client_tool","description":"Custom client tool","inputSchema":{"type":"object"},"humanInTheLoop":false,"hasRender":true}]
                        """,
                List.<ChatMessage>of(),
                token -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCall -> {
                },
                toolResult -> {
                }
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(2, capturedToolSpecs.size());
        assertEquals(1, capturedToolSpecs.stream()
                .filter(toolSpecification -> "calculator".equals(toolSpecification.name()))
                .count());
        assertTrue(capturedToolSpecs.stream().anyMatch(toolSpecification ->
                "custom_client_tool".equals(toolSpecification.name())));
    }

    @Test
    void processMessageStreamingFallsBackToWeatherToolWhenModelSkipsToolCall() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "get_weather",
                new TestToolDefinition("get_weather", "Get the current weather", Map.of(
                        "type", "object",
                        "properties", Map.of("location", Map.of("type", "string")),
                        "required", List.of("location")
                ), false, arguments -> CompletableFuture.completedFuture(Map.of(
                        "location", "Shanghai",
                        "temperature", 22,
                        "conditions", "Partly Cloudy"
                )))
        ));

        AtomicInteger invocationCount = new AtomicInteger();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                invocationCount.incrementAndGet();
                handler.onPartialResponse("I'll check the current weather in Shanghai for you.");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("I'll check the current weather in Shanghai for you."),
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
                "conversation-weather-fallback",
                "weather in shanghai",
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
        assertEquals(1, invocationCount.get());
        assertEquals(1, toolCalls.size());
        assertEquals("get_weather", toolCalls.get(0).getName());
        assertEquals(1, toolResults.size());
        assertEquals("Shanghai", ((Map<?, ?>) toolResults.get(0).getResult()).get("location"));
        assertTrue(streamedText.toString().contains("I'll check the current weather in Shanghai for you."));
    }

    @Test
    void processMessageStreamingIncludesAnalyticsToolsForPvUvQueries() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        TestToolDefinition analyticsTool = new TestToolDefinition(
                "statistic_count_by_app",
                "Return PV and UV counts for an app within a time window",
                Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "appName", Map.of("type", "string"),
                                "startTime", Map.of("type", "string"),
                                "endTime", Map.of("type", "string")
                        ),
                        "required", List.of("startTime", "endTime")
                ),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "filterValue", "cashflow_blotter",
                        "pv", 95,
                        "uv", 18
                ))
        );
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "statistic_count_by_app", analyticsTool
        ));
        when(toolRegistry.getTool("statistic_count_by_app")).thenReturn(analyticsTool);

        AtomicInteger invocationCount = new AtomicInteger();
        List<List<String>> toolNamesPerInvocation = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                toolNamesPerInvocation.add(request.toolSpecifications().stream()
                        .map(ToolSpecification::name)
                        .toList());

                if (invocationCount.getAndIncrement() == 0) {
                    if (request.toolSpecifications().isEmpty()) {
                        handler.onCompleteResponse(chatResponse(
                                AiMessage.from("I can describe the analytics request, but I do not have a tool available."),
                                FinishReason.STOP
                        ));
                        return;
                    }

                    ToolExecutionRequest toolExecutionRequest = ToolExecutionRequest.builder()
                            .id("tool-analytics-1")
                            .name("statistic_count_by_app")
                            .arguments("""
                                    {"appName":"cashflow_blotter","startTime":"2026-04-16T00:00:00Z","endTime":"2026-04-17T00:00:00Z"}
                                    """)
                            .build();
                    handler.onCompleteResponse(chatResponse(
                            AiMessage.from("Let me retrieve the usage statistics for cashflow_blotter.", List.of(toolExecutionRequest)),
                            FinishReason.TOOL_EXECUTION
                    ));
                    return;
                }

                handler.onPartialResponse("cashflow_blotter usage yesterday: PV 95, UV 18.");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("cashflow_blotter usage yesterday: PV 95, UV 18."),
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
                "conversation-analytics-tools",
                "what's the pv and uv of cashflow_blotter yesterday ?",
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
        assertTrue(toolNamesPerInvocation.get(0).contains("statistic_count_by_app"));
        assertEquals(1, toolCalls.size());
        assertEquals("statistic_count_by_app", toolCalls.get(0).getName());
        assertEquals(1, toolResults.size());
        assertEquals(95, ((Map<?, ?>) toolResults.get(0).getResult()).get("pv"));
        assertEquals(18, ((Map<?, ?>) toolResults.get(0).getResult()).get("uv"));
        assertTrue(streamedText.toString().contains("cashflow_blotter usage yesterday: PV 95, UV 18."));
    }

    @Test
    void processMessageStreamingPreservesVisibleAssistantTextBeforeToolCalls() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "get_current_time",
                new TestToolDefinition("get_current_time", "Get the current time", Map.of("type", "object"), false, arguments -> CompletableFuture.completedFuture(Map.of(
                        "timezone", "Asia/Shanghai",
                        "formatted", "2026-03-25 12:30"
                )))
        ));

        AtomicInteger invocationCount = new AtomicInteger();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                if (invocationCount.getAndIncrement() == 0) {
                    ToolExecutionRequest toolExecutionRequest = ToolExecutionRequest.builder()
                            .id("tool-visible-preamble")
                            .name("get_current_time")
                            .arguments("{\"timezone\":\"Asia/Shanghai\"}")
                            .build();
                    handler.onCompleteResponse(chatResponse(
                            AiMessage.from("I’ll check the current Shanghai time first.", List.of(toolExecutionRequest)),
                            FinishReason.TOOL_EXECUTION
                    ));
                    return;
                }

                handler.onPartialResponse("It is currently 2026-03-25 12:30 in Shanghai.");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("It is currently 2026-03-25 12:30 in Shanghai."),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-visible-preamble",
                "What time is it in Shanghai?",
                List.of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCall -> {
                },
                toolResult -> {
                }
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertTrue(streamedText.toString().contains("I’ll check the current Shanghai time first."));
        assertTrue(streamedText.toString().contains("It is currently 2026-03-25 12:30 in Shanghai."));
    }

    @Test
    void processMessageStreamingDoesNotReofferCompletedFrontendToolDuringContinuation() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "calculator",
                new TestToolDefinition("calculator", "Perform calculations", Map.of("type", "object"), true, arguments -> CompletableFuture.completedFuture(Map.of("result", 4)))
        ));

        List<ToolSpecification> capturedToolSpecs = new CopyOnWriteArrayList<>();
        AtomicInteger invocationCount = new AtomicInteger();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                capturedToolSpecs.clear();
                capturedToolSpecs.addAll(request.toolSpecifications());
                invocationCount.incrementAndGet();

                assertTrue(request.messages().stream().anyMatch(message -> message.type() == ChatMessageType.TOOL_EXECUTION_RESULT));
                assertTrue(request.toolSpecifications().stream().anyMatch(toolSpecification ->
                        "calculator".equals(toolSpecification.name())));
                assertTrue(request.toolSpecifications().stream().anyMatch(toolSpecification ->
                        "other_client_tool".equals(toolSpecification.name())));
                assertFalse(request.toolSpecifications().stream().anyMatch(toolSpecification ->
                        "custom_client_tool".equals(toolSpecification.name())));

                handler.onPartialResponse("I used the completed client-side tool result to answer the request.");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("I used the completed client-side tool result to answer the request."),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);
        ReflectionTestUtils.setField(
                agentService,
                "frontendToolManifestsByConversation",
                new java.util.concurrent.ConcurrentHashMap<>(Map.of(
                        "conversation-frontend-continuation",
                        List.of(
                                new com.fdc3.chatbot.model.FrontendToolManifestEntry(
                                        "custom_client_tool",
                                        "Custom client tool",
                                        Map.of("type", "object"),
                                        false,
                                        true
                                ),
                                new com.fdc3.chatbot.model.FrontendToolManifestEntry(
                                        "other_client_tool",
                                        "Other client tool",
                                        Map.of("type", "object"),
                                        false,
                                        true
                                )
                        )
                ))
        );

        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-frontend-continuation",
                "Use the custom client tool and then explain the result.",
                """
                        {"originalUserMessage":"Use the custom client tool and then explain the result.","toolCallId":"frontend-tool-1","toolName":"custom_client_tool","args":{"query":"workspace"},"result":{"routed":true},"isError":false}
                        """,
                (String) null,
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCall -> {
                    throw new AssertionError("Continuation should not emit another frontend tool call");
                },
                toolResult -> {
                    throw new AssertionError("Continuation should not emit backend tool results");
                }
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(1, invocationCount.get());
        assertTrue(streamedText.toString().contains("completed client-side tool result"));
    }

    @Test
    void processMessageStreamingSkipsToolSpecificationsForPlainTextPrompts() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "calculator",
                new TestToolDefinition("calculator", "Perform calculations", Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "expression", Map.of(
                                        "type", "string",
                                        "description", "Math expression"
                                )
                        ),
                        "required", List.of("expression")
                ), true, arguments -> CompletableFuture.completedFuture(Map.of("result", 4)))
        ));

        AtomicInteger requestCount = new AtomicInteger();
        List<ToolSpecification> capturedToolSpecs = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                requestCount.incrementAndGet();
                capturedToolSpecs.addAll(request.toolSpecifications());
                handler.onPartialResponse("Hello!");
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("Hello!"),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-plain",
                "Say hello in one short sentence.",
                List.of(),
                token -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(1, requestCount.get());
        assertEquals(0, capturedToolSpecs.size());
    }

    @Test
    void buildSystemPromptInstructsVisibleProgressUpdatesAroundToolUse() {
        String prompt = ReflectionTestUtils.invokeMethod(
                agentService,
                "buildSystemPrompt",
                Map.of("calculator", new TestToolDefinition("calculator", "Perform calculations", Map.of("type", "object")))
        );

        assertNotNull(prompt);
        assertTrue(prompt.contains("Before calling a tool, give the user one short visible progress update"));
        assertTrue(prompt.contains("After each tool result, briefly state what you learned"));
        assertTrue(prompt.contains("do not reveal hidden chain-of-thought"));
        assertTrue(prompt.contains("Avoid markdown headings"));
        assertTrue(prompt.contains("labels like \"ProgressUpdate\""));
    }

    @Test
    void buildFrontendToolContinuationResumePromptPrefersNaturalProseOverStructuredMarkdown() {
        FrontendToolContinuation continuation = FrontendToolContinuation.builder()
                .originalUserMessage("Show a status card and explain it.")
                .toolCallId("tool-1")
                .toolName("generate_status_card")
                .args(Map.of("title", "Workspace Health"))
                .result(Map.of("status", "All systems operational"))
                .isError(false)
                .build();

        String prompt = ReflectionTestUtils.invokeMethod(
                agentService,
                "buildFrontendToolContinuationResumePrompt",
                continuation
        );

        assertNotNull(prompt);
        assertTrue(prompt.contains("Keep that visible update to one short natural sentence"));
        assertTrue(prompt.contains("Avoid markdown headings"));
        assertTrue(prompt.contains("labels like \"ProgressUpdate\""));
        assertTrue(prompt.contains("Do not turn a short tool follow-up into a structured document"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void buildAssistantTurnDiagnosticsFlagsSilentToolCalls() {
        ToolExecutionRequest toolExecutionRequest = ToolExecutionRequest.builder()
                .id("tool-silent-1")
                .name("generate_status_card")
                .arguments("{}")
                .build();

        Map<String, Object> diagnostics = ReflectionTestUtils.invokeMethod(
                agentService,
                "buildAssistantTurnDiagnostics",
                "initial",
                AiMessage.from(List.of(toolExecutionRequest)),
                ""
        );

        assertNotNull(diagnostics);
        assertEquals("initial", diagnostics.get("phase"));
        assertEquals(true, diagnostics.get("hasToolRequests"));
        assertEquals(false, diagnostics.get("hasVisibleText"));
        assertEquals(true, diagnostics.get("silentToolCall"));
        assertEquals(false, diagnostics.get("emptyAssistantAnswer"));
        assertEquals(List.of("generate_status_card"), diagnostics.get("toolNames"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void buildAssistantTurnDiagnosticsFlagsEmptyFrontendContinuationAnswers() {
        Map<String, Object> diagnostics = ReflectionTestUtils.invokeMethod(
                agentService,
                "buildAssistantTurnDiagnostics",
                "frontend-continuation",
                AiMessage.from(""),
                ""
        );

        assertNotNull(diagnostics);
        assertEquals("frontend-continuation", diagnostics.get("phase"));
        assertEquals(false, diagnostics.get("hasToolRequests"));
        assertEquals(false, diagnostics.get("hasVisibleText"));
        assertEquals(false, diagnostics.get("silentToolCall"));
        assertEquals(true, diagnostics.get("emptyAssistantAnswer"));
        assertEquals(List.of(), diagnostics.get("toolNames"));
    }

    @Test
    void processMessageStreamingFallsBackToEmailApprovalChainAfterResolvedDate() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        TestToolDefinition resolveDateTool = new TestToolDefinition(
                "resolve_relative_date",
                "Resolve a relative date",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "expression", arguments.get("expression"),
                        "resolvedDate", "2026-04-20",
                        "readable", "Monday, April 20, 2026"
                ))
        );
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "resolve_relative_date", resolveDateTool
        ));

        AtomicInteger invocationCount = new AtomicInteger();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                invocationCount.incrementAndGet();
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("I need to clarify the date before I can send that email."),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        List<ChatMessage> history = List.of(
                ChatMessage.builder()
                        .role(ChatMessage.Role.USER)
                        .content("what's the profile of user 123")
                        .build(),
                ChatMessage.builder()
                        .role(ChatMessage.Role.ASSISTANT)
                        .content("""
                                User Profile for ID 123:
                                Name: John Doe
                                Email: john.doe@example.com
                                """)
                        .build()
        );

        agentService.processMessageStreaming(
                "conversation-email-fallback",
                "send an email to him to ask for sick leave tomorrow.",
                UserCapabilityContext.anonymous(),
                null,
                """
                        [
                          {
                            "name": "approval_confirm",
                            "description": "Send an email with confirmation",
                            "humanInTheLoop": true,
                            "inputSchema": {
                              "properties": {
                                "to": { "type": "string" },
                                "subject": { "type": "string" },
                                "body": { "type": "string" }
                              }
                            }
                          }
                        ]
                        """,
                history,
                token -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(2, invocationCount.get());
        assertEquals(2, toolCalls.size());
        assertEquals("resolve_relative_date", toolCalls.get(0).getName());
        assertEquals("approval_confirm", toolCalls.get(1).getName());
        assertEquals(ToolCall.ToolStatus.PENDING, toolCalls.get(1).getStatus());
        assertEquals("john.doe@example.com", toolCalls.get(1).getArguments().get("to"));
        assertTrue(String.valueOf(toolCalls.get(1).getArguments().get("subject")).contains("2026-04-20"));
        assertEquals(1, toolResults.size());
    }

    @Test
    void processMessageStreamingFallsBackToWeatherHistoryAfterResolvedDate() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        TestToolDefinition resolveDateTool = new TestToolDefinition(
                "resolve_relative_date",
                "Resolve a relative date",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "expression", arguments.get("expression"),
                        "resolvedDate", "2026-04-20",
                        "readable", "Monday, April 20, 2026"
                ))
        );
        TestToolDefinition weatherHistoryTool = new TestToolDefinition(
                "get_weather_history",
                "Get historical weather",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "location", arguments.get("location"),
                        "date", arguments.get("date"),
                        "condition", "Sunny",
                        "highC", 26,
                        "lowC", 14
                ))
        );
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "resolve_relative_date", resolveDateTool,
                "get_weather_history", weatherHistoryTool
        ));

        AtomicInteger invocationCount = new AtomicInteger();
        List<List<String>> toolNamesPerInvocation = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                invocationCount.incrementAndGet();
                toolNamesPerInvocation.add(request.toolSpecifications().stream()
                        .map(ToolSpecification::name)
                        .toList());
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("I should clarify the date first."),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-weather-history-fallback",
                "what's the weather for Beijing tomorrow?",
                List.of(),
                token -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(2, invocationCount.get());
        assertTrue(toolNamesPerInvocation.get(0).contains("resolve_relative_date"));
        assertTrue(toolNamesPerInvocation.get(1).contains("get_weather_history"));
        assertFalse(toolNamesPerInvocation.get(1).contains("resolve_relative_date"));
        assertEquals(2, toolCalls.size());
        assertEquals("resolve_relative_date", toolCalls.get(0).getName());
        assertEquals("get_weather_history", toolCalls.get(1).getName());
        assertEquals("Beijing", toolCalls.get(1).getArguments().get("location"));
        assertEquals("2026-04-20", toolCalls.get(1).getArguments().get("date"));
        assertEquals(2, toolResults.size());
    }

    @Test
    void processMessageStreamingFallsBackToAnalyticsAfterResolvedDate() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        TestToolDefinition resolveDateTool = new TestToolDefinition(
                "resolve_relative_date",
                "Resolve a relative date",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "expression", arguments.get("expression"),
                        "resolvedDate", "2026-04-18",
                        "readable", "Saturday, April 18, 2026"
                ))
        );
        TestToolDefinition analyticsTool = new TestToolDefinition(
                "statistic_count_by_app",
                "Return PV and UV counts",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "appId", arguments.get("appId"),
                        "pv", 42,
                        "uv", 12
                ))
        );
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "resolve_relative_date", resolveDateTool,
                "statistic_count_by_app", analyticsTool
        ));

        AtomicInteger invocationCount = new AtomicInteger();
        List<List<String>> toolNamesPerInvocation = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public void chat(ChatRequest request, StreamingChatResponseHandler handler) {
                invocationCount.incrementAndGet();
                toolNamesPerInvocation.add(request.toolSpecifications().stream()
                        .map(ToolSpecification::name)
                        .toList());
                handler.onCompleteResponse(chatResponse(
                        AiMessage.from("I can answer that once I know the exact date."),
                        FinishReason.STOP
                ));
            }
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-analytics-fallback",
                "what's the pv and uv of cashflow blotter yesterday ?",
                List.of(),
                token -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(2, invocationCount.get());
        assertTrue(toolNamesPerInvocation.get(0).contains("resolve_relative_date"));
        assertTrue(toolNamesPerInvocation.get(1).contains("statistic_count_by_app"));
        assertFalse(toolNamesPerInvocation.get(1).contains("resolve_relative_date"));
        assertEquals(2, toolCalls.size());
        assertEquals("resolve_relative_date", toolCalls.get(0).getName());
        assertEquals("statistic_count_by_app", toolCalls.get(1).getName());
        assertEquals("cashflow_blotter", toolCalls.get(1).getArguments().get("appId"));
        assertEquals("2026-04-18T00:00:00Z", toolCalls.get(1).getArguments().get("startTime"));
        assertEquals("2026-04-19T00:00:00Z", toolCalls.get(1).getArguments().get("endTime"));
        assertEquals(2, toolResults.size());
    }

    private static final class TestToolDefinition implements com.fdc3.chatbot.tool.ToolDefinition {
        private final String name;
        private final String description;
        private final Map<String, Object> parameters;
        private final boolean requiresConfirmation;
        private final java.util.function.Function<Map<String, Object>, CompletableFuture<Object>> executor;

        private TestToolDefinition(
                String name,
                String description,
                Map<String, Object> parameters
        ) {
            this(name, description, parameters, false, arguments -> {
                throw new UnsupportedOperationException("Not used directly in this test");
            });
        }

        private TestToolDefinition(
                String name,
                String description,
                Map<String, Object> parameters,
                boolean requiresConfirmation,
                java.util.function.Function<Map<String, Object>, CompletableFuture<Object>> executor
        ) {
            this.name = name;
            this.description = description;
            this.parameters = parameters;
            this.requiresConfirmation = requiresConfirmation;
            this.executor = executor;
        }

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
        public boolean requiresConfirmation() {
            return requiresConfirmation;
        }

        @Override
        public CompletableFuture<Object> execute(Map<String, Object> arguments) {
            return executor.apply(arguments);
        }
    }
}
