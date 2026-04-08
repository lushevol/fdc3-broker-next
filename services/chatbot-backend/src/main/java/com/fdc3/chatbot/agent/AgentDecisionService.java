package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentDecisionService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

    private final ChatModel chatModel;
    private final AgentDecisionPromptFactory promptFactory;

    public AgentDecisionService() {
        this(null, new AgentDecisionPromptFactory());
    }

    public AgentDecisionService(ChatModel chatModel, AgentDecisionPromptFactory promptFactory) {
        this.chatModel = chatModel;
        this.promptFactory = promptFactory;
    }

    public AgentDecision decide(
            String userMessage,
            List<ChatMessage> history,
            List<ResolvedCapability> capabilities,
            WorkspaceContextSnapshot workspaceContextSnapshot
    ) {
        if (chatModel == null) {
            throw new IllegalStateException("ChatModel is not configured for agent decisions.");
        }

        String prompt = promptFactory.build(
                userMessage,
                workspaceContextSnapshot == null ? "{}" : toWorkspaceContextJson(workspaceContextSnapshot),
                capabilities
        );

        ChatResponse response = chatModel.chat(ChatRequest.builder()
                .messages(List.of(SystemMessage.from(prompt), UserMessage.from(userMessage)))
                .build());

        return parseDecision(response.aiMessage().text());
    }

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

    private String toWorkspaceContextJson(WorkspaceContextSnapshot workspaceContextSnapshot) {
        try {
            return OBJECT_MAPPER.writeValueAsString(workspaceContextSnapshot);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to serialize workspace context.", exception);
        }
    }
}
