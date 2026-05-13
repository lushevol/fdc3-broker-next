package com.fdc3.chatbot.protocol;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.files.UploadedFileContextBuilder;
import com.fdc3.chatbot.files.UploadedFileRegistry;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.model.ProtocolRunRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
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
        protocolChatService = new ProtocolChatService(
                agentService,
                objectMapper,
                new UploadedFileContextBuilder(new UploadedFileRegistry())
        );
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
    void streamRunAppendsUploadedFileContextToActiveUserMessage() throws Exception {
        String pdfData = Base64.getEncoder().encodeToString("%PDF-1.4".getBytes(StandardCharsets.UTF_8));
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-file-1",
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [
                        { "type": "text", "text": "Summarize this PDF" },
                        {
                          "type": "file",
                          "name": "report.pdf",
                          "mimeType": "application/pdf",
                          "sizeBytes": 8,
                          "data": "%s",
                          "encoding": "base64"
                        }
                      ]
                    }
                  ]
                }
                """.formatted(pdfData), ProtocolRunRequest.class);

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

        assertTrue(agentService.lastInvocation.userMessage().contains("Summarize this PDF"));
        assertTrue(agentService.lastInvocation.userMessage().contains("Uploaded files available for this conversation"));
        assertTrue(agentService.lastInvocation.userMessage().contains("report.pdf"));
        assertTrue(agentService.lastInvocation.userMessage().contains("localPath:"));
        assertTrue(agentService.lastInvocation.userMessage().contains("invoke the pdf skill"));
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
    void streamRunBuildsFrontendToolContinuationFromAssistantToolPartSourceField() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-2-source",
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "what's the profile of user 123" }]
                    },
                    {
                      "id": "msg-asst-1",
                      "role": "assistant",
                      "parts": [
                        {
                          "type": "text",
                          "text": "I'll look up the profile information for user 123."
                        },
                        {
                          "type": "tool-call",
                          "toolCallId": "tool-front-1",
                          "toolName": "profile_lookup",
                          "source": "frontend",
                          "state": "output-available",
                          "input": { "userId": "123" },
                          "output": {
                            "userId": "123",
                            "name": "John Doe",
                            "email": "john.doe@example.com"
                          }
                        }
                      ]
                    },
                    {
                      "id": "msg-tool-1",
                      "role": "tool",
                      "toolCallId": "tool-front-1",
                      "toolName": "profile_lookup",
                      "parts": [
                        {
                          "type": "tool-result",
                          "toolCallId": "tool-front-1",
                          "output": {
                            "userId": "123",
                            "name": "John Doe",
                            "email": "john.doe@example.com"
                          }
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

        assertEquals("what's the profile of user 123", agentService.lastInvocation.userMessage());
        assertNotNull(agentService.lastInvocation.toolContext());
        assertTrue(agentService.lastInvocation.toolContext().contains("\"toolName\":\"profile_lookup\""));
        assertTrue(agentService.lastInvocation.toolContext().contains("\"originalUserMessage\":\"what's the profile of user 123\""));
        assertTrue(agentService.lastInvocation.history().isEmpty());
    }

    @Test
    void streamRunBuildsFrontendToolContinuationFromHumanSourceToolPart() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-human-1",
                  "trigger": "submit-tool-result",
                  "context": {
                    "tools": [
                      {
                        "name": "approval_confirm",
                        "source": "human",
                        "description": "Send an email with confirmation",
                        "parameters": {
                          "to": { "type": "string" },
                          "subject": { "type": "string" },
                          "body": { "type": "string" }
                        }
                      }
                    ]
                  },
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "send an email to John to ask for sick leave tomorrow" }]
                    },
                    {
                      "id": "msg-asst-1",
                      "role": "assistant",
                      "parts": [
                        {
                          "type": "tool-call",
                          "toolCallId": "tool-human-1",
                          "toolName": "approval_confirm",
                          "source": "human",
                          "state": "output-available",
                          "input": { "to": "john@test.com", "subject": "Sick Leave", "body": "I will take sick leave tomorrow." },
                          "output": { "confirmed": true }
                        }
                      ]
                    }
                  ]
                }
                """, ProtocolRunRequest.class);

        protocolChatService.streamRun(
                request,
                UserCapabilityContext.anonymous(),
                frame -> {},
                error -> { throw new AssertionError(error); },
                () -> {}
        );

        assertNotNull(agentService.lastInvocation.toolContext());
        assertTrue(agentService.lastInvocation.toolContext().contains("\"toolName\":\"approval_confirm\""));
        assertTrue(agentService.lastInvocation.toolContext().contains("\"originalUserMessage\":\"send an email to John to ask for sick leave tomorrow\""));
        assertTrue(agentService.lastInvocation.toolContext().contains("john@test.com"));
    }

    @Test
    void streamRunUsesLatestUserTurnInsteadOfOldFrontendContinuation() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-follow-up",
                  "trigger": "submit-message",
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "what's the profile of user 123" }]
                    },
                    {
                      "id": "msg-asst-1",
                      "role": "assistant",
                      "parts": [
                        { "type": "text", "text": "I'll look up the profile information for user 123." },
                        {
                          "type": "tool-call",
                          "toolCallId": "tool-front-1",
                          "toolName": "profile_lookup",
                          "source": "frontend",
                          "state": "output-available",
                          "input": { "userId": "123" },
                          "output": {
                            "userId": "123",
                            "name": "John Doe",
                            "email": "john.doe@example.com"
                          }
                        }
                      ]
                    },
                    {
                      "id": "msg-tool-1",
                      "role": "tool",
                      "toolCallId": "tool-front-1",
                      "toolName": "profile_lookup",
                      "parts": [
                        {
                          "type": "tool-result",
                          "toolCallId": "tool-front-1",
                          "output": {
                            "userId": "123",
                            "name": "John Doe",
                            "email": "john.doe@example.com"
                          }
                        }
                      ]
                    },
                    {
                      "id": "msg-asst-2",
                      "role": "assistant",
                      "parts": [
                        {
                          "type": "text",
                          "text": "I can see the profile information for user 123 from the completed lookup."
                        }
                      ]
                    },
                    {
                      "id": "msg-user-2",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "send an email to him to ask for sick leave tomorrow." }]
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

        assertEquals("send an email to him to ask for sick leave tomorrow.", agentService.lastInvocation.userMessage());
        assertEquals(null, agentService.lastInvocation.toolContext());
        assertEquals(3, agentService.lastInvocation.history().size());
        assertEquals("what's the profile of user 123", agentService.lastInvocation.history().get(0).getContent());
        assertEquals("I'll look up the profile information for user 123.", agentService.lastInvocation.history().get(1).getContent());
        assertEquals("I can see the profile information for user 123 from the completed lookup.", agentService.lastInvocation.history().get(2).getContent());
    }

    @Test
    void streamRunSerializesOnlyFrontendAndHumanToolsIntoFrontendManifest() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-tool-manifest",
                  "context": {
                    "tools": [
                      {
                        "name": "approval_confirm",
                        "source": "human",
                        "description": "Send an email with confirmation",
                        "parameters": {
                          "to": { "type": "string" }
                        }
                      },
                      {
                        "name": "profile_lookup",
                        "source": "frontend",
                        "description": "Lookup user profile information",
                        "parameters": {
                          "userId": { "type": "string" }
                        }
                      },
                      {
                        "name": "resolve_relative_date",
                        "source": "backend",
                        "description": "Resolve a relative date",
                        "parameters": {
                          "expression": { "type": "string" }
                        }
                      },
                      {
                        "name": "statistic_count_by_app",
                        "source": "backend",
                        "description": "Fetch PV and UV",
                        "parameters": {
                          "appId": { "type": "string" }
                        }
                      }
                    ]
                  },
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "send an email to him to ask for sick leave tomorrow." }]
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

        assertNotNull(agentService.lastInvocation.frontendTools());
        assertTrue(agentService.lastInvocation.frontendTools().contains("\"name\":\"approval_confirm\""));
        assertTrue(agentService.lastInvocation.frontendTools().contains("\"name\":\"profile_lookup\""));
        assertTrue(!agentService.lastInvocation.frontendTools().contains("\"name\":\"resolve_relative_date\""));
        assertTrue(!agentService.lastInvocation.frontendTools().contains("\"name\":\"statistic_count_by_app\""));
    }

    @Test
    void streamRunNormalizesShorthandFrontendToolParametersIntoJsonSchema() throws Exception {
        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-tool-schema",
                  "context": {
                    "tools": [
                      {
                        "name": "propose_fdc3_action",
                        "source": "human",
                        "description": "Request approval before raising an FDC3 intent",
                        "parameters": {
                          "actionId": {
                            "type": "string",
                            "description": "Action id to raise",
                            "required": true
                          },
                          "question": {
                            "type": "string",
                            "description": "Optional original user request",
                            "required": false
                          }
                        }
                      }
                    ]
                  },
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "open trade tile" }]
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

        assertNotNull(agentService.lastInvocation.frontendTools());
        assertTrue(agentService.lastInvocation.frontendTools().contains("\"name\":\"propose_fdc3_action\""));
        assertTrue(agentService.lastInvocation.frontendTools().contains("\"type\":\"object\""));
        assertTrue(agentService.lastInvocation.frontendTools().contains("\"properties\""));
        assertTrue(agentService.lastInvocation.frontendTools().contains("\"required\":[\"actionId\"]"));
        assertTrue(agentService.lastInvocation.frontendTools()
                .contains("\"question\":{\"type\":\"string\",\"description\":\"Optional original user request\"}"));
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
        assertTrue(frames.stream().anyMatch(frame -> "text-delta".equals(frame.get("type"))));
        assertTrue(frames.stream().anyMatch(frame -> "finish".equals(frame.get("type")) && "stop".equals(frame.get("finishReason"))));
    }

    @Test
    void streamRunEmitsUserQuestionFrameWithBatchId() throws Exception {
        agentService.behavior = invocation -> {
            invocation.onToolCall().accept(ToolCall.builder()
                    .id("ask-user-1")
                    .name("AskUserQuestionTool")
                    .arguments(Map.of("questions", List.of(Map.of(
                            "question", "Approve this action?",
                            "header", "Approval"
                    ))))
                    .status(ToolCall.ToolStatus.RUNNING)
                    .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                    .build());
            invocation.onComplete().run();
            return () -> {
            };
        };

        ProtocolRunRequest request = objectMapper.readValue("""
                {
                  "conversationId": "conv-question-1",
                  "messages": [
                    {
                      "id": "msg-user-1",
                      "role": "user",
                      "parts": [{ "type": "text", "text": "Ask me before acting." }]
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

        Map<String, Object> questionFrame = frames.stream()
                .filter(frame -> "user_question".equals(frame.get("type")))
                .findFirst()
                .orElseThrow();

        assertEquals("ask-user-1", questionFrame.get("toolCallId"));
        assertEquals("ask-user-1", questionFrame.get("batchId"));
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
