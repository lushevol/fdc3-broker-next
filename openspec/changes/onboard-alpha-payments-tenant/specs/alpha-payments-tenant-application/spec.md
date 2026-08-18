## ADDED Requirements

### Requirement: Tenant API reports health and payment cases

The Alpha Payments service SHALL expose `GET /healthz` and `GET /api/alpha-payments/v1/cases` as JSON HTTP contracts, identify itself and tenant in health metadata, and return a deterministic collection of payment investigation cases with identifiers, direction, currency, amount, counterparty, priority, age, and status.

#### Scenario: Tenant service is healthy

- **WHEN** a client requests `GET /healthz`
- **THEN** the service returns HTTP 200 with `status`, `service`, and `tenantId` metadata for Alpha Payments

#### Scenario: User opens the investigation queue

- **WHEN** a client requests `GET /api/alpha-payments/v1/cases`
- **THEN** the service returns HTTP 200 with the tenant ID, total count, and payment cases required by the queue

### Requirement: Eligible payment cases can be acknowledged

The Alpha Payments service SHALL accept `PATCH /api/alpha-payments/v1/cases/:id/acknowledge`, require a valid actor in the JSON body, transition an eligible case to `ACKNOWLEDGED`, retain the actor and acknowledgement time, and return explicit errors for invalid input or unknown cases.

#### Scenario: User acknowledges an open case

- **WHEN** a client acknowledges an existing eligible case with a valid actor
- **THEN** the service returns HTTP 200 and the updated case is `ACKNOWLEDGED` with acknowledgement metadata

#### Scenario: Client supplies invalid acknowledgement input

- **WHEN** the actor is missing, malformed, or the case identifier is unknown
- **THEN** the service returns a 4xx JSON error without mutating any case

### Requirement: Tenant API is observable at its public boundary

The Alpha Payments service SHALL validate supported methods and paths, return JSON errors with correlation identifiers, propagate a valid inbound correlation identifier or generate one, and emit structured request completion logs containing the tenant ID, correlation ID, method, path, status, and duration without protected payment payloads.

#### Scenario: Unsupported API request is made

- **WHEN** a client requests an unsupported tenant API method or path
- **THEN** the service returns an explicit JSON error with the correlation ID and records a structured completion event

### Requirement: Tenant remote renders an operational investigation queue

The Alpha Payments remote SHALL fetch cases through `/api/alpha-payments/`, present loading, error, empty, and populated states, show summary counts, support text and status filters, and allow an eligible case to be acknowledged without a full-page reload.

#### Scenario: Cases load successfully

- **WHEN** the remote receives the tenant case collection
- **THEN** it renders the Payment Investigation heading, summary counts, filters, and a semantic table containing the cases

#### Scenario: User filters investigations

- **WHEN** the user supplies search text or selects a status
- **THEN** the queue shows only cases matching both active filters and updates the visible result count

#### Scenario: User acknowledges an eligible investigation

- **WHEN** the user invokes Acknowledge on an eligible case and the API succeeds
- **THEN** the row status and summary counts update to reflect the acknowledged case and the command becomes unavailable for that row

#### Scenario: Tenant API cannot be reached

- **WHEN** the initial case request fails
- **THEN** the remote renders a clear alert and a Retry command

### Requirement: Portal composes the tenant through its generated contract

The SCB Next development portal SHALL register the Alpha Payments federation remote, map `@fm/alpha_payments` to its exposed application, proxy tenant API requests through `/api/alpha-payments/`, and advertise Payment Investigation to the entitled login fixture without changing existing Ratan composition.

#### Scenario: Entitled user discovers the tenant application

- **WHEN** the local acceptance user signs in and opens New Tile
- **THEN** Payment Investigation is visible as an available Alpha Payments application

#### Scenario: Portal opens the federated application

- **WHEN** the user selects Payment Investigation
- **THEN** the portal creates a workspace tab and renders the Alpha Payments remote with API data while remaining on the portal origin

### Requirement: Complete onboarding journey is verifiable

The local development stack SHALL provide one command that starts the portal, existing federation dependencies, Alpha Payments remote, and Alpha Payments API, and SHALL support automated and visual verification through the public portal entry point.

#### Scenario: Junior developer completes the local business journey

- **WHEN** the developer starts the stack, signs in, opens New Tile, selects Payment Investigation, filters cases, acknowledges an eligible case, and removes its workspace tab
- **THEN** every interaction succeeds through `http://127.0.0.1:8001` with no page errors or tenant API calls to a direct service origin
