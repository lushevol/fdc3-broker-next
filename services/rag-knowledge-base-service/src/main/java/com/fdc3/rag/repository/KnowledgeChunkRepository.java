package com.fdc3.rag.repository;

import com.fdc3.rag.ingest.KnowledgeChunk;

import java.util.List;

public interface KnowledgeChunkRepository {

    void replaceAll(List<KnowledgeChunk> chunks);

    List<ScoredKnowledgeChunk> search(List<Double> queryEmbedding, String namespace, int topK);

    int size();

    record ScoredKnowledgeChunk(KnowledgeChunk chunk, double score) {
    }
}
