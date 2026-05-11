package com.fdc3.rag.ingest;

import java.util.List;
import java.util.Map;

public record KnowledgeChunk(
        String id,
        String documentId,
        String title,
        String namespace,
        String text,
        Map<String, String> metadata,
        List<Double> embedding
) {
    public KnowledgeChunk withEmbedding(List<Double> vector) {
        return new KnowledgeChunk(id, documentId, title, namespace, text, metadata, vector);
    }
}
