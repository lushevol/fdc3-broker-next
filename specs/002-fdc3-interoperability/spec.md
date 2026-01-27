# Feature Specification: FDC3 Interoperability for MFE Platform

**Feature Branch**: `002-fdc3-interoperability`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "Introduce powerful interoperability to the mfe project, follow FDC3 standard. There should be a FDC3 broker in base layer, act as central broker api of whole domain, handle entitlement validation, security control, proper resolver UI and etc. For tiles who want to enable the capability, it should call standard fdc3 api in it runtime, then the request (intent or channel) will go to broker, broker check and open target tiles with defer context transferring (or join/create a channel in private or public). A resolve ui will pop up if broker need selection from users, e.g. if there are already 2 tiles with same id opened and intent not set instance target. The FDC3 broker should implement all APIs in FDC3 v2.2 with full observability. There are 2 kinds of interoperation cases, one is internally, which only involve applications in mfe website (There is no iframe in my case, all tiles are loading and rendering on one domain and different react components), another one is externally, which internal tiles can communicate with other desktop sources in OpenFin platform. For example, if website is opened in browser, then only internal cases; if website is opened via OpenFin, then internal cases still working, and other windows can send intents to mfe web ui though openfin platform provider (ignore it's details). Internal tile can also send intent to outside apps."

## Assumptions

- The MFE platform runs all tiles as React components within a single domain (no iframes)
- OpenFin integration exists and provides a bridge for external communication when running in OpenFin context
- When running in a browser, only internal MFE-to-MFE communication is available
- Tiles have unique identifiers (appIds) that can be used for targeting
- FDC3 v2.2 specification defines the complete API surface to implement
- A user session/identity exists for entitlement validation
- Context data follows FDC3 context type standards (Instrument, Contact, Portfolio, etc.)

## Clarifications

### Session 2025-12-26

- Q: When should intents be routed to target tiles that are not yet ready (still loading/rendering)? → A: Queue intents in the broker until the target tile is fully mounted and has registered intent listeners, then deliver automatically
- Q: How should the broker handle intents received when the user is not logged in (unauthenticated)? → A: Queue intents persistently (localStorage/sessionStorage) and execute them automatically after successful login, respecting order of arrival
- Q: What is the architectural nature of the App Directory? → A: A centralized registry service with a static API that the broker queries to discover available tiles based on user entitlements
- Q: Should intent and channel messaging support return values from handlers? → A: Yes, follow the FDC3 v2.2 API specifications for Promise-based resolution with return values
- Q: How do tiles declare their intent handling capabilities to the system? → A: Static configuration only (in tile manifest/config file), registered in App Directory at build/deploy time

## User Scenarios & Testing

### User Story 1 - Internal Intent Resolution (Priority: P1)

**Description**: A user working in one tile (e.g., Order Management) sends an intent to view details for a specific instrument (e.g., "ViewChart"). The FDC3 broker receives this request, identifies that two Chart tiles are already open, and presents a resolver UI asking the user which tile should handle the intent. Upon selection, the broker transfers the instrument context to the chosen tile, which updates its display.

**Why this priority**: This is the core value proposition - enabling tiles to communicate and share context within the MFE platform. It demonstrates the primary use case for FDC3 interoperability.

**Independent Test**: Can be fully tested by opening two instances of a tile, sending an intent from a source tile, verifying the resolver UI appears, selecting a target, and confirming the context is received and displayed correctly. No external dependencies required.

**Acceptance Scenarios**:

1. **Given** a user has Tile A (Order Management) and two instances of Tile B (Chart) open, **When** the user triggers "ViewChart" intent with instrument context from Tile A, **Then** a resolver UI appears displaying both Chart tile instances with their current context, allowing the user to select which one should handle the intent.

2. **Given** a user has Tile A and Tile B open, **When** the user sends an intent to Tile B with specific context data, **And** the user selects Tile B from the resolver, **Then** Tile B receives the context data and updates its display to show the requested information.

3. **Given** a user has Tile A open but no Chart tiles, **When** the user sends a "ViewChart" intent, **Then** the broker launches a new Chart tile instance with the provided context.

4. **Given** a user sends an intent to a specific tile instance (target specified), **When** the intent is received, **Then** the resolver UI does NOT appear and the intent goes directly to the specified target tile.

5. **Given** a user sends an intent to an tile that does not exist, **When** the broker fails to find the target, **Then** the resolver UI displays an alert message stating the tile is unavailable.

---

### User Story 2 - Channel Context Sharing (Priority: P1)

**Description**: Multiple tiles (e.g., Watchlist, Chart, Order Blotter) join a "red" channel. When a user selects an instrument in the Watchlist tile, all other tiles on the same channel automatically receive and display context for that instrument. The user can leave the channel or switch to a different channel ("green", "blue", etc.) to control which tiles receive context updates.

**Why this priority**: Context broadcasting via channels is a fundamental FDC3 capability that enables "link and sync" workflows common in financial desktop applications. This is equally important as intent resolution for the target domain.

**Independent Test**: Can be fully tested by opening multiple tiles, having them join a channel, changing context in one tile, and verifying all other tiles on the channel receive the context update. Tiles not on the channel should NOT receive updates.

**Acceptance Scenarios**:

1. **Given** three tiles (Watchlist, Chart, Order Blotter) have joined the "red" channel, **When** the user selects an instrument in the Watchlist, **Then** both the Chart and Order Blotter tiles receive and display the instrument context.

2. **Given** Tile A is on the "red" channel and Tile B is on the "green" channel, **When** context changes in Tile A, **Then** Tile B does NOT receive the context update.

3. **Given** a tile is currently on the "red" channel, **When** the user switches to the "green" channel, **Then** the tile leaves the red channel and begins receiving context from the green channel.

4. **Given** a user creates a private channel, **When** tiles join this private channel, **Then** only tiles explicitly added to this channel can participate (unlike public channels that any tile can join).

---

### User Story 3 - Cross-Platform Interoperability (Priority: P2)

**Description**: When the MFE application runs within OpenFin, tiles can send intents to and receive intents from external OpenFin applications (e.g., a standalone trading application). For example, a Chart tile sends a "ViewOrder" intent that is handled by an external OpenFin window running a separate Order Management application.

**Why this priority**: This extends the interoperability beyond the MFE platform to the broader desktop environment, enabling workflows that span multiple applications. It's lower priority than internal communication but adds significant value for OpenFin users.

**Independent Test**: Can be tested by running the MFE platform in OpenFin alongside an external OpenFin application, sending intents from MFE tiles to the external app, and verifying the external app receives and handles the intent correctly.

**Acceptance Scenarios**:

1. **Given** the MFE platform is running in OpenFin with an external Order Management app also running, **When** a Chart tile sends a "ViewOrder" intent with instrument context, **Then** the external Order Management app receives the intent and displays the order details.

2. **Given** the MFE platform is running in a standard browser (not OpenFin), **When** a tile sends an intent intended for an external application, **Then** the broker routes the intent only to internal MFE tiles and logs that external routing is unavailable.

3. **Given** the MFE platform is running in OpenFin, **When** an external application sends an intent to an MFE tile, **Then** the FDC3 broker receives the intent and routes it to the appropriate target tile within the MFE platform.

4. **Given** the MFE platform is running in OpenFin, **When** a tile joins a channel, **Then** external OpenFin applications on the same channel can share context with the MFE tile.

---

### User Story 4 - Security and Entitlement Validation (Priority: P2)

**Description**: Before routing an intent or channel operation, the FDC3 broker validates that the requesting tile has permission to perform the action. For example, a tile might be restricted from sending certain intent types or from communicating with specific target applications. Unauthorized operations are logged and denied with appropriate error messaging.

**Why this priority**: Security is critical for production systems but doesn't block initial functionality. This can be implemented after the core intent/channel flows work.

**Independent Test**: Can be tested by configuring entitlement rules for specific tiles, attempting operations that violate those rules, and verifying the operations are denied with appropriate logging and error messages.

**Acceptance Scenarios**:

1. **Given** Tile A is configured to only send "ViewChart" intents, **When** Tile A attempts to send a "PlaceOrder" intent, **Then** the broker denies the request, logs the security violation, and returns an error to Tile A.

2. **Given** Tile B is configured to only receive intents from specific tile types, **When** another tile sends an intent to Tile B, **Then** the broker validates the sender's entitlement and either allows or denies the intent based on the configuration.

3. **Given** a tile attempts to join a restricted channel, **When** the tile has insufficient permissions, **Then** the channel join fails and the tile receives an error explaining the restriction.

---

### User Story 5 - Observability and Diagnostics (Priority: P3)

**Description**: Developers and operators can monitor all FDC3 operations (intents, channel joins/leaves, context broadcasts) through structured logging and runtime diagnostics. A debug mode provides detailed traces of broker operations, helping troubleshoot interoperability issues.

**Why this priority**: Observability is important for production operations but doesn't block initial feature delivery. Can be added incrementally.

**Independent Test**: Can be tested by enabling debug mode, performing various FDC3 operations, and verifying that detailed logs are produced for each operation with appropriate context (timestamp, source tile, target tile, intent type, context data).

**Acceptance Scenarios**:

1. **Given** debug mode is enabled, **When** an intent is sent, **Then** a detailed log entry is created showing intent type, context data, source tile, target resolution process, and delivery result.

2. **Given** a channel operation occurs (join, leave, broadcast), **When** the operation completes, **Then** a structured log entry is created with channel ID, participating tiles, and context data.

3. **Given** an error occurs during intent resolution (e.g., no target available), **When** the error happens, **Then** the error is logged with full context for debugging purposes.

---

### User Story 6 - App Directory and Entitlement-Based Discovery (Priority: P1)

**Description**: The App Directory serves as the central registry for all tiles that can participate in FDC3 interoperability. Each tile registers its capabilities (appId, supported intents, context types, descriptions, and entitlement constraints). The FDC3 broker queries the App Directory's static API at runtime to discover which tiles are available to the current user based on their entitlements. For example, when resolving an intent, the broker queries the App Directory to find tiles that can handle that intent type, filtered by the user's entitlements.

**Why this priority**: The App Directory is foundational for entitlement-driven tile visibility and intent resolution. Without it, the broker cannot determine which tiles a user is allowed to use. This must be implemented alongside or before the broker's core resolution logic.

**Independent Test**: Can be tested by configuring multiple tiles with different entitlement rules, querying the App Directory API as different user personas, and verifying that only entitled tiles are returned. The broker can then be tested by sending intents and confirming they only resolve to entitled tiles.

**Acceptance Scenarios**:

1. **Given** the App Directory has registered Tile A (Chart app) and Tile B (Order Blotter), **When** the broker queries for tiles that handle "ViewChart" intent, **Then** only Tile A is returned in the results if the user has entitlement to Tile A.

2. **Given** a user has entitlement to only a subset of tiles, **When** the broker queries the App Directory for available apps, **Then** the response includes only the tiles the user is entitled to access, with each tile's metadata (appId, name, description, supported intents, context types).

3. **Given** Tile A declares it handles "ViewChart" and "ViewAnalysis" intents with "Instrument" context type, **When** the broker queries for "ViewChart" handlers, **Then** Tile A appears in the results with its declared intent and context type information.

4. **Given** Tile B is configured with entitlement restrictions (e.g., only available to users in "Premium" group), **When** a standard user queries the App Directory, **Then** Tile B is excluded from the results, but a Premium user sees Tile B in their available apps list.

5. **Given** the App Directory service is temporarily unavailable, **When** the broker attempts to query for available tiles, **Then** the broker falls back to a cached registry or returns a graceful error, logging the service unavailability.

---

### Edge Cases

- **What happens when** multiple intent handlers are available but none are currently visible/active in the UI?
- **How does the system handle** malformed context data that doesn't match expected FDC3 context types?
- **What happens when** a tile crashes after receiving an intent but before processing it?
- **What happens when** a user switches away from the MFE tab/window while an intent is being processed?
- **How does the system handle** rapid successive intent sends that might overwhelm the target?
- **What happens when** channel context updates faster than tiles can process them?
- **How does the system handle** tiles that join a channel but don't implement context listeners?
- **What happens when** OpenFin bridge becomes unavailable after initial connection?
- **How does the system handle** entitlement validation when the user's permissions change during a session?
- **What happens when** intents arrive while the user is not authenticated (logged out)?
- **How does the system handle** SSO domain transitions while intents are queued for unauthenticated users?
- **What happens when** the App Directory service is unavailable when the broker needs to resolve an intent?
- **How does the system handle** tiles declared in the App Directory but not currently mounted?
- **What happens when** a user's entitlements change during an active session, affecting which tiles they can access?
- **How does the system handle** intents targeting tiles that the user is not entitled to access?
- **What happens when** an intent handler returns a value but the sending tile has already timed out or is no longer waiting for the result?
- **What happens when** an intent handler rejects or throws an error instead of returning a value?
- **How does the system handle** return values from intents that cross the OpenFin bridge (external apps)?
- **What happens when** a tile attempts to call `fdc3.addIntentListener()` for an intent type not declared in its static manifest?
- **How does the system handle** mismatches between a tile's static manifest and its actual runtime behavior (e.g., manifest declares it handles "ViewChart" but it never calls `addIntentListener()` for that intent)?

## Requirements

### Functional Requirements

#### FDC3 Broker Core

- **FR-001**: The system MUST provide a central FDC3 broker in the base layer that acts as the single point of coordination for all interoperation within the MFE domain.
- **FR-002**: The broker MUST implement all APIs defined in the FDC3 v2.2 specification including intents, channels, context metadata, and app directory.
- **FR-003**: The broker MUST detect the runtime environment (browser vs. OpenFin) and enable or disable external interoperability features accordingly.
- **FR-004**: The broker MUST maintain a runtime registry of all active tiles including their appIds, instance IDs, current state, and supported intent types.
- **FR-005**: The broker MUST query the App Directory service to discover available tiles and their capabilities at runtime, filtering results based on the current user's entitlements.

#### Intent Resolution

- **FR-006**: When a tile sends an intent via `fdc3.raiseIntent()`, the broker MUST resolve the target tile(s) capable of handling that intent type by querying the App Directory for tiles that declare support for that intent, filtered by user entitlements.
- **FR-007**: If exactly one target tile exists for an intent (and the user is entitled to it), the broker MUST route the intent directly to that target.
- **FR-008**: If multiple target tiles exist for an intent and no instance target is specified, the broker MUST present a resolver UI allowing the user to choose from entitled targets only.
- **FR-009**: If a specific target instance is specified in the intent, the broker MUST route directly to that instance without showing the resolver UI (after validating entitlement).
- **FR-010**: If no target tile instance exists for an intent, the broker MUST launch a new instance of a tile capable of handling the intent (if available and the user is entitled).
- **FR-011**: The broker MUST transfer context data (of type FDC3 Context) from the source tile to the target tile as part of intent delivery.
- **FR-012**: Intent handlers MUST be able to return values to the sender via Promise resolution, following the FDC3 v2.2 specification for `raiseIntent()` and `raiseIntentForContext()`.
- **FR-013**: The broker MUST support the `IntentResult` structure defined in FDC3 v2.2, which includes the returned data from intent handlers.

#### Channel Operations

- **FR-014**: Tiles MUST be able to join public channels ("red", "green", "blue", etc.) via `fdc3.joinChannel()`.
- **FR-015**: Tiles MUST be able to join private channels (user-created) via the same API.
- **FR-016**: When a tile joins a channel, it MUST receive the current context for that channel.
- **FR-017**: When any tile on a channel broadcasts context via `fdc3.broadcast()`, all other tiles on that channel MUST receive the context.
- **FR-018**: Tiles MUST be able to leave channels via `fdc3.leaveCurrentChannel()`.
- **FR-019**: A tile can only be on one channel at a time; joining a new channel MUST automatically leave the previous channel.
- **FR-020**: The broker MUST track which tiles are on which channels for context routing.

#### Resolver UI

- **FR-021**: When intent resolution requires user selection, the broker MUST display a resolver UI showing available target tiles (from the App Directory that the user is entitled to use).
- **FR-022**: The resolver UI MUST display each tile's name, current context (if any), and a visual preview (if available).
- **FR-023**: The resolver UI MUST allow the user to cancel intent resolution (no target selected).
- **FR-024**: The resolver UI MUST support keyboard navigation and accessibility standards.

#### Security and Entitlements

- **FR-025**: The broker MUST validate entitlements before allowing intent sends.
- **FR-026**: The broker MUST validate entitlements before allowing intent receives by checking if the target tile is entitled to receive intents from the source tile or if the user is entitled to use the target tile.
- **FR-027**: The broker MUST validate entitlements before allowing channel joins by checking if the tile is entitled to join the specified channel.
- **FR-028**: The broker MUST validate that tiles exist in the user's entitled scope before presenting them in resolver UIs or routing intents to them.
- **FR-029**: Unauthorized operations MUST be logged with security event details including the tile, user, operation, and entitlement rule that was violated.
- **FR-030**: Unauthorized operations MUST return appropriate error messages to the requesting tile without exposing sensitive system details.

#### OpenFin Integration

- **FR-031**: When running in OpenFin, the broker MUST bridge internal MFE intents to external OpenFin applications.
- **FR-032**: When running in OpenFin, the broker MUST receive intents from external OpenFin applications and route them to internal MFE tiles.
- **FR-033**: Channel operations MUST synchronize with OpenFin channels when running in OpenFin environment.
- **FR-034**: When running in a standard browser, external interoperability features MUST be disabled gracefully.

#### Observability

- **FR-035**: All FDC3 operations MUST be logged with structured data including timestamp, operation type, source, target, and outcome.
- **FR-036**: The broker MUST provide a debug mode (`FEDERATION_DEBUG=true` or equivalent) that enables verbose logging.
- **FR-037**: Intent resolution decisions MUST be logged with the reasoning for target selection, including App Directory queries and entitlement filtering.
- **FR-038**: Channel operations MUST be logged with full participant information.
- **FR-039**: Security violations MUST be logged as error-level events with full audit trail.

#### Context Handling

- **FR-040**: The broker MUST support all FDC3 v2.2 standard context types (Instrument, Contact, Portfolio, Organization, etc.).
- **FR-041**: Context data MUST be validated to ensure it matches the declared FDC3 context type structure.
- **FR-042**: The broker MUST handle null/undefined context gracefully.
- **FR-043**: Context listeners registered via `fdc3.addContextListener()` MUST receive only context matching their specified type filter.

#### Tile Lifecycle

- **FR-044**: When a tile mounts/unmounts, the broker MUST update its active tile registry.
- **FR-045**: If a target tile is unavailable (not mounted) when an intent is sent, the broker MUST queue the intent and deliver it automatically once the tile is fully mounted and has registered its intent listeners via `fdc3.addIntentListener()`.
- **FR-046**: If a tile on a channel unmounts, it MUST be automatically removed from channel membership.

#### Authentication and Intent Persistence

- **FR-047**: When the user is not authenticated (not logged in), the broker MUST queue incoming intents in persistent storage (localStorage/sessionStorage).
- **FR-048**: After successful authentication, the broker MUST automatically execute queued intents in the order they were received.
- **FR-049**: Persistent intent queues MUST survive page refreshes and SSO domain transitions.
- **FR-050**: The broker MUST provide an API for tiles to check if intents are queued pending authentication.

#### Error Handling

- **FR-051**: All FDC3 API errors MUST return appropriate FDC3-standard error objects with `code` and `message` properties.
- **FR-052**: Intent delivery failures MUST be reported back to the sending tile, including cases where intent handlers reject the returned Promise.
- **FR-053**: Channel operation failures MUST be reported back to the requesting tile.
- **FR-054**: The broker MUST never throw uncaught exceptions that crash the MFE application.

#### App Directory Integration

- **FR-055**: The App Directory MUST provide a static API endpoint that the broker queries to discover available tiles.
- **FR-056**: The App Directory API MUST accept user entitlement context and return only tiles that the user is entitled to access.
- **FR-057**: The App Directory MUST store for each tile: appId, name, description, supported intents (declared intents to handle/receive), supported context types, and entitlement constraints.
- **FR-058**: The broker MUST cache App Directory query results to minimize API calls while respecting cache invalidation when entitlements change.
- **FR-059**: The App Directory MUST support querying by intent type to find tiles capable of handling specific intents.
- **FR-060**: The broker MUST fall back gracefully if the App Directory service is unavailable, using cached data or returning appropriate errors.
- **FR-061**: Tiles MUST declare their intent and context type capabilities via a static manifest/configuration file (e.g., `fdc3-manifest.json` or equivalent) that is registered in the App Directory at build/deploy time. These declarations cannot be modified at runtime and serve as the authoritative source for entitlement validation and intent resolution.
- **FR-062**: When a tile mounts and calls `fdc3.addIntentListener()`, the broker MUST validate that the intent type matches one of the tile's statically declared intents in the App Directory; if not, the listener registration MUST fail with an `Error` indicating the intent was not declared in the tile's manifest.

### Key Entities

- **Intent**: A representation of an action to be performed, consisting of an intent type (e.g., "ViewChart"), optional context data, and optional target specification. Intent types are standardized strings defined in the FDC3 intents schema. Per FDC3 v2.2, intents can return values to the sender via Promise-based `IntentResult` resolution.

- **Context**: Typed data structure that represents information to be shared between tiles. Standard FDC3 context types include Instrument (financial instrument with ID, price, etc.), Contact (person or organization), Portfolio (collection of instruments), and Organization (company/entity). Custom context types can also be defined.

- **Channel**: A named communication channel that tiles can join for context broadcasting. Public channels have standard names (red, green, blue, etc.) and are discoverable. Private channels have system-generated IDs and are only known to tiles that have explicitly joined them.

- **Tile**: A micro-frontend application (React component) that can participate in FDC3 operations. Each tile has a unique appId, an instanceId (for distinguishing multiple instances), and a static manifest/configuration file that declares its supported intents (declared intents to handle/receive) and context types. This manifest is registered in the App Directory at build/deploy time and cannot be modified at runtime.

- **App Directory**: A centralized registry service that stores metadata about all available tiles, including their appId, name, description, supported intents, context types, and entitlement constraints. It provides a static API that the FDC3 broker queries at runtime to discover tiles available to the current user based on their entitlements. The App Directory is the authoritative source for determining which tiles can handle which intents and which users are entitled to use them.

- **Entitlement**: A permission rule that specifies which operations a tile can perform or which tiles a user can access. Entitlements can restrict intent sends (which intent types), intent receives (which sources), channel access (which channels), and tile visibility (which users can see/use specific tiles).

- **Resolver UI**: A user interface component presented by the broker when intent resolution requires user choice. Shows available target tiles and allows selection.

- **Target Resolution**: The process of determining which tile(s) should receive an intent. Considers intent type, context type, available tiles from the App Directory (filtered by user entitlements), current instances, and user preferences.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Tiles can successfully send and receive intents with correct context delivery in under 100ms (p95) for internal communication.

- **SC-002**: Resolver UI appears within 200ms when intent resolution requires user selection.

- **SC-003**: Channel context broadcasts reach all subscribed tiles within 100ms (p95).

- **SC-004**: 100% of FDC3 v2.2 APIs are implemented and pass the FDC3 conformance test suite.

- **SC-005**: Intent resolution succeeds on the first attempt in 95% of cases (excluding user cancellations).

- **SC-006**: Security and entitlement validation adds less than 10ms overhead to FDC3 operations.

- **SC-007**: Zero uncaught exceptions from the FDC3 broker during normal operation (validated via automated testing).

- **SC-008**: Developers can troubleshoot interoperability issues using debug logs without requiring code instrumentation.

- **SC-009**: The system correctly handles environment detection (browser vs. OpenFin) in 100% of test cases.

- **SC-010**: Cross-platform interoperability (OpenFin bridge) successfully routes intents between MFE tiles and external applications with 99% reliability.

## Non-Functional Requirements

### Performance

- Intent resolution and delivery must complete within 100ms for 95th percentile
- Channel context broadcasts must reach all subscribers within 100ms for 95th percentile
- Resolver UI rendering must complete within 200ms
- Broker operations must not block the main thread for more than 16ms (one frame at 60fps)

### Security

- All entitlement validations must occur before intent routing
- Security events must be logged with full audit trail
- Error messages must not expose sensitive system information
- Context data must be validated to prevent injection attacks

### Reliability

- Broker must handle tile crashes without affecting other tiles
- Queued intents must be delivered when target tiles become available
- System must gracefully handle OpenFin bridge unavailability

### Compatibility

- Must support FDC3 v2.2 specification completely
- Must work in both browser and OpenFin runtime environments
- Must be backward compatible with tiles that don't use FDC3 (no impact on non-participating tiles)

## Out of Scope

- Implementation of specific tile applications (this is a platform capability, not individual tiles)
- OpenFin application development (only the bridge integration is in scope)
- FDC3 versions beyond 2.2 (future versions may be added later)
- Custom context type definitions beyond FDC3 standard types (though extensibility should be considered)
- Visual customization of the resolver UI beyond functional requirements
- Advanced features like intent chaining or complex workflows
- Persistence of channel memberships across sessions
