package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessageType;
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
                        "capabilityId": "analytics.app-usage.read",
                        "arguments": {
                          "appName": "cashflow",
                          "from": "2026-04-01",
                          "to": "2026-04-08"
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
        assertThat(decision.plan().steps().get(0).capabilityId()).isEqualTo("analytics.app-usage.read");
        assertThat(decision.plan().steps().get(0).arguments())
                .containsEntry("appName", "cashflow")
                .containsEntry("from", "2026-04-01")
                .containsEntry("to", "2026-04-08");
    }

    @Test
    void shouldRejectDecisionWithoutDecisionType() {
        String json = "{\"assistantText\":\"missing type\"}";

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        assertThat(decision.assistantText()).contains("missing type");
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
                        .capabilityId("analytics.app-usage.read")
                        .providerId("mcp")
                        .targetName("statistic_count_by_app")
                        .requiredInputs(List.of("appName", "from", "to"))
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
                        .capabilityId("analytics.app-usage.read")
                        .providerId("mcp")
                        .targetName("statistic_count_by_app")
                        .requiredInputs(List.of("appName"))
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
        assertThat(prompt).contains("analytics.app-usage.read");
        assertThat(prompt).doesNotContain("internal-only-capability");
        assertThat(prompt).contains("\"workspaceId\":\"workspace-1\"");
        assertThat(prompt).contains("\"activeAppId\":\"cashflow\"");
        assertThat(request.messages().get(1).type()).isEqualTo(ChatMessageType.USER);
        assertThat(((UserMessage) request.messages().get(1)).singleText()).isEqualTo("hello");
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
