package com.fdc3.chatbot.mcp;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class McpBootstrapRegistrarTest {

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
    void rejectsEnabledProviderWithoutUrl() {
        McpBootstrapProperties properties = new McpBootstrapProperties();
        McpBootstrapProperties.Provider provider = new McpBootstrapProperties.Provider();
        provider.setEnabled(true);
        provider.setProviderId("elasticsearch-analytics");
        provider.setServiceName("Elasticsearch Analytics MCP");
        provider.setTransportType(McpTransportType.STREAMABLE_HTTP);
        properties.setProviders(List.of(provider));
        properties.setRegistrationMaxAttempts(1);
        properties.setRegistrationRetryDelayMillis(0L);

        McpBootstrapRegistrar registrar = new McpBootstrapRegistrar(
                properties,
                new RecordingMcpProviderRegistryService()
        );

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                registrar::registerConfiguredProviders
        );

        assertEquals(
                "Enabled MCP bootstrap provider 'elasticsearch-analytics' is missing url",
                exception.getMessage()
        );
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
    void throwsAfterExhaustingRetryBudget() {
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

        RuntimeException exception = assertThrows(RuntimeException.class, registrar::registerConfiguredProviders);

        assertEquals("boom-2", exception.getMessage());
        assertEquals(2, registryService.attempts.get());
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
