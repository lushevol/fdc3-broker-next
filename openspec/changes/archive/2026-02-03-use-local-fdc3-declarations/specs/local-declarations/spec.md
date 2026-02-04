# Local FDC3 Declarations

## ADDED Requirements

### Requirement: Fetch Intents locally

The system MUST retrieve intent definitions from a local JSON file to ensure availability without backend dependency.

#### Scenario: Fetch Intents

GIVEN the `useServices` hook is used
WHEN `getIntentList` is called
THEN it returns the list of intents defined in `apps/base/src/fdc3/declarations/intents.json`
AND does not make a network request

### Requirement: Fetch Contexts locally

The system MUST retrieve context definitions from a local JSON file.

#### Scenario: Fetch Contexts

GIVEN the `useServices` hook is used
WHEN `getContextList` is called
THEN it returns the list of contexts defined in `apps/base/src/fdc3/declarations/contexts.json`
AND does not make a network request

### Requirement: Fetch App Declarations locally

The system MUST retrieve app declarations from a local JSON file.

#### Scenario: Fetch App Declarations

GIVEN the `useServices` hook is used
WHEN `getDeclaration` is called
THEN it returns the list of app declarations defined in `apps/base/src/fdc3/declarations/fdc3-definitions.json`
AND does not make a network request
