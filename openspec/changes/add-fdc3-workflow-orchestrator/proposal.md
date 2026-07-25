## Why

The platform can execute a declared sequence of FDC3 intents, but users cannot inspect a live run, understand which tile is working, or compose a workflow from reusable tile capabilities. A focused orchestration experience is needed to prove that FDC3-capable tiles can cooperate on a multi-node task while keeping the process understandable and controllable.

## What Changes

- Extend the local FDC3 workflow contract with correlated lifecycle events for workflow and node execution.
- Add a workflow orchestrator tile that renders a configurable process graph and turns active nodes into compact live processors.
- Add three sample FDC3 capability tiles for trade discovery, pricing, and risk analysis.
- Add a declared sample workflow that passes typed results between the three capabilities.
- Add retry-safe, deterministic sample results so the end-to-end workflow can be exercised without external services.
- Add a publishable `ratan-fdc3-workflow-orchestrator` package with framework-neutral FDC3 adapters, structured failure semantics, cancellation, timeout, retry, and capability preflight.
- Add an AI-agent toolkit that exposes workflow discovery, inspection, execution, progress, and recovery hints through JSON-schema tool contracts.
- Add unit, integration, and browser coverage for execution state, FDC3 routing, progress presentation, and final results.

## Capabilities

### New Capabilities

- `fdc3-workflow-event-stream`: Correlated workflow and node lifecycle events emitted during declared FDC3 workflow execution.
- `workflow-orchestrator-ui`: Canvas-based workflow customization, live mini-processor rendering, run controls, and result inspection.
- `sample-fdc3-capability-tiles`: Three independently routable sample tiles that advertise FDC3 intents and return typed workflow results.
- `fdc3-workflow-orchestrator-package`: Distributable orchestration runtime and AI-agent integration surface.

### Modified Capabilities

None.

## Impact

- `packages/fdc3-broker`: workflow types, executor behavior, and tests.
- `packages/fdc3-agent`: exposed workflow event types.
- `packages/fdc3-workflow-orchestrator`: standalone runtime, AI tools, tests, and integration documentation.
- `apps/base`: local FDC3 declarations and workflow configuration.
- `apps/tile`: three sample capability routes, an orchestrator route, shared visual components, and Jest coverage.
- `apps/root-config`: local entitlement/menu mock entries for the four new tile routes.
- `tests/e2e`: Playwright coverage for login, tile launch, workflow execution, live progress, and results.
