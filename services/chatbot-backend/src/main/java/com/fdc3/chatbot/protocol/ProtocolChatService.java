package com.fdc3.chatbot.protocol;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.FrontendToolManifestEntry;
import com.fdc3.chatbot.model.GenerativeUIDirective;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.model.ProtocolFrontendTool;
import com.fdc3.chatbot.protocol.model.ProtocolMessage;
import com.fdc3.chatbot.protocol.model.ProtocolPart;
import com.fdc3.chatbot.protocol.model.ProtocolRunRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProtocolChatService {

    private final AgentService agentService;
    private final ObjectMapper objectMapper;

    public Runnable streamRun(
            ProtocolRunRequest request,
            UserCapabilityContext capabilityContext,
            Consumer<Map<String, Object>> onFrame,
            Consumer<Throwable> onError,
            Runnable onComplete
    ) {
        ProtocolInvocation invocation = ProtocolInvocation.from(request, objectMapper);

        onFrame.accept(Map.of(
                "type", "start",
                "runId", invocation.runId(),
                "conversationId", invocation.conversationId()
        ));
        onFrame.accept(Map.of(
                "type", "message-start",
                "messageId", invocation.assistantMessageId(),
                "role", "assistant"
        ));

        AtomicBoolean finished = new AtomicBoolean(false);
        AtomicBoolean textStarted = new AtomicBoolean(false);
        AtomicBoolean reasoningSummarySent = new AtomicBoolean(false);
        List<ToolCall> toolCalls = new ArrayList<>();
        Set<String> startedSteps = new java.util.HashSet<>();
        String[] pendingFinishReason = new String[]{"stop"};

        Runnable cancel = agentService.processProtocolMessageStreaming(
                invocation.conversationId(),
                invocation.userMessage(),
                capabilityContext,
                invocation.toolContext(),
                invocation.frontendToolsJson(),
                invocation.workspaceContext(),
                invocation.history(),
                token -> {
                    if (textStarted.compareAndSet(false, true)) {
                        onFrame.accept(Map.of(
                                "type", "text-start",
                                "messageId", invocation.assistantMessageId(),
                                "partId", "text-1"
                        ));
                    }
                    onFrame.accept(Map.of(
                            "type", "text-delta",
                            "messageId", invocation.assistantMessageId(),
                            "partId", "text-1",
                            "delta", token
                    ));
                },
                error -> {
                    if (!finished.compareAndSet(false, true)) {
                        return;
                    }
                    onFrame.accept(frameError(error));
                    onFrame.accept(Map.of(
                            "type", "finish",
                            "finishReason", "error",
                            "messageId", invocation.assistantMessageId()
                    ));
                    onError.accept(error);
                },
                () -> {
                    if (!finished.compareAndSet(false, true)) {
                        return;
                    }
                    if (textStarted.get()) {
                        onFrame.accept(Map.of(
                                "type", "text-end",
                                "messageId", invocation.assistantMessageId(),
                                "partId", "text-1"
                        ));
                    }
                    onFrame.accept(Map.of(
                            "type", "finish",
                            "finishReason", pendingFinishReason[0],
                            "messageId", invocation.assistantMessageId()
                    ));
                    onComplete.run();
                },
                plan -> emitPlanFrames(onFrame, reasoningSummarySent, plan),
                step -> emitStepFrames(onFrame, startedSteps, step),
                toolCall -> {
                    toolCalls.add(toolCall);
                    emitToolCallFrames(onFrame, toolCall);
                    if (toolCall.getExecutionTarget() == ToolCall.ExecutionTarget.FRONTEND) {
                        pendingFinishReason[0] = toolCall.isRequiresConfirmation() ? "action-required" : "tool-calls";
                        if (toolCall.isRequiresConfirmation()) {
                            onFrame.accept(Map.of(
                                    "type", "action-required",
                                    "actionId", toolCall.getId(),
                                    "actionType", "tool-approval",
                                    "title", "Approve " + toolCall.getName(),
                                    "description", "Approve the frontend tool before it executes.",
                                    "options", List.of(
                                            Map.of("id", "approve", "label", "Approve"),
                                            Map.of("id", "reject", "label", "Reject")
                                    )
                            ));
                        }
                    }
                },
                toolResult -> {
                    pendingFinishReason[0] = "stop";
                    emitToolResultFrames(onFrame, toolResult);
                    findGenerativeUiDirective(toolCalls, toolResult).ifPresent(directive ->
                            emitUiPartFrame(onFrame, invocation.assistantMessageId(), directive));
                }
        );

        return () -> {
            if (!finished.compareAndSet(false, true)) {
                return;
            }
            cancel.run();
        };
    }

    private void emitPlanFrames(
            Consumer<Map<String, Object>> onFrame,
            AtomicBoolean reasoningSummarySent,
            ExecutionPlanEvent plan
    ) {
        if (plan == null) {
            return;
        }
        if (reasoningSummarySent.compareAndSet(false, true) && plan.getSummary() != null && !plan.getSummary().isBlank()) {
            onFrame.accept(Map.of(
                    "type", "reasoning-summary",
                    "text", plan.getSummary()
            ));
        }
        onFrame.accept(Map.of(
                "type", "plan-available",
                "planId", nullToEmpty(plan.getPlanId()),
                "summary", nullToEmpty(plan.getSummary())
        ));
    }

    private void emitStepFrames(
            Consumer<Map<String, Object>> onFrame,
            Set<String> startedSteps,
            ExecutionStepEvent step
    ) {
        if (step == null || step.getStepId() == null) {
            return;
        }
        if (startedSteps.add(step.getStepId())) {
            LinkedHashMap<String, Object> startFrame = new LinkedHashMap<>();
            startFrame.put("type", "start-step");
            startFrame.put("stepId", step.getStepId());
            if (step.getSummary() != null && !step.getSummary().isBlank()) {
                startFrame.put("title", step.getSummary());
            }
            onFrame.accept(startFrame);
        }

        LinkedHashMap<String, Object> statusFrame = new LinkedHashMap<>();
        statusFrame.put("type", "step-status");
        statusFrame.put("stepId", step.getStepId());
        statusFrame.put("status", mapStepStatus(step.getStatus()));
        if (step.getSummary() != null && !step.getSummary().isBlank()) {
            statusFrame.put("detail", step.getSummary());
        }
        onFrame.accept(statusFrame);

        String normalizedStatus = mapStepStatus(step.getStatus());
        if ("completed".equals(normalizedStatus) || "failed".equals(normalizedStatus)) {
            onFrame.accept(Map.of(
                    "type", "finish-step",
                    "stepId", step.getStepId(),
                    "status", normalizedStatus
            ));
        }
    }

    private void emitToolCallFrames(Consumer<Map<String, Object>> onFrame, ToolCall toolCall) {
        onFrame.accept(Map.of(
                "type", "tool-input-start",
                "toolCallId", toolCall.getId(),
                "toolName", toolCall.getName(),
                "executionTarget", mapExecutionTarget(toolCall.getExecutionTarget())
        ));
        onFrame.accept(Map.of(
                "type", "tool-input-available",
                "toolCallId", toolCall.getId(),
                "input", toolCall.getArguments() == null ? Map.of() : toolCall.getArguments()
        ));
    }

    private void emitToolResultFrames(Consumer<Map<String, Object>> onFrame, ToolResult toolResult) {
        if (toolResult.getError() != null && !toolResult.getError().isBlank()) {
            onFrame.accept(Map.of(
                    "type", "tool-output-error",
                    "toolCallId", toolResult.getToolCallId(),
                    "error", toolResult.getError()
            ));
            return;
        }

        onFrame.accept(Map.of(
                "type", "tool-output-available",
                "toolCallId", toolResult.getToolCallId(),
                "output", toolResult.getResult() == null ? Map.of() : toolResult.getResult()
        ));
    }

    private void emitUiPartFrame(
            Consumer<Map<String, Object>> onFrame,
            String messageId,
            GenerativeUIDirective directive
    ) {
        LinkedHashMap<String, Object> frame = new LinkedHashMap<>();
        frame.put("type", "ui-part-available");
        frame.put("messageId", messageId);
        frame.put("cardType", directive.getName());
        frame.put("props", directive.getProps() == null ? Map.of() : directive.getProps());
        onFrame.accept(frame);
    }

    private Map<String, Object> frameError(Throwable error) {
        LinkedHashMap<String, Object> frame = new LinkedHashMap<>();
        frame.put("type", "error");
        frame.put("message", error.getMessage() == null ? error.getClass().getSimpleName() : error.getMessage());
        return frame;
    }

    private java.util.Optional<GenerativeUIDirective> findGenerativeUiDirective(
            List<ToolCall> toolCalls,
            ToolResult toolResult
    ) {
        return toolCalls.stream()
                .filter(toolCall -> Objects.equals(toolCall.getId(), toolResult.getToolCallId()))
                .findFirst()
                .flatMap(toolCall -> buildGenerativeUiDirective(toolCall, toolResult));
    }

    private java.util.Optional<GenerativeUIDirective> buildGenerativeUiDirective(
            ToolCall toolCall,
            ToolResult toolResult
    ) {
        if (toolResult.getError() != null || !(toolResult.getResult() instanceof Map<?, ?> resultMap)) {
            return java.util.Optional.empty();
        }

        if ("calculator".equals(toolCall.getName())) {
            Object expression = resultMap.get("expression");
            Object result = resultMap.get("result");
            if (expression == null || result == null) {
                return java.util.Optional.empty();
            }
            return java.util.Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Calculation Complete",
                            "content", expression + " = " + result,
                            "variant", "success"
                    ))
                    .build());
        }

        if ("get_weather".equals(toolCall.getName())) {
            Object location = resultMap.get("location");
            Object temperature = resultMap.get("temperature");
            Object temperatureUnit = resultMap.get("temperatureUnit");
            Object conditions = resultMap.get("conditions");
            if (location == null || temperature == null || temperatureUnit == null || conditions == null) {
                return java.util.Optional.empty();
            }
            return java.util.Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Weather Summary",
                            "content", location + ": " + temperature + " " + temperatureUnit + ", " + conditions,
                            "variant", "default"
                    ))
                    .build());
        }

        if ("get_current_time".equals(toolCall.getName())) {
            Object timezone = resultMap.get("timezone");
            Object formatted = resultMap.get("formatted");
            if (timezone == null || formatted == null) {
                return java.util.Optional.empty();
            }
            return java.util.Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Current Time",
                            "content", timezone + ": " + formatted,
                            "variant", "info"
                    ))
                    .build());
        }

        if ("get_weather_history".equals(toolCall.getName())) {
            Object location = resultMap.get("location");
            Object date = resultMap.get("date");
            Object condition = resultMap.get("condition");
            Object highC = resultMap.get("highC");
            Object lowC = resultMap.get("lowC");
            Object summary = resultMap.get("summary");
            if (location == null || date == null) {
                return java.util.Optional.empty();
            }
            LinkedHashMap<String, Object> cardProps = new LinkedHashMap<>();
            cardProps.put("title", "Historical Weather");
            cardProps.put("content", summary != null ? summary.toString() : location + " on " + date);
            cardProps.put("variant", "info");
            if (location != null) cardProps.put("location", location);
            if (date != null) cardProps.put("date", date);
            if (condition != null) cardProps.put("condition", condition);
            if (highC != null) cardProps.put("highC", highC);
            if (lowC != null) cardProps.put("lowC", lowC);
            return java.util.Optional.of(GenerativeUIDirective.builder()
                    .name("weather-summary")
                    .toolCallId(toolCall.getId())
                    .props(cardProps)
                    .build());
        }

        if ("resolve_relative_date".equals(toolCall.getName())) {
            Object resolvedDate = resultMap.get("resolvedDate");
            Object readable = resultMap.get("readable");
            Object dayOfWeek = resultMap.get("dayOfWeek");
            if (resolvedDate == null) {
                return java.util.Optional.empty();
            }
            return java.util.Optional.of(GenerativeUIDirective.builder()
                    .name("Card")
                    .toolCallId(toolCall.getId())
                    .props(Map.of(
                            "title", "Date Resolved",
                            "content", resolvedDate + " (" + (readable != null ? readable : dayOfWeek) + ")",
                            "variant", "info"
                    ))
                    .build());
        }

        return java.util.Optional.empty();
    }

    private String mapStepStatus(String status) {
        if (status == null || status.isBlank()) {
            return "running";
        }
        String normalized = status.trim().toLowerCase();
        return switch (normalized) {
            case "completed", "complete", "done", "success" -> "completed";
            case "failed", "error" -> "failed";
            case "pending" -> "pending";
            default -> "running";
        };
    }

    private String mapExecutionTarget(ToolCall.ExecutionTarget executionTarget) {
        if (executionTarget == ToolCall.ExecutionTarget.FRONTEND) {
            return "frontend";
        }
        return "backend";
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    record ProtocolInvocation(
            String conversationId,
            String runId,
            String assistantMessageId,
            String userMessage,
            List<ChatMessage> history,
            String toolContext,
            String frontendToolsJson,
            WorkspaceContextSnapshot workspaceContext
    ) {
        static ProtocolInvocation from(ProtocolRunRequest request, ObjectMapper objectMapper) {
            List<ProtocolMessage> messages = request.getMessages() == null ? List.of() : request.getMessages();
            if (messages.isEmpty()) {
                throw new IllegalArgumentException("messages must not be empty");
            }

            ResumableToolContext resumableToolContext = findLatestResumableToolContext(messages, objectMapper);
            int currentUserIndex = resumableToolContext != null
                    ? findPrecedingUserIndex(messages, resumableToolContext.assistantMessageIndex())
                    : findLastUserIndex(messages);

            if (currentUserIndex < 0) {
                throw new IllegalArgumentException("messages must contain a user message for the active turn");
            }

            ProtocolMessage currentUserMessage = messages.get(currentUserIndex);
            String userMessage = collectText(currentUserMessage);
            if (userMessage.isBlank()) {
                throw new IllegalArgumentException("active user message must contain text");
            }

            List<ChatMessage> history = toHistory(messages.subList(0, currentUserIndex));
            String conversationId = request.getConversationId() == null || request.getConversationId().isBlank()
                    ? UUID.randomUUID().toString()
                    : request.getConversationId();
            String runId = request.getRunId() == null || request.getRunId().isBlank()
                    ? UUID.randomUUID().toString()
                    : request.getRunId();
            String assistantMessageId = "msg_asst_" + UUID.randomUUID();

            return new ProtocolInvocation(
                    conversationId,
                    runId,
                    assistantMessageId,
                    userMessage,
                    history,
                    resumableToolContext == null ? null : resumableToolContext.toolContextJson(),
                    serializeFrontendTools(request, objectMapper),
                    toWorkspaceContext(request)
            );
        }

        private static List<ChatMessage> toHistory(List<ProtocolMessage> messages) {
            List<ChatMessage> history = new ArrayList<>();
            for (ProtocolMessage message : messages) {
                String content = collectText(message);
                if (content.isBlank()) {
                    continue;
                }
                ChatMessage.Role role = switch (String.valueOf(message.getRole())) {
                    case "assistant" -> ChatMessage.Role.ASSISTANT;
                    case "user" -> ChatMessage.Role.USER;
                    default -> null;
                };
                if (role == null) {
                    continue;
                }
                history.add(ChatMessage.builder()
                        .id(message.getId() == null ? UUID.randomUUID().toString() : message.getId())
                        .role(role)
                        .content(content)
                        .timestamp(Instant.now())
                        .build());
            }
            return List.copyOf(history);
        }

        private static String serializeFrontendTools(ProtocolRunRequest request, ObjectMapper objectMapper) {
            if (request.getContext() == null || request.getContext().getFrontendTools() == null
                    || request.getContext().getFrontendTools().isEmpty()) {
                return null;
            }

            List<FrontendToolManifestEntry> manifest = request.getContext().getFrontendTools().stream()
                    .map(ProtocolInvocation::toFrontendToolManifestEntry)
                    .toList();
            try {
                return objectMapper.writeValueAsString(manifest);
            } catch (JsonProcessingException exception) {
                throw new IllegalArgumentException("Failed to serialize frontendTools", exception);
            }
        }

        private static FrontendToolManifestEntry toFrontendToolManifestEntry(ProtocolFrontendTool tool) {
            boolean humanInTheLoop = "manual".equalsIgnoreCase(tool.getInteractionMode());
            return FrontendToolManifestEntry.builder()
                    .name(tool.getName())
                    .description(tool.getDescription())
                    .inputSchema(tool.getParameters() == null ? Map.of() : tool.getParameters())
                    .humanInTheLoop(humanInTheLoop)
                    .hasRender(true)
                    .build();
        }

        private static WorkspaceContextSnapshot toWorkspaceContext(ProtocolRunRequest request) {
            if (request.getContext() == null || request.getContext().getWorkspace() == null) {
                return null;
            }

            return WorkspaceContextSnapshot.builder()
                    .workspaceId(request.getContext().getWorkspace().getActiveWorkspaceId())
                    .activeAppId(request.getContext().getWorkspace().getActiveAppId())
                    .build();
        }

        private static ResumableToolContext findLatestResumableToolContext(
                List<ProtocolMessage> messages,
                ObjectMapper objectMapper
        ) {
            for (int messageIndex = messages.size() - 1; messageIndex >= 0; messageIndex--) {
                ProtocolMessage message = messages.get(messageIndex);
                if (!"assistant".equals(message.getRole()) || message.getParts() == null) {
                    continue;
                }
                for (int partIndex = message.getParts().size() - 1; partIndex >= 0; partIndex--) {
                    ProtocolPart part = message.getParts().get(partIndex);
                    if (!"tool-call".equals(part.getType()) || !"frontend".equalsIgnoreCase(part.getExecutionTarget())) {
                        continue;
                    }
                    boolean completed = "output-available".equalsIgnoreCase(part.getState())
                            || "output-error".equalsIgnoreCase(part.getState());
                    if (!completed) {
                        continue;
                    }
                    int userIndex = findPrecedingUserIndex(messages, messageIndex);
                    if (userIndex < 0) {
                        throw new IllegalArgumentException("frontend tool result must have a preceding user message");
                    }
                    String originalUserMessage = collectText(messages.get(userIndex));
                    FrontendToolContinuation continuation = FrontendToolContinuation.builder()
                            .originalUserMessage(originalUserMessage)
                            .toolCallId(part.getToolCallId())
                            .toolName(part.getToolName())
                            .args(jsonNodeToMap(objectMapper, part.getInput()))
                            .result(jsonNodeToObject(objectMapper, part.getOutput()))
                            .isError("output-error".equalsIgnoreCase(part.getState()))
                            .error(part.getError())
                            .build();
                    try {
                        return new ResumableToolContext(messageIndex, objectMapper.writeValueAsString(continuation));
                    } catch (JsonProcessingException exception) {
                        throw new IllegalArgumentException("Failed to serialize tool continuation", exception);
                    }
                }
            }
            return null;
        }

        private static int findLastUserIndex(List<ProtocolMessage> messages) {
            for (int index = messages.size() - 1; index >= 0; index--) {
                if ("user".equals(messages.get(index).getRole())) {
                    return index;
                }
            }
            return -1;
        }

        private static int findPrecedingUserIndex(List<ProtocolMessage> messages, int beforeIndex) {
            for (int index = beforeIndex - 1; index >= 0; index--) {
                if ("user".equals(messages.get(index).getRole())) {
                    return index;
                }
            }
            return -1;
        }

        private static String collectText(ProtocolMessage message) {
            if (message.getParts() == null || message.getParts().isEmpty()) {
                return "";
            }
            StringBuilder builder = new StringBuilder();
            for (ProtocolPart part : message.getParts()) {
                if (part == null || part.getType() == null) {
                    continue;
                }
                if (Set.of("text", "reasoning-summary").contains(part.getType()) && part.getText() != null) {
                    appendSegment(builder, part.getText());
                    continue;
                }
                if ("plan".equals(part.getType()) && part.getSummary() != null) {
                    appendSegment(builder, part.getSummary());
                    continue;
                }
                if ("error".equals(part.getType()) && part.getText() != null) {
                    appendSegment(builder, part.getText());
                }
            }
            return builder.toString().trim();
        }

        private static void appendSegment(StringBuilder builder, String value) {
            if (value == null || value.isBlank()) {
                return;
            }
            if (builder.length() > 0) {
                builder.append('\n');
            }
            builder.append(value.trim());
        }

        private static Map<String, Object> jsonNodeToMap(ObjectMapper objectMapper, JsonNode node) {
            if (node == null || node.isNull()) {
                return Map.of();
            }
            return objectMapper.convertValue(node, objectMapper.getTypeFactory().constructMapType(LinkedHashMap.class, String.class, Object.class));
        }

        private static Object jsonNodeToObject(ObjectMapper objectMapper, JsonNode node) {
            if (node == null || node.isNull()) {
                return Map.of();
            }
            return objectMapper.convertValue(node, Object.class);
        }
    }

    private record ResumableToolContext(int assistantMessageIndex, String toolContextJson) {
    }
}
