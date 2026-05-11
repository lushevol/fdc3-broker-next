# RAG Document Management Manual

## Current Storage Model

The POC knowledge base is Markdown-file backed. Source documents live in:

```text
services/rag-knowledge-base-service/src/main/resources/knowledge/
```

At startup, the service loads files matching:

```yaml
rag.ingestion.resource-pattern: classpath:/knowledge/*.md
```

The service then chunks the documents, embeds the chunks, and publishes them to the in-memory repository.

## Document Format

Each document should start with front matter:

```markdown
---
title: Human Readable Title
namespace: advisor
---

# Human Readable Title

Useful content goes here.
```

Fields:

- `title`: shown in search results and used by the assistant for citations.
- `namespace`: optional search filter. Use `advisor` for chatbot advisor-visible content unless a narrower namespace is needed.
- Body: Markdown text. Prefer clear headings and short sections.

Document id is derived from the filename without `.md`. For example, `mfe-chatbot.md` becomes document id `mfe-chatbot`.

## Add A Document

1. Create a Markdown file in `src/main/resources/knowledge/`.
2. Use a stable lowercase filename, for example `trade-workflow.md`.
3. Add front matter with `title` and `namespace`.
4. Write concise Markdown content with headings.
5. Run verification:

```bash
cd services/rag-knowledge-base-service
npm run test
```

6. Restart the service so startup indexing reloads the new file:

```bash
npm run dev:stub
```

For production embeddings:

```bash
export OPENROUTER_API_KEY=...
npm run dev
```

## Modify A Document

1. Edit the existing Markdown file.
2. Keep the filename stable unless you intentionally want a new document id.
3. Keep `namespace` stable unless access/search scope should change.
4. Run:

```bash
cd services/rag-knowledge-base-service
npm run test
```

5. Restart the service to rebuild the in-memory index.

## Delete A Document

1. Remove the Markdown file from `src/main/resources/knowledge/`.
2. Run:

```bash
cd services/rag-knowledge-base-service
npm run test
```

3. Restart the service. `KnowledgeBaseIndexService.replaceAll(...)` publishes the rebuilt index, so deleted files disappear from in-memory search after restart.

## Local Search Verification

Start the service:

```bash
cd services/rag-knowledge-base-service
npm run dev:stub
```

Then start chatbot with the RAG MCP provider:

```bash
cd services/chatbot-backend
npm run dev:with-rag-mcp
```

Verify provider registration:

```bash
curl http://localhost:8080/api/chat/mcp/providers
```

Expected provider id:

```text
rag-knowledge-base
```

## Authoring Guidelines

- Prefer one topic per file.
- Keep sections short; chunking is character-based with overlap.
- Put the answerable fact close to its heading.
- Avoid secrets, credentials, personal data, and environment-specific tokens.
- Use stable product names and service names.
- Use `namespace` intentionally so searches can be scoped later.

## Migration Notes For Elasticsearch

When Elasticsearch storage is added, document operations should still start from the same source format or an equivalent ingestion API. The implementation should preserve:

- Stable document id from filename or explicit metadata.
- Stable chunk id format.
- Namespace filtering.
- Title and metadata in search results.
- One indexed Elasticsearch document per chunk.

The chatbot integration should not change. Only the RAG service repository implementation should change.
