package com.fdc3.rag.embedding;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DeterministicEmbeddingClientTest {

    @Test
    void returnsStableNormalizedVectors() {
        DeterministicEmbeddingClient client = new DeterministicEmbeddingClient();

        List<Double> first = client.embed("Single-SPA loads micro frontends").block();
        List<Double> second = client.embed("Single-SPA loads micro frontends").block();

        assertThat(first).hasSize(64);
        assertThat(first).isEqualTo(second);
        assertThat(first).allSatisfy(value -> assertThat(value).isBetween(-1.0, 1.0));
    }

    @Test
    void supportsBatchEmbeddings() {
        DeterministicEmbeddingClient client = new DeterministicEmbeddingClient();

        List<List<Double>> vectors = client.embedAll(List.of("alpha", "beta")).block();

        assertThat(vectors).hasSize(2);
        assertThat(vectors.get(0)).hasSize(64);
        assertThat(vectors.get(1)).hasSize(64);
        assertThat(vectors.get(0)).isNotEqualTo(vectors.get(1));
    }
}
