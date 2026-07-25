import type {
  JsonObject,
  WorkflowEvent,
  WorkflowPreflightReport,
  WorkflowSummary,
  WorkflowTranscript,
} from './types';

export type AgentToolError = {
  code: 'INVALID_TOOL_INPUT' | 'WORKFLOW_NOT_FOUND' | 'TOOL_EXECUTION_FAILED';
  message: string;
  hint: string;
};

export type AgentWorkflowToolResult = {
  ok: boolean;
  kind: 'workflow-list' | 'workflow-inspection' | 'workflow-run' | 'tool-error';
  data?: JsonObject;
  transcript?: WorkflowTranscript;
  failures?: WorkflowTranscript['failures'];
  recoveryActions?: string[];
  error?: AgentToolError;
};

export type AgentWorkflowToolContext = {
  signal?: AbortSignal;
  onProgress?: (event: WorkflowEvent) => void;
};

export type AgentWorkflowTool = {
  name: 'list_fdc3_workflows' | 'inspect_fdc3_workflow' | 'run_fdc3_workflow';
  description: string;
  inputSchema: JsonObject;
  execute(
    input: unknown,
    context?: AgentWorkflowToolContext,
  ): Promise<AgentWorkflowToolResult>;
};

export type AgentWorkflowOrchestrator = {
  listWorkflows(): WorkflowSummary[];
  inspectWorkflow(workflowId: string): WorkflowSummary | null;
  preflight(workflowId: string, input?: JsonObject): Promise<WorkflowPreflightReport>;
  execute(
    workflowId: string,
    input?: JsonObject,
    options?: {
      signal?: AbortSignal;
      onEvent?: (event: WorkflowEvent) => void;
    },
  ): Promise<WorkflowTranscript>;
};

export type WorkflowAgentToolkit = {
  tools: AgentWorkflowTool[];
  getTool(name: AgentWorkflowTool['name']): AgentWorkflowTool | undefined;
};

const EMPTY_OBJECT_SCHEMA: JsonObject = {
  type: 'object',
  properties: {},
  additionalProperties: false,
};

const WORKFLOW_REQUEST_PROPERTIES = {
  workflowId: {
    type: 'string',
    description: 'A workflow identifier returned by list_fdc3_workflows.',
  },
  input: {
    type: 'object',
    description: 'Workflow input conforming to the selected workflow inputSchema.',
    additionalProperties: true,
  },
};

const INSPECT_SCHEMA: JsonObject = {
  type: 'object',
  properties: WORKFLOW_REQUEST_PROPERTIES,
  required: ['workflowId'],
  additionalProperties: false,
};

const RUN_SCHEMA: JsonObject = {
  type: 'object',
  properties: WORKFLOW_REQUEST_PROPERTIES,
  required: ['workflowId'],
  additionalProperties: false,
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseWorkflowRequest(
  value: unknown,
): { workflowId: string; input: JsonObject } | AgentToolError {
  if (!isObject(value) || typeof value.workflowId !== 'string' || !value.workflowId.trim()) {
    return {
      code: 'INVALID_TOOL_INPUT',
      message: 'workflowId must be a non-empty string.',
      hint: 'Call list_fdc3_workflows and pass one returned workflowId.',
    };
  }
  if (value.input !== undefined && !isObject(value.input)) {
    return {
      code: 'INVALID_TOOL_INPUT',
      message: 'input must be a JSON object.',
      hint: 'Inspect the workflow inputSchema and provide an object.',
    };
  }
  return {
    workflowId: value.workflowId,
    input: value.input ?? {},
  };
}

function toolError(error: AgentToolError): AgentWorkflowToolResult {
  return {
    ok: false,
    kind: 'tool-error',
    error,
    recoveryActions: [error.hint],
  };
}

function unexpectedToolError(): AgentWorkflowToolResult {
  return toolError({
    code: 'TOOL_EXECUTION_FAILED',
    message: 'The workflow tool could not complete its request.',
    hint: 'Retry once, then inspect host diagnostics if the failure persists.',
  });
}

function recoveryActions(transcript: WorkflowTranscript): string[] {
  return Array.from(new Set(transcript.failures.map((failure) => failure.hint)));
}

function createListTool(orchestrator: AgentWorkflowOrchestrator): AgentWorkflowTool {
  return {
    name: 'list_fdc3_workflows',
    description:
      'List the FDC3 workflows available to the agent, including input schemas and ordered intent steps.',
    inputSchema: EMPTY_OBJECT_SCHEMA,
    execute: async () => {
      try {
        return {
          ok: true,
          kind: 'workflow-list',
          data: {
            workflows: orchestrator.listWorkflows(),
          },
        };
      } catch {
        return unexpectedToolError();
      }
    },
  };
}

function createInspectTool(orchestrator: AgentWorkflowOrchestrator): AgentWorkflowTool {
  return {
    name: 'inspect_fdc3_workflow',
    description:
      'Inspect a workflow definition and verify whether its declared FDC3 capability tiles are ready.',
    inputSchema: INSPECT_SCHEMA,
    execute: async (value) => {
      const request = parseWorkflowRequest(value);
      if ('code' in request) {
        return toolError(request);
      }
      try {
        const workflow = orchestrator.inspectWorkflow(request.workflowId);
        if (!workflow) {
          return toolError({
            code: 'WORKFLOW_NOT_FOUND',
            message: 'The requested workflow is not registered.',
            hint: 'Call list_fdc3_workflows and select a returned workflowId.',
          });
        }
        const preflight = await orchestrator.preflight(request.workflowId, request.input);
        return {
          ok: preflight.ready,
          kind: 'workflow-inspection',
          data: { workflow, preflight },
          recoveryActions: preflight.checks
            .flatMap((check) => (check.failure ? [check.failure.hint] : [])),
        };
      } catch {
        return unexpectedToolError();
      }
    },
  };
}

function createRunTool(orchestrator: AgentWorkflowOrchestrator): AgentWorkflowTool {
  return {
    name: 'run_fdc3_workflow',
    description:
      'Run a registered FDC3 workflow with bounded execution and receive a structured transcript and recovery guidance.',
    inputSchema: RUN_SCHEMA,
    execute: async (value, context = {}) => {
      const request = parseWorkflowRequest(value);
      if ('code' in request) {
        return toolError(request);
      }
      try {
        const transcript = await orchestrator.execute(request.workflowId, request.input, {
          signal: context.signal,
          onEvent: context.onProgress,
        });
        return {
          ok: transcript.status === 'success',
          kind: 'workflow-run',
          transcript,
          failures: transcript.failures,
          recoveryActions: recoveryActions(transcript),
        };
      } catch {
        return unexpectedToolError();
      }
    },
  };
}

export function createWorkflowAgentToolkit(
  orchestrator: AgentWorkflowOrchestrator,
): WorkflowAgentToolkit {
  const tools = [
    createListTool(orchestrator),
    createInspectTool(orchestrator),
    createRunTool(orchestrator),
  ];
  return {
    tools,
    getTool: (name) => tools.find((tool) => tool.name === name),
  };
}
