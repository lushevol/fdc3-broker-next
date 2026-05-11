package com.fdc3.rag.ingest;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import static org.assertj.core.api.Assertions.assertThat;

class MarkdownKnowledgeDocumentLoaderTest {

    @Test
    void loadsMarkdownResources() {
        MarkdownKnowledgeDocumentLoader loader = new MarkdownKnowledgeDocumentLoader(
                new PathMatchingResourcePatternResolver(),
                "classpath:/knowledge/test-*.md"
        );

        assertThat(loader.load()).singleElement().satisfies(document -> {
            assertThat(document.id()).isEqualTo("test-doc");
            assertThat(document.title()).isEqualTo("Test Doc");
            assertThat(document.namespace()).isEqualTo("default");
            assertThat(document.text()).contains("RAG test content");
        });
    }
}
