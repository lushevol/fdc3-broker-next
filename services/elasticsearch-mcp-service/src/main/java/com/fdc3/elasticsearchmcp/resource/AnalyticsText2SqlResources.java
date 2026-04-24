package com.fdc3.elasticsearchmcp.resource;

import com.fdc3.elasticsearchmcp.catalog.Text2SqlCatalogService;
import org.springaicommunity.mcp.annotation.McpResource;
import org.springframework.stereotype.Component;

@Component
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
}
