## ADDED Requirements

### Requirement: Onboarding defines one front-to-back tenant contract

The onboarding processor SHALL capture business ownership, Kubernetes isolation, portal routes and remotes, frontend and backend workloads, identity and entitlements, external dependencies, operations, and recovery objectives in one tenant descriptor.

#### Scenario: Complete tenant intake is generated

- **WHEN** an operator supplies all required onboarding values
- **THEN** the processor generates one structured descriptor containing every required contract section

### Requirement: Tenant identifiers and portal paths are valid

The onboarding processor SHALL accept only lowercase Kubernetes-safe tenant identifiers and SHALL derive or validate same-origin API and static path families that are unique to that tenant.

#### Scenario: Invalid tenant identifier is supplied

- **WHEN** an identifier contains uppercase letters, underscores, whitespace, or invalid boundary characters
- **THEN** generation fails with an actionable validation message and no tenant descriptor is written

### Requirement: Onboarding artifacts are secret-safe

The onboarding processor SHALL collect secret-provider references only, SHALL NOT request raw credentials, and SHALL reject values that resemble common secret material before writing generated artifacts.

#### Scenario: Raw secret material is supplied

- **WHEN** an input contains a private key, bearer token, password assignment, or cloud access key pattern
- **THEN** generation fails and the suspected value is not echoed in command output

### Requirement: Processing is generate-only

The onboarding processor SHALL write only local onboarding artifacts and SHALL NOT apply Kubernetes resources, modify shared platform routing, create remote resources, or set secrets.

#### Scenario: Tenant bundle is generated

- **WHEN** the processor completes successfully
- **THEN** it reports the generated local files and the manual review commands without invoking cluster mutation commands

### Requirement: Onboarding is rerunnable and deterministic

The onboarding processor SHALL support a non-interactive input mode and SHALL produce equivalent descriptor and checklist content when rerun with the same normalized inputs.

#### Scenario: Approved intake is regenerated

- **WHEN** an operator runs the processor twice with the same input file and output directory
- **THEN** the second run replaces the generated artifacts without duplicate fields or checklist entries

### Requirement: Generated checklists require evidence and approval

The onboarding processor SHALL generate a tenant-specific checklist covering intake, portal integration, workloads, security, data, verification, activation, rollback, operations, and offboarding, with all approval items incomplete by default.

#### Scenario: Checklist is reviewed before activation

- **WHEN** a tenant-specific checklist is generated
- **THEN** it identifies the tenant and contains incomplete evidence and approval gates for platform, tenant, security, and SRE owners

### Requirement: Operators can understand the processor before running it

The onboarding processor SHALL provide a non-interactive help command and repository guidance explaining prerequisites, stages, inputs, outputs, security boundaries, verification, activation, rollback, and offboarding.

#### Scenario: Operator requests help

- **WHEN** the processor is invoked with `--help`
- **THEN** it exits successfully without prompting or writing files and describes interactive and non-interactive usage
