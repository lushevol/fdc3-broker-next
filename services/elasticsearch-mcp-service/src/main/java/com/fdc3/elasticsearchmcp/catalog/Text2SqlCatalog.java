package com.fdc3.elasticsearchmcp.catalog;

import java.util.List;
import java.util.stream.Collectors;

public record Text2SqlCatalog(List<AnalyticsDataset> datasets) {

    public Text2SqlCatalog {
        datasets = List.copyOf(datasets);
    }

    public String render() {
        StringBuilder builder = new StringBuilder();
        builder.append("Resource: analytics://text2sql/catalog\n\n");
        builder.append("Use this catalog to generate Elasticsearch SQL for analytics questions.\n");
        builder.append("Only generate SELECT statements. Use the listed table names, fields, entities, and metrics.\n");
        builder.append("Always include a LIMIT of 100 or less. Do not use SELECT *.\n\n");

        for (AnalyticsDataset dataset : datasets) {
            builder.append("Dataset: ").append(dataset.name()).append('\n');
            builder.append("Table: \"").append(dataset.table()).append("\"\n\n");

            builder.append("Dimensions:\n");
            for (SemanticDimension dimension : dataset.dimensions()) {
                builder.append("- ").append(dimension.name()).append(": field ").append(dimension.field()).append('\n');
                builder.append("  ").append(dimension.description()).append('\n');
                builder.append("  Synonyms: ").append(String.join(", ", dimension.synonyms())).append('\n');
            }

            builder.append("\nMetrics:\n");
            for (SemanticMetric metric : dataset.metrics()) {
                builder.append("- ").append(metric.name()).append(": ").append(metric.expression()).append('\n');
                builder.append("  ").append(metric.description()).append('\n');
                builder.append("  Synonyms: ").append(String.join(", ", metric.synonyms())).append('\n');
            }

            builder.append("\nEntities:\n");
            for (BusinessEntity entity : dataset.entities()) {
                builder.append("- ").append(entity.name()).append(": ").append(entity.renderFilters()).append('\n');
                if (!entity.synonyms().isEmpty()) {
                    builder.append("  Synonyms: ").append(String.join(", ", entity.synonyms())).append('\n');
                }
            }

            builder.append("\nExamples:\n");
            for (QueryExample example : dataset.examples()) {
                builder.append("- Question: ").append(example.question()).append('\n');
                builder.append("  SQL:\n");
                builder.append(indentSql(example.sql())).append('\n');
            }
            builder.append('\n');
        }
        return builder.toString().trim();
    }

    public List<String> tableNames() {
        return datasets.stream().map(AnalyticsDataset::table).collect(Collectors.toList());
    }

    public String renderPromptSamples() {
        StringBuilder builder = new StringBuilder();
        builder.append("Resource: analytics://text2sql/prompt-samples\n\n");
        builder.append("Use these sample prompts to test the analytics text-to-SQL flow.\n");
        builder.append("Read analytics://text2sql/catalog first, then generate SQL, then call execute_analytics_sql.\n\n");

        for (AnalyticsDataset dataset : datasets) {
            builder.append("Dataset: ").append(dataset.name()).append('\n');
            for (QueryExample example : dataset.examples()) {
                builder.append("- Prompt: ").append(example.question()).append('\n');
                builder.append("  Expected SQL shape:\n");
                builder.append(indentSql(example.sql())).append('\n');
            }
            builder.append('\n');
        }

        builder.append("Additional prompt samples:\n");
        builder.append("- what's the top 5 functions in trades\n");
        builder.append("- which function in trades has the most clicks\n");
        builder.append("- show the most popular function paths in cashflow blotter\n");
        builder.append("- count distinct users for trades in the last 7 days\n");
        return builder.toString().trim();
    }

    private String indentSql(String sql) {
        return sql.strip().lines()
                .map(line -> "    " + line)
                .collect(Collectors.joining("\n"));
    }
}
