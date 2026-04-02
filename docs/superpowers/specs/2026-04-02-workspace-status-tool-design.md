# Workspace Status Tool Design

## Goal

Add a frontend chatbot tool that reports current workspace status and renders an inline card with a destructive quick action to close all opened tiles across all tabs/workspaces.

## Scope

The tool must:

- expose current workspace/session status to the assistant through the existing frontend tool manifest flow
- render an inline assistant card
- report:
  - active workspace label
  - total workspaces/tabs
  - total opened tiles across all workspaces
  - per-workspace tile counts
- provide a `Close all tiles` button in the card
- execute entirely in the browser through the centralized frontend tool registry

The tool must not:

- introduce backend changes to the SSE or tool manifest contract
- add a second state-management path for workspaces
- close the workspaces themselves unless existing behavior requires empty-workspace fallback

## Design

### Registration

Register the tool only in:

- `apps/base/src/components/ChatbotSidebar/tools/createFrontendToolRegistry.ts`

It will be part of the production default frontend toolkit.

### Runtime dependencies

Extend the frontend tool registry configuration with:

- a workspace snapshot source derived from the existing Home/store state
- a `closeAllTiles` action implemented using existing workspace/home actions

### Tool shape

Create a dedicated tool factory under:

- `apps/base/src/components/ChatbotSidebar/tools/workspaceStatusTool.tsx`

The tool will:

- return a structured snapshot result
- match prompts related to workspace status
- render a card with summary stats
- allow human-triggered execution of `Close all tiles`

### UI behavior

The card should:

- clearly mark the active workspace
- show aggregate counts first
- show per-workspace tile counts in a compact list
- disable the destructive button while running
- show success/error feedback inline after the action

### Action semantics

`Close all tiles` applies to all workspaces/tabs in the session.

Implementation should:

- iterate through the existing workspace data
- remove containers/tiles using existing app actions where possible
- preserve the workspace structure rather than deleting all workspaces themselves

## Risks

- Workspace mutation logic may currently be coupled to per-tab UI actions.
- Existing hooks may not expose one obvious bulk-close operation.

## Mitigation

- Reuse existing remove/edit/home controller actions instead of inventing parallel state writes.
- Add focused tests for the tool factory and card action behavior.
