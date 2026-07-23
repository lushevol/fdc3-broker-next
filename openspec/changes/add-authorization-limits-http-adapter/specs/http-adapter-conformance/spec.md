## ADDED Requirements

### Requirement: Dormant production compatibility
Adding the adapter MUST NOT instantiate it, inject mutation capability, or expose runtime actions in the current production bootstrap.

#### Scenario: Browser rollback journey runs
- **WHEN** the production pilot loads Authorization Limits
- **THEN** all mutation actions remain absent

### Requirement: Adapter boundary
The adapter MUST NOT import React, design/grid libraries, federation, legacy globals, axios, or application-global service clients.

#### Scenario: Boundary scan runs
- **WHEN** adapter source is checked
- **THEN** forbidden dependency or browser transport ownership fails acceptance

### Requirement: Adapter acceptance evidence
Acceptance SHALL cover every method/path/body, encoded segments, valid list/record decoding, each error category, transport throws, malformed successes, strict types, full pilot regression, browser rollback, and OpenSpec validation.

#### Scenario: Adapter cohort is accepted
- **WHEN** all gates pass
- **THEN** the adapter is ready for approved transport injection but remains dormant
