package com.fdc3.chatbot.tool;

import com.fdc3.chatbot.mcp.RegisteredMcpProvider;
import com.fdc3.chatbot.model.UserCapabilityContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
public class ToolRegistry {

    private final Map<String, RegisteredTool> localTools = new ConcurrentHashMap<>();
    private final Map<String, RegisteredMcpProviderState> mcpProviders = new ConcurrentHashMap<>();
    private final Map<String, Map<String, ToolDefinition>> resolvedToolCache = new ConcurrentHashMap<>();
    private final AtomicLong registryVersion = new AtomicLong(0L);

    public ToolRegistry(List<ToolDefinition> toolDefinitions) {
        toolDefinitions.forEach(this::register);
    }

    public void register(ToolDefinition tool) {
        localTools.put(tool.getName(), new RegisteredTool(tool, Set.of()));
        invalidateResolvedCache();
        log.info("Registered local tool: {}", tool.getName());
    }

    public void unregister(String name) {
        localTools.remove(name);
        invalidateResolvedCache();
        log.info("Unregistered local tool: {}", name);
    }

    public ToolDefinition getTool(String name) {
        RegisteredTool registeredTool = localTools.get(name);
        if (registeredTool != null) {
            return registeredTool.definition();
        }
        return mcpProviders.values().stream()
                .map(RegisteredMcpProviderState::tools)
                .map(toolMap -> toolMap.get(name))
                .filter(java.util.Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    public boolean hasTool(String name) {
        return getTool(name) != null;
    }

    public Map<String, ToolDefinition> getAllTools() {
        return resolveTools(UserCapabilityContext.anonymous());
    }

    public Map<String, ResolvedToolMetadata> resolveToolMetadata(UserCapabilityContext context) {
        Map<String, ToolDefinition> resolvedTools = resolveTools(context);
        Map<String, ResolvedToolMetadata> metadata = new LinkedHashMap<>();

        resolvedTools.forEach((name, definition) -> {
            RegisteredTool localTool = localTools.get(name);
            if (localTool != null && localTool.definition() == definition) {
                metadata.put(name, new ResolvedToolMetadata(
                        name,
                        definition,
                        "local",
                        "local",
                        defaultAccessType(definition),
                        "global"
                ));
                return;
            }

            mcpProviders.forEach((providerId, providerState) -> {
                if (!metadata.containsKey(name) && providerState.tools().get(name) == definition) {
                    metadata.put(name, new ResolvedToolMetadata(
                            name,
                            definition,
                            providerId,
                            "mcp",
                            "read",
                            "global"
                    ));
                }
            });
        });

        return Map.copyOf(metadata);
    }

    public Map<String, ToolDefinition> resolveTools(UserCapabilityContext context) {
        String cacheKey = context.getUserId() + "|" + context.getProfileFingerprint() + "|" + registryVersion.get();
        return resolvedToolCache.computeIfAbsent(cacheKey, ignored -> {
            Map<String, ToolDefinition> resolved = new LinkedHashMap<>();
            localTools.forEach((name, tool) -> {
                if (matchesProfiles(tool.enabledProfiles(), context.getProfiles())) {
                    resolved.put(name, tool.definition());
                }
            });
            mcpProviders.forEach((providerId, provider) -> {
                if (matchesProfiles(provider.enabledProfiles(), context.getProfiles())) {
                    provider.tools().forEach((toolName, toolDefinition) -> {
                        if (shouldOverrideLocalTool(providerId, toolName)) {
                            resolved.put(toolName, toolDefinition);
                        } else {
                            resolved.putIfAbsent(toolName, toolDefinition);
                        }
                    });
                }
            });
            return Map.copyOf(resolved);
        });
    }

    public CompletableFuture<Object> execute(String name, Map<String, Object> arguments) {
        ToolDefinition tool = getTool(name);
        if (tool == null) {
            log.warn("Tool not found: {}", name);
            return CompletableFuture.failedFuture(new IllegalArgumentException("Tool not found: " + name));
        }
        return tool.execute(arguments);
    }

    public List<Map<String, Object>> getToolSchemas() {
        return getAllTools().values().stream()
                .map(tool -> {
                    Map<String, Object> schema = new HashMap<>();
                    schema.put("type", "function");

                    Map<String, Object> function = new HashMap<>();
                    function.put("name", tool.getName());
                    function.put("description", tool.getDescription());
                    function.put("parameters", tool.getParameters());

                    schema.put("function", function);
                    return schema;
                })
                .toList();
    }

    public boolean requiresConfirmation(String name) {
        ToolDefinition tool = getTool(name);
        return tool != null && tool.requiresConfirmation();
    }

    public void registerMcpProvider(String providerId, List<String> enabledProfiles, Map<String, ToolDefinition> tools) {
        Set<String> normalizedProfiles = normalizeProfiles(enabledProfiles);
        List<String> toolNames = tools.keySet().stream().sorted().toList();
        RegisteredMcpProviderState previous = mcpProviders.put(
                providerId,
                new RegisteredMcpProviderState(
                        RegisteredMcpProvider.builder()
                                .providerId(providerId)
                                .enabledProfiles(List.copyOf(normalizedProfiles))
                                .toolNames(toolNames)
                                .build(),
                        new LinkedHashMap<>(tools),
                        normalizedProfiles
                )
        );
        if (previous != null) {
            previous.tools().values().forEach(tool -> closeIfNeeded(tool));
        }
        invalidateResolvedCache();
        log.info("Registered MCP provider: {} with tools {}", providerId, toolNames);
    }

    public void registerMcpProvider(RegisteredMcpProvider provider, Map<String, ToolDefinition> tools) {
        Set<String> normalizedProfiles = normalizeProfiles(provider.getEnabledProfiles());
        RegisteredMcpProvider normalizedProvider = RegisteredMcpProvider.builder()
                .providerId(provider.getProviderId())
                .serviceName(provider.getServiceName())
                .transportType(provider.getTransportType())
                .url(provider.getUrl())
                .enabledProfiles(List.copyOf(normalizedProfiles))
                .toolNames(provider.getToolNames())
                .description(provider.getDescription())
                .registeredAt(provider.getRegisteredAt())
                .build();
        mcpProviders.put(
                provider.getProviderId(),
                new RegisteredMcpProviderState(normalizedProvider, new LinkedHashMap<>(tools), normalizedProfiles)
        );
        invalidateResolvedCache();
    }

    public void unregisterMcpProvider(String providerId) {
        RegisteredMcpProviderState removed = mcpProviders.remove(providerId);
        if (removed != null) {
            removed.tools().values().forEach(this::closeIfNeeded);
            invalidateResolvedCache();
            log.info("Unregistered MCP provider: {}", providerId);
        }
    }

    public List<RegisteredMcpProvider> listRegisteredMcpProviders() {
        return mcpProviders.values().stream()
                .map(RegisteredMcpProviderState::provider)
                .sorted(java.util.Comparator.comparing(RegisteredMcpProvider::getProviderId))
                .toList();
    }

    private void invalidateResolvedCache() {
        registryVersion.incrementAndGet();
        resolvedToolCache.clear();
    }

    private boolean matchesProfiles(Set<String> allowedProfiles, Set<String> actualProfiles) {
        if (allowedProfiles.isEmpty()) {
            return true;
        }
        return actualProfiles.stream().anyMatch(allowedProfiles::contains);
    }

    private Set<String> normalizeProfiles(List<String> profiles) {
        if (profiles == null || profiles.isEmpty()) {
            return Set.of();
        }
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String profile : profiles) {
            if (profile != null && !profile.isBlank()) {
                normalized.add(profile.trim().toLowerCase(java.util.Locale.ROOT));
            }
        }
        return Set.copyOf(normalized);
    }

    private void closeIfNeeded(ToolDefinition toolDefinition) {
        if (toolDefinition instanceof AutoCloseable autoCloseable) {
            try {
                autoCloseable.close();
            } catch (Exception exception) {
                log.warn("Failed to close tool {}", toolDefinition.getName(), exception);
            }
        }
    }

    private String defaultAccessType(ToolDefinition toolDefinition) {
        return toolDefinition.requiresConfirmation() ? "write" : "read";
    }

    private boolean shouldOverrideLocalTool(String providerId, String toolName) {
        return "flowzero-mcp".equals(providerId) && "generate_flowzero_workflow".equals(toolName);
    }

    private record RegisteredTool(ToolDefinition definition, Set<String> enabledProfiles) {
    }

    private record RegisteredMcpProviderState(
            RegisteredMcpProvider provider,
            Map<String, ToolDefinition> tools,
            Set<String> enabledProfiles
    ) {
    }

    public record ResolvedToolMetadata(
            String name,
            ToolDefinition definition,
            String providerId,
            String executionType,
            String accessType,
            String tenantScope
    ) {
    }
}
