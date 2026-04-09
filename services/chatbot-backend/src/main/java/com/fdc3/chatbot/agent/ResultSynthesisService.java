package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.prompt.ResultSynthesisPromptFactory;
import com.fdc3.chatbot.model.ToolResult;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

@Service
public class ResultSynthesisService {
    private static final String SYNTHESIS_REQUEST =
            "Write the final assistant response using only the executed results.";

    private final ChatModel chatModel;
    private final ResultSynthesisPromptFactory promptFactory;

    public ResultSynthesisService() {
        this(null, new ResultSynthesisPromptFactory());
    }

    public ResultSynthesisService(
            ChatModel chatModel,
            ResultSynthesisPromptFactory promptFactory
    ) {
        this.chatModel = chatModel;
        this.promptFactory = Objects.requireNonNull(promptFactory, "promptFactory");
    }

    public String synthesize(
            String userMessage,
            AgentDecision decision,
            ExecutionTranscript transcript
    ) {
        if (chatModel != null) {
            try {
                String prompt = promptFactory.build(userMessage, decision, transcript);
                ChatResponse response = chatModel.chat(ChatRequest.builder()
                        .messages(java.util.List.of(
                                SystemMessage.from(prompt),
                                UserMessage.from(SYNTHESIS_REQUEST)
                        ))
                        .build());

                String modelText = response.aiMessage() == null ? null : response.aiMessage().text();
                if (modelText != null && !modelText.isBlank()) {
                    return modelText.trim();
                }
            } catch (Exception ignored) {
                // Deterministic fallback is resilience only when synthesis model output is unavailable.
            }
        }

        if (transcript == null || transcript.toolResults().isEmpty()) {
            return defaultSummary(decision);
        }

        ToolResult finalResult = transcript.toolResults().get(transcript.toolResults().size() - 1);
        if (finalResult.getError() != null && !finalResult.getError().isBlank()) {
            return finalResult.getError();
        }

        if (!(finalResult.getResult() instanceof Map<?, ?> rawResult)) {
            return defaultSummary(decision);
        }

        Object appName = firstNonBlank(
                rawResult.get("appName"),
                rawResult.get("appId"),
                rawResult.get("filterValue")
        );
        Object from = firstNonBlank(rawResult.get("from"), rawResult.get("startTime"));
        Object to = firstNonBlank(rawResult.get("to"), rawResult.get("endTime"));
        Object pv = firstNonBlank(rawResult.get("pv"), rawResult.get("pvTotal"));
        Object uv = firstNonBlank(rawResult.get("uv"), rawResult.get("uvTotal"));

        if (appName != null && from != null && to != null && pv != null && uv != null) {
            return appName + " usage from " + from + " to " + to + ": PV " + pv + ", UV " + uv + ".";
        }

        return defaultSummary(decision);
    }

    private String defaultSummary(AgentDecision decision) {
        if (decision != null && decision.assistantText() != null && !decision.assistantText().isBlank()) {
            return decision.assistantText();
        }
        return "Completed the requested action.";
    }

    private Object firstNonBlank(Object... values) {
        for (Object value : values) {
            if (value instanceof String text) {
                if (!text.isBlank()) {
                    return text;
                }
                continue;
            }
            if (Objects.nonNull(value)) {
                return value;
            }
        }
        return null;
    }
}
