package com.fdc3.elasticsearchmcp.catalog;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class Text2SqlCatalogServiceTest {

    @Test
    void defaultCatalogDescribesFunctionUsageForTrades() {
        Text2SqlCatalog catalog = new Text2SqlCatalogService().catalog();

        String rendered = catalog.render();

        assertThat(rendered).contains("Dataset: user_monitoring");
        assertThat(rendered).contains("Table: \"single-ui-bff-analytic\"");
        assertThat(rendered).contains("function: field attribute16");
        assertThat(rendered).contains("trades: tile = 'trade' AND container = 'trade_blotter'");
        assertThat(rendered).contains("COUNT(*)");
        assertThat(rendered).contains("what's the most popular function in trades");
    }
}
