package com.fdc3.rag.ingest;

import java.util.List;

public interface KnowledgeDocumentLoader {

    List<KnowledgeDocument> load();
}
