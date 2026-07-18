## ADDED Requirements

### Requirement: Deterministic canary selection
The release system SHALL support deterministic internal, named-user, percentage, business-unit, or regional cohorts and MUST record the registry revision delivered to each cohort.

#### Scenario: Release to internal users
- **WHEN** a candidate is activated for the internal cohort
- **THEN** only that cohort receives the candidate registry while the general cohort remains on the known-good revision

### Requirement: Staged rollout gates
Production rollout SHALL progress through configured cohort percentages only after minimum sample, soak duration, automated health, and approval gates succeed.

#### Scenario: Ten-percent canary succeeds
- **WHEN** the ten-percent cohort completes its soak with healthy SLO and business signals
- **THEN** the release becomes eligible for the next configured stage

### Requirement: Automated release stop
The system MUST stop further rollout when integrity, compatibility, synthetic, availability, performance, or business-signal thresholds fail.

#### Scenario: Synthetic journey fails repeatedly
- **WHEN** the canary synthetic fails beyond the release policy threshold
- **THEN** rollout stops and an incident signal identifies the candidate revision

### Requirement: Registry-based rollback
Rollback SHALL reactivate a previous known-good registry revision without rebuilding, overwriting, or redeploying immutable application artifacts.

#### Scenario: Roll back after remote failure
- **WHEN** an authorized release owner or automation invokes rollback
- **THEN** new page loads resolve the earlier remote version within the rollback SLO

### Requirement: Active-session recovery policy
The platform MUST document that registry rollback affects new remote loads and MUST define controlled-refresh behavior for critical incidents without unsafe hot replacement of loaded share scopes.

#### Scenario: User already loaded the failed remote
- **WHEN** rollback occurs after a user session has initialized the candidate
- **THEN** the host follows the defined notification/refresh policy rather than force-registering a replacement into the active share scope

### Requirement: Disaster-recovery exercise
Artifacts and registry history MUST be replicated and restoration/failover MUST be exercised at the defined interval against RPO and RTO targets.

#### Scenario: Simulated primary-region loss
- **WHEN** the scheduled DR exercise disables the primary delivery path
- **THEN** a known-good host and application set becomes available through the recovery path within target RTO
