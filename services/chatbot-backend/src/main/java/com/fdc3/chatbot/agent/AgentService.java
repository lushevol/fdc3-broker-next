package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.agent.prompt.ResultSynthesisPromptFactory;
import com.fdc3.chatbot.controlplane.CapabilityResolver;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.controlplane.policy.PolicyEvaluator;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.FrontendToolManifestEntry;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import com.fdc3.chatbot.tool.agentutils.ToolExecutionBridge;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.ToolResponseMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.StreamingChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;

import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.function.FunctionToolCallback;
import org.springaicommunity.agent.tools.AutoMemoryTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import reactor.core.Disposable;

import com.openai.client.OpenAIClient;
import com.openai.client.OpenAIClientAsync;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.client.okhttp.OpenAIOkHttpClientAsync;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.nio.file.Path;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

/**
 * AI Agent service using Spring AI for conversation handling.
 */
@Slf4j
@Service
public class AgentService {
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };
    private static final String MEMORY_VIEW_SCHEMA = """
            {"type":"object","properties":{
              "path":{"type":"string","description":"Path to the file or directory to view, relative to the memories root. Use empty string or '/' for the root."},
              "viewRange":{"type":"string","description":"Optional line range as 'start,end' when viewing a file."}
            },"required":["path"]}
            """;
    private static final String MEMORY_CREATE_SCHEMA = """
            {"type":"object","properties":{
              "path":{"type":"string","description":"Path for the new file, relative to the memories root."},
              "fileText":{"type":"string","description":"Full file content including YAML frontmatter followed by the memory body."}
            },"required":["path","fileText"]}
            """;
    private static final String MEMORY_STR_REPLACE_SCHEMA = """
            {"type":"object","properties":{
              "path":{"type":"string","description":"Path to the file to edit, relative to the memories root."},
              "oldStr":{"type":"string","description":"Exact text to find and replace. Must appear exactly once."},
              "newStr":{"type":"string","description":"Replacement text. Use empty string to delete matched text."}
            },"required":["path","oldStr","newStr"]}
            """;
    private static final String MEMORY_INSERT_SCHEMA = """
            {"type":"object","properties":{
              "path":{"type":"string","description":"Path to the file to modify, relative to the memories root."},
              "insertLine":{"type":"integer","description":"Line number after which to insert the text. Use 0 to insert before the first line."},
              "insertText":{"type":"string","description":"Text to insert."}
            },"required":["path","insertLine","insertText"]}
            """;
    private static final String MEMORY_DELETE_SCHEMA = """
            {"type":"object","properties":{
              "path":{"type":"string","description":"Path to the file or directory to delete, relative to the memories root."}
            },"required":["path"]}
            """;
    private static final String MEMORY_RENAME_SCHEMA = """
            {"type":"object","properties":{
              "oldPath":{"type":"string","description":"Current path of the file or directory, relative to the memories root."},
              "newPath":{"type":"string","description":"New path for the file or directory, relative to the memories root."}
            },"required":["oldPath","newPath"]}
            """;
    private static final String STREAMED_ASSISTANT_TEXT_REQUEST = """
            You are writing the user-visible assistant reply for a chat turn.
            Respond with plain assistant text only.
            Preserve the meaning of the drafted reply.
            Do not add new facts, tool names, or formatting that are not already implied by the draft.
            """;

    @Value("${spring.ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.base-url:}")
    private String openaiBaseUrl;

    @Value("${spring.ai.openai.chat.model:gpt-4}")
    private String model;

    @Value("${spring.ai.openai.temperature:0.7}")
    private Double temperature;

    @Value("${spring.ai.openai.chat.model:}")
    private String chatModelName;

    @Value("${spring.ai.openai.chat.temperature:#{null}}")
    private Double chatTemperature;

    @Value("${chatbot.agent.max-tokens:4096}")
    private Integer maxTokens;

    @Value("${chatbot.agent.name:FDC3 Assistant}")
    private String agentName;

    @Value("${chatbot.mock.enabled:false}")
    private boolean mockEnabled;

    @Value("${chatbot.memory.enabled:true}")
    private boolean memoryEnabled;

    @Value("${chatbot.memory.directory:./data/memories}")
    private String memoryDirectory;

    private String memorySystemPrompt;

    private final ToolRegistry toolRegistry;
    private final CapabilityResolver capabilityResolver;
    private final PolicyEvaluator policyEvaluator;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private MemoryToolsFactory memoryToolsFactory; // null when memory is disabled

    /** Tracks userId per active conversation for per-user memory isolation. */
    private final Map<String, String> conversationUsers = new ConcurrentHashMap<>();

    /**
     * Per-request tool callbacks indexed by conversationId.
     * Memory tool callbacks (AutoMemoryTools) are created per-user and stored
     * here so the execution path in {@link #continueWithToolRequests} can
     * find them — they are not registered in the global bridge.
     */
    private final Map<String, Map<String, ToolCallback>> conversationCallbacks = new ConcurrentHashMap<>();

    private ChatModel chatModel;
    private StreamingChatModel streamingChatModel;
    private AgentDecisionService agentDecisionService;
    private PlanValidationService planValidationService;
    private ExecutionOrchestrator executionOrchestrator;
    private ResultSynthesisService resultSynthesisService;
    private final ScheduledExecutorService mockExecutor = Executors.newScheduledThreadPool(1);

    // Per-request model name override set by processProtocolMessageStreamingWithModel.
    // Used by streamConversation to pass the selected model to buildPrompt.
    private static final ThreadLocal<String> MODEL_NAME_OVERRIDE = new ThreadLocal<>();

    // In-memory conversation storage (use Redis/Database in production)
    private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();
    private final Map<String, PendingToolExecution> pendingToolExecutions = new ConcurrentHashMap<>();
    private final Map<String, List<FrontendToolManifestEntry>> frontendToolManifestsByConversation =
            new ConcurrentHashMap<>();

    private ToolExecutionBridge toolExecutionBridge;

    public AgentService(ToolRegistry toolRegistry) {
        this(toolRegistry, null, null, null, null, null, null);
    }

    @Autowired
    public AgentService(
            ToolRegistry toolRegistry,
            CapabilityResolver capabilityResolver,
            PolicyEvaluator policyEvaluator
    ) {
        this(toolRegistry, capabilityResolver, policyEvaluator, null, null, null, null);
    }

    public AgentService(
            ToolRegistry toolRegistry,
            CapabilityResolver capabilityResolver,
            PolicyEvaluator policyEvaluator,
            AgentDecisionService agentDecisionService,
            PlanValidationService planValidationService,
            ExecutionOrchestrator executionOrchestrator,
            ResultSynthesisService resultSynthesisService
    ) {
        this.toolRegistry = toolRegistry;
        this.capabilityResolver = capabilityResolver;
        this.policyEvaluator = policyEvaluator;
        this.agentDecisionService = agentDecisionService;
        this.planValidationService = planValidationService;
        this.executionOrchestrator = executionOrchestrator;
        this.resultSynthesisService = resultSynthesisService;
    }

    @Autowired(required = false)
    @Lazy
    public void setToolExecutionBridge(ToolExecutionBridge toolExecutionBridge) {
        this.toolExecutionBridge = toolExecutionBridge;
        if (toolExecutionBridge != null) {
            log.info("ToolExecutionBridge wired: {} agent-utils callbacks available",
                    toolExecutionBridge.getCallbackMap().size());
        }
    }

    @Autowired(required = false)
    public void setMemoryToolsFactory(MemoryToolsFactory memoryToolsFactory) {
        this.memoryToolsFactory = memoryToolsFactory;
        if (memoryToolsFactory != null) {
            log.info("MemoryToolsFactory wired – per-user memory isolation enabled");
        }
    }

    @PostConstruct
    public void init() {
        if (mockEnabled) {
            log.info("Mock mode enabled - using simulated responses");
        } else if (openaiApiKey != null && !openaiApiKey.isEmpty()) {
            String configuredModel = resolveConfiguredModel();
            Double configuredTemperature = resolveConfiguredTemperature();
            OpenAiChatOptions options = OpenAiChatOptions.builder()
                    .model(configuredModel)
                    .temperature(configuredTemperature)
                    .maxTokens(maxTokens)
                    .build();

            OpenAIOkHttpClient.Builder clientBuilder =
                    OpenAIOkHttpClient.builder()
                            .apiKey(openaiApiKey);
            OpenAIOkHttpClientAsync.Builder asyncClientBuilder =
                    OpenAIOkHttpClientAsync.builder()
                            .apiKey(openaiApiKey);
            if (openaiBaseUrl != null && !openaiBaseUrl.isEmpty()) {
                clientBuilder.baseUrl(openaiBaseUrl);
                asyncClientBuilder.baseUrl(openaiBaseUrl);
                log.info("Using custom OpenAI base URL: {}", openaiBaseUrl);
            }
            OpenAIClient openAiClient = clientBuilder.build();
            OpenAIClientAsync openAiAsyncClient = asyncClientBuilder.build();

            OpenAiChatModel openAiChatModel = OpenAiChatModel.builder()
                    .openAiClient(openAiClient)
                    .openAiClientAsync(openAiAsyncClient)
                    .options(options)
                    .build();

            this.chatModel = openAiChatModel;
            this.streamingChatModel = openAiChatModel;

            log.info("Initialized OpenAI chat model with model: {}", configuredModel);
        } else {
            log.warn("OpenAI API key not configured. Chat functionality will be limited.");
        }

        if (agentDecisionService == null && chatModel != null) {
            agentDecisionService = new AgentDecisionService(chatModel, new AgentDecisionPromptFactory());
        }
        if (planValidationService == null && policyEvaluator != null) {
            planValidationService = new PlanValidationService(policyEvaluator);
        }
        if (resultSynthesisService == null) {
            resultSynthesisService = chatModel == null
                    ? new ResultSynthesisService()
                    : new ResultSynthesisService(chatModel, streamingChatModel, new ResultSynthesisPromptFactory());
        }

        if (memoryEnabled) {
            loadMemorySystemPrompt();
        }
    }

    private void loadMemorySystemPrompt() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource resource = resolver.getResource("classpath:prompt/AUTO_MEMORY_TOOLS_SYSTEM_PROMPT.md");
            if (resource != null && resource.exists()) {
                String template = new String(resource.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
                String memoriesRootDir = Path.of(memoryDirectory).toAbsolutePath().toString();
                String basePrompt = template.replace("{MEMORIES_ROOT_DIERCTORY}", memoriesRootDir);
                this.memorySystemPrompt = basePrompt + """

                Important: Memory is per-user and auto-isolated. You are
                currently operating in a user-specific sandbox. All memory
                operations affect only this user's memory — other users
                cannot see this user's memories and this user cannot see
                theirs.""";
                log.info("Loaded AutoMemoryTools system prompt ({} chars)", memorySystemPrompt.length());
            } else {
                log.warn("AUTO_MEMORY_TOOLS_SYSTEM_PROMPT.md not found on classpath — memory prompt will be empty");
                this.memorySystemPrompt = "";
            }
        } catch (Exception e) {
            log.warn("Failed to load AutoMemoryTools system prompt from classpath: {}", e.getMessage());
            this.memorySystemPrompt = "";
        }
    }

    @PreDestroy
    void shutdownExecutors() {
        mockExecutor.shutdownNow();
    }

    private String resolveConfiguredModel() {
        return chatModelName != null && !chatModelName.isBlank() ? chatModelName : model;
    }

    private Double resolveConfiguredTemperature() {
        return chatTemperature != null ? chatTemperature : temperature;
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
                UserCapabilityContext.anonymous(),
                null,
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
                UserCapabilityContext.anonymous(),
                null,
                null,
                null,
                history,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
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
                UserCapabilityContext.anonymous(),
                toolContext,
                null,
                null,
                history,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
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
                UserCapabilityContext.anonymous(),
                toolContext,
                frontendTools,
                null,
                history,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
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
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                UserCapabilityContext.anonymous(),
                toolContext,
                frontendTools,
                null,
                history,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                onToolCall,
                onToolResult
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                capabilityContext,
                toolContext,
                frontendTools,
                workspaceContext,
                history,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
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
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                capabilityContext,
                toolContext,
                frontendTools,
                workspaceContext,
                history,
                onNext,
                onError,
                onComplete,
                onExecutionPlan,
                onExecutionStep,
                onToolCall,
                onToolResult,
                true
        );
    }

    /**
     * Process a chat message through the Spring AI tool-calling path without the top-level agentic planner shortcut.
     * This is used by the standalone protocol endpoint so tool execution and frontend resume are always observable
     * through the protocol frame stream.
     */
    public Runnable processProtocolMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        return processProtocolMessageStreamingWithModel(
                conversationId,
                userMessage,
                capabilityContext,
                toolContext,
                frontendTools,
                workspaceContext,
                history,
                null,
                onNext,
                onError,
                onComplete,
                onExecutionPlan,
                onExecutionStep,
                onToolCall,
                onToolResult
        );
    }

    public Runnable processProtocolMessageStreamingWithModel(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            String modelName,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        if (modelName != null && !modelName.isBlank()) {
            MODEL_NAME_OVERRIDE.set(modelName);
        }
        try {
            return processMessageStreaming(
                    conversationId,
                    userMessage,
                    capabilityContext,
                    toolContext,
                    frontendTools,
                    workspaceContext,
                    history,
                    onNext,
                    onError,
                    onComplete,
                    onExecutionPlan,
                    onExecutionStep,
                    onToolCall,
                    onToolResult,
                    false
            );
        } finally {
            MODEL_NAME_OVERRIDE.remove();
        }
    }

    private Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            boolean allowAgenticControlLoop
    ) {
        AtomicBoolean cancelled = new AtomicBoolean(false);
        Map<String, ToolDefinition> availableTools = toolRegistry.resolveTools(capabilityContext);

        // Register per-user memory context for this conversation
        if (memoryToolsFactory != null && capabilityContext != null) {
            conversationUsers.put(conversationId, capabilityContext.getUserId());
        }

        if (allowAgenticControlLoop && shouldUseAgenticControlLoop(toolContext, frontendTools)) {
            executeAgenticControlLoop(
                    userMessage,
                    capabilityContext,
                    workspaceContext,
                    history,
                    availableTools,
                    onNext,
                    onError,
                    onComplete,
                    onExecutionPlan,
                    onExecutionStep,
                    onToolCall,
                    onToolResult,
                    cancelled
            );
            return () -> cancelled.set(true);
        }

        // Mock mode - simulate streaming response
        log.info("[DEBUG] Profile lookup - mockEnabled={}, streamingChatModel={}",
                mockEnabled, streamingChatModel != null ? streamingChatModel.getClass().getSimpleName() : "null");
        if (mockEnabled || streamingChatModel == null) {
            return processMockStreaming(
                    conversationId,
                    userMessage,
                    availableTools,
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
            List<Message> messages = new java.util.ArrayList<>();
            FrontendToolContinuation frontendToolContinuation = parseFrontendToolContinuation(toolContext);
            List<FrontendToolManifestEntry> frontendToolManifest =
                    resolveFrontendToolManifest(conversationId, frontendTools);
            Set<String> blockedFrontendTools = frontendToolContinuation != null
                    ? Set.of(frontendToolContinuation.getToolName())
                    : Set.of();
            boolean useTools = frontendToolContinuation != null
                    || !availableTools.isEmpty()
                    || !frontendToolManifest.isEmpty()
                    || (memoryEnabled && memoryToolsFactory != null);

            if (!frontendToolManifest.isEmpty()) {
                log.debug("Received {} frontend tool manifest entries", frontendToolManifest.size());
            }

            messages.add(new SystemMessage(buildSystemPrompt(useTools ? availableTools : Map.of())));
            log.debug("Processing message for conversation: {} with model={}", conversationId,
                    resolveConfiguredModel());

            if (frontendToolContinuation != null) {
                messages.add(new SystemMessage(buildFrontendToolContinuationPrompt(frontendToolContinuation)));
            }

            if (history != null) {
                for (ChatMessage msg : history) {
                    switch (msg.getRole()) {
                        case USER -> messages.add(new UserMessage(msg.getContent()));
                        case ASSISTANT -> messages.add(new AssistantMessage(msg.getContent()));
                        case TOOL -> messages.add(restoreHistoricalToolMessage(msg));
                        default -> {
                        }
                    }
                }
            }

            if (frontendToolContinuation != null) {
                messages.add(new UserMessage(frontendToolContinuation.getOriginalUserMessage()));
                messages.add(AssistantMessage.builder()
                        .toolCalls(List.of(new AssistantMessage.ToolCall(
                                frontendToolContinuation.getToolCallId(),
                                "function",
                                frontendToolContinuation.getToolName(),
                                writeJson(frontendToolContinuation.getArgs())
                        )))
                        .build());
                messages.add(toolResponseMessage(
                        frontendToolContinuation.getToolCallId(),
                        frontendToolContinuation.getToolName(),
                        writeJson(frontendToolContinuation.getResult())
                ));
                messages.add(new UserMessage(buildFrontendToolContinuationResumePrompt(frontendToolContinuation)));
            } else {
                messages.add(new UserMessage(userMessage));
            }

            log.debug("Processing message for conversation: {}", conversationId);

            List<ToolCallback> requestCallbacks = useTools
                    ? buildToolCallbacks(availableTools, frontendToolManifest, blockedFrontendTools, conversationId)
                    : List.of();
            conversationCallbacks.put(conversationId, requestCallbacks.stream()
                    .collect(java.util.stream.Collectors.toMap(
                            cb -> cb.getToolDefinition().name(),
                            cb -> cb,
                            (a, b) -> a
                    )));

            log.debug("streamConversation - useTools={}, toolSpecs size={}, frontendToolManifest size={}, blockedFrontendTools={}",
            useTools,
            requestCallbacks.size(),
            frontendToolManifest.size(),
            blockedFrontendTools);

            streamConversation(
                    conversationId,
                    userMessage,
                    history,
                    messages,
                    availableTools,
                    requestCallbacks,
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

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
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
                capabilityContext,
                toolContext,
                frontendTools,
                null,
                history,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                onToolCall,
                onToolResult
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
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
                capabilityContext,
                toolContext,
                frontendTools,
                null,
                history,
                onNext,
                onError,
                onComplete
        );
    }

    private boolean shouldUseAgenticControlLoop(String toolContext, String frontendTools) {
        return capabilityResolver != null
                && agentDecisionService != null
                && planValidationService != null
                && resultSynthesisService != null
                && (toolContext == null || toolContext.isBlank());
    }

    private void executeAgenticControlLoop(
            String userMessage,
            UserCapabilityContext capabilityContext,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            Map<String, ToolDefinition> availableTools,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        try {
            List<ResolvedCapability> resolvedCapabilities = capabilityResolver.resolveCapabilities(capabilityContext);
            AgentDecision decision = agentDecisionService.decide(
                    userMessage,
                    history == null ? List.of() : history,
                    resolvedCapabilities,
                    workspaceContext
            );
            log.debug(
                    "Agent decision resolved. type={}, assistantTextPresent={}, planSteps={}",
                    decision == null ? null : decision.decisionType(),
                    decision != null && decision.assistantText() != null && !decision.assistantText().isBlank(),
                    decision == null || decision.plan() == null || decision.plan().steps() == null
                            ? 0
                            : decision.plan().steps().size()
            );
            if (cancelled.get()) {
                return;
            }

            AgentDecisionType decisionType = decision == null || decision.decisionType() == null
                    ? AgentDecisionType.RESPOND
                    : decision.decisionType();

            switch (decisionType) {
                case RESPOND -> streamAssistantReply(
                        decision == null ? null : decision.assistantText(),
                        onNext,
                        onError,
                        onComplete,
                        cancelled
                );
                case CLARIFY -> streamAssistantReply(
                        resolveClarificationText(decision),
                        onNext,
                        onError,
                        onComplete,
                        cancelled
                );
                case PLAN -> executePlannedDecision(
                        userMessage,
                        capabilityContext,
                        decision,
                        resolvedCapabilities,
                        availableTools,
                        onNext,
                        onError,
                        onComplete,
                        onExecutionPlan,
                        onExecutionStep,
                        onToolCall,
                        onToolResult,
                        cancelled
                );
            }
        } catch (Exception exception) {
            log.error("Error executing agentic control loop", exception);
            onError.accept(exception);
        }
    }

    private void executePlannedDecision(
            String userMessage,
            UserCapabilityContext capabilityContext,
            AgentDecision decision,
            List<ResolvedCapability> resolvedCapabilities,
            Map<String, ToolDefinition> availableTools,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        Runnable validateAndExecute = () -> {
            PlanValidationService.PlanValidationResult validationResult = planValidationService.validate(
                    decision,
                    resolvedCapabilities,
                    capabilityContext
            );
            log.debug(
                    "Plan validation result. valid={}, reviewRequired={}, message={}, decisionPlan={}",
                    validationResult.valid(),
                    validationResult.reviewRequired(),
                    validationResult.assistantMessage(),
                    decision == null ? null : decision.plan()
            );
            if (!validationResult.valid()) {
                streamAssistantReply(
                        validationResult.assistantMessage(),
                        onNext,
                        onError,
                        onComplete,
                        cancelled
                );
                return;
            }
            if (validationResult.reviewRequired()) {
                streamAssistantReply(
                        "This request requires approval before execution.",
                        onNext,
                        onError,
                        onComplete,
                        cancelled
                );
                return;
            }

            ValidatedExecutionPlan validatedPlan = validationResult.validatedPlan();
            String planId = UUID.randomUUID().toString();
            onExecutionPlan.accept(ExecutionPlanEvent.builder()
                    .planId(planId)
                    .summary(resolvePlanSummary(decision, validatedPlan))
                    .status("running")
                    .totalSteps(validatedPlan.steps().size())
                    .build());

            for (int index = 0; index < validatedPlan.steps().size(); index++) {
                ValidatedExecutionStep step = validatedPlan.steps().get(index);
                onExecutionStep.accept(ExecutionStepEvent.builder()
                        .planId(planId)
                        .stepId("step-" + (index + 1))
                        .targetName(step.capability().getTargetName())
                        .summary(resolveStepSummary(step))
                        .stepType(step.capability().getExecutionType())
                        .status("running")
                        .build());
            }

            ExecutionTranscript transcript = resolveExecutionOrchestrator(availableTools, capabilityContext).execute(
                    validatedPlan,
                    onToolCall,
                    onToolResult
            );
            if (cancelled.get()) {
                return;
            }

            boolean failed = false;
            for (int index = 0; index < transcript.plan().steps().size(); index++) {
                ToolResult toolResult = transcript.toolResults().get(index);
                ValidatedExecutionStep step = transcript.plan().steps().get(index);
                String status = toolResult.getError() == null ? "completed" : "failed";
                onExecutionStep.accept(ExecutionStepEvent.builder()
                        .planId(planId)
                        .stepId("step-" + (index + 1))
                        .targetName(step.capability().getTargetName())
                        .summary(resolveStepSummary(step))
                        .stepType(step.capability().getExecutionType())
                        .status(status)
                        .build());
                if (toolResult.getError() != null) {
                    failed = true;
                }
            }

            onExecutionPlan.accept(ExecutionPlanEvent.builder()
                    .planId(planId)
                    .summary(resolvePlanSummary(decision, validatedPlan))
                    .status(failed ? "failed" : "completed")
                    .totalSteps(validatedPlan.steps().size())
                    .build());

            resultSynthesisService.synthesizeStreaming(
                    userMessage,
                    decision,
                    transcript,
                    token -> {
                        if (!cancelled.get()) {
                            onNext.accept(token);
                        }
                    },
                    onError,
                    () -> {
                        if (!cancelled.get()) {
                            onComplete.run();
                        }
                    }
            );
        };

        if (decision != null && decision.assistantText() != null && !decision.assistantText().isBlank()) {
            streamAssistantReply(
                    decision.assistantText(),
                    onNext,
                    onError,
                    validateAndExecute,
                    cancelled
            );
            return;
        }

        validateAndExecute.run();
    }

    private ExecutionOrchestrator resolveExecutionOrchestrator(
            Map<String, ToolDefinition> availableTools,
            UserCapabilityContext capabilityContext
    ) {
        if (executionOrchestrator != null) {
            return executionOrchestrator;
        }

        return new ExecutionOrchestrator((capability, arguments) -> executeCapabilityWithEnrichment(
                availableTools,
                capability,
                arguments,
                capabilityContext
        ));
    }

    private Object executeCapabilityWithEnrichment(
            Map<String, ToolDefinition> availableTools,
            ResolvedCapability capability,
            Map<String, Object> arguments,
            UserCapabilityContext capabilityContext
    ) {
        return executeCapability(availableTools, capability, arguments);
    }

    private Object executeCapability(
            Map<String, ToolDefinition> availableTools,
            ResolvedCapability capability,
            Map<String, Object> arguments
    ) {
        ToolDefinition toolDefinition = availableTools.get(capability.getTargetName());
        if (toolDefinition == null) {
            throw new IllegalArgumentException("Planned tool not available: " + capability.getTargetName());
        }

        try {
            return toolDefinition.execute(arguments).join();
        } catch (CompletionException exception) {
            Throwable cause = exception.getCause();
            if (cause instanceof RuntimeException runtimeException) {
                throw runtimeException;
            }
            throw new IllegalStateException("Tool execution failed.", cause == null ? exception : cause);
        }
    }

    private String resolveClarificationText(AgentDecision decision) {
        if (decision == null) {
            return null;
        }
        if (decision.clarificationQuestion() != null && !decision.clarificationQuestion().isBlank()) {
            return decision.clarificationQuestion();
        }
        return decision.assistantText();
    }

    private String resolvePlanSummary(AgentDecision decision, ValidatedExecutionPlan validatedPlan) {
        if (decision != null && decision.assistantText() != null && !decision.assistantText().isBlank()) {
            return decision.assistantText();
        }
        return "Execute " + validatedPlan.steps().size() + " capability step(s).";
    }

    private String resolveStepSummary(ValidatedExecutionStep step) {
        return "Execute " + step.capability().getTargetName() + ".";
    }

    private void emitAssistantText(
            String text,
            java.util.function.Consumer<String> onNext
    ) {
        if (text == null || text.isBlank()) {
            return;
        }
        onNext.accept(text);
    }

    private void streamAssistantReply(
            String draftedReply,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            Runnable onComplete,
            AtomicBoolean cancelled
    ) {
        if (draftedReply == null || draftedReply.isBlank()) {
            onComplete.run();
            return;
        }
        if (streamingChatModel == null) {
            emitAssistantText(draftedReply, onNext);
            onComplete.run();
            return;
        }

        StringBuilder streamedText = new StringBuilder();
        try {
            streamingChatModel.stream(new Prompt(
                    List.of(
                            new SystemMessage(STREAMED_ASSISTANT_TEXT_REQUEST),
                            new UserMessage("Draft reply:\n" + draftedReply)
                    ),
                    createBaseChatOptions()
            )).subscribe(
                    response -> {
                        if (cancelled.get()) {
                            return;
                        }
                        String token = assistantText(response);
                        if (token == null || token.isEmpty()) {
                            return;
                        }
                        streamedText.append(token);
                        onNext.accept(token);
                    },
                    onError,
                    () -> {
                        if (!cancelled.get()) {
                            onComplete.run();
                        }
                    }
            );
        } catch (Exception exception) {
            onError.accept(exception);
        }
    }

    private void emitRemainingAssistantText(
            String fullText,
            String streamedText,
            java.util.function.Consumer<String> onNext
    ) {
        if (fullText == null || fullText.isBlank()) {
            return;
        }
        String streamedPrefix = streamedText == null ? "" : streamedText;
        if (fullText.startsWith(streamedPrefix)) {
            String suffix = fullText.substring(streamedPrefix.length());
            if (!suffix.isEmpty()) {
                onNext.accept(suffix);
            }
            return;
        }
        if (streamedPrefix.isBlank()) {
            onNext.accept(fullText);
        }
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
        log.debug("resolveFrontendToolManifest - conversationId={}, frontendTools input length={}",
                conversationId, frontendTools != null ? frontendTools.length() : 0);
        List<FrontendToolManifestEntry> parsedManifest = parseFrontendToolManifest(frontendTools);
        log.debug("Frontend tools parsed: {}", parsedManifest.stream()
                .map(FrontendToolManifestEntry::getName).toList());
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
            List<ChatMessage> history,
            List<Message> messages,
            Map<String, ToolDefinition> availableTools,
            List<ToolCallback> toolCallbacks,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedToolNames,
            String turnPhase,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        StringBuilder streamedAssistantText = new StringBuilder();
        // Buffer text during initial phase to detect AskUserQuestionTool calls.
        // When AskUserQuestionTool is called, the model generates unreliable
        // placeholder text (e.g. "tool not available") alongside its tool call.
        // We suppress that initial text and let the tool-loop phase generate
        // the real answer.
        StringBuilder initialTextBuffer = new StringBuilder();
        // Accumulate tool calls across streaming chunks — the model may send
        // tool-call deltas (id/name in one chunk, arguments in later chunks).
        Map<String, String> accumulatedToolCallNames = new LinkedHashMap<>();
        Map<String, String> accumulatedToolCallTypes = new LinkedHashMap<>();
        Map<String, StringBuilder> accumulatedToolCallArgs = new LinkedHashMap<>();

        Prompt prompt = buildPrompt(messages, toolCallbacks);
        Disposable ignored = streamingChatModel.stream(prompt).subscribe(
                response -> {
                    if (cancelled.get()) {
                        return;
                    }
                    AssistantMessage assistantMessage = assistantMessage(response);
                    if (assistantMessage == null) {
                        return;
                    }
                    if (assistantMessage.hasToolCalls()) {
                        for (AssistantMessage.ToolCall tc : assistantMessage.getToolCalls()) {
                            if (tc.id() == null) {
                                continue;
                            }
                            accumulatedToolCallNames.putIfAbsent(tc.id(), tc.name());
                            accumulatedToolCallTypes.putIfAbsent(tc.id(), tc.type());
                            accumulatedToolCallArgs
                                    .computeIfAbsent(tc.id(), k -> new StringBuilder())
                                    .append(tc.arguments() != null ? tc.arguments() : "");
                        }
                    }
                    String token = assistantMessage.getText();
                    if (token != null && !token.isEmpty()) {
                        if ("initial".equals(turnPhase)) {
                            // Buffer initial phase text — may be suppressed if
                            // AskUserQuestionTool is detected at completion.
                            initialTextBuffer.append(token);
                        } else {
                            streamedAssistantText.append(token);
                            onNext.accept(token);
                        }
                    }
                },
                error -> {
                    if (cancelled.get()) {
                        return;
                    }
                    log.error("Error in streaming response", error);
                    onError.accept(error);
                },
                () -> {
                    if (cancelled.get()) {
                        return;
                    }

                    boolean hasToolCalls = !accumulatedToolCallNames.isEmpty();

                    // Flush or suppress buffered initial-phase text
                    if ("initial".equals(turnPhase) && initialTextBuffer.length() > 0) {
                        boolean askUserTool = hasToolCalls && accumulatedToolCallNames.values().stream()
                                .anyMatch(name -> name.contains("AskUserQuestion"));
                        if (askUserTool) {
                            log.debug("Suppressed {} chars of initial text for AskUserQuestionTool",
                                    initialTextBuffer.length());
                        } else {
                            String buffered = initialTextBuffer.toString();
                            onNext.accept(buffered);
                            streamedAssistantText.append(buffered);
                        }
                    }

                    if (hasToolCalls) {
                        List<AssistantMessage.ToolCall> mergedCalls = accumulatedToolCallNames.keySet().stream()
                                .map(id -> new AssistantMessage.ToolCall(
                                        id,
                                        accumulatedToolCallTypes.getOrDefault(id, "function"),
                                        accumulatedToolCallNames.get(id),
                                        accumulatedToolCallArgs.getOrDefault(id, new StringBuilder()).toString()))
                                .toList();
                        AssistantMessage finalAssistantMessage = AssistantMessage.builder()
                                .content(streamedAssistantText.toString())
                                .toolCalls(mergedCalls)
                                .build();

                        emitRemainingAssistantText(finalAssistantMessage, streamedAssistantText, onNext);
                        logAssistantTurnDiagnostics(
                                conversationId,
                                buildAssistantTurnDiagnostics(turnPhase, finalAssistantMessage, streamedAssistantText.toString())
                        );
                        List<Message> continuedMessages = new java.util.ArrayList<>(messages);
                        continuedMessages.add(finalAssistantMessage);
                        continueWithToolRequests(
                                conversationId,
                                userMessage,
                                history,
                                continuedMessages,
                                availableTools,
                                finalAssistantMessage.getToolCalls(),
                                frontendToolManifest,
                                blockedToolNames,
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

                    if (!streamedAssistantText.isEmpty()) {
                        logAssistantTurnDiagnostics(
                                conversationId,
                                buildAssistantTurnDiagnostics(
                                        turnPhase,
                                        AssistantMessage.builder().content(streamedAssistantText.toString()).build(),
                                        streamedAssistantText.toString())
                        );
                    }

                    log.debug("Completed streaming response for conversation: {}", conversationId);
                    onComplete.run();
                }
        );
    }

    private void emitRemainingAssistantText(
            AssistantMessage assistantMessage,
            StringBuilder streamedAssistantText,
            java.util.function.Consumer<String> onNext
    ) {
        String assistantText = assistantMessage.getText();
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
            List<ChatMessage> history,
            List<Message> messages,
            Map<String, ToolDefinition> availableTools,
            List<AssistantMessage.ToolCall> toolExecutionRequests,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedToolNames,
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

            List<ToolCallback> loopCallbacks = buildToolCallbacks(
                    availableTools, frontendToolManifest, blockedToolNames, conversationId);
            conversationCallbacks.put(conversationId, loopCallbacks.stream()
                    .collect(java.util.stream.Collectors.toMap(
                            cb -> cb.getToolDefinition().name(),
                            cb -> cb,
                            (a, b) -> a
                    )));
            streamConversation(
                    conversationId,
                    userMessage,
                    history,
                    messages,
                    availableTools,
                    loopCallbacks,
                    frontendToolManifest,
                    blockedToolNames,
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

        AssistantMessage.ToolCall toolExecutionRequest = toolExecutionRequests.get(index);
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

        ToolDefinition toolDefinition = availableTools.get(toolExecutionRequest.name());
        if (toolDefinition == null) {
            if (toolExecutionBridge != null && toolExecutionBridge.hasCallback(toolExecutionRequest.name())) {
                executeAgentUtilsCallback(
                        conversationId, userMessage, history, messages, availableTools,
                        toolExecutionRequests, frontendToolManifest, blockedToolNames,
                        index, continueAfterToolLoop, toolExecutionRequest, arguments,
                        onNext, onError, onComplete, onToolCall, onToolResult, cancelled
                );
                return;
            }
            // Fallback: check per-user AutoMemoryTools tools
            if (memoryToolsFactory != null) {
                String userId = conversationUsers.get(conversationId);
                if (userId != null) {
                    AutoMemoryTools userMemoryTools = memoryToolsFactory.forUser(userId);
                    ToolCallback memoryCallback = resolveMemoryToolCallback(
                            userMemoryTools, toolExecutionRequest.name());
                    if (memoryCallback != null) {
                        executeMemoryToolCallback(
                                toolExecutionRequest, arguments, memoryCallback,
                                conversationId, userMessage, history, messages, availableTools,
                                toolExecutionRequests, frontendToolManifest, blockedToolNames,
                                index, continueAfterToolLoop,
                                onNext, onError, onComplete, onToolCall, onToolResult, cancelled
                        );
                        return;
                    }
                }
            }
            onError.accept(new IllegalArgumentException("Tool not available for current user: " + toolExecutionRequest.name()));
            return;
        }

        boolean requiresConfirmation = toolDefinition.requiresConfirmation();
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
            pendingToolExecutions.put(
                    pendingKey(conversationId, toolExecutionRequest.id()),
                    pendingToolExecution(
                            () -> onToolCall.accept(ToolCall.builder()
                                    .id(toolExecutionRequest.id())
                                    .name(toolExecutionRequest.name())
                                    .arguments(arguments)
                                    .status(ToolCall.ToolStatus.RUNNING)
                                    .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                                    .requiresConfirmation(true)
                                    .build()),
                            () -> executeConfirmedToolRequest(
                                    conversationId,
                                    userMessage,
                                    history,
                                    messages,
                                    availableTools,
                                    toolExecutionRequests,
                                    frontendToolManifest,
                                    blockedToolNames,
                                    index,
                                    continueAfterToolLoop,
                                    toolExecutionRequest,
                                    arguments,
                                    onNext,
                                    onError,
                                    onComplete,
                                    onToolCall,
                                    onToolResult,
                                    cancelled
                            ),
                            () -> {
                                onToolResult.accept(ToolResult.builder()
                                        .toolCallId(toolExecutionRequest.id())
                                        .error("Tool execution cancelled by user.")
                                        .build());
                                onComplete.run();
                            }
                    )
            );
            return;
        }

        executeConfirmedToolRequest(
                conversationId,
                userMessage,
                history,
                messages,
                availableTools,
                toolExecutionRequests,
                frontendToolManifest,
                blockedToolNames,
                index,
                continueAfterToolLoop,
                toolExecutionRequest,
                arguments,
                onNext,
                onError,
                onComplete,
                onToolCall,
                onToolResult,
                cancelled
        );
    }

    private void executeConfirmedToolRequest(
            String conversationId,
            String userMessage,
            List<ChatMessage> history,
            List<Message> messages,
            Map<String, ToolDefinition> availableTools,
            List<AssistantMessage.ToolCall> toolExecutionRequests,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedToolNames,
            int index,
            boolean continueAfterToolLoop,
            AssistantMessage.ToolCall toolExecutionRequest,
            Map<String, Object> arguments,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        ToolDefinition toolDefinition = availableTools.get(toolExecutionRequest.name());
        if (toolDefinition == null) {
            onToolResult.accept(ToolResult.builder()
                    .toolCallId(toolExecutionRequest.id())
                    .error("Tool is no longer available for execution.")
                    .build());
            onComplete.run();
            return;
        }

        toolDefinition.execute(arguments)
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

                    List<Message> continuedMessages = new java.util.ArrayList<>(messages);
                    continuedMessages.add(toolResponseMessage(
                            toolExecutionRequest.id(),
                            toolExecutionRequest.name(),
                            serializeToolResult(result, error)
                    ));
                    Set<String> nextBlockedToolNames = new java.util.LinkedHashSet<>(blockedToolNames);
                    nextBlockedToolNames.add(toolExecutionRequest.name());

                    continueWithToolRequests(
                            conversationId,
                            userMessage,
                            history,
                            continuedMessages,
                            availableTools,
                            toolExecutionRequests,
                            frontendToolManifest,
                            Set.copyOf(nextBlockedToolNames),
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

    /**
     * Execute a tool callback from the agent-utils bridge (e.g. SkillsTool, TaskTool, WebFetch).
     * Errors and timeouts are serialized as tool results so the model can recover, rather than
     * ending the turn.
     */
    private void executeAgentUtilsCallback(
            String conversationId,
            String userMessage,
            List<ChatMessage> history,
            List<Message> messages,
            Map<String, ToolDefinition> availableTools,
            List<AssistantMessage.ToolCall> toolExecutionRequests,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedToolNames,
            int index,
            boolean continueAfterToolLoop,
            AssistantMessage.ToolCall toolExecutionRequest,
            Map<String, Object> arguments,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        ToolCallback callback = toolExecutionBridge.getCallback(toolExecutionRequest.name());
        if (callback == null) {
            onToolResult.accept(ToolResult.builder()
                    .toolCallId(toolExecutionRequest.id())
                    .error("Agent-utils tool no longer available: " + toolExecutionRequest.name())
                    .build());
            onComplete.run();
            return;
        }

        onToolCall.accept(ToolCall.builder()
                .id(toolExecutionRequest.id())
                .name(toolExecutionRequest.name())
                .arguments(arguments)
                .status(ToolCall.ToolStatus.RUNNING)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build());

        CompletableFuture<String> future = CompletableFuture
                .supplyAsync(() -> {
                    try {
                        toolExecutionBridge.beforeCallbackExecution(
                                toolExecutionRequest.name(),
                                toolExecutionRequest.id()
                        );
                        String jsonArgs = objectMapper.writeValueAsString(arguments);
                        return callback.call(jsonArgs);
                    } catch (Exception e) {
                        throw new CompletionException(e);
                    } finally {
                        toolExecutionBridge.afterCallbackExecution(toolExecutionRequest.name());
                    }
                });

        CompletableFuture<String> executionFuture = toolExecutionBridge.waitsForUserAnswer(toolExecutionRequest.name())
                ? future
                : future.orTimeout(30, java.util.concurrent.TimeUnit.SECONDS);

        executionFuture.whenComplete((result, error) -> {
            if (cancelled.get()) {
                return;
            }

            Throwable actualError = error;
            if (error instanceof java.util.concurrent.TimeoutException) {
                log.warn("Agent-utils tool '{}' timed out after 30s", toolExecutionRequest.name());
                actualError = new RuntimeException("Tool execution timed out after 30 seconds");
            } else if (error instanceof CompletionException ce) {
                actualError = ce.getCause() != null ? ce.getCause() : ce;
            }

            ToolResult toolResult = ToolResult.builder()
                    .toolCallId(toolExecutionRequest.id())
                    .result(actualError == null ? result : null)
                    .error(actualError != null ? actualError.getMessage() : null)
                    .build();
            onToolResult.accept(toolResult);

            List<Message> continuedMessages = new java.util.ArrayList<>(messages);
            continuedMessages.add(toolResponseMessage(
                    toolExecutionRequest.id(),
                    toolExecutionRequest.name(),
                    actualError != null ? serializeToolResult(null, actualError) : result
            ));
            Set<String> nextBlockedToolNames = new java.util.LinkedHashSet<>(blockedToolNames);
            nextBlockedToolNames.add(toolExecutionRequest.name());

            continueWithToolRequests(
                    conversationId, userMessage, history, continuedMessages,
                    availableTools, toolExecutionRequests, frontendToolManifest,
                    Set.copyOf(nextBlockedToolNames), index + 1, continueAfterToolLoop,
                    onNext, onError, onComplete, onToolCall, onToolResult, cancelled
            );
        });
    }

    /**
     * Execute a per-request tool callback (e.g. AutoMemoryTools) directly.
     * Unlike agent-utils callbacks, these do not go through the ToolExecutionBridge
     * — they are dynamically created per-user and stored in conversationCallbacks.
     */
    private void executeMemoryToolCallback(
            AssistantMessage.ToolCall toolExecutionRequest,
            Map<String, Object> arguments,
            ToolCallback callback,
            String conversationId,
            String userMessage,
            List<ChatMessage> history,
            List<Message> messages,
            Map<String, ToolDefinition> availableTools,
            List<AssistantMessage.ToolCall> toolExecutionRequests,
            List<FrontendToolManifestEntry> frontendToolManifest,
            Set<String> blockedToolNames,
            int index,
            boolean continueAfterToolLoop,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            AtomicBoolean cancelled
    ) {
        onToolCall.accept(ToolCall.builder()
                .id(toolExecutionRequest.id())
                .name(toolExecutionRequest.name())
                .arguments(arguments)
                .status(ToolCall.ToolStatus.RUNNING)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build());

        CompletableFuture.supplyAsync(() -> {
            try {
                return callback.call(objectMapper.writeValueAsString(arguments));
            } catch (Exception e) {
                throw new CompletionException(e);
            }
        }).thenAccept(result -> {
            if (cancelled.get()) return;
            String resultStr = result != null ? result.toString() : "ok";
            onToolResult.accept(ToolResult.builder()
                    .toolCallId(toolExecutionRequest.id())
                    .result(resultStr)
                    .build());
            List<Message> continuedMessages = new java.util.ArrayList<>(messages);
            continuedMessages.add(toolResponseMessage(
                    toolExecutionRequest.id(),
                    toolExecutionRequest.name(),
                    resultStr
            ));
            Set<String> nextBlocked = new java.util.LinkedHashSet<>(blockedToolNames);
            nextBlocked.add(toolExecutionRequest.name());
            continueWithToolRequests(
                    conversationId, userMessage, history, continuedMessages,
                    availableTools, toolExecutionRequests, frontendToolManifest,
                    Set.copyOf(nextBlocked), index + 1, continueAfterToolLoop,
                    onNext, onError, onComplete, onToolCall, onToolResult, cancelled
            );
        }).exceptionally(error -> {
            onToolResult.accept(ToolResult.builder()
                    .toolCallId(toolExecutionRequest.id())
                    .error(error.getCause() != null ? error.getCause().getMessage() : error.getMessage())
                    .build());
            onComplete.run();
            return null;
        });
    }

    private ToolCallback resolveMemoryToolCallback(AutoMemoryTools userMemoryTools, String toolName) {
        for (ToolCallback cb : buildMemoryToolCallbacks(userMemoryTools)) {
            if (cb.getToolDefinition().name().equals(toolName)) {
                return cb;
            }
        }
        return null;
    }

    List<ToolCallback> buildMemoryToolCallbacks(AutoMemoryTools userMemoryTools) {
        return List.of(
                memoryToolCallback(
                        "MemoryView",
                        "View a memory file with line numbers or list a memory directory.",
                        MEMORY_VIEW_SCHEMA,
                        args -> userMemoryTools.memoryView(
                                argumentString(args, "path"),
                                argumentString(args, "viewRange")
                        )
                ),
                memoryToolCallback(
                        "MemoryCreate",
                        "Create a new file in the persistent memory store.",
                        MEMORY_CREATE_SCHEMA,
                        args -> userMemoryTools.memoryCreate(
                                argumentString(args, "path"),
                                argumentString(args, "fileText")
                        )
                ),
                memoryToolCallback(
                        "MemoryStrReplace",
                        "Replace an exact string in an existing memory file.",
                        MEMORY_STR_REPLACE_SCHEMA,
                        args -> userMemoryTools.memoryStrReplace(
                                argumentString(args, "path"),
                                argumentString(args, "oldStr"),
                                argumentString(args, "newStr")
                        )
                ),
                memoryToolCallback(
                        "MemoryInsert",
                        "Insert text at a specific line number in an existing memory file.",
                        MEMORY_INSERT_SCHEMA,
                        args -> userMemoryTools.memoryInsert(
                                argumentString(args, "path"),
                                argumentInteger(args, "insertLine"),
                                argumentString(args, "insertText")
                        )
                ),
                memoryToolCallback(
                        "MemoryDelete",
                        "Delete a file or directory from the persistent memory store.",
                        MEMORY_DELETE_SCHEMA,
                        args -> userMemoryTools.memoryDelete(argumentString(args, "path"))
                ),
                memoryToolCallback(
                        "MemoryRename",
                        "Rename or move a file or directory within the persistent memory store.",
                        MEMORY_RENAME_SCHEMA,
                        args -> userMemoryTools.memoryRename(
                                argumentString(args, "oldPath"),
                                argumentString(args, "newPath")
                        )
                )
        );
    }

    private ToolCallback memoryToolCallback(
            String name,
            String description,
            String inputSchema,
            Function<Map<String, Object>, String> callback
    ) {
        return FunctionToolCallback.<Map<String, Object>, String>builder(name, callback)
                .description(description)
                .inputSchema(inputSchema)
                .inputType(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .build();
    }

    private static String argumentString(Map<String, Object> args, String name) {
        Object value = args.get(name);
        return value == null ? null : value.toString();
    }

    private static Integer argumentInteger(Map<String, Object> args, String name) {
        Object value = args.get(name);
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }
        String stringValue = value.toString();
        return stringValue.isBlank() ? null : Integer.valueOf(stringValue);
    }

    private List<ToolCallback> buildToolCallbacks(
            Map<String, ToolDefinition> tools,
            List<FrontendToolManifestEntry> frontendTools,
            Set<String> blockedToolNames,
            String conversationId
    ) {
        Map<String, ToolCallback> uniqueCallbacks = new java.util.LinkedHashMap<>();

        tools.values().stream()
                .filter(toolDefinition -> !blockedToolNames.contains(toolDefinition.getName()))
                .map(this::toToolCallback)
                .forEach(toolCallback -> uniqueCallbacks.put(toolCallback.getToolDefinition().name(), toolCallback));

        frontendTools.stream()
                .filter(frontendTool -> !blockedToolNames.contains(frontendTool.getName()))
                .map(this::toToolCallback)
                .forEach(toolCallback -> uniqueCallbacks.putIfAbsent(
                        toolCallback.getToolDefinition().name(),
                        toolCallback
                ));

        if (toolExecutionBridge != null) {
            for (var entry : toolExecutionBridge.getCallbackMap().entrySet()) {
                String name = entry.getKey();
                if (!blockedToolNames.contains(name)) {
                    uniqueCallbacks.putIfAbsent(name, toSchemaOnlyCallback(entry.getValue()));
                }
            }
        }

        // Add per-user memory tool callbacks (AutoMemoryTools)
        if (memoryToolsFactory != null) {
            String userId = conversationUsers.get(conversationId);
            if (userId != null) {
                AutoMemoryTools userMemoryTools = memoryToolsFactory.forUser(userId);
                for (ToolCallback cb : buildMemoryToolCallbacks(userMemoryTools)) {
                    String name = cb.getToolDefinition().name();
                    if (!blockedToolNames.contains(name)) {
                        uniqueCallbacks.putIfAbsent(name, cb);
                    }
                }
            }
        }

        return List.copyOf(uniqueCallbacks.values());
    }

    private ToolCallback toToolCallback(ToolDefinition toolDefinition) {
        return FunctionToolCallback.<Map<String, Object>, Object>builder(
                        toolDefinition.getName(),
                        arguments -> {
                            throw new UnsupportedOperationException(
                                    "Internal tool execution is disabled for manual protocol control"
                            );
                        }
                )
                .description(toolDefinition.getDescription())
                .inputSchema(writeJson(toolDefinition.getParameters()))
                .inputType(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .build();
    }

    private ToolCallback toToolCallback(FrontendToolManifestEntry frontendTool) {
        return FunctionToolCallback.<Map<String, Object>, Object>builder(
                        frontendTool.getName(),
                        arguments -> {
                            throw new UnsupportedOperationException(
                                    "Frontend tools are surfaced to the model but executed by the client"
                            );
                        }
                )
                .description(frontendTool.getDescription())
                .inputSchema(writeJson(
                        frontendTool.getInputSchema() == null ? Map.of("type", "object") : frontendTool.getInputSchema()
                ))
                .inputType(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .build();
    }

    private ToolCallback toSchemaOnlyCallback(org.springframework.ai.tool.ToolCallback bridgeCallback) {
        var td = bridgeCallback.getToolDefinition();
        return FunctionToolCallback.<Map<String, Object>, Object>builder(
                        td.name(),
                        args -> {
                            throw new UnsupportedOperationException(
                                    "Agent-utils tools are executed via the bridge, not directly"
                            );
                        }
                )
                .description(td.description())
                .inputSchema(td.inputSchema())
                .inputType(new ParameterizedTypeReference<Map<String, Object>>() {
                })
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

    private Prompt buildPrompt(List<Message> messages, List<ToolCallback> toolCallbacks) {
        String modelName = MODEL_NAME_OVERRIDE.get();
        String effectiveModel = modelName != null && !modelName.isBlank() ? modelName : resolveConfiguredModel();
        Double effectiveTemperature = resolveConfiguredTemperature();
        OpenAiChatOptions.Builder optionsBuilder = OpenAiChatOptions.builder()
                .model(effectiveModel)
                .temperature(effectiveTemperature)
                .maxTokens(maxTokens);
        if (!toolCallbacks.isEmpty()) {
            optionsBuilder.toolCallbacks(toolCallbacks);
            optionsBuilder.internalToolExecutionEnabled(false);
        }
        return new Prompt(messages, optionsBuilder.build());
    }

    private OpenAiChatOptions createBaseChatOptions() {
        return OpenAiChatOptions.builder()
                .model(model)
                .temperature(temperature)
                .maxTokens(maxTokens)
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

    private Map<String, Object> buildAssistantTurnDiagnostics(
            String turnPhase,
            AssistantMessage assistantMessage,
            String visibleAssistantText
    ) {
        List<String> toolNames = assistantMessage.getToolCalls() == null
                ? List.of()
                : assistantMessage.getToolCalls().stream()
                .map(AssistantMessage.ToolCall::name)
                .filter(Objects::nonNull)
                .toList();

        boolean hasToolRequests = !toolNames.isEmpty();
        boolean hasVisibleText = (visibleAssistantText != null && !visibleAssistantText.isBlank())
                || (assistantMessage.getText() != null && !assistantMessage.getText().isBlank());
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

    private AssistantMessage assistantMessage(ChatResponse response) {
        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            return null;
        }
        return response.getResults().get(0).getOutput();
    }

    private String assistantText(ChatResponse response) {
        AssistantMessage assistantMessage = assistantMessage(response);
        return assistantMessage == null ? null : assistantMessage.getText();
    }

    private ToolResponseMessage toolResponseMessage(String toolCallId, String toolName, String responseData) {
        return ToolResponseMessage.builder()
                .responses(List.of(new ToolResponseMessage.ToolResponse(toolCallId, toolName, responseData)))
                .build();
    }

    private Message restoreHistoricalToolMessage(ChatMessage message) {
        Map<String, Object> payload = parseToolArguments(message.getContent());
        String toolCallId = String.valueOf(payload.getOrDefault("toolCallId", UUID.randomUUID().toString()));
        String toolName = String.valueOf(payload.getOrDefault("toolName", "historical_tool"));
        Object result = payload.containsKey("result") ? payload.get("result") : payload;
        return toolResponseMessage(toolCallId, toolName, writeJson(result));
    }

    /**
     * Simulate a streaming response for mock mode.
     */
    private Runnable processMockStreaming(
            String conversationId,
            String userMessage,
            Map<String, ToolDefinition> availableTools,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        MockStreamHandle streamHandle = new MockStreamHandle();
        MockToolInvocation toolInvocation = resolveMockToolInvocation(userMessage);
        if (toolInvocation != null) {
            ToolDefinition toolDefinition = availableTools.get(toolInvocation.name());
            if (toolDefinition == null) {
                streamMockResponse(generateMockResponse(userMessage), onNext, onComplete, streamHandle);
                return streamHandle::cancel;
            }
            String toolCallId = UUID.randomUUID().toString();
            boolean requiresConfirmation = toolDefinition.requiresConfirmation();
            ToolCall toolCall = ToolCall.builder()
                    .id(toolCallId)
                    .name(toolInvocation.name())
                    .arguments(toolInvocation.arguments())
                    .status(requiresConfirmation ? ToolCall.ToolStatus.PENDING : ToolCall.ToolStatus.RUNNING)
                    .requiresConfirmation(requiresConfirmation)
                    .build();
            onToolCall.accept(toolCall);

            if (requiresConfirmation) {
                PendingToolExecution pendingExecution = pendingToolExecution(
                        () -> onToolCall.accept(ToolCall.builder()
                                .id(toolCallId)
                                .name(toolInvocation.name())
                                .arguments(toolInvocation.arguments())
                                .status(ToolCall.ToolStatus.RUNNING)
                                .requiresConfirmation(true)
                                .build()),
                        () -> {
                            ToolDefinition latestToolDefinition = toolRegistry.getTool(toolInvocation.name());
                            if (latestToolDefinition == null) {
                                onToolResult.accept(ToolResult.builder()
                                        .toolCallId(toolCallId)
                                        .error("Tool is no longer available for execution.")
                                        .build());
                                onComplete.run();
                                return;
                            }
                            executeMockTool(
                                    ToolCall.builder()
                                            .id(toolCallId)
                                            .name(toolInvocation.name())
                                            .arguments(toolInvocation.arguments())
                                            .status(ToolCall.ToolStatus.RUNNING)
                                            .requiresConfirmation(true)
                                            .build(),
                                    latestToolDefinition,
                                    toolInvocation,
                                    userMessage,
                                    onNext,
                                    onComplete,
                                    onToolResult,
                                    streamHandle
                            );
                        },
                        () -> {
                            streamHandle.cancel();
                            onToolResult.accept(ToolResult.builder()
                                    .toolCallId(toolCallId)
                                    .error("Tool execution cancelled by user.")
                                    .build());
                            onComplete.run();
                        }
                );
                pendingToolExecutions.put(
                        pendingKey(conversationId, toolCallId),
                        pendingExecution
                );
                return () -> {
                    streamHandle.cancel();
                    pendingToolExecutions.remove(pendingKey(conversationId, toolCallId));
                };
            }

            executeMockTool(toolCall, toolDefinition, toolInvocation, userMessage, onNext, onComplete, onToolResult, streamHandle);
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
            ToolDefinition toolDefinition,
            MockToolInvocation toolInvocation,
            String userMessage,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolResult> onToolResult,
            MockStreamHandle streamHandle
    ) {
        toolDefinition.execute(toolInvocation.arguments())
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

        // Skip mock for timezone queries - frontend tool will handle it
        if (lowerMessage.contains("timezone") || lowerMessage.contains("current time zone")) {
            return null;
        }

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

    private PendingToolExecution pendingToolExecution(
            Runnable announceRunningAction,
            Runnable confirmAction,
            Runnable cancelAction
    ) {
        return new PendingToolExecution(announceRunningAction, confirmAction, cancelAction);
    }

    private record MockToolInvocation(String name, Map<String, Object> arguments) {
    }

    private record PendingToolExecution(
            Runnable announceRunningAction,
            Runnable confirmAction,
            Runnable cancelAction
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
            List<Message> messages = new java.util.ArrayList<>();
            Map<String, ToolDefinition> availableTools = toolRegistry.resolveTools(UserCapabilityContext.anonymous());
            boolean useTools = !availableTools.isEmpty();

            messages.add(new SystemMessage(buildSystemPrompt(useTools ? availableTools : Map.of())));

            if (history != null) {
                for (ChatMessage msg : history) {
                    switch (msg.getRole()) {
                        case USER -> messages.add(new UserMessage(msg.getContent()));
                        case ASSISTANT -> messages.add(new AssistantMessage(msg.getContent()));
                        case TOOL -> messages.add(restoreHistoricalToolMessage(msg));
                        default -> {
                        }
                    }
                }
            }

            messages.add(new UserMessage(userMessage));

            log.debug("Processing message for conversation: {}", conversationId);

            ChatResponse response = chatModel.call(buildPrompt(messages, List.of()));
            return assistantText(response);

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

        String memorySection = (memoryEnabled && memorySystemPrompt != null && !memorySystemPrompt.isBlank())
                ? "\n" + memorySystemPrompt + "\n"
                : "";

        return String.format("""
                You are %s, a helpful AI assistant integrated into an FDC3-enabled financial desktop platform.

                You can help users with:
                - Answering questions about financial data and workflows
                - Executing tools on behalf of the user
                - Navigating the platform and finding information
                - Automating repetitive tasks
                %s
                %s
                Be concise but helpful. If you need clarification, ask follow-up questions.

                Always be professional and accurate in your responses.
                """,
                agentName,
                toolSection,
                memorySection
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

    /**
     * Check if the agent is ready.
     */
    public boolean isReady() {
        return mockEnabled || chatModel != null;
    }

    public void confirmToolCall(String conversationId, String toolCallId, boolean confirmed) {
        log.info("Tool call {} for conversation {}: {}",
                toolCallId, conversationId, confirmed ? "confirmed" : "cancelled");

        PendingToolExecution pendingExecution = pendingToolExecutions.remove(pendingKey(conversationId, toolCallId));
        if (pendingExecution != null) {
            if (confirmed) {
                pendingExecution.announceRunningAction().run();
                pendingExecution.confirmAction().run();
            } else {
                pendingExecution.cancelAction().run();
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
