import type { WorkflowEvent } from 'ratan-fdc3-agent';

export type ProcessorStatus = 'pending' | 'running' | 'completed' | 'failed';
export type OrchestratorStatus = 'idle' | 'running' | 'completed' | 'failed';

export type WorkflowProcessorDefinition = {
  stepId: string;
  title: string;
  description: string;
  intent: string;
  appId: string;
  index: number;
};

export const WORKFLOW_PROCESSORS: WorkflowProcessorDefinition[] = [
  {
    stepId: 'discover-trade',
    title: 'Discover trade',
    description: 'Find a pending-validation trade',
    intent: 'DiscoverWorkflowTrades',
    appId: 'template_tile_workflow_discovery',
    index: 1,
  },
  {
    stepId: 'price-trade',
    title: 'Price trade',
    description: 'Attach a market snapshot',
    intent: 'PriceWorkflowTrade',
    appId: 'template_tile_workflow_pricing',
    index: 2,
  },
  {
    stepId: 'assess-risk',
    title: 'Assess risk',
    description: 'Classify limit utilization',
    intent: 'AssessWorkflowRisk',
    appId: 'template_tile_workflow_risk',
    index: 3,
  },
];

export type ProcessorState = WorkflowProcessorDefinition & {
  status: ProcessorStatus;
  latestMessage: string;
  context?: Record<string, unknown>;
  result?: unknown;
  error?: string;
  startedAt?: string;
  completedAt?: string;
};

export type WorkflowOrchestratorState = {
  status: OrchestratorStatus;
  runId?: string;
  summary?: string;
  error?: string;
  selectedStepId: string;
  lastSequence: number;
  nodes: Record<string, ProcessorState>;
};

export type WorkflowOrchestratorAction =
  | { type: 'event'; event: WorkflowEvent }
  | { type: 'select'; stepId: string }
  | { type: 'execution-started' }
  | { type: 'execution-error'; error: string };

function createNodes(): Record<string, ProcessorState> {
  return Object.fromEntries(
    WORKFLOW_PROCESSORS.map((processor) => [
      processor.stepId,
      {
        ...processor,
        status: 'pending' as const,
        latestMessage: 'Waiting for upstream input',
      },
    ]),
  );
}

export function createInitialOrchestratorState(): WorkflowOrchestratorState {
  return {
    status: 'idle',
    selectedStepId: WORKFLOW_PROCESSORS[0].stepId,
    lastSequence: 0,
    nodes: createNodes(),
  };
}

function updateNode(
  state: WorkflowOrchestratorState,
  stepId: string | undefined,
  update: Partial<ProcessorState>,
): WorkflowOrchestratorState {
  if (!stepId || !state.nodes[stepId]) {
    return state;
  }
  return {
    ...state,
    nodes: {
      ...state.nodes,
      [stepId]: {
        ...state.nodes[stepId],
        ...update,
      },
    },
  };
}

export function workflowOrchestratorReducer(
  state: WorkflowOrchestratorState,
  action: WorkflowOrchestratorAction,
): WorkflowOrchestratorState {
  if (action.type === 'select') {
    return state.nodes[action.stepId] ? { ...state, selectedStepId: action.stepId } : state;
  }
  if (action.type === 'execution-started') {
    return { ...createInitialOrchestratorState(), status: 'running' };
  }
  if (action.type === 'execution-error') {
    return { ...state, status: 'failed', error: action.error };
  }

  const { event } = action;
  const eventState = {
    ...state,
    runId: event.runId,
    lastSequence: Math.max(state.lastSequence, event.sequence),
  };

  switch (event.type) {
    case 'workflow.started':
      return {
        ...createInitialOrchestratorState(),
        status: 'running',
        runId: event.runId,
        lastSequence: event.sequence,
      };
    case 'node.started':
      return updateNode(eventState, event.stepId, {
        status: 'running',
        context: event.context,
        startedAt: event.timestamp,
        latestMessage: `Invoking ${event.intent ?? 'capability'}`,
        error: undefined,
      });
    case 'node.completed':
      return updateNode(eventState, event.stepId, {
        status: 'completed',
        result: event.result,
        completedAt: event.timestamp,
        latestMessage: 'Result received',
      });
    case 'node.failed':
      return updateNode(eventState, event.stepId, {
        status: 'failed',
        error: event.error,
        completedAt: event.timestamp,
        latestMessage: event.error ?? 'Processor failed',
      });
    case 'workflow.completed':
      return {
        ...eventState,
        status: 'completed',
        summary: event.summary,
        error: undefined,
      };
    case 'workflow.failed':
      return {
        ...eventState,
        status: 'failed',
        summary: event.summary,
        error: event.error ?? 'Workflow failed',
      };
    default:
      return eventState;
  }
}
