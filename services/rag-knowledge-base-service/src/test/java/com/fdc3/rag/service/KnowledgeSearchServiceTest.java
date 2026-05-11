package com.fdc3.rag.service;

import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.repository.InMemoryKnowledgeChunkRepository;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class KnowledgeSearchServiceTest {

    @Test
    void embedsQueryAndCapsTopK() {
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
        repository.replaceAll(List.of(
                new KnowledgeChunk("doc#1", "doc", "Doc", "advisor", "MCP retrieval", Map.of(), List.of(1.0, 0.0))
        ));
        KnowledgeSearchService service = new KnowledgeSearchService(
                embeddingClient,
                repository,
                new RagProperties.Search(5, 10, 3000)
        );

        List<com.fdc3.rag.repository.KnowledgeChunkRepository.ScoredKnowledgeChunk> results =
                service.search("How does MCP retrieval work?", 50, "advisor");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).chunk().text()).contains("MCP retrieval");
    }
}
