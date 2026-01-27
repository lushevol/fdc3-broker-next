# fdc3-declaration Specification

## Purpose

TBD - created by archiving change manage-fdc3-declarations. Update Purpose after archive.

## Requirements

### Requirement: Manage Component Metadata

Administrators MUST be able to manage the master lists of FDC3 Intents and Contexts to ensure consistency across the platform.

#### Scenario: Manage Intents Master List

Given I am an FDC3 Administrator
When I navigate to the "Intents" tab in the FDC3 Declaration module
Then I see a list of available FDC3 Intents
And I can create a new Intent with a name and display name

#### Scenario: Manage Contexts Master List

Given I am an FDC3 Administrator
When I navigate to the "Contexts" tab in the FDC3 Declaration module
Then I see a list of available FDC3 Context types
And I can create a new Context type with an optional JSON schema

### Requirement: Declare Tile Interop

The system MUST support comprehensive declaration of FDC3 interop capabilities (intents and contexts) for a specific Tile using the managed master lists.

#### Scenario: Declare App Interop

Given I am editing the FDC3 Declaration for a Tile
When I use the Interop Editor
Then I can add "Listens For" capabilities by selecting from the Intent Master List
And I can add "Raises" capabilities by selecting from the Intent Master List
And for each Intent, I can select valid Context types from the Context Master List

#### Scenario: Validate Interop Selection

Given I have selected an Intent in the Interop Editor
When I try to save the declaration without selecting any Contexts (if required)
Then I should receive a validation error or warning (depending on strictness)
