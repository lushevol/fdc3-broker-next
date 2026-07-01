package com.fdc3.chatbot.mcp;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.util.ArrayList;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class McpBootstrapRegistrarTest {

    @Test
    void applicationConfigurationIncludesFlowzeroMcpProviderDefaults() throws Exception {
        String applicationYaml = new String(
                new ClassPathResource("application.yml").getInputStream().readAllBytes(),
                StandardCharsets.UTF_8
        );

        assertTrue(applicationYaml.contains("provider-id: flowzero-mcp"));
        assertTrue(applicationYaml.contains("enabled: ${CHATBOT_MCP_FLOWZERO_ENABLED:false}"));
        assertTrue(applicationYaml.contains("service-name: Flowzero MCP"));
        assertTrue(applicationYaml.contains("transport-type: STREAMABLE_HTTP"));
        assertTrue(applicationYaml.contains("url: ${CHATBOT_MCP_FLOWZERO_URL:http://127.0.0.1:8092/api/mcp}"));
        assertTrue(applicationYaml.contains("- default"));
        assertTrue(applicationYaml.contains("- advisor"));
        assertTrue(applicationYaml.contains("description: Creates and retrieves Flowzero workflow drafts through MCP."));
    }

    @Test
    void registersEnabledProvidersFromConfiguration() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider elasticsearchProvider = new McpBootstrapProperties.Provider();
        elasticsearchProvider.setEnabled(true);
        elasticsearchProvider.setProviderId("elasticsearch-analytics");
        elasticsearchProvider.setServiceName("Elasticsearch Analytics MCP");
        elasticsearchProvider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        elasticsearchProvider.setUrl("http://elasticsearch-analytics.internal/mcp");
        elasticsearchProvider.setEnabledProfiles(List.of("advisor"));
        elasticsearchProvider.setDescription("Read-only analytics MCP provider used for app usage statistics.");
        properties.setProviders(List.of(elasticsearchProvider));
        properties.setRegistrationMaxAttempts(2);
        properties.setRegistrationRetryDelayMillis(0L);

        RecordingMcpProviderRegistryService registryService = new RecordingMcpProviderRegistryService();
        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(properties, registryService);

        registrar.registerConfiguredProviders();

        assertEquals(1, registryService.requests.size());
        McpProviderRegistrationRequest request = registryService.requests.get(0);
        assertEquals("elasticsearch-analytics", request.getProviderId());
        assertEquals("Elasticsearch Analytics MCP", request.getServiceName());
        assertEquals(McpTransportType.STREAMABLE_HTTP, request.getTransportType());
        assertEquals("http://elasticsearch-analytics.internal/mcp", request.getUrl());
        assertEquals(List.of("advisor"), request.getEnabledProfiles());
    }

    @Test
    void registersRagProviderFromConfiguration() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider ragProvider = new McpBootstrapProperties.Provider();
        ragProvider.setEnabled(true);
        ragProvider.setProviderId("rag-knowledge-base");
        ragProvider.setServiceName("RAG Knowledge Base MCP");
        ragProvider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        ragProvider.setUrl("http://localhost:8091/api/mcp");
        ragProvider.setEnabledProfiles(List.of("advisor"));
        ragProvider.setDescription("Read-only RAG retrieval provider.");
        properties.setProviders(List.of(ragProvider));
        properties.setRegistrationMaxAttempts(1);
        properties.setRegistrationRetryDelayMillis(0L);

        RecordingMcpProviderRegistryService registryService = new RecordingMcpProviderRegistryService();
        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(properties, registryService);

        registrar.registerConfiguredProviders();

        assertEquals(1, registryService.requests.size());
        McpProviderRegistrationRequest request = registryService.requests.get(0);
        assertEquals("rag-knowledge-base", request.getProviderId());
        assertEquals("RAG Knowledge Base MCP", request.getServiceName());
        assertEquals(McpTransportType.STREAMABLE_HTTP, request.getTransportType());
        assertEquals("http://localhost:8091/api/mcp", request.getUrl());
        assertEquals(List.of("advisor"), request.getEnabledProfiles());
    }

    @Test
    void skipsEnabledProviderWithoutUrl() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider provider = new McpBootstrapProperties.Provider();
        provider.setEnabled(true);
        provider.setProviderId("elasticsearch-analytics");
        provider.setServiceName("Elasticsearch Analytics MCP");
        provider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        properties.setProviders(List.of(provider));
        properties.setRegistrationMaxAttempts(1);
        properties.setRegistrationRetryDelayMillis(0L);

        RecordingMcpProviderRegistryService registryService = new RecordingMcpProviderRegistryService();
        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(properties, registryService);

        registrar.registerConfiguredProviders();

        assertEquals(0, registryService.requests.size());
    }

    @Test
    void retriesUntilRegistrationSucceeds() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider provider = new McpBootstrapProperties.Provider();
        provider.setEnabled(true);
        provider.setProviderId("elasticsearch-analytics");
        provider.setServiceName("Elasticsearch Analytics MCP");
        provider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        provider.setUrl("http://localhost:8090/api/mcp");
        properties.setProviders(List.of(provider));
        properties.setRegistrationMaxAttempts(3);
        properties.setRegistrationRetryDelayMillis(0L);

        FailingThenSucceedingRegistryService registryService = new FailingThenSucceedingRegistryService(2);
        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(properties, registryService) {
            @Override
            void sleepBeforeRetry(long retryDelayMillis, String providerId) {
            }
        };

        registrar.registerConfiguredProviders();

        assertEquals(3, registryService.attempts.get());
        assertEquals(1, registryService.requests.size());
    }

    @Test
    void gracefullyHandlesRetryBudgetExhaustion() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider provider = new McpBootstrapProperties.Provider();
        provider.setEnabled(true);
        provider.setProviderId("elasticsearch-analytics");
        provider.setServiceName("Elasticsearch Analytics MCP");
        provider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        provider.setUrl("http://localhost:8090/api/mcp");
        properties.setProviders(List.of(provider));
        properties.setRegistrationMaxAttempts(2);
        properties.setRegistrationRetryDelayMillis(0L);

        FailingThenSucceedingRegistryService registryService = new FailingThenSucceedingRegistryService(Integer.MAX_VALUE);
        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(properties, registryService) {
            @Override
            void sleepBeforeRetry(long retryDelayMillis, String providerId) {
            }
        };

        registrar.registerConfiguredProviders();

        assertEquals(2, registryService.attempts.get());
        assertEquals(0, registryService.requests.size());
    }

    private static class RecordingMcpProviderRegistryService extends McpProviderRegistryService {

        protected final List<McpProviderRegistrationRequest> requests = new ArrayList<>();

        private RecordingMcpProviderRegistryService() {
            super(null, null);
        }

        @Override
        public RegisteredMcpProvider register(McpProviderRegistrationRequest request) {
            requests.add(request);
            return RegisteredMcpProvider.builder()
                    .providerId(request.getProviderId())
                    .serviceName(request.getServiceName())
                    .transportType(request.getTransportType())
                    .url(request.getUrl())
                    .enabledProfiles(request.getEnabledProfiles())
                    .toolNames(List.of("statistic_count_by_app"))
                    .description(request.getDescription())
                    .build();
        }
    }

    private static final class FailingThenSucceedingRegistryService extends RecordingMcpProviderRegistryService {

        private final int failuresBeforeSuccess;
        private final AtomicInteger attempts = new AtomicInteger();

        private FailingThenSucceedingRegistryService(int failuresBeforeSuccess) {
            this.failuresBeforeSuccess = failuresBeforeSuccess;
        }

        @Override
        public RegisteredMcpProvider register(McpProviderRegistrationRequest request) {
            int attempt = attempts.incrementAndGet();
            if (attempt <= failuresBeforeSuccess) {
                throw new RuntimeException("boom-" + attempt);
            }
            return super.register(request);
        }
    }
}
