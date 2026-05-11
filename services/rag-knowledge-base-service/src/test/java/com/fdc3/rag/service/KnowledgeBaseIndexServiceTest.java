package com.fdc3.rag.service;

import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.ingest.KnowledgeChunker;
import com.fdc3.rag.ingest.KnowledgeDocument;
import com.fdc3.rag.ingest.KnowledgeDocumentLoader;
import com.fdc3.rag.repository.InMemoryKnowledgeChunkRepository;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class KnowledgeBaseIndexServiceTest {

    @Test
    void loadsChunksEmbedsAndReplacesRepository() {
        KnowledgeDocumentLoader loader = () -> List.of(new KnowledgeDocument(
                "doc",
                "Doc",
                "advisor",
                "MCP retrieval content",
                Map.of()
        ));
        KnowledgeChunker chunker = document -> List.of(new KnowledgeChunk(
                "doc#1",
                "doc",
                "Doc",
                "advisor",
                document.text(),
                Map.of(),
                List.of()
        ));
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
        KnowledgeBaseIndexService service = new KnowledgeBaseIndexService(loader, chunker, embeddingClient, repository);

        service.rebuildIndex();

        assertThat(repository.size()).isEqualTo(1);
        assertThat(repository.search(List.of(1.0, 0.0), "advisor", 1).get(0).chunk().embedding())
                .containsExactly(1.0, 0.0);
    }

    @Test
    void emptyChunksReplaceRepositoryWithoutCallingEmbeddingProvider() {
        KnowledgeDocumentLoader loader = List::of;
        KnowledgeChunker chunker = document -> List.of();
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.error(new AssertionError("Embedding provider should not be called"));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.error(new AssertionError("Embedding provider should not be called"));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        repository.replaceAll(List.of(new KnowledgeChunk(
                "existing#1",
                "existing",
                "Existing",
                "advisor",
                "stale content",
                Map.of(),
                List.of(1.0, 0.0)
        )));
        KnowledgeBaseIndexService service = new KnowledgeBaseIndexService(loader, chunker, embeddingClient, repository);

        service.rebuildIndex();

        assertThat(repository.size()).isZero();
    }

    @Test
    void applicationReadyDoesNotFailStartupWhenIndexingFails() {
        KnowledgeDocumentLoader loader = () -> List.of(new KnowledgeDocument(
                "doc",
                "Doc",
                "advisor",
                "MCP retrieval content",
                Map.of()
        ));
        KnowledgeChunker chunker = document -> List.of(new KnowledgeChunk(
                "doc#1",
                "doc",
                "Doc",
                "advisor",
                document.text(),
                Map.of(),
                List.of()
        ));
        EmbeddingClient embeddingClient = new EmbeddingClient() {
            @Override
            public Mono<List<Double>> embed(String input) {
                return Mono.error(new IllegalStateException("network down"));
            }

            @Override
            public Mono<List<List<Double>>> embedAll(List<String> inputs) {
                return Mono.error(new IllegalStateException("network down"));
            }
        };
        InMemoryKnowledgeChunkRepository repository = new InMemoryKnowledgeChunkRepository();
        KnowledgeBaseIndexService service = new KnowledgeBaseIndexService(
                loader,
                chunker,
                embeddingClient,
                repository,
                Runnable::run,
                true
        );

        service.onApplicationReady(null);

        assertThat(repository.size()).isZero();
    }
}
