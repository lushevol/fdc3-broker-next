package com.fdc3.elasticsearchmcp.resource;

import com.fdc3.elasticsearchmcp.catalog.Text2SqlCatalogService;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AnalyticsText2SqlResourcesTest {

    @Test
    void returnsGeneratedCatalogResource() {
        AnalyticsText2SqlResources resources = new AnalyticsText2SqlResources(new Text2SqlCatalogService());

        String catalog = resources.text2SqlCatalog();

        assertThat(catalog).contains("analytics://text2sql/catalog");
        assertThat(catalog).contains("function: field attribute16");
        assertThat(catalog).contains("Only generate SELECT statements");
    }
}
