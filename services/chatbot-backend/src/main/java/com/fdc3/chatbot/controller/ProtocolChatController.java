package com.fdc3.chatbot.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.model.ChatRequest;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.FrontendToolManifestEntry;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.ProtocolChatService;
import com.fdc3.chatbot.protocol.model.ProtocolFrontendTool;
import com.fdc3.chatbot.protocol.model.ProtocolMessage;
import com.fdc3.chatbot.protocol.model.ProtocolPart;
import com.fdc3.chatbot.protocol.model.ProtocolRunContext;
import com.fdc3.chatbot.protocol.model.ProtocolRunRequest;
import com.fdc3.chatbot.protocol.model.ProtocolWorkspaceContext;
import com.fdc3.chatbot.security.UserCapabilityContextResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ProtocolChatController {
    private static final TypeReference<List<FrontendToolManifestEntry>> FRONTEND_TOOL_MANIFEST_TYPE = new TypeReference<>() {
    };

    private final ProtocolChatService protocolChatService;
    private final UserCapabilityContextResolver capabilityContextResolver;
    private final ObjectMapper objectMapper;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    @Value("${chatbot.protocol.sse-timeout-millis:300000}")
    private long sseTimeoutMillis = 300000L;

    @PostMapping(value = "/runs", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamRun(@RequestBody ProtocolRunRequest request, Authentication authentication) {
        return streamRunInternal(request, authentication);
    }

    @PostMapping(value = "/stream", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestBody ChatRequest request, Authentication authentication) {
        ProtocolRunRequest protocolRequest = convertToProtocolRequest(request);
        return streamRunInternal(protocolRequest, authentication);
    }

    private SseEmitter streamRunInternal(ProtocolRunRequest request, Authentication authentication) {
        UserCapabilityContext capabilityContext = capabilityContextResolver.resolve(authentication);

        // If the frontend explicitly passes a userId (from MFE base auth context),
        // override the JWT-derived userId for per-user memory isolation.
        if (request.getUserId() != null && !request.getUserId().isBlank()) {
            capabilityContext.setUserId(request.getUserId());
            // Also update the fingerprint so tool resolution uses the correct user
            capabilityContext.setProfileFingerprint(
                    capabilityContext.getUserId() + "|" +
                    String.join(",", capabilityContext.getProfiles()) + "|" +
                    capabilityContext.getProfileVersion()
            );
        }

        SseEmitter emitter = new SseEmitter(sseTimeoutMillis);
        AtomicReference<Runnable> cancelRef = new AtomicReference<>(() -> {
        });
        AtomicBoolean cancelled = new AtomicBoolean(false);

        executor.execute(() -> {
            try {
                Runnable cancel = protocolChatService.streamRun(
                        request,
                        capabilityContext,
                        frame -> sendFrame(emitter, frame),
                        error -> emitter.completeWithError(error),
                        emitter::complete
                );
                cancelRef.set(cancel);
            } catch (Exception exception) {
                log.error("Error in protocol run stream", exception);
                emitter.completeWithError(exception);
            }
        });

        Runnable cancelOnce = () -> {
            if (cancelled.compareAndSet(false, true)) {
                cancelRef.get().run();
            }
        };

        emitter.onTimeout(() -> {
            cancelOnce.run();
            emitter.complete();
        });
        emitter.onCompletion(cancelOnce);

        return emitter;
    }

    @PreDestroy
    void shutdownExecutor() {
        executor.shutdownNow();
    }

    private void sendFrame(SseEmitter emitter, Map<String, Object> frame) {
        try {
            String eventName = String.valueOf(frame.getOrDefault("type", "message"));
            emitter.send(SseEmitter.event().name(eventName).data(frame));
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to write protocol frame", exception);
        }
    }

    private ProtocolRunRequest convertToProtocolRequest(ChatRequest request) {
        FrontendToolContinuation continuation = parseFrontendToolContinuation(request.getToolContext());
        List<ProtocolMessage> messages = request.getMessages() == null || request.getMessages().isEmpty()
                ? historyToProtocolMessages(request.getHistory())
                : new java.util.ArrayList<>(request.getMessages());

        if (continuation != null) {
            messages.add(buildUserMessage(continuation.getOriginalUserMessage()));
            messages.add(buildFrontendContinuationAssistantMessage(continuation));
        } else if (request.getMessage() != null && !request.getMessage().isBlank()) {
            messages.add(buildUserMessage(request.getMessage()));
        }

        ProtocolRunContext context = null;
        if (request.getWorkspaceContext() != null || request.getFrontendTools() != null) {
            context = ProtocolRunContext.builder()
                    .workspace(request.getWorkspaceContext() != null
                            ? ProtocolWorkspaceContext.builder()
                            .activeWorkspaceId(request.getWorkspaceContext().getWorkspaceId())
                            .activeAppId(request.getWorkspaceContext().getActiveAppId())
                            .build()
                            : null)
                    .frontendTools(parseFrontendTools(request.getFrontendTools()))
                    .build();
        }

        return ProtocolRunRequest.builder()
                .conversationId(request.getConversationId())
                .trigger(request.getTrigger())
                .messages(messages)
                .context(context)
                .build();
    }

    private ProtocolMessage buildUserMessage(String text) {
        return ProtocolMessage.builder()
                .role("user")
                .parts(List.of(ProtocolPart.builder()
                        .type("text")
                        .text(text)
                        .build()))
                .build();
    }

    private ProtocolMessage buildFrontendContinuationAssistantMessage(FrontendToolContinuation continuation) {
        return ProtocolMessage.builder()
                .role("assistant")
                .parts(List.of(ProtocolPart.builder()
                        .type("tool-call")
                        .toolCallId(continuation.getToolCallId())
                        .toolName(continuation.getToolName())
                        .state(continuation.isError() ? "output-error" : "output-available")
                        .source("frontend")
                        .executionTarget("frontend")
                        .input(objectMapper.valueToTree(continuation.getArgs()))
                        .output(objectMapper.valueToTree(continuation.getResult()))
                        .error(continuation.getError())
                        .build()))
                .build();
    }

    private FrontendToolContinuation parseFrontendToolContinuation(String toolContext) {
        if (toolContext == null || toolContext.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(toolContext, FrontendToolContinuation.class);
        } catch (Exception exception) {
            log.warn("Failed to parse legacy toolContext as frontend continuation payload", exception);
            return null;
        }
    }

    private List<ProtocolFrontendTool> parseFrontendTools(String frontendToolsJson) {
        if (frontendToolsJson == null || frontendToolsJson.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(frontendToolsJson, FRONTEND_TOOL_MANIFEST_TYPE).stream()
                    .map(tool -> ProtocolFrontendTool.builder()
                            .name(tool.getName())
                            .description(tool.getDescription())
                            .parameters(tool.getInputSchema())
                            .interactionMode(tool.isHumanInTheLoop() ? "manual" : "automatic")
                            .build())
                    .toList();
        } catch (Exception exception) {
            log.warn("Failed to parse legacy frontendTools payload", exception);
            return null;
        }
    }

    private List<ProtocolMessage> historyToProtocolMessages(List<ChatMessage> history) {
        if (history == null || history.isEmpty()) {
            return new java.util.ArrayList<>();
        }

        List<ProtocolMessage> messages = new java.util.ArrayList<>();
        for (ChatMessage message : history) {
            if (message == null || message.getRole() == null || message.getContent() == null || message.getContent().isBlank()) {
                continue;
            }
            String role = switch (message.getRole()) {
                case USER -> "user";
                case ASSISTANT -> "assistant";
                case SYSTEM -> "system";
                case TOOL -> "tool";
            };
            messages.add(ProtocolMessage.builder()
                    .id(message.getId())
                    .role(role)
                    .parts(List.of(ProtocolPart.builder()
                            .type("text")
                            .text(message.getContent())
                            .build()))
                    .build());
        }
        return messages;
    }
}
