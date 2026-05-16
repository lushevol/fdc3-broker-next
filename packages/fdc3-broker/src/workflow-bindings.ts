import type { WorkflowInputBinding, WorkflowJsonObject } from './workflow-types';

type PathSegment =
  | { type: 'field'; key: string }
  | { type: 'index'; index: number };

function isRecord(value: unknown): value is WorkflowJsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseWorkflowPath(path: string): PathSegment[] {
  if (path !== '$' && !path.startsWith('$.') && !path.startsWith('$[')) {
    throw new Error(`Invalid workflow path: ${path}`);
  }

  const segments: PathSegment[] = [];
  let cursor = 1;

  while (cursor < path.length) {
    const char = path[cursor];

    if (char === '.') {
      const start = cursor + 1;
      let end = start;
      while (end < path.length && path[end] !== '.' && path[end] !== '[') {
        end += 1;
      }
      const key = path.slice(start, end);
      if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(key)) {
        throw new Error(`Invalid workflow path field: ${path}`);
      }
      segments.push({ type: 'field', key });
      cursor = end;
      continue;
    }

    if (char === '[') {
      const end = path.indexOf(']', cursor);
      if (end === -1) {
        throw new Error(`Invalid workflow path index: ${path}`);
      }
      const rawIndex = path.slice(cursor + 1, end);
      if (!/^(0|[1-9][0-9]*)$/.test(rawIndex)) {
        throw new Error(`Invalid workflow path index: ${path}`);
      }
      segments.push({ type: 'index', index: Number(rawIndex) });
      cursor = end + 1;
      continue;
    }

    throw new Error(`Invalid workflow path syntax: ${path}`);
  }

  return segments;
}

export function readWorkflowPath(source: unknown, path: string): unknown {
  let current = source;

  for (const segment of parseWorkflowPath(path)) {
    if (segment.type === 'field') {
      if (!isRecord(current)) {
        return undefined;
      }
      current = current[segment.key];
      continue;
    }

    if (!Array.isArray(current)) {
      return undefined;
    }
    current = current[segment.index];
  }

  return current;
}

function cloneContext(context: WorkflowJsonObject): WorkflowJsonObject {
  return JSON.parse(JSON.stringify(context)) as WorkflowJsonObject;
}

function writeWorkflowPath(context: WorkflowJsonObject, path: string, value: unknown): void {
  const segments = parseWorkflowPath(path);
  if (segments.length === 0) {
    throw new Error('Cannot bind workflow value to root context');
  }

  let current: WorkflowJsonObject = context;

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    if (segment.type !== 'field') {
      throw new Error(`Workflow context path must use object fields: ${path}`);
    }

    if (isLast) {
      current[segment.key] = value;
      return;
    }

    const next = current[segment.key];
    if (!isRecord(next)) {
      current[segment.key] = {};
    }
    current = current[segment.key] as WorkflowJsonObject;
  });
}

export function applyWorkflowBindings(input: {
  baseContext: WorkflowJsonObject;
  priorResults: Map<string, unknown>;
  bindings?: WorkflowInputBinding[];
}): WorkflowJsonObject {
  const context = cloneContext(input.baseContext);

  for (const binding of input.bindings ?? []) {
    const sourceResult = input.priorResults.get(binding.fromStepId);
    const value = readWorkflowPath(sourceResult, binding.resultPath);
    if (value === undefined || value === null) {
      if (binding.required) {
        throw new Error(
          `Required workflow binding could not be resolved: ${binding.fromStepId} ${binding.resultPath}`,
        );
      }
      continue;
    }
    writeWorkflowPath(context, binding.contextPath, value);
  }

  return context;
}
