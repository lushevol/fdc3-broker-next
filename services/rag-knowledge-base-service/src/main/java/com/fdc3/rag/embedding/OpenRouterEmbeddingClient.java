package com.fdc3.rag.embedding;

import com.fdc3.rag.config.RagProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(prefix = "rag.embedding", name = "provider", havingValue = "openrouter", matchIfMissing = true)
public class OpenRouterEmbeddingClient implements EmbeddingClient {

    private final WebClient webClient;
    private final RagProperties.OpenRouter properties;

    @Autowired
    public OpenRouterEmbeddingClient(WebClient.Builder webClientBuilder, RagProperties properties) {
        this(webClientBuilder, properties.embedding().openrouter());
    }

    OpenRouterEmbeddingClient(WebClient.Builder webClientBuilder, RagProperties.OpenRouter properties) {
        this.webClient = webClientBuilder.baseUrl(properties.baseUrl()).build();
        this.properties = properties;
    }

    @Override
    public Mono<List<Double>> embed(String input) {
        return embedRequest(input).map(response -> response.data().get(0).embedding());
    }

    @Override
    public Mono<List<List<Double>>> embedAll(List<String> inputs) {
        return embedRequest(inputs).map(response -> response.data().stream()
                .map(OpenRouterEmbeddingResponse.Item::embedding)
                .toList());
    }

    private Mono<OpenRouterEmbeddingResponse> embedRequest(Object input) {
        if (properties.apiKey() == null || properties.apiKey().isBlank()) {
            return Mono.error(new IllegalStateException(
                    "OPENROUTER_API_KEY is required when rag.embedding.provider=openrouter"
            ));
        }
        Map<String, Object> body = Map.of(
                "model", properties.model(),
                "input", input,
                "encoding_format", "float"
        );
        return webClient.post()
                .uri("/embeddings")
                .header("Authorization", "Bearer " + properties.apiKey())
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(OpenRouterEmbeddingResponse.class)
                .timeout(Duration.ofMillis(properties.timeoutMillis()))
                .retryWhen(Retry.backoff(2, Duration.ofMillis(250))
                        .filter(this::isRetryable));
    }

    private boolean isRetryable(Throwable throwable) {
        if (throwable instanceof WebClientResponseException responseException) {
            return responseException.getStatusCode().is5xxServerError()
                    || responseException.getStatusCode().value() == 429;
        }
        return !(throwable instanceof IllegalStateException);
    }

    record OpenRouterEmbeddingResponse(List<Item> data) {
        record Item(List<Double> embedding) {
        }
    }
}
