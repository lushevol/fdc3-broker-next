package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.security.UserCapabilityContextResolver;
import com.fdc3.chatbot.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ChatControllerTest {

    private RecordingChatService chatService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        chatService = new RecordingChatService();
        mockMvc = MockMvcBuilders.standaloneSetup(
                new ChatController(chatService, new UserCapabilityContextResolver("default", ""))
        ).build();
    }

    @Test
    void streamChatEmitsCanonicalSseEventSequence() throws Exception {
        ExecutionPlanEvent executionPlanEvent = ExecutionPlanEvent.builder()
                .planId("plan-1")
                .summary("Fetch PV and UV statistics for cashflow")
                .status("running")
                .totalSteps(1)
                .build();
        ExecutionStepEvent executionStepEvent = ExecutionStepEvent.builder()
                .planId("plan-1")
                .stepId("step-1")
                .targetName("statistic_count_by_app")
                .summary("Fetch PV and UV statistics for cashflow")
                .stepType("mcp")
                .status("running")
                .build();
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("statistic_count_by_app")
                .arguments(Map.of(
                        "appName", "cashflow",
                        "startTime", "2026-04-01T00:00:00Z",
                        "endTime", "2026-04-08T00:00:00Z"
                ))
                .status(ToolCall.ToolStatus.RUNNING)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .toolName("statistic_count_by_app")
                .result(Map.of(
                        "appName", "cashflow",
                        "startTime", "2026-04-01T00:00:00Z",
                        "endTime", "2026-04-08T00:00:00Z",
                        "pv", 120,
                        "uv", 30,
                        "trendPoints", List.of(
                                Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 50, "uv", 12),
                                Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 70, "uv", 18)
                        )
                ))
                .build();
        GenerativeUIDirective generativeUiDirective = GenerativeUIDirective.builder()
                .name("UsageStatisticsCard")
                .toolCallId("tool-1")
                .props(Map.of(
                        "appLabel", "cashflow",
                        "startTime", "2026-04-01T00:00:00Z",
                        "endTime", "2026-04-08T00:00:00Z",
                        "pv", 120,
                        "uv", 30,
                        "trendPoints", List.of(
                                Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 50, "uv", 12),
                                Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 70, "uv", 18)
                        )
                ))
                .build();

        chatService.behavior = invocation -> {
            invocation.onExecutionPlan.accept(executionPlanEvent);
            invocation.onExecutionStep.accept(executionStepEvent);
            invocation.onToolCall.accept(toolCall);
            invocation.onToolResult.accept(toolResult);
            invocation.onGenerativeUi.accept(generativeUiDirective);
            invocation.onNext.accept("cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.");
            invocation.onComplete.run();
        };

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        assertTrue(body.contains("event:conversation_id"));
        assertTrue(body.contains("data:conversation-123"));
        assertTrue(body.contains("event:execution_plan"));
        assertTrue(body.contains("\"planId\":\"plan-1\""));
        assertTrue(body.contains("event:execution_step"));
        assertTrue(body.contains("\"stepId\":\"step-1\""));
        assertTrue(body.contains("event:tool_call"));
        assertTrue(body.contains("event:message"));
        assertTrue(body.contains("data:{\"text\":\"cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.\"}"));
        assertTrue(body.contains("event:tool_result"));
        assertTrue(body.contains("event:generative_ui"));
        assertTrue(body.contains("\"toolCallId\":\"tool-1\""));
        assertTrue(body.contains("\"name\":\"UsageStatisticsCard\""));
        assertTrue(body.contains("event:done"));
    }

    @Test
    void postStreamAcceptsJsonAndReturnsTextEventStream() throws Exception {
        chatService.behavior = invocation -> {
            invocation.onNext.accept("Hello");
            invocation.onComplete.run();
        };

        MvcResult result = mockMvc.perform(post("/api/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Hi\"}"))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();

        assertTrue(
                MediaType.TEXT_EVENT_STREAM.isCompatibleWith(
                        MediaType.parseMediaType(result.getResponse().getContentType())
                )
        );
    }

    @Test
    void postStreamForwardsWorkspaceContextPayload() throws Exception {
        chatService.behavior = invocation -> invocation.onComplete.run();

        mockMvc.perform(post("/api/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "message":"Hi",
                                  "workspaceContext":{
                                    "workspaceId":"workspace-1",
                                    "activeTileId":"tile-2",
                                    "activeAppId":"template_tile_fdc3_2"
                                  }
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(request().asyncStarted())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM));

        assertNotNull(chatService.lastInvocation.workspaceContext);
        assertEquals("workspace-1", chatService.lastInvocation.workspaceContext.getWorkspaceId());
        assertEquals("tile-2", chatService.lastInvocation.workspaceContext.getActiveTileId());
        assertEquals("template_tile_fdc3_2", chatService.lastInvocation.workspaceContext.getActiveAppId());
    }

    @Test
    void streamChatForwardsFrontendToolManifest() throws Exception {
        chatService.behavior = invocation -> invocation.onComplete.run();

        MvcResult result = mockMvc.perform(get("/api/chat/stream")
                        .param("message", "Hi")
                        .param("frontendTools", "[{\"name\":\"custom_client_tool\"}]"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();

        assertEquals("[{\"name\":\"custom_client_tool\"}]", chatService.lastInvocation.frontendTools);
        assertNull(chatService.lastInvocation.workspaceContext);
    }

    @Test
    void streamChatEmitsStructuredMessageChunks() throws Exception {
        chatService.behavior = invocation -> {
            invocation.onNext.accept("Hello");
            invocation.onComplete.run();
        };

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        assertTrue(body.contains("event:message"));
        assertTrue(body.contains("data:{\"text\":\"Hello\"}"));
    }

    @Test
    void streamChatPreservesLeadingSpacesInMessageChunks() throws Exception {
        chatService.behavior = invocation -> {
            invocation.onNext.accept(" from");
            invocation.onComplete.run();
        };

        MvcResult result = mockMvc.perform(get("/api/chat/stream").param("message", "Hi"))
                .andExpect(request().asyncStarted())
                .andReturn();

        result.getAsyncResult();
        String body = result.getResponse().getContentAsString();

        assertTrue(body.contains("data:{\"text\":\" from\"}"));
    }

    private static final class RecordingChatService extends ChatService {

        private StreamingInvocation lastInvocation;
        private StreamingBehavior behavior = invocation -> invocation.onComplete.run();

        private RecordingChatService() {
            super((AgentService) null);
        }

        @Override
        public String createConversation() {
            return "conversation-123";
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public List<ChatMessage> getHistory(String conversationId) {
            return Collections.emptyList();
        }

        @Override
        public Runnable processMessageStreaming(
                String conversationId,
                String userMessage,
                UserCapabilityContext capabilityContext,
                String toolContext,
                String frontendTools,
                WorkspaceContextSnapshot workspaceContext,
                Consumer<String> onNext,
                Consumer<Throwable> onError,
                Runnable onComplete,
                Consumer<ExecutionPlanEvent> onExecutionPlan,
                Consumer<ExecutionStepEvent> onExecutionStep,
                Consumer<ToolCall> onToolCall,
                Consumer<ToolResult> onToolResult,
                Consumer<GenerativeUIDirective> onGenerativeUi
        ) {
            lastInvocation = new StreamingInvocation(
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
                    onGenerativeUi
            );
            behavior.accept(lastInvocation);
            return () -> {
            };
        }
    }

    @FunctionalInterface
    private interface StreamingBehavior {
        void accept(StreamingInvocation invocation);
    }

    private record StreamingInvocation(
            String conversationId,
            String userMessage,
            UserCapabilityContext capabilityContext,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            Consumer<String> onNext,
            Consumer<Throwable> onError,
            Runnable onComplete,
            Consumer<ExecutionPlanEvent> onExecutionPlan,
            Consumer<ExecutionStepEvent> onExecutionStep,
            Consumer<ToolCall> onToolCall,
            Consumer<ToolResult> onToolResult,
            Consumer<GenerativeUIDirective> onGenerativeUi
    ) {
    }
}
