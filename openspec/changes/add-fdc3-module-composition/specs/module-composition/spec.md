## ADDED Requirements

### Requirement: Runtime-neutral module composition contract

The platform SHALL provide a typed module-composition API that resolves an explicitly identified component export independently of the underlying runtime.

#### Scenario: Consumer loads a named exposed component

- **WHEN** a consumer supplies a valid module reference with a loader, module identifier, and export name
- **THEN** the API returns normalized component metadata and a renderable React component

### Requirement: SystemJS adapter

The module-composition package SHALL load SystemJS modules through an injected import-compatible function and SHALL select either the declared named export or the default export.

#### Scenario: SystemJS module resolves successfully

- **WHEN** a SystemJS reference is loaded and its selected export is a component
- **THEN** the adapter returns that component without requiring a direct SystemJS package dependency

### Requirement: Module Federation adapter

The module-composition package SHALL load Module Federation modules through an injected `loadRemote`-compatible function and SHALL normalize the selected component export in the same form as SystemJS.

#### Scenario: Module Federation remote resolves successfully

- **WHEN** a Module Federation reference is loaded through the registered runtime function
- **THEN** the adapter returns the selected component with the supplied module reference metadata

### Requirement: Safe repeat loading

The module-composition service SHALL deduplicate concurrent loads for the same complete module reference and SHALL allow a later retry after a failed load.

#### Scenario: Parallel consumers request the same module

- **WHEN** two consumers load the same reference before the first operation completes
- **THEN** the underlying adapter is invoked once and both consumers receive the normalized result

#### Scenario: A prior load failed

- **WHEN** a consumer retries the same reference after its underlying load rejects
- **THEN** the service invokes the adapter again

### Requirement: Explicit module-load failures

The module-composition package SHALL reject unsupported loaders, missing exports, and non-component exports with a typed error that identifies the failed reference.

#### Scenario: Producer has not exposed the requested export

- **WHEN** the selected export is absent from a resolved module namespace
- **THEN** loading rejects with a module-composition error and does not return a partial module

### Requirement: Executable cross-tile samples
The platform SHALL provide a SystemJS producer sample tile with a named component export and a separate consumer sample tile that loads and renders that export through the extended FDC3 client.

#### Scenario: Consumer renders the producer component
- **WHEN** a user activates the consumer sample's load action
- **THEN** it loads the producer through `modules.load` and renders the producer's named component in the consumer tile
