package com.fdc3.chatbot.controlplane;

import com.fdc3.chatbot.controlplane.model.CapabilityDefinition;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolRegistry;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CapabilityResolver {

    private final CapabilityRegistryService capabilityRegistryService;
    private final ToolRegistry toolRegistry;

    public CapabilityResolver(
            CapabilityRegistryService capabilityRegistryService,
            ToolRegistry toolRegistry
    ) {
        this.capabilityRegistryService = capabilityRegistryService;
        this.toolRegistry = toolRegistry;
    }

    public List<ResolvedCapability> resolveCapabilities(UserCapabilityContext context) {
        Map<String, ?> resolvedTools = toolRegistry.resolveTools(context);

        return capabilityRegistryService.loadDefinitions().stream()
                .filter(definition -> resolvedTools.containsKey(definition.getTargetName()))
                .map(this::toResolvedCapability)
                .toList();
    }

    private ResolvedCapability toResolvedCapability(CapabilityDefinition definition) {
        return ResolvedCapability.builder()
                .capabilityId(definition.getCapabilityId())
                .providerId(definition.getProviderId())
                .targetName(definition.getTargetName())
                .executionType(definition.getExecutionType())
                .accessType(definition.getAccessType())
                .tenantScope(definition.getTenantScope())
                .requiredInputs(definition.getRequiredInputs())
                .optionalInputs(definition.getOptionalInputs())
                .promptHints(definition.getPromptHints())
                .availableToolNames(List.of(definition.getTargetName()))
                .build();
    }

    public static List<CapabilityPromptSummary> summarizeForPrompt(List<ResolvedCapability> capabilities) {
        return capabilities.stream()
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
