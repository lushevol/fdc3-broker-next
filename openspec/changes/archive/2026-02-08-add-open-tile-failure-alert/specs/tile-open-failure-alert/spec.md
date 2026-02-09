## ADDED Requirements

### Requirement: Tile open failure callback

The FDC3 broker SHALL provide an optional `onTileOpenFailure` callback in the `BrokerCallbacks` interface that SHALL be invoked when a tile fails to open via the `open` API.

#### Scenario: Callback invoked on login failure

- **WHEN** the `open` API is called and the user is not logged in
- **THEN** the broker SHALL invoke `onTileOpenFailure` with failure details containing `reason: "User not logged in"`
- **THEN** the broker SHALL throw an `Error` with message "User not logged in"

#### Scenario: Callback invoked on entitlement denial

- **WHEN** the `open` API is called and the user lacks entitlements to open the tile
- **THEN** the broker SHALL invoke `onTileOpenFailure` with failure details containing the entitlement reason
- **THEN** the broker SHALL throw an `Error` with the entitlement denial message

#### Scenario: Callback invoked when onTileOpen callback throws

- **WHEN** the `open` API is called, entitlements pass, but the `onTileOpen` callback throws an error
- **THEN** the broker SHALL invoke `onTileOpenFailure` with the error details from the thrown exception
- **THEN** the broker SHALL throw the original error after invoking the callback

#### Scenario: No callback configured

- **WHEN** the `open` API is called and a tile fails to open but `onTileOpenFailure` is not configured
- **THEN** the broker SHALL proceed normally without invoking the callback
- **THEN** the broker SHALL still throw the error as expected
- **THEN** the broker SHALL log the failure at WARN level

### Requirement: TileOpenFailureDetails structure

The `onTileOpenFailure` callback SHALL receive a `TileOpenFailureDetails` object containing:

#### Scenario: Failure details include app identifier

- **WHEN** `onTileOpenFailure` is invoked for a failed tile open
- **THEN** the failure details SHALL include `appId` string identifying the failed application

#### Scenario: Failure details include reason

- **WHEN** `onTileOpenFailure` is invoked for a failed tile open
- **THEN** the failure details SHALL include `reason` string describing the failure

#### Scenario: Failure details include error code when available

- **WHEN** a tile open fails due to a known error condition with an error code
- **THEN** the failure details SHALL include `errorCode` string for programmatic handling
- **WHEN** the failure reason is a generic error without a specific code
- **THEN** the `errorCode` field MAY be omitted

### Requirement: Callback error handling

The broker SHALL handle errors in the `onTileOpenFailure` callback gracefully:

#### Scenario: Callback throws

- **WHEN** `onTileOpenFailure` callback throws an error during invocation
- **THEN** the broker SHALL catch the callback error
- **THEN** the broker SHALL log the callback error at ERROR level
- **THEN** the broker SHALL proceed with the original open failure handling (still throw original error)
