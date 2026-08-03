---
tools: ['edit/editFiles', 'execute/runInTerminal', 'execute/getTerminalOutput', 'read/readFile', 'search', 'search/codebase']
description: 'Step 5 of leapkit-to-sb-plugin migration — Migrates services/API calls, finalises route wiring, runs build verification, and runs security validation.'
---

# Step 5 — Migrate Services & Routes

## Role

You are migrating services/API calls and finalising route wiring, then verifying the build and running the security validator.  
Unit tests are handled in Step 6.

Load the skills below before writing code:

| Task | Skill |
|---|---|
| Security / validation | `sb-protect-plugin` (if any `Guard` was present in the original app) |
| GraphQL (if applicable) | `sb-api-integration` |

---

## Autonomous Execution Rules

- ✅ Execute all terminal commands immediately without asking
- ✅ Load skills before writing the relevant code
- ✅ Run the build at the end — fix any failures before reporting success
- ❌ NEVER report "complete" if `npm run build` fails
- ❌ NEVER bypass security validation with `--force` or by suppressing errors
- ❌ NEVER use `@sc-sb-project/` in any source file — it is only allowed in `package.json` and azure-pipeline yaml files

---

## Section 1 — Service Migration

### 1A. Map REST calls to ApiService

For each method in the original `_leapkit-archive/src/services/` files:

1. Read the original service file
2. Create a typed wrapper in `src/api/[feature]Api.ts` using `ApiService`

**Pattern for each service method:**

```typescript
// src/api/[feature]Api.ts
import { ApiService } from './ApiService';

export interface [EntityType] {
  id: string;
  // ... derive fields from the original service response shape
}

export interface Create[Entity]Input {
  // ... derive from the original service request shape
}

/**
 * Migrated from: src/services/[Original]Service.[method]
 * Original path: [HTTP verb] [original baseURL + path]
 */
export async function get[Entities](api: ApiService): Promise<[EntityType][]> {
  return api.get<[EntityType][]>('/api/[namespace]/v1/[resource]');
}

export async function create[Entity](
  api: ApiService,
  input: Create[Entity]Input
): Promise<[EntityType]> {
  return api.post<[EntityType]>('/api/[namespace]/v1/[resource]', input);
}
```

### 1B. Replace service calls in Page Orchestrators

In each `src/views/[feature]/[Feature]Page.ts` that was created in Step 3, update `_fetchData()` and other methods to use the new typed API functions instead of direct `HttpService` calls.

### 1C. Caching pattern (if original used local cache)

```typescript
private _cache: [Type][] | null = null;

private async _getCachedData(): Promise<[Type][]> {
  if (!this._cache) {
    this._cache = await get[Entities](this._api);
  }
  return this._cache;
}
```

---

## Section 2 — Route Finalisation

### 2A. Verify manifests/routes.json completeness

Cross-check the Step 1 inventory routes table against the current `manifests/routes.json`:
- Every `SimpleView path` has a corresponding route entry
- Every route entry has a matching `elements/[feature].js` file
- Every `elements/[feature].js` is imported in `elements/index.js`
- All path parameters (`:id?`, `:type?`) are correctly expressed

### 2B. Verify elements/index.js barrel

```js
// elements/index.js — must import ALL element files
import './home.js';
import './details.js';
import './explore.js';
// ... one import per page
```

### 2C. Permission-protected routes

If the original project had `<Guard permission="...">`, load the `sb-protect-plugin` skill.

The SB plugin router does **not** support a `permissions` array in `routes.json`. Access control is handled by adding an `id` field to the route — SC-IDP authorization then controls visibility based on that id. Routes without an `id` are open to all users by default.

For each page that was previously wrapped in `<Guard>`, add an `id` to its route entry in `manifests/routes.json`:

```json
{
  "id": "[route-id]",
  "path": "[feature]",
  "component": "[prefix]-[feature]",
  "element": "[feature].js"
}
```

For in-component content guarding (sub-sections within a page), use `<sb-content-guard>` — see the `sb-protect-plugin` skill for the full pattern.

---

## Section 3 — Build Verification

Run the full build:

```bash
npm run build
```

Fix any TypeScript compilation errors or rollup bundling errors before proceeding.

Common migration issues:
- `Cannot find module` → ensure all imports use `.js` extension (LitElement + TypeScript rollup requirement)
- `Property '_xyz' is private` → change test access to `(el as any)._xyz` if needed
- Decorator errors → verify `"experimentalDecorators": true` in `tsconfig.json`
- Missing type → add to `src/types/index.ts`

---

## Section 4 — Security Validation

Run the SB DevKit security scanner:

```bash
npx @scdevkit/cli@latest --action validate
```

Fix all reported issues before proceeding to Step 6. Apply only the minimum fix for each issue — do not restructure files unnecessarily.
