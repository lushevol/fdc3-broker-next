package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.model.ChatRequest;
import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * REST Controller for chat operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    /**
     * Send a chat message and receive a streaming response via SSE.
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(
            @RequestParam String message,
            @RequestParam(required = false) String conversationId,
            @RequestParam(required = false) String toolContext,
            @RequestParam(required = false) String frontendTools
    ) {
        log.info("Received streaming chat request for conversation: {}", conversationId);

        SseEmitter emitter = new SseEmitter(300000L); // 5 minute timeout

        // Create conversation if not provided
        String convId = conversationId != null && !conversationId.isEmpty()
                ? conversationId
                : chatService.createConversation();
        AtomicReference<Runnable> cancelStreamRef = new AtomicReference<>(() -> {
        });

        executor.execute(() -> {
            try {
                // Send conversation ID
                emitter.send(SseEmitter.event()
                        .name("conversation_id")
                        .data(convId));

                // Stream the response
                Runnable cancelStream = chatService.processMessageStreaming(
                        convId,
                        message,
                        toolContext,
                        frontendTools,
                        token -> {
                            try {
                                emitter.send(SseEmitter.event()
                                        .name("message")
                                        .data(Map.of("text", token)));
                            } catch (IOException e) {
                                log.error("Error sending SSE event", e);
                            }
                        },
                        error -> {
                            try {
                                emitter.send(SseEmitter.event()
                                        .name("error")
                                        .data(error.getMessage()));
                                emitter.complete();
                            } catch (IOException e) {
                                log.error("Error sending error event", e);
                            }
                        },
                        () -> {
                            try {
                                emitter.send(SseEmitter.event()
                                        .name("done")
                                        .data(""));
                                emitter.complete();
                            } catch (IOException e) {
                                log.error("Error sending done event", e);
                            }
                        },
                        toolCall -> {
                            try {
                                emitter.send(SseEmitter.event()
                                        .name("tool_call")
                                        .data(toolCall));
                            } catch (IOException e) {
                                log.error("Error sending tool_call event", e);
                            }
                        },
                        toolResult -> {
                            try {
                                emitter.send(SseEmitter.event()
                                        .name("tool_result")
                                        .data(toolResult));
                            } catch (IOException e) {
                                log.error("Error sending tool_result event", e);
                            }
                        },
                        generativeUiDirective -> {
                            try {
                                emitter.send(SseEmitter.event()
                                        .name("generative_ui")
                                        .data(generativeUiDirective));
                            } catch (IOException e) {
                                log.error("Error sending generative_ui event", e);
                            }
                        }
                );
                cancelStreamRef.set(cancelStream);
            } catch (Exception e) {
                log.error("Error in streaming response", e);
                emitter.completeWithError(e);
            }
        });

        emitter.onTimeout(() -> {
            log.warn("SSE connection timed out for conversation: {}", convId);
            cancelStreamRef.get().run();
            emitter.complete();
        });

        emitter.onCompletion(() -> {
            cancelStreamRef.get().run();
            log.debug("SSE connection completed for conversation: {}", convId);
        });

        return emitter;
    }

    /**
     * Send a chat message and receive a complete response.
     */
    @PostMapping
    public Map<String, Object> chat(@RequestBody ChatRequest request) {
        log.info("Received chat request for conversation: {}", request.getConversationId());

        // Create conversation if not provided
        String convId = request.getConversationId() != null && !request.getConversationId().isEmpty()
                ? request.getConversationId()
                : chatService.createConversation();

        StringBuilder response = new StringBuilder();
        Object lock = new Object();

        chatService.processMessageStreaming(
                convId,
                request.getMessage(),
                token -> response.append(token),
                error -> {
                    synchronized (lock) {
                        lock.notify();
                    }
                },
                () -> {
                    synchronized (lock) {
                        lock.notify();
                    }
                }
        );

        // Wait for response to complete
        synchronized (lock) {
            try {
                lock.wait(60000); // 1 minute timeout
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("conversationId", convId);
        result.put("message", response.toString());
        return result;
    }

    /**
     * Get conversation history.
     */
    @GetMapping("/{conversationId}/history")
    public Map<String, Object> getHistory(@PathVariable String conversationId) {
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("conversationId", conversationId);
        result.put("messages", chatService.getHistory(conversationId));
        return result;
    }

    /**
     * Clear a conversation.
     */
    @DeleteMapping("/{conversationId}")
    public Map<String, Object> clearConversation(@PathVariable String conversationId) {
        chatService.clearConversation(conversationId);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("success", true);
        result.put("message", "Conversation cleared");
        return result;
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("status", "UP");
        result.put("ready", chatService.isReady());
        return result;
    }

    /**
     * Confirm a tool execution.
     */
    @PostMapping("/{conversationId}/tools/{toolCallId}/confirm")
    public Map<String, Object> confirmToolCall(
            @PathVariable String conversationId,
            @PathVariable String toolCallId,
            @RequestBody Map<String, Boolean> request) {
        log.info("Received tool confirmation for conversation: {}, tool: {}, confirmed: {}",
                conversationId, toolCallId, request.get("confirmed"));

        boolean confirmed = request.getOrDefault("confirmed", false);
        chatService.confirmToolCall(conversationId, toolCallId, confirmed);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("success", true);
        result.put("message", confirmed ? "Tool execution confirmed" : "Tool execution cancelled");
        return result;
    }
}
