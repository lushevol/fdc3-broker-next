package com.fdc3.rag.tool;

import com.fdc3.rag.repository.KnowledgeChunkRepository;
import com.fdc3.rag.service.KnowledgeSearchService;
import com.fdc3.rag.tool.model.KnowledgeSearchResponse;
import com.fdc3.rag.tool.model.KnowledgeSearchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeBaseMcpTools {

    private static final Logger log = LoggerFactory.getLogger(KnowledgeBaseMcpTools.class);
    public static final String TOOL_DESCRIPTION = """
            Search the read-only RAG knowledge base for relevant internal documentation.
            Use this when the user asks about project architecture, chatbot behavior, MCP integration,
            runbook details, or implementation guidance that may be documented in the knowledge base.
            Return cited chunks only; do not invent facts beyond retrieved results.
            """;

    private final KnowledgeSearchService searchService;

    public KnowledgeBaseMcpTools(KnowledgeSearchService searchService) {
        this.searchService = searchService;
    }

    @McpTool(name = "search_knowledge_base", description = TOOL_DESCRIPTION)
    public KnowledgeSearchResponse searchKnowledgeBase(
            @McpToolParam(description = "Natural language search query", required = true) String query,
            @McpToolParam(description = "Maximum number of chunks to return. The service caps this value.", required = false) Integer topK,
            @McpToolParam(description = "Optional namespace such as advisor, default, or app name.", required = false) String namespace
    ) {
        log.info("search_knowledge_base called: namespace={}, topK={}", namespace, topK);
        java.util.List<KnowledgeChunkRepository.ScoredKnowledgeChunk> results =
                searchService.search(query, topK, namespace);
        int effectiveTopK = topK == null ? results.size() : Math.min(topK, results.size());
        return new KnowledgeSearchResponse(
                query,
                namespace,
                effectiveTopK,
                results.stream().map(result -> new KnowledgeSearchResult(
                        result.chunk().id(),
                        result.chunk().documentId(),
                        result.chunk().title(),
                        result.chunk().namespace(),
                        result.chunk().text(),
                        result.score(),
                        result.chunk().metadata()
                )).toList()
        );
    }
}
