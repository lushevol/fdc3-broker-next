# Use Local FDC3 Declarations

## Summary

Use local JSON files for FDC3 intents, contexts, and app declarations in the `FDC3Declaration` admin module instead of querying the API. This is the Day 1 scope to enable administrative views without backend dependency.

## Motivation

To decouple front-end development from backend availability and allow rapid prototyping and verification of FDC3 declarations.

## Detailed Design

- Modify `useServices.ts` to import `intents.json`, `contexts.json`, and `fdc3-definitions.json`.
- `getIntentList` returns data from `intents.json`.
- `getContextList` returns data from `contexts.json`.
- `getDeclaration` returns data from `fdc3-definitions.json` (filtered by appId if needed, or just list all).
- Mutation methods (`create`, `update`, `delete`) will be disabled or return mock success/failure for Day 1.

## Alternatives Considered

- Mocking API responses using MSW (Mock Service Worker). Rejected for simplicity and direct file control requested by user.
