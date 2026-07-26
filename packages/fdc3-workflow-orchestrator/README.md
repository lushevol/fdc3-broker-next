# Ratan FDC3 Workflow Orchestrator

A framework-neutral runtime for composing FDC3 intents into bounded, observable workflows. It ships with structured failure semantics and JSON-schema tools for AI agents.

## Install

```bash
npm install ratan-fdc3-workflow-orchestrator
```

The package has no React dependency and does not require a particular FDC3 desktop container.

## Create an orchestrator

```ts
import {
  WorkflowOrchestrator,
  type WorkflowDefinition,
} from 'ratan-fdc3-workflow-orchestrator';

const workflows: WorkflowDefinition[] = [
  {
    workflowId: 'trade.insight',
    title: 'Trade insight',
    inputSchema: {
      type: 'object',
      properties: { desk: { type: 'string' } },
      required: ['desk'],
    },
    steps: [
      {
        id: 'discover',
        intent: 'DiscoverWorkflowTrades',
        targetAppId: 'workflow-trade-discovery',
        contextTemplate: {
          type: 'fdc3.trade.query',
          desk: '${input.desk}',
        },
        timeoutMs: 10_000,
      },
    ],
  },
];

const orchestrator = new WorkflowOrchestrator({
  workflows,
  client: {
    raiseIntent: (intent, context, target) =>
      window.fdc3.raiseIntent(intent, context, target),
  },
});

const transcript = await orchestrator.execute('trade.insight', { desk: 'FX' }, {
  onEvent: (event) => console.info(event.type, event.stepId),
});
```

## Detect declared intents without handlers

FDC3 app-directory declarations do not prove that a live tile installed an intent listener. Hosts with a runtime registry should inject `inspectCapability`:

```ts
const orchestrator = new WorkflowOrchestrator({
  workflows,
  client,
  inspectCapability: ({ intent, targetAppId }) =>
    broker.inspectWorkflowCapability({ intent, targetAppId }),
});
```

The inspector returns:

- `ready`: a live matching handler is registered.
- `declared-only`: metadata exists but no live handler is registered.
- `unavailable`: no matching declaration exists.
- `unknown`: the host cannot determine readiness.

`declared-only` becomes `HANDLER_NOT_REGISTERED`. Without an inspector, a resolution with no result becomes `HANDLER_NO_RESULT`.

## Retry and cancellation

Retries are disabled by default because intents may cause side effects. Enable them only for idempotent steps:

```ts
{
  id: 'price',
  intent: 'PriceWorkflowTrade',
  contextTemplate: { type: 'fdc3.trade' },
  retry: {
    maxAttempts: 2,
    delayMs: 250,
    retryOn: ['INTENT_RAISE_FAILED', 'RESULT_TIMEOUT'],
  },
}
```

Pass an `AbortSignal` to cancel a run. Step and run timeouts always produce terminal transcripts.

## AI-agent integration

```ts
import { createWorkflowAgentToolkit } from 'ratan-fdc3-workflow-orchestrator';

const toolkit = createWorkflowAgentToolkit(orchestrator);

// Map directly into function/tool definitions used by an AI SDK.
const functionTools = toolkit.tools.map((tool) => ({
  type: 'function' as const,
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema,
  },
}));

// Execute the tool call selected by the agent.
const tool = toolkit.getTool('run_fdc3_workflow');
const result = await tool?.execute(
  {
    workflowId: 'trade.insight',
    input: { desk: 'FX' },
  },
  {
    signal: abortController.signal,
    onProgress: (event) => publishAgentProgress(event),
  },
);
```

The toolkit exposes:

- `list_fdc3_workflows`
- `inspect_fdc3_workflow`
- `run_fdc3_workflow`

Expected workflow failures never throw from a tool. The returned envelope includes stable failure codes, safe messages, a transcript, and recovery actions. The same definitions can be adapted to OpenAI function calling, MCP, LangChain, Spring AI, or another tool-capable agent runtime.

## Chatbot approval flow

Use the orchestration runtime as the single execution path for chatbot-driven FDC3 workflows:

1. Have the agent select a declared workflow and present its ordered steps.
2. Request explicit user approval before invoking `execute`.
3. Pass `onEvent` to render live step progress and return the final `WorkflowTranscript` to the conversation.

The runtime deliberately executes only registered workflow definitions. A chatbot must not execute LLM-supplied intents or bindings directly.
