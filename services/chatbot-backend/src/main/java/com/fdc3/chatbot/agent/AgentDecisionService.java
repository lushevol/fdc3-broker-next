package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.opentelemetry.api.trace.Span;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
public class AgentDecisionService {
    private static final TypeReference<java.util.Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

    private final ChatModel chatModel;
    private final AgentDecisionPromptFactory promptFactory;

    public AgentDecisionService(ChatModel chatModel, AgentDecisionPromptFactory promptFactory) {
        this.chatModel = Objects.requireNonNull(chatModel, "chatModel");
        this.promptFactory = Objects.requireNonNull(promptFactory, "promptFactory");
    }

    @WithSpan("agent.decision")
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

        Span span = Span.current();
        span.setAttribute("decision.type", "pending");

        ChatResponse response = chatModel.call(new Prompt(toChatRequestMessages(prompt, history, userMessage)));
        String responseText = response.getResults().isEmpty() ? null
                : response.getResults().get(0).getOutput().getText();
        log.debug("Raw agent decision response: {}", responseText);

        AgentDecision parsed = parseDecision(responseText);
        if (parsed != null && parsed.decisionType() != null) {
            span.setAttribute("decision.type", parsed.decisionType().name());
        }
        return parsed;
    }

    public static AgentDecision parseDecision(String json) {
        try {
            JsonNode root = OBJECT_MAPPER.readTree(extractDecisionJson(json));
            AgentDecision parsed = parseDecisionNode(root);
            if (parsed.decisionType() != null) {
                return parsed;
            }
            return new AgentDecision(AgentDecisionType.RESPOND, parsed.assistantText(), null, null);
        } catch (Exception ignored) {
            return new AgentDecision(AgentDecisionType.RESPOND, json, null, null);
        }
    }

    private static String extractDecisionJson(String rawText) {
        if (rawText == null) {
            return null;
        }

        String trimmed = rawText.trim();
        if (trimmed.isEmpty()) {
            return trimmed;
        }

        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline >= 0) {
                trimmed = trimmed.substring(firstNewline + 1).trim();
            }
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.length() - 3).trim();
            }
        }

        if (startsWithJson(trimmed)) {
            return trimmed;
        }

        String extracted = extractFirstJsonStructure(trimmed);
        return extracted == null ? trimmed : extracted;
    }

    private static boolean startsWithJson(String value) {
        return value.startsWith("{") || value.startsWith("[");
    }

    private static String extractFirstJsonStructure(String rawText) {
        int objectStart = rawText.indexOf('{');
        int arrayStart = rawText.indexOf('[');
        int startIndex;

        if (objectStart < 0) {
            startIndex = arrayStart;
        } else if (arrayStart < 0) {
            startIndex = objectStart;
        } else {
            startIndex = Math.min(objectStart, arrayStart);
        }

        if (startIndex < 0) {
            return null;
        }

        char opening = rawText.charAt(startIndex);
        char closing = opening == '{' ? '}' : ']';
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;

        for (int index = startIndex; index < rawText.length(); index += 1) {
            char current = rawText.charAt(index);

            if (escaped) {
                escaped = false;
                continue;
            }

            if (current == '\\') {
                escaped = true;
                continue;
            }

            if (current == '"') {
                inString = !inString;
                continue;
            }

            if (inString) {
                continue;
            }

            if (current == opening) {
                depth += 1;
                continue;
            }

            if (current == closing) {
                depth -= 1;
                if (depth == 0) {
                    return rawText.substring(startIndex, index + 1);
                }
            }
        }

        return null;
    }

    private static AgentDecision parseDecisionNode(JsonNode root) {
        JsonNode decisionNode = root != null && root.has("response") && root.get("response").isObject()
                ? root.get("response")
                : root;
        AgentDecisionType decisionType = parseDecisionType(readText(decisionNode, "decisionType"));
        String assistantText = resolveAssistantText(decisionNode);
        String clarificationQuestion = readText(decisionNode, "clarificationQuestion");
        AgentPlan normalizedPlan = normalizePlan(decisionNode == null ? null : decisionNode.get("plan"));
        return new AgentDecision(
                decisionType,
                assistantText,
                clarificationQuestion,
                normalizedPlan
        );
    }

    private static AgentPlan normalizePlan(JsonNode planNode) {
        if (planNode == null || planNode.isNull()) {
            return null;
        }

        JsonNode stepsNode = planNode.isArray() ? planNode : planNode.get("steps");
        if (stepsNode == null || !stepsNode.isArray()) {
            return null;
        }

        List<AgentPlanStep> steps = new ArrayList<>();
        for (JsonNode stepNode : stepsNode) {
            if (stepNode == null || !stepNode.isObject()) {
                continue;
            }

            String capabilityId = readText(stepNode, "capabilityId");
            JsonNode argumentsNode = stepNode.has("arguments") ? stepNode.get("arguments") : stepNode.get("inputs");
            java.util.Map<String, Object> arguments = argumentsNode != null && argumentsNode.isObject()
                    ? OBJECT_MAPPER.convertValue(argumentsNode, MAP_TYPE)
                    : java.util.Map.of();
            steps.add(new AgentPlanStep(capabilityId, arguments));
        }

        return new AgentPlan(List.copyOf(steps));
    }

    private static String resolveAssistantText(JsonNode decisionNode) {
        String assistantText = readText(decisionNode, "assistantText");
        if (assistantText != null && !assistantText.isBlank()) {
            return assistantText;
        }

        String textField = readText(decisionNode, "text");
        if (textField != null && !textField.isBlank()) {
            return textField;
        }

        String messageField = readText(decisionNode, "message");
        if (messageField != null && !messageField.isBlank()) {
            return messageField;
        }

        JsonNode responseNode = decisionNode == null ? null : decisionNode.get("response");
        if (responseNode != null && responseNode.isTextual()) {
            String responseText = responseNode.asText();
            if (!responseText.isBlank()) {
                return responseText;
            }
        }

        return null;
    }

    private static AgentDecisionType parseDecisionType(String rawDecisionType) {
        if (rawDecisionType == null || rawDecisionType.isBlank()) {
            return null;
        }

        try {
            return OBJECT_MAPPER.convertValue(rawDecisionType, AgentDecisionType.class);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private static String readText(JsonNode node, String fieldName) {
        JsonNode field = node == null ? null : node.get(fieldName);
        return field != null && field.isTextual() ? field.asText() : null;
    }

    private String toWorkspaceContextJson(WorkspaceContextSnapshot workspaceContextSnapshot) {
        try {
            return OBJECT_MAPPER.writeValueAsString(workspaceContextSnapshot);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to serialize workspace context.", exception);
        }
    }

    private List<Message> toChatRequestMessages(
            String prompt,
            List<ChatMessage> history,
            String userMessage
    ) {
        List<ChatMessage> normalizedHistory = history == null ? List.of() : history;
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(prompt));

        for (ChatMessage message : normalizedHistory) {
            Message translated = toSpringAiMessage(message);
            if (translated != null) {
                messages.add(translated);
            }
        }

        messages.add(new UserMessage(userMessage));
        return List.copyOf(messages);
    }

    private Message toSpringAiMessage(ChatMessage message) {
        String content = message.getContent() == null ? "" : message.getContent();
        ChatMessage.Role role = Objects.requireNonNull(message.getRole(), "history message role");
        return switch (role) {
            case SYSTEM -> new SystemMessage(content);
            case USER -> new UserMessage(content);
            case ASSISTANT -> new AssistantMessage(content);
            case TOOL -> null;
        };
    }
}
