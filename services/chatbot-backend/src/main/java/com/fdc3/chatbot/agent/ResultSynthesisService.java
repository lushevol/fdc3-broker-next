package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.prompt.ResultSynthesisPromptFactory;
import com.fdc3.chatbot.model.ToolResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.model.StreamingChatModel;
import org.springframework.ai.chat.prompt.Prompt;

import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
public class ResultSynthesisService {
    private static final String SYNTHESIS_REQUEST =
            "Write the final assistant response using only the executed results.";

    private final ChatModel chatModel;
    private final StreamingChatModel streamingChatModel;
    private final ResultSynthesisPromptFactory promptFactory;

    public ResultSynthesisService() {
        this(null, null, new ResultSynthesisPromptFactory());
    }

    public ResultSynthesisService(
            ChatModel chatModel,
            ResultSynthesisPromptFactory promptFactory
    ) {
        this(chatModel, null, promptFactory);
    }

    public ResultSynthesisService(
            ChatModel chatModel,
            StreamingChatModel streamingChatModel,
            ResultSynthesisPromptFactory promptFactory
    ) {
        this.chatModel = chatModel;
        this.streamingChatModel = streamingChatModel;
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
                org.springframework.ai.chat.model.ChatResponse response = chatModel.call(new Prompt(
                        java.util.List.of(
                                new SystemMessage(prompt),
                                new UserMessage(SYNTHESIS_REQUEST)
                        )
                ));

                Generation generation = response.getResults().isEmpty() ? null : response.getResults().get(0);
                String modelText = generation == null || generation.getOutput() == null
                        ? null
                        : generation.getOutput().getText();
                if (modelText != null && !modelText.isBlank()) {
                    return modelText.trim();
                }
            } catch (Exception exception) {
                log.debug("Result synthesis model call failed, using deterministic fallback", exception);
            }
        }

        if (transcript == null || transcript.toolResults().isEmpty()) {
            return defaultSummary(decision);
        }

        String transcriptError = firstTranscriptError(transcript);
        if (transcriptError != null) {
            return transcriptError;
        }

        ToolResult finalResult = transcript.toolResults().get(transcript.toolResults().size() - 1);
        if (!(finalResult.getResult() instanceof Map<?, ?> rawResult)) {
            return defaultSummary(decision);
        }

        Object application = rawResult.get("application");
        Object from = firstNonBlank(rawResult.get("from"), rawResult.get("startTime"));
        Object to = firstNonBlank(rawResult.get("to"), rawResult.get("endTime"));
        Object uv = firstNonBlank(rawResult.get("uv"), rawResult.get("uvTotal"));
        Object points = rawResult.get("points");

        if (application != null && from != null && to != null && uv != null) {
            return application + " visited users from " + from + " to " + to + ": UV " + uv + ".";
        }

        if (application != null && from != null && to != null && points instanceof java.util.List<?> pointList) {
            return application + " hourly visited user trend from " + from + " to " + to
                    + " returned " + pointList.size() + " points.";
        }

        return defaultSummary(decision);
    }

    public void synthesizeStreaming(
            String userMessage,
            AgentDecision decision,
            ExecutionTranscript transcript,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            Runnable onComplete
    ) {
        if (streamingChatModel == null) {
            emitFallbackSynthesis(userMessage, decision, transcript, onNext, onComplete);
            return;
        }

        try {
            String prompt = promptFactory.build(userMessage, decision, transcript);
            StringBuilder streamedText = new StringBuilder();
            streamingChatModel.stream(new Prompt(
                    java.util.List.of(
                            new SystemMessage(prompt),
                            new UserMessage(SYNTHESIS_REQUEST)
                    )
            )).subscribe(
                    response -> {
                        Generation generation = response.getResults().isEmpty() ? null : response.getResults().get(0);
                        String deltaText = generation == null || generation.getOutput() == null
                                ? null
                                : generation.getOutput().getText();
                        if (deltaText != null && !deltaText.isEmpty()) {
                            streamedText.append(deltaText);
                            onNext.accept(deltaText);
                        }
                    },
                    onError,
                    () -> {
                        emitRemainingAssistantText(streamedText, streamedText.toString(), onNext);
                        onComplete.run();
                    }
            );
        } catch (Exception exception) {
            onError.accept(exception);
        }
    }

    private String firstTranscriptError(ExecutionTranscript transcript) {
        return transcript.toolResults().stream()
                .map(ToolResult::getError)
                .filter(Objects::nonNull)
                .filter(error -> !error.isBlank())
                .findFirst()
                .orElse(null);
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

    private void emitFallbackSynthesis(
            String userMessage,
            AgentDecision decision,
            ExecutionTranscript transcript,
            java.util.function.Consumer<String> onNext,
            Runnable onComplete
    ) {
        String text = synthesize(userMessage, decision, transcript);
        if (text != null && !text.isBlank()) {
            onNext.accept(text);
        }
        onComplete.run();
    }

    private void emitRemainingAssistantText(
            StringBuilder streamedText,
            String completeText,
            java.util.function.Consumer<String> onNext
    ) {
        if (completeText == null || completeText.isBlank()) {
            return;
        }
        String alreadyStreamed = streamedText.toString();
        if (completeText.startsWith(alreadyStreamed)) {
            String suffix = completeText.substring(alreadyStreamed.length());
            if (!suffix.isEmpty()) {
                onNext.accept(suffix);
            }
            return;
        }
        if (alreadyStreamed.isBlank()) {
            onNext.accept(completeText);
        }
    }
}
