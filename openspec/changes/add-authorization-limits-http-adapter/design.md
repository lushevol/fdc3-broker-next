# Design: Transport-injected Authorization Limits adapter

## Decisions

### Inject request transport, not credentials

The adapter accepts an `AuthorizationLimitsHttpTransport` that returns status and unknown body. A future application bootstrap owns base URL, credentials, cookies/tokens, CSRF, timeout, tracing, and cancellation. This avoids adding authentication to the design system or assuming a host capability before it is versioned.

### Characterized endpoint mapping

- GET `/api/ratan/v1/profileLimitation/`
- POST `/api/ratan/v1/profileLimitation/create`
- PUT `/api/ratan/v1/profileLimitation/edit`
- PUT `/api/ratan/v1/profileLimitation/confirm/{profile}/{currency}/{status}`
- PUT `/api/ratan/v1/profileLimitation/reject/{profile}/{currency}/{status}`
- DELETE `/api/ratan/v1/profileLimitation/{profile}/{currency}`

Dynamic segments are encoded. Edit/transition/remove map `expectedVersion` to body `version`; list uses the unfiltered endpoint because the production port currently exposes `list()` only.

### Validate every success payload

Successful list must be an array of complete supported records. Every mutation must return one complete record. Validation failure becomes `unexpected`, never a success-shaped empty value. This is stricter than the legacy client, which swallowed errors.

### Stable failure mapping

401 is unauthorized, 403 forbidden, 400/422 validation, 409 conflict, 5xx unavailable/retryable, other non-success unexpected. A thrown transport error becomes unavailable/retryable unless it is already an `AuthorizationLimitsMutationError`.

## Non-goals

- Implementing fetch/axios or storing credentials.
- Confirming backend payload fixtures; contract tests use captured/approved fixtures later.
- Runtime activation or host identity changes.
- Generalizing transport into a cross-domain SDK before a second proven consumer.

## Activation gate

The adapter may be instantiated only after endpoint request/response fixtures, authentication/CSRF behavior, timeouts, telemetry, and environment base URLs are approved and browser-tested.
