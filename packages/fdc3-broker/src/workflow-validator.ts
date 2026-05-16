import { parseWorkflowPath } from './workflow-bindings';
import type { WorkflowDefinition } from './workflow-types';

export type WorkflowValidationResult =
  | { valid: true }
  | { valid: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function invalid(error: string): WorkflowValidationResult {
  return { valid: false, error };
}

export function validateWorkflowDefinition(
  definition: WorkflowDefinition,
): WorkflowValidationResult {
  if (!definition.workflowId || !definition.workflowId.trim()) {
    return invalid('Workflow id is required');
  }

  if (!isRecord(definition.inputSchema) || definition.inputSchema.type !== 'object') {
    return invalid(`Workflow ${definition.workflowId} inputSchema must be an object schema`);
  }

  if (!Array.isArray(definition.steps) || definition.steps.length === 0) {
    return invalid(`Workflow ${definition.workflowId} must include at least one step`);
  }

  const seenStepIds = new Set<string>();
  const stepIndexes = new Map<string, number>();

  for (const [index, step] of definition.steps.entries()) {
    if (!step.id || !step.id.trim()) {
      return invalid(`Workflow ${definition.workflowId} has a step without an id`);
    }
    if (seenStepIds.has(step.id)) {
      return invalid(`Workflow ${definition.workflowId} has duplicate step id ${step.id}`);
    }
    seenStepIds.add(step.id);
    stepIndexes.set(step.id, index);

    if (!step.intent || !step.intent.trim()) {
      return invalid(`Workflow step ${step.id} must include an intent`);
    }

    if (!isRecord(step.contextTemplate)) {
      return invalid(`Workflow step ${step.id} contextTemplate must be an object`);
    }
  }

  for (const [index, step] of definition.steps.entries()) {
    for (const binding of step.inputBindings ?? []) {
      const sourceIndex = stepIndexes.get(binding.fromStepId);
      if (sourceIndex === undefined) {
        return invalid(`Workflow step ${step.id} binding references unknown step ${binding.fromStepId}`);
      }

      if (sourceIndex >= index) {
        return invalid(`Workflow step ${step.id} binding references a same or future step`);
      }

      try {
        parseWorkflowPath(binding.resultPath);
        parseWorkflowPath(binding.contextPath);
      } catch (error) {
        return invalid(error instanceof Error ? error.message : 'Invalid workflow binding path');
      }
    }
  }

  return { valid: true };
}
