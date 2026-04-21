package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.agent.prompt.ResultSynthesisPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecision;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

class ResultSynthesisServiceTest {

    @Test
    void shouldUseModelOutputForSuccessfulTranscript() {
        CapturingChatModel chatModel = new CapturingChatModel(
                "LLM summary: cashflow blotter visited users were 30."
        );
        ResultSynthesisService service = new ResultSynthesisService(
                chatModel,
                new ResultSynthesisPromptFactory()
        );

        String result = service.synthesize(
                "Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                successfulTranscript()
        );

        assertThat(result).isEqualTo("LLM summary: cashflow blotter visited users were 30.");
        ChatRequest request = chatModel.capturedRequest();
        assertThat(request.messages()).hasSize(2);
        assertThat(request.messages().get(0)).isInstanceOf(SystemMessage.class);
        assertThat(((SystemMessage) request.messages().get(0)).text())
                .contains("Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08")
                .contains("application-visited-user-count")
                .contains("visited_user_count_by_application")
                .contains("\"uv\":30");
        assertThat(request.messages().get(1)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(1)).singleText()).isEqualTo(
                "Write the final assistant response using only the executed results."
        );
    }

    @Test
    void shouldUseModelOutputForFailureTranscript() {
        CapturingChatModel chatModel = new CapturingChatModel(
                "LLM summary: I couldn't complete the analytics request because the provider timed out."
        );
        ResultSynthesisService service = new ResultSynthesisService(
                chatModel,
                new ResultSynthesisPromptFactory()
        );

        String result = service.synthesize(
                "Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                failedTranscript()
        );

        assertThat(result).isEqualTo(
                "LLM summary: I couldn't complete the analytics request because the provider timed out."
        );
        ChatRequest request = chatModel.capturedRequest();
        assertThat(((SystemMessage) request.messages().get(0)).text())
                .contains("provider timed out")
                .contains("\"error\":\"provider timed out\"");
    }

    @Test
    void shouldStreamModelOutputForSuccessfulTranscript() throws Exception {
        CapturingStreamingChatModel streamingChatModel = new CapturingStreamingChatModel(
                List.of("cashflow blotter visited users ", "were 30.")
        );
        ResultSynthesisService service = new ResultSynthesisService(
                null,
                streamingChatModel,
                new ResultSynthesisPromptFactory()
        );
        List<String> streamedTokens = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        service.synthesizeStreaming(
                "Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                successfulTranscript(),
                streamedTokens::add,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown
        );

        assertThat(completed.await(1, TimeUnit.SECONDS)).isTrue();
        assertThat(streamedTokens).containsExactly("cashflow blotter visited users ", "were 30.");
        ChatRequest request = streamingChatModel.capturedRequest();
        assertThat(request.messages()).hasSize(2);
        assertThat(request.messages().get(0)).isInstanceOf(SystemMessage.class);
        assertThat(((SystemMessage) request.messages().get(0)).text())
                .contains("Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08")
                .contains("\"uv\":30");
    }

    @Test
    void shouldReturnFailureOrientedFallbackWhenNoModelAndTranscriptFailed() {
        ResultSynthesisService service = new ResultSynthesisService();

        String result = service.synthesize(
                "Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                failedTranscript()
        );

        assertThat(result).contains("provider timed out");
        assertThat(result).doesNotContain("Completed the requested action.");
    }

    @Test
    void shouldReturnFailureOrientedFallbackWhenEarlierStepFailedButLastStepSucceeded() {
        ResultSynthesisService service = new ResultSynthesisService();

        String result = service.synthesize(
                "Get visited users for cashflow blotter from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                partialFailureTranscript()
        );

        assertThat(result).contains("provider timed out");
        assertThat(result).doesNotContain("PV");
        assertThat(result).doesNotContain("Completed the requested action.");
    }

    private static AgentDecision analyticsPlanDecision() {
        return new AgentDecision(
                AgentDecisionType.PLAN,
                null,
                null,
                new AgentPlan(List.of(new AgentPlanStep(
                        "application-visited-user-count",
                        Map.of(
                                "application", "cashflow blotter",
                                "startTime", "2026-04-01",
                                "endTime", "2026-04-08"
                        )
                )))
        );
    }

    private static ExecutionTranscript successfulTranscript() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("visited_user_count_by_application")
                .arguments(Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ))
                .status(ToolCall.ToolStatus.COMPLETED)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .toolName("visited_user_count_by_application")
                .result(Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08",
                        "uv", 30
                ))
                .build();
        return new ExecutionTranscript(validatedPlan(), List.of(toolCall), List.of(toolResult));
    }

    private static ExecutionTranscript failedTranscript() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("visited_user_count_by_application")
                .arguments(Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ))
                .status(ToolCall.ToolStatus.FAILED)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .toolName("visited_user_count_by_application")
                .error("provider timed out")
                .build();
        return new ExecutionTranscript(validatedPlan(), List.of(toolCall), List.of(toolResult));
    }

    private static ExecutionTranscript partialFailureTranscript() {
        ToolCall failedToolCall = ToolCall.builder()
                .id("tool-1")
                .name("visited_user_count_by_application")
                .arguments(Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ))
                .status(ToolCall.ToolStatus.FAILED)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build();
        ToolCall successfulToolCall = ToolCall.builder()
                .id("tool-2")
                .name("visited_user_count_by_application")
                .arguments(Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ))
                .status(ToolCall.ToolStatus.COMPLETED)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build();
        ToolResult failedToolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .toolName("visited_user_count_by_application")
                .error("provider timed out")
                .build();
        ToolResult successfulToolResult = ToolResult.builder()
                .toolCallId("tool-2")
                .toolName("visited_user_count_by_application")
                .result(Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08",
                        "uv", 30
                ))
                .build();
        return new ExecutionTranscript(
                validatedPlan(),
                List.of(failedToolCall, successfulToolCall),
                List.of(failedToolResult, successfulToolResult)
        );
    }

    private static ValidatedExecutionPlan validatedPlan() {
        ResolvedCapability capability = ResolvedCapability.builder()
                .capabilityId("application-visited-user-count")
                .providerId("elasticsearch-analytics")
                .targetName("visited_user_count_by_application")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("application", "startTime", "endTime"))
                .build();

        ValidatedExecutionStep step = new ValidatedExecutionStep(
                capability.getCapabilityId(),
                capability,
                Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ),
                PolicyDecision.builder()
                        .decisionType(PolicyDecisionType.ALLOW)
                        .build()
        );

        return new ValidatedExecutionPlan(List.of(step));
    }

    private static final class CapturingChatModel implements ChatModel {

        private final String responseText;
        private ChatRequest capturedRequest;

        private CapturingChatModel(String responseText) {
            this.responseText = responseText;
        }

        @Override
        public ChatResponse doChat(ChatRequest chatRequest) {
            this.capturedRequest = chatRequest;
            return ChatResponse.builder()
                    .aiMessage(AiMessage.from(responseText))
                    .build();
        }

        private ChatRequest capturedRequest() {
            return Objects.requireNonNull(capturedRequest, "Chat request was not captured");
        }
    }

    private static final class CapturingStreamingChatModel implements StreamingChatModel {

        private final List<String> partialTokens;
        private ChatRequest capturedRequest;

        private CapturingStreamingChatModel(List<String> partialTokens) {
            this.partialTokens = partialTokens;
        }

        @Override
        public void chat(ChatRequest chatRequest, StreamingChatResponseHandler handler) {
            this.capturedRequest = chatRequest;
            StringBuilder fullText = new StringBuilder();
            for (String token : partialTokens) {
                fullText.append(token);
                handler.onPartialResponse(token);
            }
            handler.onCompleteResponse(ChatResponse.builder()
                    .aiMessage(AiMessage.from(fullText.toString()))
                    .build());
        }

        private ChatRequest capturedRequest() {
            return Objects.requireNonNull(capturedRequest, "Chat request was not captured");
        }
    }
}
