# Admin FDC3 Full Editor Design

## Goal

Make the Admin Module FDC3 screen a demo-ready editor for managing FDC3 declarations, intents, and context definitions. The screen should be easy to showcase, easy to understand at a glance, and capable of saving demo data back to the local declaration JSON files.

## Scope

- Enable create, update, and delete for app declarations.
- Enable create, update, and delete for intent master data.
- Enable create, update, and delete for context master data.
- Persist demo edits through the root-config local mock API into:
  - `apps/base/src/fdc3/declarations/fdc3-definitions.json`
  - `apps/base/src/fdc3/declarations/intents.json`
  - `apps/base/src/fdc3/declarations/contexts.json`
- Keep the endpoint contracts aligned with the existing admin FDC3 mock routes so a real backend can replace the file-backed store later.

## User Experience

The Admin FDC3 screen keeps three tabs: Declarations, Intents, and Contexts. All tabs are editable.

The Declarations tab shows a compact management view:

- Summary counts for declarations, intents, contexts, and declarations without configured intents.
- A local search field that filters by app id, tile title, intent name, and context type.
- A declaration grid with app id, tile title when available, listens count, raises count, context count, and actions.
- Create, edit, and delete actions that are available in demo mode.

The declaration editor remains a large dialog suitable for demoing:

- App selection uses available tile records and displays readable tile labels.
- Interop editing is split into "Listens For" and "Raises" sections.
- Each interop row selects one intent and one or more context types.
- JSON mode remains available for raw interop inspection and editing.
- Invalid JSON blocks saving and shows a direct validation message.

The Intents tab manages intent name and description. Deleting an intent warns when existing declarations reference it.

The Contexts tab manages context type, description, schema JSON, and sample JSON. Deleting a context warns when existing declarations reference it.

## Data Flow

`apps/base/src/admin/FDC3Declaration/services/useServices.ts` should call the root-config mock API routes instead of returning imported static JSON directly.

`apps/root-config/dev-server.ts` should own the demo file store:

1. Load declarations, intents, and contexts from the JSON files at dev-server startup.
2. Serve the current in-memory values through the existing `/api/auth/v1/fmo/admin/fdc3/*` routes.
3. On create, update, or delete, update memory and write the matching JSON file.
4. Preserve the current response shape: `{ data: ... }`.

The base app should not write files directly. It only calls admin endpoints.

## Validation

Declaration validation:

- `appId` is required.
- `interop.intents.listensFor` and `interop.intents.raises` normalize to arrays.
- Intent names selected in the structured editor should come from the intent master list.
- Context types selected in the structured editor should come from the context master list, while JSON mode may preserve unknown values for compatibility.

Intent validation:

- `name` is required.
- Duplicate names are not created.

Context validation:

- Context type is required.
- Schema JSON must parse to an object.
- Sample JSON must parse to an array.
- Context type should be derived from `schema.properties.type.const` when present, otherwise from `schema.type` for legacy demo data.

## Components

- `FDC3Declaration/index.tsx`: owns the tab layout, summary strip, search, and passes editable props.
- `FDC3Declaration/common/useController.tsx`: owns loading, filtering, relationship counts, and CRUD orchestration.
- `DeclarationDialog.tsx`: owns app selection, save/reset/delete actions, and interop validation state.
- `InteropEditor.tsx`: owns structured listens/raises editing and raw JSON mode.
- `IntentMasterList.tsx`: owns intent CRUD and reference warnings.
- `ContextMasterList.tsx`: owns context CRUD, schema JSON, sample JSON, and reference warnings.
- `root-config/dev-server.ts`: owns demo file-backed persistence.

## Testing

Use Jest for the base app changes and targeted helper tests for behavior that can be isolated from MUI rendering.

Test cases:

- FDC3 services call the admin endpoints for declarations, intents, and contexts.
- Controller enables create/edit/delete in demo mode.
- Declaration summary counts are derived from declaration interop data.
- Search matches app id, tile title, intent name, and context type.
- Interop editor normalizes existing listens/raises data and blocks invalid JSON saves.
- Intent and context delete flows detect current declaration references.
- File-backed dev-server helpers create, update, delete, and write the expected JSON structures.

## Non-Goals

- No production backend migration in this change.
- No FDC3 runtime broker behavior changes.
- No relationship matrix or multi-step wizard.
- No new design system dependency.
