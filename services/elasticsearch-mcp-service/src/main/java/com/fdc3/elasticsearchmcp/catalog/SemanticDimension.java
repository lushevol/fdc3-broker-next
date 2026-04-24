package com.fdc3.elasticsearchmcp.catalog;

import java.util.List;

public record SemanticDimension(String name, String field, String description, List<String> synonyms) {

    public SemanticDimension {
        synonyms = List.copyOf(synonyms);
    }
}
