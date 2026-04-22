package com.fdc3.chatbot.controlplane;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.mcp.McpClientFactory;
import com.fdc3.chatbot.mcp.McpProviderRegistrationRequest;
import com.fdc3.chatbot.mcp.McpProviderRegistryService;
import com.fdc3.chatbot.mcp.McpToolDescriptor;
import com.fdc3.chatbot.mcp.McpTransportType;
import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CapabilityResolverTest {

    @Test
    void resolvesStaticMcpCapabilitiesOnlyWhenProviderAndProfileMatch() {
        ToolDefinition localTool = new TestToolDefinition(
                "calculator",
                "Local calculator",
                Map.of("type", "object")
        );
        ToolRegistry toolRegistry = new ToolRegistry(List.of(localTool));

        McpClientFactory clientFactory = new FakeMcpClientFactory(List.of(
                new McpToolDescriptor(
                        "visited_user_count_by_application",
                        "Return visited user counts for an application within a time window",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "application", Map.of("type", "string"),
                                        "startTime", Map.of("type", "string"),
                                        "endTime", Map.of("type", "string")
                                ),
                                "required", List.of("application", "startTime", "endTime")
                        )
                )
        ));

        McpProviderRegistryService registryService = new McpProviderRegistryService(toolRegistry, clientFactory);
        registryService.register(new McpProviderRegistrationRequest(
                "elasticsearch-analytics",
                "Elasticsearch Analytics",
                McpTransportType.STREAMABLE_HTTP,
                "http://localhost:8088/api/mcp",
                List.of("advisor"),
                "Read-only analytics"
        ));

        CapabilityResolver resolver = new CapabilityResolver(toolRegistry);

        UserCapabilityContext advisorContext = UserCapabilityContext.builder()
                .userId("user-1")
                .profiles(Set.of("advisor"))
                .profileVersion("1")
                .profileFingerprint("user-1|advisor|1")
                .build();

        List<ResolvedCapability> advisorCapabilities = resolver.resolveCapabilities(advisorContext);
        List<ResolvedCapability> defaultCapabilities = resolver.resolveCapabilities(UserCapabilityContext.anonymous());

        assertEquals(2, advisorCapabilities.size());
        ResolvedCapability analyticsCapability = advisorCapabilities.stream()
                .filter(capability -> "visited_user_count_by_application".equals(capability.getCapabilityId()))
                .findFirst()
                .orElseThrow();
        ResolvedCapability localCapability = advisorCapabilities.stream()
                .filter(capability -> "calculator".equals(capability.getCapabilityId()))
                .findFirst()
                .orElseThrow();

        assertEquals("visited_user_count_by_application", analyticsCapability.getTargetName());
        assertEquals("mcp", analyticsCapability.getExecutionType());
        assertEquals("read", analyticsCapability.getAccessType());
        assertEquals("elasticsearch-analytics", analyticsCapability.getProviderId());
        assertTrue(analyticsCapability.getRequiredInputs().contains("application"));
        assertTrue(analyticsCapability.getOptionalInputs().isEmpty());
        assertTrue(analyticsCapability.getAvailableToolNames().contains("visited_user_count_by_application"));

        assertEquals("local", localCapability.getProviderId());
        assertEquals("local", localCapability.getExecutionType());
        assertEquals("read", localCapability.getAccessType());

        assertFalse(defaultCapabilities.stream().anyMatch(capability -> "visited_user_count_by_application".equals(capability.getCapabilityId())));
        assertTrue(defaultCapabilities.stream().anyMatch(capability -> "calculator".equals(capability.getCapabilityId())));
    }

    private static final class TestToolDefinition implements ToolDefinition {

        private final String name;
        private final String description;
        private final Map<String, Object> parameters;

        private TestToolDefinition(String name, String description, Map<String, Object> parameters) {
            this.name = name;
            this.description = description;
            this.parameters = parameters;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public Map<String, Object> getParameters() {
            return parameters;
        }

        @Override
        public CompletableFuture<Object> execute(Map<String, Object> arguments) {
            return CompletableFuture.completedFuture(arguments);
        }
    }

    private static final class FakeMcpClientFactory implements McpClientFactory {

        private final List<McpToolDescriptor> descriptors;

        private FakeMcpClientFactory(List<McpToolDescriptor> descriptors) {
            this.descriptors = descriptors;
        }

        @Override
        public McpClientSession create(McpProviderRegistrationRequest request) {
            return new McpClientSession() {
                @Override
                public List<McpToolDescriptor> listTools() {
                    return descriptors;
                }

                @Override
                public CompletableFuture<Object> execute(String toolName, Map<String, Object> arguments) {
                    return CompletableFuture.completedFuture(arguments);
                }

                @Override
                public void close() {
                }
            };
        }
    }
}
