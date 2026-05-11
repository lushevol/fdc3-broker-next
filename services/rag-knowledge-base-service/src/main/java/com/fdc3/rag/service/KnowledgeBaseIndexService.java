package com.fdc3.rag.service;

import com.fdc3.rag.embedding.EmbeddingClient;
import com.fdc3.rag.ingest.KnowledgeChunk;
import com.fdc3.rag.ingest.KnowledgeChunker;
import com.fdc3.rag.ingest.KnowledgeDocumentLoader;
import com.fdc3.rag.repository.KnowledgeChunkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;

@Service
public class KnowledgeBaseIndexService {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeBaseIndexService.class);

    private final KnowledgeDocumentLoader loader;
    private final KnowledgeChunker chunker;
    private final EmbeddingClient embeddingClient;
    private final KnowledgeChunkRepository repository;
    private final Executor embeddingExecutor;
    private final boolean ingestionEnabled;

    @Autowired
    public KnowledgeBaseIndexService(
            KnowledgeDocumentLoader loader,
            KnowledgeChunker chunker,
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository,
            @Qualifier("ragEmbeddingExecutor") Executor embeddingExecutor,
            @Value("${rag.ingestion.enabled:true}") boolean ingestionEnabled
    ) {
        this.loader = loader;
        this.chunker = chunker;
        this.embeddingClient = embeddingClient;
        this.repository = repository;
        this.embeddingExecutor = embeddingExecutor;
        this.ingestionEnabled = ingestionEnabled;
    }

    KnowledgeBaseIndexService(
            KnowledgeDocumentLoader loader,
            KnowledgeChunker chunker,
            EmbeddingClient embeddingClient,
            KnowledgeChunkRepository repository
    ) {
        this(loader, chunker, embeddingClient, repository, Runnable::run, true);
    }

    @EventListener(ApplicationReadyEvent.class)
    void onApplicationReady(ApplicationReadyEvent event) {
        if (ingestionEnabled) {
            embeddingExecutor.execute(() -> {
                try {
                    rebuildIndex();
                } catch (Exception exception) {
                    log.warn(
                            "Initial RAG indexing failed. MCP endpoint remains available and can be reindexed after configuration is fixed.",
                            exception
                    );
                }
            });
        }
    }

    public void rebuildIndex() {
        List<KnowledgeChunk> chunks = loader.load().stream()
                .flatMap(document -> chunker.chunk(document).stream())
                .toList();
        if (chunks.isEmpty()) {
            repository.replaceAll(List.of());
            log.info("Indexed 0 knowledge chunks.");
            return;
        }

        List<List<Double>> embeddings = embeddingClient.embedAll(chunks.stream().map(KnowledgeChunk::text).toList())
                .block();
        if (embeddings == null || embeddings.size() != chunks.size()) {
            throw new IllegalStateException("Embedding response size did not match chunk count.");
        }
        List<KnowledgeChunk> embeddedChunks = new ArrayList<>(chunks.size());
        for (int index = 0; index < chunks.size(); index++) {
            embeddedChunks.add(chunks.get(index).withEmbedding(embeddings.get(index)));
        }
        repository.replaceAll(embeddedChunks);
        log.info("Indexed {} knowledge chunks.", embeddedChunks.size());
    }
}
