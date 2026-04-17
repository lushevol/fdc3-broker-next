import { z } from 'zod';
import type { Toolkit } from '@assistant-ui/react';
import type { ChatToolDescriptor } from '@fm/chat-protocol-contract';
import {
  AnalyticsTool,
  ApprovalConfirmTool,
  LocationResolveTool,
  ProfileLookupTool,
  ResolveRelativeDateTool,
  SummaryComposeTool,
} from '@/components/toolkit/tool-renderers';

const sharedToolDefinitions = {
  'location.resolve': {
    type: 'frontend',
    description: 'Resolve a geographic location from a query string',
    parameters: z.object({
      query: z.string().describe('City name or location query'),
    }),
    execute: async () => ({}),
    render: LocationResolveTool,
  },
  'approval.confirm': {
    type: 'human',
    description: 'Confirm a user decision before proceeding with an action',
    parameters: z.object({
      decision: z.string().describe('The decision to confirm'),
    }),
    render: ApprovalConfirmTool,
  },
  'summary.compose': {
    type: 'backend',
    description: 'Compose a concise summary from structured backend data',
    render: SummaryComposeTool,
  },
  'analytics.lookup': {
    type: 'backend',
    description: 'Lookup app analytics through the analytics MCP provider',
    render: AnalyticsTool,
  },
  statistic_count_by_app: {
    type: 'backend',
    description: 'Return PV and UV counts for an app within a time window',
    render: AnalyticsTool,
  },
  chart_by_app: {
    type: 'backend',
    description: 'Return PV and UV trend points for an app within a time window',
    render: AnalyticsTool,
  },
  'profile.lookup': {
    type: 'backend',
    description: 'Lookup a profile by user id',
    render: ProfileLookupTool,
  },
  resolve_relative_date: {
    type: 'backend',
    description: 'Resolve relative date expressions like yesterday into an ISO date',
    parameters: z.object({
      expression: z.string().describe('Relative date expression such as yesterday or last week'),
    }),
    render: ResolveRelativeDateTool,
  },
};

const presetToolNames: Record<ToolPreset, string[]> = {
  minimal: ['location.resolve'],
  full: [
    'location.resolve',
    'approval.confirm',
    'summary.compose',
    'analytics.lookup',
    'profile.lookup',
  ],
};

export const runtimeToolkit = sharedToolDefinitions as unknown as Toolkit;

export function getToolkitForPreset(_preset: ToolPreset): Toolkit {
  return runtimeToolkit;
}

export type ToolPreset = 'minimal' | 'full';

export function getToolDescriptors(preset: ToolPreset): ToolDescriptorForPanel[] {
  const toolNames = presetToolNames[preset];
  return toolNames.map((name) => {
    const definition = runtimeToolkit[name];
    return {
      name,
      source:
        definition.type === 'frontend'
          ? 'frontend'
          : definition.type === 'human'
            ? 'human'
            : 'backend',
      description: definition.description ?? '',
      parameters: extractParamInfo(definition.parameters),
    };
  });
}

export function getProtocolToolDescriptors(preset: ToolPreset): ChatToolDescriptor[] {
  return presetToolNames[preset].map((name) => {
    const definition = runtimeToolkit[name];

    return {
      name,
      source:
        definition.type === 'frontend'
          ? 'frontend'
          : definition.type === 'human'
            ? 'human'
            : 'backend',
      description: definition.description ?? '',
      parameters: extractParamInfo(definition.parameters),
    };
  });
}

type ParamInfo = Record<string, { type: string; description?: string; required: boolean }>;

function extractParamInfo(schema: unknown): ParamInfo {
  if (!schema || typeof schema !== 'object') return {};

  let shape: Record<string, unknown> | undefined;

  const s = schema as {
    _def?: { shape?: (() => Record<string, unknown>) | Record<string, unknown> };
  };
  if (typeof s._def?.shape === 'function') {
    shape = s._def.shape();
  } else if (s._def?.shape) {
    shape = s._def.shape;
  }

  if (!shape) return {};
  const result: ParamInfo = {};
  for (const [key, field] of Object.entries(shape)) {
    const f = field as { typeName?: string; description?: string; _def?: { typeName?: string } };
    const typeName = f.typeName ?? f._def?.typeName ?? 'unknown';
    const typeMap: Record<string, string> = {
      ZodString: 'string',
      ZodNumber: 'number',
      ZodBoolean: 'boolean',
      ZodArray: 'array',
      ZodObject: 'object',
      ZodEnum: 'enum',
    };
    result[key] = {
      type: typeMap[typeName] ?? 'any',
      description: f.description,
      required: true,
    };
  }
  return result;
}

export type ToolDescriptorForPanel = {
  name: string;
  source: 'frontend' | 'backend' | 'human';
  description: string;
  parameters: ParamInfo;
};
