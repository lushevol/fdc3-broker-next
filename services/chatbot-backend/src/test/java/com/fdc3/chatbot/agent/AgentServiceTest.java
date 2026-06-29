package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.ToolResponseMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.model.StreamingChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.tool.ToolCallingChatOptions;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;

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
    private TestToolDefinition calculatorTool;
    private TestToolDefinition timeTool;
    private TestToolDefinition weatherTool;
    private TestToolDefinition flowzeroWorkflowTool;

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
        flowzeroWorkflowTool = new TestToolDefinition(
                "generate_flowzero_workflow",
                "Generate and persist a Flowzero workflow",
                Map.of("type", "object"),
                false,
                arguments -> CompletableFuture.completedFuture(Map.of(
                        "workflowId", "wf-mock-1",
                        "workflowName", arguments.get("workflowName"),
                        "summary", "Start -> Manager Approval -> Finance Approval -> End"
                ))
        );

        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of(
                "calculator", calculatorTool,
                "get_current_time", timeTool,
                "get_weather", weatherTool,
                "generate_flowzero_workflow", flowzeroWorkflowTool
        ));
        when(toolRegistry.getTool("calculator")).thenReturn(calculatorTool);
        when(toolRegistry.getTool("get_current_time")).thenReturn(timeTool);
        when(toolRegistry.getTool("get_weather")).thenReturn(weatherTool);
        when(toolRegistry.getTool("generate_flowzero_workflow")).thenReturn(flowzeroWorkflowTool);
    }

    private static ChatResponse chatResponse(String text) {
        return ChatResponse.builder()
                .generations(List.of(new Generation(new AssistantMessage(text))))
                .build();
    }

    private static ChatResponse chatResponse(String text, List<AssistantMessage.ToolCall> toolCalls) {
        return ChatResponse.builder()
                .generations(List.of(new Generation(AssistantMessage.builder()
                        .content(text)
                        .toolCalls(toolCalls)
                        .build())))
                .build();
    }

    private static List<String> toolNames(Prompt prompt) {
        if (!(prompt.getOptions() instanceof ToolCallingChatOptions toolOptions)
                || toolOptions.getToolCallbacks() == null) {
            return List.of();
        }
        return toolOptions.getToolCallbacks().stream()
                .map(toolCallback -> toolCallback.getToolDefinition().name())
                .toList();
    }

    private static boolean hasToolResponseMessage(Prompt prompt) {
        return prompt.getInstructions().stream().anyMatch(ToolResponseMessage.class::isInstance);
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
    void processMessageStreamingRoutesFlowzeroGenerationToWorkflowTool() throws Exception {
        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-flowzero",
                "Generate a Flowzero workflow named Expense Approval: start, manager approval, finance approval, end",
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(2, TimeUnit.SECONDS));
        assertEquals(1, toolCalls.size());
        assertEquals("generate_flowzero_workflow", toolCalls.get(0).getName());
        assertEquals("Expense Approval", toolCalls.get(0).getArguments().get("workflowName"));
        assertEquals("start, manager approval, finance approval, end", toolCalls.get(0).getArguments().get("prompt"));
        assertEquals(1, toolResults.size());
        assertEquals("wf-mock-1", ((Map<?, ?>) toolResults.get(0).getResult()).get("workflowId"));
        assertTrue(streamedText.toString().contains("Created Flowzero workflow Expense Approval"));
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
        List<String> capturedToolNames = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public Flux<ChatResponse> stream(Prompt prompt) {
                capturedToolNames.addAll(toolNames(prompt));
                if (invocationCount.getAndIncrement() == 0) {
                    return Flux.just(chatResponse(
                            "",
                            List.of(new AssistantMessage.ToolCall(
                                    "tool-1",
                                    "function",
                                    "get_current_time",
                                    "{\"timezone\":\"America/New_York\"}"
                            ))
                    ));
                }

                assertTrue(hasToolResponseMessage(prompt));
                return Flux.just(chatResponse("The current time in America/New_York is 2026-03-18 09:31."));
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
        assertTrue(capturedToolNames.contains("get_current_time"));
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
    void processMessageStreamingRoutesFlowzeroGenerationToWorkflowToolInNonMockMode() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);

        AtomicInteger modelInvocations = new AtomicInteger();
        StreamingChatModel streamingChatLanguageModel = prompt -> {
            modelInvocations.incrementAndGet();
            return Flux.just(chatResponse("I can help create that workflow."));
        };
        ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatLanguageModel);

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-flowzero-live",
                "Generate a Flowzero workflow named Vendor Onboarding: start, collect documents, approval, end",
                List.of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(2, TimeUnit.SECONDS));
        assertEquals(0, modelInvocations.get());
        assertEquals(1, toolCalls.size());
        assertEquals("generate_flowzero_workflow", toolCalls.get(0).getName());
        assertEquals("Vendor Onboarding", toolCalls.get(0).getArguments().get("workflowName"));
        assertEquals(1, toolResults.size());
        assertEquals("wf-mock-1", ((Map<?, ?>) toolResults.get(0).getResult()).get("workflowId"));
        assertTrue(streamedText.toString().contains("Created Flowzero workflow Vendor Onboarding"));
    }

    @Test
    void initPrefersSpringAi2ChatPropertiesOverLegacyOpenAiKeys() {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        ReflectionTestUtils.setField(agentService, "openaiApiKey", "test-key");
        ReflectionTestUtils.setField(agentService, "model", "legacy-model");
        ReflectionTestUtils.setField(agentService, "temperature", 0.7d);
        ReflectionTestUtils.setField(agentService, "chatModelName", "gpt-4.1-mini");
        ReflectionTestUtils.setField(agentService, "chatTemperature", 0.2d);

        agentService.init();

        OpenAiChatModel chatModel = (OpenAiChatModel) ReflectionTestUtils.getField(agentService, "chatModel");
        OpenAiChatModel streamingChatModel =
                (OpenAiChatModel) ReflectionTestUtils.getField(agentService, "streamingChatModel");

        assertNotNull(chatModel);
        assertNotNull(streamingChatModel);
        assertEquals("gpt-4.1-mini", chatModel.getOptions().getModel());
        assertEquals(0.2d, chatModel.getOptions().getTemperature());
    }

    @Test
    void initFallsBackToLegacyOpenAiKeysWhenSpringAi2ChatPropertiesAreUnset() {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        ReflectionTestUtils.setField(agentService, "openaiApiKey", "test-key");
        ReflectionTestUtils.setField(agentService, "model", "legacy-model");
        ReflectionTestUtils.setField(agentService, "temperature", 0.7d);
        ReflectionTestUtils.setField(agentService, "chatModelName", null);
        ReflectionTestUtils.setField(agentService, "chatTemperature", null);

        agentService.init();

        OpenAiChatModel chatModel = (OpenAiChatModel) ReflectionTestUtils.getField(agentService, "chatModel");
        OpenAiChatModel streamingChatModel =
                (OpenAiChatModel) ReflectionTestUtils.getField(agentService, "streamingChatModel");

        assertNotNull(chatModel);
        assertNotNull(streamingChatModel);
        assertEquals("legacy-model", chatModel.getOptions().getModel());
        assertEquals(0.7d, chatModel.getOptions().getTemperature());
    }

    @Test
    void initFallsBackToRuntimeOpenAiSystemPropertiesWhenInjectedValuesAreBlank() {
        String previousApiKey = System.getProperty("spring.ai.openai.api-key");
        String previousBaseUrl = System.getProperty("spring.ai.openai.base-url");
        String previousModel = System.getProperty("spring.ai.openai.chat.model");
        try {
            System.setProperty("spring.ai.openai.api-key", "runtime-key");
            System.setProperty("spring.ai.openai.base-url", "https://runtime.example/v1");
            System.setProperty("spring.ai.openai.chat.model", "runtime-model");

            ReflectionTestUtils.setField(agentService, "mockEnabled", false);
            ReflectionTestUtils.setField(agentService, "openaiApiKey", "");
            ReflectionTestUtils.setField(agentService, "openaiBaseUrl", "");
            ReflectionTestUtils.setField(agentService, "model", "legacy-model");
            ReflectionTestUtils.setField(agentService, "temperature", 0.7d);
            ReflectionTestUtils.setField(agentService, "chatModelName", "");
            ReflectionTestUtils.setField(agentService, "chatTemperature", null);

            agentService.init();

            OpenAiChatModel chatModel = (OpenAiChatModel) ReflectionTestUtils.getField(agentService, "chatModel");
            OpenAiChatModel streamingChatModel =
                    (OpenAiChatModel) ReflectionTestUtils.getField(agentService, "streamingChatModel");

            assertNotNull(chatModel);
            assertNotNull(streamingChatModel);
            assertEquals("runtime-model", chatModel.getOptions().getModel());
            assertEquals(0.7d, chatModel.getOptions().getTemperature());
        } finally {
            restoreSystemProperty("spring.ai.openai.api-key", previousApiKey);
            restoreSystemProperty("spring.ai.openai.base-url", previousBaseUrl);
            restoreSystemProperty("spring.ai.openai.chat.model", previousModel);
        }
    }

    private static void restoreSystemProperty(String key, String value) {
        if (value == null) {
            System.clearProperty(key);
        } else {
            System.setProperty(key, value);
        }
    }

    @Test
    void processMessageStreamingEmitsFrontendToolCallsFromManifestWithoutServerExecution() throws Exception {
        ReflectionTestUtils.setField(agentService, "mockEnabled", false);
        when(toolRegistry.resolveTools(UserCapabilityContext.anonymous())).thenReturn(Map.of());

        List<String> capturedToolNames = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public Flux<ChatResponse> stream(Prompt prompt) {
                capturedToolNames.addAll(toolNames(prompt));
                return Flux.just(chatResponse(
                        "",
                        List.of(new AssistantMessage.ToolCall(
                                "frontend-tool-1",
                                "function",
                                "custom_client_tool",
                                "{\"query\":\"workspace\"}"
                        ))
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
        assertTrue(capturedToolNames.contains("custom_client_tool"));
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

        List<String> capturedToolNames = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public Flux<ChatResponse> stream(Prompt prompt) {
                capturedToolNames.addAll(toolNames(prompt));
                return Flux.just(chatResponse("Hello"));
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
        assertEquals(2, capturedToolNames.size());
        assertEquals(1, capturedToolNames.stream()
                .filter("calculator"::equals)
                .count());
        assertTrue(capturedToolNames.contains("custom_client_tool"));
    }

    @Test
    void processMessageStreamingDoesNotInventWeatherToolCallsWhenModelSkipsToolCall() throws Exception {
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
            public Flux<ChatResponse> stream(Prompt prompt) {
                invocationCount.incrementAndGet();
                return Flux.just(chatResponse("I'll check the current weather in Shanghai for you."));
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
        assertEquals(0, toolCalls.size());
        assertEquals(0, toolResults.size());
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
            public Flux<ChatResponse> stream(Prompt prompt) {
                toolNamesPerInvocation.add(toolNames(prompt));

                if (invocationCount.getAndIncrement() == 0) {
                    if (toolNames(prompt).isEmpty()) {
                        return Flux.just(chatResponse("I can describe the analytics request, but I do not have a tool available."));
                    }

                    return Flux.just(chatResponse(
                            "Let me retrieve the usage statistics for cashflow_blotter.",
                            List.of(new AssistantMessage.ToolCall(
                                    "tool-analytics-1",
                                    "function",
                                    "statistic_count_by_app",
                                    "{\"appName\":\"cashflow_blotter\",\"startTime\":\"2026-04-16T00:00:00Z\",\"endTime\":\"2026-04-17T00:00:00Z\"}"
                            ))
                    ));
                }

                return Flux.just(chatResponse("cashflow_blotter usage yesterday: PV 95, UV 18."));
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
            public Flux<ChatResponse> stream(Prompt prompt) {
                if (invocationCount.getAndIncrement() == 0) {
                    return Flux.just(chatResponse(
                            "I’ll check the current Shanghai time first.",
                            List.of(new AssistantMessage.ToolCall(
                                    "tool-visible-preamble",
                                    "function",
                                    "get_current_time",
                                    "{\"timezone\":\"Asia/Shanghai\"}"
                            ))
                    ));
                }

                return Flux.just(chatResponse("It is currently 2026-03-25 12:30 in Shanghai."));
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

        List<String> capturedToolNames = new CopyOnWriteArrayList<>();
        AtomicInteger invocationCount = new AtomicInteger();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public Flux<ChatResponse> stream(Prompt prompt) {
                capturedToolNames.clear();
                capturedToolNames.addAll(toolNames(prompt));
                invocationCount.incrementAndGet();

                assertTrue(hasToolResponseMessage(prompt));
                assertTrue(capturedToolNames.contains("calculator"));
                assertTrue(capturedToolNames.contains("other_client_tool"));
                assertFalse(capturedToolNames.contains("custom_client_tool"));

                return Flux.just(chatResponse("I used the completed client-side tool result to answer the request."));
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
    void processMessageStreamingStillOffersToolSpecificationsWhenToolsAreAvailable() throws Exception {
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
        List<String> capturedToolNames = new CopyOnWriteArrayList<>();
        StreamingChatModel streamingChatLanguageModel = new StreamingChatModel() {
            @Override
            public Flux<ChatResponse> stream(Prompt prompt) {
                requestCount.incrementAndGet();
                capturedToolNames.addAll(toolNames(prompt));
                return Flux.just(chatResponse("Hello!"));
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
        assertEquals(1, capturedToolNames.size());
        assertEquals("calculator", capturedToolNames.get(0));
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
        Map<String, Object> diagnostics = ReflectionTestUtils.invokeMethod(
                agentService,
                "buildAssistantTurnDiagnostics",
                "initial",
                AssistantMessage.builder()
                        .toolCalls(List.of(new AssistantMessage.ToolCall(
                                "tool-silent-1",
                                "function",
                                "generate_status_card",
                                "{}"
                        )))
                        .build(),
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
                new AssistantMessage(""),
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
    void processMessageStreamingDoesNotChainEmailApprovalAfterResolvedDateWithoutModelToolCall() throws Exception {
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
            public Flux<ChatResponse> stream(Prompt prompt) {
                invocationCount.incrementAndGet();
                return Flux.just(chatResponse("I need to clarify the date before I can send that email."));
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
        assertEquals(1, invocationCount.get());
        assertEquals(0, toolCalls.size());
        assertEquals(0, toolResults.size());
    }

    @Test
    void processMessageStreamingDoesNotChainWeatherHistoryAfterResolvedDateWithoutModelToolCall() throws Exception {
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
            public Flux<ChatResponse> stream(Prompt prompt) {
                invocationCount.incrementAndGet();
                toolNamesPerInvocation.add(toolNames(prompt));
                return Flux.just(chatResponse("I should clarify the date first."));
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
        assertEquals(1, invocationCount.get());
        assertTrue(toolNamesPerInvocation.get(0).contains("resolve_relative_date"));
        assertTrue(toolNamesPerInvocation.get(0).contains("get_weather_history"));
        assertEquals(0, toolCalls.size());
        assertEquals(0, toolResults.size());
    }

    @Test
    void processMessageStreamingDoesNotChainAnalyticsAfterResolvedDateWithoutModelToolCall() throws Exception {
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
            public Flux<ChatResponse> stream(Prompt prompt) {
                invocationCount.incrementAndGet();
                toolNamesPerInvocation.add(toolNames(prompt));
                return Flux.just(chatResponse("I can answer that once I know the exact date."));
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
        assertEquals(1, invocationCount.get());
        assertTrue(toolNamesPerInvocation.get(0).contains("resolve_relative_date"));
        assertTrue(toolNamesPerInvocation.get(0).contains("statistic_count_by_app"));
        assertEquals(0, toolCalls.size());
        assertEquals(0, toolResults.size());
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
