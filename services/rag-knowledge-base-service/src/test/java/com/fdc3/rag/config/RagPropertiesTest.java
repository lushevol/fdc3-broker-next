package com.fdc3.rag.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.context.properties.source.ConfigurationPropertySources;
import org.springframework.mock.env.MockEnvironment;

import static org.assertj.core.api.Assertions.assertThat;

class RagPropertiesTest {

    @Test
    void bindsRagProperties() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("rag.ingestion.enabled", "true")
                .withProperty("rag.ingestion.resource-pattern", "classpath:/knowledge/*.md")
                .withProperty("rag.chunking.max-chars", "900")
                .withProperty("rag.chunking.overlap-chars", "120")
                .withProperty("rag.embedding.provider", "openrouter")
                .withProperty("rag.embedding.openrouter.api-key", "secret")
                .withProperty("rag.embedding.openrouter.base-url", "http://localhost:9999")
                .withProperty("rag.embedding.openrouter.model", "openai/text-embedding-3-small")
                .withProperty("rag.embedding.openrouter.timeout-millis", "5000")
                .withProperty("rag.search.default-top-k", "4")
                .withProperty("rag.search.max-top-k", "8")
                .withProperty("rag.search.embedding-timeout-millis", "3000")
                .withProperty("rag.executor.core-pool-size", "2")
                .withProperty("rag.executor.max-pool-size", "4")
                .withProperty("rag.executor.queue-capacity", "16");

        Binder binder = new Binder(ConfigurationPropertySources.from(environment.getPropertySources()));
        RagProperties properties = binder.bind("rag", Bindable.of(RagProperties.class)).get();

        assertThat(properties.ingestion().enabled()).isTrue();
        assertThat(properties.ingestion().resourcePattern()).isEqualTo("classpath:/knowledge/*.md");
        assertThat(properties.chunking().maxChars()).isEqualTo(900);
        assertThat(properties.chunking().overlapChars()).isEqualTo(120);
        assertThat(properties.embedding().provider()).isEqualTo("openrouter");
        assertThat(properties.embedding().openrouter().apiKey()).isEqualTo("secret");
        assertThat(properties.embedding().openrouter().baseUrl()).isEqualTo("http://localhost:9999");
        assertThat(properties.embedding().openrouter().model()).isEqualTo("openai/text-embedding-3-small");
        assertThat(properties.embedding().openrouter().timeoutMillis()).isEqualTo(5000);
        assertThat(properties.search().defaultTopK()).isEqualTo(4);
        assertThat(properties.search().maxTopK()).isEqualTo(8);
        assertThat(properties.search().embeddingTimeoutMillis()).isEqualTo(3000);
        assertThat(properties.executor().corePoolSize()).isEqualTo(2);
        assertThat(properties.executor().maxPoolSize()).isEqualTo(4);
        assertThat(properties.executor().queueCapacity()).isEqualTo(16);
    }
}
