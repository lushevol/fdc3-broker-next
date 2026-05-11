package com.fdc3.rag.service;

import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.repository.KnowledgeChunkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

@Service
public class KnowledgeSearchService {

    private final EmbeddingClient embeddingClient;
    private final KnowledgeChunkRepository repository;
    private final RagProperties.Search searchProperties;
    private final Executor embeddingExecutor;

    @Autowired
    public KnowledgeSearchService(
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            RagProperties properties,
            @Qualifier("ragEmbeddingExecutor") Executor embeddingExecutor
    ) {
        this(embeddingClient, repository, properties.search(), embeddingExecutor);
    }

    KnowledgeSearchService(
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            RagProperties.Search searchProperties
    ) {
        this(embeddingClient, repository, searchProperties, Runnable::run);
    }

    KnowledgeSearchService(
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            RagProperties.Search searchProperties,
            Executor embeddingExecutor
    ) {
        this.embeddingClient = embeddingClient;
        this.repository = repository;
        this.searchProperties = searchProperties;
        this.embeddingExecutor = embeddingExecutor;
    }

    public List<KnowledgeChunkRepository.ScoredKnowledgeChunk> search(String query, Integer topK, String namespace) {
        int requestedTopK = topK == null || topK <= 0 ? searchProperties.defaultTopK() : topK;
        int effectiveTopK = Math.min(requestedTopK, searchProperties.maxTopK());
        List<Double> queryEmbedding = embedQuery(query);
        return repository.search(queryEmbedding, namespace, effectiveTopK);
    }

    private List<Double> embedQuery(String query) {
        long timeoutMillis = searchProperties.embeddingTimeoutMillis();
        try {
            return CompletableFuture.supplyAsync(
                    () -> embeddingClient.embed(query).block(Duration.ofMillis(timeoutMillis)),
                    embeddingExecutor
            ).get(timeoutMillis + 500L, TimeUnit.MILLISECONDS);
        } catch (Exception exception) {
            throw new CompletionException("Failed to embed RAG query within timeout.", exception);
        }
    }
}
