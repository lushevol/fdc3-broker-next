package com.fdc3.rag.tool;

import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.repository.InMemoryKnowledgeChunkRepository;
import com.fdc3.rag.service.KnowledgeSearchService;
import com.fdc3.rag.tool.model.KnowledgeSearchResponse;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class KnowledgeBaseMcpToolsTest {

    @Test
    void returnsSearchResultsWithCitationMetadata() {
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.just(List.of(1.0, 0.0));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.just(List.of(List.of(1.0, 0.0)));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        repository.replaceAll(List.of(new KnowledgeChunk(
                "mfe-chatbot#1",
                "mfe-chatbot",
                "MFE Chatbot",
                "advisor",
                "Remote MCP providers are registered into chatbot-backend.",
                Map.of("source", "seed"),
                List.of(1.0, 0.0)
        )));
        KnowledgeSearchService service = new KnowledgeSearchService(
                embeddingClient,
                repository,
                new RagProperties(
                        new RagProperties.Ingestion(true, "classpath:/knowledge/*.md"),
                        new RagProperties.Chunking(1200, 160),
                        new RagProperties.Embedding(
                                "deterministic",
                                new RagProperties.OpenRouter("", "http://localhost", "model", 3000)
                        ),
                        new RagProperties.Search(5, 10, 3000),
                        new RagProperties.Executor(1, 1, 1)
                ),
                Runnable::run
        );
        KnowledgeBaseMcpTools tools = new KnowledgeBaseMcpTools(service);

        KnowledgeSearchResponse response = tools.searchKnowledgeBase("How are MCP providers registered?", 3, "advisor");

        assertThat(response.query()).isEqualTo("How are MCP providers registered?");
        assertThat(response.results()).hasSize(1);
        assertThat(response.results().get(0).documentId()).isEqualTo("mfe-chatbot");
        assertThat(response.results().get(0).text()).contains("Remote MCP providers");
        assertThat(response.results().get(0).score()).isGreaterThan(0.99);
    }
}
