package com.fdc3.chatbot.protocol;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.model.ProtocolRunRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProtocolChatServiceTest {

    private RecordingAgentService agentService;
    private ProtocolChatService protocolChatService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        agentService = new RecordingAgentService();
        objectMapper = new ObjectMapper();
        protocolChatService = new ProtocolChatService(agentService, objectMapper);
    }

    @Test
    void streamRunTranslatesProtocolRequestIntoAgentInvocation() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-1",
                  "context": {
                    "workspace": {
                      "activeWorkspaceId": "ws-1",
                      "activeAppId": "app-1"
                    },
                    "frontendTools": [
                      {
                        "name": "location.resolve",
                        "description": "Resolve a location",
                        "parameters": {
                          "type": "object"
                        },
                        "interactionMode": "auto"
                      }
                    ]
                  },
                  "messages": [
                    {
                      "id": "msg-old-user",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "hello" }]
                    },
                    {
                      "id": "msg-old-assistant",
                      "role": "assistant",
                      "parts": [{ "type": "text", "text": "hi there" }]
                    },
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "What's the weather in San Francisco?" }]
                    }
                  ]
                }
                """, ProtocolRunRequest.class);

        List<Map<String, Object>> frames = new ArrayList<>();
        protocolChatService.streamRun(
                request,
                UserCapabilityContext.anonymous(),
                frames::add,
                error -> {
                    throw new AssertionError(error);
                },
                () -> {
                }
        );

        assertEquals("conv-1", agentService.lastInvocation.conversationId());
        assertEquals("What's the weather in San Francisco?", agentService.lastInvocation.userMessage());
        assertEquals(2, agentService.lastInvocation.history().size());
        assertEquals("hello", agentService.lastInvocation.history().get(0).getContent());
        assertEquals("hi there", agentService.lastInvocation.history().get(1).getContent());
        assertNotNull(agentService.lastInvocation.frontendTools());
        assertTrue(agentService.lastInvocation.frontendTools().contains("location.resolve"));
        assertNotNull(agentService.lastInvocation.workspaceContext());
        assertEquals("ws-1", agentService.lastInvocation.workspaceContext().getWorkspaceId());
        assertEquals("app-1", agentService.lastInvocation.workspaceContext().getActiveAppId());
        assertEquals("start", frames.get(0).get("type"));
        assertEquals("message-start", frames.get(1).get("type"));
    }

    @Test
    void streamRunBuildsFrontendToolContinuationFromAssistantToolPart() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-2",
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "How is the weather in Beijing yesterday?" }]
                    },
                    {
                      "id": "msg-asst-1",
                      "role": "assistant",
                      "parts": [
                        {
                          "type": "tool-call",
                          "toolCallId": "tool-front-1",
                          "toolName": "location.resolve",
                          "executionTarget": "frontend",
                          "state": "output-available",
                          "input": { "query": "Beijing" },
                          "output": { "name": "Beijing", "latitude": 39.9042, "longitude": 116.4074 }
                        }
                      ]
                    }
                  ]
                }
                """, ProtocolRunRequest.class);

        protocolChatService.streamRun(
                request,
                UserCapabilityContext.anonymous(),
                frame -> {
                },
                error -> {
                    throw new AssertionError(error);
                },
                () -> {
                }
        );

        assertEquals("How is the weather in Beijing yesterday?", agentService.lastInvocation.userMessage());
        assertNotNull(agentService.lastInvocation.toolContext());
        assertTrue(agentService.lastInvocation.toolContext().contains("\"toolName\":\"location.resolve\""));
        assertTrue(agentService.lastInvocation.toolContext().contains("\"originalUserMessage\":\"How is the weather in Beijing yesterday?\""));
        assertTrue(agentService.lastInvocation.history().isEmpty());
    }

    @Test
    void streamRunEmitsAssistantUiStyleFrames() throws Exception {
        agentService.behavior = invocation -> {
            invocation.onExecutionPlan().accept(ExecutionPlanEvent.builder()
                    .planId("plan-1")
                    .summary("Resolve the date and weather details.")
                    .build());
            invocation.onExecutionStep().accept(ExecutionStepEvent.builder()
                    .stepId("step-1")
                    .summary("Resolve the weather tool input.")
                    .status("running")
                    .build());
            invocation.onToolCall().accept(ToolCall.builder()
                    .id("tool-1")
                    .name("get_weather")
                    .arguments(Map.of("location", "San Francisco"))
                    .status(ToolCall.ToolStatus.RUNNING)
                    .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                    .build());
            invocation.onToolResult().accept(ToolResult.builder()
                    .toolCallId("tool-1")
                    .toolName("get_weather")
                    .result(Map.of(
                            "location", "San Francisco",
                            "temperature", 19,
                            "temperatureUnit", "Celsius",
                            "conditions", "Sunny"
                    ))
                    .build());
            invocation.onNext().accept("San Francisco is sunny.");
            invocation.onComplete().run();
            return () -> {
            };
        };

        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-3",
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "What's the weather in San Francisco?" }]
                    }
                  ]
                }
                """, ProtocolRunRequest.class);

        List<Map<String, Object>> frames = new ArrayList<>();
        AtomicBoolean completed = new AtomicBoolean(false);

        protocolChatService.streamRun(
                request,
                UserCapabilityContext.anonymous(),
                frames::add,
                error -> {
                    throw new AssertionError(error);
                },
                () -> completed.set(true)
        );

        assertTrue(completed.get());
        assertTrue(frames.stream().anyMatch(frame -> "reasoning-summary".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "plan-available".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "start-step".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "tool-input-start".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "tool-output-available".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "ui-part-available".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "text-delta".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "finish".equals(frame.get("type")) && "stop".equals(frame.get("finishReason"))));
    }

    private static final class RecordingAgentService extends AgentService {
        private AgentInvocation lastInvocation;
        private AgentBehavior behavior = invocation -> {
            invocation.onComplete().run();
            return () -> {
            };
        };

        private RecordingAgentService() {
            super(null);
        }

        @Override
        public Runnable processProtocolMessageStreaming(
                String conversationId,
                String userMessage,
                UserCapabilityContext capabilityContext,
                String toolContext,
                String frontendTools,
                WorkspaceContextSnapshot workspaceContext,
                List<ChatMessage> history,
                Consumer<String> onNext,
                Consumer<Throwable> onError,
                Runnable onComplete,
                Consumer<ExecutionPlanEvent> onExecutionPlan,
                Consumer<ExecutionStepEvent> onExecutionStep,
                Consumer<ToolCall> onToolCall,
                Consumer<ToolResult> onToolResult
        ) {
            lastInvocation = new AgentInvocation(
                    conversationId,
                    userMessage,
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
                    onToolResult
            );
            return behavior.apply(lastInvocation);
        }
    }

    @FunctionalInterface
    private interface AgentBehavior {
        Runnable apply(AgentInvocation invocation);
    }

    private record AgentInvocation(
            String conversationId,
            String userMessage,
            String toolContext,
            String frontendTools,
            WorkspaceContextSnapshot workspaceContext,
            List<ChatMessage> history,
            Consumer<String> onNext,
            Consumer<Throwable> onError,
            Runnable onComplete,
            Consumer<ExecutionPlanEvent> onExecutionPlan,
            Consumer<ExecutionStepEvent> onExecutionStep,
            Consumer<ToolCall> onToolCall,
            Consumer<ToolResult> onToolResult
    ) {
    }
}
