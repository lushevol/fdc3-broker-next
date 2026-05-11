package com.fdc3.rag.tool.model;

import java.util.List;

public record KnowledgeSearchResponse(
        String query,
        String namespace,
        int topK,
        List<KnowledgeSearchResult> results
) {
}
