package com.fdc3.elasticsearchmcp.catalog;

import java.util.ArrayList;
import java.util.List;

public record AnalyticsDataset(
        String name,
        String table,
        List<SemanticDimension> dimensions,
        List<SemanticMetric> metrics,
        List<BusinessEntity> entities,
        List<QueryExample> examples
) {

    public AnalyticsDataset {
        dimensions = List.copyOf(dimensions);
        metrics = List.copyOf(metrics);
        entities = List.copyOf(entities);
        examples = List.copyOf(examples);
    }

    public static Builder builder(String name, String table) {
        return new Builder(name, table);
    }

    public static class Builder {
        private final String name;
        private final String table;
        private final List<SemanticDimension> dimensions = new ArrayList<>();
        private final List<SemanticMetric> metrics = new ArrayList<>();
        private final List<BusinessEntity> entities = new ArrayList<>();
        private final List<QueryExample> examples = new ArrayList<>();

        private Builder(String name, String table) {
            this.name = name;
            this.table = table;
        }

        public Builder dimension(SemanticDimension dimension) {
            dimensions.add(dimension);
            return this;
        }

        public Builder metric(SemanticMetric metric) {
            metrics.add(metric);
            return this;
        }

        public Builder entity(BusinessEntity entity) {
            entities.add(entity);
            return this;
        }

        public Builder example(QueryExample example) {
            examples.add(example);
            return this;
        }

        public AnalyticsDataset build() {
            return new AnalyticsDataset(name, table, dimensions, metrics, entities, examples);
        }
    }
}
