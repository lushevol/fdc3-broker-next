import { getAgentApi } from 'ratan-fdc3';
import {
  WorkflowOrchestrator,
  type JsonObject,
  type WorkflowDefinition,
  type WorkflowEvent,
  type WorkflowTranscript,
} from 'ratan-fdc3/workflow-orchestrator';
import declaredWorkflows from '../../../../../fdc3/declarations/workflows.json';

export type Fdc3WorkflowExecutorInput = {
  workflowId: string;
  input?: Record<string, unknown>;
  onEvent?: (event: WorkflowEvent) => void;
};

export type Fdc3WorkflowExecutor = {
  execute(input: Fdc3WorkflowExecutorInput): Promise<WorkflowTranscript>;
};

type DeclaredWorkflow = {
  workflowId: string;
  title: string;
  description?: string;
  inputSchema?: JsonObject;
  steps: Array<{
    id: string;
    intent: string;
    targetAppId?: string;
    contextTemplate: JsonObject;
    inputBindings?: Array<{
      fromStepId: string;
      resultPath: string;
      contextPath: string;
      required: boolean;
    }>;
  }>;
};

function convertTemplate(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/{{input\.([^}]+)}}/g, (_match, path: string) => `\${input.${path}}`);
  }
  if (Array.isArray(value)) {
    return value.map(convertTemplate);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, convertTemplate(entry)]),
    );
  }
  return value;
}

function removeJsonPathRoot(path: string): string {
  return path.replace(/^\$\.?/, '').replace(/\[([^\]]+)\]/g, '.$1');
}

function matchesInputSchema(input: JsonObject, schema: JsonObject | undefined): boolean {
  if (!schema) {
    return true;
  }
  const required = Array.isArray(schema.required) ? schema.required : [];
  if (required.some((key) => typeof key === 'string' && input[key] === undefined)) {
    return false;
  }
  const properties = schema.properties;
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) {
    return true;
  }
  return Object.entries(properties).every(([key, property]) => {
    if (
      input[key] === undefined ||
      !property ||
      typeof property !== 'object' ||
      Array.isArray(property)
    ) {
      return true;
    }
    const values = (property as JsonObject).enum;
    return !Array.isArray(values) || values.includes(input[key]);
  });
}

function applyDeclaredInputDefaults(input: JsonObject, schema: JsonObject | undefined): JsonObject {
  if (!schema || !schema.properties || typeof schema.properties !== 'object') {
    return input;
  }

  return Object.entries(schema.properties).reduce<JsonObject>(
    (resolved, [key, property]) => {
      if (
        resolved[key] !== undefined ||
        !property ||
        typeof property !== 'object' ||
        Array.isArray(property)
      ) {
        return resolved;
      }
      const definition = property as JsonObject;
      if (definition.default !== undefined) {
        resolved[key] = definition.default;
        return resolved;
      }
      const values = definition.enum;
      if (Array.isArray(values) && values.length === 1) {
        resolved[key] = values[0];
      }
      return resolved;
    },
    { ...input },
  );
}

function toStandardWorkflow(workflow: DeclaredWorkflow): WorkflowDefinition {
  return {
    workflowId: workflow.workflowId,
    title: workflow.title,
    description: workflow.description,
    inputSchema: workflow.inputSchema ?? { type: 'object' },
    validateInput: (input) => matchesInputSchema(input, workflow.inputSchema),
    steps: workflow.steps.map((step) => ({
      id: step.id,
      intent: step.intent,
      ...(step.targetAppId ? { targetAppId: step.targetAppId } : {}),
      contextTemplate: convertTemplate(step.contextTemplate) as JsonObject,
      inputBindings: step.inputBindings?.map((binding) => ({
        ...binding,
        resultPath: removeJsonPathRoot(binding.resultPath),
        contextPath: removeJsonPathRoot(binding.contextPath),
      })),
    })),
  };
}

const standardWorkflows = (declaredWorkflows as DeclaredWorkflow[]).map(toStandardWorkflow);

export function getStandardFdc3Workflows(): WorkflowDefinition[] {
  return standardWorkflows;
}

export function createFdc3WorkflowExecutor(
  deps: {
    getAgentApi?: typeof getAgentApi;
  } = {},
): Fdc3WorkflowExecutor {
  const getFdc3Api = deps.getAgentApi ?? getAgentApi;
  const orchestrator = new WorkflowOrchestrator({
    workflows: standardWorkflows,
    client: {
      raiseIntent: (intent, context, target) =>
        getFdc3Api().raiseIntent(intent, context as never, target),
    },
  });

  return {
    async execute(input) {
      const declaredWorkflow = standardWorkflows.find(
        (workflow) => workflow.workflowId === input.workflowId,
      );
      const resolvedInput = applyDeclaredInputDefaults(
        input.input ?? {},
        declaredWorkflow?.inputSchema,
      );

      return orchestrator.execute(input.workflowId, resolvedInput, {
        onEvent: input.onEvent,
      });
    },
  };
}
