# Spec: Local App Loader

## ADDED Requirements

### Requirement: Initialize with Local Apps

The App Directory client MUST support initialization with a predefined list of application definitions, making them available immediately without network requests.

#### Scenario: Client initializes with local apps

Given a list of local application definitions
When the App Directory client is instantiated with this list
Then the client should be ready immediately
And `getAllApps` should return these local apps

#### Scenario: Retrieve specific local app

Given the client is initialized with a local app "app-local-1"
When `getApp("app-local-1")` is called
Then it should return the app definition for "app-local-1" not null

#### Scenario: Search local apps by intent

Given the client is initialized with a local app "app-local-1" supporting intent "ViewChart"
When `findByIntent("ViewChart")` is called
Then it should include "app-local-1" in the results
