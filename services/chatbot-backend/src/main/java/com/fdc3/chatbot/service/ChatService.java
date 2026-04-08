package com.fdc3.chatbot.service;

import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Service for managing chat conversations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final AgentService agentService;

    // In-memory conversation storage (use Redis/Database in production)
    private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();

    /**
     * Process a chat message and stream the response.
     */
    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
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
                },
                generativeUiDirective -> {
                }
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
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
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                onToolCall,
                onToolResult,
                generativeUiDirective -> {
                }
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            String toolContext,
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
                null,
                null,
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
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            java.util.function.Consumer<GenerativeUIDirective> onGenerativeUi
    ) {
        return processMessageStreaming(
                conversationId,
                userMessage,
                UserCapabilityContext.anonymous(),
                toolContext,
                null,
                null,
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                onToolCall,
                onToolResult,
                onGenerativeUi
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            String toolContext,
            String frontendTools,
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
                onNext,
                onError,
                onComplete,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                onToolCall,
                onToolResult,
                generativeUiDirective -> {
                }
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
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
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ExecutionPlanEvent> onExecutionPlan,
            java.util.function.Consumer<ExecutionStepEvent> onExecutionStep,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult,
            java.util.function.Consumer<GenerativeUIDirective> onGenerativeUi
    ) {
        List<ChatMessage> history = conversations.computeIfAbsent(conversationId, k -> new ArrayList<>());
        List<ChatMessage> promptHistory = List.copyOf(history);

        ChatMessage userMsg = ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .role(ChatMessage.Role.USER)
                .content(userMessage)
                .timestamp(Instant.now())
                .build();
        history.add(userMsg);

        StringBuilder assistantResponse = new StringBuilder();
        List<ToolCall> toolCalls = new ArrayList<>();
        List<ToolResult> toolResults = new ArrayList<>();
        AtomicBoolean cancelled = new AtomicBoolean(false);

        Runnable cancelAgentStream = agentService.processMessageStreaming(
                conversationId,
                userMessage,
                capabilityContext,
                toolContext,
                frontendTools,
                workspaceContext,
                promptHistory,
                token -> {
                    if (cancelled.get()) {
                        return;
                    }
                    assistantResponse.append(token);
                    onNext.accept(token);
                },
                error -> {
                    if (cancelled.get()) {
                        return;
                    }
                    onError.accept(error);
                },
                () -> {
                    if (cancelled.get()) {
                        return;
                    }
                    history.add(buildAssistantMessage(assistantResponse, toolCalls, toolResults));
                    onComplete.run();
                },
                executionPlanEvent -> {
                    if (cancelled.get()) {
                        return;
                    }
                    onExecutionPlan.accept(executionPlanEvent);
                },
                executionStepEvent -> {
                    if (cancelled.get()) {
                        return;
                    }
                    onExecutionStep.accept(executionStepEvent);
                },
                toolCall -> {
                    if (cancelled.get()) {
                        return;
                    }
                    toolCalls.add(toolCall);
                    onToolCall.accept(toolCall);
                },
                toolResult -> {
                    if (cancelled.get()) {
                        return;
                    }
                    toolResults.add(toolResult);
                    onToolResult.accept(toolResult);
                    findGenerativeUiDirective(toolCalls, toolResult).ifPresent(onGenerativeUi);
                }
        );

        return () -> {
            if (!cancelled.compareAndSet(false, true)) {
                return;
            }
            cancelAgentStream.run();
        };
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
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
                onNext,
                onError,
                onComplete,
                onExecutionPlan,
                onExecutionStep,
                onToolCall,
                onToolResult,
                generativeUiDirective -> {
                }
        );
    }

    public Runnable processMessageStreaming(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
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
                onNext,
                onError,
                onComplete
        );
    }

    private ChatMessage buildAssistantMessage(
            StringBuilder assistantResponse,
            List<ToolCall> toolCalls,
            List<ToolResult> toolResults
    ) {
        return ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .role(ChatMessage.Role.ASSISTANT)
                .content(assistantResponse.toString())
                .timestamp(Instant.now())
                .toolCalls(toolCalls.isEmpty() ? null : List.copyOf(toolCalls))
                .toolResults(toolResults.isEmpty() ? null : List.copyOf(toolResults))
                .build();
    }

    /**
     * Get conversation history.
     */
    public List<ChatMessage> getHistory(String conversationId) {
        return conversations.getOrDefault(conversationId, Collections.emptyList());
    }

    /**
     * Clear a conversation.
     */
    public void clearConversation(String conversationId) {
        conversations.remove(conversationId);
        agentService.clearConversationContext(conversationId);
        log.info("Cleared conversation: {}", conversationId);
    }

    /**
     * Create a new conversation and return its ID.
     */
    public String createConversation() {
        String conversationId = UUID.randomUUID().toString();
        conversations.put(conversationId, new ArrayList<>());
        log.info("Created new conversation: {}", conversationId);
        return conversationId;
    }

    /**
     * Check if the chat service is ready.
     */
    public boolean isReady() {
        return agentService.isReady();
    }

    private Optional<GenerativeUIDirective> findGenerativeUiDirective(
            List<ToolCall> toolCalls,
            ToolResult toolResult
    ) {
        return toolCalls.stream()
                .filter(toolCall -> Objects.equals(toolCall.getId(), toolResult.getToolCallId()))
                .findFirst()
                .flatMap(toolCall -> buildGenerativeUiDirective(toolCall, toolResult));
    }

    private Optional<GenerativeUIDirective> buildGenerativeUiDirective(
            ToolCall toolCall,
            ToolResult toolResult
    ) {
        if (toolResult.getError() != null || !(toolResult.getResult() instanceof Map<?, ?> resultMap)) {
            return Optional.empty();
        }

        if ("calculator".equals(toolCall.getName())) {
            Object expression = resultMap.get("expression");
            Object result = resultMap.get("result");
            if (expression == null || result == null) {
                return Optional.empty();
            }

            return Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Calculation Complete",
                            "content", expression + " = " + result,
                            "variant", "success"
                    ))
                    .build());
        }

        if ("get_weather".equals(toolCall.getName())) {
            Object location = resultMap.get("location");
            Object temperature = resultMap.get("temperature");
            Object temperatureUnit = resultMap.get("temperatureUnit");
            Object conditions = resultMap.get("conditions");

            if (location == null || temperature == null || temperatureUnit == null || conditions == null) {
                return Optional.empty();
            }

            return Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Weather Summary",
                            "content", location + ": " + temperature + " " + temperatureUnit + ", " + conditions,
                            "variant", "default"
                    ))
                    .build());
        }

        if ("get_current_time".equals(toolCall.getName())) {
            Object timezone = resultMap.get("timezone");
            Object formatted = resultMap.get("formatted");
            if (timezone == null || formatted == null) {
                return Optional.empty();
            }

            return Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Current Time",
                            "content", timezone + ": " + formatted,
                            "variant", "info"
                    ))
                    .build());
        }

        return Optional.empty();
    }

    /**
     * Confirm or cancel a tool call.
     */
    public void confirmToolCall(String conversationId, String toolCallId, boolean confirmed) {
        log.info("Tool call {} for conversation {}: {}", toolCallId, conversationId, confirmed ? "confirmed" : "cancelled");
        // Delegate to agent service for handling tool confirmation
        agentService.confirmToolCall(conversationId, toolCallId, confirmed);
    }
}
