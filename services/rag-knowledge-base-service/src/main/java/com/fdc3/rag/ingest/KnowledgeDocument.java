package com.fdc3.rag.ingest;

import java.util.Map;

public record KnowledgeDocument(
        String id,
        String title,
        String namespace,
        String text,
        Map<String, String> metadata
) {
}
