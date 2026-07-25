## 1. Workflow Event Contract

- [x] 1.1 Add failing broker tests for ordered lifecycle events, failure events, subscriptions, and execute-once result access
- [x] 1.2 Add workflow event and subscription types to the broker and agent public APIs
- [x] 1.3 Implement buffered lifecycle emission and execute-once workflow resolutions

## 2. Sample FDC3 Capability Tiles

- [x] 2.1 Add failing tile tests for trade discovery, pricing, and risk intent handlers
- [x] 2.2 Implement deterministic capability models and the three sample tile views
- [x] 2.3 Add tile routes, local app-directory declarations, and menu entries

## 3. Workflow Orchestrator UI

- [x] 3.1 Add failing reducer and component tests for pending, running, completed, failed, and result-detail states
- [x] 3.2 Implement the operations-signal-board process canvas and mini-processor components
- [x] 3.3 Connect the orchestrator to `raiseWorkflow`, lifecycle subscriptions, full-tile opening, and final results
- [x] 3.4 Add the three-node declared sample workflow with typed result bindings

## 4. Verification

- [x] 4.1 Run targeted broker and tile tests with required coverage and fix failures
- [x] 4.2 Run lint and production builds for affected packages
- [x] 4.3 Add and run Playwright coverage for login, tile launch, live processing, final results, and tab deletion
- [x] 4.4 Verify the same workflow interactively through Chrome and inspect the final visual state

## 5. Distributable Orchestrator Package

- [x] 5.1 Add failing package tests for definition validation, lifecycle order, preflight, missing handlers, timeout, retry, cancellation, continue-on-error, invalid results, and observer isolation
- [x] 5.2 Implement the framework-neutral orchestrator, FDC3 ports, structured failure model, and exports
- [x] 5.3 Add failing AI-tool tests for discovery, inspection, execution envelopes, progress forwarding, cancellation, and unexpected adapter errors
- [x] 5.4 Implement the JSON-schema AI-agent toolkit and package integration guide

## 6. Package Verification and Adoption

- [x] 6.1 Achieve greater than 90% line and branch coverage for the package
- [x] 6.2 Run package lint, type checking, production build, and strict OpenSpec validation
- [x] 6.3 Add a broker capability-inspector adapter and verify the declared-without-handler case against broker runtime state
