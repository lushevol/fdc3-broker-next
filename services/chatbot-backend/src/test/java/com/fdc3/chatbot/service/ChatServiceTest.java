package com.fdc3.chatbot.service;

import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ChatServiceTest {

    private RecordingAgentService agentService;
    private ChatService chatService;

    @BeforeEach
    void setUp() {
        agentService = new RecordingAgentService();
        chatService = new ChatService(agentService);
    }

    @Test
    void processMessageStreamingPersistsAssistantMessageOnCompletion() {
        agentService.behavior = invocation -> {
            invocation.onNext.accept("Hello ");
            invocation.onNext.accept("world");
            invocation.onComplete.run();
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();

        chatService.processMessageStreaming(
                conversationId,
                "Hi",
                token -> {
                },
                error -> {
                },
                () -> {
                }
        );

        List<ChatMessage> history = chatService.getHistory(conversationId);

        assertEquals(2, history.size());
        assertEquals(ChatMessage.Role.USER, history.get(0).getRole());
        assertEquals("Hi", history.get(0).getContent());
        assertEquals(ChatMessage.Role.ASSISTANT, history.get(1).getRole());
        assertEquals("Hello world", history.get(1).getContent());
        assertNotNull(history.get(1).getId());
        assertNotNull(history.get(1).getTimestamp());
    }

    @Test
    void processMessageStreamingForwardsToolLifecycleEvents() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("calculator")
                .arguments(Map.of("expression", "2 + 2"))
                .status(ToolCall.ToolStatus.RUNNING)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .result(Map.of("result", 4))
                .build();

        AtomicInteger toolCallCount = new AtomicInteger();
        AtomicInteger toolResultCount = new AtomicInteger();
        ToolCall[] forwardedToolCall = new ToolCall[1];
        ToolResult[] forwardedToolResult = new ToolResult[1];

        agentService.behavior = invocation -> {
            invocation.onToolCall.accept(toolCall);
            invocation.onToolResult.accept(toolResult);
            invocation.onComplete.run();
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();

        chatService.processMessageStreaming(
                conversationId,
                "calculate 2 + 2",
                token -> {
                },
                error -> {
                },
                () -> {
                },
                event -> {
                    forwardedToolCall[0] = event;
                    toolCallCount.incrementAndGet();
                },
                event -> {
                    forwardedToolResult[0] = event;
                    toolResultCount.incrementAndGet();
                }
        );

        assertEquals(1, toolCallCount.get());
        assertEquals(1, toolResultCount.get());
        assertSame(toolCall, forwardedToolCall[0]);
        assertSame(toolResult, forwardedToolResult[0]);
    }

    @Test
    void processMessageStreamingEmitsToolLinkedGenerativeUiForSupportedBackendTools() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("get_weather")
                .arguments(Map.of("location", "Shanghai, China"))
                .status(ToolCall.ToolStatus.RUNNING)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .result(Map.of(
                        "location", "Shanghai, China",
                        "temperature", 22,
                        "temperatureUnit", "Celsius",
                        "conditions", "Partly Cloudy"
                ))
                .build();

        GenerativeUIDirective[] directive = new GenerativeUIDirective[1];

        agentService.behavior = invocation -> {
            invocation.onToolCall.accept(toolCall);
            invocation.onToolResult.accept(toolResult);
            invocation.onComplete.run();
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();

        chatService.processMessageStreaming(
                conversationId,
                "weather in shanghai",
                null,
                token -> {
                },
                error -> {
                },
                () -> {
                },
                toolCallEvent -> {
                },
                toolResultEvent -> {
                },
                event -> directive[0] = event
        );

        assertNotNull(directive[0]);
        assertEquals("Card", directive[0].getName());
        assertEquals("tool-1", directive[0].getToolCallId());
        assertEquals("Weather Summary", directive[0].getProps().get("title"));
        assertTrue(String.valueOf(directive[0].getProps().get("content")).contains("Partly Cloudy"));
    }

    @Test
    void processMessageStreamingDoesNotDuplicateCurrentUserMessageInModelHistory() {
        agentService.behavior = invocation -> {
            invocation.onComplete.run();
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();

        chatService.processMessageStreaming(
                conversationId,
                "Hello there",
                token -> {
                },
                error -> {
                },
                () -> {
                }
        );

        assertEquals(conversationId, agentService.lastInvocation.conversationId);
        assertEquals("Hello there", agentService.lastInvocation.userMessage);
        assertTrue(agentService.lastInvocation.history.isEmpty());
        assertNull(agentService.lastInvocation.workspaceContext);
    }

    @Test
    void clearConversationAlsoClearsAgentConversationContext() {
        String conversationId = chatService.createConversation();

        chatService.clearConversation(conversationId);

        assertEquals(conversationId, agentService.lastClearedConversationId);
    }

    @Test
    void cancelledStreamDoesNotPersistPartialAssistantMessage() {
        Runnable[] onCompleteRef = new Runnable[1];
        Consumer<String>[] onNextRef = new Consumer[1];

        agentService.behavior = invocation -> {
            onNextRef[0] = invocation.onNext;
            onCompleteRef[0] = invocation.onComplete;
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();

        Runnable cancelStream = chatService.processMessageStreaming(
                conversationId,
                "Hi",
                token -> {
                },
                error -> {
                },
                () -> {
                }
        );

        onNextRef[0].accept("partial");
        cancelStream.run();
        onCompleteRef[0].run();

        List<ChatMessage> history = chatService.getHistory(conversationId);
        assertEquals(1, history.size());
        assertEquals(ChatMessage.Role.USER, history.get(0).getRole());
    }

    @Test
    void processMessageStreamingForwardsFrontendToolManifestToAgent() {
        agentService.behavior = invocation -> {
            invocation.onComplete.run();
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();
        String frontendTools = "[{\"name\":\"custom_client_tool\",\"description\":\"Custom tool\"}]";

        chatService.processMessageStreaming(
                conversationId,
                "Hi",
                null,
                frontendTools,
                token -> {
                },
                error -> {
                },
                () -> {
                },
                toolCall -> {
                },
                toolResult -> {
                }
        );

        assertEquals(conversationId, agentService.lastInvocation.conversationId);
        assertEquals("Hi", agentService.lastInvocation.userMessage);
        assertEquals(frontendTools, agentService.lastInvocation.frontendTools);
        assertNull(agentService.lastInvocation.workspaceContext);
    }

    @Test
    void processMessageStreamingForwardsWorkspaceContextToAgent() {
        agentService.behavior = invocation -> {
            invocation.onComplete.run();
            return () -> {
            };
        };

        String conversationId = chatService.createConversation();
        WorkspaceContextSnapshot workspaceContext = WorkspaceContextSnapshot.builder()
                .workspaceId("workspace-1")
                .activeTileId("tile-2")
                .activeAppId("template_tile_fdc3_2")
                .build();

        chatService.processMessageStreaming(
                conversationId,
                "show app usage",
                UserCapabilityContext.anonymous(),
                null,
                null,
                workspaceContext,
                token -> {
                },
                error -> {
                },
                () -> {
                }
        );

        assertNotNull(agentService.lastInvocation.workspaceContext);
        assertEquals("workspace-1", agentService.lastInvocation.workspaceContext.getWorkspaceId());
        assertEquals("tile-2", agentService.lastInvocation.workspaceContext.getActiveTileId());
        assertEquals("template_tile_fdc3_2", agentService.lastInvocation.workspaceContext.getActiveAppId());
    }

    private static final class RecordingAgentService extends AgentService {

        private AgentInvocation lastInvocation;
        private AgentBehavior behavior = invocation -> {
            invocation.onComplete.run();
            return () -> {
            };
        };
        private String lastClearedConversationId;

        private RecordingAgentService() {
            super(null);
        }

        @Override
        public Runnable processMessageStreaming(
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
                    capabilityContext,
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

        @Override
        public void clearConversationContext(String conversationId) {
            lastClearedConversationId = conversationId;
        }
    }

    @FunctionalInterface
    private interface AgentBehavior {
        Runnable apply(AgentInvocation invocation);
    }

    private record AgentInvocation(
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
    }
}
