package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import dev.langchain4j.agent.tool.ToolParameters;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.ToolExecutionResultMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * AI Agent service using LangChain4j for conversation handling.
 */
@Slf4j
@Service
public class AgentService {
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };

    @Value("${spring.ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.base-url:}")
    private String openaiBaseUrl;

    @Value("${spring.ai.openai.model:gpt-4}")
    private String model;

    @Value("${spring.ai.openai.temperature:0.7}")
    private Double temperature;

    @Value("${chatbot.agent.max-tokens:4096}")
    private Integer maxTokens;

    @Value("${chatbot.agent.name:FDC3 Assistant}")
    private String agentName;

    @Value("${chatbot.mock.enabled:false}")
    private boolean mockEnabled;

    private final ToolRegistry toolRegistry;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private ChatLanguageModel chatModel;
    private StreamingChatLanguageModel streamingChatModel;
    private final ScheduledExecutorService mockExecutor = Executors.newScheduledThreadPool(1);

    // In-memory conversation storage (use Redis/Database in production)
    private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();
    private final Map<String, PendingToolExecution> pendingToolExecutions = new ConcurrentHashMap<>();

    public AgentService(ToolRegistry toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    @PostConstruct
    public void init() {
        if (mockEnabled) {
            log.info("Mock mode enabled - using simulated responses");
            return;
        }

        if (openaiApiKey != null && !openaiApiKey.isEmpty()) {
            var chatModelBuilder = OpenAiChatModel.builder()
                    .apiKey(openaiApiKey)
                    .modelName(model)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60));

            var streamingModelBuilder = OpenAiStreamingChatModel.builder()
                    .apiKey(openaiApiKey)
                    .modelName(model)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60));

            // Add base URL if configured (for OpenAI-compatible APIs like Azure, etc.)
            if (openaiBaseUrl != null && !openaiBaseUrl.isEmpty()) {
                chatModelBuilder.baseUrl(openaiBaseUrl);
                streamingModelBuilder.baseUrl(openaiBaseUrl);
                log.info("Using custom OpenAI base URL: {}", openaiBaseUrl);
            }

            this.chatModel = chatModelBuilder.build();
            this.streamingChatModel = streamingModelBuilder.build();

            log.info("Initialized OpenAI chat model with model: {}", model);
        } else {
            log.warn("OpenAI API key not configured. Chat functionality will be limited.");
        }
    }

    /**
     * Process a chat message and return a streaming response.
     */
    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                history,
                onNext,
                onError,
                onComplete,
                toolCall -> {
                },
                toolResult -> {
                }
        );
    }

    /**
     * Process a chat message and return a streaming response with optional tool lifecycle events.
     */
    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        AtomicBoolean cancelled = new AtomicBoolean(false);

        // Mock mode - simulate streaming response
        if (mockEnabled || streamingChatModel == null) {
            return processMockStreaming(
                    conversationId,
                    userMessage,
                    token -> {
                        if (!cancelled.get()) {
                            onNext.accept(token);
                        }
                    },
                    () -> {
                        if (!cancelled.get()) {
                            onComplete.run();
                        }
                    },
                    toolCall -> {
                        if (!cancelled.get()) {
                            onToolCall.accept(toolCall);
                        }
                    },
                    toolResult -> {
                        if (!cancelled.get()) {
                            onToolResult.accept(toolResult);
                        }
                    }
            );
        }

        try {
            // Build message list for LangChain4j
            List<dev.langchain4j.data.message.ChatMessage> messages = new java.util.ArrayList<>();
            Map<String, ToolDefinition> availableTools = toolRegistry.getAllTools();
            boolean useTools = shouldUseTools(userMessage, availableTools);

            // Add system message
            messages.add(new SystemMessage(buildSystemPrompt(useTools ? availableTools : Map.of())));

            // Add history
            if (history != null) {
                for (ChatMessage msg : history) {
                    switch (msg.getRole()) {
                        case USER -> messages.add(new UserMessage(msg.getContent()));
                        case ASSISTANT -> messages.add(new AiMessage(msg.getContent()));
                        default -> {}
                    }
                }
            }

            // Add current user message
            messages.add(new UserMessage(userMessage));

            log.debug("Processing message for conversation: {}", conversationId);

            streamConversation(
                    conversationId,
                    messages,
                    useTools ? buildToolSpecifications(availableTools) : List.of(),
                    onNext,
                    onError,
                    onComplete,
                    onToolCall,
                    onToolResult,
                    cancelled
            );

        } catch (Exception e) {
            log.error("Error processing message", e);
            onError.accept(e);
        }

        return () -> cancelled.set(true);
    }

    private void streamConversation(
            String conversationId,
            List<dev.langchain4j.data.message.ChatMessage> messages,
            List<ToolSpecification> toolSpecifications,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        StreamingResponseHandler<AiMessage> handler = new StreamingResponseHandler<>() {
            @Override
            public void onNext(String token) {
                if (cancelled.get()) {
                    return;
                }
                onNext.accept(token);
            }

            @Override
            public void onComplete(dev.langchain4j.model.output.Response<AiMessage> response) {
                if (cancelled.get()) {
                    return;
                }

                AiMessage aiMessage = response.content();
                if (aiMessage != null && aiMessage.hasToolExecutionRequests()) {
                    List<dev.langchain4j.data.message.ChatMessage> continuedMessages =
                            new java.util.ArrayList<>(messages);
                    continuedMessages.add(aiMessage);
                    continueWithToolRequests(
                            conversationId,
                            continuedMessages,
                            aiMessage.toolExecutionRequests(),
                            0,
                            onNext,
                            onError,
                            onComplete,
                            onToolCall,
                            onToolResult,
                            cancelled
                    );
                    return;
                }

                log.debug("Completed streaming response for conversation: {}", conversationId);
                onComplete.run();
            }

            @Override
            public void onError(Throwable error) {
                if (cancelled.get()) {
                    return;
                }
                log.error("Error in streaming response", error);
                onError.accept(error);
            }
        };

        if (toolSpecifications.isEmpty()) {
            streamingChatModel.generate(messages, handler);
            return;
        }

        streamingChatModel.generate(messages, toolSpecifications, handler);
    }

    private void continueWithToolRequests(
            String conversationId,
            List<dev.langchain4j.data.message.ChatMessage> messages,
            List<ToolExecutionRequest> toolExecutionRequests,
            int index,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        if (cancelled.get()) {
            return;
        }

        if (index >= toolExecutionRequests.size()) {
            streamConversation(
                    conversationId,
                    messages,
                    buildToolSpecifications(toolRegistry.getAllTools()),
                    onNext,
                    onError,
                    onComplete,
                    onToolCall,
                    onToolResult,
                    cancelled
            );
            return;
        }

        ToolExecutionRequest toolExecutionRequest = toolExecutionRequests.get(index);
        Map<String, Object> arguments = parseToolArguments(toolExecutionRequest.arguments());
        boolean requiresConfirmation = toolRegistry.requiresConfirmation(toolExecutionRequest.name());
        ToolCall toolCall = ToolCall.builder()
                .id(toolExecutionRequest.id())
                .name(toolExecutionRequest.name())
                .arguments(arguments)
                .status(requiresConfirmation ? ToolCall.ToolStatus.PENDING : ToolCall.ToolStatus.RUNNING)
                .requiresConfirmation(requiresConfirmation)
                .build();
        onToolCall.accept(toolCall);

        if (requiresConfirmation) {
            onError.accept(new UnsupportedOperationException(
                    "Tool confirmation is not supported for the live streaming model path yet: "
                            + toolExecutionRequest.name()
            ));
            return;
        }

        toolRegistry.execute(toolExecutionRequest.name(), arguments)
                .whenComplete((result, error) -> {
                    if (cancelled.get()) {
                        return;
                    }

                    ToolResult toolResult = ToolResult.builder()
                            .toolCallId(toolExecutionRequest.id())
                            .result(result)
                            .error(error != null ? error.getMessage() : extractToolError(result))
                            .build();
                    onToolResult.accept(toolResult);

                    List<dev.langchain4j.data.message.ChatMessage> continuedMessages =
                            new java.util.ArrayList<>(messages);
                    continuedMessages.add(ToolExecutionResultMessage.from(
                            toolExecutionRequest,
                            serializeToolResult(result, error)
                    ));
                    continueWithToolRequests(
                            conversationId,
                            continuedMessages,
                            toolExecutionRequests,
                            index + 1,
                            onNext,
                            onError,
                            onComplete,
                            onToolCall,
                            onToolResult,
                            cancelled
                    );
                });
    }

    private List<ToolSpecification> buildToolSpecifications(Map<String, ToolDefinition> tools) {
        return tools.values().stream()
                .map(this::toToolSpecification)
                .toList();
    }

    private ToolSpecification toToolSpecification(ToolDefinition toolDefinition) {
        return ToolSpecification.builder()
                .name(toolDefinition.getName())
                .description(toolDefinition.getDescription())
                .parameters(toToolParameters(toolDefinition.getParameters()))
                .build();
    }

    @SuppressWarnings("unchecked")
    private ToolParameters toToolParameters(Map<String, Object> parameters) {
        Object properties = parameters.get("properties");
        Object required = parameters.get("required");

        return ToolParameters.builder()
                .type(String.valueOf(parameters.getOrDefault("type", "object")))
                .properties(properties instanceof Map<?, ?> map
                        ? (Map<String, Map<String, Object>>) map
                        : Map.of())
                .required(required instanceof List<?> list
                        ? list.stream().map(String::valueOf).toList()
                        : List.of())
                .build();
    }

    private Map<String, Object> parseToolArguments(String arguments) {
        if (arguments == null || arguments.isBlank()) {
            return Map.of();
        }

        try {
            return objectMapper.readValue(arguments, MAP_TYPE);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse tool arguments: " + arguments, e);
        }
    }

    private String serializeToolResult(Object result, Throwable error) {
        Object payload = error != null
                ? Map.of("error", error.getMessage())
                : result;
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            log.warn("Failed to serialize tool result payload", e);
            return String.valueOf(payload);
        }
    }

    /**
     * Simulate a streaming response for mock mode.
     */
    private Runnable processMockStreaming(
            String conversationId,
            String userMessage,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        MockStreamHandle streamHandle = new MockStreamHandle();
        MockToolInvocation toolInvocation = resolveMockToolInvocation(userMessage);
        if (toolInvocation != null) {
            String toolCallId = UUID.randomUUID().toString();
            boolean requiresConfirmation = toolRegistry.requiresConfirmation(toolInvocation.name());
            ToolCall toolCall = ToolCall.builder()
                    .id(toolCallId)
                    .name(toolInvocation.name())
                    .arguments(toolInvocation.arguments())
                    .status(requiresConfirmation ? ToolCall.ToolStatus.PENDING : ToolCall.ToolStatus.RUNNING)
                    .requiresConfirmation(requiresConfirmation)
                    .build();
            onToolCall.accept(toolCall);

            if (requiresConfirmation) {
                pendingToolExecutions.put(
                        pendingKey(conversationId, toolCallId),
                        new PendingToolExecution(
                                toolInvocation,
                                userMessage,
                                onNext,
                                onComplete,
                                onToolCall,
                                onToolResult,
                                streamHandle
                        )
                );
                return () -> {
                    streamHandle.cancel();
                    pendingToolExecutions.remove(pendingKey(conversationId, toolCallId));
                };
            }

            executeMockTool(toolCall, toolInvocation, userMessage, onNext, onComplete, onToolResult, streamHandle);
            return streamHandle::cancel;
        }

        String mockResponse = generateMockResponse(userMessage);
        streamMockResponse(mockResponse, onNext, onComplete, streamHandle);
        return streamHandle::cancel;
    }

    private void streamMockResponse(
            String response,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete,
            MockStreamHandle streamHandle
    ) {
        String[] words = response.split(" ");
        for (int i = 0; i < words.length; i++) {
            final int index = i;
            final String word = words[i] + (i < words.length - 1 ? " " : "");
            ScheduledFuture<?> future = mockExecutor.schedule(() -> {
                if (streamHandle.isCancelled()) {
                    return;
                }
                onNext.accept(word);
                if (index == words.length - 1) {
                    onComplete.run();
                }
            }, (i + 1) * 100L, TimeUnit.MILLISECONDS);
            streamHandle.track(future);
        }
    }

    private void executeMockTool(
            ToolCall toolCall,
            MockToolInvocation toolInvocation,
            String userMessage,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolResult> onToolResult,
            MockStreamHandle streamHandle
    ) {
        toolRegistry.execute(toolInvocation.name(), toolInvocation.arguments())
                .whenComplete((result, error) -> {
                    if (streamHandle.isCancelled()) {
                        return;
                    }
                    ToolResult toolResult = ToolResult.builder()
                            .toolCallId(toolCall.getId())
                            .result(result)
                            .error(error != null ? error.getMessage() : extractToolError(result))
                            .build();
                    onToolResult.accept(toolResult);

                    String mockResponse = generateToolResponse(userMessage, toolInvocation.name(), result, error);
                    streamMockResponse(mockResponse, onNext, onComplete, streamHandle);
                });
    }

    private String pendingKey(String conversationId, String toolCallId) {
        return conversationId + ":" + toolCallId;
    }

    /**
     * Generate a mock response based on the user message.
     */
    private String generateMockResponse(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.contains("hello") || lowerMessage.contains("hi")) {
            return "Hello! I'm the FDC3 Assistant, running in mock mode. How can I help you today?";
        }

        if (lowerMessage.contains("help")) {
            return "I'm a mock chatbot assistant. In production, I would help you with:\n\n" +
                   "- FDC3 interoperability questions\n" +
                   "- Financial workflow automation\n" +
                   "- Platform navigation\n\n" +
                   "For now, I can respond to basic messages to test the integration.";
        }

        if (lowerMessage.contains("fdc3")) {
            return "FDC3 (Financial Desktop Connectivity and Consoritum) is an open standard for " +
                   "financial desktop interoperability. It enables applications to communicate and " +
                   "share context across the desktop. This is a mock response for testing.";
        }

        return String.format("You said: \"%s\"\n\nThis is a mock response. In production, I would " +
                             "provide helpful information about FDC3 and financial workflows.", userMessage);
    }

    private MockToolInvocation resolveMockToolInvocation(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.contains("weather")) {
            String location = "Bangkok, TH";
            int inIndex = lowerMessage.indexOf(" in ");
            if (inIndex >= 0) {
                location = userMessage.substring(inIndex + 4).trim();
            }
            return new MockToolInvocation("get_weather", Map.of("location", location));
        }

        if (lowerMessage.contains("time")) {
            String timezone = "UTC";
            if (lowerMessage.contains("shanghai")) {
                timezone = "Asia/Shanghai";
            } else if (lowerMessage.contains("new york")) {
                timezone = "America/New_York";
            } else if (lowerMessage.contains("london")) {
                timezone = "Europe/London";
            }
            return new MockToolInvocation("get_current_time", Map.of("timezone", timezone));
        }

        if (lowerMessage.contains("calculate") || userMessage.matches(".*\\d+[\\d\\s+\\-*/().]*.*")) {
            String expression = userMessage.replaceFirst("(?i).*calculate", "").trim();
            if (expression.isEmpty()) {
                expression = userMessage.replaceAll("[^0-9+\\-*/(). ]", "").trim();
            }
            if (!expression.isEmpty()) {
                return new MockToolInvocation("calculator", Map.of("expression", expression));
            }
        }

        return null;
    }

    private String generateToolResponse(
            String userMessage,
            String toolName,
            Object result,
            Throwable error
    ) {
        if (error != null) {
            return "I tried to use " + toolName + " but it failed: " + error.getMessage();
        }

        if (result instanceof Map<?, ?> resultMap && resultMap.containsKey("error")) {
            return "I tried to use " + toolName + " but it failed: " + resultMap.get("error");
        }

        if ("calculator".equals(toolName) && result instanceof Map<?, ?> resultMap) {
            return "I calculated " + resultMap.get("expression") + " = " + resultMap.get("result") + ".";
        }

        if ("get_current_time".equals(toolName) && result instanceof Map<?, ?> resultMap) {
            return "The current time in " + resultMap.get("timezone") + " is " + resultMap.get("formatted") + ".";
        }

        if ("get_weather".equals(toolName) && result instanceof Map<?, ?> resultMap) {
            return "The weather in " + resultMap.get("location") + " is " + resultMap.get("conditions")
                    + " at " + resultMap.get("temperature") + " degrees " + resultMap.get("temperatureUnit") + ".";
        }

        return "I used " + toolName + " to help answer: " + userMessage;
    }

    private String extractToolError(Object result) {
        if (result instanceof Map<?, ?> resultMap && resultMap.containsKey("error")) {
            Object error = resultMap.get("error");
            return error != null ? String.valueOf(error) : null;
        }
        return null;
    }

    private void confirmPendingToolExecution(String toolCallId, PendingToolExecution pendingExecution) {
        ToolCall resumedToolCall = ToolCall.builder()
                .id(toolCallId)
                .name(pendingExecution.toolInvocation().name())
                .arguments(pendingExecution.toolInvocation().arguments())
                .status(ToolCall.ToolStatus.RUNNING)
                .requiresConfirmation(true)
                .build();
        pendingExecution.onToolCall().accept(resumedToolCall);
        executeMockTool(
                resumedToolCall,
                pendingExecution.toolInvocation(),
                pendingExecution.userMessage(),
                pendingExecution.onNext(),
                pendingExecution.onComplete(),
                pendingExecution.onToolResult(),
                pendingExecution.streamHandle()
        );
    }

    private void cancelPendingToolExecution(String toolCallId, PendingToolExecution pendingExecution) {
        pendingExecution.streamHandle().cancel();
        pendingExecution.onToolResult().accept(ToolResult.builder()
                .toolCallId(toolCallId)
                .error("Tool execution cancelled by user.")
                .build());
        pendingExecution.onComplete().run();
    }

    private record MockToolInvocation(String name, Map<String, Object> arguments) {
    }

    private record PendingToolExecution(
            MockToolInvocation toolInvocation,
            String userMessage,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            MockStreamHandle streamHandle
    ) {
    }

    private static final class MockStreamHandle {
        private final AtomicBoolean cancelled = new AtomicBoolean(false);
        private final List<ScheduledFuture<?>> futures = new java.util.concurrent.CopyOnWriteArrayList<>();

        void track(ScheduledFuture<?> future) {
            if (cancelled.get()) {
                future.cancel(true);
                return;
            }
            futures.add(future);
        }

        void cancel() {
            if (!cancelled.compareAndSet(false, true)) {
                return;
            }
            futures.forEach(future -> future.cancel(true));
            futures.clear();
        }

        boolean isCancelled() {
            return cancelled.get();
        }
    }

    /**
     * Process a chat message and return a complete response.
     */
    public String processMessage(String conversationId, String userMessage, List<ChatMessage> history) {
        if (chatModel == null) {
            throw new IllegalStateException("Chat model not configured");
        }

        try {
            // Build message list for LangChain4j
            List<dev.langchain4j.data.message.ChatMessage> messages = new java.util.ArrayList<>();
            Map<String, ToolDefinition> availableTools = toolRegistry.getAllTools();
            boolean useTools = shouldUseTools(userMessage, availableTools);

            // Add system message
            messages.add(new SystemMessage(buildSystemPrompt(useTools ? availableTools : Map.of())));

            // Add history
            if (history != null) {
                for (ChatMessage msg : history) {
                    switch (msg.getRole()) {
                        case USER -> messages.add(new UserMessage(msg.getContent()));
                        case ASSISTANT -> messages.add(new AiMessage(msg.getContent()));
                        default -> {}
                    }
                }
            }

            // Add current user message
            messages.add(new UserMessage(userMessage));

            log.debug("Processing message for conversation: {}", conversationId);

            // Generate response
            dev.langchain4j.model.output.Response<AiMessage> response = chatModel.generate(messages);

            return response.content().text();

        } catch (Exception e) {
            log.error("Error processing message", e);
            throw new RuntimeException("Failed to process message", e);
        }
    }

    private String buildSystemPrompt(Map<String, ToolDefinition> availableTools) {
        String toolSection = availableTools.isEmpty()
                ? ""
                : """

                Available tools:
                %s

                When using tools, always use the native tool-calling interface provided by the model.
                Never emit pseudo-XML tags like <tool_call> or <function>.
                After tool execution, explain what you're doing and show the results clearly.
                """.formatted(
                        availableTools.values().stream()
                                .map(tool -> "- " + tool.getName() + ": " + tool.getDescription())
                                .reduce((a, b) -> a + "\n" + b)
                                .orElse("No tools currently available")
                );

        return String.format("""
                You are %s, a helpful AI assistant integrated into an FDC3-enabled financial desktop platform.

                You can help users with:
                - Answering questions about financial data and workflows
                - Executing tools on behalf of the user
                - Navigating the platform and finding information
                - Automating repetitive tasks
                %s
                Be concise but helpful. If you need clarification, ask follow-up questions.

                Always be professional and accurate in your responses.
                """,
                agentName,
                toolSection
        );
    }

    private boolean shouldUseTools(String userMessage, Map<String, ToolDefinition> availableTools) {
        if (availableTools.isEmpty() || userMessage == null || userMessage.isBlank()) {
            return false;
        }

        String normalized = userMessage.toLowerCase(Locale.ROOT);
        return normalized.contains("weather")
                || normalized.contains("temperature")
                || normalized.contains("forecast")
                || normalized.contains("time")
                || normalized.contains("timezone")
                || normalized.contains("clock")
                || normalized.contains("calculate")
                || normalized.contains("math")
                || normalized.contains("sum")
                || normalized.contains("subtract")
                || normalized.contains("multiply")
                || normalized.contains("divide")
                || normalized.matches(".*\\d\\s*[+\\-*/()]\\s*\\d.*");
    }

    /**
     * Check if the agent is ready.
     */
    public boolean isReady() {
        return mockEnabled || chatModel != null;
    }

    /**
     * Confirm or cancel a tool call.
     * This is a placeholder implementation - in production, this would manage
     * pending tool executions and resume the conversation flow.
     */
    public void confirmToolCall(String conversationId, String toolCallId, boolean confirmed) {
        log.info("Tool call {} for conversation {}: {}",
                toolCallId, conversationId, confirmed ? "confirmed" : "cancelled");

        PendingToolExecution pendingExecution = pendingToolExecutions.remove(pendingKey(conversationId, toolCallId));
        if (pendingExecution != null) {
            if (confirmed) {
                confirmPendingToolExecution(toolCallId, pendingExecution);
            } else {
                cancelPendingToolExecution(toolCallId, pendingExecution);
            }
            return;
        }

        if (confirmed) {
            // In production: execute the tool and continue the conversation
            log.debug("Would execute tool {} for conversation {}", toolCallId, conversationId);
        } else {
            // In production: cancel the tool execution and notify the user
            log.debug("Cancelled tool {} for conversation {}", toolCallId, conversationId);
        }
    }
}
