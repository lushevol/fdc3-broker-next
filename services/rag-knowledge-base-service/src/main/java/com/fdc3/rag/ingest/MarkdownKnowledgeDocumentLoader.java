package com.fdc3.rag.ingest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class MarkdownKnowledgeDocumentLoader implements KnowledgeDocumentLoader {

    private final ResourcePatternResolver resolver;
    private final String resourcePattern;

    public MarkdownKnowledgeDocumentLoader(
            ResourcePatternResolver resolver,
            @Value("${rag.ingestion.resource-pattern}") String resourcePattern
    ) {
        this.resolver = resolver;
        this.resourcePattern = resourcePattern;
    }

    @Override
    public List<KnowledgeDocument> load() {
        try {
            Resource[] resources = resolver.getResources(resourcePattern);
            return java.util.Arrays.stream(resources).map(this::loadResource).toList();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to load knowledge documents.", exception);
        }
    }

    private KnowledgeDocument loadResource(Resource resource) {
        try {
            String filename = resource.getFilename() == null ? "knowledge" : resource.getFilename();
            String id = filename.replaceFirst("\\.md$", "");
            String rawText = resource.getContentAsString(StandardCharsets.UTF_8);
            ParsedFrontMatter parsed = parseFrontMatter(rawText);
            String title = parsed.metadata().getOrDefault("title", id);
            String namespace = parsed.metadata().getOrDefault("namespace", "default");
            return new KnowledgeDocument(id, title, namespace, parsed.body(), parsed.metadata());
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to load knowledge resource " + resource, exception);
        }
    }

    private ParsedFrontMatter parseFrontMatter(String rawText) {
        if (!rawText.startsWith("---")) {
            return new ParsedFrontMatter(Map.of(), rawText);
        }
        int closing = rawText.indexOf("\n---", 3);
        if (closing < 0) {
            return new ParsedFrontMatter(Map.of(), rawText);
        }
        String frontMatter = rawText.substring(3, closing).trim();
        String body = rawText.substring(closing + 4).trim();
        Map<String, String> metadata = new LinkedHashMap<>();
        for (String line : frontMatter.split("\\R")) {
            int separator = line.indexOf(':');
            if (separator > 0) {
                metadata.put(line.substring(0, separator).trim(), line.substring(separator + 1).trim());
            }
        }
        return new ParsedFrontMatter(Map.copyOf(metadata), body);
    }

    private record ParsedFrontMatter(Map<String, String> metadata, String body) {
    }
}
