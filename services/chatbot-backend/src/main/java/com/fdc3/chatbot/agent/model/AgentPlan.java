package com.fdc3.chatbot.agent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgentPlan(List<AgentPlanStep> steps) {
}
