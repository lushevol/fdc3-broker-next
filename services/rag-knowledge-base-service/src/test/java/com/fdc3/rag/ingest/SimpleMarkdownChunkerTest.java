package com.fdc3.rag.ingest;

import com.fdc3.rag.config.RagProperties;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class SimpleMarkdownChunkerTest {

    @Test
    void splitsMarkdownIntoMetadataRichChunks() {
        SimpleMarkdownChunker chunker = new SimpleMarkdownChunker(new RagProperties.Chunking(120, 20));
        KnowledgeDocument document = new KnowledgeDocument(
                "mfe-chatbot",
                "MFE Chatbot",
                "advisor",
                "# Chatbot\n\nThe chatbot uses MCP tools.\n\n## RAG\n\nRAG retrieval is provided by a standalone service.",
                Map.of("source", "test")
        );

        List<KnowledgeChunk> chunks = chunker.chunk(document);

        assertThat(chunks).isNotEmpty();
        assertThat(chunks.get(0).documentId()).isEqualTo("mfe-chatbot");
        assertThat(chunks.get(0).namespace()).isEqualTo("advisor");
        assertThat(chunks.get(0).title()).isEqualTo("MFE Chatbot");
        assertThat(chunks.get(0).text()).contains("chatbot uses MCP tools");
        assertThat(chunks.get(0).metadata()).containsEntry("source", "test");
    }
}
