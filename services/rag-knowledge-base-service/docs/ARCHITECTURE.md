# RAG Knowledge Base Service Architecture

## Purpose

`rag-knowledge-base-service` is a standalone MCP provider for read-only retrieval augmented generation. It keeps document ingestion, chunking, embeddings, and vector search outside `chatbot-backend`, so chatbot integration stays plugin-based through the existing MCP provider registry.

## Runtime Shape

```text
chatbot-backend
  └─ MCP client registration
      └─ rag-knowledge-base-service /api/mcp
          └─ search_knowledge_base(query, topK, namespace)
              ├─ KnowledgeSearchService
              ├─ EmbeddingClient
              │   ├─ OpenRouterEmbeddingClient
              │   └─ DeterministicEmbeddingClient
              └─ KnowledgeChunkRepository
                  └─ InMemoryKnowledgeChunkRepository
```

## Key Components

- `KnowledgeBaseMcpTools`: exposes MCP tool `search_knowledge_base`.
- `KnowledgeSearchService`: embeds the query on a bounded executor and searches the repository.
- `KnowledgeBaseIndexService`: indexes source documents after `ApplicationReadyEvent`; startup does not fail if indexing fails.
- `MarkdownKnowledgeDocumentLoader`: loads `*.md` files from `rag.ingestion.resource-pattern`.
- `SimpleMarkdownChunker`: splits documents into overlapping text chunks.
- `EmbeddingClient`: stable interface for query and document embeddings.
- `KnowledgeChunkRepository`: stable storage/search boundary for migration to Elasticsearch.

## Request Flow

1. `chatbot-backend` registers the RAG service from `chatbot.mcp.providers`.
2. The agent sees `search_knowledge_base` as an MCP read capability.
3. When the model calls the tool, the RAG service embeds the query.
4. The repository returns top-K chunks filtered by optional namespace.
5. The tool response includes chunk text, score, document id, namespace, title, and metadata for citation.

## Indexing Flow

1. Spring starts the MCP server.
2. `KnowledgeBaseIndexService` listens for `ApplicationReadyEvent`.
3. Indexing runs on `ragEmbeddingExecutor`.
4. Markdown files are loaded, chunked, embedded, and atomically published into the repository with `replaceAll`.
5. If OpenRouter is unavailable, the service logs the indexing failure and keeps the MCP endpoint available.

## Embedding Providers

`openrouter` is the production provider:

```bash
OPENROUTER_API_KEY=...
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
```

`deterministic` is for local development and tests:

```bash
RAG_EMBEDDING_PROVIDER=deterministic
```

Do not mix providers for indexed chunks and query embeddings. Similarity scores are only meaningful when both vectors come from the same embedding space.

## Elasticsearch Migration Boundary

The migration target is a new implementation of `KnowledgeChunkRepository`, selected by a future property such as `rag.store.provider=elasticsearch`.

The repository contract should remain stable:

- `replaceAll(List<KnowledgeChunk> chunks)`
- `search(List<Double> queryEmbedding, String namespace, int topK)`
- `size()`

Recommended Elasticsearch document shape:

```json
{
  "chunkId": "mfe-chatbot#1",
  "documentId": "mfe-chatbot",
  "title": "MFE Chatbot And MCP",
  "namespace": "advisor",
  "text": "Remote MCP providers are registered...",
  "embedding": [0.1, 0.2],
  "metadata": {
    "source": "seed"
  }
}
```

This keeps `chatbot-backend` unchanged when storage moves from memory to Elasticsearch.
