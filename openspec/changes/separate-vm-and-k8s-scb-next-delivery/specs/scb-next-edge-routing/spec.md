## ADDED Requirements

### Requirement: All traffic enters through the platform edge
The deployment SHALL expose only the platform-owned Nginx edge to browser traffic, and SHALL keep platform and tenant upstreams private.

#### Scenario: Browser reaches a workload
- **WHEN** a browser requests any supported platform or tenant path
- **THEN** the request first reaches the platform edge and is forwarded to exactly one owning upstream

### Requirement: Platform traffic has explicit owners
The edge SHALL route platform UI traffic to `mfe-base` and platform API traffic to `single-ui-bff` without passing either through a tenant workload.

#### Scenario: Platform host is requested
- **WHEN** the browser requests `/` or a platform static asset
- **THEN** the edge forwards the request to `mfe-base`

#### Scenario: Platform API is requested
- **WHEN** the browser requests `/api/auth/*`, `/api/analytics/*`, `/api/sso/*`, or another supported non-tenant `/api/*` path
- **THEN** the edge forwards the request to `single-ui-bff`

### Requirement: Ratan traffic has tenant-owned upstreams
The edge SHALL route Ratan static, BFF, socket, notification, data-ambassador, and general API paths to their configured tenant upstreams using most-specific-path precedence.

#### Scenario: Tenant static application is requested
- **WHEN** the browser requests `/static/ratan/container/*` or `/static/ratan/cashflow/*`
- **THEN** the edge forwards the request to the matching independently deployed tenant UI

#### Scenario: Specific tenant API is requested
- **WHEN** the browser requests a path below `/api/ratan/bff/`, `/api/ratan/socket/`, `/api/ratan/notification/`, or `/api/ratan/da/`
- **THEN** the edge selects the specific configured upstream before evaluating the `/api/ratan/*` fallback

#### Scenario: General tenant API is requested
- **WHEN** the browser requests another path below `/api/ratan/`
- **THEN** the edge forwards the request to the configured Ratan API gateway

### Requirement: Existing remote URLs remain compatible
The edge SHALL serve `/remotes/ratan/*` and `/remotes/cashflow/*` as aliases of the canonical tenant static upstreams with equivalent cache behavior.

#### Scenario: Existing federation manifest is loaded
- **WHEN** an existing Base or Ratan build requests a federation entry below `/remotes/ratan/` or `/remotes/cashflow/`
- **THEN** the edge returns the corresponding tenant artifact without requiring a frontend rebuild

### Requirement: Edge forwarding preserves protocol behavior
The edge SHALL forward host, client, correlation, and original protocol information and SHALL support WebSocket upgrade and long-lived tenant subscription connections.

#### Scenario: Tenant socket connects
- **WHEN** a client upgrades a connection below `/api/ratan/socket/`
- **THEN** the edge forwards the upgrade headers and does not apply a normal short HTTP read timeout

### Requirement: Edge cache and health behavior is explicit
The edge SHALL expose a non-cached health endpoint, SHALL prevent long caching of federation manifests, and SHALL allow immutable caching only for versioned or hashed static assets.

#### Scenario: Federation entry is requested
- **WHEN** a client requests `remoteEntry.js` through a canonical or compatibility path
- **THEN** the response requires revalidation or disables storage
