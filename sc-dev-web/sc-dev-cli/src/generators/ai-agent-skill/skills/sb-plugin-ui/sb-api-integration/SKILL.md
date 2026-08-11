---
name: sb-api-integration
description: >
  Complete API integration guide for Service Bench plugin UI projects.
  Use this skill whenever you are: fetching data via GraphQL Experience API, writing queries or mutations, handling loading/error states, uploading or downloading files via Storage client, using REST client for SSE (Server-Sent Events), cancelling in-flight requests, or wiring API calls into LitElement page components.
  Trigger on any request involving: GraphQL query, GraphQL mutation, API call, fetch data, load data, REST client, storage client, upload file, download file, SSE, server-sent events, GraphQLClientService, GRAPHQL_CLIENT, STORAGE_CLIENT, REST_CLIENT, Experience API, namespace, operationName, api integration, wire up API, loading state, error state, or any data-fetching task in a Service Bench plugin context.
---

# Service Bench — API Integration

Service Bench plugins communicate with backend services via **Experience API** — all calls go through either:

| Channel | Client | Context source | Best for |
|---|---|---|---|
| **GraphQL** | `GRAPHQL_CLIENT` | `@scdevkit/data` | CRUD queries & mutations |
| **Storage** | `STORAGE_CLIENT` | `@scdevkit/service-bench-core` | Binary file upload/download (≤200 MB) |
| **REST** | `REST_CLIENT` | `@scdevkit/service-bench-core` | SSE (Server-Sent Events) streams |

> 🚨 **Critical:** The #1 import mistake — `GRAPHQL_CLIENT` and `GRAPHQL_QUERY_RESULT` come from **`@scdevkit/data`**, NOT `@scdevkit/service-bench-core`. Almost every other context in a Service Bench plugin (USER, NAVIGATION, STORAGE_CLIENT, REST_CLIENT, etc.) comes from `@scdevkit/service-bench-core` — but the GraphQL client is the exception. Always double-check this import.
>
> ```typescript
> // ✅ CORRECT
> import { createContext, contexts } from '@scdevkit/data'; // GRAPHQL_CLIENT
> import { createContext as createSbContext, contexts as sbContexts } from '@scdevkit/service-bench-core'; // USER, STORAGE_CLIENT, etc.
>
> // ❌ WRONG — GRAPHQL_CLIENT does NOT exist in service-bench-core
> import { contexts } from '@scdevkit/service-bench-core';
> const graphQLClientContext = createContext(contexts.GRAPHQL_CLIENT); // FAILS at runtime
> ```

---

## 1. Project Setup

### Constants (define once per plugin)

In `src/constants/app.ts`:

> ⚠️ These values are **plugin-specific** — every plugin has its own. Replace the example values below with the constants from your plugin's `src/constants/app.ts`.

```typescript
// GraphQL namespace — format: _<ITAM>_<componentId>_exp_api
export const EXPERIENCE_API_NAMESPACE = '_<itam>_<componentId>_exp_api';

// REST/Storage module name — format: <ITAM>-<componentId>-<plugin-name>-rest-exp-api
export const REST_EXPERIENCE_API_SVC_NAME = '<itam>-<componentId>-<plugin-name>-rest-exp-api';
```

### Install dependencies

```bash
npm install @scdevkit/service-bench-core@latest --save
npm install @scdevkit/data --save
```

### Local proxy in `web-dev-server.config.js`

```javascript
// GraphQL
proxy('/graphql', {
  target: 'https://servicebench-sit.global.standardchartered.com',
  changeOrigin: true,
  secure: false,
}),

// Storage (binary/file) — replace target with your environment's storage service URL
proxy('/storage-api/', {
  target: 'https://<storage-service-host>',
  changeOrigin: true,
  secure: false,
  rewrite: path => path.replace('/storage-api/v1/', '/api/')
}),

// REST (SSE)
proxy('/rest/v1/{module}/', {
  target: 'https://servicebench-sit.global.standardchartered.com',
  changeOrigin: true,
  secure: false,
  logs: true
}),
```

---

## 2. GraphQLClientService — Wrapper Class

Create **once** in `src/api/GraphQLClientService.ts` (already present in the plugin):

```typescript
import { contexts, createContext } from '@scdevkit/data';
import { LitElement } from 'lit';

const graphQLClientContext = createContext(contexts.GRAPHQL_CLIENT);

class GraphQLClientService {
  graphQLClientContextConsumer;

  constructor(host: LitElement) {
    this.graphQLClientContextConsumer = graphQLClientContext.createConsumer(host);
  }

  get graphQLClientContext() {
    return this.graphQLClientContextConsumer.value;
  }

  get query() {
    return (this.graphQLClientContext as { query: any }).query;
  }
}

export default GraphQLClientService;
```

**Usage in a page component (instantiate in constructor):**

```typescript
import GraphQLClientService from '../../api/GraphQLClientService';
import { getAllItems } from '../../api/itemQueries';

export class MyPage extends LitElement {
  _graphQLClient: GraphQLClientService;

  constructor() {
    super();
    if (!this._graphQLClient) {
      this._graphQLClient = new GraphQLClientService(this);
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadItems();
  }

  async loadItems() {
    this.isLoading = true;
    const items = await getAllItems(this._graphQLClient.graphQLClientContext, {});
    if (items) {
      this.items = items;
    }
    this.isLoading = false;
  }
}
```

> **Note:** Pass `this._graphQLClient.graphQLClientContext` (the raw client object) to query/mutation functions. Some files pass `this._graphQLClient` directly if query functions call `graphQLClient?.query(...)` — check the function signature.

---

## 3. GraphQL Query Pattern

### File naming: `src/api/<domain>Queries.ts`

**Full pattern** (copy from real codebase):

```typescript
import { EXPERIENCE_API_NAMESPACE } from '../constants/app';

// ── Operation name constant ─────────────────────────────────────
export const QUERY_GET_ITEMS = 'get_items';

// ── Response types ──────────────────────────────────────────────
export type ItemDto = {
  id: string;
  name: string;
  status: string;
};
export type GetItemsResponse = ItemDto[];

// ── Query function ──────────────────────────────────────────────
export async function getItems(
  graphQLClient: any,
  params: { status?: string },
): Promise<GetItemsResponse | undefined> {
  const { status } = params;

  const response = await graphQLClient?.query(`
    query GetItems {
      ${EXPERIENCE_API_NAMESPACE} {
        ${QUERY_GET_ITEMS}${status ? `(status: "${status}")` : ''} {
          id
          name
          status
        }
      }
    }
  `);

  // Guard: response must be a Fetch Response
  if (!response || typeof response.json !== 'function') {
    return undefined;
  }

  const json = await response.json();

  // GraphQL-level errors → return undefined (or throw for mutations)
  if (json?.errors) {
    return undefined;
  }

  if (!json?.data) {
    return undefined;
  }

  return json.data[EXPERIENCE_API_NAMESPACE]?.[QUERY_GET_ITEMS] as GetItemsResponse;
}
```

### Using GraphQL variables (safer — auto-escapes special chars)

```typescript
const response = await graphQLClient?.query(`
  query GetItemsByUser($userId: String!) {
    ${EXPERIENCE_API_NAMESPACE} {
      get_userItems(userId: $userId) {
        id
        name
      }
    }
  }
`, { userId: user.id });
```

### Named operationName (4th argument — for debugging + multi-operation queries)

```typescript
const response = await graphQLClient?.query(
  queryString,
  variables,   // {} if none
  {},          // callbacks placeholder
  'GetItemsByUser'  // operationName → sets X-GraphQL-Operation-Name header
);
```

---

## 4. GraphQL Mutation Pattern

### File naming: `src/api/<domain>Mutations.ts`

**Always include the escaping helpers at the top of the file:**

```typescript
import { EXPERIENCE_API_NAMESPACE } from '../constants/app';

// ── String escaping helpers (MUST use — never inline-escape) ────
function escapeGQL(value: string): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function gqlValue(val: string | string[] | null | undefined): string {
  if (val === null || val === undefined) return 'null';
  const resolved = Array.isArray(val) ? val[0] : val;
  if (resolved === null || resolved === undefined) return 'null';
  const str = String(resolved);
  return str.trim() !== '' ? `"${escapeGQL(str)}"` : 'null';
}

function gqlBoolean(val: boolean | null | undefined): string {
  if (val === null || val === undefined) return 'null';
  return String(val);
}

function gqlTime(val: string | null | undefined): string {
  if (val === null || val === undefined) return 'null';
  const str = String(val).trim();
  if (str === '') return 'null';
  if (str.includes('T')) return `"${escapeGQL(str)}"`;
  return `"${escapeGQL(str)}T00:00:00Z"`;
}
```

**Mutation function template:**

```typescript
export const MUTATION_CREATE_ITEM = 'create_item';

export type CreateItemInput = {
  name: string;
  status?: string | null;
  created_by: string;
};

export type CreateItemResponse = {
  id: string;
  name: string;
  status: string;
  created_by: string;
};

export async function createItem(
  graphQLClient: any,
  params: CreateItemInput,
): Promise<CreateItemResponse | undefined> {
  const mutation = `
    mutation CreateItem {
      ${EXPERIENCE_API_NAMESPACE} {
        ${MUTATION_CREATE_ITEM}(
          input: {
            name: ${gqlValue(params.name)}
            status: ${gqlValue(params.status)}
            created_by: "${escapeGQL(params.created_by)}"
          }
        ) {
          id
          name
          status
          created_by
        }
      }
    }
  `;

  const response = await graphQLClient?.query(mutation);

  if (!response || typeof response.json !== 'function') {
    return undefined;
  }

  const json = await response.json();

  // Mutations throw on GraphQL errors (unlike queries which return undefined)
  if (json?.errors) {
    throw new Error(
      `GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`
    );
  }

  return json?.data?.[EXPERIENCE_API_NAMESPACE]?.[MUTATION_CREATE_ITEM] as CreateItemResponse;
}
```

> ⚠️ **Queries vs Mutations on error**: Queries typically `return undefined` on error; mutations typically `throw new Error(...)`. Follow this convention consistently.

---

## 5. Cancelling a Query (onSend callback)

Use the `onSend` callback to capture the abort function, then call it on timeout or user cancel:

```typescript
async loadData() {
  const graphQLClient = this._graphQLClient.graphQLClientContext;
  let abortFn: (() => void) | null = null;

  const timeoutRef = setTimeout(() => {
    if (abortFn) abortFn();
  }, 10000); // abort after 10s

  try {
    const response = await graphQLClient?.query(
      `query { ${EXPERIENCE_API_NAMESPACE} { get_items { id name } } }`,
      {},
      { onSend: ({ abort }: { abort: () => void }) => { abortFn = abort; } }
    );
    clearTimeout(timeoutRef);
    const data = await response.json();
    // handle data
  } catch (error) {
    // aborted or failed
  }
}
```

---

## 6. Loading & Error States in a Component

**Declare states at the top of the class:**

```typescript
@state() private items: ItemDto[] = [];
@state() private isLoading: boolean = false;
@state() private hasError: boolean = false;
```

**Load pattern:**

```typescript
async loadItems() {
  this.isLoading = true;
  this.hasError = false;
  try {
    const result = await getItems(this._graphQLClient.graphQLClientContext, {});
    this.items = result ?? [];
  } catch (e) {
    console.error(e);
    this.hasError = true;
  } finally {
    this.isLoading = false;
  }
}
```

**Render pattern:**

```typescript
render() {
  if (this.isLoading) return html`<sc-loading-indicator></sc-loading-indicator>`;
  if (this.hasError) return html`<sc-inline-message type="error" message="Failed to load"></sc-inline-message>`;
  return html`
    <sc-data-grid .items=${this.items}></sc-data-grid>
  `;
}
```

---

## 7. sc-data-graphql Component (Declarative Approach)

For display-only components, use the `sc-data-graphql` web component to avoid manual loading/error handling:

```typescript
import '@scdevkit/data/elements/sc-data-graphql.js';
import { createContext, contexts } from '@scdevkit/data';

// NOTE: GRAPHQL_QUERY_RESULT comes from @scdevkit/data, not service-bench-core
const graphQLQueryResultContext = createContext(contexts.GRAPHQL_QUERY_RESULT);

// In render():
html`
  <sc-data-graphql query=${`
    query {
      ${EXPERIENCE_API_NAMESPACE} {
        get_items { id name status }
      }
    }
  `}>
    <div slot="loading">Loading...</div>
    <div slot="error">Error loading data</div>
    <div slot="empty">No items found</div>
    <div slot="loaded">
      <my-items-list></my-items-list>
    </div>
  </sc-data-graphql>
`
```

**Inside `my-items-list`, consume the result:**

```typescript
import { createContext, contexts } from '@scdevkit/data';

const graphQLQueryResultContext = createContext(contexts.GRAPHQL_QUERY_RESULT);

export class MyItemsList extends LitElement {
  _graphQLQueryResult = graphQLQueryResultContext.createConsumer(this);

  render() {
    const result = this._graphQLQueryResult.value;
    const items = result?.data?.[EXPERIENCE_API_NAMESPACE]?.get_items ?? [];
    return html`${items.map(item => html`<div>${item.name}</div>`)}`;
  }
}
```

| Property | Type | Description |
|---|---|---|
| `query` | `String` | GraphQL query string |
| `hideError` | `Boolean` | Hide error slot |
| `hideEmpty` | `Boolean` | Hide empty slot |
| `hideLoading` | `Boolean` | Hide loading slot |

---

## 8. Storage Client — File Upload & Download

### Setup context

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';
import { REST_EXPERIENCE_API_SVC_NAME } from '../constants/app';

const storageClientContext = createContext(contexts.STORAGE_CLIENT);

export class MyPage extends LitElement {
  _storageClient = storageClientContext.createConsumer(this);
}
```

### Simple request (non-binary)

```typescript
const storageClient = this._storageClient.value;
const response = await storageClient.request(
  REST_EXPERIENCE_API_SVC_NAME,   // module
  'resource/endpoint?param=value', // resource path
  'GET',                           // method (default 'GET')
  null,                            // body
  {},                              // headers
  {},                              // options
  { onSend: (client) => { this._abortClient = client; } } // callbacks
);
const data = await response.json();
```

### Download with progress

> ⚠️ `storageClient.download()` uses **XHR**, returns a `ProgressEvent` — NOT a Fetch Response. Parse via `progressEvent.target.response`.

```typescript
@state() downloading = false;
@state() downloadSize = 0;
@state() downloadTotalSize = 0;

async downloadFile(fileId: string) {
  const storageClient = this._storageClient.value;
  this.downloading = true;
  try {
    await storageClient.download(
      REST_EXPERIENCE_API_SVC_NAME,
      `resource/download?fileId=${fileId}`,
      {},                                   // options: { method, body, headers }
      { filename: 'file.pdf', mime: 'application/pdf' }, // fileOptions
      {
        onProgress: (e: ProgressEvent) => {
          this.downloadSize = e.loaded;
          this.downloadTotalSize = e.lengthComputable ? e.total : -1;
        }
      }
    );
  } catch (e) {
    console.error(e);
  } finally {
    this.downloading = false;
  }
}
```

### Upload with progress

> ⚠️ `storageClient.upload()` also uses **XHR**. Use `FormData` as body. Parse response via `progressEvent.target.response`.

```typescript
async uploadFile(file: File) {
  const storageClient = this._storageClient.value;
  this.uploading = true;
  const fd = new FormData();
  fd.append('file', file, file.name);
  try {
    const progressEvent = await storageClient.upload(
      REST_EXPERIENCE_API_SVC_NAME,
      'resource/upload',
      { body: fd },
      {
        onProgress: (e: ProgressEvent) => {
          this.uploadSize = e.loaded;
          this.uploadTotalSize = e.lengthComputable ? e.total : -1;
        }
      }
    );
    // Parse XHR response (NOT a Fetch Response!)
    const raw = progressEvent?.target?.response;
    const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (json?.error) throw new Error(json.error.message || 'Upload failed');
    return json;
  } catch (e: any) {
    // Handle XHR failure (ProgressEvent with target.response)
    if (e?.target?.response) {
      const errData = typeof e.target.response === 'string'
        ? JSON.parse(e.target.response)
        : e.target.response;
      throw new Error(errData?.error?.message || 'Upload failed');
    }
    throw e;
  } finally {
    this.uploading = false;
  }
}
```

---

## 9. REST Client — Server-Sent Events (SSE)

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';
import { REST_EXPERIENCE_API_SVC_NAME } from '../constants/app';

const restClientContext = createContext(contexts.REST_CLIENT);

export class MyPage extends LitElement {
  _restClient = restClientContext.createConsumer(this);
  _activeRequest: any = null;

  async sendSSERequest(input: string) {
    const restClient = this._restClient.value;

    const response = await restClient.request(
      REST_EXPERIENCE_API_SVC_NAME,
      'sse',
      'POST',
      JSON.stringify({ content: input }),
      { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
      {},
      { onSend: (client: any) => { this._activeRequest = client; } }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      chunk.split(/\r?\n/).forEach(line => {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          // handle SSE data
        }
      });
    }
  }

  abortRequest() {
    if (this._activeRequest?.abort) {
      try { this._activeRequest.abort(); } catch (e) { console.warn(e); }
    }
  }
}
```

---

## 10. File & Folder Conventions

```
src/
  api/
    GraphQLClientService.ts      ← singleton wrapper (one per plugin)
    <domain>Queries.ts           ← e.g. productQueries.ts, orderQueries.ts
    <domain>Mutations.ts         ← e.g. productMutations.ts, orderMutations.ts
    <domain>Apis.ts              ← e.g. fileApis.ts (REST/Storage operations)
  constants/
    app.ts                       ← EXPERIENCE_API_NAMESPACE, REST_EXPERIENCE_API_SVC_NAME
```

**Naming conventions:**
- Operation constants: `QUERY_<VERB>_<DOMAIN>` / `MUTATION_<VERB>_<DOMAIN>`
- Function names: camelCase matching the operation, e.g. `getAllItems`, `postItem`
- Input types: `<OperationName>Input`
- Response types: `<OperationName>Response`

---

## 11. Lookup / Reference Data Caching

Slow-changing lookup data (e.g. categories, statuses, roles) should be cached in the component to avoid redundant API calls:

```typescript
private _lookupDataCache: GetLookupDataResponse | null = null;

private async _getLookupData(): Promise<GetLookupDataResponse | null> {
  if (!this._lookupDataCache) {
    const data = await getAllLookupData(this._graphQLClient.graphQLClientContext);
    if (data) this._lookupDataCache = data;
  }
  return this._lookupDataCache;
}
```

---

## 12. Common Pitfalls

| Gotcha | Wrong | Correct |
|---|---|---|
| GraphQL context import | `import { contexts } from '@scdevkit/service-bench-core'` | `import { contexts } from '@scdevkit/data'` for `GRAPHQL_CLIENT` and `GRAPHQL_QUERY_RESULT` |
| Storage/REST context import | `import { contexts } from '@scdevkit/data'` | `import { contexts } from '@scdevkit/service-bench-core'` for `STORAGE_CLIENT` and `REST_CLIENT` |
| Parse GraphQL response | `const data = response.data` | `const json = await response.json()` then `json.data[NAMESPACE][OP]` |
| Parse upload/download response | `await storageClient.upload(...).json()` | `progressEvent.target.response` — it's XHR, not Fetch |
| Inline string in mutation | `name: "${params.name}"` | Use `gqlValue(params.name)` helper to escape special chars |
| Missing namespace in query | `query { get_items { id } }` | `query { ${EXPERIENCE_API_NAMESPACE} { get_items { id } } }` |
| Checking empty response | `if (!response)` | `if (!response \|\| typeof response.json !== 'function')` |
| Error handling difference | same for query and mutation | Queries `return undefined`; mutations `throw new Error(...)` |
