# RAG Knowledge Base Service Architecture

<- [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component               | Technology                            |
| ----------------------- | ------------------------------------- |
| Framework               | Spring Boot 4.0.6                     |
| Language                | Java 21                               |
| MCP                     | Spring AI 2.0.0-M6 MCP server         |
| HTTP client             | Spring WebFlux `WebClient`            |
| Local vector storage    | In-memory cosine repository           |
| Optional vector storage | Elasticsearch dense vector repository |
| Build                   | Maven                                 |

## Runtime Shape

```text
chatbot-backend
  -> MCP client registration
     -> rag-knowledge-base-service /api/mcp
        -> search_knowledge_base(query, topK, namespace)
           -> KnowledgeSearchService
              -> EmbeddingClient
              -> KnowledgeChunkRepository
```

## Key Components

- `KnowledgeBaseMcpTools`: exposes `search_knowledge_base`.
- `KnowledgeSearchService`: embeds the query and searches the selected repository.
- `KnowledgeBaseIndexService`: indexes source documents after `ApplicationReadyEvent`.
- `MarkdownKnowledgeDocumentLoader`: loads Markdown resources and front matter.
- `SimpleMarkdownChunker`: splits source documents into overlapping chunks.
- `EmbeddingClient`: interface implemented by deterministic, OpenRouter, and Copilot clients.
- `KnowledgeChunkRepository`: storage/search boundary for in-memory and Elasticsearch repositories.

## Indexing Flow

1. Spring starts the MCP server.
2. `KnowledgeBaseIndexService` listens for `ApplicationReadyEvent`.
3. If ingestion is enabled, Markdown resources are loaded and chunked.
4. Chunks are embedded on `ragEmbeddingExecutor`.
5. `KnowledgeChunkRepository.replaceAll(...)` publishes the rebuilt index.
6. Indexing failures are logged; the MCP endpoint remains available.

## Search Flow

1. The model calls `search_knowledge_base`.
2. The service caps `topK` using `rag.search.max-top-k`.
3. The query is embedded using the configured provider.
4. The repository returns scored chunks, optionally filtered by namespace.
5. The response includes chunk id, document id, title, namespace, text, score, and metadata.

## Embedding Providers

| Provider        | Use                                    |
| --------------- | -------------------------------------- |
| `deterministic` | Local and tests; no network/API key    |
| `openrouter`    | OpenRouter embedding API               |
| `copilot-api`   | Local Copilot-compatible embedding API |

Do not mix embedding providers between indexed chunks and query embeddings.

## Repository Selection

- `rag.elasticsearch.enabled=false`: use `InMemoryKnowledgeChunkRepository`.
- `rag.elasticsearch.enabled=true`: use `ElasticsearchKnowledgeChunkRepository`.

Elasticsearch uses `rag.elasticsearch.uris`, `index-name`, and `embedding-dimension`. The repository creates the index when missing and stores one document per chunk.
