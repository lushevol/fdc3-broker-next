import type { Toolkit } from '@assistant-ui/react';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ZodTypeAny } from 'zod';

type AssistantJsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: AssistantJsonValue }
  | AssistantJsonValue[];

export type AssistantToolArgs = Record<string, AssistantJsonValue>;

export interface AssistantToolMatch {
  args: AssistantToolArgs;
  confidence?: number;
}

export interface AssistantToolInvocation {
  toolName: string;
  args: AssistantToolArgs;
  debug: AssistantToolResolutionDebug;
}

export interface AssistantToolMetadata {
  toolName: string;
  hasPromptMatcher: boolean;
  matchPriority: number;
  humanInTheLoop: boolean;
}

export interface FrontendToolManifestEntry {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  humanInTheLoop: boolean;
  hasRender: boolean;
}

export interface AssistantToolResolutionDebug {
  toolName: string;
  input: string;
  priority: number;
  confidence: number;
}

export type AssistantRegisteredTool = Toolkit[string] & {
  matchPrompt?: (input: string) => AssistantToolArgs | AssistantToolMatch | null;
  matchPriority?: number;
  humanInTheLoop?: boolean;
  renderOnly?: boolean;
};

type AssistantToolExecutionContext = Parameters<NonNullable<AssistantRegisteredTool['execute']>>[1];

export type AssistantRegisteredToolkit = Record<string, AssistantRegisteredTool>;

export function mergeRegisteredToolkits(
  toolkits: readonly AssistantRegisteredToolkit[],
): AssistantRegisteredToolkit {
  const mergedToolkit: AssistantRegisteredToolkit = {};
  const duplicateToolNames = new Set<string>();

  toolkits.forEach((toolkit) => {
    Object.entries(toolkit).forEach(([toolName, toolDefinition]) => {
      if (toolName in mergedToolkit) {
        duplicateToolNames.add(toolName);
      }

      mergedToolkit[toolName] = toolDefinition;
    });
  });

  if (duplicateToolNames.size > 0 && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `Duplicate assistant tool registration: ${Array.from(duplicateToolNames).sort().join(', ')}`,
    );
  }

  return mergedToolkit;
}

function isZodSchema(value: unknown): value is ZodTypeAny {
  return typeof value === 'object' && value !== null && '_def' in value && 'parse' in value;
}

function normalizeManifestSchema(schema: unknown): Record<string, unknown> {
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
    return { type: 'object' };
  }

  return schema as Record<string, unknown>;
}

function toFrontendManifestSchema(parameters: unknown, toolName: string): Record<string, unknown> {
  if (isZodSchema(parameters)) {
    const jsonSchema = zodToJsonSchema(parameters, {
      name: `${toolName}Parameters`,
      $refStrategy: 'none',
    });

    if (
      typeof jsonSchema === 'object' &&
      jsonSchema !== null &&
      'definitions' in jsonSchema &&
      typeof jsonSchema.definitions === 'object' &&
      jsonSchema.definitions !== null &&
      !Array.isArray(jsonSchema.definitions)
    ) {
      const definitionEntries = Object.values(jsonSchema.definitions);
      if (definitionEntries.length > 0) {
        return normalizeManifestSchema(definitionEntries[0]);
      }
    }

    return normalizeManifestSchema(jsonSchema);
  }

  return normalizeManifestSchema(parameters);
}

export function describeAssistantToolkit(
  toolkit: AssistantRegisteredToolkit,
): AssistantToolMetadata[] {
  return Object.entries(toolkit).map(([toolName, toolDefinition]) => ({
    toolName,
    hasPromptMatcher: typeof toolDefinition.matchPrompt === 'function',
    matchPriority: toolDefinition.matchPriority ?? 0,
    humanInTheLoop: toolDefinition.humanInTheLoop ?? false,
  }));
}

export function getHumanInTheLoopToolNames(toolkit: AssistantRegisteredToolkit): string[] {
  return Object.entries(toolkit)
    .filter(([, toolDefinition]) => toolDefinition.humanInTheLoop)
    .map(([toolName]) => toolName);
}

export function getFrontendToolManifest(
  toolkit: AssistantRegisteredToolkit,
): FrontendToolManifestEntry[] {
  return Object.entries(toolkit)
    .filter(
      ([, toolDefinition]) => toolDefinition.type === 'frontend' && !toolDefinition.renderOnly,
    )
    .map(([toolName, toolDefinition]) => ({
      name: toolName,
      description: toolDefinition.description ?? '',
      inputSchema: toFrontendManifestSchema(toolDefinition.parameters, toolName),
      humanInTheLoop: toolDefinition.humanInTheLoop ?? false,
      hasRender: typeof toolDefinition.render === 'function',
    }));
}

function logAssistantToolResolution(match: {
  toolName: string;
  priority: number;
  match: AssistantToolMatch;
  input: string;
}): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.debug('[assistant-tools] resolved prompt match', {
    toolName: match.toolName,
    priority: match.priority,
    confidence: match.match.confidence ?? 0,
    input: match.input,
  });
}

function isAssistantToolMatch(
  match: AssistantToolArgs | AssistantToolMatch,
): match is AssistantToolMatch {
  return (
    typeof match === 'object' &&
    !Array.isArray(match) &&
    'args' in match &&
    typeof match.args === 'object' &&
    match.args !== null &&
    !Array.isArray(match.args) &&
    ('confidence' in match
      ? typeof match.confidence === 'number' || match.confidence === undefined
      : true)
  );
}

function normalizeAssistantToolMatch(
  match: AssistantToolArgs | AssistantToolMatch | null,
): AssistantToolMatch | null {
  if (match === null) {
    return null;
  }

  if (isAssistantToolMatch(match)) {
    return {
      args: match.args,
      confidence: match.confidence ?? 0,
    };
  }

  return {
    args: match,
    confidence: 0,
  };
}

export function resolveAssistantToolInvocation(
  input: string,
  toolkit: AssistantRegisteredToolkit,
): AssistantToolInvocation | null {
  const matches = Object.entries(toolkit)
    .map(([toolName, toolDefinition], index) => ({
      toolName,
      index,
      match: normalizeAssistantToolMatch(toolDefinition.matchPrompt?.(input) ?? null),
      priority: toolDefinition.matchPriority ?? 0,
    }))
    .filter(
      (
        match,
      ): match is {
        toolName: string;
        index: number;
        match: AssistantToolMatch;
        priority: number;
      } => match.match !== null,
    )
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      if ((right.match.confidence ?? 0) !== (left.match.confidence ?? 0)) {
        return (right.match.confidence ?? 0) - (left.match.confidence ?? 0);
      }

      return left.index - right.index;
    });

  const bestMatch = matches[0];

  if (bestMatch) {
    logAssistantToolResolution({
      toolName: bestMatch.toolName,
      priority: bestMatch.priority,
      match: bestMatch.match,
      input,
    });

    return {
      toolName: bestMatch.toolName,
      args: bestMatch.match.args,
      debug: {
        toolName: bestMatch.toolName,
        input,
        priority: bestMatch.priority,
        confidence: bestMatch.match.confidence ?? 0,
      },
    };
  }

  return null;
}

export async function executeAssistantTool(
  toolkit: AssistantRegisteredToolkit,
  invocation: AssistantToolInvocation,
): Promise<unknown> {
  const toolDefinition = toolkit[invocation.toolName];

  if (!toolDefinition?.execute) {
    throw new Error(`Assistant tool is not executable: ${invocation.toolName}`);
  }

  return toolDefinition.execute(invocation.args, {} as AssistantToolExecutionContext);
}
