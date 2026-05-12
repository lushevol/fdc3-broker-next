package com.fdc3.chatbot.mcp;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class McpBootstrapRegistrar {

    private final McpBootstrapProperties properties;
    private final McpProviderRegistryService registryService;

    @PostConstruct
    void initialize() {
        registerConfiguredProviders();
    }

    void registerConfiguredProviders() {
        for (McpBootstrapProperties.Provider provider : properties.getProviders()) {
            if (!provider.isEnabled()) {
                continue;
            }
            if (provider.getProviderId() == null || provider.getProviderId().isBlank()) {
                log.warn("Skipping enabled MCP bootstrap provider: missing providerId");
                continue;
            }
            if (provider.getUrl() == null || provider.getUrl().isBlank()) {
                log.warn("Skipping enabled MCP bootstrap provider '{}': missing url",
                        provider.getProviderId());
                continue;
            }

            try {
                registerWithRetry(provider);
            } catch (RuntimeException exception) {
                log.error("Failed to bootstrap MCP provider '{}' after all retries. " +
                        "The service will continue without this provider. " +
                        "It can be added later via POST /api/chat/mcp/providers.",
                        provider.getProviderId(), exception);
            }
        }
    }

    private void registerWithRetry(McpBootstrapProperties.Provider provider) {
        int maxAttempts = Math.max(1, properties.getRegistrationMaxAttempts());
        long retryDelayMillis = Math.max(0L, properties.getRegistrationRetryDelayMillis());
        RuntimeException lastFailure = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                log.info("Bootstrapping MCP provider {} (attempt {}/{})",
                        provider.getProviderId(),
                        attempt,
                        maxAttempts);
                registryService.register(McpProviderRegistrationRequest.builder()
                        .providerId(provider.getProviderId())
                        .serviceName(provider.getServiceName())
                        .transportType(provider.getTransportType())
                        .url(provider.getUrl())
                        .enabledProfiles(provider.getEnabledProfiles())
                        .description(provider.getDescription())
                        .build());
                return;
            } catch (RuntimeException exception) {
                lastFailure = exception;
                if (attempt == maxAttempts) {
                    break;
                }

                log.warn("Failed to bootstrap MCP provider {} on attempt {}/{}. Retrying in {} ms.",
                        provider.getProviderId(),
                        attempt,
                        maxAttempts,
                        retryDelayMillis,
                        exception);
                sleepBeforeRetry(retryDelayMillis, provider.getProviderId());
            }
        }

        throw lastFailure == null
                ? new IllegalStateException("Failed to bootstrap MCP provider " + provider.getProviderId())
                : lastFailure;
    }

    void sleepBeforeRetry(long retryDelayMillis, String providerId) {
        if (retryDelayMillis <= 0L) {
            return;
        }

        try {
            Thread.sleep(retryDelayMillis);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Interrupted while waiting to retry MCP provider bootstrap for " + providerId,
                    exception
            );
        }
    }
}
