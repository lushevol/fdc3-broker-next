## Context

The platform currently loads tile MFEs through Single-SPA and routes FDC3 intents through a broker hosted by the base MFE. `WorkflowExecutor` can execute a validated list of intent steps and bind earlier results into later contexts, but it only returns a final transcript. `mfe-flowzero` already contains a ReactFlow/BPMN designer and the Flowzero orchestration service contains a durable Camunda engine.

This change delivers a runnable vertical slice inside the existing template tile MFE. It proves the capability contract, event model, and process UI without introducing a second canvas framework or requiring a backend deployment. The durable Flowzero boundary remains the intended production evolution.

## Goals / Non-Goals

**Goals:**

- Emit deterministic, correlated workflow and node lifecycle events from the FDC3 workflow runtime.
- Render one workflow definition as an understandable process graph with compact live processors.
- Exercise three distinct FDC3 tile capabilities and pass typed results between them.
- Keep existing `raiseWorkflow(...).getResult()` callers compatible.
- Cover the contract with unit tests and the complete user journey with browser automation.
- Ship orchestration as a standalone package with no React dependency and explicit operational failure semantics.
- Make the same workflow catalog consumable by AI agents without coupling to a particular model SDK.

**Non-Goals:**

- Persist workflow runs across a browser or service restart.
- Replace the Flowzero BPMN designer or Camunda runtime.
- Implement arbitrary graph editing, compensation, distributed locking, or production authorization policies.
- Stream a complete remote tile DOM inside a process node.
- Infer live listener readiness from app-directory declarations alone.
- Implement distributed compensation or exactly-once delivery across external desktop agents.

## Decisions

### 1. Extend the existing resolution with subscription

`WorkflowResolution` will add a `subscribe(listener)` method and execution will start once per resolution. Events are buffered so a subscriber attached immediately after `raiseWorkflow` observes the complete lifecycle. `getResult()` remains the final result API and returns the same promise to every caller.

Alternative considered: return an `AsyncIterable`. A listener API is easier to consume from React effects and introduces less compatibility risk for the current local-only agent bridge.

### 2. Use explicit workflow events rather than inferred UI state

The executor emits `workflow.started`, `node.started`, `node.completed`, `node.failed`, and terminal workflow events with `runId`, `workflowId`, `stepId`, sequence, timestamp, and relevant data. The orchestrator reducer derives mini-processor state from these events.

Alternative considered: infer progress from the final transcript and timers. That would make the UI decorative rather than an observable execution surface.

### 3. Keep the thin slice sequential while visualizing a graph

The existing executor remains sequential. The sample workflow is a linear three-node pipeline: discover trades, enrich price, then calculate risk. The event and UI models use node identities that can later support parallel branches without changing their external shape.

Alternative considered: add DAG scheduling in this pass. It would substantially increase failure and binding semantics before the streaming contract is proven.

### 4. Implement four routes in the existing template tile MFE

The change adds one orchestrator route and three independently registered sample tile routes. Each route has a distinct FDC3 app identifier in the app directory even though they share one SystemJS bundle. This matches the existing pattern used by the trade blotter and FDC3 demo tiles while avoiding three copies of the build configuration.

### 5. Use a host-rendered mini processor

The process canvas renders a standard compact shell driven by workflow events. Selecting a node reveals its structured input/output and offers an “Open tile” action. It does not mount the full remote MFE inside the node.

This avoids multiplying React roots and keeps the canvas responsive. A future capability manifest can advertise a constrained custom summary renderer.

### 6. Visual direction: operations signal board

The UI is for operations users monitoring a multi-stage trade workflow. It uses a cool mineral palette with “signal” accents:

- `--workflow-ink: #14202b`
- `--workflow-slate: #52606d`
- `--workflow-surface: #f5f7f8`
- `--workflow-panel: #ffffff`
- `--workflow-signal: #0b7285`
- `--workflow-live: #f59f00`

Typography uses the platform body font, tabular numerals for timing, and compact uppercase utility labels. The signature element is a continuous execution rail: node cards sit on one directional line whose active segment illuminates as events arrive. This is specific to process monitoring and avoids a generic dashboard-card composition.

The first critique removed decorative charts and gradients because they did not communicate execution state. Motion is limited to the active rail and status beacon, and respects reduced-motion preferences.

### 7. Package the runtime behind injected FDC3 ports

`ratan-fdc3-workflow-orchestrator` owns definition validation, preflight, execution policy, lifecycle events, structured failures, and AI adapters. It accepts small injected ports for `raiseIntent` and optional runtime capability inspection, so it can run against the local broker, another FDC3 desktop agent, or a test double.

The package does not depend on React or broker internals. Standard FDC3 environments can omit the inspector and retain portable behavior. Hosts with a runtime registry can report `ready`, `declared-only`, or `unavailable` for more precise preflight.

### 8. Treat missing handlers as a protocol outcome

An advertised intent is not proof that a mounted tile installed a listener. The runtime handles this at two layers:

- A host inspector can fail fast with `HANDLER_NOT_REGISTERED`.
- Portable execution treats a resolution with no result as `HANDLER_NO_RESULT`.

Both failures carry recovery hints suitable for users and AI agents. Steps may retry selected codes or continue on error when explicitly configured.

### 9. Expose framework-neutral AI tools

The package creates three JSON-schema tools: list workflows, inspect one workflow, and run a workflow. Tool execution returns serializable envelopes and expected workflow failures do not escape as thrown exceptions. Hosts may forward lifecycle events through an `onProgress` callback and map the tool objects into OpenAI, MCP, LangChain, Spring AI, or another agent framework.

## Risks / Trade-offs

- **Browser-local execution cannot survive refresh** → Keep run/event identities production-shaped and document Flowzero as the durable owner.
- **A targeted tile may not yet be mounted** → Use the broker’s existing targeted intent/open-tile behavior and declare all sample tiles in the local app directory.
- **Fast deterministic handlers can make progress impossible to perceive** → Sample handlers use short bounded delays; tests use fake timers where appropriate.
- **Subscription may miss synchronously emitted events** → Start execution in a microtask and buffer events until delivered.
- **Unrelated dirty worktree changes could be overwritten** → Edit only new routes/components and narrowly scoped declaration/runtime files.
- **FDC3 implementations expose different error messages** → Accept a host error classifier and otherwise map unknown exceptions to safe stable codes.
- **Retry can duplicate side effects** → Disable retries by default and require an explicit per-step retry policy.
- **AI agents may over-share raw contexts/results** → Return structured workflow data but never raw exception objects or stack traces; let hosts redact domain data if required.

## Migration Plan

1. Add event types and backward-compatible resolution subscription.
2. Add sample declarations and workflow definition.
3. Add capability and orchestrator routes to the existing tile MFE.
4. Register local menu entries.
5. Verify unit tests, package builds, Playwright, and Chrome.
6. Later, replace the browser-local executor behind the same event contract with the Flowzero orchestration service.

Rollback consists of removing the four local routes/declarations and reverting the optional subscription API; existing workflow callers remain unaffected.

## Open Questions

- Should production node events be delivered over SSE or the existing WebSocket gateway?
- Should a capability manifest allow remote custom mini renderers, or only schema-driven summaries?
- Which workflow actions require explicit entitlement checks beyond the intent-level checks already enforced by the broker?
