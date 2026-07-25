import type {
  JsonObject,
  WorkflowDefinition,
  WorkflowInputBinding,
  WorkflowStepDefinition,
} from './types';

const INPUT_EXPRESSION = /^\$\{input\.([^}]+)\}$/;
const EMBEDDED_INPUT_EXPRESSION = /\$\{input\.([^}]+)\}/g;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readPath(value: unknown, path: string): unknown {
  if (path.length === 0) {
    return value;
  }
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!isObject(current)) {
      return undefined;
    }
    return current[segment];
  }, value);
}

function writePath(target: JsonObject, path: string, value: unknown): void {
  const segments = path.split('.');
  let current = target;
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      current[segment] = value;
      return;
    }
    const child = current[segment];
    if (!isObject(child)) {
      current[segment] = {};
    }
    current = current[segment] as JsonObject;
  });
}

function renderValue(value: unknown, input: JsonObject): unknown {
  if (typeof value === 'string') {
    const exactMatch = INPUT_EXPRESSION.exec(value);
    if (exactMatch) {
      const resolved = readPath(input, exactMatch[1]);
      if (resolved === undefined) {
        throw new Error(`Missing workflow input: ${exactMatch[1]}`);
      }
      return resolved;
    }
    return value.replace(EMBEDDED_INPUT_EXPRESSION, (_expression, path: string) => {
      const resolved = readPath(input, path);
      if (resolved === undefined) {
        throw new Error(`Missing workflow input: ${path}`);
      }
      return String(resolved);
    });
  }
  if (Array.isArray(value)) {
    return value.map((entry) => renderValue(entry, input));
  }
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, renderValue(entry, input)]),
    );
  }
  return value;
}

export function renderContext(template: JsonObject, input: JsonObject): JsonObject {
  return renderValue(template, input) as JsonObject;
}

export function applyBindings(
  context: JsonObject,
  bindings: WorkflowInputBinding[] | undefined,
  results: Map<string, unknown>,
): JsonObject {
  const bound = structuredClone(context);
  for (const binding of bindings ?? []) {
    const source = results.get(binding.fromStepId);
    const value = readPath(source, binding.resultPath);
    if (value === undefined) {
      if (binding.required) {
        throw new Error(
          `Required result ${binding.fromStepId}.${binding.resultPath} is unavailable`,
        );
      }
      continue;
    }
    writePath(bound, binding.contextPath, value);
  }
  return bound;
}

function validateStep(step: WorkflowStepDefinition, priorStepIds: Set<string>): void {
  if (!step.id.trim() || !step.intent.trim()) {
    throw new Error('Workflow steps require non-empty id and intent');
  }
  if (step.timeoutMs !== undefined && step.timeoutMs <= 0) {
    throw new Error(`Workflow step ${step.id} timeout must be positive`);
  }
  if (step.retry && step.retry.maxAttempts < 1) {
    throw new Error(`Workflow step ${step.id} retry maxAttempts must be at least one`);
  }
  for (const binding of step.inputBindings ?? []) {
    if (!priorStepIds.has(binding.fromStepId)) {
      throw new Error(
        `Workflow step ${step.id} binding references unknown or later step ${binding.fromStepId}`,
      );
    }
  }
}

export function validateWorkflowDefinition(workflow: WorkflowDefinition): void {
  if (!workflow.workflowId.trim() || !workflow.title.trim()) {
    throw new Error('Workflow requires non-empty workflowId and title');
  }
  if (workflow.steps.length === 0) {
    throw new Error(`Workflow ${workflow.workflowId} must contain at least one step`);
  }
  const stepIds = new Set<string>();
  for (const step of workflow.steps) {
    if (stepIds.has(step.id)) {
      throw new Error(`Workflow ${workflow.workflowId} has duplicate step id ${step.id}`);
    }
    validateStep(step, stepIds);
    stepIds.add(step.id);
  }
}
