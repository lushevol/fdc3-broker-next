package com.fdc3.rag.ingest;

import java.util.List;

public interface KnowledgeChunker {

    List<KnowledgeChunk> chunk(KnowledgeDocument document);
}
