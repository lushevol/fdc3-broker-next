package com.fdc3.elasticsearchmcp.catalog;

import java.util.List;

public record SemanticMetric(String name, String expression, String description, List<String> synonyms) {

    public SemanticMetric {
        synonyms = List.copyOf(synonyms);
    }
}
