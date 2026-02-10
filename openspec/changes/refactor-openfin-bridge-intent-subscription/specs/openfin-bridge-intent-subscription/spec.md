## ADDED Requirements

### Requirement: Bridge subscribes to predefined global intents

The `OpenFinBridge` SHALL subscribe to a predefined set of global intents that are always listened for, regardless of installed applications.

#### Scenario: Global intents are subscribed on initialization
- **WHEN** `OpenFinBridge` is instantiated with no `AppDirectoryClient`
- **THEN** the bridge subscribes to global intents defined in `GLOBAL_INTENTS` constant

#### Scenario: Global intents are included even with app directory
- **WHEN** `OpenFinBridge` is instantiated with an `AppDirectoryClient`
- **THEN** the bridge subscribes to all global intents in addition to entitlement-filtered intents

### Requirement: Bridge discovers intents from entitled apps

The `OpenFinBridge` SHALL query the `AppDirectoryClient` for all applications the current user is entitled to access and subscribe to all intents declared in each app's `interop.intents.listensFor` configuration.

#### Scenario: Intents are extracted from app directory
- **WHEN** `initializeIntents()` is called with a valid `AppDirectoryClient`
- **THEN** the bridge calls `client.getAllApps()` to retrieve entitled applications
- **AND** extracts all unique intent names from each app's `interop.intents.listensFor`
- **AND** subscribes to each unique intent via OpenFin's `addIntentListener`

#### Scenario: Duplicate intents are deduplicated
- **WHEN** multiple apps declare the same intent (e.g., `ViewChart`)
- **THEN** the bridge subscribes to that intent only once
- **AND** all incoming intents for that type are routed to the handler

#### Scenario: App directory failure falls back to global intents
- **WHEN** `getAllApps()` fails or returns an error
- **THEN** the bridge logs a warning
- **AND** subscribes only to global intents
- **AND** does not throw an error

### Requirement: Combined intent subscription

The `OpenFinBridge` SHALL combine global intents with entitlement-filtered intents into a unified subscription set.

#### Scenario: All intents are subscribed after initialization
- **WHEN** `initializeIntents()` completes successfully
- **THEN** the bridge has active listeners for global intents
- **AND** the bridge has active listeners for all unique intents from entitled apps

### Requirement: Optional app directory dependency

The `AppDirectoryClient` SHALL be an optional dependency that can be injected via constructor.

#### Scenario: Bridge works without app directory
- **WHEN** `OpenFinBridge` is constructed without an `AppDirectoryClient`
- **THEN** the bridge operates in global-intents-only mode
- **AND** `initializeIntents()` subscribes only to global intents

#### Scenario: Bridge uses provided app directory
- **WHEN** `OpenFinBridge` is constructed with an `AppDirectoryClient`
- **THEN** the bridge stores the client for use in `initializeIntents()`
- **AND** uses the client to fetch entitled apps and their intents

### Requirement: Incoming intents reuse raiseIntent logic

When an intent is received from OpenFin and no internal listener exists, the bridge SHALL call the broker's `raiseIntent()` method to handle resolution, app opening, and delivery.

#### Scenario: Intent delivered to existing internal listener
- **WHEN** an intent is received from OpenFin
- **AND** an internal tile has registered a listener for that intent type
- **THEN** the intent is delivered directly to that listener
- **AND** no app opening or intent resolution is performed

#### Scenario: Intent triggers raiseIntent when no listener exists
- **WHEN** an intent is received from OpenFin
- **AND** no internal tile has registered a listener for that intent type
- **THEN** the bridge calls `raiseIntent()` with the intent, context, and source
- **AND** `raiseIntent()` handles app resolution, opening, and delivery
- **AND** the intent is delivered to the resolved target app

#### Scenario: No infinite loop to OpenFin
- **WHEN** `raiseIntent()` is called from `handleOpenFinIntent`
- **AND** no internal target is found
- **THEN** the intent is NOT routed back to OpenFin
- **AND** the broker only routes to OpenFin on initial user calls

#### Scenario: Intent delivery fails gracefully
- **WHEN** an intent is received from OpenFin
- **AND** `raiseIntent()` fails during resolution or app opening
- **THEN** the bridge logs the error
- **AND** does not throw an exception to the OpenFin caller
- **AND** the intent is silently dropped
