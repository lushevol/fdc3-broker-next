import { readWorkflowPath } from './workflow-bindings';
import type { WorkflowJsonObject } from './workflow-types';

const INPUT_PLACEHOLDER_PATTERN = /^\{\{input(\.[A-Za-z_][A-Za-z0-9_-]*)+\}\}$/;

function isRecord(value: unknown): value is WorkflowJsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function renderValue(value: unknown, input: WorkflowJsonObject): unknown {
  if (typeof value === 'string') {
    if (!INPUT_PLACEHOLDER_PATTERN.test(value)) {
      return value;
    }

    const inputPath = `$${value.slice('{{input'.length, -'}}'.length)}`;
    return readWorkflowPath(input, inputPath);
  }

  if (Array.isArray(value)) {
    return value.map((item) => renderValue(item, input));
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, renderValue(nested, input)]),
    );
  }

  return value;
}

export function renderWorkflowContextTemplate(
  template: WorkflowJsonObject,
  input: WorkflowJsonObject,
): WorkflowJsonObject {
  const rendered = renderValue(template, input);
  if (!isRecord(rendered)) {
    throw new Error('Workflow context template must render to an object');
  }
  return rendered;
}
