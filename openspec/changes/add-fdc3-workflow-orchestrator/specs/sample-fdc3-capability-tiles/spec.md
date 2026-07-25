## ADDED Requirements

### Requirement: Trade discovery capability
The trade discovery tile SHALL listen for `DiscoverWorkflowTrades` with an `fdc3.trade.query` context and return a deterministic trade result.

#### Scenario: Discover pending trade
- **WHEN** the tile receives a query for `PENDING_VALIDATION`
- **THEN** it returns a trade containing an identifier, instrument, side, quantity, and currency

### Requirement: Pricing capability
The pricing tile SHALL listen for `PriceWorkflowTrade` with an `fdc3.trade` context and return deterministic market pricing for the supplied trade.

#### Scenario: Price discovered trade
- **WHEN** the tile receives the discovered sample trade
- **THEN** it returns the trade identifier, mid price, spread, currency, and pricing timestamp

### Requirement: Risk capability
The risk tile SHALL listen for `AssessWorkflowRisk` with a workflow risk context and return deterministic exposure and classification.

#### Scenario: Assess priced trade
- **WHEN** the tile receives a trade and bound price
- **THEN** it returns the trade identifier, exposure, limit utilization, and a risk classification

### Requirement: Independent tile presentation
Each sample capability SHALL be available as a separately launchable tile route that shows its FDC3 intent, readiness, latest request, and latest result.

#### Scenario: Open sample capability
- **WHEN** a user opens any sample capability from the tile menu
- **THEN** the workspace renders the corresponding tile and identifies it as ready for workflow requests
