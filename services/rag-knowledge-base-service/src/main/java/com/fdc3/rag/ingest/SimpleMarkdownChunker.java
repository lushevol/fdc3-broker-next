package com.fdc3.rag.ingest;

import com.fdc3.rag.config.RagProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SimpleMarkdownChunker implements KnowledgeChunker {

    private final RagProperties.Chunking properties;

    @Autowired
    public SimpleMarkdownChunker(RagProperties properties) {
        this(properties.chunking());
    }

    SimpleMarkdownChunker(RagProperties.Chunking properties) {
        this.properties = properties;
    }

    @Override
    public List<KnowledgeChunk> chunk(KnowledgeDocument document) {
        String normalized = document.text().replaceAll("\\R{3,}", "\n\n").trim();
        List<KnowledgeChunk> chunks = new ArrayList<>();
        int start = 0;
        int index = 1;
        while (start < normalized.length()) {
            int end = Math.min(normalized.length(), start + properties.maxChars());
            if (end < normalized.length()) {
                int paragraphBreak = normalized.lastIndexOf("\n\n", end);
                if (paragraphBreak > start) {
                    end = paragraphBreak;
                }
            }
            String text = normalized.substring(start, end).trim();
            if (!text.isBlank()) {
                chunks.add(new KnowledgeChunk(
                        document.id() + "#" + index,
                        document.id(),
                        document.title(),
                        document.namespace(),
                        text,
                        document.metadata(),
                        List.of()
                ));
                index++;
            }
            if (end >= normalized.length()) {
                break;
            }
            start = Math.max(end - properties.overlapChars(), start + 1);
        }
        return List.copyOf(chunks);
    }
}
