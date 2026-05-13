package com.fdc3.chatbot.protocol;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.AgentService;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.files.UploadedFileContextBuilder;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.FrontendToolContinuation;
import com.fdc3.chatbot.model.FrontendToolManifestEntry;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.protocol.model.ChatToolSource;
import com.fdc3.chatbot.protocol.model.ProtocolFrontendTool;
import com.fdc3.chatbot.protocol.model.ProtocolMessage;
import com.fdc3.chatbot.protocol.model.ProtocolPart;
import com.fdc3.chatbot.protocol.model.ProtocolRunRequest;
import com.fdc3.chatbot.protocol.model.ProtocolToolDescriptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProtocolChatService {
    private static final Set<String> TEXTUAL_PART_TYPES = Set.of("text", "reasoning-summary");

    private final AgentService agentService;
    private final ObjectMapper objectMapper;
    private final UploadedFileContextBuilder uploadedFileContextBuilder;

    public Runnable streamRun(
            ProtocolRunRequest request,
            UserCapabilityContext capabilityContext,
            Consumer<Map<String, Object>> onFrame,
            Consumer<Throwable> onError,
            Runnable onComplete
    ) {
        ProtocolInvocation invocation = ProtocolInvocation.from(request, objectMapper, uploadedFileContextBuilder);

        List<ProtocolToolDescriptor> allTools = mergeTools(request);
        Map<String, ProtocolToolDescriptor> toolLookup = new java.util.HashMap<>();
        for (ProtocolToolDescriptor tool : allTools) {
            toolLookup.put(tool.getName(), tool);
        }

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
                    enrichToolCallFromDescriptor(toolCall, toolLookup);
                    toolCalls.add(toolCall);
                    emitToolCallFrames(onFrame, toolCall);
                    emitUserQuestionFrame(onFrame, toolCall);
                    if (toolCall.getSource() == ChatToolSource.HUMAN || (toolCall.getSource() == null && toolCall.isRequiresConfirmation())) {
                        pendingFinishReason[0] = "action-required";
                        onFrame.accept(Map.of(
                                "type", "action-required",
                                "actionId", toolCall.getId(),
                                "actionType", "tool-approval",
                                "title", "Approve " + toolCall.getName(),
                                "description", "Approve the tool before it executes.",
                                "options", List.of(
                                        Map.of("id", "approve", "label", "Approve"),
                                        Map.of("id", "reject", "label", "Reject")
                                )
                        ));
                    } else if (toolCall.getSource() == ChatToolSource.FRONTEND || (toolCall.getSource() == null && toolCall.getExecutionTarget() == ToolCall.ExecutionTarget.FRONTEND)) {
                        pendingFinishReason[0] = "tool-calls";
                    }
                },
                toolResult -> {
                    pendingFinishReason[0] = "stop";
                    ToolCall matchingCall = toolCalls.stream()
                            .filter(tc -> tc.getId() != null && tc.getId().equals(toolResult.getToolCallId()))
                            .findFirst()
                            .orElse(null);
                    emitToolResultFrames(onFrame, toolResult, matchingCall);
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
        LinkedHashMap<String, Object> startFrame = new LinkedHashMap<>();
        startFrame.put("type", "tool-input-start");
        startFrame.put("toolCallId", toolCall.getId());
        startFrame.put("toolName", toolCall.getName());
        if (toolCall.getSource() != null) {
            startFrame.put("source", mapSourceToString(toolCall.getSource()));
        }
        if (toolCall.getProviderId() != null) {
            startFrame.put("providerId", toolCall.getProviderId());
        }
        startFrame.put("executionTarget", mapExecutionTarget(toolCall.getExecutionTarget()));
        onFrame.accept(startFrame);

        LinkedHashMap<String, Object> availableFrame = new LinkedHashMap<>();
        availableFrame.put("type", "tool-input-available");
        availableFrame.put("toolCallId", toolCall.getId());
        availableFrame.put("input", toolCall.getArguments() == null ? Map.of() : toolCall.getArguments());
        if (toolCall.getSource() != null) {
            availableFrame.put("source", mapSourceToString(toolCall.getSource()));
        }
        if (toolCall.getProviderId() != null) {
            availableFrame.put("providerId", toolCall.getProviderId());
        }
        onFrame.accept(availableFrame);
    }

    private void emitToolResultFrames(Consumer<Map<String, Object>> onFrame, ToolResult toolResult, ToolCall toolCall) {
        if (toolResult.getError() != null && !toolResult.getError().isBlank()) {
            LinkedHashMap<String, Object> errorFrame = new LinkedHashMap<>();
            errorFrame.put("type", "tool-output-error");
            errorFrame.put("toolCallId", toolResult.getToolCallId());
            errorFrame.put("error", toolResult.getError());
            if (toolCall != null && toolCall.getSource() != null) {
                errorFrame.put("source", mapSourceToString(toolCall.getSource()));
            }
            if (toolCall != null && toolCall.getProviderId() != null) {
                errorFrame.put("providerId", toolCall.getProviderId());
            }
            onFrame.accept(errorFrame);
            return;
        }

        LinkedHashMap<String, Object> outputFrame = new LinkedHashMap<>();
        outputFrame.put("type", "tool-output-available");
        outputFrame.put("toolCallId", toolResult.getToolCallId());
        outputFrame.put("output", toolResult.getResult() == null ? Map.of() : toolResult.getResult());
        if (toolCall != null && toolCall.getSource() != null) {
            outputFrame.put("source", mapSourceToString(toolCall.getSource()));
        }
        if (toolCall != null && toolCall.getProviderId() != null) {
            outputFrame.put("providerId", toolCall.getProviderId());
        }
        onFrame.accept(outputFrame);
    }

    private void emitUserQuestionFrame(
            Consumer<Map<String, Object>> onFrame,
            ToolCall toolCall
    ) {
        if (!"AskUserQuestionTool".equals(toolCall.getName())) {
            return;
        }
        Map<String, Object> args = toolCall.getArguments();
        if (args == null || args.isEmpty()) {
            return;
        }
        Object rawQuestions = args.get("questions");
        if (!(rawQuestions instanceof List<?> questionList) || questionList.isEmpty()) {
            return;
        }
        LinkedHashMap<String, Object> frame = new LinkedHashMap<>();
        frame.put("type", "user_question");
        frame.put("toolCallId", toolCall.getId());
        frame.put("questions", questionList);
        onFrame.accept(frame);
    }

    private Map<String, Object> frameError(Throwable error) {
        LinkedHashMap<String, Object> frame = new LinkedHashMap<>();
        frame.put("type", "error");
        frame.put("message", error.getMessage() == null ? error.getClass().getSimpleName() : error.getMessage());
        return frame;
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

    static String mapSourceToString(ChatToolSource source) {
        return switch (source) {
            case FRONTEND -> "frontend";
            case BACKEND -> "backend";
            case HUMAN -> "human";
            case MCP -> "mcp";
        };
    }

    static String mapSourceToExecutionTarget(ChatToolSource source) {
        return switch (source) {
            case FRONTEND, HUMAN -> "frontend";
            case BACKEND, MCP -> "backend";
        };
    }

    private void enrichToolCallFromDescriptor(ToolCall toolCall, Map<String, ProtocolToolDescriptor> toolLookup) {
        if (toolCall.getSource() != null) {
            return;
        }
        ProtocolToolDescriptor descriptor = toolLookup.get(toolCall.getName());
        if (descriptor != null) {
            toolCall.setSource(descriptor.getSource());
            if (descriptor.getProviderId() != null) {
                toolCall.setProviderId(descriptor.getProviderId());
            }
            if (Boolean.TRUE.equals(descriptor.getRequiresConfirmation())) {
                toolCall.setRequiresConfirmation(true);
            }
            if (descriptor.getSource() == ChatToolSource.HUMAN) {
                toolCall.setExecutionTarget(ToolCall.ExecutionTarget.FRONTEND);
            } else if (descriptor.getSource() == ChatToolSource.FRONTEND) {
                toolCall.setExecutionTarget(ToolCall.ExecutionTarget.FRONTEND);
            } else {
                toolCall.setExecutionTarget(ToolCall.ExecutionTarget.BACKEND);
            }
        }
    }

    List<ProtocolToolDescriptor> mergeTools(ProtocolRunRequest request) {
        List<ProtocolToolDescriptor> merged = new ArrayList<>();

        if (request.getContext() != null && request.getContext().getTools() != null) {
            merged.addAll(request.getContext().getTools());
        }

        if (request.getContext() != null && request.getContext().getFrontendTools() != null) {
            for (ProtocolFrontendTool legacy : request.getContext().getFrontendTools()) {
                boolean alreadyPresent = merged.stream()
                        .anyMatch(t -> t.getName().equals(legacy.getName()));
                if (!alreadyPresent) {
                    merged.add(ProtocolToolDescriptor.builder()
                            .name(legacy.getName())
                            .source("manual".equalsIgnoreCase(legacy.getInteractionMode())
                                    ? ChatToolSource.HUMAN : ChatToolSource.FRONTEND)
                            .description(legacy.getDescription())
                            .parameters(legacy.getParameters() != null
                                    ? objectMapper.valueToTree(legacy.getParameters()) : null)
                            .requiresConfirmation("manual".equalsIgnoreCase(legacy.getInteractionMode()))
                            .build());
                }
            }
        }

        return merged;
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
        static ProtocolInvocation from(
                ProtocolRunRequest request,
                ObjectMapper objectMapper,
                UploadedFileContextBuilder uploadedFileContextBuilder
        ) {
            List<ProtocolMessage> messages = request.getMessages() == null ? List.of() : request.getMessages();
            if (messages.isEmpty()) {
                throw new IllegalArgumentException("messages must not be empty");
            }

            int lastUserIndex = findLastUserIndex(messages);
            ResumableToolContext resumableToolContext = findLatestResumableToolContext(
                    messages,
                    objectMapper,
                    lastUserIndex
            );
            int currentUserIndex = resumableToolContext != null
                    ? findPrecedingUserIndex(messages, resumableToolContext.assistantMessageIndex())
                    : lastUserIndex;

            if (currentUserIndex < 0) {
                throw new IllegalArgumentException("messages must contain a user message for the active turn");
            }

            ProtocolMessage currentUserMessage = messages.get(currentUserIndex);
            String userText = collectText(currentUserMessage);
            if (userText.isBlank()) {
                throw new IllegalArgumentException("active user message must contain text");
            }

            String conversationId = request.getConversationId() == null || request.getConversationId().isBlank()
                    ? UUID.randomUUID().toString()
                    : request.getConversationId();
            String fileContext = uploadedFileContextBuilder == null
                    ? ""
                    : uploadedFileContextBuilder.build(conversationId, currentUserMessage.getParts());
            String userMessage = fileContext.isBlank() ? userText : userText + "\n\n" + fileContext;
            List<ChatMessage> history = toHistory(messages.subList(0, currentUserIndex));
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
                    case "tool" -> ChatMessage.Role.TOOL;
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
            List<FrontendToolManifestEntry> manifest = new java.util.ArrayList<>();

            // Add tools from context.getFrontendTools() (legacy field)
            if (request.getContext() != null && request.getContext().getFrontendTools() != null) {
                for (ProtocolFrontendTool tool : request.getContext().getFrontendTools()) {
                    manifest.add(toFrontendToolManifestEntry(tool));
                }
            }

            // Add tools from context.getTools() (new contract field)
            if (request.getContext() != null && request.getContext().getTools() != null) {
                for (ProtocolToolDescriptor tool : request.getContext().getTools()) {
                    if (!isFrontendToolDescriptor(tool)) {
                        continue;
                    }
                    if (!manifest.stream().anyMatch(m -> m.getName().equals(tool.getName()))) {
                        manifest.add(toolDescriptorToManifestEntry(tool, objectMapper));
                    }
                }
            }

            if (manifest.isEmpty()) {
                return null;
            }

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

        private static FrontendToolManifestEntry toolDescriptorToManifestEntry(
                ProtocolToolDescriptor tool,
                ObjectMapper objectMapper
        ) {
            Map<String, Object> inputSchema = normalizeToolParameters(tool.getParameters(), objectMapper);
            boolean humanInTheLoop = "human".equalsIgnoreCase(String.valueOf(tool.getSource()));
            String toolName = tool.getName();
            String llmCompatibleName = toolName != null ? toolName.replace('.', '_').replace('-', '_') : toolName;
            return FrontendToolManifestEntry.builder()
                    .name(llmCompatibleName)
                    .description(tool.getDescription() != null ? tool.getDescription() : "")
                    .inputSchema(inputSchema.isEmpty() ? Map.of() : inputSchema)
                    .humanInTheLoop(humanInTheLoop)
                    .hasRender(true)
                    .build();
        }

        private static Map<String, Object> normalizeToolParameters(
                JsonNode parametersNode,
                ObjectMapper objectMapper
        ) {
            if (parametersNode == null || parametersNode.isNull() || parametersNode.isMissingNode()) {
                return Map.of("type", "object");
            }

            Map<String, Object> parameters = objectMapper.convertValue(parametersNode, Map.class);
            Object type = parameters.get("type");
            Object properties = parameters.get("properties");
            Object required = parameters.get("required");
            if ("object".equals(type) && properties instanceof Map<?, ?>) {
                Map<String, Object> normalized = new LinkedHashMap<>();
                normalized.put("type", "object");
                normalized.put("properties", properties);
                if (required instanceof List<?> requiredList && !requiredList.isEmpty()) {
                    normalized.put("required", requiredList);
                }
                return normalized;
            }

            Map<String, Object> normalizedProperties = new LinkedHashMap<>();
            List<String> requiredProperties = new ArrayList<>();
            for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                if (!(entry.getValue() instanceof Map<?, ?> rawField)) {
                    continue;
                }
                Map<String, Object> fieldSchema = new LinkedHashMap<>();
                Object fieldType = rawField.get("type");
                fieldSchema.put("type", fieldType instanceof String && !((String) fieldType).isBlank()
                        ? fieldType
                        : "string");
                Object description = rawField.get("description");
                if (description instanceof String descriptionText && !descriptionText.isBlank()) {
                    fieldSchema.put("description", descriptionText);
                }
                normalizedProperties.put(entry.getKey(), fieldSchema);
                if (Boolean.TRUE.equals(rawField.get("required"))) {
                    requiredProperties.add(entry.getKey());
                }
            }

            Map<String, Object> normalized = new LinkedHashMap<>();
            normalized.put("type", "object");
            normalized.put("properties", normalizedProperties);
            if (!requiredProperties.isEmpty()) {
                normalized.put("required", requiredProperties);
            }
            return normalized;
        }

        private static boolean isFrontendToolDescriptor(ProtocolToolDescriptor tool) {
            if (tool == null || tool.getSource() == null) {
                return false;
            }
            return tool.getSource() == ChatToolSource.FRONTEND || tool.getSource() == ChatToolSource.HUMAN;
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
                ObjectMapper objectMapper,
                int lastUserIndex
        ) {
            for (int messageIndex = messages.size() - 1; messageIndex >= 0; messageIndex--) {
                if (messageIndex <= lastUserIndex) {
                    break;
                }
                ProtocolMessage message = messages.get(messageIndex);
                if (!"assistant".equals(message.getRole()) || message.getParts() == null) {
                    continue;
                }
                for (int partIndex = message.getParts().size() - 1; partIndex >= 0; partIndex--) {
                    ProtocolPart part = message.getParts().get(partIndex);
                    if (!"tool-call".equals(part.getType()) || !isFrontendToolPart(part)) {
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

        private static boolean isFrontendToolPart(ProtocolPart part) {
            return "frontend".equalsIgnoreCase(part.getSource())
                    || "human".equalsIgnoreCase(part.getSource())
                    || "frontend".equalsIgnoreCase(part.getExecutionTarget());
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
                if (TEXTUAL_PART_TYPES.contains(part.getType()) && part.getText() != null) {
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
