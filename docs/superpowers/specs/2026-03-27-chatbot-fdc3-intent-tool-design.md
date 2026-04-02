# Chatbot FDC3 Intent Tool Design

## Goal

Add a minimal chatbot tool flow for FDC3 interoperability that:

- matches a user prompt to a declaration-backed FDC3 intent
- renders a generative UI confirmation card in the assistant thread
- opens the matched tile and raises the intent only after the user clicks `Process Intent`
- drops requests that do not match the local declarations

## Scope

- use the local declaration files in `apps/base/src/fdc3/declarations`
- support the happy path for `ViewChart`
- keep matching intentionally narrow for the first implementation

## Matching Rules

- derive candidate intents from `fdc3-definitions.json`
- derive context payload templates from `contexts.json`
- derive user-facing intent names from declarations, not hardcoded routing tables
- if no declaration-backed intent and compatible context template can be resolved, do not invoke the tool

## Execution Flow

1. User enters a prompt such as `I want to view chart`
2. Frontend tool matcher resolves `ViewChart` and `template_tile_fdc3_2`
3. Tool renders a confirmation card with the matched intent and payload preview
4. User clicks `Process Intent`
5. Tool opens the tile through the existing workspace helper
6. Tool raises the intent through the browser FDC3 agent, targeting the opened tile instance
7. The card updates to success or failure

## Initial Constraints

- add `ViewChart` and `fdc3.instrument` declaration coverage so the flow is fully declaration-backed
- use a declaration-provided sample instrument payload for the first pass
- do not attempt broad natural-language matching beyond the chart happy path
