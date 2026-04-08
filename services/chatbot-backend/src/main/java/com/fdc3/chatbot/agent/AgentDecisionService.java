package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import org.springframework.stereotype.Service;

@Service
public class AgentDecisionService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

    public static AgentDecision parseDecision(String json) {
        try {
            AgentDecision parsed = OBJECT_MAPPER.readValue(json, AgentDecision.class);
            if (parsed.decisionType() != null) {
                return parsed;
            }
            return new AgentDecision(AgentDecisionType.RESPOND, parsed.assistantText(), null, null);
        } catch (Exception ignored) {
            return new AgentDecision(AgentDecisionType.RESPOND, json, null, null);
        }
    }
}
