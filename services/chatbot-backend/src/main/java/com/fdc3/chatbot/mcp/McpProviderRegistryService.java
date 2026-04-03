package com.fdc3.chatbot.mcp;

import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class McpProviderRegistryService {

    private final ToolRegistry toolRegistry;
    private final McpClientFactory clientFactory;

    public RegisteredMcpProvider register(McpProviderRegistrationRequest request) {
        McpClientFactory.McpClientSession session = clientFactory.create(request);
        try {
            List<McpToolDescriptor> tools = session.listTools();
            RegisteredMcpProvider provider = RegisteredMcpProvider.builder()
                    .providerId(request.getProviderId())
                    .serviceName(request.getServiceName())
                    .transportType(request.getTransportType())
                    .url(request.getUrl())
                    .enabledProfiles(request.getEnabledProfiles())
                    .toolNames(tools.stream().map(McpToolDescriptor::name).toList())
                    .description(request.getDescription())
                    .build();
            toolRegistry.registerMcpProvider(
                    provider,
                    tools.stream().collect(java.util.stream.Collectors.toMap(
                            McpToolDescriptor::name,
                            descriptor -> new RemoteMcpToolDefinition(descriptor, session)
                    ))
            );

            return provider;
        } catch (RuntimeException exception) {
            session.close();
            throw exception;
        }
    }

    public List<RegisteredMcpProvider> listProviders() {
        return toolRegistry.listRegisteredMcpProviders();
    }

    public void unregister(String providerId) {
        toolRegistry.unregisterMcpProvider(providerId);
    }

    private record RemoteMcpToolDefinition(
            McpToolDescriptor descriptor,
            McpClientFactory.McpClientSession session
    ) implements ToolDefinition, AutoCloseable {

        @Override
        public String getName() {
            return descriptor.name();
        }

        @Override
        public String getDescription() {
            return descriptor.description();
        }

        @Override
        public Map<String, Object> getParameters() {
            return descriptor.inputSchema();
        }

        @Override
        public CompletableFuture<Object> execute(Map<String, Object> arguments) {
            return session.execute(descriptor.name(), arguments);
        }

        @Override
        public void close() {
            session.close();
        }
    }
}
