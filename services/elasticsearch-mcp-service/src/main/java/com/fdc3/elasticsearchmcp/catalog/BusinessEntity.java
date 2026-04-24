package com.fdc3.elasticsearchmcp.catalog;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public record BusinessEntity(String name, Map<String, String> filters, List<String> synonyms) {

    public BusinessEntity {
        filters = new LinkedHashMap<>(filters);
        synonyms = List.copyOf(synonyms);
    }

    public String renderFilters() {
        return filters.entrySet().stream()
                .map(entry -> entry.getKey() + " = '" + entry.getValue() + "'")
                .reduce((left, right) -> left + " AND " + right)
                .orElse("");
    }

    public static Builder builder(String name) {
        return new Builder(name);
    }

    public static class Builder {
        private final String name;
        private final Map<String, String> filters = new LinkedHashMap<>();
        private final List<String> synonyms = new java.util.ArrayList<>();

        private Builder(String name) {
            this.name = name;
        }

        public Builder filter(String field, String value) {
            filters.put(field, value);
            return this;
        }

        public Builder synonym(String synonym) {
            synonyms.add(synonym);
            return this;
        }

        public BusinessEntity build() {
            return new BusinessEntity(name, filters, synonyms);
        }
    }
}
