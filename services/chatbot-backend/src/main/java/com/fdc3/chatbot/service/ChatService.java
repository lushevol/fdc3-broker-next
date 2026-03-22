package com.fdc3.chatbot.service;

import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.tool.ToolRegistry;
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
    private final ToolRegistry toolRegistry;

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
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete,
            java.util.function.Consumer<ToolCall> onToolCall,
            java.util.function.Consumer<ToolResult> onToolResult
    ) {
        // Get or create conversation
        List<ChatMessage> history = conversations.computeIfAbsent(conversationId, k -> new ArrayList<>());
        List<ChatMessage> promptHistory = List.copyOf(history);

        // Add user message to history
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

        // Process with agent
        Runnable cancelAgentStream = agentService.processMessageStreaming(
                conversationId,
                userMessage,
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
                    history.add(ChatMessage.builder()
                            .id(UUID.randomUUID().toString())
                            .role(ChatMessage.Role.ASSISTANT)
                            .content(assistantResponse.toString())
                            .timestamp(Instant.now())
                            .toolCalls(toolCalls.isEmpty() ? null : List.copyOf(toolCalls))
                            .toolResults(toolResults.isEmpty() ? null : List.copyOf(toolResults))
                            .build());
                    onComplete.run();
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
                }
        );

        return () -> {
            if (!cancelled.compareAndSet(false, true)) {
                return;
            }
            cancelAgentStream.run();
        };
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

    /**
     * Confirm or cancel a tool call.
     */
    public void confirmToolCall(String conversationId, String toolCallId, boolean confirmed) {
        log.info("Tool call {} for conversation {}: {}", toolCallId, conversationId, confirmed ? "confirmed" : "cancelled");
        // Delegate to agent service for handling tool confirmation
        agentService.confirmToolCall(conversationId, toolCallId, confirmed);
    }
}
