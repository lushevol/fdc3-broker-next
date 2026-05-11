package com.fdc3.rag.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rag")
public record RagProperties(
        Ingestion ingestion,
        Chunking chunking,
        Embedding embedding,
        Search search,
        Executor executor
) {
    public record Ingestion(boolean enabled, String resourcePattern) {
    }

    public record Chunking(int maxChars, int overlapChars) {
    }

    public record Embedding(String provider, OpenRouter openrouter) {
    }

    public record OpenRouter(String apiKey, String baseUrl, String model, int timeoutMillis) {
    }

    public record Search(int defaultTopK, int maxTopK, long embeddingTimeoutMillis) {
    }

    public record Executor(int corePoolSize, int maxPoolSize, int queueCapacity) {
    }
}
