package com.fdc3.rag.tool.model;

import java.util.Map;

public record KnowledgeSearchResult(
        String chunkId,
        String documentId,
        String title,
        String namespace,
        String text,
        double score,
        Map<String, String> metadata
) {
}
