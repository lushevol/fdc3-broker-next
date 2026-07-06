# Admin FDC3 Full Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demo-ready full editor for Admin Module FDC3 declarations, intents, and contexts, with edits persisted to local JSON declaration files.

**Architecture:** Keep the base app as an API client only. Add pure helpers for FDC3 admin normalization, filtering, counting, and validation; use those helpers from the React controller/editor. Move root-config FDC3 mock state into a file-backed store that reads and writes the three declaration JSON files through the existing mock API routes.

**Tech Stack:** React 18, TypeScript, MUI 5, MUI X DataGrid, Jest, Testing Library, Rsbuild dev middleware, Node `fs`.

## Global Constraints

- React functional components and hooks only.
- TypeScript strict-mode style; avoid `any` in new code where a local type is reasonable.
- Follow TDD: write a failing test, verify red, implement minimal code, verify green.
- Use existing Admin Module and MUI patterns; do not add a new UI dependency.
- Demo persistence writes only local JSON files through `apps/root-config/dev-server.ts`; the base app must not write files directly.
- Do not change FDC3 broker/runtime behavior.

---

## File Structure

- Create `apps/base/src/admin/FDC3Declaration/common/model.ts`: local FDC3 admin types, type guards, context-type extraction, interop normalization, reference detection, search, and summary helpers.
- Create `apps/base/src/admin/FDC3Declaration/common/model.test.ts`: focused Jest tests for pure helpers.
- Modify `apps/base/src/admin/FDC3Declaration/services/useServices.ts`: call existing admin FDC3 endpoints instead of imported static JSON stubs.
- Create `apps/base/src/admin/FDC3Declaration/services/useServices.test.ts`: verifies endpoint use by mocking `postService`.
- Modify `apps/root-config/dev-server.ts`: replace hardcoded FDC3 mock store with file-backed helpers and route handlers.
- Create `apps/root-config/dev-server.fdc3-store.test.ts`: tests file-backed helper behavior with temporary JSON files.
- Modify `apps/base/src/admin/FDC3Declaration/common/useController.tsx`: load editable data, expose search state, summaries, CRUD handlers, reference warnings, and filtered rows.
- Modify `apps/base/src/admin/FDC3Declaration/index.tsx`: render summary strip, search, editable tabs, and pass declaration references to child lists.
- Modify `apps/base/src/admin/FDC3Declaration/common/DeclarationDialog.tsx`: make create/edit save work, add delete action, validate JSON mode through `InteropEditor`, and show tile labels.
- Modify `apps/base/src/admin/FDC3Declaration/common/InteropEditor.tsx`: use normalized arrays, expose JSON validity, and keep structured editor editable.
- Modify `apps/base/src/admin/FDC3Declaration/common/IntentMasterList.tsx`: enable CRUD and show reference warning on delete.
- Modify `apps/base/src/admin/FDC3Declaration/common/ContextMasterList.tsx`: enable CRUD, add schema/sample JSON editing, and show reference warning on delete.

---

### Task 1: Pure FDC3 Admin Model Helpers

**Files:**
- Create: `apps/base/src/admin/FDC3Declaration/common/model.ts`
- Test: `apps/base/src/admin/FDC3Declaration/common/model.test.ts`

**Interfaces:**
- Produces: `getContextType(context: FDC3ContextDefinition): string`
- Produces: `normalizeInterop(interop?: Partial<FDC3Interop>): FDC3Interop`
- Produces: `getDeclarationSummary(declarations: FDC3DeclarationData[], intents: FDC3IntentDefinition[], contexts: FDC3ContextDefinition[]): FDC3DeclarationSummary`
- Produces: `filterDeclarations(declarations: FDC3DeclarationData[], tiles: FDC3TileOption[], query: string): FDC3DeclarationData[]`
- Produces: `getReferencedIntentNames(declarations: FDC3DeclarationData[], intentName: string): string[]`
- Produces: `getReferencedContextTypes(declarations: FDC3DeclarationData[], contextType: string): string[]`

- [ ] **Step 1: Write the failing helper tests**

```ts
// apps/base/src/admin/FDC3Declaration/common/model.test.ts
import {
  filterDeclarations,
  getContextType,
  getDeclarationSummary,
  getReferencedContextTypes,
  getReferencedIntentNames,
  normalizeInterop,
} from './model';

describe('FDC3Declaration model helpers', () => {
  const declarations = [
    {
      appId: 'trade-blotter',
      interop: {
        intents: {
          listensFor: [{ intent: 'SearchTrades', contexts: ['fdc3.trade.query'] }],
          raises: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
        },
      },
    },
    {
      appId: 'cashflow-tile',
      interop: { intents: { listensFor: [], raises: [] } },
    },
  ];

  test('extracts context type from JSON schema const before legacy schema type', () => {
    expect(
      getContextType({
        schema: { type: 'object', properties: { type: { const: 'fdc3.instrument' } } },
      }),
    ).toBe('fdc3.instrument');
    expect(getContextType({ schema: { type: 'fdc3.contact' } })).toBe('fdc3.contact');
  });

  test('normalizes missing raises/listensFor to arrays', () => {
    expect(normalizeInterop({ intents: { listensFor: { ViewChart: { contexts: [] } } } }).intents)
      .toEqual({
        listensFor: [{ intent: 'ViewChart', contexts: [] }],
        raises: [],
      });
  });

  test('summarizes declarations and empty declarations', () => {
    expect(getDeclarationSummary(declarations, [{ name: 'SearchTrades', description: '' }], []))
      .toEqual({
        declarations: 2,
        intents: 1,
        contexts: 0,
        emptyDeclarations: 1,
      });
  });

  test('filters declarations by app id, tile title, intent, and context type', () => {
    const tiles = [{ tileId: 'trade-blotter', title: 'Trade Blotter' }];
    expect(filterDeclarations(declarations, tiles, 'blotter')).toHaveLength(1);
    expect(filterDeclarations(declarations, tiles, 'SearchTrades')).toHaveLength(1);
    expect(filterDeclarations(declarations, tiles, 'fdc3.instrument')).toHaveLength(1);
  });

  test('detects declaration references for intent and context deletion warnings', () => {
    expect(getReferencedIntentNames(declarations, 'SearchTrades')).toEqual(['trade-blotter']);
    expect(getReferencedContextTypes(declarations, 'fdc3.instrument')).toEqual(['trade-blotter']);
  });
});
```

- [ ] **Step 2: Run helper tests to verify red**

Run: `cd apps/base && npx jest src/admin/FDC3Declaration/common/model.test.ts --runInBand`

Expected: FAIL because `./model` does not exist.

- [ ] **Step 3: Implement the model helpers**

```ts
// apps/base/src/admin/FDC3Declaration/common/model.ts
import type {
  FDC3ContextDefinition,
  FDC3DeclarationData,
  FDC3Interop,
  FDC3IntentDefinition,
} from './interface';

export interface FDC3TileOption {
  tileId?: string;
  appId?: string;
  title?: string;
}

export interface FDC3DeclarationSummary {
  declarations: number;
  intents: number;
  contexts: number;
  emptyDeclarations: number;
}

export interface FDC3IntentContextEntry {
  intent: string;
  contexts: string[];
}

const getEntries = (
  value: FDC3Interop['intents']['listensFor'] | FDC3Interop['intents']['raises'] | undefined,
): FDC3IntentContextEntry[] => {
  if (Array.isArray(value)) {
    return value.map((entry) =>
      typeof entry === 'string'
        ? { intent: entry, contexts: [] }
        : { intent: entry.intent, contexts: entry.contexts ?? [] },
    );
  }

  return Object.entries((value ?? {}) as Record<string, { contexts?: string[] }>).map(
    ([intent, entry]) => ({
      intent,
      contexts: entry?.contexts ?? [],
    }),
  );
};

export const getContextType = (context: FDC3ContextDefinition): string => {
  const schema = context.schema as {
    type?: string;
    properties?: { type?: { const?: string } };
  };
  return schema.properties?.type?.const ?? schema.type ?? '';
};

export const normalizeInterop = (interop?: Partial<FDC3Interop>): FDC3Interop => ({
  ...interop,
  intents: {
    listensFor: getEntries(interop?.intents?.listensFor),
    raises: getEntries(interop?.intents?.raises),
  },
});

export const getDeclarationSummary = (
  declarations: FDC3DeclarationData[],
  intents: FDC3IntentDefinition[],
  contexts: FDC3ContextDefinition[],
): FDC3DeclarationSummary => ({
  declarations: declarations.length,
  intents: intents.length,
  contexts: contexts.length,
  emptyDeclarations: declarations.filter((declaration) => {
    const normalized = normalizeInterop(declaration.interop);
    return (
      normalized.intents.listensFor.length === 0 &&
      (normalized.intents.raises?.length ?? 0) === 0
    );
  }).length,
});

export const findTileLabel = (tiles: FDC3TileOption[], appId: string): string => {
  const tile = tiles.find((item) => item.tileId === appId || item.appId === appId);
  return [tile?.title, tile?.tileId ?? tile?.appId].filter(Boolean).join(' - ');
};

export const filterDeclarations = (
  declarations: FDC3DeclarationData[],
  tiles: FDC3TileOption[],
  query: string,
): FDC3DeclarationData[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return declarations;

  return declarations.filter((declaration) => {
    const interop = normalizeInterop(declaration.interop);
    const searchable = [
      declaration.appId,
      findTileLabel(tiles, declaration.appId),
      ...interop.intents.listensFor.flatMap((entry) => [entry.intent, ...entry.contexts]),
      ...(interop.intents.raises ?? []).flatMap((entry) => [entry.intent, ...entry.contexts]),
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
};

export const getReferencedIntentNames = (
  declarations: FDC3DeclarationData[],
  intentName: string,
): string[] =>
  declarations
    .filter((declaration) => {
      const interop = normalizeInterop(declaration.interop);
      return [...interop.intents.listensFor, ...(interop.intents.raises ?? [])].some(
        (entry) => entry.intent === intentName,
      );
    })
    .map((declaration) => declaration.appId);

export const getReferencedContextTypes = (
  declarations: FDC3DeclarationData[],
  contextType: string,
): string[] =>
  declarations
    .filter((declaration) => {
      const interop = normalizeInterop(declaration.interop);
      return [...interop.intents.listensFor, ...(interop.intents.raises ?? [])].some((entry) =>
        entry.contexts.includes(contextType),
      );
    })
    .map((declaration) => declaration.appId);
```

- [ ] **Step 4: Run helper tests to verify green**

Run: `cd apps/base && npx jest src/admin/FDC3Declaration/common/model.test.ts --runInBand`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/admin/FDC3Declaration/common/model.ts apps/base/src/admin/FDC3Declaration/common/model.test.ts
git commit -m "Add FDC3 admin model helpers"
```

---

### Task 2: File-Backed FDC3 Mock Store

**Files:**
- Modify: `apps/root-config/dev-server.ts`
- Test: `apps/root-config/dev-server.fdc3-store.test.ts`

**Interfaces:**
- Consumes: JSON files under `apps/base/src/fdc3/declarations`.
- Produces: exported helper `createFileBackedFdc3Store(paths: Fdc3StorePaths): Fdc3StoreApi`.
- Produces: existing admin mock routes that read/write declarations, intents, and contexts.

- [ ] **Step 1: Write failing store tests**

```ts
// apps/root-config/dev-server.fdc3-store.test.ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createFileBackedFdc3Store } from './dev-server';

describe('file-backed FDC3 store', () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fdc3-store-'));
    fs.writeFileSync(path.join(dir, 'fdc3-definitions.json'), '[]');
    fs.writeFileSync(path.join(dir, 'intents.json'), '[]');
    fs.writeFileSync(path.join(dir, 'contexts.json'), '[]');
  });

  test('creates, updates, and deletes declarations in the JSON file', () => {
    const store = createFileBackedFdc3Store({
      declarations: path.join(dir, 'fdc3-definitions.json'),
      intents: path.join(dir, 'intents.json'),
      contexts: path.join(dir, 'contexts.json'),
    });

    store.createDeclaration({ appId: 'demo', interop: { intents: { listensFor: [] } } });
    store.updateDeclaration({ appId: 'demo', interop: { intents: { raises: [] } } });
    expect(JSON.parse(fs.readFileSync(path.join(dir, 'fdc3-definitions.json'), 'utf8'))).toEqual([
      { appId: 'demo', interop: { intents: { raises: [] } } },
    ]);

    store.deleteDeclaration({ appId: 'demo' });
    expect(JSON.parse(fs.readFileSync(path.join(dir, 'fdc3-definitions.json'), 'utf8'))).toEqual(
      [],
    );
  });
});
```

- [ ] **Step 2: Run store tests to verify red**

Run: `cd apps/root-config && npx jest dev-server.fdc3-store.test.ts --runInBand`

Expected: FAIL because `createFileBackedFdc3Store` is not exported.

- [ ] **Step 3: Implement file-backed store helpers in `dev-server.ts`**

Add imports:

```ts
import fs from 'node:fs';
import path from 'node:path';
```

Add exported types/helpers near the existing FDC3 types:

```ts
export type Fdc3StorePaths = {
  declarations: string;
  intents: string;
  contexts: string;
};

export type Fdc3StoreApi = Fdc3Store & {
  createDeclaration: (body: JsonRecord) => Fdc3Declaration;
  updateDeclaration: (body: JsonRecord) => Fdc3Declaration;
  deleteDeclaration: (body: JsonRecord) => Fdc3Declaration;
  createIntent: (body: JsonRecord) => Fdc3Intent;
  updateIntent: (body: JsonRecord) => Fdc3Intent;
  deleteIntent: (body: JsonRecord) => Fdc3Intent;
  createContext: (body: JsonRecord) => Fdc3Context;
  updateContext: (body: JsonRecord) => Fdc3Context;
  deleteContext: (body: JsonRecord) => Fdc3Context;
};

const readJsonFile = <T>(filePath: string, fallback: T): T => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return fallback;
  }
};

const writeJsonFile = (filePath: string, value: unknown): void => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

export const createFileBackedFdc3Store = (paths: Fdc3StorePaths): Fdc3StoreApi => {
  const store: Fdc3Store = {
    declarations: readJsonFile<Fdc3Declaration[]>(paths.declarations, []),
    intents: readJsonFile<Fdc3Intent[]>(paths.intents, []),
    contexts: readJsonFile<Fdc3Context[]>(paths.contexts, []),
  };

  return {
    ...store,
    createDeclaration(body) {
      const item = { ...body, appId: String(body.appId || `app-${Date.now()}`) };
      store.declarations = [item, ...store.declarations.filter((entry) => entry.appId !== item.appId)];
      this.declarations = store.declarations;
      writeJsonFile(paths.declarations, store.declarations);
      return item;
    },
    updateDeclaration(body) {
      const appId = String(body.appId ?? '');
      store.declarations = store.declarations.map((entry) =>
        entry.appId === appId ? { ...entry, ...body } : entry,
      );
      this.declarations = store.declarations;
      writeJsonFile(paths.declarations, store.declarations);
      return body;
    },
    deleteDeclaration(body) {
      const appId = String(body.appId ?? '');
      store.declarations = store.declarations.filter((entry) => entry.appId !== appId);
      this.declarations = store.declarations;
      writeJsonFile(paths.declarations, store.declarations);
      return body;
    },
    createIntent(body) {
      const item = { name: String(body.name ?? ''), description: String(body.description ?? '') };
      if (item.name && !store.intents.some((entry) => entry.name === item.name)) {
        store.intents = [...store.intents, item];
        this.intents = store.intents;
        writeJsonFile(paths.intents, store.intents);
      }
      return item;
    },
    updateIntent(body) {
      const item = { name: String(body.name ?? ''), description: String(body.description ?? '') };
      store.intents = store.intents.map((entry) => (entry.name === item.name ? item : entry));
      this.intents = store.intents;
      writeJsonFile(paths.intents, store.intents);
      return item;
    },
    deleteIntent(body) {
      const item = { name: String(body.name ?? ''), description: String(body.description ?? '') };
      store.intents = store.intents.filter((entry) => entry.name !== item.name);
      this.intents = store.intents;
      writeJsonFile(paths.intents, store.intents);
      return item;
    },
    createContext(body) {
      const item = body as Fdc3Context;
      const type = String(item.schema?.type ?? '');
      if (type && !store.contexts.some((entry) => entry.schema?.type === type)) {
        store.contexts = [...store.contexts, item];
        this.contexts = store.contexts;
        writeJsonFile(paths.contexts, store.contexts);
      }
      return item;
    },
    updateContext(body) {
      const item = body as Fdc3Context;
      const type = String(item.schema?.type ?? '');
      store.contexts = store.contexts.map((entry) => (entry.schema?.type === type ? item : entry));
      this.contexts = store.contexts;
      writeJsonFile(paths.contexts, store.contexts);
      return item;
    },
    deleteContext(body) {
      const item = body as Fdc3Context;
      const type = String(item.schema?.type ?? '');
      store.contexts = store.contexts.filter((entry) => entry.schema?.type !== type);
      this.contexts = store.contexts;
      writeJsonFile(paths.contexts, store.contexts);
      return item;
    },
  };
};
```

Replace `createFdc3Store()` body with:

```ts
function createFdc3Store(): Fdc3StoreApi {
  return createFileBackedFdc3Store({
    declarations: path.resolve(__dirname, '../base/src/fdc3/declarations/fdc3-definitions.json'),
    intents: path.resolve(__dirname, '../base/src/fdc3/declarations/intents.json'),
    contexts: path.resolve(__dirname, '../base/src/fdc3/declarations/contexts.json'),
  });
}
```

Update each FDC3 route handler to call the store methods, for example:

```ts
createMiddleware('/api/auth/v1/fmo/admin/fdc3/create', async (req, res) => {
  sendJson(res, fdc3Store.createDeclaration(await parseJsonBody(req)));
});
```

- [ ] **Step 4: Run store tests to verify green**

Run: `cd apps/root-config && npx jest dev-server.fdc3-store.test.ts --runInBand`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/root-config/dev-server.ts apps/root-config/dev-server.fdc3-store.test.ts
git commit -m "Persist FDC3 admin mock data to JSON"
```

---

### Task 3: Base FDC3 Admin Services and Controller

**Files:**
- Modify: `apps/base/src/admin/FDC3Declaration/services/useServices.ts`
- Test: `apps/base/src/admin/FDC3Declaration/services/useServices.test.ts`
- Modify: `apps/base/src/admin/FDC3Declaration/common/useController.tsx`

**Interfaces:**
- Consumes: `model.ts` helpers from Task 1.
- Consumes: root-config API routes from Task 2.
- Produces: controller values `summary`, `search`, `setSearch`, `filteredRows`, `intentReferences`, and `contextReferences`.

- [ ] **Step 1: Write failing service endpoint tests**

```ts
// apps/base/src/admin/FDC3Declaration/services/useServices.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import useServices from './useServices';
import { postService } from '../../../hooks/service';

jest.mock('../../../hooks/service', () => ({
  postService: jest.fn(),
}));

jest.mock('../../../hooks/HooksBase', () => ({
  getHooksBase: () => ({ baseDispatch: jest.fn() }),
}));

const mockedPostService = postService as jest.Mock;

describe('FDC3Declaration services', () => {
  beforeEach(() => {
    mockedPostService.mockResolvedValue({ data: { data: [] } });
  });

  test('loads declarations through the admin API', async () => {
    const { result } = renderHook(() => useServices());
    await act(async () => {
      await result.current.getDeclaration('token', {});
    });
    expect(mockedPostService).toHaveBeenCalledWith(
      '/auth/v1/fmo/admin/fdc3/data',
      { entitlementsToken: 'token' },
      expect.any(Object),
    );
  });

  test('creates intent through the admin API', async () => {
    const { result } = renderHook(() => useServices());
    await act(async () => {
      await result.current.createIntent('token', { name: 'ViewChart', description: 'View chart' });
    });
    expect(mockedPostService).toHaveBeenCalledWith('/auth/v1/fmo/admin/fdc3/intent/create', {
      entitlementsToken: 'token',
      name: 'ViewChart',
      description: 'View chart',
    });
  });
});
```

- [ ] **Step 2: Run service tests to verify red**

Run: `cd apps/base && npx jest src/admin/FDC3Declaration/services/useServices.test.ts --runInBand`

Expected: FAIL because current services return imported JSON and do not call the endpoints.

- [ ] **Step 3: Replace static service stubs with endpoint calls**

In `useServices.ts`, remove imports for `intents.json`, `contexts.json`, and `fdc3-definitions.json`. Restore the existing commented API bodies for declaration, intent, and context methods. Keep the `samples` normalization in `getContextList` after the API result:

```ts
const getContextList = React.useCallback(async (entitlementsToken) => {
  try {
    const resposnse = await postService('/auth/v1/fmo/admin/fdc3/context/data', {
      entitlementsToken,
    });
    return (
      resposnse?.data?.data?.map((ctx) => ({
        ...ctx,
        samples: ctx.samples ?? ctx.simples ?? [],
      })) ?? []
    );
  } catch (_e) {
    return [];
  }
}, []);
```

Make create/update/delete methods return `resposnse?.data?.data ?? {}`.

- [ ] **Step 4: Update controller state and CRUD orchestration**

In `useController.tsx`:

```ts
import {
  filterDeclarations,
  getDeclarationSummary,
  getReferencedContextTypes,
  getReferencedIntentNames,
  normalizeInterop,
} from './model';
```

Add state and derived values:

```ts
const [search, setSearch] = React.useState('');
const filteredRows = React.useMemo(
  () => filterDeclarations(data, tiles, search),
  [data, tiles, search],
);
const summary = React.useMemo(
  () => getDeclarationSummary(data, intents, contexts),
  [data, intents, contexts],
);
```

Set mapped declarations with normalized interop:

```ts
const mapped = _data.map((item) => ({
  ...item,
  id: item.appId,
  interop: normalizeInterop(item.interop),
}));
```

Set `disableCreateNew` to `false`.

Return `rows: filteredRows`, `summary`, `search`, `setSearch`, `intentReferences: getReferencedIntentNames`, and `contextReferences: getReferencedContextTypes`.

- [ ] **Step 5: Run service tests to verify green**

Run: `cd apps/base && npx jest src/admin/FDC3Declaration/services/useServices.test.ts src/admin/FDC3Declaration/common/model.test.ts --runInBand`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/base/src/admin/FDC3Declaration/services/useServices.ts apps/base/src/admin/FDC3Declaration/services/useServices.test.ts apps/base/src/admin/FDC3Declaration/common/useController.tsx
git commit -m "Wire FDC3 admin services to mock API"
```

---

### Task 4: Editable FDC3 Admin UI

**Files:**
- Modify: `apps/base/src/admin/FDC3Declaration/index.tsx`
- Modify: `apps/base/src/admin/FDC3Declaration/common/DeclarationDialog.tsx`
- Modify: `apps/base/src/admin/FDC3Declaration/common/InteropEditor.tsx`
- Modify: `apps/base/src/admin/FDC3Declaration/common/IntentMasterList.tsx`
- Modify: `apps/base/src/admin/FDC3Declaration/common/ContextMasterList.tsx`
- Modify: `apps/base/src/admin/FDC3Declaration/common/style.ts`

**Interfaces:**
- Consumes: controller values from Task 3.
- Consumes: `getContextType`, `normalizeInterop`, and reference helpers from Task 1.
- Produces: an editable demo UI for declarations, intents, and contexts.

- [ ] **Step 1: Write a focused failing UI test for JSON validation**

```ts
// apps/base/src/admin/FDC3Declaration/common/InteropEditor.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import InteropEditor from './InteropEditor';

test('reports invalid JSON mode to the parent', () => {
  const onValidityChange = jest.fn();
  render(
    <InteropEditor
      value={{ intents: { listensFor: [], raises: [] } }}
      onChange={jest.fn()}
      onValidityChange={onValidityChange}
      intents={[]}
      contexts={[]}
    />,
  );

  fireEvent.click(screen.getByLabelText('JSON Mode'));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '{' } });

  expect(screen.getByText(/Unexpected end of JSON input/)).toBeInTheDocument();
  expect(onValidityChange).toHaveBeenLastCalledWith(false);
});
```

- [ ] **Step 2: Run UI test to verify red**

Run: `cd apps/base && npx jest src/admin/FDC3Declaration/common/InteropEditor.test.tsx --runInBand`

Expected: FAIL because `onValidityChange` is not a supported prop.

- [ ] **Step 3: Update `InteropEditor`**

Add prop:

```ts
onValidityChange?: (isValid: boolean) => void;
```

In JSON parsing:

```ts
try {
  const parsed = JSON.parse(newVal);
  onChange(normalizeInterop(parsed));
  setJsonError(null);
  onValidityChange?.(true);
} catch (e) {
  const message = e instanceof Error ? e.message : 'Invalid JSON';
  setJsonError(message);
  onValidityChange?.(false);
}
```

Use `normalizeInterop(value)` before rendering structured listens/raises entries.

- [ ] **Step 4: Update `DeclarationDialog` for editable demo actions**

Add props:

```ts
onDelete?: (data: FDC3DeclarationData) => Promise<void>;
```

Track JSON validity:

```ts
const [isInteropValid, setIsInteropValid] = useState(true);
```

Disable save with:

```tsx
disabled={!formData.appId || !isInteropValid}
```

Pass validity callback:

```tsx
<InteropEditor
  value={formData.interop}
  onChange={(val) => setFormData({ ...formData, interop: val })}
  onValidityChange={setIsInteropValid}
  intents={intents}
  contexts={contexts}
  readOnly={readOnly}
/>
```

Render delete button in edit mode:

```tsx
{isEdit && onDelete && !readOnly && (
  <Button onClick={() => onDelete(formData)} color="error" variant="outlined">
    Delete
  </Button>
)}
```

- [ ] **Step 5: Update `index.tsx` management layout**

Render summary and search above the declarations grid:

```tsx
<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))', gap: 1, mb: 2 }}>
  <Box>Declarations: {summary.declarations}</Box>
  <Box>Intents: {summary.intents}</Box>
  <Box>Contexts: {summary.contexts}</Box>
  <Box>Empty: {summary.emptyDeclarations}</Box>
</Box>
<Input
  label="Search FDC3"
  value={search}
  onChange={(event) => setSearch(event.target.value)}
/>
```

Set all child lists and dialog to editable:

```tsx
readOnly={false}
```

Pass `onDelete={deleteDeclaration}` to `DeclarationDialog`.

- [ ] **Step 6: Update intent/context master lists**

For `IntentMasterList`, add prop:

```ts
getReferences?: (intentName: string) => string[];
```

In delete confirmation:

```tsx
const references = getReferences?.(currentIntent.name) ?? [];
{references.length > 0 && (
  <DialogContentText color="warning.main">
    Used by: {references.join(', ')}
  </DialogContentText>
)}
```

For `ContextMasterList`, add `getReferences?: (contextType: string) => string[]`, schema JSON state, sample JSON state, parse validation, and save only when both parse correctly.

- [ ] **Step 7: Run UI tests and type checks**

Run: `cd apps/base && npx jest src/admin/FDC3Declaration/common/InteropEditor.test.tsx src/admin/FDC3Declaration/common/model.test.ts src/admin/FDC3Declaration/services/useServices.test.ts --runInBand`

Expected: PASS.

Run: `cd apps/base && npm run lint`

Expected: PASS with no new warnings from touched files.

- [ ] **Step 8: Commit**

```bash
git add apps/base/src/admin/FDC3Declaration
git commit -m "Make Admin FDC3 screen editable"
```

---

### Task 5: End-to-End Verification

**Files:**
- Modify only if verification finds a defect in Task 1-4 files.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified local demo flow at `http://localhost:8001`.

- [ ] **Step 1: Run focused tests**

Run:

```bash
cd apps/base && npx jest src/admin/FDC3Declaration/common/model.test.ts src/admin/FDC3Declaration/services/useServices.test.ts src/admin/FDC3Declaration/common/InteropEditor.test.tsx --runInBand
cd ../root-config && npx jest dev-server.fdc3-store.test.ts --runInBand
```

Expected: PASS.

- [ ] **Step 2: Run workspace lint for touched apps**

Run:

```bash
cd apps/base && npm run lint
cd ../root-config && npm run lint
```

Expected: PASS.

- [ ] **Step 3: Start local dev UI**

Run from repo root:

```bash
npm run dev:ui
```

Expected: root-config available at `http://localhost:8001`.

- [ ] **Step 4: Manual demo verification**

Open `http://localhost:8001` and verify:

1. Click `login`.
2. Click `New Tile`.
3. Open `Admin Module`.
4. Open the FDC3 admin tile.
5. Create a new intent, create a new context, create or edit a declaration using both, and save.
6. Refresh the page and confirm the edited values are still present.
7. Confirm the corresponding JSON files under `apps/base/src/fdc3/declarations` changed.

- [ ] **Step 5: Commit any verification fixes**

```bash
git add apps/base/src/admin/FDC3Declaration apps/root-config/dev-server.ts apps/root-config/dev-server.fdc3-store.test.ts apps/base/src/fdc3/declarations
git commit -m "Verify Admin FDC3 editor demo flow"
```
