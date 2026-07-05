## ADDED Requirements

### Requirement: Platform Provider-delivered intents are supported

The OpenFin bridge SHALL support production OpenFin/Here Core Platform manifests that use `platform.providerUrl` and a Platform Provider HTML page to override `InteropBroker.handleFiredIntent`.

#### Scenario: Platform Provider selects and targets the MFE window

- **WHEN** an external OpenFin view fires an intent
- **AND** the Platform Provider override receives the intent in `handleFiredIntent`
- **AND** the Provider resolves a target from `intent.name` and `intent.context.type`
- **THEN** the Provider creates or selects the MFE window/view
- **AND** calls `setIntentTarget(intent, targetIdentity)`
- **AND** the OpenFin Interop Broker delivers the intent after the MFE target registers its handler

#### Scenario: MFE broker routes provider-delivered intent internally

- **WHEN** OpenFin delivers a Provider-targeted intent into the MFE base window
- **THEN** the MFE broker treats the intent as externally originated
- **AND** routes configured Provider-level launch/update intents by context type
- **AND** opens the matching internal tile when needed
- **AND** delivers the intent after the tile registers its listener

#### Scenario: Context-selected app target is preserved

- **WHEN** a Provider-level intent such as `scb.ViewLaunch` or `scb.ViewUpdate` is routed by context type
- **AND** context lookup resolves exactly one internal app
- **THEN** the broker preserves that app as the target when raising the actual internal intent
- **AND** does not widen the route back into an ambiguous intent-only resolver path

#### Scenario: Provider-originated unresolved intent does not bounce back

- **WHEN** an intent originated from external OpenFin
- **AND** the MFE broker cannot find an internal target
- **THEN** the broker does not raise the same intent back to OpenFin
- **AND** no loop is created between the MFE broker and Platform Provider

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
- **AND** source app identifier is preserved to prevent loop detection issues

#### Scenario: Intent delivery fails gracefully

- **WHEN** an intent is received from OpenFin
- **AND** `raiseIntent()` fails during resolution or app opening
- **THEN** the bridge logs the error
- **AND** does not throw an exception to the OpenFin caller
- **AND** the intent is silently dropped

### Requirement: Pre-login intent queue (USE existing intentQueue)

Intents received before login SHALL be queued using the **existing** `intentQueue` with a special tileId `'__prelogin__'`. No new queue implementation needed.

#### Scenario: Intent queued when user not logged in

- **WHEN** an intent is received from OpenFin
- **AND** the user is not logged in
- **THEN** the intent is queued via `this.intentQueue.enqueue('__prelogin__', intent, context, source)`
- **AND** the intent is NOT delivered immediately

#### Scenario: Intent deduplication in pre-login queue

- **WHEN** multiple intents with the same intent type, context type, and context ID are received
- **AND** the user is not logged in
- **THEN** the intent is deduplicated by `IntentQueueImpl.enqueue()` (same behavior as unmounted tiles)
- **AND** duplicate intents are ignored

#### Scenario: Queued intents filtered by entitlements after login

- **WHEN** the user logs in successfully
- **THEN** queued intents are retrieved via `this.intentQueue.getQueuedIntents('__prelogin__')`
- **AND** each queued intent is validated against current user entitlements
- **AND** only entitled intents are processed

#### Scenario: Queued intents raised internally after login

- **WHEN** the user logs in successfully
- **AND** queued intents have been filtered by entitlements
- **THEN** each valid intent is raised internally via `raiseIntent()`
- **AND** source from OpenFin is preserved in the raised intent
- **AND** the queue is cleared via `this.intentQueue.clearQueue('__prelogin__')`

### Requirement: Configurable global intents

Global intents SHALL be configurable via broker configuration, with sensible defaults.

#### Scenario: Default global intents used when not configured

- **WHEN** broker is initialized without explicit global intents configuration
- **THEN** the default global intents `['ViewChart', 'StartCall', 'ViewContact', 'ViewInstrument']` are used

#### Scenario: Custom global intents from configuration

- **WHEN** broker is initialized with custom global intents in configuration
- **THEN** the specified custom intents are used instead of defaults

#### Scenario: Global intents combined with entitled intents

- **WHEN** bridge initializes intent subscriptions
- **THEN** it subscribes to both configured global intents
- **AND** all unique intents from entitled applications

### Requirement: Session-based intent refresh

The intent list SHALL be refreshed on each session initialization, not cached between sessions.

#### Scenario: Fresh intent list fetched each session

- **WHEN** the broker is initialized
- **AND** OpenFin bridge is enabled
- **THEN** the bridge fetches the current list of entitled apps
- **AND** extracts all intents from entitled applications
- **AND** subscribes to the refreshed intent list

#### Scenario: Intent list not cached across browser refresh

- **WHEN** the user refreshes the page or reinitializes the broker
- **THEN** the bridge re-fetches apps and intents from the app directory
- **AND** does not use cached intent lists from previous sessions

### Requirement: Ambiguous intent resolution shows resolver UI

When multiple apps can handle an intent, the resolver UI SHALL be shown to let the user choose.

#### Scenario: Resolver UI shown for ambiguous intents

- **WHEN** `raiseIntent()` is called with an intent
- **AND** multiple apps can handle that intent
- **THEN** the resolver UI is displayed to the user
- **AND** the user can select which app should handle the intent
- **AND** the selected app receives the intent

#### Scenario: User cancels resolver UI

- **WHEN** the resolver UI is displayed
- **AND** the user cancels the selection
- **THEN** an error is thrown: "User cancelled intent resolution"
- **AND** the intent is NOT delivered to any app
