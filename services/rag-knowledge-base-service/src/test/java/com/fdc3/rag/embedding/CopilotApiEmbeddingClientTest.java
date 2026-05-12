package com.fdc3.rag.embedding;

import com.fdc3.rag.config.RagProperties;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CopilotApiEmbeddingClientTest {

    @Test
    void callsCopilotApiEmbeddingEndpoint() throws Exception {
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

            RagProperties.CopilotApi properties = new RagProperties.CopilotApi(
                    server.url("").toString().replaceAll("/$", ""),
                    "test-api-key",
                    "text-embedding-3-small",
                    5000
            );
            CopilotApiEmbeddingClient client = new CopilotApiEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("Your text string goes here").block();

            assertThat(embedding).containsExactly(0.1, 0.2, 0.3);
            RecordedRequest request = server.takeRequest();
            assertThat(request.getPath()).isEqualTo("/v1/embeddings");
            assertThat(request.getHeaders().get("x-api-key")).isEqualTo("test-api-key");
            assertThat(request.getBody().readUtf8())
                    .contains("\"model\":\"text-embedding-3-small\"")
                    .contains("\"input\":[\"Your text string goes here\"]")
                    .contains("\"encoding_format\":\"float\"");
        }
    }

    @Test
    void worksWithoutApiKey() throws Exception {
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

            RagProperties.CopilotApi properties = new RagProperties.CopilotApi(
                    server.url("").toString().replaceAll("/$", ""),
                    "",
                    "text-embedding-3-small",
                    5000
            );
            CopilotApiEmbeddingClient client = new CopilotApiEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("no key test").block();

            assertThat(embedding).containsExactly(0.1, 0.2, 0.3);
            RecordedRequest request = server.takeRequest();
            assertThat(request.getHeaders().get("x-api-key")).isNull();
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

            RagProperties.CopilotApi properties = new RagProperties.CopilotApi(
                    server.url("").toString().replaceAll("/$", ""),
                    "test-api-key",
                    "text-embedding-3-small",
                    5000
            );
            CopilotApiEmbeddingClient client = new CopilotApiEmbeddingClient(WebClient.builder(), properties);

            List<List<Double>> embeddings = client.embedAll(List.of("text1", "text2")).block();

            assertThat(embeddings).containsExactly(List.of(0.1, 0.2), List.of(0.3, 0.4));
            assertThat(server.takeRequest().getBody().readUtf8()).contains("\"input\":[\"text1\",\"text2\"]");
        }
    }

    @Test
    void retriesTransientFailures() throws Exception {
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

            RagProperties.CopilotApi properties = new RagProperties.CopilotApi(
                    server.url("").toString().replaceAll("/$", ""),
                    "test-api-key",
                    "text-embedding-3-small",
                    5000
            );
            CopilotApiEmbeddingClient client = new CopilotApiEmbeddingClient(WebClient.builder(), properties);

            List<Double> embedding = client.embed("retry me").block();

            assertThat(embedding).containsExactly(0.5, 0.6);
            assertThat(server.getRequestCount()).isEqualTo(2);
        }
    }
}
