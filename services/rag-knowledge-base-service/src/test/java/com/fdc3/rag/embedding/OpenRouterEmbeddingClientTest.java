package com.fdc3.rag.embedding;

import com.fdc3.rag.config.RagProperties;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class OpenRouterEmbeddingClientTest {

    @Test
    void callsOpenRouterEmbeddingEndpoint() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.enqueue(new MockResponse()
                    .setResponseCode(200)
                    .setBody("""
                            {
                              "data": [
                                { "embedding": [0.1, 0.2, 0.3] }
                              ]
                            }
                            """)
                    .addHeader("Content-Type", "application/json")
            );

            RagProperties.OpenRouter properties = new RagProperties.OpenRouter(
                    "test-key",
                    server.url("/api/v1").toString().replaceAll("/$", ""),
                    "openai/text-embedding-3-small",
                    5000
            );
            OpenRouterEmbeddingClient client = new OpenRouterEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("Your text string goes here").block();

            assertThat(embedding).containsExactly(0.1, 0.2, 0.3);
            RecordedRequest request = server.takeRequest();
            assertThat(request.getPath()).isEqualTo("/api/v1/embeddings");
            assertThat(request.getHeaders().get("Authorization")).isEqualTo("Bearer test-key");
            assertThat(request.getBody().readUtf8())
                    .contains("\"model\":\"openai/text-embedding-3-small\"")
                    .contains("\"input\":\"Your text string goes here\"")
                    .contains("\"encoding_format\":\"float\"");
        }
    }

    @Test
    void supportsBatchInput() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.enqueue(new MockResponse()
                    .setResponseCode(200)
                    .setBody("""
                            {
                              "data": [
                                { "embedding": [0.1, 0.2] },
                                { "embedding": [0.3, 0.4] }
                              ]
                            }
                            """)
                    .addHeader("Content-Type", "application/json")
            );

            RagProperties.OpenRouter properties = new RagProperties.OpenRouter(
                    "test-key",
                    server.url("/api/v1").toString().replaceAll("/$", ""),
                    "openai/text-embedding-3-small",
                    5000
            );
            OpenRouterEmbeddingClient client = new OpenRouterEmbeddingClient(WebClient.builder(), properties);

            List<List<Double>> embeddings = client.embedAll(List.of("text1", "text2")).block();

            assertThat(embeddings).containsExactly(List.of(0.1, 0.2), List.of(0.3, 0.4));
            assertThat(server.takeRequest().getBody().readUtf8()).contains("\"input\":[\"text1\",\"text2\"]");
        }
    }

    @Test
    void retriesTransientOpenRouterFailures() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.enqueue(new MockResponse().setResponseCode(503).setBody("temporarily unavailable"));
            server.enqueue(new MockResponse()
                    .setResponseCode(200)
                    .setBody("""
                            {
                              "data": [
                                { "embedding": [0.5, 0.6] }
                              ]
                            }
                            """)
                    .addHeader("Content-Type", "application/json")
            );

            RagProperties.OpenRouter properties = new RagProperties.OpenRouter(
                    "test-key",
                    server.url("/api/v1").toString().replaceAll("/$", ""),
                    "openai/text-embedding-3-small",
                    5000
            );
            OpenRouterEmbeddingClient client = new OpenRouterEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("retry me").block();

            assertThat(embedding).containsExactly(0.5, 0.6);
            assertThat(server.getRequestCount()).isEqualTo(2);
        }
    }
}
