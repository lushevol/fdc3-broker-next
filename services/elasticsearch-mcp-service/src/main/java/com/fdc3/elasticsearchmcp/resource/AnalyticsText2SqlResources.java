package com.fdc3.elasticsearchmcp.resource;

import com.fdc3.elasticsearchmcp.catalog.Text2SqlCatalogService;
import org.springframework.ai.mcp.annotation.McpResource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "analytics.tools.text2sql", name = "enabled", havingValue = "true")
public class AnalyticsText2SqlResources {

    private final Text2SqlCatalogService catalogService;

    public AnalyticsText2SqlResources(Text2SqlCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @McpResource(
            name = "analytics_text2sql_catalog",
            title = "Analytics Text2SQL Catalog",
            uri = "analytics://text2sql/catalog",
            description = "Code-defined schema, semantic mappings, safety rules, and examples for generating analytics Elasticsearch SQL.",
            mimeType = "text/markdown"
    )
    public String text2SqlCatalog() {
        return catalogService.renderCatalog();
    }

    @McpResource(
            name = "analytics_text2sql_prompt_samples",
            title = "Analytics Text2SQL Prompt Samples",
            uri = "analytics://text2sql/prompt-samples",
            description = "Sample prompts and expected SQL shapes for manually testing analytics text-to-SQL flows.",
            mimeType = "text/markdown"
    )
    public String text2SqlPromptSamples() {
        return catalogService.catalog().renderPromptSamples();
    }
}
