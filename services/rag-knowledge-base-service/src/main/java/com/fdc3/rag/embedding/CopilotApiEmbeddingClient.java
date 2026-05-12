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
@ConditionalOnProperty(prefix = "rag.embedding", name = "provider", havingValue = "copilot-api")
public class CopilotApiEmbeddingClient implements EmbeddingClient {

    private final WebClient webClient;
    private final RagProperties.CopilotApi properties;

    @Autowired
    public CopilotApiEmbeddingClient(WebClient.Builder webClientBuilder, RagProperties properties) {
        this(webClientBuilder, properties.embedding().copilotApi());
    }

    CopilotApiEmbeddingClient(WebClient.Builder webClientBuilder, RagProperties.CopilotApi properties) {
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
                .map(CopilotApiEmbeddingResponse.Item::embedding)
                .toList());
    }

    private Mono<CopilotApiEmbeddingResponse> embedRequest(Object input) {
        Map<String, Object> body = Map.of(
                "model", properties.model(),
                "input", input,
                "encoding_format", "float"
        );
        return webClient.post()
                .uri("/v1/embeddings")
                .headers(headers -> {
                    headers.set("Content-Type", "application/json");
                    if (properties.apiKey() != null && !properties.apiKey().isBlank()) {
                        headers.set("x-api-key", properties.apiKey());
                    }
                })
                .bodyValue(body)
                .retrieve()
                .bodyToMono(CopilotApiEmbeddingResponse.class)
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

    record CopilotApiEmbeddingResponse(List<Item> data) {
        record Item(List<Double> embedding) {
        }
    }
}
