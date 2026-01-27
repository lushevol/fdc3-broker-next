# postmessage-bridge Specification

## Purpose

TBD - created by archiving change add-postmessage-bridge. Update Purpose after archive.

## Requirements

### Requirement: PostMessage Bridge Availability

The system SHALL provide a `PostMessageBridge` class that enables FDC3 communication with external domains via the browser's `postMessage` API.

#### Scenario: Bridge enabled in browser environment

- **WHEN** the broker is configured with `enablePostMessageBridge: true`
- **AND** the runtime environment is a standard browser (not OpenFin)
- **THEN** the PostMessage bridge SHALL be available for cross-domain communication

#### Scenario: Bridge disabled by default

- **WHEN** the broker is initialized without explicit `enablePostMessageBridge` configuration
- **THEN** the PostMessage bridge SHALL NOT be initialized

---

### Requirement: Cross-Domain Intent Raising

The system SHALL support raising intents to external applications via PostMessage.

#### Scenario: Raise intent to external target

- **WHEN** a tile calls `raiseIntent()` with a target app in an allowed external origin
- **THEN** the PostMessage bridge SHALL send an `fdc3-pm-request` message to the target origin
- **AND** the bridge SHALL wait for an `fdc3-pm-response` with matching correlation ID
- **AND** the bridge SHALL return an `IntentResolution` on success

#### Scenario: Timeout on no response

- **WHEN** an intent is raised but no response is received within the configured timeout
- **THEN** the bridge SHALL reject with a timeout error

---

### Requirement: Cross-Domain Intent Subscription

The system SHALL support receiving intents from external applications via PostMessage.

#### Scenario: Subscribe to external intents

- **WHEN** the broker subscribes to intents using `subscribeToIntents()`
- **THEN** the bridge SHALL listen for `fdc3-pm-event` messages with type `intentEvent`
- **AND** the bridge SHALL invoke the registered handler with the intent and context

#### Scenario: Ignore messages from disallowed origins

- **WHEN** an `fdc3-pm-event` message is received from an origin not in the allowlist
- **THEN** the bridge SHALL ignore the message silently

---

### Requirement: External App Open Request

The system SHALL support requesting external applications to open via PostMessage.

#### Scenario: Request app open

- **WHEN** broker calls `open()` for an app that is hosted on an external allowed origin
- **THEN** the bridge SHALL send an `fdc3-pm-request` with method `open`
- **AND** the bridge SHALL return the `AppIdentifier` from the response

---

### Requirement: Intent Discovery via PostMessage

The system SHALL support querying external origins for intent handlers.

#### Scenario: Find intent handlers externally

- **WHEN** `findIntent()` is called and the broker is configured for PostMessage bridge
- **THEN** the bridge SHALL query allowed origins for apps that handle the intent
- **AND** the bridge SHALL merge results into the overall `AppIntent` response

---

### Requirement: Origin Security

The system SHALL validate message origins against an explicit allowlist.

#### Scenario: Reject messages from untrusted origins

- **WHEN** a PostMessage is received from an origin not in `allowedOrigins`
- **THEN** the bridge SHALL drop the message without processing

#### Scenario: Require allowedOrigins configuration

- **WHEN** the PostMessage bridge is enabled but `allowedOrigins` is empty or undefined
- **THEN** the bridge SHALL log a warning and reject all incoming/outgoing cross-origin messages

---

### Requirement: Channel Methods Placeholder

The system SHALL provide placeholder implementations for channel-related methods.

#### Scenario: Channel methods return no-op

- **WHEN** channel methods (`joinUserChannel`, `broadcast`, `getCurrentChannel`) are called on the PostMessage bridge
- **THEN** the bridge SHALL log a warning indicating channels are not yet supported
- **AND** the bridge SHALL return appropriate no-op values (void, empty array, null)
