package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.model.ChatRequest;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.ProtocolChatService;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProtocolChatController {

    private final ProtocolChatService protocolChatService;
    private final UserCapabilityContextResolver capabilityContextResolver;
    private final ExecutorService executor = Executors.newCachedThreadPool();

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
        SseEmitter emitter = new SseEmitter(300000L);
        AtomicReference<Runnable> cancelRef = new AtomicReference<>(() -> {
        });

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

        emitter.onTimeout(() -> {
            cancelRef.get().run();
            emitter.complete();
        });
        emitter.onCompletion(cancelRef.get());

        return emitter;
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
        ProtocolMessage userMessage = ProtocolMessage.builder()
                .role("user")
                .parts(List.of(ProtocolPart.builder()
                        .type("text")
                        .text(request.getMessage())
                        .build()))
                .build();

        List<ProtocolMessage> messages = request.getMessages();
        if (messages == null || messages.isEmpty()) {
            messages = List.of(userMessage);
        } else {
            messages = List.copyOf(messages);
            messages.add(userMessage);
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
                    .build();
        }

        return ProtocolRunRequest.builder()
                .conversationId(request.getConversationId())
                .trigger(request.getTrigger())
                .messages(messages)
                .context(context)
                .build();
    }
}
