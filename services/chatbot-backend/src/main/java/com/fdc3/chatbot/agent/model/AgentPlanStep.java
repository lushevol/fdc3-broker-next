package com.fdc3.chatbot.agent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgentPlanStep(
        String capabilityId,
        Map<String, Object> arguments
) {
}
