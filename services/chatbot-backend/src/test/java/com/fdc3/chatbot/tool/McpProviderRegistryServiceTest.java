package com.fdc3.chatbot.tool;

import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.mcp.McpClientFactory;
import com.fdc3.chatbot.mcp.McpProviderRegistrationRequest;
import com.fdc3.chatbot.mcp.McpProviderRegistryService;
import com.fdc3.chatbot.mcp.McpToolDescriptor;
import com.fdc3.chatbot.mcp.McpTransportType;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class McpProviderRegistryServiceTest {

    @Test
    void registerDiscoversRemoteToolsAndResolvesThemOnlyForMatchingProfiles() {
        ToolDefinition localTool = new TestToolDefinition(
                "calculator",
                "Local calculator",
                Map.of("type", "object")
        );
        ToolRegistry toolRegistry = new ToolRegistry(List.of(localTool));

        McpClientFactory clientFactory = mock(McpClientFactory.class);
        McpClientFactory.McpClientSession clientSession = mock(McpClientFactory.McpClientSession.class);
        when(clientFactory.create(org.mockito.ArgumentMatchers.any())).thenReturn(clientSession);
        when(clientSession.listTools()).thenReturn(List.of(
                new McpToolDescriptor(
                        "portfolio_lookup",
                        "Lookup user portfolios",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "accountId", Map.of("type", "string", "description", "Account identifier")
                                ),
                                "required", List.of("accountId")
                        )
                )
        ));
        when(clientSession.execute("portfolio_lookup", Map.of("accountId", "ACC-1")))
                .thenReturn(CompletableFuture.completedFuture(Map.of("accountId", "ACC-1")));

        McpProviderRegistryService registryService = new McpProviderRegistryService(toolRegistry, clientFactory);
        registryService.register(new McpProviderRegistrationRequest(
                "portfolio-service",
                "Portfolio Service",
                McpTransportType.STREAMABLE_HTTP,
                "http://portfolio-service.internal/mcp",
                List.of("advisor"),
                null
        ));

        Map<String, ToolDefinition> advisorTools = toolRegistry.resolveTools(UserCapabilityContext.builder()
                .userId("user-1")
                .profiles(java.util.Set.of("advisor"))
                .profileVersion("1")
                .profileFingerprint("user-1|advisor|1")
                .build());
        Map<String, ToolDefinition> defaultTools = toolRegistry.resolveTools(UserCapabilityContext.anonymous());

        assertTrue(advisorTools.containsKey("calculator"));
        assertTrue(advisorTools.containsKey("portfolio_lookup"));
        assertEquals(
                Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "accountId", Map.of("type", "string", "description", "Account identifier")
                        ),
                        "required", List.of("accountId")
                ),
                advisorTools.get("portfolio_lookup").getParameters()
        );
        assertTrue(registryService.listProviders().stream().anyMatch(provider -> "portfolio-service".equals(provider.getProviderId())));
        assertTrue(defaultTools.containsKey("calculator"));
        assertFalse(defaultTools.containsKey("portfolio_lookup"));

        registryService.unregister("portfolio-service");
        verify(clientSession).close();
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
}
