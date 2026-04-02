package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.FrontendToolManifestEntry;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.ToolExecutionResultMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.request.json.JsonArraySchema;
import dev.langchain4j.model.chat.request.json.JsonBooleanSchema;
import dev.langchain4j.model.chat.request.json.JsonEnumSchema;
import dev.langchain4j.model.chat.request.json.JsonIntegerSchema;
import dev.langchain4j.model.chat.request.json.JsonNumberSchema;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;
import dev.langchain4j.model.chat.request.json.JsonRawSchema;
import dev.langchain4j.model.chat.request.json.JsonSchemaElement;
import dev.langchain4j.model.chat.request.json.JsonStringSchema;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;
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
import java.util.Set;
import java.util.Objects;
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

    private ChatModel chatModel;
    private StreamingChatModel streamingChatModel;
    private final ScheduledExecutorService mockExecutor = Executors.newScheduledThreadPool(1);

    // In-memory conversation storage (use Redis/Database in production)
    private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();
    private final Map<String, PendingToolExecution> pendingToolExecutions = new ConcurrentHashMap<>();
    private final Map<String, List<FrontendToolManifestEntry>> frontendToolManifestsByConversation =
            new ConcurrentHashMap<>();

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
                null,
                null,
                history,
                onNext,
                onError,
                onComplete
        );
    }

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
        return processMessageStreaming(
                conversationId,
                userMessage,
                null,
                null,
                history,
                onNext,
                onError,
                onComplete,
                onToolCall,
                onToolResult
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            String toolContext,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                toolContext,
                null,
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

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            String toolContext,
            String frontendTools,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                toolContext,
                frontendTools,
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
            String toolContext,
            String frontendTools,
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
            FrontendToolContinuation frontendToolContinuation = parseFrontendToolContinuation(toolContext);
            List<FrontendToolManifestEntry> frontendToolManifest =
                    resolveFrontendToolManifest(conversationId, frontendTools);
            Set<String> blockedFrontendTools = frontendToolContinuation != null
                    ? Set.of(frontendToolContinuation.getToolName())
                    : Set.of();
            boolean useTools = frontendToolContinuation != null
                    || shouldUseTools(userMessage, availableTools)
                    || !frontendToolManifest.isEmpty();

            if (!frontendToolManifest.isEmpty()) {
                log.debug("Received {} frontend tool manifest entries", frontendToolManifest.size());
            }

            // Add system message
            messages.add(new SystemMessage(buildSystemPrompt(useTools ? availableTools : Map.of())));
            if (frontendToolContinuation != null) {
                messages.add(new SystemMessage(buildFrontendToolContinuationPrompt(frontendToolContinuation)));
            }

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

            if (frontendToolContinuation != null) {
                messages.add(new UserMessage(frontendToolContinuation.getOriginalUserMessage()));
                messages.add(AiMessage.from(ToolExecutionRequest.builder()
                        .id(frontendToolContinuation.getToolCallId())
                        .name(frontendToolContinuation.getToolName())
                        .arguments(writeJson(frontendToolContinuation.getArgs()))
                        .build()));
                messages.add(ToolExecutionResultMessage.from(
                        frontendToolContinuation.getToolCallId(),
                        frontendToolContinuation.getToolName(),
                        writeJson(frontendToolContinuation.getResult())
                ));
                messages.add(new UserMessage(buildFrontendToolContinuationResumePrompt(frontendToolContinuation)));
            } else {
                // Add current user message
                messages.add(new UserMessage(userMessage));
            }

            log.debug("Processing message for conversation: {}", conversationId);

            streamConversation(
                    conversationId,
                    userMessage,
                    messages,
                    availableTools,
                    useTools ? buildToolSpecifications(availableTools, frontendToolManifest, blockedFrontendTools) : List.of(),
                    frontendToolManifest,
                    blockedFrontendTools,
                    frontendToolContinuation != null ? "frontend-continuation" : "initial",
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

    private FrontendToolContinuation parseFrontendToolContinuation(String toolContext) {
        if (toolContext == null || toolContext.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readValue(toolContext, FrontendToolContinuation.class);
        } catch (Exception exception) {
            log.warn("Failed to parse frontend tool continuation payload", exception);
            return null;
        }
    }

    private List<com.fdc3.chatbot.model.FrontendToolManifestEntry> parseFrontendToolManifest(String frontendTools) {
        if (frontendTools == null || frontendTools.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(
                    frontendTools,
                    objectMapper.getTypeFactory()
                            .constructCollectionType(List.class, com.fdc3.chatbot.model.FrontendToolManifestEntry.class)
            );
        } catch (Exception exception) {
            log.warn("Failed to parse frontend tool manifest", exception);
            return List.of();
        }
    }

    private List<FrontendToolManifestEntry> resolveFrontendToolManifest(
            String conversationId,
            String frontendTools
    ) {
        List<FrontendToolManifestEntry> parsedManifest = parseFrontendToolManifest(frontendTools);
        if (!parsedManifest.isEmpty()) {
            frontendToolManifestsByConversation.put(conversationId, List.copyOf(parsedManifest));
            return parsedManifest;
        }

        return frontendToolManifestsByConversation.getOrDefault(conversationId, List.of());
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to serialize frontend tool continuation", exception);
        }
    }

    private void streamConversation(
            String conversationId,
            String userMessage,
            List<dev.langchain4j.data.message.ChatMessage> messages,
            Map<String, ToolDefinition> availableTools,
            List<ToolSpecification> toolSpecifications,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedFrontendTools,
            String turnPhase,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        StringBuilder streamedAssistantText = new StringBuilder();

        StreamingChatResponseHandler handler = new StreamingChatResponseHandler() {
            @Override
            public void onPartialResponse(String token) {
                if (cancelled.get()) {
                    return;
                }
                streamedAssistantText.append(token);
                onNext.accept(token);
            }

            @Override
            public void onCompleteResponse(ChatResponse response) {
                if (cancelled.get()) {
                    return;
                }

                AiMessage aiMessage = response.aiMessage();
                if (aiMessage != null && aiMessage.hasToolExecutionRequests()) {
                    emitRemainingAssistantText(aiMessage, streamedAssistantText, onNext);
                    logAssistantTurnDiagnostics(
                            conversationId,
                            buildAssistantTurnDiagnostics(turnPhase, aiMessage, streamedAssistantText.toString())
                    );
                    List<dev.langchain4j.data.message.ChatMessage> continuedMessages =
                            new java.util.ArrayList<>(messages);
                    continuedMessages.add(aiMessage);
                    continueWithToolRequests(
                            conversationId,
                            userMessage,
                            continuedMessages,
                            aiMessage.toolExecutionRequests(),
                            frontendToolManifest,
                            blockedFrontendTools,
                            0,
                            true,
                            onNext,
                            onError,
                            onComplete,
                            onToolCall,
                            onToolResult,
                            cancelled
                    );
                    return;
                }

                if ("initial".equals(turnPhase)) {
                    ToolExecutionRequest fallbackToolRequest = inferFallbackToolExecutionRequest(userMessage, availableTools);
                    if (fallbackToolRequest != null) {
                        AiMessage fallbackAiMessage = buildFallbackToolCallMessage(aiMessage, fallbackToolRequest);
                        if (aiMessage != null) {
                            logAssistantTurnDiagnostics(
                                    conversationId,
                                    buildAssistantTurnDiagnostics(turnPhase, fallbackAiMessage, streamedAssistantText.toString())
                            );
                        }

                        List<dev.langchain4j.data.message.ChatMessage> continuedMessages =
                                new java.util.ArrayList<>(messages);
                        continuedMessages.add(fallbackAiMessage);

                        continueWithToolRequests(
                                conversationId,
                                userMessage,
                                continuedMessages,
                                List.of(fallbackToolRequest),
                                frontendToolManifest,
                                blockedFrontendTools,
                                0,
                                false,
                                onNext,
                                onError,
                                onComplete,
                                onToolCall,
                                onToolResult,
                                cancelled
                        );
                        return;
                    }
                }

                if (aiMessage != null) {
                    logAssistantTurnDiagnostics(
                            conversationId,
                            buildAssistantTurnDiagnostics(turnPhase, aiMessage, streamedAssistantText.toString())
                    );
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

        streamingChatModel.chat(buildChatRequest(messages, toolSpecifications), handler);
    }

    private void emitRemainingAssistantText(
            AiMessage aiMessage,
            StringBuilder streamedAssistantText,
            java.util.function.Consumer<String> onNext
    ) {
        String assistantText = aiMessage.text();
        if (assistantText == null || assistantText.isBlank()) {
            return;
        }

        String alreadyStreamed = streamedAssistantText.toString();
        if (alreadyStreamed.isEmpty()) {
            onNext.accept(assistantText);
            streamedAssistantText.append(assistantText);
            return;
        }

        if (assistantText.startsWith(alreadyStreamed)) {
            String remainingText = assistantText.substring(alreadyStreamed.length());
            if (!remainingText.isEmpty()) {
                onNext.accept(remainingText);
                streamedAssistantText.append(remainingText);
            }
        }
    }

    private void continueWithToolRequests(
            String conversationId,
            String userMessage,
            List<dev.langchain4j.data.message.ChatMessage> messages,
            List<ToolExecutionRequest> toolExecutionRequests,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedFrontendTools,
            int index,
            boolean continueAfterToolLoop,
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
            if (!continueAfterToolLoop) {
                onComplete.run();
                return;
            }

            streamConversation(
                    conversationId,
                    userMessage,
                    messages,
                    toolRegistry.getAllTools(),
                    buildToolSpecifications(toolRegistry.getAllTools(), frontendToolManifest, blockedFrontendTools),
                    frontendToolManifest,
                    blockedFrontendTools,
                    "tool-loop",
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
        FrontendToolManifestEntry frontendTool = findFrontendTool(frontendToolManifest, toolExecutionRequest.name());

        if (frontendTool != null) {
            ToolCall frontendToolCall = ToolCall.builder()
                    .id(toolExecutionRequest.id())
                    .name(toolExecutionRequest.name())
                    .arguments(arguments)
                    .status(frontendTool.isHumanInTheLoop() ? ToolCall.ToolStatus.PENDING : ToolCall.ToolStatus.RUNNING)
                    .executionTarget(ToolCall.ExecutionTarget.FRONTEND)
                    .requiresConfirmation(frontendTool.isHumanInTheLoop())
                    .build();
            onToolCall.accept(frontendToolCall);
            onComplete.run();
            return;
        }

        boolean requiresConfirmation = toolRegistry.requiresConfirmation(toolExecutionRequest.name());
        ToolCall toolCall = ToolCall.builder()
                .id(toolExecutionRequest.id())
                .name(toolExecutionRequest.name())
                .arguments(arguments)
                .status(requiresConfirmation ? ToolCall.ToolStatus.PENDING : ToolCall.ToolStatus.RUNNING)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
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
                            userMessage,
                            continuedMessages,
                            toolExecutionRequests,
                            frontendToolManifest,
                            blockedFrontendTools,
                            index + 1,
                            continueAfterToolLoop,
                            onNext,
                            onError,
                            onComplete,
                            onToolCall,
                            onToolResult,
                            cancelled
                    );
                });
    }

    private ToolExecutionRequest inferFallbackToolExecutionRequest(
            String userMessage,
            Map<String, ToolDefinition> availableTools
    ) {
        if (userMessage == null || userMessage.isBlank()) {
            return null;
        }

        String normalized = userMessage.toLowerCase(Locale.ROOT).trim();
        if (!availableTools.containsKey("get_weather")) {
            return null;
        }

        if (!(normalized.contains("weather")
                || normalized.contains("temperature")
                || normalized.contains("forecast"))) {
            return null;
        }

        String location = extractWeatherLocation(userMessage);
        if (location == null || location.isBlank()) {
            return null;
        }

        return ToolExecutionRequest.builder()
                .id(UUID.randomUUID().toString())
                .name("get_weather")
                .arguments(writeJson(Map.of("location", location)))
                .build();
    }

    private AiMessage buildFallbackToolCallMessage(AiMessage aiMessage, ToolExecutionRequest fallbackToolRequest) {
        if (aiMessage == null) {
            return AiMessage.from(List.of(fallbackToolRequest));
        }

        String assistantText = aiMessage.text();
        if (assistantText == null || assistantText.isBlank()) {
            return AiMessage.from(List.of(fallbackToolRequest));
        }

        return AiMessage.from(assistantText, List.of(fallbackToolRequest));
    }

    private String extractWeatherLocation(String userMessage) {
        String normalized = userMessage.trim();
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile(
                "(?i)(?:weather|temperature|forecast)(?:\\s+(?:in|for|at))?\\s+(.+)"
        ).matcher(normalized);

        if (!matcher.find()) {
            return null;
        }

        String location = matcher.group(1).trim();
        return location.isEmpty() ? null : location.substring(0, 1).toUpperCase(Locale.ROOT) + location.substring(1);
    }

    private List<ToolSpecification> buildToolSpecifications(
            Map<String, ToolDefinition> tools,
            List<FrontendToolManifestEntry> frontendTools,
            Set<String> blockedFrontendTools
    ) {
        Map<String, ToolSpecification> uniqueSpecs = new java.util.LinkedHashMap<>();

        tools.values().stream()
                .map(this::toToolSpecification)
                .forEach(toolSpecification -> uniqueSpecs.put(toolSpecification.name(), toolSpecification));

        frontendTools.stream()
                .filter(frontendTool -> !blockedFrontendTools.contains(frontendTool.getName()))
                .map(this::toToolSpecification)
                .forEach(toolSpecification -> uniqueSpecs.putIfAbsent(toolSpecification.name(), toolSpecification));

        return List.copyOf(uniqueSpecs.values());
    }

    private ToolSpecification toToolSpecification(ToolDefinition toolDefinition) {
        return ToolSpecification.builder()
                .name(toolDefinition.getName())
                .description(toolDefinition.getDescription())
                .parameters(toToolParameters(toolDefinition.getParameters()))
                .build();
    }

    private ToolSpecification toToolSpecification(FrontendToolManifestEntry frontendTool) {
        return ToolSpecification.builder()
                .name(frontendTool.getName())
                .description(frontendTool.getDescription())
                .parameters(toToolParameters(frontendTool.getInputSchema() == null ? Map.of("type", "object") : frontendTool.getInputSchema()))
                .build();
    }

    private FrontendToolManifestEntry findFrontendTool(
            List<FrontendToolManifestEntry> frontendTools,
            String toolName
    ) {
        return frontendTools.stream()
                .filter(tool -> toolName.equals(tool.getName()))
                .findFirst()
                .orElse(null);
    }

    @SuppressWarnings("unchecked")
    private JsonObjectSchema toToolParameters(Map<String, Object> parameters) {
        JsonObjectSchema.Builder builder = JsonObjectSchema.builder();
        Object description = parameters.get("description");
        if (description != null) {
            builder.description(String.valueOf(description));
        }

        Object properties = parameters.get("properties");
        if (properties instanceof Map<?, ?> map) {
            map.forEach((key, value) -> {
                if (key != null && value instanceof Map<?, ?> propertySchema) {
                    builder.addProperty(String.valueOf(key), toJsonSchemaElement(castSchemaMap(propertySchema)));
                }
            });
        }

        Object required = parameters.get("required");
        if (required instanceof List<?> list) {
            builder.required(list.stream().map(String::valueOf).toList());
        }

        Object additionalProperties = parameters.get("additionalProperties");
        if (additionalProperties instanceof Boolean bool) {
            builder.additionalProperties(bool);
        }

        return builder.build();
    }

    private ChatRequest buildChatRequest(
            List<dev.langchain4j.data.message.ChatMessage> messages,
            List<ToolSpecification> toolSpecifications
    ) {
        ChatRequest.Builder builder = ChatRequest.builder().messages(messages);
        if (!toolSpecifications.isEmpty()) {
            builder.toolSpecifications(toolSpecifications);
        }
        return builder.build();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> castSchemaMap(Map<?, ?> schema) {
        return (Map<String, Object>) schema;
    }

    private JsonSchemaElement toJsonSchemaElement(Map<String, Object> schema) {
        String description = schema.get("description") == null ? null : String.valueOf(schema.get("description"));
        Object enumValues = schema.get("enum");
        if (enumValues instanceof List<?> values && !values.isEmpty()) {
            JsonEnumSchema.Builder builder = JsonEnumSchema.builder()
                    .enumValues(values.stream().map(String::valueOf).toList());
            if (description != null) {
                builder.description(description);
            }
            return builder.build();
        }

        String type = schema.get("type") == null ? "string" : String.valueOf(schema.get("type"));
        return switch (type) {
            case "object" -> toToolParameters(schema);
            case "array" -> {
                JsonArraySchema.Builder builder = JsonArraySchema.builder();
                if (description != null) {
                    builder.description(description);
                }
                Object items = schema.get("items");
                if (items instanceof Map<?, ?> itemSchema) {
                    builder.items(toJsonSchemaElement(castSchemaMap(itemSchema)));
                } else {
                    builder.items(JsonRawSchema.from(items == null ? "{\"type\":\"string\"}" : writeJson(items)));
                }
                yield builder.build();
            }
            case "integer" -> buildIntegerSchema(description);
            case "number" -> buildNumberSchema(description);
            case "boolean" -> buildBooleanSchema(description);
            case "string" -> buildStringSchema(description);
            default -> JsonRawSchema.from(writeJson(schema));
        };
    }

    private JsonStringSchema buildStringSchema(String description) {
        JsonStringSchema.Builder builder = JsonStringSchema.builder();
        if (description != null) {
            builder.description(description);
        }
        return builder.build();
    }

    private JsonIntegerSchema buildIntegerSchema(String description) {
        JsonIntegerSchema.Builder builder = JsonIntegerSchema.builder();
        if (description != null) {
            builder.description(description);
        }
        return builder.build();
    }

    private JsonNumberSchema buildNumberSchema(String description) {
        JsonNumberSchema.Builder builder = JsonNumberSchema.builder();
        if (description != null) {
            builder.description(description);
        }
        return builder.build();
    }

    private JsonBooleanSchema buildBooleanSchema(String description) {
        JsonBooleanSchema.Builder builder = JsonBooleanSchema.builder();
        if (description != null) {
            builder.description(description);
        }
        return builder.build();
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

    private Map<String, Object> buildAssistantTurnDiagnostics(
            String turnPhase,
            AiMessage aiMessage,
            String visibleAssistantText
    ) {
        List<String> toolNames = aiMessage.toolExecutionRequests() == null
                ? List.of()
                : aiMessage.toolExecutionRequests().stream()
                .map(ToolExecutionRequest::name)
                .filter(Objects::nonNull)
                .toList();

        boolean hasToolRequests = !toolNames.isEmpty();
        boolean hasVisibleText = (visibleAssistantText != null && !visibleAssistantText.isBlank())
                || (aiMessage.text() != null && !aiMessage.text().isBlank());
        boolean silentToolCall = hasToolRequests && !hasVisibleText;
        boolean emptyAssistantAnswer = !hasToolRequests && !hasVisibleText;

        return Map.of(
                "phase", turnPhase,
                "toolNames", toolNames,
                "hasToolRequests", hasToolRequests,
                "hasVisibleText", hasVisibleText,
                "silentToolCall", silentToolCall,
                "emptyAssistantAnswer", emptyAssistantAnswer
        );
    }

    private void logAssistantTurnDiagnostics(String conversationId, Map<String, Object> diagnostics) {
        boolean silentToolCall = Boolean.TRUE.equals(diagnostics.get("silentToolCall"));
        boolean emptyAssistantAnswer = Boolean.TRUE.equals(diagnostics.get("emptyAssistantAnswer"));

        if (!silentToolCall && !emptyAssistantAnswer) {
            log.debug(
                    "Assistant turn diagnostics for conversation {}: phase={}, tools={}, hasVisibleText={}",
                    conversationId,
                    diagnostics.get("phase"),
                    diagnostics.get("toolNames"),
                    diagnostics.get("hasVisibleText")
            );
            return;
        }

        log.warn(
                "Silent assistant turn detected for conversation {}: phase={}, tools={}, silentToolCall={}, emptyAssistantAnswer={}",
                conversationId,
                diagnostics.get("phase"),
                diagnostics.get("toolNames"),
                silentToolCall,
                emptyAssistantAnswer
        );
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

    public void clearConversationContext(String conversationId) {
        frontendToolManifestsByConversation.remove(conversationId);
        pendingToolExecutions.keySet().removeIf(key -> key.startsWith(conversationId + ":"));
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
            ChatResponse response = chatModel.chat(buildChatRequest(messages, List.of()));
            return response.aiMessage().text();

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
                Before calling a tool, give the user one short visible progress update about what you are checking.
                After each tool result, briefly state what you learned before deciding whether another tool is needed.
                Keep these progress updates concise and user-facing; do not reveal hidden chain-of-thought.
                Avoid markdown headings, labels like "ProgressUpdate", and bold section titles for these short updates unless the user explicitly asked for structured markdown.
                Prefer natural prose over document-style formatting when you are mixing tool results with conversational reasoning.
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

    private String buildFrontendToolContinuationPrompt(FrontendToolContinuation frontendToolContinuation) {
        String argumentsJson = writeJson(frontendToolContinuation.getArgs());
        String resultJson = writeJson(frontendToolContinuation.getResult());
        String errorInstruction = frontendToolContinuation.isError()
                ? """

                The client-side tool reported an error. Explain that failure clearly and use it as part of your reasoning.
                """
                : """

                The client-side tool completed successfully. Use its result directly when answering the user.
                """;

        return """
                A client-side tool has already been executed as part of the current request.
                Treat its result as authoritative context in the reasoning chain.
                Do not say you lack access to this tool; you already have its output in the conversation.
                If the result fully answers the question, use it. If it is only partial, build on it and explain what remains unknown.%s
                Give the user a short visible progress update that connects this tool result to your next step.

                Completed client-side tool:
                - name: %s
                - toolCallId: %s
                - arguments: %s
                - result: %s
                """.formatted(
                errorInstruction,
                frontendToolContinuation.getToolName(),
                frontendToolContinuation.getToolCallId(),
                argumentsJson,
                resultJson
        );
    }

    private String buildFrontendToolContinuationResumePrompt(FrontendToolContinuation frontendToolContinuation) {
        String argumentsJson = writeJson(frontendToolContinuation.getArgs());
        String resultJson = writeJson(frontendToolContinuation.getResult());
        String errorInstruction = frontendToolContinuation.isError()
                ? "The client-side tool failed. Explain the failure in context and describe the best next step."
                : "The client-side tool succeeded. Use its returned data directly in your answer.";

        return """
                Continue answering the user's original request using the completed client-side tool result already present in the conversation.
                The user's request was: "%s"
                The completed client-side tool was: %s
                The completed tool arguments were: %s
                The completed tool result was: %s
                Do not claim that the client-side tool is unavailable; its output is already present in the conversation.
                Before deciding to call another tool, provide one short visible progress update about what the completed result tells you.
                Keep that visible update to one short natural sentence.
                Avoid markdown headings, labels like "ProgressUpdate", and bold section titles unless the user explicitly asked for structured markdown.
                Do not turn a short tool follow-up into a structured document with sections or headings.
                If the completed result is enough, answer directly instead of calling another tool.
                Do not call the same client-side tool again unless you genuinely need a materially different invocation that the completed result does not already satisfy.
                %s
                """.formatted(
                frontendToolContinuation.getOriginalUserMessage(),
                frontendToolContinuation.getToolName(),
                argumentsJson,
                resultJson,
                errorInstruction
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
