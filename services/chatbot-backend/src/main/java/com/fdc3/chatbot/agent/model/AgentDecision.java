package com.fdc3.chatbot.agent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgentDecision(
        AgentDecisionType decisionType,
        String assistantText,
        String clarificationQuestion,
        AgentPlan plan
) {
}
