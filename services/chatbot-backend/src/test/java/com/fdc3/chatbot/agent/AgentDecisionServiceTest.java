package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import org.junit.jupiter.api.Test;

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
}
