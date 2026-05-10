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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
                new ProtocolChatController(
                        protocolChatService,
                        new UserCapabilityContextResolver("default", ""),
                        new ObjectMapper()
                )
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
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        assertTrue(body.contains("event:start"));
        assertTrue(body.contains("event:message-start"));
        assertTrue(body.contains("event:text-delta"));
        assertTrue(body.contains("event:finish"));
        assertTrue(body.contains("\"finishReason\":\"stop\""));
    }

    @Test
    void streamChatConvertsLegacyRequestIntoProtocolRequestWithFrontendToolsAndWorkspace() throws Exception {
        protocolChatService.behavior = invocation -> {
            invocation.onComplete().run();
            return () -> {
            };
        };

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("conversationId", "conv-legacy-1");
        payload.put("message", "How is the weather in Beijing yesterday?");
        payload.put("frontendTools", """
                [{"name":"location.resolve","description":"Resolve location","inputSchema":{"type":"object","properties":{"query":{"type":"string"}}},"humanInTheLoop":false,"hasRender":true}]
                """);
        payload.put("workspaceContext", Map.of("workspaceId", "ws-1", "activeAppId", "app-1"));
        payload.put("history", List.of(Map.of("role", "ASSISTANT", "content", "Earlier answer")));

        MvcResult result = mockMvc.perform(post("/api/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();

        ProtocolRunRequest forwarded = protocolChatService.lastRequest;
        assertNotNull(forwarded);
        assertEquals("conv-legacy-1", forwarded.getConversationId());
        assertEquals(2, forwarded.getMessages().size());
        assertEquals("assistant", forwarded.getMessages().get(0).getRole());
        assertEquals("user", forwarded.getMessages().get(1).getRole());
        assertEquals("How is the weather in Beijing yesterday?", forwarded.getMessages().get(1).getParts().get(0).getText());
        assertNotNull(forwarded.getContext());
        assertNotNull(forwarded.getContext().getWorkspace());
        assertEquals("ws-1", forwarded.getContext().getWorkspace().getActiveWorkspaceId());
        assertEquals("app-1", forwarded.getContext().getWorkspace().getActiveAppId());
        assertNotNull(forwarded.getContext().getFrontendTools());
        assertEquals(1, forwarded.getContext().getFrontendTools().size());
        assertEquals("location.resolve", forwarded.getContext().getFrontendTools().get(0).getName());
    }

    @Test
    void streamChatConvertsLegacyToolContextIntoProtocolContinuationMessages() throws Exception {
        protocolChatService.behavior = invocation -> {
            invocation.onComplete().run();
            return () -> {
            };
        };

        MvcResult result = mockMvc.perform(post("/api/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "conversationId":"conv-legacy-2",
                                  "message":"How is the weather in Beijing yesterday?",
                                  "toolContext":"{\\"originalUserMessage\\":\\"How is the weather in Beijing yesterday?\\",\\"toolCallId\\":\\"tool-1\\",\\"toolName\\":\\"location.resolve\\",\\"args\\":{\\"query\\":\\"Beijing\\"},\\"result\\":{\\"location\\":\\"Beijing\\"},\\"isError\\":false}"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();

        ProtocolRunRequest forwarded = protocolChatService.lastRequest;
        assertNotNull(forwarded);
        assertEquals(2, forwarded.getMessages().size());
        assertEquals("user", forwarded.getMessages().get(0).getRole());
        assertEquals("assistant", forwarded.getMessages().get(1).getRole());
        assertEquals("tool-call", forwarded.getMessages().get(1).getParts().get(0).getType());
        assertEquals("location.resolve", forwarded.getMessages().get(1).getParts().get(0).getToolName());
        assertEquals("output-available", forwarded.getMessages().get(1).getParts().get(0).getState());
    }

    private static final class RecordingProtocolChatService extends ProtocolChatService {
        private InvocationBehavior behavior = invocation -> {
            invocation.onComplete().run();
            return () -> {
            };
        };
        private ProtocolRunRequest lastRequest;

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
            this.lastRequest = request;
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
