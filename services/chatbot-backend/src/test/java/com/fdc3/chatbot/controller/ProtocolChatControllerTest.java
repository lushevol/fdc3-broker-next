package com.fdc3.chatbot.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.ProtocolChatService;
import com.fdc3.chatbot.protocol.model.ProtocolRunRequest;
import com.fdc3.chatbot.security.UserCapabilityContextResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProtocolChatControllerTest {

    private RecordingProtocolChatService protocolChatService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        protocolChatService = new RecordingProtocolChatService();
        mockMvc = MockMvcBuilders.standaloneSetup(
                new ProtocolChatController(protocolChatService, new UserCapabilityContextResolver("default", ""))
        ).build();
    }

    @Test
    void streamRunReturnsEventStreamFrames() throws Exception {
        protocolChatService.behavior = invocation -> {
            invocation.onFrame().accept(Map.of("type", "start", "runId", "run-1", "conversationId", "conv-1"));
            invocation.onFrame().accept(Map.of("type", "message-start", "messageId", "msg-1", "role", "assistant"));
            invocation.onFrame().accept(Map.of("type", "text-delta", "messageId", "msg-1", "partId", "text-1", "delta", "Hello"));
            invocation.onFrame().accept(Map.of("type", "finish", "finishReason", "stop", "messageId", "msg-1"));
            invocation.onComplete().run();
            return () -> {
            };
        };

        MvcResult result = mockMvc.perform(post("/api/chat/runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "conversationId":"conv-1",
                                  "messages":[
                                    {
                                      "id":"msg-user-1",
                                      "role":"user",
                                      "parts":[{"type":"text","text":"Hello"}]
                                    }
                                  ]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM))
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        assertTrue(body.contains("event:start"));
        assertTrue(body.contains("event:message-start"));
        assertTrue(body.contains("event:text-delta"));
        assertTrue(body.contains("event:finish"));
        assertTrue(body.contains("\"finishReason\":\"stop\""));
    }

    private static final class RecordingProtocolChatService extends ProtocolChatService {
        private InvocationBehavior behavior = invocation -> {
            invocation.onComplete().run();
            return () -> {
            };
        };

        private RecordingProtocolChatService() {
            super(null, new ObjectMapper());
        }

        @Override
        public Runnable streamRun(
                ProtocolRunRequest request,
                UserCapabilityContext capabilityContext,
                Consumer<Map<String, Object>> onFrame,
                Consumer<Throwable> onError,
                Runnable onComplete
        ) {
            return behavior.apply(new Invocation(request, capabilityContext, onFrame, onError, onComplete));
        }
    }

    @FunctionalInterface
    private interface InvocationBehavior {
        Runnable apply(Invocation invocation);
    }

    private record Invocation(
            ProtocolRunRequest request,
            UserCapabilityContext capabilityContext,
            Consumer<Map<String, Object>> onFrame,
            Consumer<Throwable> onError,
            Runnable onComplete
    ) {
    }
}
