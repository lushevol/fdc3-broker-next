package com.fdc3.rag.repository;

import com.fdc3.rag.ingest.KnowledgeChunk;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class InMemoryKnowledgeChunkRepositoryTest {

    @Test
    void searchesByCosineSimilarityAndNamespace() {
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        repository.replaceAll(List.of(
                chunk("one", "advisor", "MCP tools", List.of(1.0, 0.0)),
                chunk("two", "advisor", "Weather", List.of(0.0, 1.0)),
                chunk("three", "admin", "MCP admin", List.of(1.0, 0.0))
        ));

        List<KnowledgeChunkRepository.ScoredKnowledgeChunk> results =
                repository.search(List.of(1.0, 0.0), "advisor", 2);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).chunk().id()).isEqualTo("one");
        assertThat(results.get(0).score()).isEqualTo(1.0);
        assertThat(results.get(1).chunk().id()).isEqualTo("two");
    }

    private KnowledgeChunk chunk(String id, String namespace, String text, List<Double> vector) {
        return new KnowledgeChunk(id, "doc", "Doc", namespace, text, Map.of(), vector);
    }
}
