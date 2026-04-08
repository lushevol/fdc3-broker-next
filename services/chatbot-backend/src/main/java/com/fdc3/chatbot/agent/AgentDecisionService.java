package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class AgentDecisionService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

    private final ChatModel chatModel;
    private final AgentDecisionPromptFactory promptFactory;

    public AgentDecisionService(ChatModel chatModel, AgentDecisionPromptFactory promptFactory) {
        this.chatModel = Objects.requireNonNull(chatModel, "chatModel");
        this.promptFactory = Objects.requireNonNull(promptFactory, "promptFactory");
    }

    public AgentDecision decide(
            String userMessage,
            List<ChatMessage> history,
            List<ResolvedCapability> capabilities,
            WorkspaceContextSnapshot workspaceContextSnapshot
    ) {
        String prompt = promptFactory.build(
                userMessage,
                workspaceContextSnapshot == null ? "{}" : toWorkspaceContextJson(workspaceContextSnapshot),
                capabilities
        );

        ChatResponse response = chatModel.chat(ChatRequest.builder()
                .messages(toChatRequestMessages(prompt, history, userMessage))
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

    private List<dev.langchain4j.data.message.ChatMessage> toChatRequestMessages(
            String prompt,
            List<ChatMessage> history,
            String userMessage
    ) {
        List<dev.langchain4j.data.message.ChatMessage> messages = new ArrayList<>();
        messages.add(SystemMessage.from(prompt));

        for (ChatMessage message : history) {
            messages.add(toLangChainMessage(message));
        }

        messages.add(UserMessage.from(userMessage));
        return List.copyOf(messages);
    }

    private dev.langchain4j.data.message.ChatMessage toLangChainMessage(ChatMessage message) {
        String content = message.getContent() == null ? "" : message.getContent();
        ChatMessage.Role role = Objects.requireNonNull(message.getRole(), "history message role");
        return switch (role) {
            case SYSTEM -> SystemMessage.from(content);
            case USER -> UserMessage.from(content);
            case ASSISTANT -> AiMessage.from(content);
            case TOOL -> throw new IllegalArgumentException("Unsupported chat history role: " + role);
        };
    }
}
