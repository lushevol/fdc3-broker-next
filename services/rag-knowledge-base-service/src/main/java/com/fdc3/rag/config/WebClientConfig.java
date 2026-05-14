package com.fdc3.rag.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Provides a WebClient.Builder bean when Spring MVC is on the classpath
 * (which disables WebFlux auto-configuration of WebClient.Builder).
 *
 * <p>Both {@code OpenRouterEmbeddingClient} and {@code CopilotApiEmbeddingClient}
 * require this bean for their constructors.</p>
 */
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
