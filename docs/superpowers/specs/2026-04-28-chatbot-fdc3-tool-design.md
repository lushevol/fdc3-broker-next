# Chatbot FDC3 Tool Design

## Goal

Add a reusable chatbot-to-FDC3 frontend tool flow that lets the assistant:

- infer a declaration-backed FDC3 action from a user request
- ask for approval through the existing human-tool flow
- open the target tile and raise the FDC3 intent after approval
- receive the intent result from the tile handler
- continue the same chat turn using the returned data

The first implemented scenario is a trade query request such as `how is trades pending validation status ?`, which should propose opening a trade blotter tile, execute an FDC3 intent with structured query context, and continue the chat with the returned trade summary.

## Day 1 Scope

- Keep the source of truth in local declarations under `apps/base/src/fdc3/declarations`
- Reuse the existing chat protocol support for `human` and `frontend` tools
- Reuse the existing FDC3 broker, workspace opening, and resolver flow in `apps/base/src/fdc3/FDC3Integration.tsx`
- Add a new sample trade blotter tile in `apps/tile`, based on `FDC3Tile1`
- Add a new declaration-backed trade blotter intent and context definition
- Return mock filtered trades from the tile intent handler so the chatbot can continue with structured result data

Out of scope for day 1:

- platform FDC3 API as the source of truth
- broad natural-language matching across arbitrary business workflows
- production data services for trade search
- bypassing human approval

## Design Principles

1. The chatbot must not know tile internals.
2. The chat runtime should work through reusable action metadata, not per-intent hardcoded branches.
3. The day-1 declaration source must sit behind a provider interface so day 2 can switch to the platform FDC3 API without rewriting the chat tool contract.
4. Approval and execution are different concerns:
   - human tool answers `should we do this`
   - FDC3 resolver answers `which compatible target should handle this`
5. Intent results returned to chat must be compact, typed, and safe for continuation.

## High-Level Architecture

### 1. FDC3 Chat Action Provider

Add a provider abstraction in `apps/base` that resolves chat-available actions from an underlying FDC3 source.

Proposed interface shape:

- `listActions(): Promise<Fdc3ChatActionDefinition[]>`
- `findMatchingActions(userRequest: string): Promise<Fdc3ChatActionDefinition[]>`
- `resolveAction(actionId: string): Promise<Fdc3ChatResolvedAction>`

Day 1 implementation:

- reads `fdc3-definitions.json` and related declaration metadata
- derives action definitions from declared intents and compatible context types
- adds chat-specific metadata that raw FDC3 declarations do not express well on their own:
  - approval title/body
  - prompt matching hints
  - argument extraction rules
  - result summary hints

Day 2 implementation:

- swaps declaration reads for platform FDC3 API reads
- keeps the same output contract for the chatbot tools

### 2. Chat Tool Layer

Expose two reusable chat tools from `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`:

- `propose_fdc3_action`
  - source: `human`
  - used by the model to ask user approval for an FDC3 action proposal
  - arguments include action id, approval copy, intent name, and context preview

- `execute_fdc3_action`
  - source: `frontend`
  - executed only after approval
  - opens target tile if needed, raises the intent, waits for `resolution.getResult()`, and returns a structured result payload

This preserves the existing protocol behavior:

- `human` tools pause with `action-required`
- `frontend` tools execute in the shell and return a continuation payload to the backend

### 3. FDC3 Execution Service

Add a focused execution service in `apps/base` that encapsulates:

- action lookup through the provider
- candidate target resolution from declarations
- tile opening through the existing workspace helper / broker callbacks
- intent raising through the FDC3 agent
- resolver fallback when multiple targets exist
- result normalization for chatbot continuation

The chat runtime should call this service instead of touching broker internals directly.

### 4. Sample Trade Blotter Tile

Create a new tile in `apps/tile` that:

- registers itself with FDC3 using the same `AgentProvider` and registration pattern as `ExampleFDC3Tile`
- listens for the new trade query intent with `useIntentListener`
- parses the query context
- filters mock trade rows by requested status
- renders the matching rows in the tile UI
- returns a structured result object back to the intent caller

## Runtime Flow

1. User asks a question such as `how is trades pending validation status ?`
2. The assistant sees the chat-visible tool manifest and selects `propose_fdc3_action`
3. The proposed action references the trade blotter workflow resolved from local declarations
4. The chat protocol emits `action-required`
5. The user approves the proposal through the existing human-tool UI
6. The frontend resumes and executes `execute_fdc3_action`
7. The execution service:
   - resolves the action definition
   - opens the trade blotter tile if no suitable instance is open
   - raises the declared FDC3 intent with the structured query context
   - waits for the tile handler result
8. The tile handler renders the filtered trade state and returns structured data
9. The frontend tool returns that payload to the chat continuation flow
10. The assistant continues the same turn using the returned trade data

## Day 1 Data Contracts

### Chat Action Definition

The provider should return a normalized action definition roughly containing:

- `id`
- `title`
- `description`
- `approvalTitle`
- `approvalBody`
- `intent`
- `contextType`
- `targetAppIds`
- `matchingHints`
- `argumentSchema`
- `resultSchemaHint`

### Trade Query Context

Define a dedicated FDC3 context for the sample workflow, for example:

- `type: "fdc3.trade.query"`
- `filters.status`
- `filters.book` optional
- `filters.desk` optional
- `question`

Day 1 only needs enough fields to support the pending-validation scenario cleanly, but the context type should be extensible for later trade blotter searches.

### Trade Query Result

The tile should return a compact structured payload such as:

- `status`
- `intent`
- `appliedFilters`
- `totalCount`
- `summary`
- `trades`
  - bounded top-N rows only
- `tile`
  - app id
  - instance id

This keeps the payload usable for the model without pushing an unbounded dataset into continuation.

## Matching Strategy

Day 1 matching should be deliberately narrow and declaration-backed.

- The provider may use simple keyword and synonym matching for known actions.
- Matching logic must be attached to action metadata derived from declarations, not a free-floating switch in the tool executor.
- If there is no confident match, the assistant should not manufacture an FDC3 action.
- The first trade workflow should match phrases around:
  - trade blotter
  - trades pending validation
  - pending validation trades
  - validation status for trades

## Approval UX

Use the existing human-tool confirmation flow instead of a custom inline approval card.

Approval content should include:

- what tile will be opened
- what intent will be raised
- the extracted query filters
- a short statement that the chatbot will continue with the returned trade result after the tile responds

If the user rejects the action:

- no tile is opened
- no intent is raised
- the assistant resumes with a cancellation-aware reply

## Resolver and Multi-Target Behavior

If multiple targets can handle the approved intent:

- keep using the existing resolver UI from `FDC3Integration`
- do not duplicate target-selection UI inside chat

The chat approval answers whether the assistant may act. The resolver chooses the target application when necessary.

## Failure Handling

If no action matches:

- assistant falls back to normal respond or clarify behavior

If tile open fails:

- frontend tool returns a structured execution error
- assistant explains that the trade blotter could not be opened

If intent handling fails or times out:

- frontend tool returns a structured intent error
- assistant explains that the request did not complete

If the tile returns no result:

- treat it as an execution failure unless the intent contract explicitly allows `void`

All failures should be explicit in the continuation payload so the assistant does not silently stop.

## File / Responsibility Plan

### `apps/base`

- add provider and execution modules under the chatbot or fdc3 area
- extend `ChatbotSidebarV2` toolkit definitions with:
  - reusable human approval tool for FDC3 actions
  - reusable frontend execution tool for FDC3 actions
- add result renderers as needed for approval/execution states
- adapt local declaration reads into chat action metadata

### `apps/base/src/fdc3/declarations`

- add or update intent declarations for the trade blotter workflow
- add or update context declarations for the trade query payload

### `apps/tile`

- add a sample trade blotter tile
- wire it into tile routing
- register a tile declaration that can handle the trade intent
- implement mock trade data, filtering, rendering, and intent result return

## Testing Strategy

### Base app tests

- provider maps local declarations into chat action definitions
- trade request matching resolves the expected action
- human tool descriptor is exposed correctly in the protocol manifest
- frontend execution tool:
  - opens the right tile
  - raises the right intent with the right context
  - normalizes returned result payloads
  - emits explicit failures on open / raise / timeout paths

### Tile tests

- trade blotter intent listener receives query context
- pending-validation filter returns expected mock rows
- rendered UI reflects the filtered result set
- intent handler returns the structured result contract expected by chat continuation

### Integration tests

- chat protocol path covers:
  - user request
  - human approval required
  - frontend execution
  - continuation with returned result

### Manual verification

At `http://localhost:8001`:

1. log in
2. open the chatbot
3. ask for pending validation trade status
4. approve the proposed action
5. verify the trade blotter tile opens
6. verify the tile shows filtered mock trades
7. verify the assistant continues with the returned trade summary

## Open Day 2 Extension

When the platform FDC3 API becomes available:

- replace the declaration-backed provider with an API-backed provider
- keep the chat tool names and execution contract stable
- migrate matching hints and action metadata to API-delivered configuration where possible
- leave tile-side intent/result handling unchanged

## Success Criteria

- The assistant can propose an FDC3 action for the sample trade workflow
- The proposal always requires user approval on day 1
- Approval triggers a real FDC3 intent flow, not just tile navigation
- The target tile both renders the result and returns a structured payload
- The assistant continues the same conversation turn with the returned trade data
- The design leaves a clean source-of-truth seam for the future platform FDC3 API
