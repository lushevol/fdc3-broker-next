# RAG Document Management Manual

## Source Documents

Markdown source documents live in:

```text
services/rag-knowledge-base-service/src/main/resources/knowledge/
```

At startup, the service loads files matching:

```yaml
rag.ingestion.resource-pattern: classpath:/knowledge/*.md
```

The service chunks documents, embeds chunks, and publishes them to the configured repository.

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

- `title`: shown in search results and used for citations.
- `namespace`: optional search filter. Use `advisor` for chatbot advisor-visible content unless a narrower namespace is needed.
- Body: Markdown text. Prefer clear headings and short sections.

The document id is derived from the filename without `.md`.

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

6. Restart the service so startup indexing reloads the file:

```bash
ACTIVE_ENV=stub npm run dev
```

## Modify A Document

1. Edit the existing Markdown file.
2. Keep the filename stable unless you intentionally want a new document id.
3. Keep `namespace` stable unless access/search scope should change.
4. Run tests and restart the service.

## Delete A Document

1. Remove the Markdown file from `src/main/resources/knowledge/`.
2. Run tests.
3. Restart the service. `replaceAll(...)` publishes the rebuilt index, so deleted files disappear from search after restart.

## Local Search Verification

Start RAG:

```bash
cd services/rag-knowledge-base-service
ACTIVE_ENV=stub npm run dev
```

Start chatbot:

```bash
cd services/chatbot-backend
ACTIVE_ENV=stub npm run dev
```

Verify provider registration:

```bash
curl http://localhost:8080/api/chat/mcp/providers/status
```

## Authoring Guidelines

- Prefer one topic per file.
- Keep sections short; chunking is character-based with overlap.
- Put answerable facts close to headings.
- Avoid secrets, credentials, personal data, and environment-specific tokens.
- Use stable product and service names.
- Use `namespace` intentionally so searches can be scoped.

## Elasticsearch Mode

When `RAG_ELASTICSEARCH_ENABLED=true`, the same source documents are indexed into Elasticsearch as one document per chunk. Document operations still start from the Markdown source files; only repository storage changes.
