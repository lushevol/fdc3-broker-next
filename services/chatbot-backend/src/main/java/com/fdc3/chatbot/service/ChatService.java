package com.fdc3.chatbot.service;

import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.tool.ToolRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

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
    public void processMessageStreaming(
            String conversationId,
            String userMessage,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete
    ) {
        // Get or create conversation
        List<ChatMessage> history = conversations.computeIfAbsent(conversationId, k -> new ArrayList<>());

        // Add user message to history
        ChatMessage userMsg = ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .role(ChatMessage.Role.USER)
                .content(userMessage)
                .timestamp(Instant.now())
                .build();
        history.add(userMsg);

        // Process with agent
        agentService.processMessageStreaming(
                conversationId,
                userMessage,
                history,
                onNext,
                onError,
                () -> {
                    onComplete.run();
                    // Note: In production, you'd save the assistant message here
                }
        );
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
}