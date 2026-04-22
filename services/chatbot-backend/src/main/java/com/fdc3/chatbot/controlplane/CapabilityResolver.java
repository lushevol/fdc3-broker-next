package com.fdc3.chatbot.controlplane;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolRegistry;
import com.fdc3.chatbot.tool.ToolRegistry.ResolvedToolMetadata;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class CapabilityResolver {

    private final ToolRegistry toolRegistry;

    public CapabilityResolver(ToolRegistry toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    public List<ResolvedCapability> resolveCapabilities(UserCapabilityContext context) {
        return toolRegistry.resolveToolMetadata(context).values().stream()
                .map(this::toResolvedCapability)
                .toList();
    }

    private ResolvedCapability toResolvedCapability(ResolvedToolMetadata metadata) {
        Map<String, Object> parameters = metadata.definition().getParameters();
        List<String> requiredInputs = extractRequiredInputs(parameters);
        List<String> optionalInputs = extractOptionalInputs(parameters, requiredInputs);
        List<String> promptHints = metadata.definition().getDescription() == null
                || metadata.definition().getDescription().isBlank()
                ? List.of()
                : List.of(metadata.definition().getDescription());

        return ResolvedCapability.builder()
                .capabilityId(metadata.name())
                .providerId(metadata.providerId())
                .targetName(metadata.name())
                .executionType(metadata.executionType())
                .accessType(metadata.accessType())
                .tenantScope(metadata.tenantScope())
                .requiredInputs(requiredInputs)
                .optionalInputs(optionalInputs)
                .promptHints(promptHints)
                .availableToolNames(List.of(metadata.name()))
                .build();
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRequiredInputs(Map<String, Object> parameters) {
        if (parameters == null) {
            return List.of();
        }
        Object required = parameters.get("required");
        if (!(required instanceof List<?> requiredList)) {
            return List.of();
        }
        return requiredList.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<String> extractOptionalInputs(Map<String, Object> parameters, List<String> requiredInputs) {
        if (parameters == null) {
            return List.of();
        }
        Object properties = parameters.get("properties");
        if (!(properties instanceof Map<?, ?> propertyMap)) {
            return List.of();
        }
        List<String> optionalInputs = new ArrayList<>();
        propertyMap.keySet().stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .filter(property -> !requiredInputs.contains(property))
                .forEach(optionalInputs::add);
        return List.copyOf(optionalInputs);
    }

    public static List<CapabilityPromptSummary> summarizeForPrompt(List<ResolvedCapability> capabilities) {
        return capabilities.stream()
                .filter(Objects::nonNull)
                .map(capability -> new CapabilityPromptSummary(
                        capability.getCapabilityId(),
                        capability.getProviderId(),
                        capability.getTargetName(),
                        List.copyOf(capability.getRequiredInputs()),
                        List.copyOf(capability.getOptionalInputs()),
                        List.copyOf(capability.getPromptHints())
                ))
                .toList();
    }

    public record CapabilityPromptSummary(
            String capabilityId,
            String providerId,
            String targetName,
            List<String> requiredInputs,
            List<String> optionalInputs,
            List<String> promptHints
    ) {
    }
}
