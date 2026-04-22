package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessageType;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

class AgentDecisionServiceTest {

    @Test
    void shouldDeserializePlanDecision() {
        String json = """
                {
                  "decisionType": "plan",
                  "assistantText": "I can pull that data.",
                  "plan": {
                    "steps": [
                      {
                        "capabilityId": "visited_user_count_by_application",
                        "arguments": {
                          "application": "cashflow",
                          "startTime": "2026-04-01",
                          "endTime": "2026-04-08"
                        }
                      }
                    ]
                  }
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.PLAN);
        assertThat(decision.assistantText()).isEqualTo("I can pull that data.");
        assertThat(decision.plan().steps()).hasSize(1);
        assertThat(decision.plan().steps().get(0).capabilityId()).isEqualTo("visited_user_count_by_application");
        assertThat(decision.plan().steps().get(0).arguments())
                .containsEntry("application", "cashflow")
                .containsEntry("startTime", "2026-04-01")
                .containsEntry("endTime", "2026-04-08");
    }

    @Test
    void shouldDeserializeWrappedPlanDecisionWithPlanArrayAndInputs() {
        String json = """
                {
                  "response": {
                    "decisionType": "plan",
                    "assistantText": "I'll get the usage data.",
                    "plan": [
                      {
                        "capabilityId": "visited_user_count_by_application",
                        "providerId": "elasticsearch-analytics",
                        "targetName": "visited_user_count_by_application",
                        "inputs": {
                          "application": "cashflow",
                          "startTime": "2026-04-01T00:00:00.000Z",
                          "endTime": "2026-04-08T23:59:59.999Z"
                        }
                      }
                    ]
                  }
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.PLAN);
        assertThat(decision.assistantText()).isEqualTo("I'll get the usage data.");
        assertThat(decision.plan()).isNotNull();
        assertThat(decision.plan().steps()).hasSize(1);
        assertThat(decision.plan().steps().get(0).capabilityId()).isEqualTo("visited_user_count_by_application");
        assertThat(decision.plan().steps().get(0).arguments())
                .containsEntry("application", "cashflow")
                .containsEntry("startTime", "2026-04-01T00:00:00.000Z")
                .containsEntry("endTime", "2026-04-08T23:59:59.999Z");
    }

    @Test
    void shouldDeserializeWrappedPlanDecisionWithStepsObjectAndInputs() {
        String json = """
                {
                  "response": {
                    "decisionType": "plan",
                    "plan": {
                      "steps": [
                        {
                          "capabilityId": "visited_user_count_by_application",
                          "inputs": {
                            "application": "cashflow",
                            "startTime": "2026-04-01",
                            "endTime": "2026-04-08"
                          }
                        }
                      ]
                    }
                  }
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.PLAN);
        assertThat(decision.plan()).isNotNull();
        assertThat(decision.plan().steps()).hasSize(1);
        assertThat(decision.plan().steps().get(0).arguments())
                .containsEntry("application", "cashflow")
                .containsEntry("startTime", "2026-04-01")
                .containsEntry("endTime", "2026-04-08");
    }

    @Test
    void shouldDeserializeMarkdownFencedWrappedPlanDecision() {
        String json = """
                ```json
                {
                  "response": {
                    "decisionType": "plan",
                    "assistantText": "I'll fetch the usage data.",
                    "plan": [
                      {
                        "capabilityId": "visited_user_count_by_application",
                        "inputs": {
                          "application": "cashflow",
                          "startTime": "2026-04-01",
                          "endTime": "2026-04-08"
                        }
                      }
                    ]
                  }
                }
                ```
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.PLAN);
        assertThat(decision.assistantText()).isEqualTo("I'll fetch the usage data.");
        assertThat(decision.plan()).isNotNull();
        assertThat(decision.plan().steps()).hasSize(1);
        assertThat(decision.plan().steps().get(0).capabilityId()).isEqualTo("visited_user_count_by_application");
        assertThat(decision.plan().steps().get(0).arguments())
                .containsEntry("application", "cashflow")
                .containsEntry("startTime", "2026-04-01")
                .containsEntry("endTime", "2026-04-08");
    }

    @Test
    void shouldDeserializePlanDecisionWithPrefixedText() {
        String json = """
                Here is the structured decision:
                {
                  "response": {
                    "decisionType": "plan",
                    "plan": [
                      {
                        "capabilityId": "visited_user_count_by_application",
                        "inputs": {
                          "application": "cashflow",
                          "startTime": "2026-04-01",
                          "endTime": "2026-04-08"
                        }
                      }
                    ]
                  }
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.PLAN);
        assertThat(decision.plan()).isNotNull();
        assertThat(decision.plan().steps()).hasSize(1);
        assertThat(decision.plan().steps().get(0).capabilityId()).isEqualTo("visited_user_count_by_application");
    }

    @Test
    void shouldRejectDecisionWithoutDecisionType() {
        String json = "{\"assistantText\":\"missing type\"}";

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        assertThat(decision.assistantText()).contains("missing type");
    }

    @Test
    void shouldDeserializeRespondDecisionUsingTextField() {
        String json = """
                {
                  "decisionType": "respond",
                  "text": "Hello! How can I help?"
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        assertThat(decision.assistantText()).isEqualTo("Hello! How can I help?");
    }

    @Test
    void shouldDeserializeWrappedRespondDecisionUsingResponseTextField() {
        String json = """
                {
                  "response": {
                    "decisionType": "respond",
                    "message": "Hello! How can I help?"
                  }
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        assertThat(decision.assistantText()).isEqualTo("Hello! How can I help?");
    }

    @Test
    void shouldDeserializeRespondDecisionUsingRootResponseTextField() {
        String json = """
                {
                  "decisionType": "respond",
                  "thoughtProcess": "This is a greeting.",
                  "response": "Hello! How can I help you today?"
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        assertThat(decision.assistantText()).isEqualTo("Hello! How can I help you today?");
    }

    @Test
    void shouldReturnClarifyWhenModelRequestsMissingInput() {
        CapturingChatModel chatModel = new CapturingChatModel("""
                {
                  "decisionType": "clarify",
                  "clarificationQuestion": "Which app should I check?"
                }
                """);
        AgentDecisionService service = new AgentDecisionService(chatModel, new AgentDecisionPromptFactory());

        AgentDecision decision = service.decide(
                "Get app usage count",
                List.<ChatMessage>of(),
                List.of(ResolvedCapability.builder()
                        .capabilityId("visited_user_count_by_application")
                        .providerId("mcp")
                        .targetName("visited_user_count_by_application")
                        .requiredInputs(List.of("application", "startTime", "endTime"))
                        .promptHints(List.of("Use for app PV/UV counts"))
                        .build()),
                WorkspaceContextSnapshot.builder()
                        .workspaceId("workspace-1")
                        .activeAppId("cashflow")
                        .build()
        );

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.CLARIFY);
        assertThat(decision.clarificationQuestion()).isEqualTo("Which app should I check?");
    }

    @Test
    void shouldIncludeOnlyAllowedCapabilitiesInPrompt() {
        CapturingChatModel chatModel =
                new CapturingChatModel("{\"decisionType\":\"respond\",\"assistantText\":\"No action needed.\"}");
        AgentDecisionService service = new AgentDecisionService(chatModel, new AgentDecisionPromptFactory());

        service.decide(
                "hello",
                List.<ChatMessage>of(),
                List.of(ResolvedCapability.builder()
                        .capabilityId("visited_user_count_by_application")
                        .providerId("mcp")
                        .targetName("visited_user_count_by_application")
                        .requiredInputs(List.of("application"))
                        .build()),
                WorkspaceContextSnapshot.builder()
                        .workspaceId("workspace-1")
                        .activeTileId("tile-1")
                        .activeAppId("cashflow")
                        .build()
        );

        ChatRequest request = chatModel.capturedRequest();
        assertThat(request.messages()).hasSize(2);
        assertThat(request.messages().get(0)).isInstanceOf(dev.langchain4j.data.message.SystemMessage.class);
        String prompt = ((dev.langchain4j.data.message.SystemMessage) request.messages().get(0)).text();
        assertThat(prompt).contains("toolName: visited_user_count_by_application");
        assertThat(prompt).doesNotContain("internal-only-capability");
        assertThat(prompt).contains("\"workspaceId\":\"workspace-1\"");
        assertThat(prompt).contains("\"activeAppId\":\"cashflow\"");
        assertThat(request.messages().get(1).type()).isEqualTo(ChatMessageType.USER);
        assertThat(((UserMessage) request.messages().get(1)).singleText()).isEqualTo("hello");
    }

    @Test
    void shouldForwardConversationHistoryIntoDecisionRequest() {
        CapturingChatModel chatModel =
                new CapturingChatModel("{\"decisionType\":\"respond\",\"assistantText\":\"Using history.\"}");
        AgentDecisionService service = new AgentDecisionService(chatModel, new AgentDecisionPromptFactory());

        service.decide(
                "current question",
                List.of(
                        ChatMessage.builder().role(ChatMessage.Role.SYSTEM).content("system history").build(),
                        ChatMessage.builder().role(ChatMessage.Role.USER).content("previous user").build(),
                        ChatMessage.builder().role(ChatMessage.Role.ASSISTANT).content("previous assistant").build()
                ),
                List.of(),
                null
        );

        ChatRequest request = chatModel.capturedRequest();
        assertThat(request.messages()).hasSize(5);
        assertThat(request.messages().get(0)).isInstanceOf(SystemMessage.class);
        assertThat(((SystemMessage) request.messages().get(0)).text()).contains("Allowed decisionType values");
        assertThat(request.messages().get(1)).isInstanceOf(SystemMessage.class);
        assertThat(((SystemMessage) request.messages().get(1)).text()).isEqualTo("system history");
        assertThat(request.messages().get(2)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(2)).singleText()).isEqualTo("previous user");
        assertThat(request.messages().get(3)).isInstanceOf(AiMessage.class);
        assertThat(((AiMessage) request.messages().get(3)).text()).isEqualTo("previous assistant");
        assertThat(request.messages().get(4)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(4)).singleText()).isEqualTo("current question");
    }

    @Test
    void shouldTreatNullHistoryAsEmptyWhenBuildingDecisionRequest() {
        CapturingChatModel chatModel =
                new CapturingChatModel("{\"decisionType\":\"respond\",\"assistantText\":\"No history provided.\"}");
        AgentDecisionService service = new AgentDecisionService(chatModel, new AgentDecisionPromptFactory());

        AgentDecision decision = service.decide("hello", null, List.of(), null);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        ChatRequest request = chatModel.capturedRequest();
        assertThat(request.messages()).hasSize(2);
        assertThat(request.messages().get(0)).isInstanceOf(SystemMessage.class);
        assertThat(request.messages().get(1)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(1)).singleText()).isEqualTo("hello");
    }

    @Test
    void shouldSkipToolHistoryEntriesWhenBuildingDecisionRequest() {
        CapturingChatModel chatModel =
                new CapturingChatModel("{\"decisionType\":\"respond\",\"assistantText\":\"Tool history skipped.\"}");
        AgentDecisionService service = new AgentDecisionService(chatModel, new AgentDecisionPromptFactory());

        AgentDecision decision = service.decide(
                "current question",
                List.of(
                        ChatMessage.builder().role(ChatMessage.Role.USER).content("previous user").build(),
                        ChatMessage.builder().role(ChatMessage.Role.TOOL).content("tool result").build(),
                        ChatMessage.builder().role(ChatMessage.Role.ASSISTANT).content("previous assistant").build()
                ),
                List.of(),
                null
        );

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        ChatRequest request = chatModel.capturedRequest();
        assertThat(request.messages()).hasSize(4);
        assertThat(request.messages().get(0)).isInstanceOf(SystemMessage.class);
        assertThat(request.messages().get(1)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(1)).singleText()).isEqualTo("previous user");
        assertThat(request.messages().get(2)).isInstanceOf(AiMessage.class);
        assertThat(((AiMessage) request.messages().get(2)).text()).isEqualTo("previous assistant");
        assertThat(request.messages().get(3)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(3)).singleText()).isEqualTo("current question");
    }

    private static final class CapturingChatModel implements ChatModel {

        private final String responseText;
        private ChatRequest capturedRequest;

        private CapturingChatModel(String responseText) {
            this.responseText = responseText;
        }

        @Override
        public ChatResponse doChat(ChatRequest chatRequest) {
            this.capturedRequest = chatRequest;
            return ChatResponse.builder()
                    .aiMessage(AiMessage.from(responseText))
                    .build();
        }

        private ChatRequest capturedRequest() {
            return Objects.requireNonNull(capturedRequest, "Chat request was not captured");
        }
    }
}
